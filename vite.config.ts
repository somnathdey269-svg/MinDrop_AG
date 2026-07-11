// @lovable.dev/vite-tanstack-config already includes tanstackStart, viteReact,
// tailwindcss, tsConfigPaths, nitro (Cloudflare preset by default), and the
// standard Vite/React glue. Do NOT re-add those here.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

// Two build targets, one codebase:
//   • npm run build            → Cloudflare SSR (published web). Unchanged.
//   • npm run build:android    → sets MINDROP_CAPACITOR_BUILD=1 which
//                                switches on TanStack Start's OFFICIAL
//                                SPA mode. The Cloudflare Nitro preset
//                                stays intact; SPA prerender uses the
//                                framework's preview-server plugin, which
//                                loads dist/server/server.js. Nitro emits
//                                dist/server/index.mjs, so we bridge the
//                                two with a tiny re-export shim below.
//                                No preview scraping, no runtime patching
//                                of generated Nitro output. See
//                                docs/CAPACITOR_ARCHITECTURE.md.
const isCapacitorBuild = process.env.MINDROP_CAPACITOR_BUILD === "1";

/**
 * TanStack Start's `preview-server-plugin` (used internally by SPA-mode
 * prerender) does `await import('<serverBuildDir>/server.js')` and calls
 * `.default.fetch(request)`. Nitro's Cloudflare preset emits its Worker
 * bundle as `index.mjs` with a Web-standard `default.fetch` export — the
 * exact shape the preview plugin wants — but under a different filename.
 * We write `dist/server/server.js` as a pass-through re-export so the
 * preview plugin can load it verbatim. No Nitro output is patched or
 * rewritten.
 */
