// Framework-agnostic web build output discovery.
// No hardcoded assumptions about TanStack/Nitro/Vite output paths.
// Scans candidate dirs, scores them, returns the best match.
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

// Candidates checked in preference order. Extend freely — scoring picks best.
const CANDIDATE_DIRS = [
  "dist/client",
  ".output/public",
  "dist",
  "build",
  "out",
  "public/build",
];

async function pathExists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function statSafe(p) {
  try { return await stat(p); } catch { return null; }
}

async function readDirSafe(p) {
  try { return await readdir(p); } catch { return []; }
}

// Try to read vite/tanstack config output dirs. Best-effort, non-fatal.
async function extraCandidatesFromConfig(root) {
  const extra = [];
  const files = ["vite.config.ts", "vite.config.js", "vite.config.mjs"];
  for (const f of files) {
    const full = path.join(root, f);
    if (!(await pathExists(full))) continue;
    try {
      const src = await readFile(full, "utf8");
      const outDirMatch = src.match(/outDir\s*:\s*["'`]([^"'`]+)["'`]/);
      if (outDirMatch) extra.push(outDirMatch[1]);
      const publicDirMatch = src.match(/publicDir\s*:\s*["'`]([^"'`]+)["'`]/);
      if (publicDirMatch) extra.push(publicDirMatch[1]);
    } catch {}
  }
  return extra;
}

async function scoreCandidate(root, rel) {
  const dir = path.resolve(root, rel);
  const st = await statSafe(dir);
  if (!st || !st.isDirectory()) return null;

  const entries = await readDirSafe(dir);
  if (entries.length === 0) return null;

  const hasIndex = entries.includes("index.html");
  const assetsDir = path.join(dir, "assets");
  const assetsSt = await statSafe(assetsDir);
  const hasAssets = assetsSt && assetsSt.isDirectory();
  const assetFiles = hasAssets ? await readDirSafe(assetsDir) : [];

  const jsFiles = assetFiles.filter((f) => f.endsWith(".js"));
  const cssFiles = assetFiles.filter((f) => f.endsWith(".css"));

  if (!hasIndex && jsFiles.length === 0) return null;

  // mtime — favour freshest build
  let mtime = st.mtimeMs;
  for (const f of jsFiles.slice(0, 5)) {
    const s = await statSafe(path.join(assetsDir, f));
    if (s && s.mtimeMs > mtime) mtime = s.mtimeMs;
  }

  // Score: has-assets(4) + has-js(3) + has-css(2) + has-index(1)
  const score =
    (hasAssets ? 4 : 0) + (jsFiles.length ? 3 : 0) + (cssFiles.length ? 2 : 0) + (hasIndex ? 1 : 0);

  // Pick best entry chunk (largest JS with common entry name prefixes, else newest)
  let entryJs = null;
  if (jsFiles.length) {
    const scored = await Promise.all(
      jsFiles.map(async (f) => {
        const s = await statSafe(path.join(assetsDir, f));
        const prefBonus = /^(index|entry|main|client|app)-/.test(f) ? 1_000_000 : 0;
        return { f, size: (s?.size || 0) + prefBonus, mtime: s?.mtimeMs || 0 };
      }),
    );
    scored.sort((a, b) => b.size - a.size || b.mtime - a.mtime);
    entryJs = scored[0].f;
  }

  let entryCss = null;
  if (cssFiles.length) {
    const scored = await Promise.all(
      cssFiles.map(async (f) => {
        const s = await statSafe(path.join(assetsDir, f));
        return { f, size: s?.size || 0 };
      }),
    );
    scored.sort((a, b) => b.size - a.size);
    entryCss = scored[0].f;
  }

  return {
    dir,
    rel,
    score,
    mtime,
    hasIndex,
    hasAssets: !!hasAssets,
    entryJs,
    entryCss,
    jsCount: jsFiles.length,
    cssCount: cssFiles.length,
  };
}

export async function discoverWebOutput(root = process.cwd()) {
  const configCandidates = await extraCandidatesFromConfig(root);
  const all = Array.from(new Set([...CANDIDATE_DIRS, ...configCandidates]));

  const results = [];
  const attempts = [];
  for (const rel of all) {
    const r = await scoreCandidate(root, rel);
    if (r) results.push(r);
    else attempts.push({ rel, ok: false });
  }

  if (results.length === 0) {
    const err = new Error(
      `Could not detect web build output. Tried:\n` +
        all.map((c) => `  - ${c}`).join("\n") +
        `\nRun \`vite build\` first, or add a new candidate to scripts/lib/discover-web-output.mjs`,
    );
    err.attempts = attempts;
    throw err;
  }

  // Prefer highest score, break ties by newest mtime.
  results.sort((a, b) => b.score - a.score || b.mtime - a.mtime);
  const best = results[0];

  return {
    dir: best.dir,
    rel: best.rel,
    indexHtml: path.join(best.dir, "index.html"),
    assetsDir: path.join(best.dir, "assets"),
    entryJs: best.entryJs ? `/assets/${best.entryJs}` : null,
    entryCss: best.entryCss ? `/assets/${best.entryCss}` : null,
    hasIndex: best.hasIndex,
    source: results.length > 1 ? "detected" : "detected",
    candidates: results.map((r) => ({ rel: r.rel, score: r.score })),
  };
}



export async function readFrameworkVersions(root = process.cwd()) {
  try {
    const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
    const all = { ...pkg.dependencies, ...pkg.devDependencies };
    return {
      "@tanstack/react-start": all["@tanstack/react-start"],
      "@tanstack/react-router": all["@tanstack/react-router"],
      vite: all.vite,
      nitro: all.nitro,
      "@capacitor/core": all["@capacitor/core"],
      "@capacitor/android": all["@capacitor/android"],
    };
  } catch {
    return {};
  }
}
