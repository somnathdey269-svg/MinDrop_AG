// Cashfree Drop-in loader. Lazy-loads Cashfree JS SDK v3 and renders the
// embedded checkout inside PaywallSheet / paywall route.
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { createCashfreeOrder, verifyCashfreeOrder } from "@/lib/payments.functions";

type CashfreeMode = "sandbox" | "production";
type CashfreeInstance = {
  checkout: (opts: {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_modal" | "_blank" | HTMLElement;
    appearance?: { width?: string; height?: string };
  }) => Promise<{ error?: { message?: string }; redirect?: boolean; paymentDetails?: { paymentMessage?: string } }>;
};
type CashfreeFactory = (opts: { mode: CashfreeMode }) => CashfreeInstance;

declare global {
  interface Window {
    Cashfree?: CashfreeFactory;
  }
}

const SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";

function loadSdk(): Promise<CashfreeFactory> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (window.Cashfree) return Promise.resolve(window.Cashfree);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    const s = existing ?? document.createElement("script");
    if (!existing) {
      s.src = SDK_URL;
      s.async = true;
      document.head.appendChild(s);
    }
    s.addEventListener("load", () => {
      if (window.Cashfree) resolve(window.Cashfree);
      else reject(new Error("Cashfree SDK loaded but factory missing"));
    });
    s.addEventListener("error", () => reject(new Error("Failed to load Cashfree SDK")));
  });
}

type Props = {
  currency: string;
  onSuccess: (expiresAt: string) => void;
  onCancel?: () => void;
};

export function CashfreeCheckout({ currency, onSuccess, onCancel }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "verifying" | "error">("loading");
  const [message, setMessage] = useState<string>("Preparing checkout…");

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

    (async () => {
      try {
        const [factory, order] = await Promise.all([
          loadSdk(),
          createCashfreeOrder({ data: { currency } }),
        ]);
        if (cancelled) return;

        const cf = factory({ mode: order.mode as CashfreeMode });
        setStatus("ready");
        setMessage("");

        const target = mountRef.current || undefined;
        const result = await cf.checkout({
          paymentSessionId: order.paymentSessionId,
          redirectTarget: target as HTMLElement | undefined,
        });
        if (cancelled) return;

        if (result?.error) {
          setStatus("error");
          setMessage(result.error.message || "Payment cancelled.");
          onCancel?.();
          return;
        }

        setStatus("verifying");
        setMessage("Verifying payment…");
        const verified = await verifyCashfreeOrder({ data: { orderId: order.orderId } });
        if (cancelled) return;

        if (verified.status === "PAID") {
          onSuccess(verified.expiresAt);
        } else if (verified.status === "PENDING") {
          setStatus("error");
          setMessage("Payment is still processing. We'll update your account when it completes.");
        } else {
          setStatus("error");
          setMessage("Payment did not complete. Please try again.");
          onCancel?.();
        }
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Something went wrong.");
      }
    })();

    return () => { cancelled = true; };
  }, [currency, onSuccess, onCancel]);

  return (
    <div className="space-y-3">
      {(status === "loading" || status === "verifying") && (
        <div className="flex items-center gap-2 t-body-sm text-ink/70">
          <Loader2 className="size-4 animate-spin" />
          <span>{message}</span>
        </div>
      )}
      {status === "error" && (
        <p className="t-body-sm text-red-600" role="alert">{message}</p>
      )}
      <div
        ref={mountRef}
        className="min-h-[420px] rounded-xl border border-ink/10 bg-canvas overflow-hidden"
      />
    </div>
  );
}
