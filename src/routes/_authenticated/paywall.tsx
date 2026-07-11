import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Sparkles, X } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { LegalFooter } from "@/components/legal/LegalFooter";
import { CashfreeCheckout } from "@/components/paywall/CashfreeCheckout";
import { getPublicSettings, type CurrencyPrice } from "@/lib/platformSettings.functions";
import { getMyPremiumStatus } from "@/lib/payments.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/paywall")({
  head: () => ({
    meta: [
      { title: "MinDrop Premium — 1 year unlock" },
      { name: "description", content: "Unlock unlimited memories, notify rules and places for 1 year." },
    ],
  }),
  component: Paywall,
});

const perks = [
  "Unlimited memories & do-it-laters",
  "Unlimited notify rules",
  "Unlimited saved places",
  "Google Drive backup (optional)",
  "Priority support",
];

function detectPreferredCurrency(available: string[]): string {
  if (typeof navigator === "undefined") return "INR";
  try {
    const locale = navigator.language || "en-IN";
    const region = new Intl.Locale(locale).maximize().region || "IN";
    const map: Record<string, string> = {
      IN: "INR", US: "USD", GB: "GBP", AU: "AUD", CA: "CAD",
      SG: "SGD", AE: "AED", JP: "JPY",
    };
    // Euro-zone
    const euroCountries = ["DE","FR","IT","ES","NL","BE","AT","IE","PT","FI","GR","LU","SK","SI","EE","LV","LT","MT","CY"];
    if (euroCountries.includes(region)) return available.includes("EUR") ? "EUR" : "INR";
    const guess = map[region] || "INR";
    return available.includes(guess) ? guess : (available.includes("INR") ? "INR" : available[0] || "INR");
  } catch { return "INR"; }
}

function Paywall() {
  const router = useRouter();
  const [prices, setPrices] = useState<Record<string, CurrencyPrice>>({});
  const [currency, setCurrency] = useState<string>("INR");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [status, setStatus] = useState<{ isActive: boolean; expiresAt: string | null } | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, st] = await Promise.all([getPublicSettings(), getMyPremiumStatus()]);
        if (cancelled) return;
        setPrices(s.displayPrices || {});
        setStatus({ isActive: st.isActive, expiresAt: st.expiresAt });
        setCurrency(detectPreferredCurrency(Object.keys(s.displayPrices || { INR: {} })));
      } catch (e) {
        if (!cancelled) setLoadErr(e instanceof Error ? e.message : "Failed to load");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const goBack = () => {
    if (window.history.length > 1) router.history.back();
    else router.navigate({ to: "/home" });
  };

  const availableCurrencies = useMemo(() => Object.keys(prices).sort(), [prices]);
  const selected = prices[currency];

  const onSuccess = (expiresAt: string) => {
    setCheckoutOpen(false);
    setStatus({ isActive: true, expiresAt });
    toast.success(`Premium unlocked until ${new Date(expiresAt).toLocaleDateString()}`);
  };

  return (
    <PhoneFrame>
      <div className="bg-ink text-canvas min-h-[100dvh] md:min-h-[calc(100vh-3rem)] px-6 py-5 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between">
          <span className="t-eyebrow inline-flex items-center gap-1.5 rounded-full bg-canvas/10 px-2.5 py-1 text-canvas/80">
            <Sparkles className="size-3" /> Premium
          </span>
          <button onClick={goBack} className="t-eyebrow text-canvas/50 inline-flex items-center gap-1 hover:text-canvas">
            <X className="size-4" /> Close
          </button>
        </div>

        <div className="mt-4">
          <p className="t-eyebrow text-canvas/50 mb-1.5">MinDrop Premium</p>
          <h1 className="t-display mb-2">1 year of total recall.</h1>
          <p className="t-body-sm text-canvas/70">One payment. No auto-renewal. Unlocks every limit.</p>
        </div>

        <ul className="mt-4 space-y-2.5">
          {perks.map((p) => (
            <li key={p} className="t-body-sm flex items-start gap-2.5">
              <Check className="size-4 mt-0.5 text-brand shrink-0" />
              <span className="text-canvas/90">{p}</span>
            </li>
          ))}
        </ul>

        {status?.isActive && status.expiresAt && (
          <div className="mt-4 rounded-2xl border border-brand/40 bg-brand/10 p-3.5">
            <p className="t-eyebrow text-brand mb-1">Active</p>
            <p className="t-meta text-canvas/90">
              Your Premium is active until {new Date(status.expiresAt).toLocaleDateString()}.
            </p>
          </div>
        )}

        {loadErr && <p className="t-meta text-red-300 mt-3">{loadErr}</p>}

        {!checkoutOpen ? (
          <>
            <div className="mt-4 rounded-2xl border border-canvas/15 bg-canvas/5 p-3.5">
              <div className="flex items-center justify-between mb-2">
                <p className="t-eyebrow text-canvas/50">Price</p>
                {availableCurrencies.length > 1 && (
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-canvas/10 text-canvas text-xs rounded px-2 py-1 border border-canvas/20"
                  >
                    {availableCurrencies.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              </div>
              <p className="t-display text-canvas">
                {selected ? `${selected.symbol}${selected.displayed}` : "…"}
                <span className="t-body-sm text-canvas/60 ml-2">/ year</span>
              </p>
            </div>

            <div className="flex-1 min-h-4" />

            <div className="space-y-2">
              <button
                onClick={() => setCheckoutOpen(true)}
                disabled={!selected || status?.isActive}
                className="t-button w-full bg-brand text-canvas py-3.5 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status?.isActive ? "Already Premium" : `Pay ${selected ? selected.symbol + selected.displayed : ""}`}
              </button>
              <button onClick={goBack} className="t-eyebrow w-full text-canvas/60 py-1.5">
                Back
              </button>
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-2xl border border-canvas/15 bg-canvas p-3">
            <CashfreeCheckout
              currency={currency}
              onSuccess={onSuccess}
              onCancel={() => setCheckoutOpen(false)}
            />
            <button
              onClick={() => setCheckoutOpen(false)}
              className="mt-2 t-meta w-full text-ink/60 py-1.5"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="mt-6 border-t border-canvas/10 pt-4 text-canvas/60">
          <LegalFooter className="text-canvas/50" />
          <p className="t-meta text-canvas/40 text-center mt-2">
            By paying you agree to our <Link to="/terms" className="underline">Terms</Link> and{" "}
            <Link to="/refunds" className="underline">Refund Policy</Link>.
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
