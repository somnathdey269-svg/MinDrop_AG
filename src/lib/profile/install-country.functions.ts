/**
 * Records the user's install country ONCE. Idempotent — subsequent calls
 * are no-ops. Reads Cloudflare's `cf-ipcountry` header, falling back to
 * Accept-Language. No IP address, city, or lat/long is ever stored.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function parseCountryFromAcceptLanguage(al: string | null): string | null {
  if (!al) return null;
  // e.g. "en-IN,en;q=0.9" → "IN"
  const first = al.split(",")[0]?.trim();
  const parts = first?.split("-");
  const cc = parts?.[1]?.slice(0, 2)?.toUpperCase();
  return cc && /^[A-Z]{2}$/.test(cc) ? cc : null;
}

export const recordInstallCountry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const req = getRequest();
    const hdr = (name: string) => req?.headers?.get?.(name) ?? null;

    const cfCountry = (hdr("cf-ipcountry") || "").toUpperCase();
    const cc = /^[A-Z]{2}$/.test(cfCountry)
      ? cfCountry
      : parseCountryFromAcceptLanguage(hdr("accept-language"));
    if (!cc) return { recorded: false as const, reason: "unknown" as const };

    // Idempotent write — only sets if still null.
    const { error } = await context.supabase
      .from("profiles")
      .update({ install_country: cc, install_country_set_at: new Date().toISOString() })
      .eq("id", context.userId)
      .is("install_country", null);
    if (error) throw new Error(error.message);
    return { recorded: true as const, country: cc };
  });
