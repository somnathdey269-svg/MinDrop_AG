import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Check, X, ChevronDown, ArrowRight, ShieldAlert, Play, Sparkles, HelpCircle, MapPin, Volume2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/faq")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "FAQ & Help Center — MinDrop" },
      { name: "description", content: "Answers to common questions about MinDrop's privacy, location geofencing, notification filters, and battery performance." },
    ],
  }),
  component: FaqDetailView,
});

/* ──────────────────────────────────────────────
   SUBTLE STEP ILLUSTRATIONS
────────────────────────────────────────────── */
function HelpIllustration() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ y: [-12, 12, -12], rotate: [-6, 6, -6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="size-24 sm:size-28 md:size-32 bg-[#D1FAE5] border-3 border-[#10B981] rounded-[2rem] grid place-items-center shadow-lg text-[#047857]"
      >
        <HelpCircle className="size-14 sm:size-16 stroke-[2px]" />
      </motion.div>
    </div>
  );
}

function PrivacyIllustration() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="size-24 sm:size-28 md:size-32 bg-white border-3 border-[#10B981] rounded-[2rem] grid place-items-center shadow-lg text-[#10B981]"
      >
        <ShieldCheck className="size-14 sm:size-16 stroke-[2px]" />
      </motion.div>
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 2.0], opacity: [0.3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 1.25 }}
          className="absolute size-24 border-2 border-[#10B981] rounded-full"
        />
      ))}
    </div>
  );
}

function BatteryIllustration() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="size-24 sm:size-28 md:size-32 bg-[#D1FAE5] border-3 border-[#10B981] rounded-[2rem] grid place-items-center shadow-lg text-[#047857]"
      >
        <MapPin className="size-14 sm:size-16 stroke-[2px] fill-[#A7F3D0]" />
      </motion.div>
      <motion.div
        animate={{ scale: [0.7, 1.3, 0.7], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-4 w-16 h-2 bg-ink/10 rounded-full blur-sm"
      />
    </div>
  );
}

function AlarmIllustration() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ rotate: [-6, 6, -6], scale: [1, 1.05, 1] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatType: "reverse" }}
        className="size-24 sm:size-28 md:size-32 bg-[#10B981] border-3 border-ink rounded-[2rem] grid place-items-center shadow-lg text-white"
      >
        <Volume2 className="size-14 sm:size-16 stroke-[2.5px]" />
      </motion.div>
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.8 }}
          className="absolute size-24 border border-[#10B981] rounded-full"
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SLIDES
══════════════════════════════════════════════ */

