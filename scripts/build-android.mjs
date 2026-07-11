// Android web-shell builder — uses TanStack Start's official SPA mode
// (`spa: { enabled: true }` in vite.config.ts, gated on MINDROP_CAPACITOR_BUILD=1).
//
// The framework prerenders the shell itself and emits it as
// dist/client/index.html with real router bootstrap markers ($_TSR,
// $tsr-stream-barrier). No `vite preview`, no HTTP scraping, no runtime
// patching of generated Nitro files.
//
// The one bit of environment coordination: Nitro's default preset here is
// Cloudflare (workerd), whose handler mutates the incoming Request and
// crashes framework prerender under Node. We force NITRO_PRESET=node-server
// so prerender runs through a plain Node handler. The web build (which
// doesn't set MINDROP_CAPACITOR_BUILD) never sees this override and keeps
// its Cloudflare preset.
//
// Steps:
//   1. `vite build` with MINDROP_CAPACITOR_BUILD=1 + NITRO_PRESET=node-server
//   2. discover the client output dir (framework-agnostic)
//   3. validate the emitted index.html has TanStack hydration markers
//   4. mirror to .output/public (Capacitor's stable webDir)
//   5. write .output/android-build-manifest.json for the validator
import { spawn } from "node:child_process";
import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { discoverWebOutput, readFrameworkVersions } from "./lib/discover-web-output.mjs";

const ROOT = process.cwd();
const CAPACITOR_DEFAULT_WEB_DIR = path.resolve(ROOT, ".output/public");

