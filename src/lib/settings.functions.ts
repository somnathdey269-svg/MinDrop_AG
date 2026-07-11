import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

/**
 * PUBLIC read: returns the platform's Google Maps API key (or "").
 * This key is intended to be embedded in every browser session — the
 * only protection is the HTTP-referrer allowlist the superadmin sets
 * in Google Cloud Console. No user data is ever sent to us here.
 */
export const getGoogleMapsKey = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("platform_settings")
    .select("value")
    .eq("key", "google_maps_api_key")
    .maybeSingle();
  if (error) return { value: "" };
  return { value: (data?.value ?? "") as string };
});

const setSchema = z.object({ value: z.string().trim().max(300) });

/** Superadmin-only: write / clear the platform Google Maps key. */
export const setGoogleMapsKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => setSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: check } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "superadmin")
      .maybeSingle();
    if (!check) throw new Error("Forbidden");
    const value = data.value.length ? data.value : null;
    const { error } = await supabase
      .from("platform_settings")
      .upsert(
        { key: "google_maps_api_key", value, updated_by: userId, updated_at: new Date().toISOString() },
        { onConflict: "key" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Returns whether the current signed-in user is a superadmin. */
export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (data ?? []).map((r) => r.role as string);
    return { roles, isSuperadmin: roles.includes("superadmin") };
  });
