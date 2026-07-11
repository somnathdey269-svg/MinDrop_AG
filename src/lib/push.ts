// Unified push enablement: uses native @capacitor-firebase/messaging when
// running inside the Android APK, else falls back to Firebase Web SDK / VAPID.
import { Capacitor } from "@capacitor/core";
import { requestFcmToken } from "@/lib/firebase";

export type EnableResult = { ok: boolean; token?: string; platform: "web" | "android" | "ios"; error?: string };

export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

export function nativePlatform(): "android" | "ios" | null {
  const p = Capacitor.getPlatform();
  if (p === "android" || p === "ios") return p;
  return null;
}

export async function enablePush(vapidKey: string): Promise<EnableResult> {
  const nat = nativePlatform();
  if (nat) {
    // Dynamic import so the web bundle doesn't try to load the native plugin.
    const { FirebaseMessaging } = await import("@capacitor-firebase/messaging");
    const perm = await FirebaseMessaging.requestPermissions();
    if (perm.receive !== "granted") {
      return { ok: false, platform: nat, error: "Permission denied" };
    }
    const { token } = await FirebaseMessaging.getToken({});
    return { ok: true, token, platform: nat };
  }

  // Web path
  const token = await requestFcmToken(vapidKey);
  if (!token) return { ok: false, platform: "web", error: "Permission denied or unsupported" };
  return { ok: true, token, platform: "web" };
}