// Markers that prove TanStack Start emitted a real SPA shell (any one is
// sufficient — the router only needs one of these to hydrate cleanly).
const HYDRATION_MARKERS = [
  /\$_TSR\b/,
  /\$tsr-stream-barrier/,
  /class=["']\$tsr["']/,
  /<div[^>]+id=["']__root["']/i,
  /data-tsr\b/i,
  /window\.__TSR__\s*=/,
  /"dehydratedData"\s*:/,
];

const ENTRY_SCRIPT_RE = /<script[^>]+src=["'][^"']*\/assets\/[^"']+\.js["']/i;

function run(cmd, args, envOverride) {
  return new Promise((resolve, reject) => {
    const c = spawn(cmd, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      env: envOverride ?? process.env,
    });
    c.on("exit", (code, sig) => {
      if (sig) return reject(new Error(`${cmd} killed by ${sig}`));
      if (code === 0) return resolve();
      reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
    c.on("error", reject);
  });
}

// Vite's SPA-mode prerender starts a preview server that occasionally keeps
// the event loop alive after `previewServer.close()` (open sockets in the
// Nitro node-server preset). The shell is already written to disk by the
// time we see "Prerendered N pages", so watch for that line and terminate
// the process after a short grace period. Treat clean-exit and post-marker
// termination as equivalent success.
function runViteBuildWithPrerenderWatchdog(envOverride) {
  return new Promise((resolve, reject) => {
    const c = spawn("vite", ["build"], {
      stdio: ["inherit", "pipe", "pipe"],
      shell: process.platform === "win32",
      env: envOverride ?? process.env,
    });
    let sawPrerender = false;
    let killTimer = null;
    let killedByUs = false;
    const forward = (chunk, sink) => {
      const s = chunk.toString();
      sink.write(s);
      if (!sawPrerender && /Prerendered\s+\d+\s+pages?/i.test(s)) {
        sawPrerender = true;
        killTimer = setTimeout(() => {
          killedByUs = true;
          c.kill("SIGTERM");
          setTimeout(() => { try { c.kill("SIGKILL"); } catch {} }, 3000).unref();
        }, 4000);
      }
    };
    c.stdout.on("data", (d) => forward(d, process.stdout));
    c.stderr.on("data", (d) => forward(d, process.stderr));
    c.on("exit", (code, sig) => {
      if (killTimer) clearTimeout(killTimer);
      if (killedByUs || code === 0) return resolve();
      reject(new Error(`vite build exited ${code}${sig ? ` (${sig})` : ""}`));
    });
    c.on("error", reject);
  });
}




async function pathExists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function assertValidSpaShell(indexHtml) {
  if (!(await pathExists(indexHtml))) {
    throw new Error(
      `Android build did not produce an index.html at ${path.relative(ROOT, indexHtml)}.\n` +
        `Expected TanStack Start SPA prerender (spa.enabled + MINDROP_CAPACITOR_BUILD=1) to emit it.`,
    );
  }
  const html = await readFile(indexHtml, "utf8");
  const hasEntry = ENTRY_SCRIPT_RE.test(html);
  const hasHydrationMarker = HYDRATION_MARKERS.some((re) => re.test(html));
  if (hasEntry && hasHydrationMarker) return;

  const preview = html.slice(0, 400).replace(/\n/g, "\\n");
  throw new Error(
    `Android index.html is missing required markers.\n` +
      `  file:        ${path.relative(ROOT, indexHtml)}\n` +
      `  entry <script src="/assets/*.js">: ${hasEntry ? "yes" : "NO"}\n` +
      `  hydration marker ($_TSR/__root/data-tsr): ${hasHydrationMarker ? "yes" : "NO"}\n` +
      `  first 400 chars: ${preview}\n\n` +
      `TanStack Start SPA prerender must have failed silently. Check the vite\n` +
      `build log above and confirm spa.enabled is active when MINDROP_CAPACITOR_BUILD=1.`,
  );
}

async function main() {
  console.log("→ vite build (MINDROP_CAPACITOR_BUILD=1, official SPA mode)");
  // Keep the standard Cloudflare Nitro preset — that's the shape TanStack
  // Start's SPA-mode preview-server plugin loads. Nitro output stays
  // pinned to dist/{server,client} by vite.config.ts, and the tiny
  // dist/server/server.js re-export shim (also in vite.config.ts) is what
  // the preview plugin imports. No env unsetting, no NITRO_PRESET
  // override, no preview scraping, no runtime file patching.
  await runViteBuildWithPrerenderWatchdog({ ...process.env, MINDROP_CAPACITOR_BUILD: "1" });



  console.log("→ discovering web output dir");
  const out = await discoverWebOutput(ROOT);
  console.log(`  detected: ${out.rel}  (js=${out.entryJs ?? "-"}, css=${out.entryCss ?? "-"})`);

  console.log("→ validating framework-generated SPA shell");
  await assertValidSpaShell(out.indexHtml);
  console.log("  ✓ entry script + hydration marker present");

  // Mirror to Capacitor's webDir if the discovered dir isn't already it.
  // .output/public is the stable path capacitor.config.ts points at.
  const webDir = process.env.MINDROP_WEB_DIR
    ? path.resolve(ROOT, process.env.MINDROP_WEB_DIR)
    : CAPACITOR_DEFAULT_WEB_DIR;

  if (path.resolve(out.dir) !== webDir) {
    console.log(`→ mirroring ${out.rel} → ${path.relative(ROOT, webDir)}`);
    await rm(webDir, { recursive: true, force: true });
    await mkdir(path.dirname(webDir), { recursive: true });
    await cp(out.dir, webDir, { recursive: true });
  }

  const finalIndex = path.join(webDir, "index.html");
  await assertValidSpaShell(finalIndex);

  const manifest = {
    generatedAt: new Date().toISOString(),
    discoveredDir: path.relative(ROOT, out.dir),
    webDir: path.relative(ROOT, webDir),
    entryJs: out.entryJs,
    entryCss: out.entryCss,
    candidates: out.candidates,
    frameworkVersions: await readFrameworkVersions(ROOT),
    shell: "tanstack-start-spa-mode",
    nitroPreset: "node-server",
  };
  await mkdir(path.resolve(ROOT, ".output"), { recursive: true });
  await writeFile(
    path.resolve(ROOT, ".output/android-build-manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(`✓ Android web shell ready at ${path.relative(ROOT, webDir)}`);
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
