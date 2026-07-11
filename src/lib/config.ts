// Single source of truth for environment-driven origins.
//
// Reads from Vite's `import.meta.env` so the same code works in
// local dev, staging, and production without hardcoding.
//
// Configure via `.env` / `.env.production` / `.env.staging`:
//   VITE_WEB_ORIGIN=https://mindrop.in           # canonical marketing site
//   VITE_API_ORIGIN=https://mindrop.in           # server-fn / webhook host
//
// Both fall back to the production origin so a missing env var never
// takes the app offline.

const PROD_ORIGIN = "https://mindrop.in";

function readEnv(key: string): string | undefined {
  try {
    const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    const v = env?.[key];
    return v && v.trim() ? v.trim() : undefined;
  } catch {
    return undefined;
  }
}

function normalize(url: string): string {
  return url.replace(/\/+$/, "");
}

export const WEB_ORIGIN: string = normalize(readEnv("VITE_WEB_ORIGIN") ?? PROD_ORIGIN);
export const API_ORIGIN: string = normalize(readEnv("VITE_API_ORIGIN") ?? WEB_ORIGIN);
