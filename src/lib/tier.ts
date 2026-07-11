// Tier detection and quota limits.
// Anonymous / Signed-in free / Premium.
// Limits are fetched from the `plan_limits` table so a superadmin can
// tune them from the admin console without a redeploy.
import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getMyPremiumStatus } from "@/lib/payments.functions";
import { getPlanLimits, type PlanLimitRow } from "@/lib/limits.functions";

export type Tier = "anon" | "free" | "premium";

export interface TierLimits {
  snoozePerDay: number;
  notifyRules: number;
  places: number;
}

/** Fallback used until the plan_limits query resolves (or if it fails). */
const FALLBACK_LIMITS: Record<Tier, TierLimits> = {
  anon:    { snoozePerDay: 3,        notifyRules: 3,        places: 3        },
  free:    { snoozePerDay: 5,        notifyRules: 5,        places: 5        },
  premium: { snoozePerDay: Infinity, notifyRules: Infinity, places: Infinity },
};

/** Kept for legacy imports. Prefer `useTier().limits`. */
export const TIER_LIMITS = FALLBACK_LIMITS;

const PLAN_CACHE_KEY = "mindrop.tier.plan.v1";

function readCache(): "free" | "premium" | null {
  try {
    const v = window.localStorage.getItem(PLAN_CACHE_KEY);
    return v === "premium" || v === "free" ? v : null;
  } catch { return null; }
}
function writeCache(plan: "free" | "premium" | null) {
  try {
    if (plan) window.localStorage.setItem(PLAN_CACHE_KEY, plan);
    else window.localStorage.removeItem(PLAN_CACHE_KEY);
  } catch {}
}

function toLimit(n: number): number {
  return n < 0 ? Infinity : n;
}

function resolveLimits(rows: PlanLimitRow[] | undefined, tier: Tier): TierLimits {
  if (!rows || rows.length === 0) return FALLBACK_LIMITS[tier];
  const map = new Map(rows.map((r) => [r.key, r]));
  const pick = (key: string): number | null => {
    const row = map.get(key);
    if (!row) return null;
    const v = tier === "anon" ? row.anon_limit : tier === "free" ? row.free_limit : row.premium_limit;
    return toLimit(v);
  };
  return {
    snoozePerDay: pick("later_per_day")      ?? FALLBACK_LIMITS[tier].snoozePerDay,
    notifyRules:  pick("notify_rules_total") ?? FALLBACK_LIMITS[tier].notifyRules,
    places:       pick("places_total")       ?? FALLBACK_LIMITS[tier].places,
  };
}

/** Fetch dynamic limits from the DB. Cached across the app. */
function usePlanLimitsQuery() {
  return useQuery({
    queryKey: ["plan-limits"],
    queryFn: async () => (await getPlanLimits()).limits,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });
}

export function useTier() {
  const [tier, setTier] = useState<Tier>("anon");
  const { data: rows } = usePlanLimitsQuery();

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!data.session) { setTier("anon"); writeCache(null); return; }

      const cached = readCache();
      if (cached) setTier(cached);
      else setTier("free");

      try {
        const res = await getMyPremiumStatus();
        if (cancelled) return;
        const plan: "free" | "premium" = res?.isActive ? "premium" : "free";
        setTier(plan);
        writeCache(plan);
      } catch { /* keep cached/free */ }
    };

    void resolve();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void resolve();
      }
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  const limits = resolveLimits(rows, tier);
  return { tier, limits };
}

/* ─────────── Snooze counter (per-day, localStorage) ─────────── */

const SNOOZE_KEY_PREFIX = "mindrop.snooze.count.";
function todayKey() {
  const d = new Date();
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return `${SNOOZE_KEY_PREFIX}${iso}`;
}
export function readSnoozeCountToday(): number {
  try {
    const raw = window.localStorage.getItem(todayKey());
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch { return 0; }
}
export function incrementSnoozeCount() {
  try { window.localStorage.setItem(todayKey(), String(readSnoozeCountToday() + 1)); } catch {}
}

/* ─────────── Shared paywall trigger ─────────── */

export type PaywallReason = "snooze" | "notify" | "places";

export interface PaywallEventDetail {
  reason: PaywallReason;
  tier: Tier;
  limit: number;
}

export const PAYWALL_EVENT = "mindrop:paywall";

export function openPaywall(detail: PaywallEventDetail) {
  try { window.dispatchEvent(new CustomEvent<PaywallEventDetail>(PAYWALL_EVENT, { detail })); } catch {}
}

/** Hook: returns a callback that checks a quota and opens paywall if over. */
export function useQuotaGuard() {
  const { tier, limits } = useTier();
  return useCallback((reason: PaywallReason, currentCount: number): boolean => {
    const limit = reason === "snooze" ? limits.snoozePerDay
                : reason === "notify" ? limits.notifyRules
                : limits.places;
    if (currentCount >= limit) {
      openPaywall({ reason, tier, limit });
      return false;
    }
    return true;
  }, [tier, limits]);
}
