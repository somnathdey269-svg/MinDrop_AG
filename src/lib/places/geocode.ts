/**
 * Geocoding via Google Maps Geocoding API using the platform-wide
 * API key set by a superadmin (stored in Cloud, pushed read-only to
 * every browser). The user's query and coordinates go directly from
 * the browser to Google — never through our servers.
 *
 * If no key is configured, we fall back to keyless OpenStreetMap
 * Nominatim so the app keeps working while the admin sets things up.
 */
import { getGoogleMapsKey } from "@/lib/settings.functions";

export interface GeoHit {
  displayName: string;
  lat: number;
  lng: number;
}

let cachedKey: string | null = null;
let keyPromise: Promise<string> | null = null;

function envKey(): string {
  try {
    const v = (import.meta as any).env?.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    return typeof v === "string" ? v.trim() : "";
  } catch { return ""; }
}

async function loadKey(): Promise<string> {
  const fromEnv = envKey();
  if (fromEnv) return fromEnv;
  if (cachedKey !== null) return cachedKey;
  if (!keyPromise) {
    keyPromise = getGoogleMapsKey()
      .then((r) => { cachedKey = r.value ?? ""; return cachedKey; })
      .catch(() => { cachedKey = ""; return ""; });
  }
  return keyPromise;
}

/** Force a re-fetch after the admin updates the key. */
export function invalidateGoogleMapsKey() {
  cachedKey = null;
  keyPromise = null;
}

const NOMINATIM = "https://nominatim.openstreetmap.org";
let lastNominatim = 0;
async function throttle() {
  const wait = Math.max(0, 1_050 - (Date.now() - lastNominatim));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastNominatim = Date.now();
}

async function nominatimSearch(q: string, signal?: AbortSignal): Promise<GeoHit[]> {
  await throttle();
  const url = `${NOMINATIM}/search?format=json&limit=6&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) return [];
  const data = (await res.json()) as Array<{ display_name: string; lat: string; lon: string }>;
  return data.map((d) => ({ displayName: d.display_name, lat: parseFloat(d.lat), lng: parseFloat(d.lon) }));
}

async function nominatimReverse(lat: number, lng: number, signal?: AbortSignal): Promise<string> {
  await throttle();
  try {
    const res = await fetch(`${NOMINATIM}/reverse?format=json&lat=${lat}&lon=${lng}`, {
      signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    const data = (await res.json()) as { display_name?: string };
    return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

export async function searchAddress(q: string, signal?: AbortSignal): Promise<GeoHit[]> {
  const query = q.trim();
  if (query.length < 3) return [];
  const key = await loadKey();
  if (!key) return nominatimSearch(query, signal);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${encodeURIComponent(key)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) return [];
  const data = (await res.json()) as {
    status: string;
    results: Array<{ formatted_address: string; geometry: { location: { lat: number; lng: number } } }>;
  };
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    // key invalid or restricted — fall back so users aren't blocked
    return nominatimSearch(query, signal);
  }
  return data.results.slice(0, 6).map((r) => ({
    displayName: r.formatted_address,
    lat: r.geometry.location.lat,
    lng: r.geometry.location.lng,
  }));
}

export async function reverseGeocode(lat: number, lng: number, signal?: AbortSignal): Promise<string> {
  const key = await loadKey();
  if (!key) return nominatimReverse(lat, lng, signal);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${encodeURIComponent(key)}`;
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    const data = (await res.json()) as { status: string; results: Array<{ formatted_address: string }> };
    if (data.status === "OK" && data.results[0]) return data.results[0].formatted_address;
    return nominatimReverse(lat, lng, signal);
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}
