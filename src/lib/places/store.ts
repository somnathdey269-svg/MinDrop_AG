import { useCallback, useEffect, useState } from "react";
import type { Place, PlaceEvent, PlaceRule } from "./types";
import type { RuntimeState } from "./engine";
import { readPlaceRules, persistPlaceRules } from "./rules";

const PLACES_KEY = "mindrop.places.v1";
const EVENTS_KEY = "mindrop.places.events.v1";
const RUNTIME_KEY = "mindrop.places.runtime.v1";
const MIGRATED_KEY = "mindrop.places.rulesMigrated.v1";
const EVENTS_MAX = 200;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function write<T>(key: string, val: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new StorageEvent("storage", { key }));
  } catch {}
}

/* ── One-shot: split legacy Place (with message) → Place + PlaceRule ── */
function migrateLegacyPlacesToRules() {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(MIGRATED_KEY) === "1") return;
    const places = read<Place[]>(PLACES_KEY, []);
    const rules = readPlaceRules();
    const knownPlaceIds = new Set(rules.map((r) => r.placeId));
    const created: PlaceRule[] = [];
    for (const p of places) {
      if (knownPlaceIds.has(p.id)) continue;
      if (!p.message || !p.message.trim()) continue;
      created.push({
        id: `pr-${p.id}-${Date.now().toString(36)}`,
        placeId: p.id,
        radiusM: p.radiusM ?? 200,
        message: p.message,
        exitMessage: p.exitMessage,
        trigger: p.trigger ?? "enter",
        frequency: p.frequency ?? "always",
        window: p.window,
        expiresAt: p.expiresAt,
        paused: p.paused ?? false,
        createdAt: p.createdAt ?? new Date().toISOString(),
      });
    }
    if (created.length) persistPlaceRules([...created, ...rules]);
    window.localStorage.setItem(MIGRATED_KEY, "1");
  } catch {}
}

/* ── Places ───────────────────────────────────────── */

export function readPlaces(): Place[] {
  migrateLegacyPlacesToRules();
  return read(PLACES_KEY, [] as Place[]);
}
export function persistPlaces(next: Place[]) { write(PLACES_KEY, next); }

export function usePlaces() {
  const [list, setList] = useState<Place[]>([]);
  useEffect(() => {
    setList(readPlaces());
    const onStorage = (e: StorageEvent) => {
      if (e.key === PLACES_KEY || e.key === null) setList(readPlaces());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const upsert = useCallback((place: Place) => {
    const cur = readPlaces();
    const idx = cur.findIndex((p) => p.id === place.id);
    const next = idx >= 0 ? cur.map((p, i) => (i === idx ? place : p)) : [place, ...cur];
    persistPlaces(next);
  }, []);
  const remove = useCallback((id: string) => {
    persistPlaces(readPlaces().filter((p) => p.id !== id));
    // Cascade: drop any rules attached to the deleted place.
    persistPlaceRules(readPlaceRules().filter((r) => r.placeId !== id));
  }, []);
  const patch = useCallback((id: string, patch: Partial<Place>) => {
    persistPlaces(readPlaces().map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  return { list, upsert, remove, patch };
}

/* ── Events ──────────────────────────────────────── */

export function readEvents(): PlaceEvent[] { return read(EVENTS_KEY, [] as PlaceEvent[]); }
export function pushEvent(ev: PlaceEvent) {
  const next = [ev, ...readEvents()].slice(0, EVENTS_MAX);
  write(EVENTS_KEY, next);
}

export function usePlaceEvents() {
  const [list, setList] = useState<PlaceEvent[]>([]);
  useEffect(() => {
    setList(readEvents());
    const onStorage = (e: StorageEvent) => {
      if (e.key === EVENTS_KEY || e.key === null) setList(readEvents());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const clear = useCallback(() => { write(EVENTS_KEY, [] as PlaceEvent[]); setList([]); }, []);
  return { list, clear };
}

/* ── Runtime state (per-place inside/outside) ───── */

export function readRuntime(): RuntimeState { return read(RUNTIME_KEY, {} as RuntimeState); }
export function persistRuntime(state: RuntimeState) { write(RUNTIME_KEY, state); }
