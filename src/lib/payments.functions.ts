// Cashfree order creation + verification.
// One-time purchase, 365-day premium unlock.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const createSchema = z.object({
  currency: z.string().length(3).default("INR"),
});

const verifySchema = z.object({
  orderId: z.string().min(3).max(64),
});

export const createCashfreeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { cashfreeFetch } = await import("./cashfree.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Load pricing from platform_settings
    const { data: rows } = await supabaseAdmin
      .from("platform_settings")
      .select("key, value")
      .in("key", ["premium_price_inr", "premium_display_prices"]);
    const m = new Map((rows ?? []).map((r) => [r.key, r.value]));
    const priceInr = Number(m.get("premium_price_inr") || 499);
    let prices: Record<string, { displayed: number; symbol: string }> = {
      INR: { displayed: priceInr, symbol: "₹" },
    };
    try {
      const parsed = JSON.parse(m.get("premium_display_prices") || "{}");
      if (parsed && typeof parsed === "object") prices = { ...prices, ...parsed };
    } catch { /* keep default */ }

    const currency = data.currency.toUpperCase();
    const priceEntry = prices[currency];
    if (!priceEntry) throw new Error(`Currency ${currency} not supported`);
    const amount = priceEntry.displayed;
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("Invalid price");

    // Fetch user email for Cashfree order (required by API)
    const { data: userRes } = await supabaseAdmin.auth.admin.getUserById(context.userId);
    const email = userRes.user?.email || `${context.userId}@users.mindrop.in`;
    const phone = (userRes.user?.phone as string) || "9999999999";

    const orderId = `mindrop_${context.userId.replace(/-/g, "").slice(0, 12)}_${Date.now()}`;

    const order = await cashfreeFetch<{ payment_session_id: string; order_id: string; order_status: string }>(
      "/orders",
      {
        method: "POST",
        body: {
          order_id: orderId,
          order_amount: amount,
          order_currency: currency,
          customer_details: {
            customer_id: context.userId,
            customer_email: email,
            customer_phone: phone,
          },
          order_meta: {
            notify_url: `${process.env.PUBLIC_SITE_URL || "https://getmindrop.lovable.app"}/api/public/cashfree-webhook`,
          },
          order_note: "MinDrop Premium — 1 year",
        },
      },
    );

    await supabaseAdmin.from("payments").insert({
      user_id: context.userId,
      cf_order_id: order.order_id,
      amount,
      currency,
      status: "CREATED",
    });

    return {
      orderId: order.order_id,
      paymentSessionId: order.payment_session_id,
      amount,
      currency,
      symbol: priceEntry.symbol,
      mode: (process.env.CASHFREE_ENV || "TEST").toUpperCase() === "PROD" ? "production" : "sandbox",
    };
  });

export const verifyCashfreeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => verifySchema.parse(input))
  .handler(async ({ data, context }) => {
    const { cashfreeFetch } = await import("./cashfree.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Ensure the order belongs to this user
    const { data: existing } = await supabaseAdmin
      .from("payments")
      .select("id, user_id, status")
      .eq("cf_order_id", data.orderId)
      .maybeSingle();
    if (!existing || existing.user_id !== context.userId) {
      throw new Error("Order not found");
    }

    const order = await cashfreeFetch<{ order_status: string; order_id: string }>(
      `/orders/${encodeURIComponent(data.orderId)}`,
      { method: "GET" },
    );

    if (order.order_status === "PAID") {
      const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      // Idempotent: only bump if not already PAID
      if (existing.status !== "PAID") {
        await supabaseAdmin
          .from("payments")
          .update({ status: "PAID", raw: order as never })
          .eq("cf_order_id", data.orderId);

        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "premium",
            plan_source: "cashfree",
            plan_expires_at: expires,
            plan_updated_at: new Date().toISOString(),
          })
          .eq("id", context.userId);
      }

      // Read effective expiry back
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("plan, plan_expires_at")
        .eq("id", context.userId)
        .maybeSingle();

      return {
        status: "PAID" as const,
        plan: profile?.plan ?? "premium",
        expiresAt: profile?.plan_expires_at ?? expires,
      };
    }

    if (order.order_status === "ACTIVE") {
      return { status: "PENDING" as const };
    }

    // TERMINATED / EXPIRED / etc.
    await supabaseAdmin
      .from("payments")
      .update({ status: "FAILED", raw: order as never })
      .eq("cf_order_id", data.orderId)
      .neq("status", "PAID");

    return { status: "FAILED" as const, cfStatus: order.order_status };
  });

export const getMyPremiumStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("plan, plan_expires_at, plan_source")
      .eq("id", context.userId)
      .maybeSingle();
    const expiresAt = data?.plan_expires_at ?? null;
    const isActive =
      data?.plan === "premium" && (!expiresAt || new Date(expiresAt).getTime() > Date.now());
    return {
      plan: (data?.plan as "free" | "premium" | undefined) ?? "free",
      expiresAt,
      source: data?.plan_source ?? null,
      isActive,
    };
  });
