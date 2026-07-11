/**
 * Debounced Google Drive auto-backup for Premium users.
 *
 * Watches localStorage for `memoryos.*`, `mindrop.*` changes and, after a
 * quiet period, pushes a fresh backup up to Drive. Runs client-side only.
 * Cadence: max once per hour, min 30 s after the last write.
 */
import { buildBackup } from "@/lib/memoryos/backup";
import { backupToDrive, getDriveStatus } from "@/lib/drive/drive.functions";

const LAST_KEY = "mindrop.drive.autoBackup.lastAt";
const MIN_INTERVAL_MS = 60 * 60 * 1000;   // 1 h
const DEBOUNCE_MS = 30_000;               // 30 s idle

let installed = false;
let idleTimer: number | undefined;
let running = false;

function isRelevantKey(k: string | null): boolean {
  if (!k) return false;
  return k.startsWith("memoryos") || k.startsWith("mindrop.notify") || k.startsWith("mindrop.places");
}

function lastAt(): number {
  try { return Number(window.localStorage.getItem(LAST_KEY) ?? "0"); } catch { return 0; }
}
function markRan() {
  try { window.localStorage.setItem(LAST_KEY, String(Date.now())); } catch {}
}

async function runBackup() {
  if (running) return;
  running = true;
  try {
    const status = await getDriveStatus();
    if (!status?.connected) return;
    const payload = JSON.stringify(buildBackup());
    await backupToDrive({ data: { payload } });
    markRan();
  } catch {
    /* silent — user will retry on next window */
  } finally {
    running = false;
  }
}

function schedule() {
  if (Date.now() - lastAt() < MIN_INTERVAL_MS) return;
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(runBackup, DEBOUNCE_MS);
}

/** Called once from the authenticated shell for Premium users. */
export function installDriveAutoBackup() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  // Wrap setItem so same-tab writes trigger too (storage event is cross-tab only).
  const orig = window.localStorage.setItem.bind(window.localStorage);
  window.localStorage.setItem = (k: string, v: string) => {
    orig(k, v);
    if (isRelevantKey(k)) schedule();
  };
  window.addEventListener("storage", (e) => { if (isRelevantKey(e.key)) schedule(); });

  // Kick a check on mount so a device that missed the window still catches up.
  schedule();
}
