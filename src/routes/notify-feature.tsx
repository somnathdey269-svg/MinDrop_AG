import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { motion } from "framer-motion";
import { ArrowLeft, BellRing, Filter, Smartphone, Volume2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/notify-feature")({
  head: () => ({
    meta: [
      { title: "Notify Module — MinDrop Notification Filters" },
      { name: "description", content: "Build smart rule-based filters to turn noisy push alerts from Slack or banks into loud device alarms." },
    ],
  }),
  component: NotifyFeature,
});

function NotifyFeature() {
  return (
    <MarketingLayout>
      <section className="relative overflow-hidden bg-canvas py-16 md:py-24 border-b border-ink/5">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-[520px] rounded-full bg-amber-500/5 blur-[100px]" />
        
        <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-amber-600 hover:underline font-bold text-xs uppercase tracking-wider mb-6">
            <ArrowLeft className="size-3.5" /> Back to Home
          </Link>
          
          <span className="t-eyebrow inline-flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1.5 text-[#f59e0b] font-bold border border-amber-100 mb-5">
            🔔 Notify Module
          </span>

          <h1 className="t-display text-4xl sm:text-5xl font-black leading-tight text-ink">
            Noisy alerts, <span className="text-[#f59e0b]">filtered to what matters.</span>
          </h1>

          <p className="t-body mt-4 text-ink/75 max-w-xl mx-auto leading-relaxed">
            Your phone is constantly vibrating with social media clutter. MinDrop's Notify Module monitors incoming notifications and sounds active, looping alarms *only* for the rules you configure.
          </p>

          <div className="mt-8 flex justify-center">
            <Link to="/download" className="t-button inline-flex items-center gap-2 bg-ink text-canvas rounded-2xl px-6 py-3.5 hover:opacity-90 font-bold transition">
              Get the App
            </Link>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-20 bg-[#f9f7f2]">
        <div className="mx-auto max-w-5xl px-5 md:px-8 grid gap-8 md:grid-cols-2">
          
          <div className="bg-white border border-ink/8 p-7 rounded-[2rem] flex flex-col justify-between shadow-sm">
            <div>
              <span className="inline-grid place-items-center size-10 rounded-xl bg-amber-50 text-amber-600 mb-4">
                <Filter className="size-5" />
              </span>
              <h3 className="t-title font-bold text-xl text-ink">Custom Rule Builder</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                Define rules using plain-text triggers. Link specific alert words from any application to local alarms. For example: set a rule to sound an alarm whenever a Slack notification from your manager arrives.
              </p>
            </div>
          </div>

          <div className="bg-white border border-ink/8 p-7 rounded-[2rem] flex flex-col justify-between shadow-sm">
            <div>
              <span className="inline-grid place-items-center size-10 rounded-xl bg-amber-50 text-amber-600 mb-4">
                <Volume2 className="size-5" />
              </span>
              <h3 className="t-title font-bold text-xl text-ink">Override Silent Mode</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                Some notifications simply cannot be ignored. Configure high-priority rules (like system warning logs or server failure alerts) to bypass Do Not Disturb (DND) or silent mode settings, ensuring you wake up instantly.
              </p>
            </div>
          </div>

          <div className="bg-white border border-ink/8 p-7 rounded-[2rem] flex flex-col justify-between shadow-sm">
            <div>
              <span className="inline-grid place-items-center size-10 rounded-xl bg-amber-50 text-amber-600 mb-4">
                <Smartphone className="size-5" />
              </span>
              <h3 className="t-title font-bold text-xl text-ink">UPI Transaction Alarms</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                Track payments in real-time. Build filters matching transaction alerts from Google Pay, PhonePe, or bank notifications. Sound alarms only for deposits above a custom amount (e.g. ₹5,000) to confirm receipt immediately.
              </p>
            </div>
          </div>

          <div className="bg-white border border-ink/8 p-7 rounded-[2rem] flex flex-col justify-between shadow-sm">
            <div>
              <span className="inline-grid place-items-center size-10 rounded-xl bg-amber-50 text-amber-600 mb-4">
                <ShieldCheck className="size-5" />
              </span>
              <h3 className="t-title font-bold text-xl text-ink">On-Device Processing</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                MinDrop reads your notifications locally using Android's accessibility/notification listeners. Absolutely no notification content is sent to our servers or the cloud—your incoming logs stay private.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-ink text-canvas text-center">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="t-display text-2xl md:text-3xl">Take control of your notifications.</h2>
          <p className="t-body mt-3 text-canvas/70 text-sm">Download the MinDrop APK for Android and stop checking your phone every 10 seconds.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/download" className="t-button rounded-full bg-white text-ink px-6 py-3 font-semibold">
              Get the APK
            </Link>
            <Link to="/" className="t-button rounded-full bg-white/10 text-canvas px-6 py-3 border border-white/15">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
