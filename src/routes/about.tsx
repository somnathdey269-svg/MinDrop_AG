import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import { MobileFeatureDock } from "@/components/layout/MobileFeatureDock";
import { AnimatedIcon } from "@/components/common/AnimatedIcon";
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
    <div className="w-full h-full bg-[#F0F9FF] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#0284C7]/30 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#0284C7] mb-8 sm:mb-12 shadow-sm">
        📖 INDEX · ABOUT THE APP
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "Your mind is for having ideas,",
          "not holding them.",
        ].map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0284C7]/70 leading-tight tracking-tight">
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
    <div className="w-full h-full bg-[#0C4A6E] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#38BDF8] mb-4">
            The problem with everyday micro-thoughts
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 sm:mb-8 tracking-tight">
            Small tasks create big mental fatigue.<br />
            <span className="text-[#38BDF8]">MinDrop unburdens your mind.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-sky-100 leading-relaxed max-w-lg">
            Remembering to pick up milk, reply to an urgent message, or check an alert at a specific place consumes active brain power. MinDrop takes those micro-actions off your shoulders instantly.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
          <AnimatedIcon animation="pulse">
            <Brain className="size-28 sm:size-36 text-[#38BDF8]" />
          </AnimatedIcon>
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Speed & Frictionless Capture */
function SlideCapture() {
  return (
    <div className="w-full h-full bg-[#F0F9FF] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 sm:gap-12 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#0284C7] mb-4">
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
              <div className="size-12 rounded-2xl bg-[#E0F2FE] grid place-items-center text-[#0284C7]">
                <AnimatedIcon animation="subtle-bounce">
                  <Icon className="size-6 stroke-[2.5px]" />
                </AnimatedIcon>
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
    <div className="w-full h-full bg-[#E0F2FE] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#0284C7] mb-4">
            Hardware-native architecture
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink leading-tight mb-6 tracking-tight">
            Built directly on Android's native APIs.
          </h2>
          <p className="text-base sm:text-lg font-semibold text-ink/80 leading-relaxed mb-6">
            Unlike web-wrapped wrappers, MinDrop taps into Android WorkManager, local SQLite databases, and continuous audio channels so alarms survive battery savers and device restarts.
          </p>
          <div className="inline-flex items-center gap-2 bg-white border-2 border-ink px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider text-ink shadow-sm">
            <AnimatedIcon animation="pulse">
              <Cpu className="size-4 text-[#0284C7]" />
            </AnimatedIcon> 100% Android Native Engine
          </div>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-ink bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <AnimatedIcon animation="float">
            <BookOpen className="size-28 sm:size-36 text-[#0284C7]" />
          </AnimatedIcon>
        </div>
      </div>
    </div>
  );
}

/* Slide 5: Data Sovereignty */
function SlideSovereignty() {
  return (
    <div className="w-full h-full bg-[#0C4A6E] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#38BDF8]">
          <AnimatedIcon animation="pulse">
            <Lock className="size-3.5" />
          </AnimatedIcon> 100% LOCAL PRIVACY
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
          Your thoughts never leave your phone.
        </h2>
        <p className="text-base sm:text-xl font-semibold text-sky-100 max-w-2xl leading-relaxed">
          No ad tracking, no analytics telemetry, no cloud servers. Complete DPDP Act compliance by storing everything strictly on your local SQLite database.
        </p>
      </div>
    </div>
  );
}

