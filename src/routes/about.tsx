import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import {
  BookOpen, Brain, Zap, Shield, Cpu, Lock, ArrowRight, X, Sparkles, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/about")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "About MinDrop — Offline Second Brain" },
      { name: "description", content: "Learn about MinDrop: an offline second brain built for immediate micro-actions, zero cloud tracking, and instant mental peace." },
    ],
  }),
  component: AboutDetailView,
});

/* Slide 1: Opening */
function SlideOpening() {
  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#4F46E5] mb-8 sm:mb-12 shadow-sm">
        📖 INDEX · ABOUT THE APP
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "Your mind is for having ideas,",
          "not holding them.",
        ].map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#4F46E5]/60 leading-tight tracking-tight">
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-ink leading-none tracking-tighter">
        MinDrop is your second brain.
      </motion.p>
    </div>
  );
}

/* Slide 2: Mental Overload (Dark Theme) */
function SlideProblem() {
  return (
    <div className="h-full bg-[#0F172A] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#818CF8] mb-4">
            The problem with everyday micro-thoughts
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 sm:mb-8 tracking-tight">
            Small tasks create big mental fatigue.<br />
            <span className="text-[#818CF8]">MinDrop unburdens your mind.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-300 leading-relaxed max-w-lg">
            Remembering to pick up milk, reply to an urgent message, or check an alert at a specific place consumes active brain power. MinDrop takes those micro-actions off your shoulders instantly.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-white/20 bg-white/5 backdrop-blur-md shadow-2xl">
          <Brain className="size-28 sm:size-36 text-[#818CF8]" />
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Speed & Frictionless Capture */
function SlideCapture() {
  return (
    <div className="h-full bg-[#F8FAFC] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 sm:gap-12 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#4F46E5] mb-4">
            Capture in under 2 seconds
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-tight tracking-tight">
            Zero setup friction. Pure execution.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[
            { icon: Zap, title: "Lightning Fast", body: "No bloated project boards or complex date pickers. Type or drop a note and carry on with your day." },
            { icon: Shield, title: "Instant Focus", body: "Keeps your attention anchored on what you are doing right now, knowing MinDrop won't let you forget." },
            { icon: Cpu, title: "Pure Reliability", body: "Built for instant launch on Android so you can drop micro-tasks the second inspiration strikes." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white border-3 border-ink rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-3">
              <div className="size-12 rounded-2xl bg-[#EEF2FF] grid place-items-center text-[#4F46E5]">
                <Icon className="size-6 stroke-[2.5px]" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-ink">{title}</h3>
              <p className="text-sm sm:text-base font-semibold text-ink/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Native Android Power */
function SlideArchitecture() {
  return (
    <div className="h-full bg-[#EEF2FF] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#4F46E5] mb-4">
            Hardware-native architecture
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink leading-tight mb-6 tracking-tight">
            Built directly on Android's native APIs.
          </h2>
          <p className="text-base sm:text-lg font-semibold text-ink/80 leading-relaxed mb-6">
            Unlike web-wrapped wrappers, MinDrop taps into Android WorkManager, local SQLite databases, and continuous audio channels so alarms survive battery savers and device restarts.
          </p>
          <div className="inline-flex items-center gap-2 bg-white border-2 border-ink px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider text-ink shadow-sm">
            <Cpu className="size-4 text-[#4F46E5]" /> 100% Android Native Engine
          </div>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-ink bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <BookOpen className="size-28 sm:size-36 text-[#4F46E5]" />
        </div>
      </div>
    </div>
  );
}

/* Slide 5: Data Sovereignty */
function SlideSovereignty() {
  return (
    <div className="h-full bg-[#0F172A] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#818CF8]">
          <Lock className="size-3.5" /> 100% LOCAL PRIVACY
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
          Your thoughts never leave your phone.
        </h2>
        <p className="text-base sm:text-xl font-semibold text-slate-300 max-w-2xl leading-relaxed">
          No ad tracking, no analytics telemetry, no cloud servers. Complete DPDP Act compliance by storing everything strictly on your local SQLite database.
        </p>
      </div>
    </div>
  );
}

/* Slide 6: Motivated Transition Bridge to Chapter 01 (Smart Notification) */
function SlideNextBridge() {
  return (
    <div className="h-full bg-[#FFFBEB] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-[#FEF3C7] px-5 py-2 text-xs font-black uppercase tracking-widest text-[#D97706] shadow-sm">
          <Sparkles className="size-4" /> UP NEXT · CHAPTER 01
        </span>
        
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#78350F] leading-none tracking-tighter max-w-3xl">
          Ready to see how MinDrop silences noise?
        </h2>

        <p className="text-base sm:text-xl md:text-2xl font-semibold text-[#78350F]/75 leading-relaxed max-w-2xl">
          Now that you know what MinDrop is, step into Chapter 01 to discover how smart keyword rules convert essential notifications into un-missable alarms.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link
            to="/notify-feature"
            viewTransition
            style={{ viewTransitionName: 'card-notify' } as React.CSSProperties}
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-5 rounded-2xl bg-ink text-white font-black text-sm sm:text-base uppercase tracking-wider border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#F59E0B] hover:border-[#F59E0B] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center"
          >
            Continue to Chapter 01: Smart Notification <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function AboutDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  currentRef.current = current;

  const touchStartY = useRef(0);
  const isWheelActive = useRef(false);
  const wheelDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    <SlideOpening />,
    <SlideProblem />,
    <SlideCapture />,
    <SlideArchitecture />,
    <SlideSovereignty />,
    <SlideNextBridge />,
  ];
  const TOTAL = slides.length;
  const isDark = current === 1 || current === 4;

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= TOTAL) return;
    setCurrent(idx);
  };

  // Debounced Gesture Engine: Exactly 1 page per continuous scroll gesture
  useEffect(() => {
    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 10 && Math.abs(e.deltaX) < 10) return;

      if (!isWheelActive.current) {
        isWheelActive.current = true;
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (delta > 0) goTo(currentRef.current + 1);
        else if (delta < 0) goTo(currentRef.current - 1);
      }

      if (wheelDebounceTimer.current) clearTimeout(wheelDebounceTimer.current);
      wheelDebounceTimer.current = setTimeout(() => {
        isWheelActive.current = false;
      }, 250);
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        goTo(currentRef.current + 1);
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(currentRef.current - 1);
      }
    };

    window.addEventListener("wheel", wheelHandler, { passive: false });
    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("keydown", keyHandler);
      if (wheelDebounceTimer.current) clearTimeout(wheelDebounceTimer.current);
    };
  }, []);

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden select-none"
      style={{ viewTransitionName: "card-[#about]" } as React.CSSProperties}
    >
      {/* 1. Header (Responsive: Logo-only on Mobile, Close + Logo + Get App on Desktop) */}
      <header className="shrink-0 h-12 border-b-2 border-ink/10 z-50 px-4 sm:px-6 flex items-center justify-center sm:justify-between backdrop-blur-md"
        style={{ backgroundColor: isDark ? "rgba(15,23,42,0.96)" : "rgba(248,250,252,0.96)", transition: "background-color 0.4s ease" }}>
        <Link to="/" hash={backHash} viewTransition
          className={`hidden sm:flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-slate-300 hover:text-white" : "text-ink/70 hover:text-ink"}`}>
          <X className="size-3.5"/> Close
        </Link>

        <Link to="/" hash={backHash} viewTransition aria-label="MinDrop — Home">
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
        </Link>

        <Link to="/download" viewTransition
          className={`hidden sm:inline-flex items-center justify-center text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 sm:px-4 py-1.5 rounded-full border-2 shrink-0 leading-none shadow-sm transition ${isDark ? "bg-white text-ink border-white hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5]" : "bg-ink text-white border-ink hover:bg-[#4F46E5] hover:border-[#4F46E5]"}`}>
          Get App
        </Link>
      </header>

      {/* 2. Main Content Stage */}
      <main 
        className="flex-1 min-h-0 w-full relative overflow-y-auto sm:overflow-hidden flex items-center justify-center px-3 sm:px-6 py-2"
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => {
          const delta = touchStartY.current - e.changedTouches[0].clientY;
          if (Math.abs(delta) > 35) {
            if (delta > 0) goTo(currentRef.current + 1);
            else goTo(currentRef.current - 1);
          }
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full h-full flex items-center justify-center"
          >
            {slides[current]}
          </motion.div>
        </AnimatePresence>

        {/* Right Dot Navigation (Desktop) */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-40">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-1.5 h-7 bg-[#4F46E5]" : isDark ? "size-1.5 bg-white/30 hover:bg-white/60" : "size-1.5 bg-ink/20 hover:bg-ink/50"
              }`}
            />
          ))}
        </div>
      </main>

      {/* 3. ELEVATED FLOATING ISLAND DOCK FOOTER (Mobile Only) */}
      <div className="sm:hidden w-full flex items-center justify-center shrink-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1">
        <footer className="w-full max-w-sm bg-white border-3 border-ink rounded-full px-4 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between select-none">
          <Link 
            to="/"
            hash={backHash}
            viewTransition
            className="text-[11px] uppercase font-black tracking-widest text-ink hover:text-[#FF671F] transition-colors leading-none flex items-center shrink-0 cursor-pointer"
          >
            HOME
          </Link>

          {/* Segmented UP / DOWN Controls */}
          <div className="bg-ink border-2 border-ink rounded-full p-0.5 flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer leading-none ${
                current === 0 
                  ? "opacity-30 text-white/50 cursor-not-allowed" 
                  : "bg-white text-ink shadow-xs"
              }`}
              aria-label="Previous Slide (UP)"
            >
              <ChevronUp className="size-3 stroke-[2.5px]" />
              <span>UP</span>
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              disabled={current === TOTAL - 1}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer leading-none ${
                current === TOTAL - 1 
                  ? "opacity-30 text-white/50 cursor-not-allowed" 
                  : "bg-white text-ink shadow-xs"
              }`}
              aria-label="Next Slide (DOWN)"
            >
              <ChevronDown className="size-3 stroke-[2.5px]" />
              <span>DOWN</span>
            </button>
          </div>

          <Link
            to="/download"
            viewTransition
            className="text-[11px] uppercase tracking-widest font-black text-ink hover:text-[#FF671F] transition-colors leading-none flex items-center shrink-0 cursor-pointer"
          >
            GET APP
          </Link>
        </footer>
      </div>
    </div>
  );
}
