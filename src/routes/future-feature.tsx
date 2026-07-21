import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import {
  Compass, PhoneCall, Layers, Mic, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, X
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

/* Slide 3: 4 R&D Features Grid */
function SlideGrid() {
  return (
    <div className="h-full bg-[#EFF6FF] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 sm:gap-10 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#2563EB] mb-3">
            Active R&D Roadmap
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink leading-tight tracking-tight">
            4 Features We Are Striving to Deliver Natively
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full text-left">
          <div className="bg-white border-3 border-ink rounded-[2rem] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex gap-4">
            <div className="size-12 rounded-2xl bg-[#DBEAFE] grid place-items-center text-[#2563EB] shrink-0">
              <PhoneCall className="size-6 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-ink mb-1">1. Contact Triggers</h3>
              <p className="text-sm font-semibold text-ink/75 leading-relaxed">
                Remind me the moment I receive a call or text from [Name], surfacing instant context right when you talk.
              </p>
            </div>
          </div>

          <div className="bg-white border-3 border-ink rounded-[2rem] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex gap-4">
            <div className="size-12 rounded-2xl bg-[#DBEAFE] grid place-items-center text-[#2563EB] shrink-0">
              <Layers className="size-6 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-ink mb-1">2. Cross-App Bridge</h3>
              <p className="text-sm font-semibold text-ink/75 leading-relaxed">
                Set quick reminders for third-party apps that lack native notification hooks (saved articles, email threads).
              </p>
            </div>
          </div>

          <div className="bg-white border-3 border-ink rounded-[2rem] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex gap-4">
            <div className="size-12 rounded-2xl bg-[#DBEAFE] grid place-items-center text-[#2563EB] shrink-0">
              <Mic className="size-6 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-ink mb-1">3. Voice Micro-Drops</h3>
              <p className="text-sm font-semibold text-ink/75 leading-relaxed">
                Speak a 5-second voice note that gets transcribed locally into an actionable reminder without typing.
              </p>
            </div>
          </div>

          <div className="bg-white border-3 border-ink rounded-[2rem] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex gap-4">
            <div className="size-12 rounded-2xl bg-[#DBEAFE] grid place-items-center text-[#2563EB] shrink-0">
              <SlidersHorizontal className="size-6 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-ink mb-1">4. Context Sweeps</h3>
              <p className="text-sm font-semibold text-ink/75 leading-relaxed">
                Intelligently bundle micro-tasks into time-of-day sweeps (e.g. evening wind-down summary).
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs font-bold text-ink/60 italic">
          *We are striving our best to achieve all 4 features natively on Android without third-party cloud servers.
        </p>
      </div>
    </div>
  );
}

/* Slide 4: Closer */
function SlideCloser({ backHash }: { backHash?: string }) {
  return (
    <div className="h-full bg-[#DBEAFE] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 sm:gap-10 max-w-4xl">
        <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#2563EB]">
          The future of offline micro-actions
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-none tracking-tighter">
          Built for privacy. Designed for life.
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-ink/70 leading-relaxed max-w-2xl">
          Get MinDrop today and join us as we expand local Android capabilities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link to="/download"
            className="px-10 sm:px-12 py-4.5 sm:py-5 bg-ink text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#2563EB] hover:border-[#2563EB] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Get MinDrop Android App
          </Link>
          <Link to="/" hash={backHash} viewTransition
            className="px-10 sm:px-12 py-4.5 sm:py-5 bg-white text-ink font-black text-sm sm:text-base uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-100 transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Back to Showcase
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
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const lastScrollTime = useRef(0);

  const slides = [
    <SlideOpening />,
    <SlideProblem />,
    <SlideGrid />,
    <SlideCloser backHash={backHash} />,
  ];
  const TOTAL = slides.length;
  const isDark = current === 1;

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= TOTAL) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 750) return;
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
      style={{ viewTransitionName: "card-future" } as React.CSSProperties}
    >
      <header className="shrink-0 border-b-2 border-ink/10 z-50"
        style={{ backgroundColor: isDark ? "rgba(15,23,42,0.96)" : "rgba(239,246,255,0.96)", backdropFilter: "blur(12px)", transition: "background-color 0.4s ease" }}>
        <div className="w-[95%] max-w-7xl mx-auto h-14 flex items-center justify-between gap-2 px-2 sm:px-4">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-[#60A5FA] hover:text-white" : "text-ink/70 hover:text-ink"}`}>
            <X className="size-3.5"/> Close
          </Link>
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          <Link to="/download"
            className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 sm:px-4 py-1.5 rounded-full border-2 shrink-0 leading-none whitespace-nowrap shadow-sm transition ${isDark ? "bg-white text-ink border-white hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB]" : "bg-ink text-white border-ink hover:bg-[#2563EB] hover:border-[#2563EB]"}`}>
            Get App
          </Link>
        </div>
      </header>

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

        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-30">
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
