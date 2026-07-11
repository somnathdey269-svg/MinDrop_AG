import type { CapturedNotification } from "../types";
import { categoryFor, type CategoryId } from "./sources";
import { readProfile } from "./profile";
import type { SummarySources } from "./types";

// PII regex bundle — replace matches with tag strings so the model never sees raw values.
const PII: Array<[RegExp, string]> = [
  [/\b\d{6}\b/g, "[otp]"],
  [/\b(?:\+?91[\s-]?)?[6-9]\d{9}\b/g, "[phone]"],
  [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]"],
  [/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "[card]"],
  [/\b\d{4}\s?\d{4}\s?\d{4}\b/g, "[aadhaar]"],
  [/\b[A-Z]{4}0[A-Z0-9]{6}\b/g, "[ifsc]"],
  [/[a-z0-9._-]+@(?:okhdfcbank|okicici|oksbi|okaxis|ybl|paytm|upi)/gi, "[upi]"],
];

function scrub(s: string): string {
  let out = s;
  for (const [re, tag] of PII) out = out.replace(re, tag);
  return out;
}

const CHAT_APPS = /whatsapp|telegram|signal|messenger|gmail|slack|discord|imess/i;
const TRANSACTIONAL = /order|delivery|shipped|otp|verification|payment|invoice|receipt|debit|credit|balance/i;

interface AppGroup {
  pkg: string; appName: string; category: CategoryId; count: number;
  firstAt: number; lastAt: number;
  topTitles: string[];
  topBodies: string[];
}

interface ChatGroup {
  app: string; senders: { name: string; count: number }[];
}

function fmtTime(ms: number): string {
  return new Date(ms).toTimeString().slice(0, 5);
}

function inWindow(ts: number, s: SummarySources): boolean {
  const d = new Date(ts);
  const cur = d.getHours() * 60 + d.getMinutes();
  const w = s.filters.timeWindow;
  if (w === "all") return true;
  if (w === "work") return cur >= 9 * 60 && cur < 18 * 60;
  if (w === "evening") return cur >= 18 * 60 && cur < 23 * 60;
  if (w === "custom" && s.filters.customFrom && s.filters.customTo) {
    const [fh, fm] = s.filters.customFrom.split(":").map(Number);
    const [th, tm] = s.filters.customTo.split(":").map(Number);
    return cur >= fh * 60 + fm && cur <= th * 60 + tm;
  }
  return true;
}

function passScope(pkg: string, cat: CategoryId, s: SummarySources): boolean {
  if (s.scope === "all") return true;
  if (s.scope === "selected") return (s.appIds ?? []).includes(pkg);
  if (s.scope === "exclude") return !(s.excludeIds ?? []).includes(pkg);
  if (s.scope === "categories") return (s.categoryIds ?? []).includes(cat);
  return true;
}

export interface CompactPayload {
  date: string;
  rangeDays: number;
  timezone: string;
  scope: { type: SummarySources["scope"]; presetName?: string };
  notifications: {
    totals: { notifications: number; distinctApps: number; quietHours: number[] };
    byApp: Array<{
      app: string; label: string; category: CategoryId; count: number;
      firstAt: string; lastAt: string; topTitles: string[]; topBodies: string[];
    }>;
    chats: ChatGroup[];
    categories: Record<string, number>;
    otherApps?: { count: number; list: string[] };
  };
  filteredOutCount: number;
  raw: { itemsAfterFilter: number };
}

export interface PreprocessOpts {
  date: string;        // end date (inclusive)
  rangeDays?: number;  // 1 = today, 7 = last 7d, 30 = last 30d
  timezone: string;
  presetName?: string;
}

