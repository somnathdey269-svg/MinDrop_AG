import { useEffect, useState, useCallback } from "react";
import type { CapturedNotification, NotifyRule, RuleStatus } from "./types";

const INBOX_KEY = "mindrop.notify.inbox.v1";
const RULES_KEY = "mindrop.notify.rules.v1";
const INBOX_MAX = 200;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function write<T>(key: string, val: T) {
  try { window.localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/* ─────────────────── Inbox ─────────────────── */

export function readInbox(): CapturedNotification[] { return read(INBOX_KEY, [] as CapturedNotification[]); }
export function persistInbox(next: CapturedNotification[]) {
  const trimmed = next.slice(0, INBOX_MAX);
  write(INBOX_KEY, trimmed);
  try { window.dispatchEvent(new StorageEvent("storage", { key: INBOX_KEY })); } catch {}
}
export function pushToInbox(n: CapturedNotification) {
  const list = readInbox();
  if (list.some((x) => x.id === n.id)) return;
  persistInbox([n, ...list]);
}
export function clearInbox() { persistInbox([]); }
export function removeFromInbox(id: string) {
  persistInbox(readInbox().filter((n) => n.id !== id));
}

export function useInbox() {
  const [list, setList] = useState<CapturedNotification[]>([]);
  useEffect(() => {
    setList(readInbox());
    const onStorage = (e: StorageEvent) => {
      if (e.key === INBOX_KEY || e.key === null) setList(readInbox());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return {
    list,
    clear: () => { clearInbox(); setList([]); },
    remove: (id: string) => { removeFromInbox(id); setList(readInbox()); },
  };
}

/* ─────────────────── Rules ─────────────────── */

export function readRules(): NotifyRule[] {
  const raw = read(RULES_KEY, [] as NotifyRule[]);
  // Backfill delivery + coerce legacy frequencies (daily/date/range) to "always".
  let migrated = false;
  const out = raw.map((r) => {
    let next = r;
    if (!next.delivery) { next = { ...next, delivery: "notification" as const }; migrated = true; }
    if (next.frequency && next.frequency !== "once" && next.frequency !== "always") {
      next = { ...next, frequency: "always" as const, rangeStart: undefined, rangeEnd: undefined };
      migrated = true;
    }
    return next;
  });
  if (migrated) { try { window.localStorage.setItem(RULES_KEY, JSON.stringify(out)); } catch {} }
  return out;
}

/** Update lastFiredAt only — used when a recurring rule ("always") triggers. */
export function markRuleTriggered(id: string) {
  const next = readRules().map((r) =>
    r.id === id ? { ...r, lastFiredAt: Date.now() } : r
  );
  persistRules(next);
}
function persistRules(next: NotifyRule[]) {
  write(RULES_KEY, next);
  try { window.dispatchEvent(new StorageEvent("storage", { key: RULES_KEY })); } catch {}
  try { window.dispatchEvent(new CustomEvent("mindrop:rules-changed")); } catch {}
}

export function useRules() {
  const [list, setList] = useState<NotifyRule[]>([]);
  useEffect(() => {
    setList(readRules());
    const onStorage = (e: StorageEvent) => {
      if (e.key === RULES_KEY || e.key === null) setList(readRules());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const upsert = useCallback((rule: NotifyRule) => {
    const cur = readRules();
    const idx = cur.findIndex((r) => r.id === rule.id);
    const withStatus: NotifyRule = { ...rule, status: rule.status ?? "active" };
    const next = idx >= 0 ? [...cur.slice(0, idx), withStatus, ...cur.slice(idx + 1)] : [withStatus, ...cur];
    persistRules(next); setList(next);
  }, []);
  const remove = useCallback((id: string) => {
    // Soft-delete: move to "erased" so users can restore.
    const next = readRules().map((r) =>
      r.id === id ? { ...r, status: "erased" as RuleStatus, statusAt: Date.now(), enabled: false } : r
    );
    persistRules(next); setList(next);
  }, []);
  const setStatus = useCallback((id: string, status: RuleStatus) => {
    const next = readRules().map((r) =>
      r.id === id
        ? {
            ...r,
            status,
            statusAt: Date.now(),
            enabled: status === "active" ? r.enabled : false,
          }
        : r
    );
    persistRules(next); setList(next);
  }, []);
  const purge = useCallback((id: string) => {
    const next = readRules().filter((r) => r.id !== id);
    persistRules(next); setList(next);
  }, []);
  const toggle = useCallback((id: string) => {
    const next = readRules().map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    persistRules(next); setList(next);
  }, []);
  return { list, upsert, remove, setStatus, purge, toggle };
}

export function setRuleStatus(id: string, status: RuleStatus) {
  const next = readRules().map((r) =>
    r.id === id
      ? { ...r, status, statusAt: Date.now(), enabled: status === "active" ? r.enabled : false }
      : r
  );
  persistRules(next);
}

export function markRuleFired(id: string) {
  const next = readRules().map((r) =>
    r.id === id
      ? { ...r, status: "archived" as RuleStatus, statusAt: Date.now(), lastFiredAt: Date.now(), enabled: false }
      : r
  );
  persistRules(next);
}

/* ─────────────────── Known apps (derived from inbox) ─────────────────── */

export function knownAppsFromInbox(inbox: CapturedNotification[]) {
  const seen = new Map<string, string>();
  for (const n of inbox) {
    if (!seen.has(n.pkg)) seen.set(n.pkg, n.appName);
  }
  return Array.from(seen, ([pkg, appName]) => ({ pkg, appName }));
}
