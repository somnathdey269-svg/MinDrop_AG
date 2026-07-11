/**
 * Web + native daily scheduler.
 *  - Web timer fires while the app is open (immediate generation).
 *  - Native alarm posts a notification at the same HH:MM so users know to open
 *    MinDrop; on next resume, the JS timer catches up.
 */

import { AlarmsBridge } from "@/lib/alarms/bridge";

const KEY = "mindrop.summary.scheduler.v1";
const NATIVE_ID = "mindrop-summary-digest";

export interface ScheduleState {
  enabled: boolean;
  hhmm: string;
  presetId: string;
  rangeDays: number;
  lastRunDate?: string; // YYYY-MM-DD
}

const DEFAULT: ScheduleState = { enabled: false, hhmm: "22:00", presetId: "p_all", rangeDays: 1 };

export function readSchedule(): ScheduleState {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...(JSON.parse(raw) as ScheduleState) } : DEFAULT;
  } catch { return DEFAULT; }
}
export function writeSchedule(s: ScheduleState) {
  try { window.localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

export function nextFireMs(hhmm: string): number {
  const [hh, mm] = hhmm.split(":").map(Number);
  const now = new Date();
  const next = new Date();
  next.setHours(hh, mm, 0, 0);
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
  return next.getTime();
}

let timerId: ReturnType<typeof setTimeout> | null = null;

export function armScheduler(onFire: () => void) {
  disarmScheduler();
  const s = readSchedule();
  if (!s.enabled) return;
  const at = nextFireMs(s.hhmm);
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
