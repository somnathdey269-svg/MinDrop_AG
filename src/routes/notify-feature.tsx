import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, Check, X, ArrowRight, ShieldCheck, Play, Sparkles, Filter } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/notify-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Notify Module — MinDrop Filters" },
      { name: "description", content: "Learn how MinDrop converts noisy notification alerts into active, DND-bypassing loop alarms." },
    ],
  }),
  component: NotifyDetailView,
});

function NotifyDetailView() {
  const { from } = Route.useSearch();

  return (
    <div className="min-h-screen w-full bg-[#FFFBEB] flex flex-col justify-between p-6 select-none overflow-y-auto">
      
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
          style={{ viewTransitionName: 'card-notify' } as React.CSSProperties}
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
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-[#FFFBEB] px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#F59E0B] mb-4">
                🔔 Smart Filters
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink leading-tight tracking-tight">
                Filter messy pings into alarms.
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="shrink-0 self-center md:self-auto"
            >
              <motion.div
                animate={{ rotateZ: [-10, 10, -10], y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="size-36 md:size-48 bg-[#FFFBEB] border-3 border-ink rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative"
              >
                <BellRing className="size-16 md:size-22 text-ink stroke-[2.5px]" />
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
              <Sparkles className="size-4.5 text-[#F59E0B]" />
              Process Flow Diagram
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
              {/* Step 1 */}
              <div className="border-2 border-ink bg-white p-4.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-[10px] font-black text-[#F59E0B] uppercase tracking-wider">01 / Arrive</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">System Alert</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">Raw OS notification matches active listener</p>
              </div>

              {/* Arrow 1 */}
              <div className="flex justify-center text-ink/30 rotate-90 md:rotate-0 py-1 md:py-0">
                <ArrowRight className="size-6 shrink-0" />
              </div>

              {/* Step 2 */}
              <div className="border-2 border-ink bg-white p-4.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-[10px] font-black text-[#F59E0B] uppercase tracking-wider">02 / Filter</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">Local Regex</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">On-device parser scans text & amount rules</p>
              </div>

              {/* Arrow 2 */}
              <div className="flex justify-center text-ink/30 rotate-90 md:rotate-0 py-1 md:py-0">
                <ArrowRight className="size-6 shrink-0" />
              </div>

              {/* Step 3 */}
              <div className="border-2 border-ink bg-white p-4.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-[10px] font-black text-[#F59E0B] uppercase tracking-wider">03 / Bypass</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">DND Sweep</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">Overrides silent rules for urgent matches</p>
              </div>

              {/* Arrow 3 */}
              <div className="flex justify-center text-ink/30 rotate-90 md:rotate-0 py-1 md:py-0">
                <ArrowRight className="size-6 shrink-0" />
              </div>

              {/* Step 4 */}
              <div className="border-2 border-ink bg-white p-4.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-[10px] font-black text-[#F59E0B] uppercase tracking-wider">04 / Loop</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">Ringer Loop</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">Fires persistent full alarm interface</p>
              </div>
            </div>
          </motion.div>

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
                <ShieldCheck className="size-4.5 shrink-0" />
                The Pain Point
              </h3>
              <p className="text-sm font-bold text-ink/80 leading-relaxed">
                Hundreds of daily chat alerts and marketing pings create notification fatigue. Under silent/DND modes, critical server downtime warnings, emergency alerts, or vital payment confirmations get lost in the clutter.
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
                MinDrop runs a notification intercept service. Incoming status alerts are scanned locally via lightweight text-matching algorithms. Matches trigger a high-priority system channel designed to override DND thresholds.
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
                Bypass DND safely. Rest assured that low-priority notifications stay completely silent, while urgent transactional messages or custom regex matches trigger full persistent ringer loops immediately.
              </p>
            </motion.div>

            {/* Core Capabilities */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.24 }}
              className="border-3 border-ink p-6.5 sm:p-8 rounded-[2rem] bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left"
            >
              <h3 className="font-black text-ink text-xs sm:text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <Filter className="size-4.5 shrink-0" />
                Key Specifications
              </h3>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3 text-xs sm:text-sm font-bold text-ink">
                  <Check className="size-5 text-[#F59E0B] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>On-device regular expression text scanners</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm font-bold text-ink">
                  <Check className="size-5 text-[#F59E0B] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>Automatic bank UPI transaction SMS listener</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm font-bold text-ink">
                  <Check className="size-5 text-[#F59E0B] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>Strict system channel DND/Silent overrides</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm font-bold text-ink">
                  <Check className="size-5 text-[#F59E0B] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>100% private, sandbox-safe offline operations</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer Sync */}
      <footer className="flex justify-between items-center w-full z-10 shrink-0 mt-4">
        <span className="text-xs font-black uppercase tracking-wider text-ink/40">India · Privacy Secured</span>
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