/* Slide 6: Motivated Transition Bridge to Chapter 01 (Smart Notification) */
function SlideNextBridge() {
  return (
    <div className="w-full h-full bg-[#E0F2FE] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#0284C7]/30 bg-white px-5 py-2 text-xs font-black uppercase tracking-widest text-[#0284C7] shadow-sm">
          <AnimatedIcon animation="pulse">
            <Sparkles className="size-4 text-[#0284C7]" />
          </AnimatedIcon> UP NEXT · CHAPTER 01
        </span>
        
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-none tracking-tighter max-w-3xl">
          Ready to see how MinDrop silences noise?
        </h2>

        <p className="text-base sm:text-xl md:text-2xl font-semibold text-ink/80 leading-relaxed max-w-2xl">
          Now that you know what MinDrop is, step into Chapter 01 to discover how smart keyword rules convert essential notifications into un-missable alarms.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link
            to="/notify-feature"
            viewTransition
            style={{ viewTransitionName: 'card-notify' } as React.CSSProperties}
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-5 rounded-2xl bg-[#0284C7] text-white font-black text-sm sm:text-base uppercase tracking-wider border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0369A1] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center whitespace-nowrap"
          >
            Silence Noise & Catch Emergencies <ArrowRight className="size-5" />
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const slides = [
    <SlideOpening key="1" />,
    <SlideProblem key="2" />,
    <SlideCapture key="3" />,
    <SlideArchitecture key="4" />,
    <SlideSovereignty key="5" />,
    <SlideNextBridge key="6" />,
  ];
  const TOTAL = slides.length;
  const isDark = current === 1 || current === 4;

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, clientHeight } = scrollContainerRef.current;
    if (clientHeight > 0) {
      const activeIdx = Math.round(scrollTop / clientHeight);
      if (activeIdx !== current && activeIdx >= 0 && activeIdx < TOTAL) {
        setCurrent(activeIdx);
      }
    }
  };

  const goTo = (idx: number) => {
    if (scrollContainerRef.current && idx >= 0 && idx < TOTAL) {
      const targetY = idx * scrollContainerRef.current.clientHeight;
      scrollContainerRef.current.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden select-none"
      style={{ viewTransitionName: "card-about" } as React.CSSProperties}
    >
      {/* 1. Header (Desktop & Mobile: Close + Logo + Get App) */}
      <header className="shrink-0 h-12 border-b-2 border-[#0284C7]/10 z-50 px-4 sm:px-6 flex items-center backdrop-blur-md"
        style={{ backgroundColor: isDark ? "rgba(12,74,110,0.96)" : "rgba(240,249,255,0.96)", transition: "background-color 0.4s ease" }}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 h-full">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-[#BAE6FD]/70 hover:text-white" : "text-[#0284C7]/70 hover:text-[#0369A1]"}`}>
            <X className="size-3.5"/> Close
          </Link>

          <Link to="/" hash={backHash} viewTransition aria-label="MinDrop — Home" className="flex items-center justify-center shrink-0 h-full leading-none">
            <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          </Link>

          <Link to="/download" viewTransition
            className={`inline-flex items-center justify-center whitespace-nowrap text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md border shrink-0 transition-all duration-200 cursor-pointer ${
              isDark
                ? "bg-white text-[#0369A1] border-white hover:bg-[#0284C7] hover:text-white"
                : "bg-[#0284C7] text-white border-[#0284C7] hover:bg-[#0369A1]"
            }`}>
            Get App
          </Link>
        </div>
      </header>

      {/* 2. Main Content Stage with Native CSS Scroll Snap */}
      <main 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 w-full overflow-y-auto snap-y snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative"
      >
        {slides.map((slide, idx) => (
          <section key={idx} className="w-full h-full shrink-0 snap-start snap-always flex items-center justify-center relative overflow-hidden">
            {slide}
          </section>
        ))}

        {/* Right Dot Navigation (Desktop) */}
        <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-40">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-1.5 h-7 bg-[#0284C7]" : isDark ? "size-1.5 bg-white/30 hover:bg-white/60" : "size-1.5 bg-ink/20 hover:bg-ink/50"
              }`}
            />
          ))}
        </div>
      </main>

      {/* 3. ELEVATED FLOATING ISLAND DOCK FOOTER (Mobile Only) */}
      <MobileFeatureDock
        current={current}
        total={TOTAL}
        goTo={goTo}
        backHash={backHash}
        isDark={isDark}
        activeColorClass={
          isDark
            ? "bg-white text-[#0C4A6E] border-white hover:bg-[#38BDF8] hover:text-white"
            : "bg-[#0284C7] text-white border-[#0284C7] hover:bg-[#0369A1]"
        }
      />
    </div>
  );
}
