// Cross-platform key/value storage.
//
// Web: `localStorage` (synchronous under the hood, wrapped as async for parity).
// Native: `@capacitor/preferences` when available, transparently falling back
// to `localStorage` (Capacitor exposes a WebView localStorage on Android too).
//
// The whole app should read/write user preferences via this helper going
// forward — direct `localStorage` calls still work, but they won't survive
// a future migration to a fully sandboxed native store.

import { isCapacitor } from "./env";

type PrefsPlugin = {
  get: (opts: { key: string }) => Promise<{ value: string | null }>;
  set: (opts: { key: string; value: string }) => Promise<void>;
  remove: (opts: { key: string }) => Promise<void>;
};

let prefsPromise: Promise<PrefsPlugin | null> | null = null;

async function getPrefs(): Promise<PrefsPlugin | null> {
  if (!isCapacitor()) return null;
  if (!prefsPromise) {
    // Dynamic import via variable to keep TS from resolving the module at
    // compile time — the plugin is only present in native builds.
    const modName = "@capacitor/preferences";
    prefsPromise = (
      new Function("m", "return import(m)") as (m: string) => Promise<unknown>
    )(modName)
      .then((m) => (m as { Preferences: PrefsPlugin }).Preferences)
      .catch(() => null);
  }
  return prefsPromise;
}

export const storage = {
  async get(key: string): Promise<string | null> {
    const p = await getPrefs();
    if (p) return (await p.get({ key })).value;
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  },
  async set(key: string, value: string): Promise<void> {
    const p = await getPrefs();
    if (p) {
      await p.set({ key, value });
      return;
    }
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  },
  async remove(key: string): Promise<void> {
    const p = await getPrefs();
    if (p) {
      await p.remove({ key });
      return;
    }
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },
};
