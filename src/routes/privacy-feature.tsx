import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ShieldCheck, Lock, Database } from "lucide-react";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";

export const Route = createFileRoute("/privacy-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Chapter 05/07: Absolute Privacy — MinDrop Manifesto" },
      { name: "description", content: "Discover MinDrop's Absolute Privacy manifesto: zero cloud tracking, local SQLite persistence, and zero telemetry." },
    ],
  }),
  component: PrivacyFeatureStoryView,
});

function PrivacyFeatureStoryView() {
  const { from } = Route.useSearch();
  const [current, setCurrent] = useState(0);
  const totalSlides = 2;

  const touchStartY = useRef(0);
  const wheelLock = useRef(false);

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= totalSlides) return;
    setCurrent(idx);
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);

  // Wheel navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelLock.current) return;
    if (Math.abs(e.deltaY) > 25 || Math.abs(e.deltaX) > 25) {
      wheelLock.current = true;
      if (e.deltaY > 0 || e.deltaX > 0) {
        next();
      } else {
        prev();
      }
      setTimeout(() => {
        wheelLock.current = false;
      }, 500);
    }
  };

  const backHash = from === "grid" ? "grid" : undefined;

  return (
    <div
      onWheel={handleWheel}
      className="h-[100dvh] flex flex-col justify-between select-none overflow-hidden text-ink font-sans transition-colors duration-500 bg-[#F0FDF4]"
      style={{
        viewTransitionName: "card-privacy-manifesto"
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="shrink-0 border-b-2 border-[#059669]/10 z-50 bg-[#F0FDF4]/95 backdrop-blur-md">
        <div className="w-[95%] max-w-7xl mx-auto h-14 flex items-center justify-between gap-2 px-2 sm:px-4">
          <Link
            to="/"
            hash={backHash}
            viewTransition
            className="flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition text-[#059669]/70 hover:text-[#065F46]"
          >
            <X className="size-3.5" /> Close
          </Link>
          
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" />
          
          <Link
            to="/download"
            className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 sm:px-4 py-1.5 rounded-full border-2 border-ink bg-ink text-white hover:bg-[#059669] hover:border-[#059669] shrink-0 leading-none whitespace-nowrap shadow-sm transition"
          >
            Get App
          </Link>
        </div>
      </header>

      {/* Main Full-Screen Stage */}
      <main
        className="flex-1 w-full relative overflow-hidden flex items-center justify-center p-4 sm:p-6"
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => {
          const delta = touchStartY.current - e.changedTouches[0].clientY;
          if (Math.abs(delta) > 40) {
            if (delta > 0) next();
            else prev();
          }
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {current === 0 ? (
            /* SLIDE 1: Absolute Privacy Manifesto */
            <motion.div
              key="privacy-1"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center justify-center text-center overflow-y-auto no-scrollbar max-h-[84vh]"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#059669] mb-4 shadow-sm">
                CHAPTER 05/07 · ABSOLUTE PRIVACY
              </span>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-[1.05] tracking-tight max-w-3xl mb-4">
                Your Data Never Leaves Your Pocket.
              </h1>

              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="size-36 sm:size-48 md:size-56 my-3 bg-white border-3 border-ink rounded-[2.2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center shrink-0"
              >
                <ShieldCheck className="size-16 sm:size-20 md:size-24 text-[#059669] stroke-[2.2px]" />
              </motion.div>

              <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/80 max-w-2xl leading-relaxed mb-3">
                In an era of invasive cloud tracking and ad brokers, MinDrop is engineered with strict local-first architecture.
              </p>

              <p className="text-xs sm:text-sm font-medium text-ink/65 max-w-xl leading-relaxed">
                Zero telemetry analytics, zero ad SDKs, and zero background data syncing. Your thoughts belong solely to you.
              </p>
            </motion.div>
          ) : (
            /* SLIDE 2: Local SQLite & Zero Telemetry */
            <motion.div
              key="privacy-2"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center justify-center text-center overflow-y-auto no-scrollbar max-h-[84vh]"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#059669] mb-4 shadow-sm">
                HARDWARE SECURITY
              </span>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-ink leading-[1.05] tracking-tight max-w-3xl mb-4">
                Encrypted Local SQLite Database
              </h1>

              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl my-3 text-left">
                <div className="bg-white border-2 border-ink p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2 mb-2 text-[#059669]">
                    <Database className="size-5" />
                    <h3 className="font-black text-base text-ink">On-Device Storage</h3>
                  </div>
                  <p className="text-xs text-ink/75 font-semibold leading-relaxed">
                    All reminders and logs are written straight to your phone's native SQLite storage engine.
                  </p>
                </div>

                <div className="bg-white border-2 border-ink p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2 mb-2 text-[#059669]">
                    <Lock className="size-5" />
                    <h3 className="font-black text-base text-ink">DPDP Act Compliant</h3>
                  </div>
                  <p className="text-xs text-ink/75 font-semibold leading-relaxed">
                    Designed in compliance with DPDP Act 2023 principles for total user sovereignty.
                  </p>
                </div>
              </div>

              <Link
                to="/privacy"
                className="mt-2 text-xs font-black uppercase tracking-wider text-[#059669] underline decoration-2 underline-offset-4 hover:text-[#065F46]"
              >
                Read Full Privacy Policy →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <footer className="shrink-0 w-full py-3 px-4 sm:px-8 z-40 bg-white/60 backdrop-blur-md border-t-2 border-ink/10 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={current === 0}
          className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider transition ${
            current === 0 ? "opacity-30 cursor-not-allowed text-ink/40" : "text-ink hover:text-[#FF671F] cursor-pointer"
          }`}
        >
          <ChevronLeft className="size-4" /> Prev
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                current === idx ? "w-8 bg-ink" : "w-2.5 bg-ink/25 hover:bg-ink/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current === totalSlides - 1}
          className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider transition ${
            current === totalSlides - 1 ? "opacity-30 cursor-not-allowed text-ink/40" : "text-ink hover:text-[#FF671F] cursor-pointer"
          }`}
        >
          Next <ChevronRight className="size-4" />
        </button>
      </footer>
    </div>
  );
}
