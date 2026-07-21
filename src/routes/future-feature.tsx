import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import {
  Compass, PhoneCall, Layers, Mic, SlidersHorizontal, ArrowRight, X, Sparkles, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/future-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "Chapter 04/05: Future Actions — MinDrop Roadmap" },
      { name: "description", content: "Explore MinDrop's upcoming R&D: person-based reminders, cross-app bridges, voice micro-drops, and context sweeps." },
    ],
  }),
  component: FutureFeatureDetailView,
});

/* Slide 1: Opening */
function SlideOpening() {
  return (
    <div className="h-full bg-[#EFF6FF] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/20 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#2563EB] mb-8 sm:mb-12 shadow-sm">
        🔮 CHAPTER 04/05 · FUTURE ACTIONS
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "Smart triggers beyond simple timers.",
          "Features on the Android horizon.",
        ].map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#2563EB]/60 leading-tight tracking-tight">
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-ink leading-none tracking-tighter">
        Coming Soon to MinDrop.
      </motion.p>
    </div>
  );
}

/* Slide 2: Unconnected Island Problem (Dark Theme) */
function SlideProblem() {
  return (
    <div className="h-full bg-[#0F172A] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#60A5FA] mb-4">
            Why isolated apps fail you
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 sm:mb-8 tracking-tight">
            Reminders shouldn't live in a vacuum.<br />
            <span className="text-[#60A5FA]">Context matters.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-300 leading-relaxed max-w-lg">
            When a friend calls or when you open another app, you shouldn't have to manually remember to check your todo list. MinDrop R&D is building native Android hardware bridges.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-white/20 bg-white/5 backdrop-blur-md shadow-2xl">
          <Compass className="size-28 sm:size-36 text-[#60A5FA]" />
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Topic 1 - Contact Triggers */
function SlideContactTriggers() {
  return (
    <div className="h-full bg-[#EFF6FF] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#2563EB] mb-4">
            R&D Topic 01 · Contact Triggers
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink leading-tight mb-4 tracking-tight">
            Remind me when [Name] calls or texts.
          </h2>
          <p className="text-base sm:text-lg font-semibold text-ink/80 leading-relaxed max-w-lg">
            Attach a micro-note to specific contacts. The moment their call or text arrives, MinDrop pops up your note so you never forget what to ask or say.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-ink bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <PhoneCall className="size-28 sm:size-36 text-[#2563EB]" />
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Topic 2 & 3 - Cross-App Bridge & Voice Drops */
function SlideCrossAppVoice() {
  return (
    <div className="h-full bg-[#DBEAFE] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#2563EB] mb-3">
            R&D Topics 02 & 03
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink leading-tight tracking-tight">
            Cross-App Bridges & Voice Micro-Drops
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left">
          <div className="bg-white border-3 border-ink rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex gap-4">
            <div className="size-14 rounded-2xl bg-[#DBEAFE] grid place-items-center text-[#2563EB] shrink-0">
              <Layers className="size-7 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-ink mb-1">Cross-App Bridge</h3>
              <p className="text-sm font-semibold text-ink/75 leading-relaxed">
                Set quick reminders for third-party apps that lack native notification hooks (saved articles, unreplied email threads).
              </p>
            </div>
          </div>

          <div className="bg-white border-3 border-ink rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex gap-4">
            <div className="size-14 rounded-2xl bg-[#DBEAFE] grid place-items-center text-[#2563EB] shrink-0">
              <Mic className="size-7 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-ink mb-1">Voice Micro-Drops</h3>
              <p className="text-sm font-semibold text-ink/75 leading-relaxed">
                Speak a 5-second voice note that gets transcribed locally into an actionable reminder without typing a word.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Slide 5: Topic 4 - Context Sweeps */
function SlideContextSweeps() {
  return (
    <div className="h-full bg-[#0F172A] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#60A5FA] mb-4">
            R&D Topic 04 · Context Sweeps
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
            Time-of-day task bundling.<br />
            <span className="text-[#60A5FA]">Evening wind-down.</span>
          </h2>
          <p className="text-base sm:text-lg font-semibold text-slate-300 leading-relaxed max-w-lg">
            Instead of buzzing you randomly throughout the night, MinDrop intelligently aggregates non-urgent micro-tasks into a single calm evening summary.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-white/20 bg-white/5 backdrop-blur-md shadow-2xl">
          <SlidersHorizontal className="size-28 sm:size-36 text-[#60A5FA]" />
        </div>
      </div>
    </div>
  );
}

/* Slide 6: Motivated Transition Bridge to Chapter 05 (Absolute Privacy) */
function SlideNextBridge() {
  return (
    <div className="h-full bg-[#F0FDF4] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#059669]/30 bg-[#DCFCE7] px-5 py-2 text-xs font-black uppercase tracking-widest text-[#059669] shadow-sm">
          <Sparkles className="size-4" /> UP NEXT · CHAPTER 05
        </span>

        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-none tracking-tighter max-w-3xl">
          How do we power these features with 100% privacy?
        </h2>

        <p className="text-base sm:text-xl md:text-2xl font-semibold text-ink/75 leading-relaxed max-w-2xl">
          Future features sound powerful—and they are engineered with total data sovereignty. Step into Chapter 05 for our Absolute Privacy manifesto.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link
            to="/privacy-feature"
            viewTransition
            style={{ viewTransitionName: 'card-privacy-manifesto' } as React.CSSProperties}
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-5 rounded-2xl bg-ink text-white font-black text-sm sm:text-base uppercase tracking-wider border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#059669] hover:border-[#059669] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center"
          >
            Continue to Chapter 05: Absolute Privacy <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function FutureFeatureDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;
  const [current, setCurrent] = useState(0);
  const touchStartY = useRef(0);
  const lastScrollTime = useRef(0);

  const slides = [
    <SlideOpening />,
    <SlideProblem />,
    <SlideContactTriggers />,
    <SlideCrossAppVoice />,
    <SlideContextSweeps />,
    <SlideNextBridge />,
  ];
  const TOTAL = slides.length;
  const isDark = current === 1 || current === 4;

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= TOTAL) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 350) return;
    lastScrollTime.current = now;
    setCurrent(idx);
  };

  // Global Mouse Wheel Listener
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 10 && Math.abs(e.deltaX) < 10) return;
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta > 0) goTo(current + 1);
      else if (delta < 0) goTo(current - 1);
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, [current]);

  // Global Keyboard Listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        goTo(current + 1);
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(current - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden select-none"
      style={{ viewTransitionName: "card-future" } as React.CSSProperties}
    >
      <header className="shrink-0 border-b-2 border-ink/10 z-50 py-2.5 px-3 sm:px-6"
        style={{ backgroundColor: isDark ? "rgba(15,23,42,0.96)" : "rgba(239,246,255,0.96)", backdropFilter: "blur(12px)", transition: "background-color 0.4s ease" }}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-[#60A5FA] hover:text-white" : "text-ink/70 hover:text-ink"}`}>
            <X className="size-3.5"/> Close
          </Link>
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          <Link to="/download"
            className={`inline-flex items-center justify-center text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 sm:px-4 py-1.5 rounded-full border-2 shrink-0 leading-none shadow-sm transition ${isDark ? "bg-white text-ink border-white hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB]" : "bg-ink text-white border-ink hover:bg-[#2563EB] hover:border-[#2563EB]"}`}>
            Get App
          </Link>
        </div>
      </header>

      <div
        className="flex-1 relative overflow-hidden"
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => {
          const delta = touchStartY.current - e.changedTouches[0].clientY;
          if (Math.abs(delta) > 35) {
            if (delta > 0) goTo(current + 1);
            else goTo(current - 1);
          }
        }}
      >
        {/* Subtle Top Up Arrow */}
        {current > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(current - 1);
            }}
            className="absolute top-3 left-1/2 -translate-x-1/2 p-3 z-50 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Previous Slide"
          >
            <div className="flex items-center gap-1.5 bg-black/10 dark:bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-current/10">
              <ChevronUp className={`size-5 transition group-hover:-translate-y-0.5 ${isDark ? "text-white" : "text-ink"}`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-white/80" : "text-ink/80"}`}>UP</span>
            </div>
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

        {/* Subtle Bottom Down Arrow */}
        {current < TOTAL - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(current + 1);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 p-3 z-50 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Next Slide"
          >
            <div className="flex items-center gap-1.5 bg-black/10 dark:bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-current/10">
              <ChevronDown className={`size-5 transition group-hover:translate-y-0.5 ${isDark ? "text-white" : "text-ink"}`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-white/80" : "text-ink/80"}`}>DOWN</span>
            </div>
          </button>
        )}

        {/* Right Dot Navigation */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-50">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-1.5 h-7 bg-[#2563EB]" : isDark ? "size-1.5 bg-white/30 hover:bg-white/60" : "size-1.5 bg-ink/20 hover:bg-ink/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
