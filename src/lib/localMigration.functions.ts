// One-shot import of a user's on-device memories into their account.
// Called from the client immediately after a successful sign-in / sign-up.
// Idempotent: uses the client-generated memory id as the upsert key, and
// stamps profiles.migrated_local_at once so we don't re-prompt/re-toast later.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const memorySchema = z.object({
  id: z.string().min(1),
  text: z.string().max(4000).optional().nullable(),
  category: z.string().max(120).optional().nullable(),
  dueAt: z.string().datetime().optional().nullable(),
  firedAt: z.string().datetime().optional().nullable(),
  deletedAt: z.string().datetime().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
});

const inputSchema = z.object({
  memories: z.array(memorySchema).max(2000),
});

export const migrateLocalMemories = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Check if already migrated — if so, skip silently (idempotent).
    const { data: profile } = await supabase
      .from("profiles")
      .select("migrated_local_at")
      .eq("id", userId)
      .maybeSingle();

    const alreadyMigrated = !!profile?.migrated_local_at;

    let imported = 0;
    if (data.memories.length > 0) {
      const now = new Date().toISOString();
      const rows = data.memories
        .filter((m) => !m.deletedAt)
        .map((m) => ({
          id: m.id,
          user_id: userId,
          title: (m.text ?? "Memory").slice(0, 500) || "Memory",
          body: m.text ?? null,
          category: m.category ?? null,
          remind_at: m.dueAt ?? null,
          reminder_fired_at: m.firedAt ?? null,
          metadata: JSON.parse(JSON.stringify(m.metadata ?? {})),
          updated_at: now,
        }));
      if (rows.length > 0) {
        const { error, count } = await supabase
          .from("memories")
          .upsert(rows, { onConflict: "id", count: "exact", ignoreDuplicates: false });
        if (error) throw new Error(error.message);
        imported = count ?? rows.length;
      }
    }

    if (!alreadyMigrated) {
      await supabase
        .from("profiles")
        .update({ migrated_local_at: new Date().toISOString() })
        .eq("id", userId);
    }

    return { ok: true, imported, alreadyMigrated };
  });
