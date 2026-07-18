import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Smartphone, Download, AlarmClock, BellRing, Navigation, ShieldAlert, Sparkles, BrainCircuit, ChevronDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MinDrop — Declutter your mind" },
      { name: "description", content: "A quiet second memory for the tiny tasks, reminders, and notes your brain shouldn't have to carry. Fast, offline, and private." },
      { property: "og:title", content: "MinDrop — Declutter your mind" },
      { property: "og:description", content: "A quiet second memory for the tiny tasks, reminders, and notes your brain shouldn't have to carry. Fast, offline, and private." },
      { property: "og:url", content: "https://www.mindrop.in/" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does MinDrop run without internet?",
      a: "MinDrop keeps all data inside a local database on your phone (SQLite). It uses native Android hooks to trigger your location and alarm schedules directly from your device, so you never need an active internet connection to receive alarms."
    },
    {
      q: "What makes MinDrop different from regular task managers?",
      a: "Most task apps are cluttered lists that you end up ignoring. MinDrop is designed for 'drops'—tiny immediate notes (e.g. dad's meds, parking spot, UPI confirmations) that either sound loop alarms until check-off, filter noisy notifications into immediate rings, or fire only when you enter a specific location."
    },
    {
      q: "Does the location tracking kill my battery?",
      a: "No. MinDrop uses battery-optimized background geofence sweeps rather than constant active GPS tracking. This guarantees that your location triggers fire precisely without draining your phone's battery."
    },
    {
      q: "Can I back up my reminders?",
      a: "Yes. On the Premium plan, you can enable sync. Unlike other platforms, your data does not go to our servers—it syncs directly to your own private Google Drive folder, keeping your privacy completely intact."
    }
  ];

  return (
    <MarketingLayout>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-canvas py-16 md:py-24 border-b border-ink/5">
        {/* Soft colorful gradients */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-[520px] rounded-full bg-[#FF671F]/8 blur-[100px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-24 size-[520px] rounded-full bg-[#8b5cf6]/8 blur-[100px]" />

        <div className="mx-auto max-w-6xl px-5 md:px-8 grid gap-12 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <span className="t-eyebrow inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-[#FF671F] font-bold border border-[#FF671F]/10">
              <span className="size-2 rounded-full bg-[#FF671F]" /> Declutter your head
            </span>
            
            <h1 className="t-display mt-5 text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] text-ink tracking-tight">
              Your second brain, <br />
              <span className="text-[#FF671F]">but kinder.</span>
            </h1>

            <p className="t-body mt-5 text-ink/75 leading-relaxed max-w-lg">
              MinDrop is a quiet second memory built for the small details your brain shouldn't have to carry. Capture parking spots, set looping alarms, or trigger alerts exactly when you arrive.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/download"
                className="t-button inline-flex items-center justify-center gap-2 rounded-2xl bg-ink text-canvas px-6 py-4 hover:opacity-90 transition font-bold shadow-md shadow-ink/10"
              >
                <Download className="size-4.5" />
                <span>Download Android APK</span>
              </Link>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="t-button inline-flex items-center justify-center gap-2 rounded-2xl border border-ink/15 text-ink/40 bg-secondary/30 px-6 py-4 cursor-not-allowed select-none"
              >
                <Smartphone className="size-4.5" />
                <span>Play Store — Coming Soon</span>
              </a>
            </div>
            <p className="t-meta mt-4 text-ink/50 text-xs">Free Tier · 100% On-Device Storage · Fully Offline</p>
          </motion.div>

          {/* Animated App Preview Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex justify-center relative"
          >
            <div className="w-[280px] h-[560px] bg-ink rounded-[2.8rem] p-3 shadow-2xl relative border-4 border-ink/30">
              {/* Dynamic screen element */}
              <div className="w-full h-full bg-[#f9f7f2] rounded-[2rem] overflow-hidden flex flex-col p-4 relative justify-between select-none">
                <div className="flex justify-between items-center shrink-0 border-b border-ink/5 pb-2">
                  <span className="text-[10px] font-bold text-ink/40">MinDrop App</span>
                  <div className="w-14 h-3.5 rounded-full bg-ink/10" />
                </div>
                
                {/* Visual mockup mockup animations */}
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    className="size-16 rounded-2xl bg-gradient-to-tr from-[#FF671F] to-[#FFA06E] grid place-items-center shadow-lg shadow-[#FF671F]/20 mb-4"
                  >
                    <span className="text-white font-black text-2xl">m</span>
                  </motion.div>
                  <p className="text-xs font-bold text-ink">Reminders that ring.</p>
                  <div className="mt-4 p-2 bg-white rounded-xl border border-ink/5 shadow-sm text-left w-full">
                    <p className="text-[9px] font-bold text-emerald-600">⏰ Tomorrow 08:30</p>
                    <p className="text-[10px] text-ink/80 font-medium">Buy groceries & pay rent</p>
                  </div>
                </div>

                <div className="h-8 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                  <span className="text-[9px] text-ink/50 font-bold uppercase tracking-wider">Swipe up to drop</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Why MinDrop? Section */}
      <section className="py-20 bg-[#f9f7f2] border-b border-ink/5 text-center">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <span className="t-eyebrow text-[#FF671F]/80 uppercase tracking-widest font-bold">The Difference</span>
          <h2 className="t-display mt-3 text-3xl sm:text-4xl font-extrabold text-ink">
            Designed for the tiny details you ignore.
          </h2>
          <p className="t-body mt-4 text-ink/75 max-w-xl mx-auto leading-relaxed">
            Standard task managers are lists you ignore. MinDrop carries the active details—things you need to remember *right now*, at an exact minute, or the moment you arrive.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 mt-12 text-left">
            <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
              <span className="text-2xl">⚡</span>
              <h3 className="t-title text-base font-bold text-ink mt-3">Fast Capture</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                Take a quick snap, record a voice memo, or type a single word. Drop it in 2 seconds.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
              <span className="text-2xl">⏳</span>
              <h3 className="t-title text-base font-bold text-ink mt-3">Loop Alarms</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                Alarms loop persistently until checked, making it impossible to overlook critical items.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm col-span-1 sm:col-span-2 md:col-span-1">
              <span className="text-2xl">🔒</span>
              <h3 className="t-title text-base font-bold text-ink mt-3">100% Offline</h3>
              <p className="t-body-sm text-ink/70 mt-2 leading-relaxed">
                No clouds, no accounts, no server tracking. Your data is stored on-device, only yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Modules Grid */}
      <section className="py-20 bg-canvas border-b border-ink/5">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="t-eyebrow text-[#FF671F] uppercase font-bold tracking-wider">Features</span>
            <h2 className="t-display mt-2 text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
              Three pillars of absolute clarity.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Later Module */}
            <div className="flex flex-col justify-between p-7 rounded-[2rem] bg-white border border-ink/8 shadow-sm">
              <div>
                <span className="inline-grid place-items-center size-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                  <AlarmClock className="size-5" />
                </span>
                <h3 className="t-title text-xl font-bold text-ink">Later Module</h3>
                <p className="t-body-sm text-ink/75 mt-3 leading-relaxed">
                  Persistent loop alarms for task captures. Dictate a thought, attach photos, and set precise time alerts that survive reboots.
                </p>
              </div>
              <Link to="/later-feature" className="t-button mt-6 text-[#10b981] hover:underline text-xs uppercase tracking-wider font-bold">
                Learn Later Module →
              </Link>
            </div>

            {/* Notify Module */}
            <div className="flex flex-col justify-between p-7 rounded-[2rem] bg-white border border-ink/8 shadow-sm">
              <div>
                <span className="inline-grid place-items-center size-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 mb-5">
                  <BellRing className="size-5" />
                </span>
                <h3 className="t-title text-xl font-bold text-ink">Notify Module</h3>
                <p className="t-body-sm text-ink/75 mt-3 leading-relaxed">
                  Transform noisy app alerts into actionable loop alarms. Build strict filters (e.g. WhatsApp from family or bank transactions) to wake your phone.
                </p>
              </div>
              <Link to="/notify-feature" className="t-button mt-6 text-[#f59e0b] hover:underline text-xs uppercase tracking-wider font-bold">
                Learn Notify Module →
              </Link>
            </div>

            {/* Places Module */}
            <div className="flex flex-col justify-between p-7 rounded-[2rem] bg-white border border-ink/8 shadow-sm">
              <div>
                <span className="inline-grid place-items-center size-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 mb-5">
                  <Navigation className="size-5" />
                </span>
                <h3 className="t-title text-xl font-bold text-ink">Places Module</h3>
                <p className="t-body-sm text-ink/75 mt-3 leading-relaxed">
                  Geolocation-triggered reminders. MinDrop maps custom coordinates and monitors boundaries quietly in the background without draining your battery.
                </p>
              </div>
              <Link to="/places-feature" className="t-button mt-6 text-[#8b5cf6] hover:underline text-xs uppercase tracking-wider font-bold">
                Learn Places Module →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Advanced: Recall, Summary & Privacy */}
      <section className="py-20 bg-[#f9f7f2] border-b border-ink/5">
        <div className="mx-auto max-w-5xl px-5 md:px-8 grid gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <span className="shrink-0 size-11 bg-indigo-50 border border-indigo-100 rounded-xl grid place-items-center text-indigo-600">
                <BrainCircuit className="size-5.5" />
              </span>
              <div>
                <h3 className="t-title font-bold text-lg text-ink">Cognitive Recall Challenges</h3>
                <p className="t-body-sm text-ink/75 mt-2 leading-relaxed">
                  MinDrop helps train your memory. The Recall system initiates pattern-match quiz alerts to test if your brain remembered where you put your keys or parked without looking at the drop.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="shrink-0 size-11 bg-orange-50 border border-orange-100 rounded-xl grid place-items-center text-orange-600">
                <Sparkles className="size-5.5" />
              </span>
              <div>
                <h3 className="t-title font-bold text-lg text-ink">Mental Load Summaries</h3>
                <p className="t-body-sm text-ink/75 mt-2 leading-relaxed">
                  Get structural insights into your cognitive baggage. MinDrop calculates drop durations and active loads, showing you exactly when your mind was most cluttered.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-ink/8 p-7 rounded-[2rem] flex flex-col justify-center">
            <div className="size-11 rounded-2xl bg-slate-50 border border-slate-100 grid place-items-center text-slate-600 mb-4">
              <ShieldAlert className="size-5.5" />
            </div>
            <h3 className="t-title font-black text-2xl text-ink">100% private by default.</h3>
            <p className="t-body-sm text-ink/75 mt-3 leading-relaxed">
              We collect zero telemetry, zero analytics, and zero credentials. Your SQLite database file remains on your local phone storage. Optional sync encrypts all data directly to your personal Google Drive account.
            </p>
            <div className="mt-5 border-t border-ink/5 pt-4">
              <Link to="/privacy" className="t-body-sm text-[#FF671F] font-bold hover:underline">
                Read our Privacy Promise →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing Teaser */}
      <section className="py-20 bg-canvas border-b border-ink/5 text-center">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <span className="t-eyebrow text-[#FF671F] uppercase font-bold tracking-widest">Plans</span>
          <h2 className="t-display mt-3 text-3xl sm:text-4xl font-extrabold text-ink">
            Keep it free, or unlock limits.
          </h2>
          <p className="t-body mt-3 text-ink/70 max-w-md mx-auto">
            Free plan includes up to 5 concurrent active reminders. Upgrade for unlimited storage and automated backups.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/pricing"
              className="t-button inline-flex items-center gap-2 rounded-2xl bg-ink text-canvas px-6 py-3.5 hover:opacity-90 font-bold transition"
            >
              See Pricing Details
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="py-20 bg-[#f9f7f2]">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="t-display text-center text-3xl font-extrabold text-ink mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="bg-white rounded-2xl border border-ink/8 overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-ink cursor-pointer hover:bg-ink/[0.01]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`size-4 text-ink/50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-ink/5 text-ink/75 t-body-sm leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
