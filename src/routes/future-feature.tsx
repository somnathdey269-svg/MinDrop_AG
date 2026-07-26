import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import { MobileFeatureDock } from "@/components/layout/MobileFeatureDock";
import { AnimatedIcon } from "@/components/common/AnimatedIcon";
import {
  Compass, PhoneCall, Layers, Mic, ArrowRight, X, Sparkles, SlidersHorizontal, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useLayoutEffect, useRef } from "react";

export const Route = createFileRoute("/future-feature")({
  validateSearch: (search: Record<string, unknown>): { from?: string } => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "Future R&D Roadmap — MinDrop Feature" },
      { name: "description", content: "Explore MinDrop's upcoming R&D features: contact triggers, cross-app floating overlays, and offline voice action drops." },
    ],
  }),
  component: FutureFeatureDetailView,
});

/* Slide 1: Opening Statement */
function SlideOpening() {
  return (
    <div className="w-full h-full bg-[#EFF6FF] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/20 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#2563EB] mb-8 sm:mb-12 shadow-sm">
        🚀 UNVEIL WHAT&apos;S COOKING IN R&amp;D
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "We're just getting started.",
          "Here is what's cooking in MinDrop R&D.",
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
        Smart features for your everyday life.
      </motion.p>
    </div>
  );
}

/* Slide 2: Unconnected Island Problem (Dark Theme) */
function SlideProblem() {
  return (
    <div className="w-full h-full bg-[#0F172A] flex items-center justify-center px-6">
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
          <AnimatedIcon animation="pulse">
            <Compass className="size-28 sm:size-36 text-[#60A5FA]" />
          </AnimatedIcon>
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Topic 1 - Contact Triggers */
function SlideContactTriggers() {
  return (
    <div className="w-full h-full bg-[#EFF6FF] flex items-center justify-center px-6">
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
          <AnimatedIcon animation="float">
            <PhoneCall className="size-28 sm:size-36 text-[#2563EB]" />
          </AnimatedIcon>
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Topic 2 & 3 - Cross-App Bridge & Voice Drops */
function SlideCrossAppVoice() {
  return (
    <div className="w-full h-full bg-[#DBEAFE] flex items-center justify-center px-6">
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
    <div className="w-full h-full bg-[#0F172A] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#60A5FA] mb-4">
            R&D Topic 04 · Context Sweeps
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
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
    <div className="w-full h-full bg-[#F0FDF4] flex items-center justify-center px-6 text-center">
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
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-5 rounded-2xl bg-ink text-white font-black text-sm sm:text-base uppercase tracking-wider border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#059669] hover:border-[#059669] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center whitespace-nowrap"
          >
            Lock Down Your Private Data <ArrowRight className="size-5" />
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const resetScroll = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
      setCurrent(0);
    };
    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    const t1 = setTimeout(resetScroll, 0);
    const t2 = setTimeout(resetScroll, 50);
    const t3 = setTimeout(resetScroll, 150);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const { page, hasBlocks } = useCMSPage("future-feature");

  if (hasBlocks && page && page.blocks && page.blocks.length > 0) {
    return (
      <div className="min-h-screen bg-[#F0FDF4] flex flex-col select-none">
        <header className="shrink-0 h-14 border-b-2 border-emerald-500/10 z-50 bg-[#F0FDF4]/96 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" resetScroll={true} viewTransition className="flex items-center gap-1 text-xs font-black uppercase text-emerald-600">
            <X className="size-3.5"/> Close
          </Link>
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" />
          <Link to="/download" resetScroll={true} viewTransition className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-black uppercase shadow-md">
            Get App
          </Link>
        </header>
        <main className="flex-1 w-full max-w-6xl mx-auto p-6 sm:p-12">
          <DynamicBlockRenderer blocks={page.blocks} />
        </main>
      </div>
    );
  }

  const slides = [
    <SlideOpening key="1" />,
    <SlideProblem key="2" />,
    <SlideContactTriggers key="3" />,
    <SlideCrossAppVoice key="4" />,
    <SlideContextSweeps key="5" />,
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
      style={{ viewTransitionName: "card-future" } as React.CSSProperties}
    >
      {/* 1. Header (Desktop & Mobile: Close + Logo + Get App) */}
      <header className="shrink-0 h-12 border-b-2 border-[#2563EB]/10 z-50 px-4 sm:px-6 flex items-center backdrop-blur-md"
        style={{ backgroundColor: isDark ? "rgba(15,23,42,0.96)" : "rgba(239,246,255,0.96)", transition: "background-color 0.4s ease" }}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 h-full">
          <Link to="/" hash={backHash} resetScroll={true} viewTransition
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-[#60A5FA]/70 hover:text-white" : "text-[#2563EB]/70 hover:text-ink"}`}>
            <X className="size-3.5"/> Close
          </Link>

          <Link to="/" hash={backHash} resetScroll={true} viewTransition aria-label="MinDrop — Home" className="flex items-center justify-center shrink-0 h-full leading-none">
            <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          </Link>

          <Link to="/download" resetScroll={true} viewTransition
            className={`inline-flex items-center justify-center whitespace-nowrap text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md border shrink-0 transition-all duration-200 cursor-pointer ${
              isDark
                ? "bg-white text-ink border-white hover:bg-[#60A5FA] hover:text-white"
                : "bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#1D4ED8]"
            }`}>
            Get App
          </Link>
        </div>
      </header>

      {/* 2. Main Content Stage with Native CSS Scroll Snap & 3D Card Stack Overlap */}
      <main 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 w-full overflow-y-auto snap-y snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative"
      >
        {slides.map((slide, idx) => (
          <section key={idx} className="w-full h-full shrink-0 snap-start snap-always flex items-center justify-center relative overflow-hidden perspective-[1200px]">
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
              <div className={`w-[450px] h-[450px] rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? "bg-blue-400" : "bg-[#2563EB]"}`} />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.90, y: 30, rotateX: 6 }}
              whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              viewport={{ amount: 0.35 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex items-center justify-center relative z-10"
            >
              {slide}
            </motion.div>
          </section>
        ))}

        {/* Right Dot Navigation (Desktop) */}
        <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-40">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-1.5 h-7 bg-[#2563EB]" : isDark ? "size-1.5 bg-white/30 hover:bg-white/60" : "size-1.5 bg-ink/20 hover:bg-ink/50"
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
            ? "bg-white text-[#0F172A] border-white hover:bg-[#60A5FA] hover:text-white"
            : "bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#1D4ED8]"
        }
      />
    </div>
  );
}
