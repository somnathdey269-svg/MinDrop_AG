import { createFileRoute, Link } from "@tanstack/react-router";
import { AlarmClock, Check, X } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/later-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Later Module — MinDrop Alarms" },
      { name: "description", content: "Learn how MinDrop's Later alarms ring persistently until checked and survive restarts." },
    ],
  }),
  component: LaterDetailView,
});

function LaterDetailView() {
  const { from } = Route.useSearch();
  
  return (
    <div className="fixed inset-0 bg-[#E2F5EC] flex flex-col justify-between p-6 overflow-hidden h-[100dvh] w-screen select-none">
      
      {/* Top Header Sync */}
      <header className="flex justify-between items-center w-full z-10 shrink-0">
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

      {/* Main Centered Showcase Card (Optimized constraints to remove empty space) */}
      <main className="flex-1 flex items-center justify-center relative w-full my-2">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          style={{ viewTransitionName: 'card-later' } as React.CSSProperties}
          className="w-full max-w-6xl bg-white border-3 border-ink rounded-[2.5rem] p-8 sm:p-12 md:p-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative grid md:grid-cols-12 gap-8 items-center max-h-[85vh] min-h-[70vh] overflow-y-auto"
        >
          <Link
            to="/"
            hash={from === "grid" ? "grid" : undefined}
            viewTransition
            className="absolute top-6 right-6 size-10 rounded-full border-2 border-ink bg-white grid place-items-center hover:bg-ink/5 transition z-20 cursor-pointer active:scale-95"
            aria-label="Close"
          >
            <X className="size-5 text-ink" />
          </Link>

          {/* Left Side Content Column (Enlarged text and minimized padding gutters) */}
          <div className="md:col-span-8 text-left pr-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-[#E2F5EC] px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#10B981] mb-6">
              ⏰ Later Alarm
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-none tracking-tight">
              Ring looping alarms for tasks.
            </h1>

            <div className="mt-6">
              <p className="text-[#EA3323] text-xs font-black uppercase tracking-widest">TL;DR</p>
              <p className="text-sm sm:text-base font-bold text-ink/75 mt-2 leading-relaxed">
                Ordinary push notifications get ignored in busy dashboards. MinDrop Later alarms ring continuously like a phone call, forcing immediate attention until you check it off.
              </p>
            </div>

            <ul className="mt-8 space-y-4 border-t-2 border-dashed border-ink/10 pt-6">
              <li className="flex items-start gap-3.5 text-xs sm:text-sm md:text-base font-bold text-ink">
                <Check className="size-5.5 text-[#10B981] shrink-0 mt-0.5 stroke-[3px]" />
                <span>Dictate thoughts on the go with built-in voice memo capture.</span>
              </li>
              <li className="flex items-start gap-3.5 text-xs sm:text-sm md:text-base font-bold text-ink">
                <Check className="size-5.5 text-[#10B981] shrink-0 mt-0.5 stroke-[3px]" />
                <span>Snap images as alarm attachments (parking spots, notes, prescriptions).</span>
              </li>
              <li className="flex items-start gap-3.5 text-xs sm:text-sm md:text-base font-bold text-ink">
                <Check className="size-5.5 text-[#10B981] shrink-0 mt-0.5 stroke-[3px]" />
                <span>Boot recovery sweeps reschedule all alarms automatically on restarts.</span>
              </li>
              <li className="flex items-start gap-3.5 text-xs sm:text-sm md:text-base font-bold text-ink">
                <Check className="size-5.5 text-[#10B981] shrink-0 mt-0.5 stroke-[3px]" />
                <span>Snooze overlay lists allow custom delay ranges (5m, 15m, 30m, custom picker).</span>
              </li>
            </ul>
          </div>

          {/* Right Side Graphics Column */}
          <div className="md:col-span-4 flex justify-center items-center">
            <motion.div
              animate={{ rotate: [0, 360], y: [0, -10, 0] }}
              transition={{
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="size-48 md:size-64 bg-[#E2F5EC] border-3 border-ink rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative"
            >
              <AlarmClock className="size-24 md:size-28 text-ink stroke-[2.5px]" />
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer Sync */}
      <footer className="flex justify-between items-center w-full z-10 shrink-0">
        <span className="text-xs font-black uppercase tracking-wider text-ink/40">India · Offline Engine</span>
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
