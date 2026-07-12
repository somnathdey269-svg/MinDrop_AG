import { useEffect, useState, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { listCountryThemes } from "./countryThemes.functions";
import { resolveCountry } from "./country.functions";
import {
  COUNTRY_OVERRIDE_KEY,
  COUNTRY_STORAGE_KEY,
  INDIA_RESOLVED,
  flagEmoji,
  padPalette,
  type CountryTheme,
  type ResolvedPalette,
} from "./palette";

/* ---------------- localStorage store (subscribable) ---------------- */

const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}

function readLS(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeLS(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value == null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
  emit();
}

function subscribeCountry(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === COUNTRY_STORAGE_KEY || e.key === COUNTRY_OVERRIDE_KEY) cb();
  };
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}

function getCurrentCode(): string {
  const override = readLS(COUNTRY_OVERRIDE_KEY);
  if (override && /^[A-Z]{2}$/.test(override)) return override;
  const auto = readLS(COUNTRY_STORAGE_KEY);
  if (auto && /^[A-Z]{2}$/.test(auto)) return auto;
  return "IN";
}

export function setCountryOverride(code: string | null) {
  if (code === null) writeLS(COUNTRY_OVERRIDE_KEY, null);
  else if (/^[A-Z]{2}$/.test(code.toUpperCase())) writeLS(COUNTRY_OVERRIDE_KEY, code.toUpperCase());
}

export function getCountryOverride(): string | null {
  const v = readLS(COUNTRY_OVERRIDE_KEY);
  return v && /^[A-Z]{2}$/.test(v) ? v : null;
}

/* ---------------- one-time IP-based detection ---------------- */

let detectionStarted = false;
export function ensureCountryDetected() {
  if (typeof window === "undefined") return;
  if (detectionStarted) return;
  detectionStarted = true;
  const auto = readLS(COUNTRY_STORAGE_KEY);
  if (auto && /^[A-Z]{2}$/.test(auto)) return;
  // Fire once, silently.
  resolveCountry()
    .then((r) => {
      const cc = String(r?.code || "").toUpperCase();
      if (/^[A-Z]{2}$/.test(cc)) writeLS(COUNTRY_STORAGE_KEY, cc);
    })
    .catch(() => {
      /* silent — India fallback stays in place */
    });
}

/* ---------------- hooks ---------------- */

const THEMES_CACHE_KEY = "mindrop.countryThemes.v1";

const OFFLINE_FALLBACK_THEMES: CountryTheme[] = [
  { code: 'IN', name: 'India',          colors: ["#FF671F","#046A38","#06038D"] },
  { code: 'US', name: 'United States',  colors: ["#B31942","#0A3161"] },
  { code: 'GB', name: 'United Kingdom', colors: ["#012169","#C8102E"] },
  { code: 'JP', name: 'Japan',          colors: ["#BC002D"] },
  { code: 'FR', name: 'France',         colors: ["#002395","#ED2939"] },
  { code: 'DE', name: 'Germany',        colors: ["#000000","#DD0000","#FFCE00"] },
  { code: 'BR', name: 'Brazil',         colors: ["#009C3B","#FFDF00","#002776"] },
  { code: 'CA', name: 'Canada',         colors: ["#FF0000"] },
  { code: 'AU', name: 'Australia',      colors: ["#012169","#E4002B"] },
  { code: 'NZ', name: 'New Zealand',    colors: ["#012169","#C8102E"] },
  { code: 'ZA', name: 'South Africa',   colors: ["#007A4D","#FFB612","#DE3831"] },
  { code: 'MX', name: 'Mexico',         colors: ["#006847","#CE1126"] },
  { code: 'AR', name: 'Argentina',      colors: ["#74ACDF","#F6B40E"] },
  { code: 'IT', name: 'Italy',          colors: ["#008C45","#CD212A"] },
  { code: 'ES', name: 'Spain',          colors: ["#AA151B","#F1BF00"] },
  { code: 'NL', name: 'Netherlands',    colors: ["#AE1C28","#21468B"] },
  { code: 'SE', name: 'Sweden',         colors: ["#006AA7","#FECC00"] },
  { code: 'NO', name: 'Norway',         colors: ["#EF2B2D","#002868"] },
  { code: 'FI', name: 'Finland',        colors: ["#003580"] },
  { code: 'DK', name: 'Denmark',        colors: ["#C60C30"] },
  { code: 'IE', name: 'Ireland',        colors: ["#169B62","#FF883E"] },
  { code: 'PT', name: 'Portugal',       colors: ["#046A38","#DA291C","#FFE900"] },
  { code: 'GR', name: 'Greece',         colors: ["#0D5EAF"] },
  { code: 'TR', name: 'Turkey',         colors: ["#E30A17"] },
  { code: 'RU', name: 'Russia',         colors: ["#0033A0","#D52B1E"] },
  { code: 'UA', name: 'Ukraine',        colors: ["#0057B7","#FFDD00"] },
  { code: 'PL', name: 'Poland',         colors: ["#DC143C"] },
  { code: 'CN', name: 'China',          colors: ["#EE1C25","#FFFF00"] },
  { code: 'KR', name: 'South Korea',    colors: ["#003478","#C60C30"] },
  { code: 'SG', name: 'Singapore',      colors: ["#EF3340"] },
  { code: 'MY', name: 'Malaysia',       colors: ["#010066","#CC0001","#FFCC00"] },
  { code: 'TH', name: 'Thailand',       colors: ["#A51931","#F4F5F8","#2D2A4A"] },
  { code: 'VN', name: 'Vietnam',        colors: ["#DA251D","#FFFF00"] },
  { code: 'ID', name: 'Indonesia',      colors: ["#FF0000"] },
  { code: 'PH', name: 'Philippines',    colors: ["#0038A8","#CE1126","#FCD116"] },
  { code: 'PK', name: 'Pakistan',       colors: ["#01411C","#FFFFFF"] },
  { code: 'BD', name: 'Bangladesh',     colors: ["#006A4E","#F42A41"] },
  { code: 'LK', name: 'Sri Lanka',      colors: ["#8D153A","#FFBE29","#00534E"] },
  { code: 'NP', name: 'Nepal',          colors: ["#DC143C","#003893"] },
];

