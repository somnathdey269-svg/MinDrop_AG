// Cloud sync for the app's localStorage-backed stores.
//
// Strategy: last-write-wins per key, with a per-key timestamp.
//   - On SIGNED_IN: fetch snapshot, merge (cloud wins if newer, local wins if
//     newer or if key missing in cloud), then upload any local-newer keys.
//   - While signed in: poll known keys every 2s, upload debounced 3s.
//   - On visibilitychange hidden / beforeunload: flush pending patch.
//   - On SIGNED_OUT: stop syncing and clear the sync-owned metadata.

import { SYNCED_KEYS, type Snapshot, type SyncedKey } from "./keys";
import { getCloudSnapshot, putCloudSnapshot } from "./snapshot.functions";

const META_KEY = "mindrop.cloud.meta.v1"; // { userId, ts: {key: number} }

type Meta = { userId: string; ts: Partial<Record<string, number>> };

function readMeta(): Meta | null {
  try {
    const raw = window.localStorage.getItem(META_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Meta;
  } catch { return null; }
}
function writeMeta(meta: Meta) {
  try { window.localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch {}
}

function readLocal(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function writeLocal(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
    // Notify same-tab stores that key changed (native storage events don't fire in same tab).
    window.dispatchEvent(new StorageEvent("storage", { key, newValue: value }));
  } catch {}
}

let stopFn: (() => void) | null = null;

export function startCloudSync(userId: string) {
  if (typeof window === "undefined") return;
  stopCloudSync(); // reset

  let disposed = false;
  let flushTimer: ReturnType<typeof setTimeout> | null = null;
  let pending: Snapshot = {};

  // Track baseline: last observed local value per key so we can detect writes.
  const lastSeen: Partial<Record<string, string | null>> = {};
  for (const k of SYNCED_KEYS) lastSeen[k] = readLocal(k);

  // Initialise (or migrate) meta for this user.
  let meta = readMeta();
  if (!meta || meta.userId !== userId) meta = { userId, ts: {} };

  const queueUpload = (key: string, value: string, ts: number) => {
    pending[key] = { v: value, t: ts };
    meta!.ts[key] = ts;
    writeMeta(meta!);
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = setTimeout(flush, 3000);
  };

  const flush = async () => {
    if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
    if (Object.keys(pending).length === 0) return;
    const patch = pending;
    pending = {};
    try { await putCloudSnapshot({ data: { patch } }); }
    catch (err) {
      // Requeue on failure.
      pending = { ...patch, ...pending };
      if (!disposed) flushTimer = setTimeout(flush, 15_000);
      console.warn("[cloud-sync] upload failed", err);
    }
  };

  // 1. Initial merge from cloud.
  (async () => {
    try {
      const { snapshot } = await getCloudSnapshot();
      if (disposed) return;
      const now = Date.now();
      const uploadPatch: Snapshot = {};
      for (const key of SYNCED_KEYS) {
        const cloud = (snapshot as Snapshot)[key];
        const localVal = readLocal(key);
        const localTs = meta!.ts[key] ?? (localVal ? now : 0);
        if (cloud && (!localVal || cloud.t > localTs)) {
          // Cloud wins.
          writeLocal(key, cloud.v);
          lastSeen[key] = cloud.v;
          meta!.ts[key] = cloud.t;
        } else if (localVal && (!cloud || localTs > cloud.t)) {
          uploadPatch[key] = { v: localVal, t: localTs };
          meta!.ts[key] = localTs;
        }
      }
      writeMeta(meta!);
      if (Object.keys(uploadPatch).length) {
        pending = { ...uploadPatch, ...pending };
        flushTimer = setTimeout(flush, 500);
      }
    } catch (err) {
      console.warn("[cloud-sync] initial fetch failed", err);
    }
  })();

  // 2. Poll for local writes.
  const poll = () => {
    if (disposed) return;
    const now = Date.now();
    for (const key of SYNCED_KEYS) {
      const v = readLocal(key);
      if (v !== lastSeen[key]) {
        lastSeen[key] = v;
        if (v !== null) queueUpload(key, v, now);
      }
    }
  };
  const intervalId = window.setInterval(poll, 2000);

  const onVisibility = () => { if (document.visibilityState === "hidden") flush(); };
  const onBeforeUnload = () => { void flush(); };
  window.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("beforeunload", onBeforeUnload);

  stopFn = () => {
    disposed = true;
    window.clearInterval(intervalId);
    window.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("beforeunload", onBeforeUnload);
    if (flushTimer) clearTimeout(flushTimer);
    void flush();
  };
}

export function stopCloudSync(opts: { wipeLocal?: boolean } = {}) {
  if (stopFn) { stopFn(); stopFn = null; }
  if (opts.wipeLocal && typeof window !== "undefined") {
    for (const k of SYNCED_KEYS as readonly string[]) {
      try { window.localStorage.removeItem(k); } catch {}
    }
    try { window.localStorage.removeItem(META_KEY); } catch {}
  }
}

// Suppress unused-type warnings.
export type { SyncedKey };
