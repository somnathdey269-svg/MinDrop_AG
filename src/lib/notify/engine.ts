/**
 * Notify engine — subscribes to notificationPosted events, saves them to the
 * inbox, and dispatches any matching rules (either an immediate alarm sheet
 * or a scheduled MinDrop memory).
 *
 * Started once from src/routes/__root.tsx alongside startScheduler().
 */
import { NotifyBridge, type NativeRuleSnapshot } from "./bridge";
import { pushToInbox, readRules, markRuleFired, markRuleTriggered } from "./store";
import { pushCapture, tagCaptureMatched } from "./capture";
import type { CapturedNotification, NotifyRule, RuleCondition } from "./types";
import { ALARM_EVENT, rescanScheduler, type AlarmDetail } from "@/lib/memoryos/scheduler";
import type { Memory } from "@/lib/memoryos/types";

const MEM_KEY = "memoryos.memories.v1";

function currentPlan(): "free" | "premium" {
  try {
    const raw = window.localStorage.getItem("memoryos.onboarding.v1");
    if (!raw) return "free";
    const parsed = JSON.parse(raw);
    return parsed?.plan === "premium" ? "premium" : "free";
  } catch { return "free"; }
}

function haystack(n: CapturedNotification) {
  if (n.isMessaging) {
    return `${n.title}\n${n.text}`.toLowerCase();
  }
  return `${n.title}\n${n.text}\n${n.bigText ?? ""}`.toLowerCase();
}

function checkCondition(cond: RuleCondition, n: CapturedNotification): boolean {
  const hay = n.isMessaging
    ? `${n.title}\n${n.text}`.toLowerCase()
    : `${n.title}\n${n.text}\n${n.bigText ?? ""}`.toLowerCase();

  if (cond.field === "sender") {
    const s = cond.value.trim().toLowerCase();
    const t = n.title.toLowerCase();
    if (cond.operator === "equals") return t === s;
    if (cond.operator === "doesNotContain") return !t.includes(s);
    return t.includes(s);
  }

  if (cond.field === "text") {
    const s = cond.value.trim().toLowerCase();
    const b = n.text.toLowerCase();
    if (cond.operator === "equals") return b === s;
    if (cond.operator === "doesNotContain") return !b.includes(s);
    return b.includes(s);
  }

  if (cond.field === "otp") {
    const hasOtpKeywords = /otp|code|verification|verify|pin/i.test(hay);
    const hasDigits = /\b\d{4,8}\b/.test(hay);
    const isMatched = hasOtpKeywords && hasDigits;
    return cond.operator === "doesNotContain" ? !isMatched : isMatched;
  }

  if (cond.field === "transaction") {
    const hasMoneyKeywords = /debited|credited|spent|transaction|payment|paid|withdrawn|transferred/i.test(hay);
    const hasCurrencySymbols = /[\$₹€£]/.test(hay);
    const isMatched = hasMoneyKeywords || hasCurrencySymbols;
    return cond.operator === "doesNotContain" ? !isMatched : isMatched;
  }

  if (cond.field === "link") {
    const hasWebLink = /https?:\/\/[^\s]+/.test(hay);
    return cond.operator === "doesNotContain" ? !hasWebLink : hasWebLink;
  }

  if (cond.field === "priority") {
    const isHigh = (n.priority ?? 0) >= 1;
    return cond.operator === "doesNotContain" ? !isHigh : isHigh;
  }

  return true;
}

function ruleMatches(rule: NotifyRule, n: CapturedNotification): boolean {
  if (!rule.enabled) return false;
  if (rule.pkg !== n.pkg) return false;

  // Evaluate conditions list if present
  if (rule.conditions && rule.conditions.length > 0) {
    const results = rule.conditions.map((c) => checkCondition(c, n));
    if (rule.logicalOperator === "OR") {
      return results.some(Boolean);
    } else {
      return results.every(Boolean);
    }
  }

  // Fallback to legacy rule logic
  if (rule.priorityOnly && (n.priority ?? 0) < 1) return false;

  const mode = rule.matchMode ?? "sender";
  const hay = haystack(n);

  if (mode === "sender") {
    const s = rule.senderMatch?.trim().toLowerCase();
    if (!s) return true;
    return n.title.toLowerCase().includes(s) || n.text.toLowerCase().includes(s);
  }
  // topic
  const includes = (rule.includeAny ?? []).map((s) => s.trim().toLowerCase()).filter(Boolean);
  const excludes = (rule.excludeAny ?? []).map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (excludes.some((w) => hay.includes(w))) return false;
  if (includes.length === 0) return true;
  return includes.some((w) => hay.includes(w));
}