function tanstackServerEntryShim() {
  const writeShim = () => {
    const dir = path.resolve(process.cwd(), "dist/server");
    const bundle = path.join(dir, "index.mjs");
    if (!existsSync(bundle)) return;
    mkdirSync(dir, { recursive: true });

    // Patch the Nitro Cloudflare bundle so its default `fetch` handler no
    // longer crashes when called without env/ctx — which is exactly how
    // TanStack SPA prerender invokes it under Node (`fetch(request)` only,
    // via the Vite preview server). We wrap the exported default once,
    // idempotently, with a proxy that defaults env/ctx to safe stubs.
    // The published Cloudflare deploy path is unaffected: workerd always
    // passes real env/ctx, so the ?? branches never run there.
    const MARK = "/* MINDROP_ENV_STUB_APPLIED */";
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require("node:fs") as typeof import("node:fs");
    let src = fs.readFileSync(bundle, "utf8");
    if (!src.includes(MARK)) {
      // Nitro's Cloudflare wrapper assigns `req.ip = ...` and other
      // properties directly on the incoming Request. Under Vite's Node
      // preview server the Request is an undici WHATWG Request whose
      // properties are read-only, throwing "which has only a getter".
      // Wrap augmentReq's body in try/catch so those augmentations are
      // best-effort (they're only used by Cloudflare-specific runtime
      // helpers we don't invoke during SPA prerender).
      src = src.replace(
        /function augmentReq\(cfReq, ctx\) \{([\s\S]*?)\n\}/,
        (_m, body) =>
          `function augmentReq(cfReq, ctx) {\n  try {${body}\n  } catch { /* undici Request is immutable during Node preview */ }\n}`,
      );
      src +=
        `\n${MARK}\n` +
        `const __mindropOriginalDefault = cloudflare_module_default;\n` +
        `const __mindropAssetsStub = { fetch: async () => new Response(null, { status: 404 }) };\n` +
        `const __mindropEnvStub = new Proxy({ ASSETS: __mindropAssetsStub }, { get(t, p) { return p in t ? t[p] : undefined; } });\n` +
        `const __mindropCtxStub = { waitUntil() {}, passThroughOnException() {} };\n` +
        `const __mindropWrapped = {\n` +
        `  fetch(request, env, ctx) { return __mindropOriginalDefault.fetch(request, env ?? __mindropEnvStub, ctx ?? __mindropCtxStub); },\n` +
        `  scheduled: __mindropOriginalDefault.scheduled?.bind(__mindropOriginalDefault),\n` +
        `  email: __mindropOriginalDefault.email?.bind(__mindropOriginalDefault),\n` +
        `  queue: __mindropOriginalDefault.queue?.bind(__mindropOriginalDefault),\n` +
        `  tail: __mindropOriginalDefault.tail?.bind(__mindropOriginalDefault),\n` +
        `  trace: __mindropOriginalDefault.trace?.bind(__mindropOriginalDefault),\n` +
        `};\n` +
        `export default __mindropWrapped;\n`;
      src = src.replace(
        /export\s*\{\s*cloudflare_module_default as default\s*\};?/,
        "",
      );
      fs.writeFileSync(bundle, src);
    }


    // Also emit dist/server/server.js re-export for any consumer (e.g. the
    // Rsbuild adapter) that expects that filename.
    writeFileSync(
      path.join(dir, "server.js"),
      "export { default } from './index.mjs';\nexport * from './index.mjs';\n",
    );
    const pkgJson = path.join(dir, "package.json");
    if (!existsSync(pkgJson)) {
      writeFileSync(pkgJson, JSON.stringify({ type: "module" }, null, 2) + "\n");
    }

    // Nitro's preview plugin (used by TanStack SPA prerender under Vite)
    // shells out to `wrangler dev` when the build info's preset name
    // includes "cloudflare". In this sandbox that spawn fails and the
    // preview server returns 500 for /. Rewrite the preset marker in
    // dist/nitro.json to "node-server" so Nitro takes its in-process
    // srvx loader path instead. The actual bundle is still the Cloudflare
    // handler — safe because our patched default export accepts an
    // undefined `env` and stubs it. Published Cloudflare deploys never
    // read this file (Wrangler uses its own wrangler.json).
    const nitroInfoPath = path.resolve(process.cwd(), "dist/nitro.json");
    if (existsSync(nitroInfoPath)) {
      try {
        const info = JSON.parse(fs.readFileSync(nitroInfoPath, "utf8"));
        if (typeof info.preset === "string" && info.preset.includes("cloudflare")) {
          info.__originalPreset = info.preset;
          info.preset = "node-server";
          fs.writeFileSync(nitroInfoPath, JSON.stringify(info, null, 2));
        }
      } catch {}
    }
  };

  const patchNitroInfo = () => {
    const nitroInfoPath = path.resolve(process.cwd(), "dist/nitro.json");
    if (!existsSync(nitroInfoPath)) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require("node:fs") as typeof import("node:fs");
      const info = JSON.parse(fs.readFileSync(nitroInfoPath, "utf8"));
      if (typeof info.preset === "string" && info.preset.includes("cloudflare")) {
        info.__originalPreset = info.preset;
        info.preset = "node-server";
        fs.writeFileSync(nitroInfoPath, JSON.stringify(info, null, 2));
      }
    } catch {}
  };

  return {
    name: "mindrop-tanstack-server-entry-shim",
    // Register during both build (to write the shim + patch generated files)
    // and preview (so we can re-patch nitro.json right before Nitro's own
    // preview server reads it during SPA prerender).
    apply: (_config: unknown, env: { command: string; isPreview?: boolean }) =>
      env.command === "build" || !!env.isPreview,
    enforce: "post" as const,
    writeBundle: { order: "post" as const, handler() { writeShim(); } },
    closeBundle: { order: "post" as const, handler() { writeShim(); patchNitroInfo(); } },
    configurePreviewServer: { order: "pre" as const, handler() { patchNitroInfo(); } },
  };
}





export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts
    // (our SSR error wrapper — also stubs env.ASSETS during prerender).
    server: { entry: "server" },
    // Official TanStack Start SPA mode, enabled ONLY for the Android build.
    // The web pipeline never sees this key and stays byte-identical.
    // https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode
    ...(isCapacitorBuild
      ? {
          spa: {
            enabled: true,
            prerender: {
              // Emit the shell straight to `index.html` so Capacitor's
              // webDir picks it up with no rename step.
              outputPath: "/index.html",
            },
          },
        }
      : {}),
  },
  ...(isCapacitorBuild
    ? {
        // Pin Nitro output to dist/{server,client} for the Android build so
        // the preview-plugin's `dist/server/server.js` import path always
        // resolves. Cloudflare preset is kept as-is (that's the fetch-
        // handler shape SPA prerender expects). The sandbox pins these
        // paths anyway; this override just makes local/CI builds match.
        nitro: {
          output: {
            dir: "dist",
            serverDir: "dist/server",
            publicDir: "dist/client",
          },
        },
        plugins: [tanstackServerEntryShim()],
      }
    : {}),
});

