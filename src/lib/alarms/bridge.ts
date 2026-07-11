/**
 * AlarmsBridge — typed wrapper around the native AlarmsBridge Capacitor
 * plugin. Adds per-tone channel management, snooze deep-link, and preview
 * playback on top of the base schedule/cancel API.
 *
 * On non-Android platforms (web preview, iOS): all methods are safe no-ops
 * and status queries report "granted"/"ok" so the UI stays unlocked.
 */
import { Capacitor, registerPlugin } from "@capacitor/core";
import type { ToneId } from "./tones";

export interface AlarmsStatus {
  postNotifications: boolean;
  canScheduleExactAlarms: boolean;
  ignoringBatteryOptimizations: boolean;
}

export type AlarmDelivery = "alarm" | "notify";

export interface AlarmSpec {
  id: string;
  at: number; // epoch ms
  title: string;
  body?: string;
  /** "alarm" → loud ringing + full-screen; "notify" → silent heads-up */
  delivery?: AlarmDelivery;
  /** Overrides the user's default tone. Ignored when delivery = "notify". */
  toneId?: ToneId;
  extra?: Record<string, unknown>;
}

export type ScheduleReason =
  | "ok"
  | "no_notif_permission"
  | "no_exact_permission"
  | "battery_optimized";

export interface FiredLogEntry {
  id: string;
  at: number;
  title: string;
  delivery: string;
}

interface AlarmsBridgePlugin {
  getStatus(): Promise<AlarmsStatus>;
  requestNotificationPermission(): Promise<AlarmsStatus>;
  openNotificationSettings(): Promise<void>;
  openExactAlarmSettings(): Promise<void>;
  openBatteryOptimizationSettings(): Promise<void>;
  openAppDetails(): Promise<void>;
  scheduleAlarm(spec: AlarmSpec): Promise<AlarmsStatus & { scheduled: boolean; reason?: ScheduleReason }>;
  cancelAlarm(opts: { id: string }): Promise<void>;
  cancelAll(): Promise<void>;
  getPending(): Promise<{ alarms: AlarmSpec[] }>;
  getFiredLog(): Promise<{ entries: FiredLogEntry[] }>;
  setDefaultTone(opts: { toneId: ToneId }): Promise<void>;
  previewTone(opts: { toneId: ToneId }): Promise<void>;
  stopPreview(): Promise<void>;
  snoozeAlarm(opts: { id: string; minutes: number }): Promise<void>;
  addListener(
    event: "alarmFired",
    cb: (ev: { id: string; extra?: string }) => void,
  ): Promise<{ remove: () => Promise<void> }>;
}

const isAndroid = () => Capacitor?.getPlatform?.() === "android";
const hasPlugin = () => isAndroid() && (Capacitor as any).isPluginAvailable?.("AlarmsBridge");

const native = registerPlugin<AlarmsBridgePlugin>("AlarmsBridge");

const FALLBACK: AlarmsStatus = {
  postNotifications: true,
  canScheduleExactAlarms: true,
  ignoringBatteryOptimizations: true,
};

export const AlarmsBridge = {
  isNative() { return hasPlugin(); },

  async getStatus(): Promise<AlarmsStatus> {
    if (!hasPlugin()) return FALLBACK;
    try { return await native.getStatus(); } catch { return FALLBACK; }
  },

  async requestNotificationPermission(): Promise<AlarmsStatus> {
    if (!hasPlugin()) return FALLBACK;
    try { return await native.requestNotificationPermission(); } catch { return FALLBACK; }
  },

  async openNotificationSettings() {
    if (hasPlugin()) { try { await native.openNotificationSettings(); } catch {} }
  },
  async openExactAlarmSettings() {
    if (hasPlugin()) { try { await native.openExactAlarmSettings(); } catch {} }
  },
  async openBatteryOptimizationSettings() {
    if (hasPlugin()) { try { await native.openBatteryOptimizationSettings(); } catch {} }
  },
  async openAppDetails() {
    if (hasPlugin()) { try { await native.openAppDetails(); } catch {} }
  },

  async scheduleAlarm(spec: AlarmSpec): Promise<{ scheduled: boolean; reason: ScheduleReason }> {
    if (!hasPlugin()) return { scheduled: false, reason: "ok" };
    try {
      const r = await native.scheduleAlarm(spec);
      return { scheduled: !!r?.scheduled, reason: (r?.reason as ScheduleReason) ?? "ok" };
    } catch { return { scheduled: false, reason: "ok" }; }
  },

  async cancelAlarm(id: string) {
    if (hasPlugin()) { try { await native.cancelAlarm({ id }); } catch {} }
  },

  async cancelAll() {
    if (hasPlugin()) { try { await native.cancelAll(); } catch {} }
  },

  async getPending(): Promise<AlarmSpec[]> {
    if (!hasPlugin()) return [];
    try { return (await native.getPending()).alarms ?? []; } catch { return []; }
  },

  async getFiredLog(): Promise<FiredLogEntry[]> {
    if (!hasPlugin()) return [];
    try { return (await native.getFiredLog()).entries ?? []; } catch { return []; }
  },

  async setDefaultTone(toneId: ToneId) {
    if (hasPlugin()) { try { await native.setDefaultTone({ toneId }); } catch {} }
  },

  async previewTone(toneId: ToneId) {
    if (hasPlugin()) { try { await native.previewTone({ toneId }); } catch {} }
  },

  async stopPreview() {
    if (hasPlugin()) { try { await native.stopPreview(); } catch {} }
  },

  async snoozeAlarm(id: string, minutes: number) {
    if (hasPlugin()) { try { await native.snoozeAlarm({ id, minutes }); } catch {} }
  },

  onFired(cb: (ev: { id: string; extra?: string }) => void): () => void {
    if (!hasPlugin()) return () => {};
    const h = native.addListener("alarmFired", cb);
    return () => { h.then((x) => x.remove()).catch(() => {}); };
  },
};
