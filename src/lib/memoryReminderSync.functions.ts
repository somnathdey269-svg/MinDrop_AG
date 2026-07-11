// Syncs a memory's reminder fields (remind_at, snoozed_until, title) to the DB
// so the server-side reminder cron can fire FCM pushes for it. The full memory
// content stays local; we only mirror what the scheduler needs.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const upsertSchema = z.object({
  id: z.string().min(1),
  title: z.string().max(500),
  remindAt: z.string().datetime().nullable(),
  snoozedUntil: z.string().datetime().nullable(),
  fired: z.boolean().optional(),
});

export const upsertMemoryReminder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => upsertSchema.parse(input))
  .handler(async ({ data, context }) => {
    const patch: {
      id: string;
      user_id: string;
      title: string;
      remind_at: string | null;
      snoozed_until: string | null;
      updated_at: string;
      reminder_fired_at?: string | null;
    } = {
      id: data.id,
      user_id: context.userId,
      title: data.title || "Reminder",
      remind_at: data.remindAt,
      snoozed_until: data.snoozedUntil,
      updated_at: new Date().toISOString(),
    };
    if (data.fired === false) patch.reminder_fired_at = null;

    const { error } = await context.supabase
      .from("memories")
      .upsert(patch, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteMemoryReminder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("memories")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