export function preprocess(
  inbox: CapturedNotification[],
  sources: SummarySources,
  opts: PreprocessOpts,
): CompactPayload {
  const days = Math.max(1, opts.rangeDays ?? 1);
  const dayEnd = new Date(`${opts.date}T00:00:00`).getTime() + 24 * 3600 * 1000;
  const windowStart = dayEnd - days * 24 * 3600 * 1000;
  const profile = readProfile();
  const ignore = new Set(profile.ignoreApps);

  // 1. Range + time-window + scope + ignore filter
  const stage1 = inbox.filter((n) => {
    if (n.timestamp < windowStart || n.timestamp >= dayEnd) return false;
    if (ignore.has(n.pkg)) return false;
    if (!inWindow(n.timestamp, sources)) return false;
    const cat = categoryFor(n.pkg, n.appName);
    if (!passScope(n.pkg, cat, sources)) return false;
    if (!sources.filters.includeTransactional && TRANSACTIONAL.test(`${n.title} ${n.text}`)) return false;
    return true;
  });

  // 2. Dedupe by pkg+title within 2 min
  const seen = new Map<string, number>();
  const stage2 = stage1.filter((n) => {
    const key = `${n.pkg}::${n.title.toLowerCase().slice(0, 60)}`;
    const last = seen.get(key);
    if (last && Math.abs(n.timestamp - last) < 2 * 60_000) return false;
    seen.set(key, n.timestamp);
    return true;
  });

  // 3. Group
  const groups = new Map<string, AppGroup>();
  const chats = new Map<string, Map<string, number>>();
  const catCounts: Record<string, number> = {};

  for (const n of stage2) {
    const cat = categoryFor(n.pkg, n.appName);
    catCounts[cat] = (catCounts[cat] || 0) + 1;

    if (CHAT_APPS.test(n.appName) && !sources.filters.includeChatBodies) {
      const m = chats.get(n.appName) || new Map();
      m.set(n.title || "Unknown", (m.get(n.title || "Unknown") || 0) + 1);
      chats.set(n.appName, m);
      continue;
    }

    const g = groups.get(n.pkg) ?? {
      pkg: n.pkg, appName: n.appName, category: cat, count: 0,
      firstAt: n.timestamp, lastAt: n.timestamp, topTitles: [], topBodies: [],
    };
    g.count++;
    g.firstAt = Math.min(g.firstAt, n.timestamp);
    g.lastAt = Math.max(g.lastAt, n.timestamp);
    if (n.title && g.topTitles.length < 5 && !g.topTitles.includes(n.title)) {
      g.topTitles.push(scrub(n.title).slice(0, 80));
    }
    const body = n.bigText || n.text;
    if (body && g.topBodies.length < 3) {
      const clean = scrub(body).slice(0, 120);
      if (!g.topBodies.includes(clean)) g.topBodies.push(clean);
    }
    groups.set(n.pkg, g);
  }

  const filteredGroups = Array.from(groups.values()).filter((g) => g.count >= sources.filters.minCount);
  filteredGroups.sort((a, b) => b.count - a.count);

  const capped = filteredGroups.slice(0, 40);
  const overflow = filteredGroups.slice(40);

  const hourCount = new Array(24).fill(0);
  for (const n of stage2) hourCount[new Date(n.timestamp).getHours()]++;
  const quietHours: number[] = [];
  hourCount.forEach((c, h) => { if (c === 0) quietHours.push(h); });

  const chatArr: ChatGroup[] = Array.from(chats.entries()).slice(0, 15).map(([app, m]) => ({
    app,
    senders: Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([name, count]) => ({ name: scrub(name).slice(0, 40), count })),
  }));

  return {
    date: opts.date,
    rangeDays: days,
    timezone: opts.timezone,
    scope: { type: sources.scope, presetName: opts.presetName },
    notifications: {
      totals: { notifications: stage2.length, distinctApps: groups.size + chats.size, quietHours },
      byApp: capped.map((g) => ({
        app: g.pkg, label: g.appName, category: g.category, count: g.count,
        firstAt: fmtTime(g.firstAt), lastAt: fmtTime(g.lastAt),
        topTitles: g.topTitles, topBodies: g.topBodies,
      })),
      chats: chatArr,
      categories: catCounts,
      otherApps: overflow.length
        ? { count: overflow.reduce((s, g) => s + g.count, 0), list: overflow.map((g) => g.appName) }
        : undefined,
    },
    filteredOutCount: inbox.length - stage2.length,
    raw: { itemsAfterFilter: stage2.length },
  };
}
