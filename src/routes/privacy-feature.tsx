import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import { MobileFeatureDock } from "@/components/layout/MobileFeatureDock";
import { AnimatedIcon } from "@/components/common/AnimatedIcon";
import {
  ShieldCheck, EyeOff, Database, ServerOff, FileCheck, ArrowRight, X, Sparkles, ChevronDown, ChevronUp, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useLayoutEffect, useRef } from "react";

export const Route = createFileRoute("/privacy-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "Privacy Manifesto — MinDrop Feature" },
      { name: "description", content: "Discover MinDrop's privacy guarantee: zero telemetry, 100% local SQLite storage, zero cloud tracking, and DPDP Act compliance." },
    ],
  }),
  component: PrivacyFeatureDetailView,
});

/* Slide 1: Opening Statement */
function SlideOpening() {
  return (
    <div className="w-full h-full bg-[#F0FDF4] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#059669]/20 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#059669] mb-8 sm:mb-12 shadow-sm">
        🛡️ LOCK DOWN YOUR PRIVATE DATA
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "Your thoughts are personal.",
          "They shouldn't sit on someone else's server.",
        ].map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#059669]/60 leading-tight tracking-tight">
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#064E3B] leading-none tracking-tighter">
        100% Offline. 100% Private.
      </motion.p>
    </div>
  );
}

/* Slide 2: Cloud Surveillance Threat (Dark Theme) */
function SlideProblem() {
  return (
    <div className="w-full h-full bg-[#064E3B] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#A7F3D0] mb-4">
            Why SaaS cloud syncs risk your data
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 sm:mb-8 tracking-tight">
            Cloud servers leak.<br />
            <span className="text-[#34D399]">Your phone stays safe.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-emerald-100 leading-relaxed max-w-lg">
            Most reminder apps upload your tasks, locations, and personal schedules to remote servers for ad analytics and cloud sync. MinDrop cuts the cord entirely.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-white/20 bg-white/5 backdrop-blur-md shadow-2xl">
          <AnimatedIcon animation="pulse">
            <ShieldCheck className="size-28 sm:size-36 text-[#34D399]" />
          </AnimatedIcon>
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Three Privacy Pillars */
function SlidePillars() {
  return (
    <div className="w-full h-full bg-[#F0FDF4] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 sm:gap-12 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#059669] mb-4">
            Our Uncompromising Privacy Guarantee
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-tight tracking-tight">
            Engineered with strict hardware-level isolation.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[
            { icon: EyeOff, title: "Zero Telemetry", body: "No tracking SDKs, no analytics servers, and no user activity logging. What happens in MinDrop stays in MinDrop." },
            { icon: Database, title: "Native SQLite Engine", body: "Your reminders and location pins are saved strictly in your device's encrypted local SQLite database." },
            { icon: ServerOff, title: "Zero Cloud Dependencies", body: "MinDrop operates 100% offline. It needs no internet connection to set, schedule, or ring your alarms." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-[#DCFCE7]/50 border-3 border-ink rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-3">
              <div className="size-12 rounded-2xl bg-[#DCFCE7] grid place-items-center text-[#059669]">
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

/* Slide 4: Legal & DPDP Act Sovereignty */
function SlideCompliance() {
  return (
    <div className="w-full h-full bg-[#DCFCE7] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#059669] mb-4">
            Digital Personal Data Protection Act 2023
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink leading-tight mb-6 tracking-tight">
            Designed for total data sovereignty.
          </h2>
          <p className="text-base sm:text-lg font-semibold text-ink/80 leading-relaxed mb-6">
            We follow data minimization rules by design. Because we don't collect, store, or transmit your personal data to remote databases, your privacy is protected by math and physics, not just promises.
          </p>
          <div className="inline-flex items-center gap-2 bg-white border-2 border-ink px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider text-[#059669] shadow-sm">
            <Lock className="size-4" /> 100% DPDP Act Compliant
          </div>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-ink bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <ShieldCheck className="size-28 sm:size-36 text-[#059669]" />
        </div>
      </div>
    </div>
  );
}

/* Slide 5: Motivated Transition Bridge to Vision */
function SlideNextBridge() {
  return (
    <div className="w-full h-full bg-[#F0FDF4] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#059669]/30 bg-white px-5 py-2 text-xs font-black uppercase tracking-widest text-[#059669] shadow-sm">
          <AnimatedIcon animation="pulse">
            <Sparkles className="size-4 text-[#059669]" />
          </AnimatedIcon> UP NEXT · THE VISION
        </span>

        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-none tracking-tighter max-w-3xl">
          Ready for a quiet, clutter-free mind?
        </h2>

        <p className="text-base sm:text-xl md:text-2xl font-semibold text-ink/80 leading-relaxed max-w-2xl">
          Now that you know your data is 100% private, step into the final chapter to discover MinDrop's overarching philosophy.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link
            to="/vision"
            viewTransition
            style={{ viewTransitionName: 'card-vision' } as React.CSSProperties}
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-5 rounded-2xl bg-[#059669] text-white font-black text-sm sm:text-base uppercase tracking-wider border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#047857] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center whitespace-nowrap"
          >
            Unburden Your Mind Today <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function PrivacyFeatureDetailView() {
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

  const slides = [
    <SlideOpening key="1" />,
    <SlideProblem key="2" />,
    <SlidePillars key="3" />,
    <SlideCompliance key="4" />,
    <SlideNextBridge key="5" />,
  ];
  const TOTAL = slides.length;
  const isDark = current === 1;

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
      style={{ viewTransitionName: "card-privacy" } as React.CSSProperties}
    >
      {/* 1. Header (Desktop & Mobile: Close + Logo + Get App) */}
      <header className="shrink-0 h-12 border-b-2 border-[#10B981]/10 z-50 px-4 sm:px-6 flex items-center backdrop-blur-md"
        style={{ backgroundColor: isDark ? "rgba(6,78,59,0.96)" : "rgba(236,253,245,0.96)", transition: "background-color 0.4s ease" }}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 h-full">
          <Link to="/" hash={backHash} resetScroll={true} viewTransition
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-[#A7F3D0]/70 hover:text-white" : "text-[#10B981]/70 hover:text-[#065F46]"}`}>
            <X className="size-3.5"/> Close
          </Link>

          <Link to="/" hash={backHash} resetScroll={true} viewTransition aria-label="MinDrop — Home" className="flex items-center justify-center shrink-0 h-full leading-none">
            <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          </Link>

          <Link to="/download" resetScroll={true} viewTransition
            className={`inline-flex items-center justify-center whitespace-nowrap text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md border shrink-0 transition-all duration-200 cursor-pointer ${
              isDark
                ? "bg-white text-[#065F46] border-white hover:bg-[#10B981] hover:text-white"
                : "bg-[#10B981] text-white border-[#10B981] hover:bg-[#047857]"
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
              <div className={`w-[450px] h-[450px] rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? "bg-[#34D399]" : "bg-[#10B981]"}`} />
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
                i === current ? "w-1.5 h-7 bg-[#059669]" : isDark ? "size-1.5 bg-white/30 hover:bg-white/60" : "size-1.5 bg-ink/20 hover:bg-ink/50"
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
            ? "bg-white text-[#064E3B] border-white hover:bg-[#059669] hover:text-white"
            : "bg-[#059669] text-white border-[#059669] hover:bg-[#047857]"
        }
      />
    </div>
  );
}
