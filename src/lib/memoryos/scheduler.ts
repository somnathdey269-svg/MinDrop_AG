/**
 * MinDrop scheduler — native-first.
 *
 * Native (Capacitor APK): loud reminders go through AlarmsBridge so Android
 * rings with an alarm tone even when the app is closed / phone locked / in Doze.
 *
 * Web / WebView-wrapper (Appilix): foreground-only fallback.
 */
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import type { Memory } from "./types";
import { AlarmsBridge } from "@/lib/alarms/bridge";
import { getDefaultTone } from "@/lib/alarms/prefs";

const MEM_KEY = "memoryos.memories.v1";
const MEM_CHANGED_EVENT = "memoryos:memories-changed";
const NATIVE_ALARM_IDS_KEY = "memoryos.scheduler.nativeAlarmIds.v2";
const LOCAL_NOTIFICATION_IDS_KEY = "memoryos.scheduler.localNotificationIds.v2";
const OVERDUE_GRACE_MS = 2 * 60 * 1000;

export const ALARM_EVENT = "mindrop:alarm";
export type AlarmDetail = { memory: Memory };

const isNative = () => Capacitor?.isNativePlatform?.() === true;
const isAndroid = () => Capacitor?.getPlatform?.() === "android";

/* ─────────────────── storage helpers ─────────────────── */

function readMemories(): Memory[] {
  try {
    const raw = window.localStorage.getItem(MEM_KEY);
    return raw ? (JSON.parse(raw) as Memory[]) : [];
  } catch { return []; }
}
function persist(next: Memory[]) {
  try {
    window.localStorage.setItem(MEM_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(MEM_CHANGED_EVENT));
  } catch {}
}
function markFired(id: string) {
  const list = readMemories();
  persist(list.map((m) => (m.id === id ? { ...m, firedAt: new Date().toISOString() } : m)));
}

/* ─────────────────── numeric id (Capacitor needs int32) ─────────────────── */

function toIntId(id: string, salt = 0): number {
  let h = salt;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

function readStringList(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

function writeStringList(key: string, ids: string[]) {
  try { window.localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids)))); } catch {}
}

function readNumberList(key: string): number[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch { return []; }
}

function writeNumberList(key: string, ids: number[]) {
  try { window.localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids)))); } catch {}
}

function forgetNativeAlarmId(id: string) {
  writeStringList(NATIVE_ALARM_IDS_KEY, readStringList(NATIVE_ALARM_IDS_KEY).filter((x) => x !== id));
}

function memoryIdFromNativeEvent(id: string, extra?: string): string {
  if (extra) {
    try {
      const parsed = JSON.parse(extra) as { memoryId?: string };
      if (parsed?.memoryId) return parsed.memoryId;
    } catch {}
  }
  return id;
}

/* ─────────────────── native path ─────────────────── */

let channelsReady = false;
async function ensureChannels() {
  if (channelsReady || !isAndroid()) { channelsReady = true; return; }
  try {
    await LocalNotifications.createChannel({
      id: "mindrop-alarm",
      name: "MinDrop alarms",
      description: "Loud alarms for critical reminders",
      importance: 5, // MAX — heads-up + sound
      visibility: 1, // PUBLIC — show on lock screen
      vibration: true,
    });
    await LocalNotifications.createChannel({
      id: "mindrop-nudge",
      name: "MinDrop nudges",
      description: "Gentle reminders",
      importance: 4, // HIGH
      visibility: 1,
      vibration: true,
    });
  } catch {}
  channelsReady = true;
}

