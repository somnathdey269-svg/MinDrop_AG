import type { Place, PlaceRule, PlaceWindow } from "./types";

/** Distance between two lat/lng points in meters. */
export function haversineMeters(
  lat1: number, lng1: number, lat2: number, lng2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

export interface EvalRuntime {
  inside: boolean;
  insideSince?: number;
  lastLat?: number;
  lastLng?: number;
  lastFireAt?: number;
}

export type RuntimeState = Record<string, EvalRuntime>;

export const DEBOUNCE_INSIDE_MS = 20_000;
export const MIN_MOVE_M = 25;

/** Join of a Place with a PlaceRule — the evaluable unit. */
export interface EvalTarget {
  key: string;          // unique per (placeId, ruleId)
  placeId: string;
  ruleId: string;
  lat: number;
  lng: number;
  radiusM: number;
  trigger: "enter" | "exit" | "both";
  frequency: "once" | "always";
  window?: PlaceWindow;
  expiresAt?: string;
  paused: boolean;
  archivedAt?: string;
  deletedAt?: string;
}

export function expandTargets(places: Place[], rules: PlaceRule[]): EvalTarget[] {
  const placesById = new Map(places.map((p) => [p.id, p]));
  const targets: EvalTarget[] = [];
  for (const r of rules) {
    const p = placesById.get(r.placeId);
    if (!p) continue;
    targets.push({
      key: `${p.id}::${r.id}`,
      placeId: p.id,
      ruleId: r.id,
      lat: p.lat,
      lng: p.lng,
      radiusM: r.radiusM,
      trigger: r.trigger,
      frequency: r.frequency,
      window: r.window,
      expiresAt: r.expiresAt,
      paused: p.paused || r.paused,
      archivedAt: p.archivedAt,
      deletedAt: p.deletedAt,
    });
  }
  return targets;
}

export interface FireEvent {
  placeId: string;
  ruleId: string;
  kind: "enter" | "exit";
  at: number;
  lat: number;
  lng: number;
}

function withinWindow(now: Date, w?: PlaceWindow): boolean {
  if (!w) return true;
  const dow = now.getDay();
  if (w.weekdays.length > 0 && !w.weekdays.includes(dow)) return false;
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  if (w.startHHMM <= w.endHHMM) return hhmm >= w.startHHMM && hhmm <= w.endHHMM;
  return hhmm >= w.startHHMM || hhmm <= w.endHHMM;
}

function notExpired(now: Date, iso?: string): boolean {
  if (!iso) return true;
  return now.getTime() <= new Date(iso).getTime();
}

/**
 * Evaluate every active target against the current position.
 */
export function evalTargets(
  nowMs: number,
  pos: { lat: number; lng: number; accuracy?: number },
  targets: EvalTarget[],
  state: RuntimeState,
): { fires: FireEvent[]; next: RuntimeState } {
  const now = new Date(nowMs);
  const fires: FireEvent[] = [];
  const next: RuntimeState = { ...state };

  for (const t of targets) {
    if (t.paused || t.archivedAt || t.deletedAt) continue;
    if (!notExpired(now, t.expiresAt)) continue;

    const rt: EvalRuntime = next[t.key] ?? { inside: false };
    const d = haversineMeters(pos.lat, pos.lng, t.lat, t.lng);
    const insideNow = d <= t.radiusM;

    if (rt.lastLat != null && rt.lastLng != null) {
      const moved = haversineMeters(rt.lastLat, rt.lastLng, pos.lat, pos.lng);
      if (moved < MIN_MOVE_M && insideNow === rt.inside) {
        next[t.key] = { ...rt, lastLat: pos.lat, lastLng: pos.lng };
        continue;
      }
    }

    if (insideNow && !rt.inside) {
      const since = rt.insideSince ?? nowMs;
      const dwell = nowMs - since;
      if (dwell < DEBOUNCE_INSIDE_MS) {
        next[t.key] = { ...rt, insideSince: since, lastLat: pos.lat, lastLng: pos.lng };
        continue;
      }
      const allowFire =
        (t.trigger === "enter" || t.trigger === "both") &&
        withinWindow(now, t.window) &&
        (t.frequency === "always" || !rt.lastFireAt);
      if (allowFire) fires.push({ placeId: t.placeId, ruleId: t.ruleId, kind: "enter", at: nowMs, lat: pos.lat, lng: pos.lng });
      next[t.key] = { inside: true, insideSince: since, lastLat: pos.lat, lastLng: pos.lng, lastFireAt: allowFire ? nowMs : rt.lastFireAt };
      continue;
    }

    if (!insideNow && rt.inside) {
      const allowFire =
        (t.trigger === "exit" || t.trigger === "both") &&
        withinWindow(now, t.window) &&
        (t.frequency === "always" || !rt.lastFireAt);
      if (allowFire) fires.push({ placeId: t.placeId, ruleId: t.ruleId, kind: "exit", at: nowMs, lat: pos.lat, lng: pos.lng });
      next[t.key] = { inside: false, insideSince: undefined, lastLat: pos.lat, lastLng: pos.lng, lastFireAt: allowFire ? nowMs : rt.lastFireAt };
      continue;
    }

    next[t.key] = {
      inside: rt.inside,
      insideSince: insideNow ? (rt.insideSince ?? nowMs) : undefined,
      lastLat: pos.lat,
      lastLng: pos.lng,
      lastFireAt: rt.lastFireAt,
    };
  }

  return { fires, next };
}
