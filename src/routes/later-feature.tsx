import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { motion } from "framer-motion";
import { Clock, Volume2, ShieldAlert, ArrowLeft, RefreshCw, Layers } from "lucide-react";

export const Route = createFileRoute("/later-feature")({
  head: () => ({
    meta: [
      { title: "Later Module — MinDrop Alarms" },
      { name: "description", content: "Set looping, loud, persistent alarms for task captures that ring until checked and survive phone reboots." },
    ],
  }),
  component: LaterFeature,
});

function LaterFeature() {
  return (
    <MarketingLayout>
      <section className="relative overflow-hidden bg-canvas py-16 md:py-24 border-b border-ink/5">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-[520px] rounded-full bg-emerald-500/5 blur-[100px]" />
        
        <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-emerald-600 hover:underline font-bold text-xs uppercase tracking-wider mb-6">
            <ArrowLeft className="size-3.5" /> Back to Home
          </Link>
          
          <span className="t-eyebrow inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[#10b981] font-bold border border-emerald-100 mb-5">
            ⏰ Later Module
          </span>

          <h1 className="t-display text-4xl sm:text-5xl font-black leading-tight text-ink">
            Reminders that actually <span className="text-[#10b981]">ring.</span>
          </h1>

          <p className="t-body mt-4 text-ink/75 max-w-xl mx-auto leading-relaxed">
            MinDrop's Later Module turns standard passive alerts into loud, active alarms. Capture thoughts instantly using voice, image, or text, and know they'll trigger exactly on time.
          </p>

          {/* Quick APK action */}
          <div className="mt-8 flex justify-center">
            <Link to="/download" className="t-button inline-flex items-center gap-2 bg-ink text-canvas rounded-2xl px-6 py-3.5 hover:opacity-90 font-bold transition">
              Get the App
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Details Section */}
      <section className="py-20 bg-[#f9f7f2]">
        <div className="mx-auto max-w-5xl px-5 md:px-8 grid gap-8 md:grid-cols-2">
          
          <div className="bg-white border border-ink/8 p-7 rounded-[2rem] flex flex-col justify-between shadow-sm">
            <div>
              <span className="inline-grid place-items-center size-10 rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <Volume2 className="size-5" />
              </span>
              <h3 className="t-title font-bold text-xl text-ink">Looping Persistent Alarms</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                Ordinary push notifications get lost in your feed. MinDrop alarms ring continuously in a loop like a phone call, forcing you to acknowledge and check off the item. Perfect for critical, time-sensitive actions.
              </p>
            </div>
          </div>

          <div className="bg-white border border-ink/8 p-7 rounded-[2rem] flex flex-col justify-between shadow-sm">
            <div>
              <span className="inline-grid place-items-center size-10 rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <RefreshCw className="size-5" />
              </span>
              <h3 className="t-title font-bold text-xl text-ink">Reboot Resilience</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                If your phone reboots or powers off, other apps forget your scheduled notifications. MinDrop binds to native Android startup events, automatically rescheduled and restoring all alarms immediately upon boot.
              </p>
            </div>
          </div>

          <div className="bg-white border border-ink/8 p-7 rounded-[2rem] flex flex-col justify-between shadow-sm">
            <div>
              <span className="inline-grid place-items-center size-10 rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <Clock className="size-5" />
              </span>
              <h3 className="t-title font-bold text-xl text-ink">Snooze Control</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                Not ready to do it yet? Tap the custom Snooze overlay to delay your alarm. Choose from quick intervals (5 min, 15 min, 30 min) or select a custom time slot to snooze it out of sight.
              </p>
            </div>
          </div>

          <div className="bg-white border border-ink/8 p-7 rounded-[2rem] flex flex-col justify-between shadow-sm">
            <div>
              <span className="inline-grid place-items-center size-10 rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <Layers className="size-5" />
              </span>
              <h3 className="t-title font-bold text-xl text-ink">Multi-Modal Capture</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                Capture memory drops in the format that matches your context: type a quick text label, record a clear voice note when walking, or snap a photo (like your parking spot or a prescription) as an alarm attachment.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-ink text-canvas text-center">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="t-display text-2xl md:text-3xl">Ready to stop forgetting?</h2>
          <p className="t-body mt-3 text-canvas/70 text-sm">Download MinDrop for your Android device and take charge of your cognitive load today.</p>
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
