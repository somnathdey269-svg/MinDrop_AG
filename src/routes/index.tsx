import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Smartphone, Download, AlarmClock, BellRing, Navigation, ShieldAlert, Sparkles, BrainCircuit, ChevronDown, Check, X, ShieldCheck, HelpCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MinDrop — The Quiet Second Memory" },
      { name: "description", content: "A high-performance offline second brain for the immediate, tiny details your memory shouldn't have to carry. Loop alarms, smart notification filters, and geofenced triggers." },
      { property: "og:title", content: "MinDrop — The Quiet Second Memory" },
      { property: "og:description", content: "A high-performance offline second brain for immediate, tiny details. Loop alarms, smart filters, and geofencing." },
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
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-[520px] rounded-full bg-[#FF671F]/8 blur-[100px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-24 size-[520px] rounded-full bg-[#8b5cf6]/8 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16 grid gap-12 lg:grid-cols-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-left"
          >
            <span className="t-eyebrow inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-[#FF671F] font-bold border border-[#FF671F]/10">
              <span className="size-2 rounded-full bg-[#FF671F] animate-pulse" /> The Quiet Second Brain
            </span>
            
            <h1 className="t-display mt-5 text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] text-ink tracking-tight">
              Offload the tiny <br />
              things you <span className="text-[#FF671F]">forget.</span>
            </h1>

            <p className="t-body mt-5 text-ink/75 leading-relaxed max-w-xl text-base md:text-lg">
              MinDrop is a kind, offline second memory designed to carry the minor daily details your brain shouldn't have to carry. Capture key locations, set persistent alerts, or filter notifications locally on-device.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/download"
                className="t-button inline-flex items-center justify-center gap-2.5 rounded-2xl bg-ink text-canvas px-7 py-4.5 hover:opacity-90 transition font-bold shadow-md shadow-ink/10 text-sm"
              >
                <Download className="size-4.5" />
                <span>Download Android APK</span>
              </Link>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="t-button inline-flex items-center justify-center gap-2.5 rounded-2xl border border-ink/15 text-ink/40 bg-secondary/30 px-7 py-4.5 cursor-not-allowed select-none text-sm"
              >
                <Smartphone className="size-4.5" />
                <span>Play Store — Coming Soon</span>
              </a>
            </div>
            <p className="t-meta mt-4 text-ink/50 text-xs">Free Tier · SQLite On-Device Storage · Fully Offline</p>
          </motion.div>

          {/* Animated App Preview Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <div className="w-[300px] h-[600px] bg-ink rounded-[3rem] p-3 shadow-2xl relative border-4 border-ink/30">
              {/* Screen content */}
              <div className="w-full h-full bg-[#f9f7f2] rounded-[2.2rem] overflow-hidden flex flex-col p-4 relative justify-between select-none">
                <div className="flex justify-between items-center shrink-0 border-b border-ink/5 pb-2">
                  <span className="text-[10px] font-bold text-ink/40">MinDrop Mobile App</span>
                  <div className="w-16 h-3.5 rounded-full bg-ink/10" />
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    className="size-16 rounded-2xl bg-gradient-to-tr from-[#FF671F] to-[#FFA06E] grid place-items-center shadow-lg shadow-[#FF671F]/20 mb-4"
                  >
                    <span className="text-white font-black text-2xl">m</span>
                  </motion.div>
                  <p className="text-xs font-bold text-ink">Reminders that trigger.</p>
                  
                  <div className="mt-4 p-3 bg-white rounded-xl border border-ink/5 shadow-sm text-left w-full">
                    <p className="text-[9px] font-bold text-emerald-600">⏰ Persistent Alarm</p>
                    <p className="text-[10px] text-ink/80 font-semibold">Take keys from office drawer</p>
                  </div>
                  <div className="mt-2 p-3 bg-white rounded-xl border border-ink/5 shadow-sm text-left w-full">
                    <p className="text-[9px] font-bold text-purple-600">📍 Location Trigger</p>
                    <p className="text-[10px] text-ink/80 font-semibold">Buy medicines near Hospital</p>
                  </div>
                </div>

                <div className="h-8 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                  <span className="text-[9px] text-ink/50 font-bold uppercase tracking-wider">Swipe up to dismiss</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Visual "How It Works" Section */}
      <section className="py-20 bg-white border-b border-ink/5">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="t-eyebrow text-[#FF671F] uppercase font-bold tracking-wider">The Process</span>
            <h2 className="t-display mt-2 text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
              How MinDrop works.
            </h2>
            <p className="t-body mt-2 text-ink/70">Three simple steps to free up your memory load.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative p-6 rounded-2xl bg-[#f9f7f2] border border-ink/5">
              <span className="inline-grid place-items-center size-8 rounded-full bg-ink text-canvas font-bold text-sm mb-4">1</span>
              <h3 className="t-title font-bold text-base text-ink">Capture instantly</h3>
              <p className="t-body-sm text-ink/75 mt-2 leading-relaxed">
                Take a quick snap, record a voice note on the go, or drop a brief text snippet in under 2 seconds. No friction, no categories required.
              </p>
            </div>
            <div className="relative p-6 rounded-2xl bg-[#f9f7f2] border border-ink/5">
              <span className="inline-grid place-items-center size-8 rounded-full bg-ink text-canvas font-bold text-sm mb-4">2</span>
              <h3 className="t-title font-bold text-base text-ink">Select the Trigger</h3>
              <p className="t-body-sm text-ink/75 mt-2 leading-relaxed">
                Choose the trigger type: select a persistent minute timer (*Later*), define custom application notification filters (*Notify*), or draw location radius zones (*Places*).
              </p>
            </div>
            <div className="relative p-6 rounded-2xl bg-[#f9f7f2] border border-ink/5">
              <span className="inline-grid place-items-center size-8 rounded-full bg-ink text-canvas font-bold text-sm mb-4">3</span>
              <h3 className="t-title font-bold text-base text-ink">Acknowledge offline</h3>
              <p className="t-body-sm text-ink/75 mt-2 leading-relaxed">
                When the conditions are met, MinDrop fires an active loop alarm. The alarm keeps ringing until you check it off, ensuring you never overlook a drop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Competitor Comparison Table */}
      <section className="py-20 bg-[#f9f7f2] border-b border-ink/5">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="t-eyebrow text-[#FF671F] uppercase font-bold tracking-wider">Comparison</span>
            <h2 className="t-display mt-2 text-3xl sm:text-4xl font-extrabold text-ink">
              Why not use a standard checklist?
            </h2>
            <p className="t-body mt-2 text-ink/70">Compare how MinDrop handles the details compared to standard apps.</p>
          </div>

          <div className="overflow-x-auto border border-ink/8 rounded-[2rem] bg-white">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-ink/8 bg-canvas">
                  <th className="p-5 font-bold text-xs uppercase text-ink/50 tracking-wider">Capabilities</th>
                  <th className="p-5 font-bold text-xs uppercase text-[#FF671F] tracking-wider bg-[#FF671F]/5">MinDrop Second Brain</th>
                  <th className="p-5 font-bold text-xs uppercase text-ink/50 tracking-wider">Standard Checklists (Todoist)</th>
                  <th className="p-5 font-bold text-xs uppercase text-ink/50 tracking-wider">Calendar Apps (Google Cal)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/8">
                <tr>
                  <td className="p-5 font-bold text-sm text-ink">Looping Alarm Alerts</td>
                  <td className="p-5 text-emerald-600 bg-[#FF671F]/5"><Check className="size-5" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5" /></td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-sm text-ink">Notification Rule Filters</td>
                  <td className="p-5 text-emerald-600 bg-[#FF671F]/5"><Check className="size-5" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5" /></td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-sm text-ink">Zero-Drain Geofencing</td>
                  <td className="p-5 text-emerald-600 bg-[#FF671F]/5"><Check className="size-5" /></td>
                  <td className="p-5 text-ink/30"><Check className="size-5" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5" /></td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-sm text-ink">100% Offline SQLite database</td>
                  <td className="p-5 text-emerald-600 bg-[#FF671F]/5"><Check className="size-5" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5" /></td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-sm text-ink">Reboot alarm resilience</td>
                  <td className="p-5 text-emerald-600 bg-[#FF671F]/5"><Check className="size-5" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Core Modules Grid */}
      <section className="py-20 bg-canvas border-b border-ink/5">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="t-eyebrow text-[#FF671F] uppercase font-bold tracking-wider">Features</span>
            <h2 className="t-display mt-2 text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
              Three pillars of absolute clarity.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Later Module */}
            <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-white border border-ink/8 shadow-sm">
              <div>
                <span className="inline-grid place-items-center size-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                  <AlarmClock className="size-5" />
                </span>
                <h3 className="t-title text-xl font-bold text-ink">Later Module</h3>
                <p className="t-body-sm text-ink/75 mt-3 leading-relaxed">
                  Persistent loop alarms for task captures. Dictate a thought, attach photos, and set precise time alerts that survive device reboots.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-ink/60 font-semibold">
                  <li className="flex items-center gap-2">⏰ Voice note recorder built-in</li>
                  <li className="flex items-center gap-2">⏰ Image attachments</li>
                  <li className="flex items-center gap-2">⏰ Ring loop alarm until checkoff</li>
                </ul>
              </div>
              <Link to="/later-feature" className="t-button mt-6 text-[#10b981] hover:underline text-xs uppercase tracking-wider font-bold">
                Learn Later Module →
              </Link>
            </div>

            {/* Notify Module */}
            <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-white border border-ink/8 shadow-sm">
              <div>
                <span className="inline-grid place-items-center size-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 mb-5">
                  <BellRing className="size-5" />
                </span>
                <h3 className="t-title text-xl font-bold text-ink">Notify Module</h3>
                <p className="t-body-sm text-ink/75 mt-3 leading-relaxed">
                  Transform noisy app alerts into actionable loop alarms. Build strict filters (e.g. WhatsApp from family or bank transactions) to wake your phone.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-ink/60 font-semibold">
                  <li className="flex items-center gap-2">🔔 Regular expression filters</li>
                  <li className="flex items-center gap-2">🔔 High-priority silent override</li>
                  <li className="flex items-center gap-2">🔔 UPI transaction alarms</li>
                </ul>
              </div>
              <Link to="/notify-feature" className="t-button mt-6 text-[#f59e0b] hover:underline text-xs uppercase tracking-wider font-bold">
                Learn Notify Module →
              </Link>
            </div>

            {/* Places Module */}
            <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-white border border-ink/8 shadow-sm">
              <div>
                <span className="inline-grid place-items-center size-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 mb-5">
                  <Navigation className="size-5" />
                </span>
                <h3 className="t-title text-xl font-bold text-ink">Places Module</h3>
                <p className="t-body-sm text-ink/75 mt-3 leading-relaxed">
                  Geolocation-triggered reminders. MinDrop maps custom coordinates and monitors boundaries quietly in the background without draining your battery.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-ink/60 font-semibold">
                  <li className="flex items-center gap-2">📍 Battery-efficient geofences</li>
                  <li className="flex items-center gap-2">📍 Radius range customization</li>
                  <li className="flex items-center gap-2">📍 Arrival alarms on coordinates</li>
                </ul>
              </div>
              <Link to="/places-feature" className="t-button mt-6 text-[#8b5cf6] hover:underline text-xs uppercase tracking-wider font-bold">
                Learn Places Module →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Advanced: Recall, Summary & Privacy */}
      <section className="py-20 bg-[#f9f7f2] border-b border-ink/5">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16 grid gap-12 md:grid-cols-2">
          <div className="space-y-8 flex flex-col justify-center">
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

          <div className="bg-white border border-ink/8 p-8 rounded-[2rem] flex flex-col justify-center shadow-sm">
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

      {/* 6. Pricing Teaser */}
      <section className="py-20 bg-canvas border-b border-ink/5 text-center">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
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
              className="t-button inline-flex items-center gap-2 rounded-2xl bg-ink text-canvas px-7 py-4 hover:opacity-90 font-bold transition text-sm"
            >
              See Pricing Details
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion */}
      <section className="py-20 bg-[#f9f7f2]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 md:px-12 lg:px-16">
          <h2 className="t-display text-center text-3xl font-extrabold text-ink mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4 max-w-3xl mx-auto">
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
          
          <div className="text-center mt-10">
            <Link to="/faq" className="t-body-sm text-[#FF671F] font-bold hover:underline">
              See All FAQs →
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
