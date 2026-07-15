/**
 * NotifyBridge — typed wrapper around the native Capacitor plugin that
 * intercepts Android notifications. On web (no plugin) it falls back to a
 * mock feed so /notify is fully usable in Lovable preview.
 *
 * Native plugin ships in `android/app/src/main/java/app/getmindrop/notify/`
 * (see NATIVE_BUILD.md). It exposes:
 *   - hasPermission(): boolean
 *   - openPermissionSettings(): void
 *   - openContactsPicker(): { name, phone? }
 *   - launchNotification({ id }): void   // re-fires stored PendingIntent
 *   - launchApp({ pkg }): void
 *   - addListener('notificationPosted', cb)
 */
import { Capacitor, registerPlugin } from "@capacitor/core";
import type { CapturedNotification } from "./types";

export interface NativeRuleSnapshot {
  id: string;
  pkg: string;
  keywords: string[];       // lowercased; empty = any (sender-mode blank match)
  priorityOnly?: boolean;
  title?: string;           // shown in the native alarm
  body?: string;            // ditto
  delivery?: "alarm" | "notification"; // native listener uses this to pick loud vs silent
  toneId?: string;          // when delivery = "alarm"
  /** "once" → archive rule after first fire and never trigger again.
   *  "always" → keep rule active; each new matching message fires the alarm. */
  frequency?: "once" | "always";
}

interface NotifyBridgePlugin {
  hasPermission(): Promise<{ granted: boolean }>;
  openPermissionSettings(): Promise<void>;
  openContactsPicker(): Promise<{ name?: string; phone?: string }>;
  launchNotification(opts: { id: string }): Promise<void>;
  launchApp(opts: { pkg: string }): Promise<void>;
  syncRules(opts: { rules: NativeRuleSnapshot[] }): Promise<void>;
  drainPendingEvents(): Promise<{ events: CapturedNotification[] }>;
  addListener(
    event: "notificationPosted",
    cb: (n: CapturedNotification) => void
  ): Promise<{ remove: () => Promise<void> }>;
}

const isNative = () => Capacitor?.isNativePlatform?.() === true;
const hasPlugin = () => isNative() && (Capacitor as any).isPluginAvailable?.("NotifyBridge");

// registerPlugin is safe on web too — it just returns a stub that rejects.
const native = registerPlugin<NotifyBridgePlugin>("NotifyBridge");

/* ─────────────────── Web mock ─────────────────── */

type Sub = (n: CapturedNotification) => void;
const webSubs = new Set<Sub>();
let webGrantedKey = "mindrop.notify.web.granted";

const MOCK_APPS = [
  { pkg: "com.whatsapp", appName: "WhatsApp" },
  { pkg: "com.google.android.apps.messaging", appName: "Messages" },
  { pkg: "com.google.android.gm", appName: "Gmail" },
  { pkg: "com.google.android.googlequicksearchbox", appName: "Google News" },
  { pkg: "com.instagram.android", appName: "Instagram" },
];
const MOCK_SENDERS = ["Mom", "Aarav", "Priya", "Team Slack", "Boss", "NDTV Alert"];
const MOCK_MSGS = [
  "Are you coming home for dinner?",
  "Meeting rescheduled to 4pm",
  "Please review the doc when free",
  "Sale ends in 2 hours!",
  "Breaking: market closes higher",
  "Don't forget the birthday gift",
];

function makeMockNotification(): CapturedNotification {
  const app = MOCK_APPS[Math.floor(Math.random() * MOCK_APPS.length)];
  const sender = MOCK_SENDERS[Math.floor(Math.random() * MOCK_SENDERS.length)];
  const text = MOCK_MSGS[Math.floor(Math.random() * MOCK_MSGS.length)];
  return {
    id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pkg: app.pkg,
    appName: app.appName,
    title: sender,
    text,
    timestamp: Date.now(),
  };
}

/* ─────────────────── Public API ─────────────────── */

export const NotifyBridge = {
  isSupported() {
    // web mock counts as "supported" so users can play with the UI
    return true;
  },
  isNative() { return hasPlugin(); },

  async hasPermission(): Promise<boolean> {
    if (hasPlugin()) {
      try { const r = await native.hasPermission(); return r.granted; }
      catch { return false; }
    }
    try { return window.localStorage.getItem(webGrantedKey) === "1"; } catch { return false; }
  },

  async openPermissionSettings(): Promise<void> {
    if (hasPlugin()) { try { await native.openPermissionSettings(); } catch {} return; }
    // Web mock: just flip the flag so the UI unlocks.
    try { window.localStorage.setItem(webGrantedKey, "1"); } catch {}
  },

  async openContactsPicker(): Promise<{ name?: string; phone?: string }> {
    if (hasPlugin()) { try { return await native.openContactsPicker(); } catch { return {}; } }
    // Web mock: prompt for a name so the UI is testable.
    const name = window.prompt("Pick a contact (web mock — enter a name):", "");
    return name ? { name } : {};
  },

  async launchNotification(id: string): Promise<boolean> {
    if (hasPlugin()) {
      try { await native.launchNotification({ id }); return true; }
      catch { return false; }
    }
    // web mock: no source app to launch
    return false;
  },

  async launchApp(pkg: string): Promise<boolean> {
    if (hasPlugin()) {
      try { await native.launchApp({ pkg }); return true; }
      catch { return false; }
    }
    return false;
  },

  async syncRules(rules: NativeRuleSnapshot[]): Promise<void> {
    if (!hasPlugin()) return;
    try { await native.syncRules({ rules }); } catch {}
  },

  async drainPendingEvents(): Promise<CapturedNotification[]> {
    if (!hasPlugin()) return [];
    try { const r = await native.drainPendingEvents(); return r?.events ?? []; }
    catch { return []; }
  },

  /** Subscribe to notificationPosted events. Returns unsubscribe. */
  onNotification(cb: (n: CapturedNotification) => void): () => void {
    if (hasPlugin()) {
      const handle = native.addListener("notificationPosted", cb);
      return () => { handle.then((h) => h.remove()).catch(() => {}); };
    }
    webSubs.add(cb);
    return () => { webSubs.delete(cb); };
  },

  /** Dev-only: inject a mock notification (web preview). */
  mockPost(partial?: Partial<CapturedNotification>) {
    const n = { ...makeMockNotification(), ...partial } as CapturedNotification;
    webSubs.forEach((s) => { try { s(n); } catch {} });
    return n;
  },
};
