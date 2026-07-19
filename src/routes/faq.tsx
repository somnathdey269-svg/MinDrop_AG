import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Check, X, ChevronDown, ArrowRight, ShieldAlert, Play, Sparkles, HelpCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const faqData = [
  {
    q: "Is my data private and secure?",
    a: "Absolutely. MinDrop is built on a zero-knowledge local storage model. Your drops, notes, photos, and voice clips are stored locally on your Android device in a secure SQLite database. If you upgrade to Premium, backups sync directly to your private Google Drive folder. We have zero servers, zero trackers, and zero access to your information."
  },
  {
    q: "How does the location geofencing work offline?",
    a: "MinDrop integrates with Android's OS-level Geofencing APIs. It registers coordinate boundary circles around your locations (like your home, office, or local store). The phone monitors these zones locally. It does not send coordinates to any cloud API, meaning it works entirely offline."
  },
  {
    q: "Will background tracking drain my phone battery?",
    a: "No. Standard GPS tracking runs constantly in the foreground, causing heavy battery drain. MinDrop registers geofences with the operating system, allowing the OS to trigger boundary events only when cell towers indicate movement. This reduces background battery consumption to 0%."
  },
  {
    q: "What happens to my alarms when my phone reboots?",
    a: "MinDrop is built with native reboot listeners. When your Android device boots up or restarts, MinDrop automatically executes a local background sweep and schedules all your pending alarms, ensuring nothing is ever missed."
  },
  {
    q: "How do Notify filters read incoming notifications?",
    a: "MinDrop requests Android's Notification Listener Permission. This is a local service that runs on your device to inspect incoming notification banners. When it matches a word rule you set (e.g., 'boss' on Slack, or '₹' on bank messages), it plays a looping alarm. No notification data ever leaves your device."
  }
];

export const Route = createFileRoute("/faq")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "FAQ & Help Center — MinDrop" },
      { name: "description", content: "Answers to common questions about MinDrop's privacy, location geofencing, notification filters, and battery performance." },
    ],
  }),
  component: FaqDetailView,
});

