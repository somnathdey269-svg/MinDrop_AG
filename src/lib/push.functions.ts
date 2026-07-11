// Server functions for FCM web push: expose VAPID public key, save a device
// token for the signed-in user, and send a test notification.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getVapidPublicKey = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env.FCM_VAPID_PUBLIC_KEY;
  if (!key) throw new Error("FCM_VAPID_PUBLIC_KEY is not set");
  return { vapidKey: key };
});

const savePushTokenSchema = z.object({
  token: z.string().min(20),
  userAgent: z.string().max(500).optional(),
  platform: z.enum(["web", "android", "ios"]).optional(),
});

export const savePushToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => savePushTokenSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("push_tokens").upsert(
      {
        user_id: context.userId,
        token: data.token,
        user_agent: data.userAgent ?? null,
        platform: data.platform ?? "web",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "token" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const sendTestSchema = z
  .object({
    title: z.string().min(1).max(120).optional(),
    body: z.string().min(1).max(500).optional(),
  })
  .optional();

export const sendTestPush = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => sendTestSchema.parse(input) ?? {})
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("push_tokens")
      .select("token")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    const tokens = (rows ?? []).map((r) => r.token);
    if (tokens.length === 0) return { sent: 0, failed: 0, tokens: 0 };

    const { sendFcm } = await import("./fcm.server");
    const results = await Promise.all(
      tokens.map((token) =>
        sendFcm({
          token,
          title: data.title || "MinDrop test 🔔",
          body: data.body || "Push notifications are working.",
          url: "/",
        }),
      ),
    );

    // Prune tokens the FCM API rejects as unregistered/invalid.
    const stale = results
      .filter((r) => !r.ok && /NOT_FOUND|UNREGISTERED|INVALID_ARGUMENT/i.test(r.error || ""))
      .map((r) => r.token);
    if (stale.length > 0) {
      await context.supabase.from("push_tokens").delete().in("token", stale);
    }

    return {
      tokens: tokens.length,
      sent: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok).length,
    };
  });
