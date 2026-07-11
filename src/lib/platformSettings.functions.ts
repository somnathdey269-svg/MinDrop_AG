// Read and write dynamic platform settings (legal + pricing).
// Read is unauthenticated (anon SELECT policy on platform_settings).
// Writes require superadmin.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type LegalSettings = {
  supportEmail: string;
  grievanceOfficerName: string;
  grievanceOfficerEmail: string;
  companyLegalName: string;
  companyAddress: string;
  companyJurisdiction: string;
};

export type CurrencyPrice = {
  raw: number;         // computed FX price before rounding
  displayed: number;   // what customer actually pays
  symbol: string;      // display symbol
};

export type PricingSettings = {
  priceInr: number;
  displayPrices: Record<string, CurrencyPrice>;
  currencyUpdatedAt: string | null;
};

export type AllSettings = LegalSettings & PricingSettings;

const DEFAULTS: AllSettings = {
  supportEmail: "support@mindrop.in",
  grievanceOfficerName: "Somnath Dey",
  grievanceOfficerEmail: "support@mindrop.in",
  companyLegalName: "Proprietor Somnath Dey",
  companyAddress: "Earth Allysum, Vasna Bhayli Road, Vadodara, 391410, India",
  companyJurisdiction: "Vadodara, Gujarat, India",
  priceInr: 499,
  displayPrices: { INR: { raw: 499, displayed: 499, symbol: "₹" } },
  currencyUpdatedAt: null,
};

function parseNumber(v: string | null | undefined, fallback: number): number {
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
function parseJson<T>(v: string | null | undefined, fallback: T): T {
  if (!v) return fallback;
  try { return JSON.parse(v) as T; } catch { return fallback; }
}

const KEYS = [
  "support_email",
  "grievance_officer_name",
  "grievance_officer_email",
  "company_legal_name",
  "company_address",
  "company_jurisdiction",
  "premium_price_inr",
  "premium_display_prices",
  "premium_currency_updated_at",
] as const;

function rowsToSettings(rows: { key: string; value: string | null }[]): AllSettings {
  const m = new Map(rows.map((r) => [r.key, r.value]));
  return {
    supportEmail: m.get("support_email") || DEFAULTS.supportEmail,
    grievanceOfficerName: m.get("grievance_officer_name") || DEFAULTS.grievanceOfficerName,
    grievanceOfficerEmail: m.get("grievance_officer_email") || DEFAULTS.grievanceOfficerEmail,
    companyLegalName: m.get("company_legal_name") || DEFAULTS.companyLegalName,
    companyAddress: m.get("company_address") || DEFAULTS.companyAddress,
    companyJurisdiction: m.get("company_jurisdiction") || DEFAULTS.companyJurisdiction,
    priceInr: parseNumber(m.get("premium_price_inr"), DEFAULTS.priceInr),
    displayPrices: parseJson<Record<string, CurrencyPrice>>(
      m.get("premium_display_prices"),
      DEFAULTS.displayPrices,
    ),
    currencyUpdatedAt: m.get("premium_currency_updated_at") || null,
  };
}

// Public reads are served via the service-role client, but only a fixed
// whitelist of non-sensitive branding/pricing keys is ever projected out.
// The underlying table is restricted to superadmins at the RLS level.
export const getPublicSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("platform_settings")
    .select("key, value")
    .in("key", KEYS as unknown as string[]);
  if (error) throw new Error(error.message);
  return rowsToSettings((data ?? []) as { key: string; value: string | null }[]);
});

const updateSchema = z.object({
  supportEmail: z.string().email().optional(),
  grievanceOfficerName: z.string().min(1).max(200).optional(),
  grievanceOfficerEmail: z.string().email().optional(),
  companyLegalName: z.string().min(1).max(200).optional(),
  companyAddress: z.string().min(1).max(500).optional(),
  companyJurisdiction: z.string().min(1).max(200).optional(),
  priceInr: z.number().positive().max(1_000_000).optional(),
  displayPrices: z.record(z.string(), z.object({
    raw: z.number().nonnegative(),
    displayed: z.number().nonnegative(),
    symbol: z.string().min(1).max(6),
  })).optional(),
});

export const updateSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "superadmin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows: { key: string; value: string; updated_at: string; updated_by: string }[] = [];
    const now = new Date().toISOString();

    if (data.supportEmail !== undefined)
      rows.push({ key: "support_email", value: data.supportEmail, updated_at: now, updated_by: context.userId });
    if (data.grievanceOfficerName !== undefined)
      rows.push({ key: "grievance_officer_name", value: data.grievanceOfficerName, updated_at: now, updated_by: context.userId });
    if (data.grievanceOfficerEmail !== undefined)
      rows.push({ key: "grievance_officer_email", value: data.grievanceOfficerEmail, updated_at: now, updated_by: context.userId });
    if (data.companyLegalName !== undefined)
      rows.push({ key: "company_legal_name", value: data.companyLegalName, updated_at: now, updated_by: context.userId });
    if (data.companyAddress !== undefined)
      rows.push({ key: "company_address", value: data.companyAddress, updated_at: now, updated_by: context.userId });
    if (data.companyJurisdiction !== undefined)
      rows.push({ key: "company_jurisdiction", value: data.companyJurisdiction, updated_at: now, updated_by: context.userId });
    if (data.priceInr !== undefined)
      rows.push({ key: "premium_price_inr", value: String(data.priceInr), updated_at: now, updated_by: context.userId });
    if (data.displayPrices !== undefined)
      rows.push({
        key: "premium_display_prices",
        value: JSON.stringify(data.displayPrices),
        updated_at: now,
        updated_by: context.userId,
      });

    if (rows.length === 0) return { ok: true, updated: 0 };

    const { error } = await supabaseAdmin
      .from("platform_settings")
      .upsert(rows, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true, updated: rows.length };
  });