function readThemesCache(): CountryTheme[] | undefined {
  const raw = readLS(THEMES_CACHE_KEY);
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as CountryTheme[]) : undefined;
  } catch { return undefined; }
}

export function useCountryThemes() {
  return useQuery<CountryTheme[]>({
    queryKey: ["country-themes"],
    queryFn: async () => {
      try {
        const data = (await listCountryThemes()) as CountryTheme[];
        if (data && data.length > 0) {
          try { writeLS(THEMES_CACHE_KEY, JSON.stringify(data)); } catch {}
          return data;
        }
      } catch (e) {
        console.warn("Failed to fetch themes from server, using local fallback:", e);
      }
      return OFFLINE_FALLBACK_THEMES;
    },
    initialData: () => {
      const cached = readThemesCache();
      return cached && cached.length > 0 ? cached : OFFLINE_FALLBACK_THEMES;
    },
    staleTime: 60 * 60 * 1000, // 1h — palette rarely changes
    gcTime: 24 * 60 * 60 * 1000,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 5_000),
  });
}

/** Reactive current country code (respects override + auto-detect). */
export function useCurrentCountryCode(): string {
  const subscribe = subscribeCountry;
  const getSnapshot = getCurrentCode;
  const getServerSnapshot = () => "IN";
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export type UseCountryTheme = ResolvedPalette & {
  code: string;
  name: string;
  flag: string;
  raw: string[]; // 1..3 raw flag colors before padding
  isFallback: boolean;
};

export function useCountryTheme(): UseCountryTheme {
  const code = useCurrentCountryCode();
  const { data } = useCountryThemes();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const themes: CountryTheme[] = data ?? [];
  const match = themes.find((t) => t.code === code);
  const fallback = themes.find((t) => t.code === "IN");
  const chosen = match ?? fallback;
  const raw = chosen?.colors ?? ["#FF671F", "#046A38", "#06038D"];
  const palette = padPalette(raw);

  // Apply colors to document root dynamically to theme all pages reactively
  useEffect(() => {
    if (!mounted || typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--brand", palette.accent1);
    root.style.setProperty("--accent-warm", palette.accent2);
  }, [mounted, palette.accent1, palette.accent2]);

  // Before client mount → India (avoids hydration mismatch on SSR).
  if (!mounted) {
    return {
      ...INDIA_RESOLVED,
      code: "IN",
      name: "India",
      flag: flagEmoji("IN"),
      raw: ["#FF671F", "#046A38", "#06038D"],
      isFallback: true,
    };
  }

  return {
    ...palette,
    code: chosen?.code ?? "IN",
    name: chosen?.name ?? "India",
    flag: flagEmoji(chosen?.code ?? "IN"),
    raw,
    isFallback: !match,
  };
}
