/**
 * Unified permission read/refresh used by both the Permissions page and the
 * SmartPermissionPrompt modal. Keeps a single source of truth for what
 * "granted" means and writes results back into the onboarding store so the
 * Settings tile hint updates automatically.
 */
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { AlarmsBridge } from "@/lib/alarms/bridge";
import { PlacesBridge } from "@/lib/places/bridge";
import { NotifyBridge } from "@/lib/notify/bridge";

export type PermStatus = "granted" | "denied" | "prompt" | "unknown";

export interface PermissionSnapshot {
  notifications: PermStatus;
  locationFg: PermStatus;
  locationBg: PermStatus;
  notificationAccess: PermStatus; // Android notification-listener
  mic: PermStatus;
  exactAlarm: PermStatus;         // Android exact alarms
  battery: PermStatus;            // ignoreBatteryOptimizations
}

export const isNative = () => Capacitor?.isNativePlatform?.() === true;
export const isAndroid = () => Capacitor?.getPlatform?.() === "android";

export async function readPermissions(): Promise<PermissionSnapshot> {
  const snap: PermissionSnapshot = {
    notifications: "unknown",
    locationFg: "unknown",
    locationBg: "unknown",
    notificationAccess: "unknown",
    mic: "unknown",
    exactAlarm: "unknown",
    battery: "unknown",
  };

  // --- Notifications ---
  try {
    if (isNative()) {
      const r = await LocalNotifications.checkPermissions();
      snap.notifications = r.display === "granted" ? "granted" : r.display === "denied" ? "denied" : "prompt";
    } else if (typeof window !== "undefined" && "Notification" in window) {
      snap.notifications = (Notification.permission as PermStatus) ?? "prompt";
    } else {
      snap.notifications = "unknown";
    }
  } catch { /* ignore */ }

  // --- Location ---
  try {
    if (isAndroid()) {
      const loc = await PlacesBridge.hasPermission();
      snap.locationFg = loc.foreground ? "granted" : "prompt";
      snap.locationBg = loc.background ? "granted" : "prompt";
    } else if (typeof navigator !== "undefined" && "permissions" in navigator) {
      try {
        const q = await navigator.permissions.query({ name: "geolocation" as PermissionName });
        snap.locationFg = q.state as PermStatus;
      } catch { snap.locationFg = "prompt"; }
      snap.locationBg = "unknown"; // web has no background location
    }
  } catch { /* ignore */ }

  // --- Notification-listener access (Android only) ---
  try {
    if (isAndroid()) {
      snap.notificationAccess = (await NotifyBridge.hasPermission()) ? "granted" : "prompt";
    }
  } catch { /* ignore */ }

  // --- Microphone ---
  try {
    if (typeof navigator !== "undefined" && "permissions" in navigator) {
      try {
        const q = await navigator.permissions.query({ name: "microphone" as PermissionName });
        snap.mic = q.state as PermStatus;
      } catch { snap.mic = "prompt"; }
    }
  } catch { /* ignore */ }

  // --- Alarms / battery (Android only) ---
  try {
    if (isAndroid()) {
      const st = await AlarmsBridge.getStatus();
      snap.exactAlarm = st.canScheduleExactAlarms ? "granted" : "prompt";
      snap.battery = st.ignoringBatteryOptimizations ? "granted" : "prompt";
    }
  } catch { /* ignore */ }

  return snap;
}

/** Compact summary used by the Settings tile ("3 of 4 granted"). */
export function summarizePermissions(s: PermissionSnapshot): string {
  const applicable: PermStatus[] = [];

  // Notifications (all platforms)
  applicable.push(s.notifications);

  // Exact alarms (Android only)
  if (isAndroid()) {
    applicable.push(s.exactAlarm);
  }

  // Ignore battery optimization (Android only)
  if (isAndroid()) {
    applicable.push(s.battery);
  }

  // Location (all platforms)
  if (isAndroid()) {
    applicable.push(s.locationFg === "granted" && s.locationBg === "granted" ? "granted" : "prompt");
  } else {
    applicable.push(s.locationFg);
  }

  // Notification Access (Android only)
  if (isAndroid()) {
    applicable.push(s.notificationAccess);
  }

  // Microphone (all platforms)
  applicable.push(s.mic);

  const granted = applicable.filter((v) => v === "granted").length;
  if (granted === 0) return "Setup needed";
  if (granted === applicable.length) return "All granted";
  return `${granted} of ${applicable.length} granted`;
}

/* ─────────────────── Just-in-time gating helpers ─────────────────── */

const ASK_KEY = (kind: string) => `mindrop.perm.lastAsk.${kind}`;
const NAG_WINDOW_MS = 24 * 60 * 60 * 1000;

/** Should we open the smart prompt for this kind right now? */
export function shouldPrompt(kind: string): boolean {
  try {
    const last = Number(window.localStorage.getItem(ASK_KEY(kind)) ?? "0");
    return !Number.isFinite(last) || Date.now() - last > NAG_WINDOW_MS;
  } catch { return true; }
}

export function markPrompted(kind: string) {
  try { window.localStorage.setItem(ASK_KEY(kind), String(Date.now())); } catch {}
}
