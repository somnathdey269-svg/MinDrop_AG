import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { normalizeColors, type CountryTheme } from "./palette";

/**
 * Public read: all country themes. Cached client-side.
 * Uses a server-side publishable client (anon SELECT policy).
 */
export const listCountryThemes = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
  const { data, error } = await supabase
    .from("country_themes")
    .select("code,name,colors,updated_at")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: any) => ({
    code: String(r.code),
    name: String(r.name),
    colors: Array.isArray(r.colors) ? r.colors.map((c: any) => String(c)) : [],
    updatedAt: r.updated_at ? String(r.updated_at) : undefined,
  })) satisfies CountryTheme[];
});

type SavePayload = { code: string; name: string; colors: string[] };

export const saveCountryTheme = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: SavePayload) => {
    const code = String(data?.code || "").toUpperCase().trim();
    const name = String(data?.name || "").trim();
    const colors = normalizeColors(data?.colors);
    if (!/^[A-Z]{2}$/.test(code)) throw new Error("Country code must be a 2-letter ISO code.");
    if (!name) throw new Error("Country name is required.");
    if (colors.length < 1 || colors.length > 3) {
      throw new Error("Provide between 1 and 3 valid #RRGGBB colors.");
    }
    return { code, name, colors };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin, error: roleErr } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "superadmin")
      .maybeSingle();
    if (roleErr) throw new Error(roleErr.message);
    if (!isAdmin) throw new Error("Superadmin only.");

    const { error } = await supabase
      .from("country_themes")
      .upsert(
        {
          code: data.code,
          name: data.name,
          colors: data.colors,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "code" },
      );
    if (error) throw new Error(error.message);
    return { ok: true, code: data.code };
  });

export const deleteCountryTheme = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { code: string }) => {
    const code = String(data?.code || "").toUpperCase().trim();
    if (!/^[A-Z]{2}$/.test(code)) throw new Error("Invalid code.");
    if (code === "IN") throw new Error("India is the fallback palette and cannot be removed.");
    return { code };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin, error: roleErr } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "superadmin")
      .maybeSingle();
    if (roleErr) throw new Error(roleErr.message);
    if (!isAdmin) throw new Error("Superadmin only.");

    const { error } = await supabase.from("country_themes").delete().eq("code", data.code);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
