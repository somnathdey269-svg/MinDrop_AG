import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// TanStack Start's SPA-mode prerender invokes fetch through the preview
// server plugin with only `(request)` — no Cloudflare env, no execution
// context. The generated Cloudflare Worker handler synchronously reads
// `env.ASSETS.fetch(...)` for static asset passthrough, so we stub a
// minimal ASSETS binding that returns 404. That's fine for prerender: the
// only URL we ever fetch is `/`, which the app handles directly, and
// static asset requests never happen during shell rendering.
const PRERENDER_ASSETS_STUB = {
  ASSETS: {
    fetch: async () => new Response(null, { status: 404 }),
  },
} as const;

const PRERENDER_CTX_STUB = {
  waitUntil: () => {},
  passThroughOnException: () => {},
} as const;

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const safeEnv = (env ?? PRERENDER_ASSETS_STUB) as Record<string, unknown>;
    const safeCtx = (ctx ?? PRERENDER_CTX_STUB) as unknown;
    // Under SPA-mode prerender the preview server hands us a Node/undici
    // Request. The generated Cloudflare Worker handler mutates the request
    // (adds headers for asset lookups), which throws on undici's immutable
    // guard. Rebuild a mutable Request when no env is present (i.e. we're
    // running under the Node preview server, not workerd).
    const effectiveRequest =
      env === undefined
        ? new Request(request.url, {
            method: request.method,
            headers: new Headers(request.headers),
            body:
              request.method === "GET" || request.method === "HEAD"
                ? undefined
                : request.body,
            // @ts-expect-error duplex is required for streaming bodies on Node
            duplex: "half",
          })
        : request;
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(effectiveRequest, safeEnv, safeCtx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      // Surface the real reason during prerender — SPA prerender swallows
      // the response body, so we also log to /tmp for the terminal.
      console.error("[mindrop-ssr] fetch failed:", error);
      try {
        const fs = await import("node:fs");
        fs.appendFileSync(
          "/tmp/mindrop-ssr-error.log",
          `\n[${new Date().toISOString()}] ${(error as Error)?.stack ?? String(error)}\n`,
        );
      } catch {}
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

  },
};



