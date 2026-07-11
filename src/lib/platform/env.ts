// Platform detection — the single source of truth for "am I running natively?".
// Everything else in the app should call these helpers instead of touching
// Capacitor globals or reading window.matchMedia directly.
//
// SSR-safe: every helper checks `typeof window` first and returns a sensible
// default when called on the server (during Nitro/Worker SSR).

let cachedNative: boolean | null = null;

function detectNative(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } })
      .Capacitor;
    if (cap && typeof cap.isNativePlatform === "function" && cap.isNativePlatform()) return true;

    const params = new URLSearchParams(window.location.search);
    if (params.get("native") === "1") return true;

    if (window.matchMedia?.("(display-mode: standalone)")?.matches) return true;
    if ((window.navigator as unknown as { standalone?: boolean }).standalone === true) return true;
  } catch {
    /* ignore */
  }
  return false;
}

export function isNative(): boolean {
  if (cachedNative) return true;
  const detected = detectNative();
  if (detected) {
    cachedNative = true;
    return true;
  }
  return false;
}

export function isWeb(): boolean {
  return !isNative();
}

export function isCapacitor(): boolean {
  if (typeof window === "undefined") return false;
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return !!(cap && typeof cap.isNativePlatform === "function" && cap.isNativePlatform());
}

function platformString(): "ios" | "android" | "web" {
  if (typeof window === "undefined") return "web";
  const cap = (window as unknown as { Capacitor?: { getPlatform?: () => string } }).Capacitor;
  const p = cap?.getPlatform?.();
  if (p === "ios" || p === "android") return p;
  return "web";
}

export function isAndroid(): boolean {
  return platformString() === "android";
}

export function isIOS(): boolean {
  return platformString() === "ios";
}

// Back-compat with the previous helper name — `isNativeApp()` is used
// throughout the codebase. New code should prefer `isNative()`.
export const isNativeApp = isNative;
