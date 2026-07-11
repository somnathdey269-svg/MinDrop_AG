import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const entrySchema = z.object({ v: z.string().max(2_000_000), t: z.number() });
const snapshotSchema = z.record(z.string().max(200), entrySchema);

export const getCloudSnapshot = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("user_settings")
      .select("local_snapshot")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { snapshot: ((data?.local_snapshot ?? {}) as unknown) as Record<string, { v: string; t: number }> };
  });

export const putCloudSnapshot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ patch: snapshotSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row } = await supabase
      .from("user_settings")
      .select("local_snapshot")
      .eq("user_id", userId)
      .maybeSingle();
    const current = ((row?.local_snapshot ?? {}) as unknown) as Record<string, { v: string; t: number }>;
    const merged = { ...current };
    for (const [k, entry] of Object.entries(data.patch)) {
      const existing = current[k];
      if (!existing || entry.t >= existing.t) merged[k] = entry;
    }
    const { error } = await supabase
      .from("user_settings")
      .upsert({ user_id: userId, local_snapshot: merged, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
