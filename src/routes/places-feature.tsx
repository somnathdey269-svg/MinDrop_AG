import { createFileRoute, Link } from "@tanstack/react-router";
import { Navigation, Check, X, ArrowRight, ShieldAlert, Play, Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/places-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Places Module — MinDrop Geofencing" },
      { name: "description", content: "Learn how MinDrop maps coordinate radiuses and triggers checklist alarms upon entry." },
    ],
  }),
  component: PlacesDetailView,
});

function PlacesDetailView() {
  const { from } = Route.useSearch();

  return (
    <div className="min-h-screen w-full bg-[#F5F3FF] flex flex-col justify-between p-6 select-none overflow-y-auto">
      
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
          style={{ viewTransitionName: 'card-places' } as React.CSSProperties}
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
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-[#F5F3FF] px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#8B5CF6] mb-4">
                📍 Places Mapping
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink leading-tight tracking-tight">
                Trigger reminders near locations.
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="shrink-0 self-center md:self-auto"
            >
              <motion.div
                animate={{ y: [0, -12, 0], scale: [1, 1.03, 1] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                className="size-36 md:size-48 bg-[#F5F3FF] border-3 border-ink rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative"
              >
                <Navigation className="size-16 md:size-22 text-ink stroke-[2.5px]" />
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
              <Sparkles className="size-4.5 text-[#8B5CF6]" />
              Process Flow Diagram
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
              {/* Step 1 */}
              <div className="border-2 border-ink bg-white p-4.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-wider">01 / Setup</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">Define Geofence</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">Configure location coordinate & radius limits</p>
              </div>

              {/* Arrow 1 */}
              <div className="flex justify-center text-ink/30 rotate-90 md:rotate-0 py-1 md:py-0">
                <ArrowRight className="size-6 shrink-0" />
              </div>

              {/* Step 2 */}
              <div className="border-2 border-ink bg-white p-4.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-wider">02 / Listen</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">Cell Sweeper</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">On-device monitor shifts network cell towers</p>
              </div>

              {/* Arrow 2 */}
              <div className="flex justify-center text-ink/30 rotate-90 md:rotate-0 py-1 md:py-0">
                <ArrowRight className="size-6 shrink-0" />
              </div>

              {/* Step 3 */}
              <div className="border-2 border-ink bg-white p-4.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-wider">03 / Query</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">SQLite Lookup</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">Verifies geofence limits locally on shift</p>
              </div>

              {/* Arrow 3 */}
              <div className="flex justify-center text-ink/30 rotate-90 md:rotate-0 py-1 md:py-0">
                <ArrowRight className="size-6 shrink-0" />
              </div>

              {/* Step 4 */}
              <div className="border-2 border-ink bg-white p-4.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-wider">04 / Loop</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">Location Alarm</h4>
                <h5 className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">Triggers alarms right upon entering area</h5>
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
                <ShieldAlert className="size-4.5 shrink-0" />
                The Pain Point
              </h3>
              <p className="text-sm font-bold text-ink/80 leading-relaxed">
                Reminders based solely on time are useless when a task requires physical presence at a venue. Standard geofencing services poll GPS constantly, draining device battery reserves in a matter of hours.
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
                MinDrop reads background network cell tower identifiers. When a cell switch is registered, the local SQLite processor checks boundary coordinates. Full GPS is only turned on for high-accuracy confirmation once close.
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
                Maximize execution. Get loop alarms precisely when arriving at the clinic or store, keeping location histories completely confidential since coordinates are never sent online.
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
                <MapPin className="size-4.5 shrink-0" />
                Key Specifications
              </h3>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3 text-xs sm:text-sm font-bold text-ink">
                  <Check className="size-5 text-[#8B5CF6] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>Battery-optimized passive cell tower sweeps</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm font-bold text-ink">
                  <Check className="size-5 text-[#8B5CF6] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>Circular geofence radius adjustment (50m to 2km)</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm font-bold text-ink">
                  <Check className="size-5 text-[#8B5CF6] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>Secure local SQLite coordinates storage database</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm font-bold text-ink">
                  <Check className="size-5 text-[#8B5CF6] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>Real-time alarm alerts triggered directly upon entry</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer Sync */}
      <footer className="flex justify-between items-center w-full z-10 shrink-0 mt-4">
        <span className="text-xs font-black uppercase tracking-wider text-ink/40">India · Geofence Hook</span>
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
