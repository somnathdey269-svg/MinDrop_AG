import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles, Brain, Cpu } from "lucide-react";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";

export const Route = createFileRoute("/about")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "About MinDrop — Offline Second Brain" },
      { name: "description", content: "Learn about MinDrop: an offline second brain built for immediate micro-actions, zero cloud tracking, and instant mental peace." },
    ],
  }),
  component: AboutStoryView,
});

function AboutStoryView() {
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
      className="h-[100dvh] flex flex-col justify-between select-none overflow-hidden text-ink font-sans transition-colors duration-500 bg-[#F8FAFC]"
      style={{
        viewTransitionName: "card-[#about]"
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="shrink-0 border-b-2 border-ink/10 z-50 bg-white/70 backdrop-blur-md">
        <div className="w-[95%] max-w-7xl mx-auto h-14 flex items-center justify-between gap-2 px-2 sm:px-4">
          <Link
            to="/"
            hash={backHash}
            viewTransition
            className="flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition text-ink/70 hover:text-ink"
          >
            <X className="size-3.5" /> Close
          </Link>
          
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" />
          
          <Link
            to="/download"
            className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 sm:px-4 py-1.5 rounded-full border-2 border-ink bg-ink text-white hover:bg-[#FF671F] hover:border-[#FF671F] shrink-0 leading-none whitespace-nowrap shadow-sm transition"
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
            /* SLIDE 1: The Core Origin & Mission */
            <motion.div
              key="about-1"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center justify-center text-center overflow-y-auto no-scrollbar max-h-[84vh]"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#6366F1] mb-4 shadow-sm">
                INDEX · ABOUT THE APP
              </span>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-[1.05] tracking-tight max-w-3xl mb-4">
                About the App
              </h1>

              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="size-36 sm:size-48 md:size-56 my-3 bg-white border-3 border-ink rounded-[2.2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center shrink-0"
              >
                <Brain className="size-16 sm:size-20 md:size-24 text-[#6366F1] stroke-[2.2px]" />
              </motion.div>

              <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/80 max-w-2xl leading-relaxed mb-3">
                MinDrop was born to solve a universal modern problem: small, urgent thoughts cluttering your brain while you are busy doing something else.
              </p>

              <p className="text-xs sm:text-sm font-medium text-ink/65 max-w-xl leading-relaxed">
                Rather than forcing you to open complex todo apps, MinDrop acts as a quiet, offline second brain for immediate micro-actions—looping alarms, location sweeps, and notification filters that protect your mental clarity.
              </p>
            </motion.div>
          ) : (
            /* SLIDE 2: Zero-Cloud Architecture & Pure Speed */
            <motion.div
              key="about-2"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center justify-center text-center overflow-y-auto no-scrollbar max-h-[84vh]"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#6366F1] mb-4 shadow-sm">
                INDEX · LOCAL PERISTENCE
              </span>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-[1.05] tracking-tight max-w-3xl mb-4">
                Zero Cloud. Pure Local Speed.
              </h1>

              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="size-36 sm:size-48 md:size-56 my-3 bg-white border-3 border-ink rounded-[2.2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center shrink-0"
              >
                <Cpu className="size-16 sm:size-20 md:size-24 text-[#6366F1] stroke-[2.2px]" />
              </motion.div>

              <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/80 max-w-2xl leading-relaxed mb-4">
                Built natively for Android using local SQLite storage, zero tracking telemetry, and zero cloud lock-in.
              </p>

              <Link
                to="/download"
                className="px-8 py-3.5 rounded-2xl bg-ink text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF671F] transition"
              >
                Get MinDrop Android App
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
