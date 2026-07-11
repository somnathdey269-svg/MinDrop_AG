// FX conversion: refresh displayed premium prices for supported currencies.
// Superadmin-only. Uses a free FX endpoint; on failure keeps previous map.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SUPPORTED = ["USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "JPY"] as const;
type Currency = (typeof SUPPORTED)[number] | "INR";

const SYMBOLS: Record<Currency, string> = {
  INR: "₹", USD: "$", EUR: "€", GBP: "£", AUD: "A$", CAD: "C$", SGD: "S$", AED: "AED ", JPY: "¥",
};

type FxResponse = { rates?: Record<string, number>; result?: string; base?: string };

async function fetchRates(): Promise<Record<string, number>> {
  // Primary: exchangerate.host (free, no key)
  try {
    const r = await fetch(
      `https://api.exchangerate.host/latest?base=INR&symbols=${SUPPORTED.join(",")}`,
      { headers: { accept: "application/json" } },
    );
    if (r.ok) {
      const j = (await r.json()) as FxResponse;
      if (j.rates && Object.keys(j.rates).length > 0) return j.rates;
    }
  } catch { /* fall through */ }

  // Fallback: open.er-api.com
  const r2 = await fetch("https://open.er-api.com/v6/latest/INR", {
    headers: { accept: "application/json" },
  });
  if (!r2.ok) throw new Error(`FX provider failed: ${r2.status}`);
  const j2 = (await r2.json()) as FxResponse;
  if (!j2.rates) throw new Error("FX provider returned no rates");
  return j2.rates;
}

export const refreshPremiumFxRates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "superadmin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Read base INR price
    const { data: priceRow } = await supabaseAdmin
      .from("platform_settings")
      .select("value")
      .eq("key", "premium_price_inr")
      .maybeSingle();
    const priceInr = Number(priceRow?.value || 499);

    const rates = await fetchRates();
    const map: Record<string, { raw: number; displayed: number; symbol: string }> = {
      INR: { raw: priceInr, displayed: priceInr, symbol: "₹" },
    };
    for (const cur of SUPPORTED) {
      const rate = rates[cur];
      if (!rate || !Number.isFinite(rate)) continue;
      const raw = Number((priceInr * rate).toFixed(4));
      const displayed = Math.ceil(raw); // round up to next whole unit
      map[cur] = { raw, displayed, symbol: SYMBOLS[cur] };
    }

    const nowIso = new Date().toISOString();
    const { error } = await supabaseAdmin.from("platform_settings").upsert(
      [
        {
          key: "premium_display_prices",
          value: JSON.stringify(map),
          updated_at: nowIso,
          updated_by: context.userId,
        },
        {
          key: "premium_currency_updated_at",
          value: nowIso,
          updated_at: nowIso,
          updated_by: context.userId,
        },
      ],
      { onConflict: "key" },
    );
    if (error) throw new Error(error.message);

    return { ok: true, prices: map, updatedAt: nowIso };
  });
