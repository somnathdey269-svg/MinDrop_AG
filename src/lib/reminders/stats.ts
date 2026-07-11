/**
 * Deterministic reminder recap from local stores. Never calls AI.
 * Supports today (1d), week (7d), month (30d) ranges.
 */

import { readRules as readNotifyRules } from "@/lib/notify/store";
import { readPlaceRules } from "@/lib/places/rules";
import type { ReminderRecap, SummaryJson } from "@/lib/notify/summary/types";
import type { Memory } from "@/lib/memoryos/types";

const MEM_KEY = "memoryos.memories.v1";

function readMemories(): Memory[] {
  try {
    const raw = window.localStorage.getItem(MEM_KEY);
    return raw ? (JSON.parse(raw) as Memory[]) : [];
  } catch { return []; }
}

function startOfDay(d = new Date()): number { const x = new Date(d); x.setHours(0,0,0,0); return x.getTime(); }

export interface ReminderContext extends ReminderRecap {
  rangeDays: number;
  triggered: { id: string; title: string; at: string; source: "time" | "location" | "rule" }[];
  missed: { id: string; title: string; at: string; reason: string }[];
  upcoming: { id: string; title: string; at: string }[];
  byType: { time: number; location: number; rule: number };
}

export function buildReminderContext(dateISO: string, rangeDays = 1): ReminderContext {
  const days = Math.max(1, rangeDays);
  const dayEnd = new Date(`${dateISO}T00:00:00`).getTime() + 24 * 3600 * 1000;
  const windowStart = dayEnd - days * 24 * 3600 * 1000;
  const now = Date.now();
  const in7d = now + 7 * 24 * 3600 * 1000;

  const memories = readMemories().filter((m) => !m.deletedAt);
  const notifyRules = readNotifyRules();
  const placeRules = readPlaceRules();

  const activeTimeMems = memories.filter((m) => !!m.dueAt && !m.archivedAt);
  const activeNotifyRules = notifyRules.filter((r) => (r.status ?? "active") === "active" && r.enabled);
  const activePlaceRules = placeRules.filter((r) => !r.paused);

  const activeTotal = activeTimeMems.length + activeNotifyRules.length + activePlaceRules.length;

  const inWindow = (t: number) => t >= windowStart && t < dayEnd;

  const triggeredMems = memories.filter((m) => m.firedAt && inWindow(new Date(m.firedAt).getTime()));
  const triggeredNotify = notifyRules.filter((r) => r.lastFiredAt && inWindow(r.lastFiredAt));
  const triggeredToday = triggeredMems.length + triggeredNotify.length;

  const missedMems = memories.filter((m) => {
    if (!m.dueAt || m.firedAt) return false;
    const t = new Date(m.dueAt).getTime();
    return t >= windowStart && t < now;
  });
  const missedToday = missedMems.length;

  const createdToday = memories.filter((m) => {
    const src = m.dueAt || m.date || "";
    if (!src) return false;
    const t = new Date(src).getTime();
    return !isNaN(t) && inWindow(t);
  }).length + notifyRules.filter((r) => inWindow(r.createdAt)).length;

  const upcomingMems = memories.filter((m) => {
    if (!m.dueAt || m.firedAt) return false;
    const t = new Date(m.dueAt).getTime();
    return t >= now && t <= in7d;
  }).sort((a, b) => new Date(a.dueAt!).getTime() - new Date(b.dueAt!).getTime());
  const upcoming7d = upcomingMems.length;

  const onTimeRate = triggeredToday + missedToday > 0
    ? triggeredToday / (triggeredToday + missedToday)
    : 1;

  return {
    rangeDays: days,
    activeTotal, triggeredToday, missedToday, createdToday, upcoming7d,
    onTimeRate: Math.round(onTimeRate * 100) / 100,
    triggered: [
      ...triggeredMems.map((m) => ({
        id: m.id, title: m.text.slice(0, 60),
        at: new Date(m.firedAt!).toTimeString().slice(0, 5), source: "time" as const,
      })),
      ...triggeredNotify.map((r) => ({
        id: r.id, title: r.remindNote || `${r.appName} rule`,
        at: new Date(r.lastFiredAt!).toTimeString().slice(0, 5), source: "rule" as const,
      })),
    ].slice(0, 10),
    missed: missedMems.slice(0, 10).map((m) => ({
      id: m.id, title: m.text.slice(0, 60),
      at: new Date(m.dueAt!).toTimeString().slice(0, 5),
      reason: "not acknowledged",
    })),
    upcoming: upcomingMems.slice(0, 10).map((m) => ({
      id: m.id, title: m.text.slice(0, 60),
      at: m.dueAt!,
    })),
    byType: {
      time: activeTimeMems.length,
      location: activePlaceRules.length,
      rule: activeNotifyRules.length,
    },
  };
}

/** Force AI-returned recap counts to match the local DB (source of truth). */
export function reconcileRecap(json: SummaryJson, ctx: ReminderContext): SummaryJson {
  return {
    ...json,
    conclusion: {
      ...json.conclusion,
      reminderRecap: {
        activeTotal: ctx.activeTotal,
        triggeredToday: ctx.triggeredToday,
        missedToday: ctx.missedToday,
        createdToday: ctx.createdToday,
        upcoming7d: ctx.upcoming7d,
        onTimeRate: ctx.onTimeRate,
      },
    },
  };
}

export { startOfDay };