async function nativeSyncAll() {
  await ensureChannels();
  const list = readMemories();
  const useAlarmsBridge = AlarmsBridge.isNative();
  const defaultTone = (() => { try { return getDefaultTone(); } catch { return "classic"; } })();
  const nativeFiredIds = useAlarmsBridge
    ? new Set((await AlarmsBridge.getFiredLog()).map((entry) => entry.id))
    : new Set<string>();

  // Track only scheduler-owned IDs. Blanket cancelAll() was erasing valid
  // native alarms during the same minute they were supposed to ring.
  const previousNativeAlarmIds = readStringList(NATIVE_ALARM_IDS_KEY);
  const nextNativeAlarmIds: string[] = [];
  const protectedNativeAlarmIds = new Set<string>();
  const previousLocalIds = readNumberList(LOCAL_NOTIFICATION_IDS_KEY);
  const nextLocalIds: number[] = [];

  try {
    if (previousLocalIds.length) {
      await LocalNotifications.cancel({
        notifications: previousLocalIds.map((id) => ({ id })),
      });
    }
  } catch {}

  const now = Date.now();
  const toSchedule: any[] = [];

  for (const m of list) {
    if (!m.dueAt || m.archivedAt || m.deletedAt) continue;
    const isAlarm = m.notify === "alarm";
    if (isAlarm && nativeFiredIds.has(m.id)) {
      // Native receiver may fire while the WebView is closed. Reconcile on
      // next sync so the app does not schedule a second ringing alarm.
      protectedNativeAlarmIds.add(m.id);
      if (!m.firedAt) markFired(m.id);
      continue;
    }
    if (isAlarm && m.firedAt) {
      // Do not call cancelAlarm here: cancelling also stops the currently
      // ringing foreground service. Stop/Snooze actions clean up native state.
      protectedNativeAlarmIds.add(m.id);
      continue;
    }
    if (m.firedAt) continue;
    const dueAt = new Date(m.dueAt).getTime();
    if (Number.isNaN(dueAt)) continue;
    if (dueAt <= now - OVERDUE_GRACE_MS) {
      if (isAlarm) protectedNativeAlarmIds.add(m.id);
      markFired(m.id);
      continue;
    }
    if (dueAt <= now) {
      if (isAlarm) protectedNativeAlarmIds.add(m.id);
      markFired(m.id);
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        window.dispatchEvent(new CustomEvent<AlarmDetail>(ALARM_EVENT, { detail: { memory: m } }));
      }
      continue;
    }
    const at = dueAt;

    const title = (isAlarm ? "⏰ " : "") + (m.text || (isAlarm ? "MinDrop alarm" : "MinDrop reminder"));
    const body = m.date || "It's time.";

    if (isAlarm && useAlarmsBridge) {
      // Loud ringing path — native AlarmsBridge handles tone, full-screen intent, snooze actions.
      nextNativeAlarmIds.push(m.id);
      const res = await AlarmsBridge.scheduleAlarm({
        id: m.id,
        at,
        title,
        body,
        delivery: "alarm",
        toneId: defaultTone,
        extra: { memoryId: m.id, kind: "alarm" },
      });
      if (res.reason && res.reason !== "ok") {
        try {
          window.dispatchEvent(new CustomEvent("mindrop:alarm-blocked", {
            detail: { title: m.text || "Alarm", reason: res.reason },
          }));
        } catch {}
      }
      continue;
    }

    // Silent/notification path (or fallback when AlarmsBridge unavailable).
    const channelId = isAlarm ? "mindrop-alarm" : "mindrop-nudge";
    const localId = toIntId(m.id, 0);
    nextLocalIds.push(localId);
    toSchedule.push({
      id: localId,
      title, body,
      schedule: { at: new Date(at), allowWhileIdle: true },
      channelId,
      extra: { memoryId: m.id, kind: m.notify || "notification" },
    });
  }

  if (toSchedule.length) {
    try { await LocalNotifications.schedule({ notifications: toSchedule }); }
    catch (e) { console.warn("[scheduler] schedule failed", e); }
  }

  if (useAlarmsBridge) {
    const desired = new Set(nextNativeAlarmIds);
    await Promise.all(previousNativeAlarmIds
      .filter((id) => !desired.has(id) && !protectedNativeAlarmIds.has(id))
      .map((id) => AlarmsBridge.cancelAlarm(id)));
  }
  writeStringList(NATIVE_ALARM_IDS_KEY, nextNativeAlarmIds);
  writeNumberList(LOCAL_NOTIFICATION_IDS_KEY, nextLocalIds);
}

async function ensureNativePermission() {
  try {
    const p = await LocalNotifications.checkPermissions();
    if (p.display !== "granted") await LocalNotifications.requestPermissions();
  } catch {}
}

/* ─────────────────── web / WebView fallback ─────────────────── */

async function webFire(m: Memory) {
  markFired(m.id);
  try {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(m.text || "MinDrop reminder", {
        body: m.date || "It's time.",
        tag: `mindrop-${m.id}`,
        silent: m.notify !== "alarm",
      });
    }
  } catch {}
  window.dispatchEvent(new CustomEvent<AlarmDetail>(ALARM_EVENT, { detail: { memory: m } }));
}

