import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Check, ArrowLeft, Download, ShieldCheck, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Plans — MinDrop" },
      { name: "description", content: "Compare MinDrop's Free Plan with the Premium Plan. Unlimited active drops and private Google Drive backup sync." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <MarketingLayout>
      <section className="relative overflow-hidden bg-canvas py-16 md:py-24 border-b border-ink/5">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-[520px] rounded-full bg-orange-500/5 blur-[100px]" />
        
        <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[#FF671F] hover:underline font-bold text-xs uppercase tracking-wider mb-6">
            <ArrowLeft className="size-3.5" /> Back to Home
          </Link>

          <span className="t-eyebrow inline-flex items-center gap-2 rounded-full bg-orange-50 px-3.5 py-1.5 text-[#FF671F] font-bold border border-orange-100 mb-5">
            💎 Plans & Pricing
          </span>

          <h1 className="t-display text-4xl sm:text-5xl font-black leading-tight text-ink">
            Keep it free, or <span className="text-[#FF671F]">unlock limits.</span>
          </h1>

          <p className="t-body mt-4 text-ink/75 max-w-xl mx-auto leading-relaxed">
            MinDrop is designed to be affordable, private, and simple. Start for free with full functionality, or support the project and get unlimited capacity.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-20 bg-[#f9f7f2]">
        <div className="mx-auto max-w-4xl px-5 md:px-8 grid gap-8 md:grid-cols-2 items-stretch">
          
          {/* Free Plan */}
          <div className="bg-white border border-ink/8 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
            <div>
              <p className="t-eyebrow text-ink/50 uppercase tracking-wider font-bold">Standard</p>
              <h2 className="t-display text-3xl font-black text-ink mt-2">Free</h2>
              <p className="t-body-sm text-ink/70 mt-3 leading-relaxed">
                Full module access for standard daily reminders. Keeps your head clean with a strict cap.
              </p>
              
              <ul className="mt-8 space-y-3.5 border-t border-ink/5 pt-6">
                <li className="flex items-center gap-3 text-ink/85 t-body-sm">
                  <Check className="size-4.5 text-[#FF671F] shrink-0" />
                  <span>Up to 5 active reminders (drops)</span>
                </li>
                <li className="flex items-center gap-3 text-ink/85 t-body-sm">
                  <Check className="size-4.5 text-[#FF671F] shrink-0" />
                  <span>Full Later (looping alarms) access</span>
                </li>
                <li className="flex items-center gap-3 text-ink/85 t-body-sm">
                  <Check className="size-4.5 text-[#FF671F] shrink-0" />
                  <span>Full Notify (alert filters) access</span>
                </li>
                <li className="flex items-center gap-3 text-ink/85 t-body-sm">
                  <Check className="size-4.5 text-[#FF671F] shrink-0" />
                  <span>Full Places (geofenced alerts) access</span>
                </li>
                <li className="flex items-center gap-3 text-ink/85 t-body-sm">
                  <Check className="size-4.5 text-[#FF671F] shrink-0" />
                  <span>100% on-device local storage</span>
                </li>
              </ul>
            </div>

            <Link
              to="/download"
              className="t-button mt-8 w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-ink/15 text-ink hover:bg-ink/[0.02] py-3.5 font-bold transition"
            >
              Get Free APK
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-white border-2 border-[#FF671F] p-8 rounded-[2.5rem] shadow-md shadow-[#FF671F]/5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#FF671F] text-white text-[9px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-bl-2xl">
              Pro Access
            </div>
            
            <div>
              <p className="t-eyebrow text-[#FF671F] uppercase tracking-wider font-bold">Premium</p>
              <h2 className="t-display text-3xl font-black text-ink mt-2">
                One-time Payment
              </h2>
              <p className="t-body-sm text-ink/70 mt-3 leading-relaxed">
                Unlock unlimited capability and secure backup options. Directly supports active updates.
              </p>
              
              <ul className="mt-8 space-y-3.5 border-t border-ink/5 pt-6">
                <li className="flex items-center gap-3 text-ink font-bold t-body-sm">
                  <Check className="size-4.5 text-[#FF671F] shrink-0" />
                  <span>Unlimited active reminders (drops)</span>
                </li>
                <li className="flex items-center gap-3 text-ink/85 t-body-sm">
                  <Check className="size-4.5 text-[#FF671F] shrink-0" />
                  <span>Secure Google Drive Backup sync</span>
                </li>
                <li className="flex items-center gap-3 text-ink/85 t-body-sm">
                  <Check className="size-4.5 text-[#FF671F] shrink-0" />
                  <span>Custom theme packs & country grids</span>
                </li>
                <li className="flex items-center gap-3 text-ink/85 t-body-sm">
                  <Check className="size-4.5 text-[#FF671F] shrink-0" />
                  <span>Prioritized background location triggers</span>
                </li>
                <li className="flex items-center gap-3 text-ink/85 t-body-sm">
                  <Check className="size-4.5 text-[#FF671F] shrink-0" />
                  <span>Lifetime premium updates</span>
                </li>
              </ul>
            </div>

            <Link
              to="/download"
              className="t-button mt-8 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF671F] text-white hover:opacity-95 py-3.5 font-bold transition shadow-md shadow-[#FF671F]/10"
            >
              Get Premium APK
            </Link>
          </div>

        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 bg-white border-b border-ink/5 text-center">
        <div className="mx-auto max-w-2xl px-5 md:px-8 flex flex-col items-center">
          <ShieldCheck className="size-8 text-[#FF671F]/80 mb-3" />
          <h3 className="t-title font-bold text-lg text-ink">Zero Knowledge Sync</h3>
          <p className="t-body-sm text-ink/70 mt-2 max-w-md leading-relaxed mx-auto">
            When you backup on Premium, all data goes directly from your phone to your personal Google Drive folder. We have 0% access to your data, credentials, or reminders.
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}
