/**
 * Web + native daily scheduler.
 *  - Web timer fires while the app is open (immediate generation).
 *  - Native alarm posts a notification at the same HH:MM so users know to open
 *    MinDrop; on next resume, the JS timer catches up.
 */

import { AlarmsBridge } from "@/lib/alarms/bridge";
import type { ProviderId } from "./types";

const KEY = "mindrop.summary.scheduler.v1";
const NATIVE_ID = "mindrop-summary-digest";

export interface ScheduleState {
  enabled: boolean;
  hhmm: string;
  presetId: string;
  rangeDays: number;
  lastRunDate?: string; // YYYY-MM-DD
  interval?: "daily" | "weekly";
  weeklyDay?: number; // 0..6 (0 is Sunday, 1 is Monday, etc.)
  thresholdEnabled?: boolean;
  thresholdCount?: number; // e.g. 3
  providerId?: ProviderId;
  modelId?: string;
}

const DEFAULT: ScheduleState = {
  enabled: false,
  hhmm: "22:00",
  presetId: "p_all",
  rangeDays: 1,
  interval: "daily",
  weeklyDay: 0,
  thresholdEnabled: true,
  thresholdCount: 3,
};

export function readSchedule(): ScheduleState {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...(JSON.parse(raw) as ScheduleState) } : DEFAULT;
  } catch { return DEFAULT; }
}
export function writeSchedule(s: ScheduleState) {
  try { window.localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

export function nextFireMs(s: ScheduleState): number {
  const [hh, mm] = s.hhmm.split(":").map(Number);
  const now = new Date();
  const next = new Date();
  next.setHours(hh, mm, 0, 0);

  if (s.interval === "weekly") {
    const targetDay = s.weeklyDay ?? 0;
    const currentDay = now.getDay();
    let daysToAdd = (targetDay - currentDay + 7) % 7;
    if (daysToAdd === 0 && next.getTime() <= now.getTime()) {
      daysToAdd = 7;
    }
    next.setDate(next.getDate() + daysToAdd);
  } else {
    if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
  }
  return next.getTime();
}

let timerId: ReturnType<typeof setTimeout> | null = null;

export function armScheduler(onFire: () => void) {
  disarmScheduler();
  const s = readSchedule();
  if (!s.enabled) return;
  const at = nextFireMs(s);
  timerId = setTimeout(() => {
    try { onFire(); } finally { armScheduler(onFire); }
  }, at - Date.now());

  // Native alarm: shows a system notification prompting the user to open MinDrop.
  if (AlarmsBridge.isNative()) {
    void AlarmsBridge.scheduleAlarm({
      id: NATIVE_ID,
      at,
      title: "Your MinDrop digest is ready",
      body: "Tap to generate today's report.",
      delivery: "notify",
      extra: { kind: "summary" },
    });
  }
}

export function disarmScheduler() {
  if (timerId) { clearTimeout(timerId); timerId = null; }
  if (AlarmsBridge.isNative()) void AlarmsBridge.cancelAlarm(NATIVE_ID);
}
