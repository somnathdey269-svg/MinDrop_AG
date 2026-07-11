// Dynamic plan limits. Superadmins set these in the admin console;
// every client reads them so caps can change without a redeploy.
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type PlanLimitRow = {
  key: string;
  label: string;
  description: string | null;
  anon_limit: number;
  free_limit: number;
  premium_limit: number;
  updated_at: string;
};

/** Public read — anyone (anon or signed-in) can fetch the current caps. */
export const getPlanLimits = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { limits: [] as PlanLimitRow[] };
  const supabase = createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("plan_limits")
    .select("key,label,description,anon_limit,free_limit,premium_limit,updated_at")
    .order("key", { ascending: true });
  if (error) return { limits: [] as PlanLimitRow[] };
  return { limits: (data ?? []) as PlanLimitRow[] };
});

const upsertSchema = z.object({
  key: z.string().trim().min(1).max(64).regex(/^[a-z0-9_]+$/, "Lowercase letters, digits, underscores only"),
  label: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).nullable().optional(),
  anon_limit: z.number().int().min(-1).max(100000),
  free_limit: z.number().int().min(-1).max(100000),
  premium_limit: z.number().int().min(-1).max(100000),
});

async function assertSuperadmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "superadmin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const upsertPlanLimit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => upsertSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertSuperadmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("plan_limits")
      .upsert(
        {
          key: data.key,
          label: data.label,
          description: data.description ?? null,
          anon_limit: data.anon_limit,
          free_limit: data.free_limit,
          premium_limit: data.premium_limit,
          updated_by: context.userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const deleteSchema = z.object({ key: z.string().trim().min(1).max(64) });

export const deletePlanLimit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => deleteSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertSuperadmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("plan_limits").delete().eq("key", data.key);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
