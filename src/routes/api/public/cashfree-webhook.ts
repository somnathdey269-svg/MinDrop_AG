import { createFileRoute } from "@tanstack/react-router";

// Cashfree webhook receiver. Public endpoint; verifies HMAC signature and
// updates the user's premium status idempotently.
export const Route = createFileRoute("/api/public/cashfree-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const signature = request.headers.get("x-webhook-signature");
        const timestamp = request.headers.get("x-webhook-timestamp");

        const { verifyCashfreeSignature } = await import("@/lib/cashfree.server");
        if (!verifyCashfreeSignature(rawBody, timestamp, signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: {
          type?: string;
          data?: {
            order?: { order_id?: string; order_amount?: number; order_currency?: string };
            payment?: {
              cf_payment_id?: string | number;
              payment_status?: string;
              payment_amount?: number;
              payment_currency?: string;
            };
          };
        };
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const orderId = payload.data?.order?.order_id;
        const paymentStatus = payload.data?.payment?.payment_status;
        const type = payload.type || "";

        if (!orderId) return new Response("Missing order_id", { status: 400 });

        // Only act on success events
        const isSuccess =
          type === "PAYMENT_SUCCESS_WEBHOOK" || paymentStatus === "SUCCESS";
        if (!isSuccess) {
          // Record failure but do not upgrade
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin
            .from("payments")
            .update({
              status:
                paymentStatus === "FAILED" || type === "PAYMENT_FAILED_WEBHOOK"
                  ? "FAILED"
                  : "PENDING",
              raw: payload as never,
            })
            .eq("cf_order_id", orderId)
            .neq("status", "PAID");
          return new Response("ok", { status: 200 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Find the payment row (must exist — created by createCashfreeOrder)
        const { data: payment } = await supabaseAdmin
          .from("payments")
          .select("id, user_id, status")
          .eq("cf_order_id", orderId)
          .maybeSingle();

        if (!payment) {
          // Unknown order — accept the webhook to avoid retries but do nothing
          return new Response("ok", { status: 200 });
        }

        if (payment.status === "PAID") {
          return new Response("ok", { status: 200 }); // already processed
        }

        const cfPaymentId = payload.data?.payment?.cf_payment_id
          ? String(payload.data.payment.cf_payment_id)
          : null;

        await supabaseAdmin
          .from("payments")
          .update({ status: "PAID", cf_payment_id: cfPaymentId, raw: payload as never })
          .eq("cf_order_id", orderId);

        const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "premium",
            plan_source: "cashfree",
            plan_expires_at: expires,
            plan_updated_at: new Date().toISOString(),
          })
          .eq("id", payment.user_id);

        return new Response("ok", { status: 200 });
      },
    },
  },
});