function buildMemoryFromRule(rule: NotifyRule, n: CapturedNotification, dueAt: Date): Memory {
  const id = `m-notify-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
  const dateStr = dueAt.toLocaleString([], {
    weekday: "short", hour: "2-digit", minute: "2-digit", hour12: true,
  });
  const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  return {
    id,
    time: nowStr,
    date: dateStr,
    text: `${n.appName} · ${n.title}: ${n.text}`.slice(0, 240),
    tags: ["Actionable"],
    notify: rule.delivery ?? "notification",
    dueAt: dueAt.toISOString(),
    source: { kind: "capture" },
  };
}

function addMemory(m: Memory) {
  try {
    const raw = window.localStorage.getItem(MEM_KEY);
    const list: Memory[] = raw ? JSON.parse(raw) : [];
    window.localStorage.setItem(MEM_KEY, JSON.stringify([m, ...list]));
    try { window.dispatchEvent(new StorageEvent("storage", { key: MEM_KEY })); } catch {}
  } catch {}
}

async function fireImmediate(rule: NotifyRule, n: CapturedNotification) {
  const delivery = rule.delivery ?? "notify";
  const mem = buildMemoryFromRule(rule, n, new Date());
  if (delivery === "alarm") {
    // Loud path: dispatch the in-app alarm sheet AND schedule a native alarm
    // right now so the phone rings even if the WebView is backgrounded.
    window.dispatchEvent(new CustomEvent<AlarmDetail>(ALARM_EVENT, { detail: { memory: mem } }));
    try {
      const { AlarmsBridge } = await import("@/lib/alarms/bridge");
      // Use a STABLE ID (rule-scoped, not timestamp-based) so only ONE alarm
      // entry ever exists for this rule at a time. If native somehow also
      // scheduled one (edge case), upsert() merges them into the same slot.
      await AlarmsBridge.scheduleAlarm({
        id: `notify-active-${rule.id}`,
        at: Date.now(),
        title: `${n.appName} · ${n.title || "alert"}`,
        body: (rule.remindNote || n.text || "").slice(0, 240),
        delivery: "alarm",
        extra: { source: "notify", ruleId: rule.id },
      });
    } catch {}
  } else {
    // Silent heads-up: schedule a notify-delivery alarm at now.
    try {
      const { AlarmsBridge } = await import("@/lib/alarms/bridge");
      await AlarmsBridge.scheduleAlarm({
        id: `notify-${rule.id}-${Date.now()}`,
        at: Date.now(),
        title: `${n.appName} · ${n.title || "alert"}`,
        body: (rule.remindNote || n.text || "").slice(0, 240),
        delivery: "notify",
        extra: { source: "notify", ruleId: rule.id },
      });
    } catch {}
  }
}

function scheduleLater(rule: NotifyRule, n: CapturedNotification, dueAt: Date) {
  // Persist as a Memory; scheduler routes to alarm/notify based on `notify`.
  const mem = buildMemoryFromRule(rule, n, dueAt);
  addMemory(mem);
  rescanScheduler();
}

// Dedup key = pkg + title + text — Android often re-posts the same
// notification on updates; without dedup a chat message can trigger a rule
// multiple times within seconds.
const RECENT_MS = 60_000;
const recentSeen = new Map<string, number>();
function isDuplicate(n: CapturedNotification): boolean {
  const key = `${n.pkg}::${n.title}::${n.text}`;
  const now = Date.now();
  for (const [k, t] of recentSeen) if (now - t > RECENT_MS) recentSeen.delete(k);
  const last = recentSeen.get(key);
  recentSeen.set(key, now);
  return last != null && now - last < RECENT_MS;
}

function handleNotification(n: CapturedNotification) {
  if (isDuplicate(n)) return;
  pushToInbox(n);
  pushCapture(n, currentPlan());
  const rules = readRules();

  // Prioritize checking by rule set specificity (more conditions first, catch-all last)
  const sortedRules = [...rules].sort((a, b) => {
    const aScore = (a.conditions?.length ?? 0) + (a.senderMatch ? 1 : 0);
    const bScore = (b.conditions?.length ?? 0) + (b.senderMatch ? 1 : 0);
    return bScore - aScore;
  });

  const matchedIds: string[] = [];
  for (const rule of sortedRules) {
    if (rule.status && rule.status !== "active") continue;
    if (!ruleMatches(rule, n)) continue;
    let fired = false;
    if (rule.remindMode === "immediate") {
      void fireImmediate(rule, n);
      fired = true;
    } else if (rule.remindMode === "after") {
      const hrs = Math.max(0, rule.afterHours ?? 0);
      const mins = Math.max(0, rule.afterMinutes ?? 0);
      const total = Math.max(1, hrs * 60 + mins);
      const due = new Date(Date.now() + total * 60_000);
      scheduleLater(rule, n, due);
      fired = true;
    }
    // "once" → archive after firing; "always" → stay active, just log lastFiredAt.
    if (fired) {
      const freq = rule.frequency ?? "once";
      if (freq === "always") markRuleTriggered(rule.id);
      else markRuleFired(rule.id);
      matchedIds.push(rule.id);
      break; // Only trigger the first/highest priority match in the rule set
    }
  }
  if (matchedIds.length) tagCaptureMatched(n.id, matchedIds);
}

/** Build a compact snapshot the native listener uses to fire alarms when
 * the WebView is dead. Only sender-mode active rules with a package survive
 * the trip — topic-mode rules keep running in JS. */
export function buildNativeRuleSnapshot(): NativeRuleSnapshot[] {
  const rules = readRules();
  return rules
    .filter((r) => r.enabled && (r.status ?? "active") === "active")
    .filter((r) => (r.matchMode ?? "sender") === "sender")
    .map((r) => ({
      id: r.id,
      pkg: r.pkg,
      keywords: r.senderMatch ? [r.senderMatch.trim().toLowerCase()] : [],
      priorityOnly: r.priorityOnly === true,
      title: `${r.appName} · ${r.senderMatch || "match"}`,
      body: r.remindNote || "",
      delivery: r.delivery ?? "notification",
      // Fix 2: tell native layer whether to retire (once) or keep alive (always).
      frequency: (r.frequency ?? "once") as "once" | "always",
    }));
}

export async function syncNativeRules() {
  try { await NotifyBridge.syncRules(buildNativeRuleSnapshot()); } catch {}
}

async function drainPending() {
  const events = await NotifyBridge.drainPendingEvents();
  for (const e of events) {
    // Drained events are notifications that arrived while JS was dead and were
    // handled natively (alarm already fired via MindDropNotificationListener).
    // We must NOT re-fire alarms here — that would create a second alarm entry
    // and cause the "rings again when you open the app" bug.
    // Only update the inbox and capture buffer for history/UI purposes.
    if (!isDuplicate(e)) {
      pushToInbox(e);
      pushCapture(e, currentPlan());
    }
  }
}

let started = false;
export function startNotifyEngine() {
  if (started || typeof window === "undefined") return;
  started = true;
  NotifyBridge.onNotification(handleNotification);
  // On startup + when the tab regains focus, pull any events the native
  // listener buffered while JS was dead.
  drainPending();
  window.addEventListener("focus", () => { drainPending(); });
  // Keep native matcher in sync with rule edits.
  syncNativeRules();
  window.addEventListener("storage", (e) => {
    if (e.key === "mindrop.notify.rules.v1" || e.key === null) syncNativeRules();
  });
}
