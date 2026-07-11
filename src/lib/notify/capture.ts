/**
 * Raw notification capture — every notification the listener forwards is
 * pushed here BEFORE rule evaluation. Local-only, ring-buffered, quota'd by
 * plan tier (admin-configurable). No server upload, ever.
 */
import type { CapturedNotification } from "./types";

export const CAPTURE_KEY = "mindrop.notify.capture.v1";

export type CapturedEntry = CapturedNotification & {
  capturedAt: number;
  matchedRuleIds?: string[];
};

const FREE_MAX = 500;
const FREE_DAYS = 7;
const PAID_MAX = 5000;
const PAID_DAYS = 90;

function limits(plan: "free" | "premium"): { max: number; days: number } {
  if (plan === "premium") return { max: PAID_MAX, days: PAID_DAYS };
  return { max: FREE_MAX, days: FREE_DAYS };
}

function readAll(): CapturedEntry[] {
  try {
    const raw = window.localStorage.getItem(CAPTURE_KEY);
    return raw ? (JSON.parse(raw) as CapturedEntry[]) : [];
  } catch { return []; }
}

function writeAll(list: CapturedEntry[]) {
  try {
    window.localStorage.setItem(CAPTURE_KEY, JSON.stringify(list));
    window.dispatchEvent(new StorageEvent("storage", { key: CAPTURE_KEY }));
  } catch {}
}

export function pushCapture(n: CapturedNotification, plan: "free" | "premium" = "free"): CapturedEntry {
  const entry: CapturedEntry = { ...n, capturedAt: Date.now() };
  const list = readAll();
  list.unshift(entry);
  const { max, days } = limits(plan);
  const cutoff = Date.now() - days * 86_400_000;
  const trimmed = list.filter((e) => e.capturedAt >= cutoff).slice(0, max);
  writeAll(trimmed);
  return entry;
}

export function tagCaptureMatched(id: string, ruleIds: string[]) {
  const list = readAll();
  const idx = list.findIndex((e) => e.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], matchedRuleIds: [...(list[idx].matchedRuleIds ?? []), ...ruleIds] };
  writeAll(list);
}

export function readCaptures(): CapturedEntry[] { return readAll(); }

export function purgeCaptures(plan: "free" | "premium" = "free") {
  const { max, days } = limits(plan);
  const cutoff = Date.now() - days * 86_400_000;
  writeAll(readAll().filter((e) => e.capturedAt >= cutoff).slice(0, max));
}

export function clearCaptures() { writeAll([]); }
