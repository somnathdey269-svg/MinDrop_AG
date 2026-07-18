import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Check, X } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/pricing")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Pricing & Plans — MinDrop" },
      { name: "description", content: "Compare MinDrop's Free Plan with the Premium Plan. Unlimited active drops and private Google Drive backup sync." },
    ],
  }),
  component: PricingDetailView,
});

function PricingDetailView() {
  const { from } = Route.useSearch();

  return (
    <div className="fixed inset-0 bg-[#FDF2F7] flex flex-col justify-between p-6 overflow-hidden h-[100dvh] w-screen select-none">
      
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-[#FDF2F7] px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#EC4899] mb-6">
              💎 Pricing Specs
            </span>

            <h1 className="text-4xl sm:text-5xl font-black text-ink leading-tight tracking-tight">
              Keep it free, or unlock limits.
            </h1>

            <div className="mt-6">
              <p className="text-[#EA3323] text-xs font-black uppercase tracking-widest">TL;DR</p>
              <p className="text-sm font-semibold text-ink/75 mt-1 leading-relaxed">
                Start with a powerful Free plan that covers up to 5 concurrent active alarms. Support the development with a one-time lifetime Premium purchase to unlock unlimited storage.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t-2 border-dashed border-ink/10">
              <div className="border-2 border-ink rounded-2xl p-4 bg-canvas">
                <p className="text-[10px] uppercase font-bold text-ink/50">Free Plan</p>
                <p className="text-xl font-black text-ink mt-1">₹0 / Free</p>
                <ul className="text-[11px] text-ink/70 font-semibold mt-3 space-y-1">
                  <li>• 5 Active drops</li>
                  <li>• Voice & photo alarms</li>
                  <li>• Notification listeners</li>
                  <li>• SQLite database</li>
                </ul>
              </div>
              <div className="border-2 border-ink rounded-2xl p-4 bg-[#FDF2F7]">
                <p className="text-[10px] uppercase font-bold text-[#EC4899]">Premium</p>
                <p className="text-xl font-black text-ink mt-1">Lifetime</p>
                <ul className="text-[11px] text-ink/70 font-semibold mt-3 space-y-1">
                  <li>• Unlimited active drops</li>
                  <li>• Google Drive Sync</li>
                  <li>• Custom theme packs</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side Graphics Column */}
          <div className="md:col-span-5 flex justify-center items-center">
            <motion.div
              animate={{ rotate: [-8, 8, -8], y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="size-48 md:size-60 bg-[#FDF2F7] border-3 border-ink rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative"
            >
              <Sparkles className="size-20 md:size-24 text-ink stroke-[2.5px]" />
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer Sync */}
      <footer className="flex justify-between items-center w-full z-10 shrink-0">
        <span className="text-xs font-black uppercase tracking-wider text-ink/40">India · Purchase Options</span>
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
