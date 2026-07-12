// Public cron endpoint that fires FCM push notifications for:
//  - Memories with remind_at <= now() and reminder_fired_at IS NULL
//  - Memories whose snoozed_until has elapsed and hasn't been fired for
//
// Called by pg_cron once per minute. Authenticates via the Supabase
// publishable/anon key in the `apikey` header.
import { createFileRoute } from "@tanstack/react-router";

const LOOKBACK_MS = 60 * 60 * 1000; // 1 hour: avoid firing for very stale rows

async function fire() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { sendFcm } = await import("@/lib/fcm.server");

  const now = new Date();
  const nowIso = now.toISOString();
  const cutoffIso = new Date(now.getTime() - LOOKBACK_MS).toISOString();

  // 1) Due memories
  const { data: dueRows, error: dueErr } = await supabaseAdmin
    .from("memories")
    .select("id, user_id, title")
    .lte("remind_at", nowIso)
    .gte("remind_at", cutoffIso)
    .is("reminder_fired_at", null)
    .limit(200);
  if (dueErr) throw new Error(`due query: ${dueErr.message}`);

  // 2) Snooze-elapsed memories (fire once per snoozed_until value)
  const { data: snoozeRows, error: snoozeErr } = await supabaseAdmin
    .from("memories")
    .select("id, user_id, title, snoozed_until, snooze_fired_for")
    .lte("snoozed_until", nowIso)
    .gte("snoozed_until", cutoffIso)
    .limit(200);
  if (snoozeErr) throw new Error(`snooze query: ${snoozeErr.message}`);

  type Job = { memoryId: string; userId: string; title: string; kind: "due" | "snooze" };
  const jobs: Job[] = [];
  for (const r of dueRows ?? []) {
    jobs.push({ memoryId: r.id, userId: r.user_id, title: r.title, kind: "due" });
  }
  for (const r of snoozeRows ?? []) {
    if (r.snooze_fired_for && r.snoozed_until && r.snooze_fired_for === r.snoozed_until) continue;
    jobs.push({ memoryId: r.id, userId: r.user_id, title: r.title, kind: "snooze" });
  }

  if (jobs.length === 0) return { processed: 0, sent: 0 };

  // Fetch tokens per user in one shot
  const userIds = Array.from(new Set(jobs.map((j) => j.userId)));
  const { data: tokens } = await supabaseAdmin
    .from("push_tokens")
    .select("user_id, token")
    .in("user_id", userIds);
  const tokensByUser = new Map<string, string[]>();
  for (const t of tokens ?? []) {
    const arr = tokensByUser.get(t.user_id) ?? [];
    arr.push(t.token);
    tokensByUser.set(t.user_id, arr);
  }

  let sent = 0;
  const staleTokens: string[] = [];
  for (const job of jobs) {
    const userTokens = tokensByUser.get(job.userId) ?? [];
    const results = await Promise.all(
      userTokens.map((token) =>
        sendFcm({
          token,
          title: job.kind === "snooze" ? "Snoozed reminder" : "Time to recall",
          body: job.title || "You have a MinDrop reminder.",
          url: `/memory/${job.memoryId}`,
          data: { memoryId: job.memoryId, kind: job.kind },
        }),
      ),
    );
    sent += results.filter((r) => r.ok).length;
    for (const r of results) {
      if (!r.ok && /NOT_FOUND|UNREGISTERED|INVALID_ARGUMENT/i.test(r.error || "")) {
        staleTokens.push(r.token);
      }
    }

    // Log notify_event (idempotency + inbox)
    await supabaseAdmin.from("notify_events").insert({
      user_id: job.userId,
      payload: { memoryId: job.memoryId, kind: job.kind, title: job.title },
    });

    // Stamp so we don't fire again
    if (job.kind === "due") {
      await supabaseAdmin
        .from("memories")
        .update({ reminder_fired_at: nowIso })
        .eq("id", job.memoryId);
    } else {
      const row = (snoozeRows ?? []).find((r) => r.id === job.memoryId);
      await supabaseAdmin
        .from("memories")
        .update({ snooze_fired_for: row?.snoozed_until ?? nowIso })
        .eq("id", job.memoryId);
    }
  }

  if (staleTokens.length > 0) {
    await supabaseAdmin.from("push_tokens").delete().in("token", staleTokens);
  }

  return { processed: jobs.length, sent };
}

export const Route = createFileRoute("/api/public/hooks/fire-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = request.headers.get("apikey");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        if (!apiKey || !expected || apiKey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const result = await fire();
          return Response.json({ ok: true, ...result });
        } catch (err: any) {
          console.error("fire-reminders failed:", err?.message || err);
          return Response.json({ ok: false, error: err?.message || "failed" }, { status: 500 });
        }
      },
    },
  },
});
