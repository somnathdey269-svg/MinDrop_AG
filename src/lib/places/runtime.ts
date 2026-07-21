import { evalTargets, expandTargets } from "./engine";
import { persistRuntime, pushEvent, readPlaces, readRuntime } from "./store";
import { readPlaceRules } from "./rules";
import { mirrorPlaceFireToInbox } from "./mirror";
import { PlacesBridge, type PlaceTransition } from "./bridge";
import type { Place, PlaceEvent, PlaceRule } from "./types";

let watchId: number | null = null;
let started = false;
let unsubTransition: (() => void) | null = null;
let unsubStorage: (() => void) | null = null;

const PLACES_KEY = "mindrop.places.v1";
const RULES_KEY = "mindrop.places.rules.v1";

async function notify(place: Place, rule: PlaceRule | null, kind: "enter" | "exit") {
  const title = kind === "enter" ? `Arrived at ${place.name}` : `Left ${place.name}`;
  const body = rule
    ? ((kind === "enter" ? (rule.remindNote || rule.message) : (rule.exitMessage || rule.remindNote || rule.message)))
    : (kind === "enter" ? place.message : (place.exitMessage || place.message));
  const delivery = rule?.delivery ?? "notification";
  // Prefer native AlarmsBridge so we get loud ringing (alarm) or a proper
  // heads-up (notify) even when the WebView is backgrounded / killed.
  try {
    const { AlarmsBridge } = await import("@/lib/alarms/bridge");
    if (AlarmsBridge.isNative()) {
      await AlarmsBridge.scheduleAlarm({
        id: `place-${place.id}-${rule?.id ?? "x"}-${kind}-${Date.now()}`,
        at: Date.now(),
        title,
        body: (body || "").slice(0, 240),
        delivery: delivery === "alarm" ? "alarm" : "notify",
        extra: { source: "places", placeId: place.id, ruleId: rule?.id, kind },
      });
      return;
    }
  } catch { /* fall through to web notification */ }
  try {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body: body || "", tag: `place-${place.id}-${rule?.id ?? "x"}-${kind}` });
    }
  } catch { /* ignore */ }
}

function recordFire(
  place: Place,
  rule: PlaceRule | null,
  kind: "enter" | "exit",
  lat: number,
  lng: number,
  at: number,
) {
  const ev: PlaceEvent = {
    id: `pe-${at}-${place.id}-${rule?.id ?? "x"}`,
    placeId: place.id,
    ruleId: rule?.id,
    kind,
    at: new Date(at).toISOString(),
    lat, lng,
    delivered: true,
  };
  pushEvent(ev);
  mirrorPlaceFireToInbox(place, rule, kind, at);
  void notify(place, rule, kind);
}

/* ─────────────────── Web (foreground) path ─────────────────── */

function onPosition(pos: GeolocationPosition) {
  const places = readPlaces();
  const rules = readPlaceRules();
  const targets = expandTargets(places, rules).filter(
    (t) => !t.paused && !t.archivedAt && !t.deletedAt,
  );
  if (targets.length === 0) return;
  const state = readRuntime();
  const { fires, next } = evalTargets(
    Date.now(),
    { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy },
    targets,
    state,
  );
  persistRuntime(next);
  const placesById = new Map(places.map((p) => [p.id, p]));
  const rulesById = new Map(rules.map((r) => [r.id, r]));
  for (const f of fires) {
    const p = placesById.get(f.placeId);
    if (!p) continue;
    recordFire(p, rulesById.get(f.ruleId) ?? null, f.kind, f.lat, f.lng, f.at);
  }
}

function startWebWatch() {
  // On web platform (website view), do NOT request or watch browser geolocation permissions.
  // Geolocation features are handled natively in the mobile app.
  return;
}

/* ─────────────────── Native (OS geofence) path ─────────────────── */

function onNativeTransition(t: PlaceTransition) {
  const place = readPlaces().find((p) => p.id === t.placeId);
  if (!place || place.paused || place.archivedAt || place.deletedAt) return;
  // Fire every active rule attached to this place matching the transition kind.
  const rules = readPlaceRules().filter(
    (r) => r.placeId === place.id && !r.paused && (r.trigger === t.kind || r.trigger === "both"),
  );
  if (rules.length === 0) return;
  for (const r of rules) recordFire(place, r, t.kind, t.lat, t.lng, t.at);
}

async function syncNativeFences() {
  // For native geofencing, register one fence per place using the largest
  // radius across its rules (the JS mirror still checks individual radii).
  const places = readPlaces();
  const rules = readPlaceRules();
  const maxRadiusByPlace = new Map<string, number>();
  for (const r of rules) {
    const cur = maxRadiusByPlace.get(r.placeId) ?? 0;
    if (r.radiusM > cur) maxRadiusByPlace.set(r.placeId, r.radiusM);
  }
  const forNative: Place[] = places
    .filter((p) => maxRadiusByPlace.has(p.id) && !p.archivedAt && !p.deletedAt && !p.paused)
    .map((p) => ({ ...p, radiusM: maxRadiusByPlace.get(p.id)!, trigger: "both" }));
  await PlacesBridge.syncFences(forNative);
}

/* ─────────────────── Public ─────────────────── */

export function startPlacesRuntime() {
  if (started || typeof window === "undefined") return;
  started = true;

  if (PlacesBridge.isNative()) {
    // Do NOT request permission on boot — user grants via /permissions or JIT prompts.
    void syncNativeFences();
    unsubTransition = PlacesBridge.onTransition(onNativeTransition);
    const onStorage = (e: StorageEvent) => {
      if (e.key === PLACES_KEY || e.key === RULES_KEY || e.key === null) void syncNativeFences();
    };
    window.addEventListener("storage", onStorage);
    unsubStorage = () => window.removeEventListener("storage", onStorage);
  } else {
    startWebWatch();
  }
}

export function stopPlacesRuntime() {
  if (watchId != null && "geolocation" in navigator) {
    try { navigator.geolocation.clearWatch(watchId); } catch {}
    watchId = null;
  }
  unsubTransition?.(); unsubTransition = null;
  unsubStorage?.(); unsubStorage = null;
  started = false;
}

/** Manually fire a place's first rule for testing. */
export function testFire(place: Place) {
  const rule = readPlaceRules().find((r) => r.placeId === place.id) ?? null;
  recordFire(place, rule, "enter", place.lat, place.lng, Date.now());
}

/** Fire a specific rule for testing. */
export function testFireRule(place: Place, rule: PlaceRule) {
  recordFire(place, rule, "enter", place.lat, place.lng, Date.now());
}
