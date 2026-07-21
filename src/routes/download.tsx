import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Smartphone, Sparkles, ShieldCheck } from "lucide-react";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";

export const Route = createFileRoute("/download")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Download MinDrop — Google Play Store Coming Soon" },
      { name: "description", content: "MinDrop is coming soon to the Google Play Store. An Android-exclusive offline second brain for immediate micro-actions." },
    ],
  }),
  component: DownloadStoryView,
});

/**
 * Replace this with your Google Play Store URL whenever live!
 * When set, the 'Coming Soon' button automatically transforms into an active 1-click Play Store redirect.
 */
const PLAYSTORE_URL: string | null = null;

function DownloadStoryView() {
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
      className="h-[100dvh] flex flex-col justify-between select-none overflow-hidden text-ink font-sans transition-colors duration-500"
      style={{
        backgroundColor: current === 0 ? "#EFF6FF" : "#ECFDF5",
        viewTransitionName: "card-[#download]"
      } as React.CSSProperties}
    >
      {/* 1. Detail View Header */}
      <header className="shrink-0 border-b-2 border-ink/10 z-50 bg-white/60 backdrop-blur-md">
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
            to="/terms"
            className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 sm:px-4 py-1.5 rounded-full border-2 border-ink bg-ink text-white hover:bg-[#FF671F] hover:border-[#FF671F] shrink-0 leading-none whitespace-nowrap shadow-sm transition"
          >
            Terms
          </Link>
        </div>
      </header>

      {/* 2. Full-Screen Immersive Stage (No White Box Container) */}
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
            /* SLIDE 1: Android-Exclusive (Comedy Dig at iPhone) - Full Screen Stage */
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center justify-center text-center overflow-y-auto no-scrollbar max-h-[84vh]"
            >
              {/* Tag Badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#2563EB] mb-4 shadow-sm">
                🤖 ANDROID FIRST
              </span>

              {/* Hero Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-[1.05] tracking-tight max-w-3xl mb-4">
                Sorry iPhone Friends. Your Notch Isn't Ready.
              </h1>

              {/* Hero Graphic */}
              <motion.div
                animate={{ y: [-4, 4, -4], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="size-36 sm:size-48 md:size-56 my-3 bg-white border-3 border-ink rounded-[2.2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center shrink-0"
              >
                <Smartphone className="size-16 sm:size-20 md:size-24 text-[#2563EB] stroke-[2.2px]" />
              </motion.div>

              {/* Story Narrative */}
              <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/80 max-w-2xl leading-relaxed mb-3">
                We love sleek glass phones and dynamic islands, but MinDrop needs raw local power without background task throttles. Android gives us background geofence sweeps, continuous looping alarms, and instant local SQLite access.
              </p>

              {/* Playful Dig */}
              <p className="text-xs sm:text-sm font-medium text-ink/60 italic max-w-lg">
                iPhone version? Maybe when Siri learns to stay 100% offline without asking for Wi-Fi! 😉
              </p>
            </motion.div>
          ) : (
            /* SLIDE 2: Download & Motivational "Coming Soon" - Full Screen Stage */
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center justify-center text-center overflow-y-auto no-scrollbar max-h-[84vh]"
            >
              {/* Tag Badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#059669] mb-4 shadow-sm">
                🚀 GOOGLE PLAY STORE
              </span>

              {/* Hero Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-[1.05] tracking-tight max-w-3xl mb-4">
                Your Mind Deserves a Second Brain.
              </h1>

              {/* Hero Graphic */}
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="size-36 sm:size-48 md:size-56 my-3 bg-white border-3 border-ink rounded-[2.2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center shrink-0"
              >
                <ShieldCheck className="size-16 sm:size-20 md:size-24 text-[#059669] stroke-[2.2px]" />
              </motion.div>

              {/* Story Narrative */}
              <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/80 max-w-2xl leading-relaxed mb-6">
                We are fine-tuning the ultimate zero-cloud, instant-action companion. Zero cloud tracking, zero subscription traps—just pure mental peace in your pocket. Worth every single second of waiting.
              </p>

              {/* Call to Action Button */}
              <div>
                {PLAYSTORE_URL ? (
                  <a
                    href={PLAYSTORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#059669] text-white border-3 border-ink hover:bg-ink transition font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    <Sparkles className="size-5 fill-current" /> Download on Google Play
                  </a>
                ) : (
                  <div className="inline-flex flex-col sm:flex-row items-center gap-3">
                    <button
                      disabled
                      className="px-8 py-4 rounded-2xl bg-ink text-white border-3 border-ink font-black text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 select-none"
                    >
                      <Sparkles className="size-4 text-[#F59E0B] fill-current" /> COMING SOON TO GOOGLE PLAY
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Detail View Footer & Slide Controls */}
      <footer className="shrink-0 w-full py-3 px-4 sm:px-8 z-40 bg-white/60 backdrop-blur-md border-t-2 border-ink/10 flex items-center justify-between">
        {/* Left Arrow */}
        <button
          onClick={prev}
          disabled={current === 0}
          className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider transition ${
            current === 0 ? "opacity-30 cursor-not-allowed text-ink/40" : "text-ink hover:text-[#FF671F] cursor-pointer"
          }`}
        >
          <ChevronLeft className="size-4" /> Prev
        </button>

        {/* Center Progress Pills */}
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

        {/* Right Arrow */}
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
