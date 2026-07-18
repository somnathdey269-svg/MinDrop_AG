import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, Check, X } from "lucide-react";
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
    <div className="fixed inset-0 bg-[#FFFBEB] flex flex-col justify-between p-6 overflow-hidden h-[100dvh] w-screen select-none">
      
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
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
        >
          View Deck
        </Link>
      </header>

      {/* Main Centered Showcase Card */}
      <main className="flex-1 flex items-center justify-center relative w-full my-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="w-full max-w-5xl bg-white border-3 border-ink rounded-[2.5rem] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative grid md:grid-cols-12 gap-8 items-center max-h-[80vh] overflow-y-auto"
        >
          {/* Close Button X linking back to homepage */}
          <Link
            to="/"
            hash={from === "grid" ? "grid" : undefined}
            className="absolute top-6 right-6 size-10 rounded-full border-2 border-ink bg-white grid place-items-center hover:bg-ink/5 transition z-20 cursor-pointer active:scale-95"
            aria-label="Close"
          >
            <X className="size-5 text-ink" />
          </Link>

          {/* Left Side Content Column */}
          <div className="md:col-span-7 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-[#FFFBEB] px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#F59E0B] mb-6">
              🔔 Smart Filters
            </span>

            <h1 className="text-4xl sm:text-5xl font-black text-ink leading-tight tracking-tight">
              Filter messy pings into alarms.
            </h1>

            <div className="mt-6">
              <p className="text-[#EA3323] text-xs font-black uppercase tracking-widest">TL;DR</p>
              <p className="text-sm font-semibold text-ink/75 mt-1 leading-relaxed">
                Most push notifications are distractions that keep you glued to your phone. MinDrop intercepts notifications locally and triggers persistent loop alarms only for rules you set.
              </p>
            </div>

            <ul className="mt-8 space-y-3.5 border-t-2 border-dashed border-ink/10 pt-6">
              <li className="flex items-start gap-3 text-xs md:text-sm font-bold text-ink">
                <Check className="size-5 text-[#F59E0B] shrink-0 mt-0.5 stroke-[3px]" />
                <span>Custom text triggers parse alerts from Slack, WhatsApp, or Outlook.</span>
              </li>
              <li className="flex items-start gap-3 text-xs md:text-sm font-bold text-ink">
                <Check className="size-5 text-[#F59E0B] shrink-0 mt-0.5 stroke-[3px]" />
                <span>Bypass DND overrides to force alarms even during silent or meeting modes.</span>
              </li>
              <li className="flex items-start gap-3 text-xs md:text-sm font-bold text-ink">
                <Check className="size-5 text-[#F59E0B] shrink-0 mt-0.5 stroke-[3px]" />
                <span>Build UPI transaction monitors matching bank SMS alerts above specific amounts.</span>
              </li>
              <li className="flex items-start gap-3 text-xs md:text-sm font-bold text-ink">
                <Check className="size-5 text-[#F59E0B] shrink-0 mt-0.5 stroke-[3px]" />
                <span>Notification sweeps happen entirely on-device, preserving messaging privacy.</span>
              </li>
            </ul>
          </div>

          {/* Right Side Graphics Column */}
          <div className="md:col-span-5 flex justify-center items-center">
            <motion.div
              animate={{ rotateZ: [-10, 10, -10], y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="size-48 md:size-60 bg-[#FFFBEB] border-3 border-ink rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative"
            >
              <BellRing className="size-20 md:size-24 text-ink stroke-[2.5px]" />
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer Sync */}
      <footer className="flex justify-between items-center w-full z-10 shrink-0">
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
