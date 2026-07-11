// Server-function base URL for native builds.
//
// On the web, server functions POST to same-origin `/_serverFn/*` — this is
// fine because the Cloudflare Worker serves both the HTML and the RPC endpoint
// from the same host. Inside the Android WebView the origin is
// `https://localhost` (via `androidScheme: "https"`), so a same-origin fetch
// would never leave the device.
//
// `installNativeApiForwarder()` installs a `window.fetch` wrapper that
// rewrites `/_serverFn/*` (and `/api/*`) requests to the production origin.
// It's a no-op on the web and safe to call multiple times.

import { isNative } from "./env";
import { API_ORIGIN } from "../config";

export function serverApi(): string {
  if (!isNative()) return "";
  return API_ORIGIN;
}

let installed = false;

export function installNativeApiForwarder(): void {
  if (installed) return;
  if (typeof window === "undefined") return;
  if (!isNative()) return;
  installed = true;

  const origin = serverApi();
  if (!origin) return;

  const nativeFetch = window.fetch.bind(window);

  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url = extractUrl(input);
      if (url && shouldForward(url)) {
        const forwarded = origin + url;
        if (typeof input === "string" || input instanceof URL) {
          return nativeFetch(forwarded, init);
        }
        // Request object — reconstruct with the forwarded URL to preserve
        // method/headers/body/signal.
        return nativeFetch(new Request(forwarded, input as Request), init);
      }
    } catch {
      /* fall through to untouched fetch */
    }
    return nativeFetch(input as RequestInfo, init);
  }) as typeof window.fetch;
}

function extractUrl(input: RequestInfo | URL): string | null {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.pathname + input.search;
  if (typeof Request !== "undefined" && input instanceof Request) {
    try {
      const u = new URL(input.url);
      return u.pathname + u.search;
    } catch {
      return input.url;
    }
  }
  return null;
}

function shouldForward(url: string): boolean {
  // Only forward same-origin absolute paths — never rewrite absolute URLs
  // (Supabase, Google, etc. must go direct).
  if (!url.startsWith("/")) return false;
  if (url.startsWith("//")) return false;
  return url.startsWith("/_serverFn/") || url.startsWith("/api/");
}