/* Slide 1: Help Hero */
function SlideOpening() {
  return (
    <div className="h-full bg-[#E2F5EC] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 text-left">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/20 bg-[#D1FAE5] px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857] mb-6 sm:mb-8">
            🛡️ Help Center
          </motion.span>

          <div className="flex flex-col gap-3 sm:gap-4 mb-6">
            {[
              "Have questions about MinDrop?",
              "How location works offline?",
              "How data stays on your phone?",
            ].map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#047857]/45 leading-tight tracking-tight">
                {line}
              </motion.p>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.65 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#064E3B] leading-none tracking-tighter">
            Get answers instantly.
          </motion.p>
        </div>

        <div className="shrink-0">
          <HelpIllustration />
        </div>
      </div>
    </div>
  );
}

/* Slide 2: Privacy & Storage FAQ */
function SlidePrivacyFAQ() {
  const [active, setActive] = useState<number | null>(null);
  const data = [
    {
      q: "Is my task data private and secure?",
      a: "Yes. MinDrop uses a zero-knowledge local model. Your notes, voice recordings, and pictures sit inside a secure SQLite database on your phone. We have no servers, no ads, and zero access to your information."
    },
    {
      q: "How does the private Google Drive sync work?",
      a: "If you purchase Premium, backups sync straight to your private Google Drive space. The connection is direct between your phone and Google. We cannot see your files or credentials."
    }
  ];

  return (
    <div className="h-full bg-[#F0FDF4] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857] mb-3">01 / Privacy & Storage</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#064E3B] leading-tight mb-5 tracking-tight">
            Your personal life belongs only to you.
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#047857]/70 leading-relaxed mb-6">
            MinDrop is designed to run entirely client-side. There are no tracking scripts, analytics cookies, or backend servers scanning your tasks.
          </p>
          <div className="hidden lg:block">
            <PrivacyIllustration />
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col gap-4">
          <div className="block lg:hidden mb-2">
            <PrivacyIllustration />
          </div>
          {data.map((faq, idx) => (
            <div key={idx} className="bg-white border-3 border-ink rounded-[2rem] overflow-hidden shadow-[4px_4px_0px_0px_rgba(2,44,34,0.1)]">
              <button onClick={() => setActive(active === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 sm:p-7 text-left font-black text-ink text-xs sm:text-sm md:text-base cursor-pointer">
                <span>{faq.q}</span>
                <ChevronDown className={`size-4 text-ink/50 transition-transform shrink-0 ml-4 ${active === idx ? "rotate-180" : ""}`} />
              </button>
              {active === idx && (
                <div className="px-7 pb-6 pt-1.5 border-t-2 border-ink text-ink/75 leading-relaxed text-xs sm:text-sm md:text-base font-semibold">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Geofencing & Battery FAQ */
function SlideBatteryFAQ() {
  const [active, setActive] = useState<number | null>(null);
  const data = [
    {
      q: "Will background tracking drain my phone battery?",
      a: "No. Standard tracking keeps GPS running continuously, draining your battery quickly. MinDrop registers geofences with the operating system, allowing the OS to wake the app up only when cell towers note movement."
    },
    {
      q: "How does location geofencing work offline?",
      a: "MinDrop integrates with native OS Geofencing. We register boundaries (e.g., home or market) locally. The phone monitors these boundaries offline without uploading your coordinates to any web services."
    }
  ];

  return (
    <div className="h-full bg-[#E2F5EC] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857] mb-3">02 / Location & Battery</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#064E3B] leading-tight mb-5 tracking-tight">
            Background tracking with zero battery drain.
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#047857]/70 leading-relaxed mb-6">
            By delegating zone checks to native system micro-listeners, MinDrop avoids keeping your CPU active in the background.
          </p>
          <div className="hidden lg:block">
            <BatteryIllustration />
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col gap-4">
          <div className="block lg:hidden mb-2">
            <BatteryIllustration />
          </div>
          {data.map((faq, idx) => (
            <div key={idx} className="bg-white border-3 border-ink rounded-[2rem] overflow-hidden shadow-[4px_4px_0px_0px_rgba(2,44,34,0.1)]">
              <button onClick={() => setActive(active === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 sm:p-7 text-left font-black text-ink text-xs sm:text-sm md:text-base cursor-pointer">
                <span>{faq.q}</span>
                <ChevronDown className={`size-4 text-ink/50 transition-transform shrink-0 ml-4 ${active === idx ? "rotate-180" : ""}`} />
              </button>
              {active === idx && (
                <div className="px-7 pb-6 pt-1.5 border-t-2 border-ink text-ink/75 leading-relaxed text-xs sm:text-sm md:text-base font-semibold">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Alarms & Filters FAQ */
function SlideAlarmsFAQ({ backHash }: { backHash?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const data = [
    {
      q: "How do Notify filters read incoming notifications?",
      a: "MinDrop uses Android's Notification Listener Service. This runs locally on your phone to scan incoming alerts. If it matches your custom word rules (e.g. 'boss' or '₹'), it triggers the alarm. No data is collected."
    },
    {
      q: "What happens to my scheduled alarms on phone reboot?",
      a: "MinDrop listens for device startup handshakes. When your phone restarts, a local background sweep automatically schedules your alarms so they remain active."
    }
  ];

  return (
    <div className="h-full bg-[#F0FDF4] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857] mb-3">03 / Alarms & Filters</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#064E3B] leading-tight mb-5 tracking-tight">
            Reliable alerts that survive reboots.
          </h2>
          <div className="hidden lg:block mb-6">
            <AlarmIllustration />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
            <Link to="/download"
              className="px-10 py-4.5 bg-ink text-white font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#10B981] hover:border-[#10B981] transition text-center cursor-pointer">
              Download App
            </Link>
            <Link to="/" hash={backHash} viewTransition
              className="px-10 py-4.5 bg-white text-ink font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#D1FAE5] transition text-center cursor-pointer">
              Back to Deck
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col gap-4">
          <div className="block lg:hidden mb-2">
            <AlarmIllustration />
          </div>
          {data.map((faq, idx) => (
            <div key={idx} className="bg-white border-3 border-ink rounded-[2rem] overflow-hidden shadow-[4px_4px_0px_0px_rgba(2,44,34,0.1)]">
              <button onClick={() => setActive(active === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 sm:p-7 text-left font-black text-ink text-xs sm:text-sm md:text-base cursor-pointer">
                <span>{faq.q}</span>
                <ChevronDown className={`size-4 text-ink/50 transition-transform shrink-0 ml-4 ${active === idx ? "rotate-180" : ""}`} />
              </button>
              {active === idx && (
                <div className="px-7 pb-6 pt-1.5 border-t-2 border-ink text-ink/75 leading-relaxed text-xs sm:text-sm md:text-base font-semibold">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN — Full-Page Fade Scroll Controller
══════════════════════════════════════════════ */
function FaqDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;

  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const lastScrollTime = useRef(0);

  const slides = [
    <SlideOpening />,
    <SlidePrivacyFAQ />,
    <SlideBatteryFAQ />,
    <SlideAlarmsFAQ backHash={backHash} />,
  ];
  const TOTAL = slides.length;

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= TOTAL) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 850) return;
    lastScrollTime.current = now;
    setCurrent(idx);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 12) return;
      if (e.deltaY > 0) goTo(current + 1);
      else if (e.deltaY < 0) goTo(current - 1);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [current]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["ArrowDown","PageDown"].includes(e.key)) { e.preventDefault(); goTo(current + 1); }
      if (["ArrowUp","PageUp"].includes(e.key)) { e.preventDefault(); goTo(current - 1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden"
      style={{ viewTransitionName: "card-faq" } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <header className="shrink-0 border-b-2 border-[#10B981]/10 z-50 bg-[#E2F5EC]/95 backdrop-blur-[12px] transition-colors duration-300">
        <div className="w-[95%] mx-auto h-14 flex items-center justify-between">
          <Link to="/" hash={backHash} viewTransition
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition text-[#047857]/60 hover:text-[#064E3B]">
            <X className="size-3.5"/> Close
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-7 relative grid place-items-center shrink-0">
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-[#10B981]/30" />
              <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="size-5 rounded-md bg-gradient-to-tr from-[#10B981] to-[#D1FAE5] grid place-items-center relative">
                <span className="text-white font-black text-[9px]">m</span>
              </motion.div>
            </div>
            <span className="text-xs font-black uppercase tracking-wider hidden sm:block text-[#047857]/70">MinDrop</span>
          </div>
          <Link to="/download"
            className="text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-xl border-2 bg-ink text-white border-ink hover:bg-[#10B981] hover:border-[#10B981] transition">
            Get App
          </Link>
        </div>
      </header>

      {/* ── Slide Stage ── */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => {
          const delta = touchStartY.current - e.changedTouches[0].clientY;
          if (Math.abs(delta) > 50) {
            if (delta > 0) goTo(current + 1);
            else goTo(current - 1);
          }
        }}
      >
        {/* ── Top hint (Scroll Up) ── */}
        {current > 0 && (
          <button
            onClick={() => goTo(current - 1)}
            className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 z-20 cursor-pointer group text-[#047857]/30 hover:text-[#064E3B]"
          >
            <ChevronDown className="size-3.5 rotate-180 transition group-hover:-translate-y-0.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              scroll or ↑
            </span>
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {slides[current]}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom hint (Scroll Down) ── */}
        {current < TOTAL - 1 && (
          <button
            onClick={() => goTo(current + 1)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 z-20 cursor-pointer group text-[#047857]/30 hover:text-[#064E3B]"
          >
            <span className="text-[9px] font-black uppercase tracking-widest">
              scroll or ↓
            </span>
            <ChevronDown className="size-3.5 transition group-hover:translate-y-0.5" />
          </button>
        )}

        {/* ── Right Dot Navigation ── */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-30">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "w-1.5 h-7 bg-[#10B981]"
                  : "size-1.5 bg-[#047857]/25 hover:bg-[#047857]/50"
              }`}
            />
          ))}
          <p className="text-[9px] font-black mt-1 tabular-nums text-[#047857]/30">
            {current + 1}/{TOTAL}
          </p>
        </div>
      </div>
    </div>
  );
}
