import { get, set, del, keys } from "idb-keyval";
import type { ReportRecord } from "./types";

const META_KEY = "mindrop.summary.history.v1";
const MAX = 30;

interface Meta { records: ReportRecord[] }

function readMeta(): Meta {
  try {
    const raw = window.localStorage.getItem(META_KEY);
    return raw ? (JSON.parse(raw) as Meta) : { records: [] };
  } catch { return { records: [] }; }
}
function writeMeta(m: Meta) {
  try { window.localStorage.setItem(META_KEY, JSON.stringify(m)); } catch {}
}

export async function saveReport(record: Omit<ReportRecord, "sizeKB" | "id" | "createdAt"> & { id?: string; createdAt?: number }, blob: Blob): Promise<ReportRecord> {
  const id = record.id ?? `rep_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const full: ReportRecord = {
    id,
    date: record.date,
    createdAt: record.createdAt ?? Date.now(),
    provider: record.provider,
    model: record.model,
    sizeKB: Math.round(blob.size / 1024),
    filename: record.filename,
  };
  await set(`sum:${id}`, blob);
  const meta = readMeta();
  meta.records.unshift(full);
  if (meta.records.length > MAX) {
    const drop = meta.records.slice(MAX);
    meta.records = meta.records.slice(0, MAX);
    await Promise.all(drop.map((r) => del(`sum:${r.id}`).catch(() => {})));
  }
  writeMeta(meta);
  return full;
}

export function listReports(): ReportRecord[] {
  return readMeta().records;
}

export async function getReportBlob(id: string): Promise<Blob | null> {
  const b = await get<Blob>(`sum:${id}`);
  return b ?? null;
}

export async function deleteReport(id: string) {
  await del(`sum:${id}`).catch(() => {});
  const meta = readMeta();
  meta.records = meta.records.filter((r) => r.id !== id);
  writeMeta(meta);
}

export async function clearAllReports() {
  const meta = readMeta();
  await Promise.all(meta.records.map((r) => del(`sum:${r.id}`).catch(() => {})));
  writeMeta({ records: [] });
}

export async function hasReportForDate(date: string): Promise<boolean> {
  return listReports().some((r) => r.date === date);
}

// Housekeeping — remove orphaned IDB entries not in meta
export async function pruneOrphans() {
  try {
    const known = new Set(listReports().map((r) => `sum:${r.id}`));
    const all = await keys();
    for (const k of all) {
      const s = String(k);
      if (s.startsWith("sum:") && !known.has(s)) await del(k).catch(() => {});
    }
  } catch {}
}
