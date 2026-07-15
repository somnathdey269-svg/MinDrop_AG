/**
 * On-device backup / restore for MinDrop — v2 sectioned payload.
 *
 * The export walks a curated allowlist of localStorage prefixes so we capture
 * ALL user data — memories, packs, personality, appearance, notify rules,
 * inbox, places, alarms, theme, cloud sync meta, summary config, custom packs,
 * and preferences. Only truly device-specific ephemeral flags (splash-seen,
 * permission-ack timestamps, permission cache) are excluded.
 *
 * Backwards-compatible with the v1 format (flat `data: {key: value}`) so old
 * exports still restore.
 */

const V2 = 2 as const;

// Keys we DO include (prefix match).
const INCLUDE_PREFIXES = [
  "memoryos",               // core: memories, packs, personality, rules, quiz, greetings, recall, appearance, scheduler IDs, changelog, tour
  "mindrop.notify.",         // rules + inbox + capture buffer
  "mindrop.places.",         // saved places + events + rules + migration flag
  "gmd:",                    // packs definitions, pack installs, custom packs
  "mindrop.alarm.",          // default tone, vibration preference
  "mindrop.theme.",          // country theme auto-detected + manual override
  "mindrop.appearance.",     // font + size preferences
  "mindrop.book.",           // CMS chapters read state
  "mindrop.dashboard.",      // dashboard welcome flag
  "mindrop.cloud.",          // cloud sync metadata (userId, timestamps)
  "mindrop.install_country", // install country + synced flag
  "mindrop.tier.",           // cached plan tier
  "mindrop.admin.",          // admin sidebar preferences
  "mindrop.localMigration",  // migration-ran flag
  "mindrop.summary.",        // BYOK keys, presets, active preset, category overrides, scheduler, profile, history, last report, used suggestions
] as const;

// Keys we EXPLICITLY exclude even if they match a prefix above.
const EXCLUDE_KEYS = new Set<string>([
  "mindrop.notify.web.granted",   // per-device mock permission flag
  "mindrop.places.runtime.v1",    // ephemeral geofence runtime state
]);

// Additional single keys (or prefixes) we exclude because they represent
// per-device UI/onboarding state or ephemeral runtime data — not user content.
const EXCLUDE_PREFIXES = [
  "mindrop.splash.",         // splash-screen shown flag — device-only
  "mindrop.disclosure.",     // Play Store disclosure acks — device-only
  "mindrop.perm.",           // permission ask timestamps — device-only
  "mindrop.snooze.",         // paywall snooze daily counts — runtime, not user data
  "mindrop.drive.",          // last auto-backup timestamp — device-specific, auto-updates on next sync
  "mindrop.countryThemes.",  // country themes cache — auto-regenerates from country code
] as const;

function shouldInclude(key: string): boolean {
  if (EXCLUDE_KEYS.has(key)) return false;
  if (EXCLUDE_PREFIXES.some((p) => key.startsWith(p))) return false;
  return INCLUDE_PREFIXES.some((p) => key.startsWith(p));
}

export interface BackupPayloadV2 {
  app: "MinDrop";
  version: 2;
  exportedAt: string;
  /** Coarse counts per section so a user can eyeball a file before restoring. */
  sections: {
    memories: number;
    packs: number;
    notifyRules: number;
    notifyInbox: number;
    places: number;
    other: number;
  };
  data: Record<string, unknown>;
}

// Legacy shape kept for restore-only compatibility.
interface BackupPayloadV1 {
  app: "MinDrop";
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
}
export type AnyBackup = BackupPayloadV2 | BackupPayloadV1;

function countArray(v: unknown): number {
  return Array.isArray(v) ? v.length : 0;
}

export function buildBackup(): BackupPayloadV2 {
  const data: Record<string, unknown> = {};
  if (typeof window === "undefined") {
    return {
      app: "MinDrop", version: V2, exportedAt: new Date().toISOString(),
      sections: { memories: 0, packs: 0, notifyRules: 0, notifyInbox: 0, places: 0, other: 0 },
      data,
    };
  }
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (!k || !shouldInclude(k)) continue;
    const raw = window.localStorage.getItem(k);
    try { data[k] = raw ? JSON.parse(raw) : null; } catch { data[k] = raw; }
  }
  const sections = {
    memories: countArray(data["memoryos.memories.v1"]),
    packs: countArray(data["memoryos.packs.installs.v1"]) || countArray(data["memoryos.packs.v1"]),
    notifyRules: countArray(data["mindrop.notify.rules.v1"]),
    notifyInbox: countArray(data["mindrop.notify.inbox.v1"]),
    places: countArray(data["mindrop.places.v1"]),
    other: 0,
  };
  sections.other = Object.keys(data).length - (
    (data["memoryos.memories.v1"] ? 1 : 0) +
    (data["memoryos.packs.installs.v1"] ? 1 : 0) +
    (data["memoryos.packs.v1"] ? 1 : 0) +
    (data["mindrop.notify.rules.v1"] ? 1 : 0) +
    (data["mindrop.notify.inbox.v1"] ? 1 : 0) +
    (data["mindrop.places.v1"] ? 1 : 0)
  );
  return {
    app: "MinDrop", version: V2, exportedAt: new Date().toISOString(),
    sections, data,
  };
}

async function saveOrShareFile(content: string, filename: string, mimeType: string) {
  if (typeof window === "undefined") return;

  try {
    const file = new File([content], filename, { type: mimeType });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: filename,
        text: `MinDrop backup: ${filename}`
      });
      return;
    }
  } catch (e) {
    console.warn("Share failed, falling back to download", e);
  }

  // Fallback to classic browser download
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadBackup() {
  const payload = buildBackup();
  const text = JSON.stringify(payload, null, 2);
  const filename = `mindrop-backup-${new Date().toISOString().slice(0, 10)}.json`;
  await saveOrShareFile(text, filename, "application/json");
}

