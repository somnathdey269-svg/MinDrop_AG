import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { FEATURES, ENVS, flagKey, type FeatureSlug, type FeatureEnv } from "@/lib/features";

const SLUG_SET = new Set<string>(FEATURES.map((f) => f.slug));
const ENV_SET = new Set<string>(ENVS);

async function assertSuperadmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "superadmin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
}

/** Superadmin-only: full matrix of every feature × env. */
export const listFeatureFlags = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertSuperadmin(context.supabase, context.userId);
    const keys = FEATURES.flatMap((f) => ENVS.map((e) => flagKey(f.slug, e)));
    const { data } = await context.supabase
      .from("platform_settings")
      .select("key,value")
      .in("key", keys);
    const map = new Map<string, string | null>();
    for (const row of data ?? []) map.set(row.key as string, (row.value as string | null) ?? null);
    const matrix = FEATURES.flatMap((f) =>
      ENVS.map((e) => {
        const stored = map.get(flagKey(f.slug, e));
        const enabled = stored === null || stored === undefined ? f.defaults[e] : stored === "1";
        return { slug: f.slug, env: e, enabled };
      }),
    );
    return matrix;
  });

const setSchema = z.object({
  slug: z.string().refine((s) => SLUG_SET.has(s), "Unknown feature"),
  env: z.string().refine((s) => ENV_SET.has(s), "Unknown env"),
  enabled: z.boolean(),
});

export const setFeatureFlag = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => setSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertSuperadmin(context.supabase, context.userId);
    const key = flagKey(data.slug as FeatureSlug, data.env as FeatureEnv);
    const { error } = await context.supabase.from("platform_settings").upsert(
      {
        key,
        value: data.enabled ? "1" : "0",
        updated_by: context.userId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Public: consumer boot cache. Returns { slug: boolean } for the given env. */
export const getPublicFeatureFlags = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ env: z.enum(["dev", "staging", "prod"]) }).parse(data))
  .handler(async ({ data }) => {
    const out: Record<string, boolean> = {};
    for (const f of FEATURES) out[f.slug] = f.defaults[data.env];
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const keys = FEATURES.map((f) => flagKey(f.slug, data.env));
    const { data: rows } = await supabaseAdmin.from("platform_settings").select("key,value").in("key", keys);
    for (const row of rows ?? []) {
      const parts = (row.key as string).split(".");
      const slug = parts[1];
      if (slug && slug in out) out[slug] = (row.value as string | null) === "1";
    }
    return out;
  });