const webTimers = new Map<string, number>();
function webScheduleAll() {
  webTimers.forEach((t) => window.clearTimeout(t));
  webTimers.clear();
  const now = Date.now();
  for (const m of readMemories()) {
    if (!m.dueAt || m.archivedAt || m.deletedAt || m.firedAt) continue;
    const at = new Date(m.dueAt).getTime();
    if (Number.isNaN(at)) continue;
    const delta = at - now;
    if (delta <= 0) {
      if (now - at < 24 * 60 * 60 * 1000) webFire(m); else markFired(m.id);
      continue;
    }
    const wait = Math.min(delta, 24 * 60 * 60 * 1000);
    const id = window.setTimeout(() => {
      const fresh = readMemories().find((x) => x.id === m.id);
      if (!fresh || fresh.archivedAt || fresh.deletedAt || fresh.firedAt) return;
      webFire(fresh);
    }, wait);
    webTimers.set(m.id, id);
  }
}

/* ─────────────────── public ─────────────────── */

let started = false;
let nativeSyncing = false;
let nativeSyncQueued = false;

function requestNativeSync() {
  if (nativeSyncing) { nativeSyncQueued = true; return; }
  nativeSyncing = true;
  void nativeSyncAll().finally(() => {
    nativeSyncing = false;
    if (nativeSyncQueued) {
      nativeSyncQueued = false;
      requestNativeSync();
    }
  });
}

function rescan() { isNative() ? requestNativeSync() : webScheduleAll(); }

export function rescanScheduler() { rescan(); }

/** Snooze a memory: reschedule it `minutes` from now and clear firedAt. */
export function snoozeMemory(id: string, minutes = 5) {
  const list = readMemories();
  const nextDue = new Date(Date.now() + minutes * 60_000).toISOString();
  persist(list.map((m) => (m.id === id ? { ...m, dueAt: nextDue, firedAt: undefined } : m)));
  rescan();
}

async function reconcileStoppedAlarms() {
  if (!isNative()) return;
  try {
    const res = await AlarmsBridge.getStoppedAlarms();
    let changed = false;
    
    // 1. Process stopped alarms
    if (res.stoppedIds && res.stoppedIds.length > 0) {
      const list = readMemories();
      const now = new Date().toISOString();
      const updated = list.map((m) =>
        res.stoppedIds.includes(m.id) ? { ...m, archivedAt: now } : m
      );
      persist(updated);
      changed = true;
    }
    
    // 2. Process snoozed alarms
    if (res.snoozed && res.snoozed.length > 0) {
      const list = readMemories();
      const now = Date.now();
      let updated = [...list];
      
      res.snoozed.forEach((item) => {
        const nextDue = new Date(now + item.minutes * 60_000).toISOString();
        updated = updated.map((m) =>
          m.id === item.id ? { ...m, dueAt: nextDue, firedAt: undefined } : m
        );
      });
      
      persist(updated);
      changed = true;
    }
    
    if (changed) {
      await AlarmsBridge.clearStoppedAlarms();
      rescan();
    }
  } catch (e) {
    console.warn("[scheduler] reconcileStoppedAlarms failed", e);
  }
}

export function startScheduler() {
  if (started || typeof window === "undefined") return;
  started = true;

  if (isNative()) {
    // Do NOT request notification permission on boot — user grants via /permissions
    // or the JIT prompt shown at capture time.
    rescan();
    reconcileStoppedAlarms();

    LocalNotifications.addListener("localNotificationReceived", (n) => {
      const memId = (n.extra as any)?.memoryId as string | undefined;
      if (!memId) return;
      markFired(memId);
      const mem = readMemories().find((x) => x.id === memId);
      if (mem) window.dispatchEvent(new CustomEvent<AlarmDetail>(ALARM_EVENT, { detail: { memory: mem } }));
    }).catch(() => {});
    LocalNotifications.addListener("localNotificationActionPerformed", (n) => {
      const memId = (n.notification.extra as any)?.memoryId as string | undefined;
      if (memId) {
        markFired(memId);
        try { window.sessionStorage.setItem("mindrop:openMemory", memId); } catch {}
      }
    }).catch(() => {});
    const offNativeFired = AlarmsBridge.onFired((ev) => {
      const memId = memoryIdFromNativeEvent(ev.id, ev.extra);
      forgetNativeAlarmId(memId);
      markFired(memId);
      const mem = readMemories().find((x) => x.id === memId);
      if (mem) window.dispatchEvent(new CustomEvent<AlarmDetail>(ALARM_EVENT, { detail: { memory: mem } }));
    });
    window.addEventListener("pagehide", offNativeFired, { once: true });
  } else {
    rescan();
  }

  window.addEventListener("storage", (e) => { if (e.key === MEM_KEY) rescan(); });
  window.addEventListener(MEM_CHANGED_EVENT, rescan);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      rescan();
      reconcileStoppedAlarms();
    }
  });
  window.setInterval(rescan, 30_000);
}

