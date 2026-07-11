// Platform abstraction layer — see docs/CAPACITOR_ARCHITECTURE.md.
//
// Rule of thumb: application code should NEVER import from `@capacitor/*`
// directly. Import from `@/lib/platform` instead so the same call works on
// web (SSR + browser) and inside the Android WebView.

export { isNative, isWeb, isAndroid, isIOS, isCapacitor, isNativeApp } from "./env";
export { serverApi, installNativeApiForwarder } from "./serverApi";
export { storage } from "./storage";
