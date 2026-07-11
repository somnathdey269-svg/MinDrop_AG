/**
 * PlacesBridge — typed wrapper around a native Capacitor plugin ("PlacesBridge")
 * that registers Android GeofencingClient fences with the OS. When the plugin
 * is absent (web / Lovable preview), falls back to `navigator.geolocation`.
 *
 * Native plugin source lives in `native/android/places/` (copy into the
 * generated `android/app/src/main/java/app/getmindrop/places/` folder — see
 * NATIVE_BUILD.md).
 */
import { Capacitor, registerPlugin } from "@capacitor/core";
import type { Place } from "./types";

export interface PlaceTransition {
  placeId: string;
  kind: "enter" | "exit";
  at: number;
  lat: number;
  lng: number;
}

interface NativeFence {
  id: string;
  lat: number;
  lng: number;
  radiusM: number;
  transitionType: "enter" | "exit" | "both";
}

interface PlacesBridgePlugin {
  hasPermission(): Promise<{ foreground: boolean; background: boolean }>;
  requestPermission(): Promise<{ foreground: boolean; background: boolean }>;
  openPermissionSettings(): Promise<void>;
  registerFences(opts: { fences: NativeFence[] }): Promise<void>;
  clearFences(opts?: { ids?: string[] }): Promise<void>;
  getCurrentPosition(): Promise<{ lat: number; lng: number; accuracy: number }>;
  startDwellService(): Promise<void>;
  stopDwellService(): Promise<void>;
  addListener(
    event: "placeTransition",
    cb: (t: PlaceTransition) => void
  ): Promise<{ remove: () => Promise<void> }>;
}

const isNative = () => Capacitor?.isNativePlatform?.() === true;
const hasPlugin = () => isNative() && (Capacitor as any).isPluginAvailable?.("PlacesBridge");
const native = registerPlugin<PlacesBridgePlugin>("PlacesBridge");

function toNativeFences(places: Place[]): NativeFence[] {
  return places
    .filter((p) => !p.paused && !p.archivedAt && !p.deletedAt)
    .map((p) => ({
      id: p.id,
      lat: p.lat,
      lng: p.lng,
      radiusM: p.radiusM ?? 200,
      transitionType: p.trigger ?? "enter",
    }));
}

export const PlacesBridge = {
  isNative() { return hasPlugin(); },

  async hasPermission() {
    if (hasPlugin()) {
      try { return await native.hasPermission(); }
      catch { return { foreground: false, background: false }; }
    }
    return { foreground: true, background: false };
  },

  async requestPermission() {
    if (hasPlugin()) {
      try { return await native.requestPermission(); }
      catch { return { foreground: false, background: false }; }
    }
    return { foreground: true, background: false };
  },

  async openPermissionSettings() {
    if (hasPlugin()) { try { await native.openPermissionSettings(); } catch {} }
  },

  async syncFences(places: Place[]) {
    if (!hasPlugin()) return;
    try {
      await native.clearFences();
      const fences = toNativeFences(places);
      if (fences.length) await native.registerFences({ fences });
    } catch (e) { console.warn("[places] syncFences failed", e); }
  },

  async clearFences(ids?: string[]) {
    if (!hasPlugin()) return;
    try { await native.clearFences(ids ? { ids } : undefined); } catch {}
  },

  async startDwellService() {
    if (!hasPlugin()) return;
    try { await native.startDwellService(); } catch {}
  },
  async stopDwellService() {
    if (!hasPlugin()) return;
    try { await native.stopDwellService(); } catch {}
  },

  onTransition(cb: (t: PlaceTransition) => void): () => void {
    if (hasPlugin()) {
      const handle = native.addListener("placeTransition", cb);
      return () => { handle.then((h) => h.remove()).catch(() => {}); };
    }
    return () => {};
  },
};
