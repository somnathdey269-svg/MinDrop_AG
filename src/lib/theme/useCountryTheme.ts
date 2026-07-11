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

function readThemesCache(): CountryTheme[] | undefined {
  const raw = readLS(THEMES_CACHE_KEY);
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CountryTheme[]) : undefined;
  } catch { return undefined; }
}

export function useCountryThemes() {
  return useQuery<CountryTheme[]>({
    queryKey: ["country-themes"],
    queryFn: async () => {
      const data = (await listCountryThemes()) as CountryTheme[];
      try { writeLS(THEMES_CACHE_KEY, JSON.stringify(data)); } catch {}
      return data;
    },
    initialData: readThemesCache,
    staleTime: 60 * 60 * 1000, // 1h — palette rarely changes
    gcTime: 24 * 60 * 60 * 1000,
    retry: 3,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 15_000),
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

  const themes: CountryTheme[] = data ?? [];
  const match = themes.find((t) => t.code === code);
  const fallback = themes.find((t) => t.code === "IN");
  const chosen = match ?? fallback;
  const raw = chosen?.colors ?? ["#FF671F", "#046A38", "#06038D"];
  const palette = padPalette(raw);

  return {
    ...palette,
    code: chosen?.code ?? "IN",
    name: chosen?.name ?? "India",
    flag: flagEmoji(chosen?.code ?? "IN"),
    raw,
    isFallback: !match,
  };
}