// New: Build CSV backup (simple two‑column key/value)
export function buildCsvBackup(): string {
  const backup = buildBackup();
  const rows: string[] = [];
  rows.push("key,value");
  for (const [k, v] of Object.entries(backup.data)) {
    // Escape double quotes and commas in value
    const jsonStr = typeof v === "string" ? v : JSON.stringify(v);
    const safeValue = jsonStr.replace(/"/g, '""');
    rows.push(`${k},"${safeValue}"`);
  }
  return rows.join("\n");
}

// Download CSV version
export async function downloadCsvBackup() {
  const csv = buildCsvBackup();
  const filename = `mindrop-backup-${new Date().toISOString().slice(0, 10)}.csv`;
  await saveOrShareFile(csv, filename, "text/csv");
}

// RFC 4180 compliant CSV parser
export function parseCsv(text: string): [string, string][] {
  const result: [string, string][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    
    if (inQuotes) {
      if (c === '"') {
        if (next === '"') {
          field += '"';
          i++; // skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(field);
        field = "";
      } else if (c === '\r' || c === '\n') {
        row.push(field);
        field = "";
        if (row.length > 0 && (row.length > 1 || row[0] !== "")) {
          result.push([row[0], row[1] || ""]);
        }
        row = [];
        if (c === '\r' && next === '\n') {
          i++;
        }
      } else {
        field += c;
      }
    }
  }
  
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.length > 0) {
      result.push([row[0], row[1] || ""]);
    }
  }
  
  return result;
}

// Import CSV backup (expects same two‑column format)
export async function importBackupFromCsvFile(file: File): Promise<RestoreResult> {
  const text = await file.text();
  const parsed = parseCsv(text);
  const result: RestoreResult = { imported: 0, skipped: 0, errors: [] };
  
  // Skip header if present
  let start = 0;
  if (parsed.length > 0 && parsed[0][0] === "key") start = 1;
  
  for (let i = start; i < parsed.length; i++) {
    const [key, value] = parsed[i];
    if (!key) { result.skipped++; continue; }
    
    // Accept v1's raw memoryos-only dump, and v2's expanded allowlist.
    if (!shouldInclude(key) && !key.startsWith("memoryos")) { result.skipped++; continue; }
    
    try {
      window.localStorage.setItem(key, value);
      result.imported++;
    } catch (e) {
      result.errors.push(`${key}: ${(e as Error).message}`);
    }
  }
  
  // Notify listeners similar to JSON import
  try { window.dispatchEvent(new StorageEvent("storage", { key: "memoryos.memories.v1" })); } catch {}
  try { window.dispatchEvent(new StorageEvent("storage", { key: "mindrop.notify.rules.v1" })); } catch {}
  try { window.dispatchEvent(new StorageEvent("storage", { key: "mindrop.places.v1" })); } catch {}
  try { window.dispatchEvent(new StorageEvent("storage", { key: "mindrop.places.rules.v1" })); } catch {}
  return result;
}

// Schedule daily backup reminder for free users
import { LocalNotifications } from "@capacitor/local-notifications";
export async function scheduleDailyBackupNotification() {
  // Cancel any existing scheduled notifications with same tag
  await LocalNotifications.cancel({ notifications: [{ id: 9999 }] }).catch(() => {});
  await LocalNotifications.schedule({
    notifications: [{
      id: 9999,
      title: "Backup Reminder",
      body: "Export your MinDrop data to keep it safe.",
      schedule: { at: new Date(Date.now() + 1000 * 60 * 5) }, // first in 5 min, then repeat daily via repeat
      sound: null,
      actionTypeId: "backup_reminder",
      // repeat daily
      every: "day",
    }]
  });
}

export interface RestoreResult {
  imported: number;
  skipped: number;
  errors: string[];
}

export async function importBackupFromFile(file: File): Promise<RestoreResult> {
  const text = await file.text();
  return importBackupFromText(text);
}

export function importBackupFromText(text: string): RestoreResult {
  let raw: unknown;
  try { raw = JSON.parse(text); }
  catch { throw new Error("This file isn't valid JSON."); }

  const p = raw as { app?: string; version?: number; data?: Record<string, unknown> } | null;
  if (!p || p.app !== "MinDrop" || !p.data) {
    throw new Error("Not a MinDrop backup file.");
  }
  if (p.version !== 1 && p.version !== 2) {
    throw new Error(`Backup version ${p.version} is newer than this build supports.`);
  }

  const result: RestoreResult = { imported: 0, skipped: 0, errors: [] };
  for (const [k, v] of Object.entries(p.data)) {
    // Accept v1's raw memoryos-only dump, and v2's expanded allowlist.
    if (!shouldInclude(k) && !k.startsWith("memoryos")) { result.skipped++; continue; }
    try {
      const value = typeof v === "string" ? v : JSON.stringify(v);
      window.localStorage.setItem(k, value);
      result.imported++;
    } catch (err) {
      result.errors.push(`${k}: ${(err as Error).message}`);
    }
  }

  // Nudge listeners (useMemories, scheduler, notify engine) to re-read.
  try { window.dispatchEvent(new StorageEvent("storage", { key: "memoryos.memories.v1" })); } catch {}
  try { window.dispatchEvent(new StorageEvent("storage", { key: "mindrop.notify.rules.v1" })); } catch {}
  try { window.dispatchEvent(new StorageEvent("storage", { key: "mindrop.places.v1" })); } catch {}
  try { window.dispatchEvent(new StorageEvent("storage", { key: "mindrop.places.rules.v1" })); } catch {}

  return result;
}
