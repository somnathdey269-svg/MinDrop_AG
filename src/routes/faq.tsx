import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Check, X, ChevronDown } from "lucide-react";
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
    <div className="fixed inset-0 bg-[#F0FDF4] flex flex-col justify-between p-6 overflow-hidden h-[100dvh] w-screen select-none">
      
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
          style={{ viewTransitionName: 'card-faq' } as React.CSSProperties}
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
          <div className="md:col-span-8 text-left pr-2 w-full">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-[#F0FDF4] px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#22C55E] mb-6">
              🛡️ Help Center
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-none tracking-tight">
              Get answers to key questions.
            </h1>

            {/* Accordion panel inside detailed view (Expanded height bounds) */}
            <div className="mt-8 space-y-3.5 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
              {faqData.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className="bg-canvas rounded-2xl border-2 border-ink overflow-hidden transition-all duration-200">
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

          {/* Right Side Graphics Column */}
          <div className="md:col-span-4 flex justify-center items-center">
            <motion.div
              animate={{ rotateZ: [-5, 5, -5], y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="size-48 md:size-64 bg-[#F0FDF4] border-3 border-ink rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative"
            >
              <ShieldCheck className="size-24 md:size-28 text-ink stroke-[2.5px]" />
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer Sync */}
      <footer className="flex justify-between items-center w-full z-10 shrink-0">
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
