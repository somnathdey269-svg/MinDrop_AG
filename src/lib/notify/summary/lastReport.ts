/**
 * Stores the most recent SummaryJson so the Summary tab can render actionable
 * suggestion chips after generation, and unignore suggestions after use.
 */
import type { SummaryJson } from "./types";

const LAST_KEY = "mindrop.summary.lastReport.v1";
const USED_KEY = "mindrop.summary.usedSuggestions.v1";

interface Stored { json: SummaryJson; date: string; savedAt: number }

export function saveLastReport(json: SummaryJson, date: string) {
  try { window.localStorage.setItem(LAST_KEY, JSON.stringify({ json, date, savedAt: Date.now() } satisfies Stored)); } catch {}
  clearUsed();
}
export function readLastReport(): Stored | null {
  try {
    const raw = window.localStorage.getItem(LAST_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch { return null; }
}
export function clearLastReport() {
  try { window.localStorage.removeItem(LAST_KEY); } catch {}
  clearUsed();
}

export function markSuggestionUsed(title: string) {
  const s = readUsed();
  if (!s.includes(title)) {
    s.push(title);
    try { window.localStorage.setItem(USED_KEY, JSON.stringify(s)); } catch {}
  }
}
export function readUsed(): string[] {
  try {
    const raw = window.localStorage.getItem(USED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}
function clearUsed() { try { window.localStorage.removeItem(USED_KEY); } catch {} }