function FaqDetailView() {
  const { from } = Route.useSearch();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen w-full bg-[#F0FDF4] flex flex-col justify-between p-6 select-none overflow-y-auto">
      
      {/* Top Header Sync */}
      <header className="flex justify-between items-center w-full z-10 shrink-0 mb-8">
        <span className="text-xs uppercase tracking-wider font-black text-ink/40">Spec Sheet</span>
        <div className="flex items-center gap-2">
          <span className="inline-grid place-items-center size-8 rounded-lg bg-[#FF671F] text-white font-black border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm">M</span>
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline text-ink/80">MinDrop Specs</span>
        </div>
        <Link
          to="/"
          hash={from === "grid" ? "grid" : undefined}
          viewTransition
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
        >
          View Deck
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center relative w-full mb-12">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          style={{ viewTransitionName: 'card-faq' } as React.CSSProperties}
          className="w-full max-w-5xl bg-white border-3 border-ink rounded-[2.5rem] p-6 sm:p-10 md:p-14 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col gap-10"
        >
          {/* Close button inside card */}
          <Link
            to="/"
            hash={from === "grid" ? "grid" : undefined}
            viewTransition
            className="absolute top-6 right-6 size-10 rounded-full border-2 border-ink bg-white grid place-items-center hover:bg-ink/5 transition z-20 cursor-pointer active:scale-95"
            aria-label="Close"
          >
            <X className="size-5 text-ink" />
          </Link>

          {/* Hero Row */}
          <div className="flex flex-col md:flex-row justify-between gap-8 items-start md:items-center mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="flex-1 text-left"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-[#F0FDF4] px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#22C55E] mb-4">
                🛡️ Help Center
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink leading-tight tracking-tight">
                Get answers to key questions.
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="shrink-0 self-center md:self-auto"
            >
              <motion.div
                animate={{ rotateZ: [-5, 5, -5], y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="size-36 md:size-48 bg-[#F0FDF4] border-3 border-ink rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative"
              >
                <ShieldCheck className="size-16 md:size-22 text-ink stroke-[2.5px]" />
              </motion.div>
            </motion.div>
          </div>

          {/* Process Flow Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="border-3 border-ink rounded-[2rem] p-6 sm:p-8 bg-[#F9F7F2] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <h3 className="font-black text-ink mb-6 uppercase tracking-wider text-xs sm:text-sm border-b-2 border-ink/10 pb-3 flex items-center gap-2">
              <Sparkles className="size-4.5 text-[#22C55E]" />
              Process Flow Diagram
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
              {/* Step 1 */}
              <div className="border-2 border-ink bg-white p-4.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-wider">01 / Query</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">Find Issue</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">Browse active FAQs for general configuration queries</p>
              </div>

              {/* Arrow 1 */}
              <div className="flex justify-center text-ink/30 rotate-90 md:rotate-0 py-1 md:py-0">
                <ArrowRight className="size-6 shrink-0" />
              </div>

              {/* Step 2 */}
              <div className="border-2 border-ink bg-white p-4.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-wider">02 / Check</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">Diagnose Local</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">Scan permission status & SQLite storage records</p>
              </div>

              {/* Arrow 2 */}
              <div className="flex justify-center text-ink/30 rotate-90 md:rotate-0 py-1 md:py-0">
                <ArrowRight className="size-6 shrink-0" />
              </div>

              {/* Step 3 */}
              <div className="border-2 border-ink bg-white p-4.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-wider">03 / Fix</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">Adjust Setup</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">Authorize DND/silent settings overrides locally</p>
              </div>

              {/* Arrow 3 */}
              <div className="flex justify-center text-ink/30 rotate-90 md:rotate-0 py-1 md:py-0">
                <ArrowRight className="size-6 shrink-0" />
              </div>

              {/* Step 4 */}
              <div className="border-2 border-ink bg-white p-4.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-wider">04 / State</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">Optimal Run</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">App runs smoothly with zero data leak queries</p>
              </div>
            </div>
          </motion.div>

          {/* Accordion panel inside detailed view (Expanded height bounds) */}
          <div className="border-3 border-ink rounded-[2rem] p-6 sm:p-8 bg-[#F9F7F2] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-ink mb-6 uppercase tracking-wider text-xs sm:text-sm border-b-2 border-ink/10 pb-3 flex items-center gap-2">
              <HelpCircle className="size-4.5 text-[#22C55E]" />
              Frequently Answered Specs
            </h3>
            <div className="space-y-3.5 pr-2">
              {faqData.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className="bg-white rounded-2xl border-2 border-ink overflow-hidden transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-4.5 text-left font-black text-ink cursor-pointer hover:bg-ink/[0.02] text-xs sm:text-sm md:text-base"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`size-4 text-ink/50 transition-transform duration-200 shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1.5 border-t-2 border-ink text-ink/75 leading-relaxed text-xs sm:text-sm font-semibold">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Structured Context Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* The Pain */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 }}
              className="border-3 border-ink p-6.5 sm:p-8 rounded-[2rem] bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-2.5"
            >
              <h3 className="font-black text-[#EA3323] text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="size-4.5 shrink-0" />
                The Pain Point
              </h3>
              <p className="text-sm font-bold text-ink/80 leading-relaxed">
                Most task applications collect system log histories, require active server internet access to explain troubleshooting instructions, or lock simple permission settings behind paywalls.
              </p>
            </motion.div>

            {/* The Engine */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="border-3 border-ink p-6.5 sm:p-8 rounded-[2rem] bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-2.5"
            >
              <h3 className="font-black text-brand text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                <Play className="size-4.5 shrink-0" />
                Under the Hood
              </h3>
              <p className="text-sm font-bold text-ink/80 leading-relaxed">
                MinDrop is completely serverless. Diagnostics query Android API levels and local sqlite file configurations directly to troubleshoot issues locally on-device.
              </p>
            </motion.div>

            {/* The Help */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 }}
              className="border-3 border-ink p-6.5 sm:p-8 rounded-[2rem] bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-2.5"
            >
              <h3 className="font-black text-[#10B981] text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="size-4.5 shrink-0" />
                How It Helps You
              </h3>
              <p className="text-sm font-bold text-ink/80 leading-relaxed">
                Full transparency. Review guidelines offline and check permission status securely, keeping your reminder data in your hands with absolute zero telemetries.
              </p>
            </motion.div>

            {/* Core Capabilities */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.26 }}
              className="border-3 border-ink p-6.5 sm:p-8 rounded-[2rem] bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left"
            >
              <h3 className="font-black text-ink text-xs sm:text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="size-4.5 shrink-0" />
                Key Specifications
              </h3>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3 text-xs sm:text-sm font-bold text-ink">
                  <Check className="size-5 text-[#22C55E] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>Local zero-knowledge offline troubleshooting guide</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm font-bold text-ink">
                  <Check className="size-5 text-[#22C55E] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>On-device database storage diagnostics engine</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm font-bold text-ink">
                  <Check className="size-5 text-[#22C55E] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>Comprehensive background services validation sweep</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm font-bold text-ink">
                  <Check className="size-5 text-[#22C55E] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>Zero trackers, analytics cookies, or web queries</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer Sync */}
      <footer className="flex justify-between items-center w-full z-10 shrink-0 mt-4">
        <span className="text-xs font-black uppercase tracking-wider text-ink/40">India · FAQs FAQ</span>
        <Link
          to="/privacy"
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
        >
          Privacy Promise
        </Link>
      </footer>
    </div>
  );
}
