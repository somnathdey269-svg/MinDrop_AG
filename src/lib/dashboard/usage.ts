// Client-side dashboard aggregator.
// Reads localStorage across segments. Nothing leaves the device.

export type SegmentKey = "places" | "packs" | "notify" | "rules" | "recall" | "quiz";

export type SegmentUsage = {
  key: SegmentKey;
  active: boolean;
  count: number;
  lastAt?: number; // epoch ms
  sparkline: number[]; // last 7 days activity counts
};

export type NotifyDashboardSummary = {
  used: boolean;
  count: number;
  label: string;
  tab: "inbox" | "rules";
};

const KEYS = {
  memories: "memoryos.memories.v1",
  packInstalls: "gmd:packInstalls.v1",
  customPacks: "gmd:customPacks.v1",
  places: "mindrop.places.v1",
  placeEvents: "mindrop.places.events.v1",
  notifyInbox: "mindrop.notify.inbox.v1",
  notifyRules: "mindrop.notify.rules.v1",
  rules: "memoryos.rules.v2",
  rulesState: "memoryos.rules.state.v1",
  recallState: "memoryos.recall.trendstate.v1",
  recallCfg: "memoryos.recall.trends.v2",
  quiz: "memoryos.quizconfig.v3",
  personality: "memoryos.personality.v1",
} as const;

function readJson<T = any>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function toArray(v: any): any[] {
  if (Array.isArray(v)) return v;
  if (v && typeof v === "object") return Object.values(v);
  return [];
}

function extractTimes(items: any[]): number[] {
  const out: number[] = [];
  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    const t =
      it.createdAt ?? it.at ?? it.time ?? it.timestamp ?? it.updatedAt ?? it.dueAt ?? it.date;
    if (!t) continue;
    const ms = typeof t === "number" ? t : Date.parse(String(t));
    if (!Number.isFinite(ms)) continue;
    out.push(ms);
  }
  return out;
}

function sparklineFromTimes(times: number[]): number[] {
  const days = 7;
  const buckets = new Array<number>(days).fill(0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const start = now.getTime() - (days - 1) * 86_400_000;
  for (const t of times) {
    if (t < start) continue;
    const idx = Math.min(days - 1, Math.floor((t - start) / 86_400_000));
    if (idx >= 0) buckets[idx] += 1;
  }
  return buckets;
}

export function readSegmentUsage(): Record<SegmentKey, SegmentUsage> {
  // Places
  const places = toArray(readJson(KEYS.places));
  const placeEvents = toArray(readJson(KEYS.placeEvents));
  const placeTimes = extractTimes([...places, ...placeEvents]);
  // Packs
  const installs = toArray(readJson(KEYS.packInstalls));
  const customPacks = toArray(readJson(KEYS.customPacks));
  const packTimes = extractTimes([...installs, ...customPacks]);
  // Notify
  const notifyRules = toArray(readJson(KEYS.notifyRules));
  const notifyInbox = toArray(readJson(KEYS.notifyInbox));
  const activeNotifyRules = notifyRules.filter((r) => (r?.status ?? "active") === "active");
  const notifyTimes = extractTimes([...notifyRules, ...notifyInbox]);
  // Rules
  const rules = toArray(readJson(KEYS.rules));
  const rulesState = toArray(readJson(KEYS.rulesState));
  const ruleTimes = extractTimes([...rules, ...rulesState]);
  // Recall
  const recallState = toArray(readJson(KEYS.recallState));
  const recallCfg = toArray(readJson(KEYS.recallCfg));
  const recallTimes = extractTimes([...recallState, ...recallCfg]);
  // Quiz — presence of personality doc = taken
  const quizCfg = readJson(KEYS.quiz);
  const personality = readJson(KEYS.personality);
  const quizTaken = !!personality;

  const mk = (
    key: SegmentKey,
    count: number,
    times: number[],
    activeOverride?: boolean,
  ): SegmentUsage => {
    const lastAt = times.length ? Math.max(...times) : undefined;
    return {
      key,
      active: activeOverride ?? count > 0,
      count,
      lastAt,
      sparkline: sparklineFromTimes(times),
    };
  };

  return {
    places: mk("places", places.length, placeTimes),
    packs: mk("packs", installs.length + customPacks.length, packTimes),
    notify: mk("notify", activeNotifyRules.length || notifyInbox.length, notifyTimes, notifyRules.length > 0 || notifyInbox.length > 0),
    rules: mk("rules", rules.length, ruleTimes),
    recall: mk("recall", recallCfg.length + recallState.length, recallTimes),
    quiz: mk("quiz", quizTaken ? 1 : 0, [], quizTaken || !!quizCfg),
  };
}

export function readNotifyDashboardSummary(): NotifyDashboardSummary {
  // "Used" = the user has personally created at least one notify rule.
  // Inbox pings alone don't count — a first-time user may receive system
  // pings without ever setting up the feature, and should still see the pitch.
  const rules = toArray(readJson(KEYS.notifyRules));
  const activeRules = rules.filter((r) => (r?.status ?? "active") === "active");

  if (activeRules.length > 0) {
    return {
      used: true,
      count: activeRules.length,
      label: `active ${activeRules.length === 1 ? "rule" : "rules"}`,
      tab: "rules",
    };
  }

  if (rules.length > 0) {
    // Rules exist but all paused/archived — still counts as "used".
    return {
      used: true,
      count: rules.length,
      label: `${rules.length === 1 ? "rule" : "rules"}`,
      tab: "rules",
    };
  }

  return { used: false, count: 0, label: "items", tab: "rules" };
}

export function relTime(ms?: number): string {
  if (!ms) return "";
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.floor(d / 7);
  return `${w}w ago`;
}

const WELCOME_KEY = "mindrop.dashboard.welcome.v1";
export function hasSeenWelcome(): boolean {
  if (typeof window === "undefined") return true;
  try { return window.localStorage.getItem(WELCOME_KEY) === "1"; } catch { return true; }
}
export function markWelcomeSeen() {
  try { window.localStorage.setItem(WELCOME_KEY, "1"); } catch {}
}

export function readReminderCounts(): { active: number; archived: number } {
  const list = toArray(readJson(KEYS.memories)) as any[];
  let active = 0;
  let archived = 0;
  for (const m of list) {
    if (!m || typeof m !== "object") continue;
    if (m.deletedAt) continue; // erased — never surface
    if (m.archivedAt) archived += 1;
    else active += 1;
  }
  return { active, archived };
}

export type PinnedPlaceLite = { id: string; name: string; emoji?: string; radiusM?: number };
export function readPinnedPlaces(limit = 3): PinnedPlaceLite[] {
  const list = toArray(readJson(KEYS.places)) as any[];
  return list
    .filter((p) => p && !p.deletedAt && !p.archivedAt)
    .slice(0, limit)
    .map((p) => ({ id: String(p.id), name: String(p.name ?? "Place"), emoji: p.emoji, radiusM: p.radiusM }));
}

export function readNotifyArchivedCount(): number {
  const rules = toArray(readJson(KEYS.notifyRules));
  return rules.filter((r) => r?.status === "archived").length;
}

export function readPlacesArchivedCount(): number {
  const list = toArray(readJson(KEYS.places));
  return list.filter((p) => p && p.archivedAt && !p.deletedAt).length;
}
