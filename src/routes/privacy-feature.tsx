import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import {
  ShieldCheck, Lock, Database, EyeOff, ServerOff, ArrowRight, X, Sparkles, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/privacy-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "Chapter 05/05: Absolute Privacy — MinDrop Manifesto" },
      { name: "description", content: "Discover MinDrop's Absolute Privacy manifesto: zero cloud tracking, local SQLite persistence, and zero telemetry." },
    ],
  }),
  component: PrivacyFeatureDetailView,
});

/* Slide 1: Opening */
function SlideOpening() {
  return (
    <div className="h-full bg-[#F0FDF4] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#059669]/20 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#059669] mb-8 sm:mb-12 shadow-sm">
        🔒 CHAPTER 05/05 · ABSOLUTE PRIVACY
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "Your thoughts are private property.",
          "Not telemetry data.",
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
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-ink leading-none tracking-tighter">
        100% Local. Zero Cloud.
      </motion.p>
    </div>
  );
}

/* Slide 2: Cloud Surveillance Threat (Dark Theme) */
function SlideProblem() {
  return (
    <div className="h-full bg-[#064E3B] flex items-center justify-center px-6">
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
          <ShieldCheck className="size-28 sm:size-36 text-[#34D399]" />
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Three Privacy Pillars */
function SlidePillars() {
  return (
    <div className="h-full bg-[#F0FDF4] flex items-center justify-center px-6">
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

/* Slide 4: Legal & DPDP Act Sovereignty */
function SlideCompliance() {
  return (
    <div className="h-full bg-[#DCFCE7] flex items-center justify-center px-6">
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

/* Slide 5: Motivated Transition Bridge to The Closure */
function SlideNextBridge() {
  return (
    <div className="h-full bg-[#FFFBEB] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-[#FEF3C7] px-5 py-2 text-xs font-black uppercase tracking-widest text-[#D97706] shadow-sm">
          <Sparkles className="size-4" /> UP NEXT · THE CLOSURE
        </span>

        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#78350F] leading-none tracking-tighter max-w-3xl">
          Complete privacy secured. Step into the vision.
        </h2>

        <p className="text-base sm:text-xl md:text-2xl font-semibold text-[#78350F]/75 leading-relaxed max-w-2xl">
          Now that you know your data is 100% private, enter the final chapter: how MinDrop revolutionizes task management for crowded minds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link
            to="/vision"
            viewTransition
            style={{ viewTransitionName: 'card-vision' } as React.CSSProperties}
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-5 rounded-2xl bg-ink text-white font-black text-sm sm:text-base uppercase tracking-wider border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#D97706] hover:border-[#D97706] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center"
          >
            Continue to The Closure <ArrowRight className="size-5" />
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
  const touchStartY = useRef(0);
  const isAnimating = useRef(false);
  const lockTimer = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    <SlideOpening />,
    <SlideProblem />,
    <SlidePillars />,
    <SlideCompliance />,
    <SlideNextBridge />,
  ];
  const TOTAL = slides.length;
  const isDark = current === 1;

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= TOTAL) return;
    if (isAnimating.current) return;

    isAnimating.current = true;
    setCurrent(idx);

    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      isAnimating.current = false;
    }, 600);
  };

  // Wheel Listener with strict 1-slide gesture lock
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;
      if (Math.abs(e.deltaY) < 12 && Math.abs(e.deltaX) < 12) return;

      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta > 0) goTo(current + 1);
      else if (delta < 0) goTo(current - 1);
    };

    window.addEventListener("wheel", handler, { passive: false });
    return () => {
      window.removeEventListener("wheel", handler);
      if (lockTimer.current) clearTimeout(lockTimer.current);
    };
  }, [current]);

  // Keyboard Listener with strict 1-slide gesture lock
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
      style={{ viewTransitionName: "card-privacy-manifesto" } as React.CSSProperties}
    >
      <header className="shrink-0 border-b-2 border-ink/10 z-50 py-2.5 px-3 sm:px-6"
        style={{ backgroundColor: isDark ? "rgba(6,78,59,0.96)" : "rgba(240,253,244,0.96)", backdropFilter: "blur(12px)", transition: "background-color 0.4s ease" }}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-emerald-200 hover:text-white" : "text-ink/70 hover:text-ink"}`}>
            <X className="size-3.5"/> Close
          </Link>
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          <Link to="/download"
            className={`inline-flex items-center justify-center text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 sm:px-4 py-1.5 rounded-full border-2 shrink-0 leading-none shadow-sm transition ${isDark ? "bg-white text-ink border-white hover:bg-[#059669] hover:text-[#059669] hover:border-[#059669]" : "bg-ink text-white border-ink hover:bg-[#059669] hover:border-[#059669]"}`}>
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
              <ChevronUp className={`size-5 transition group-hover:-translate-y-0.5 ${isDark ? "text-[#A7F3D0]" : "text-[#059669]"}`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-[#A7F3D0]/80" : "text-[#059669]/80"}`}>UP</span>
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
              <ChevronDown className={`size-5 transition group-hover:translate-y-0.5 ${isDark ? "text-[#A7F3D0]" : "text-[#059669]"}`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-[#A7F3D0]/80" : "text-[#059669]/80"}`}>DOWN</span>
            </div>
          </button>
        )}

        {/* Right Dot Navigation */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-50">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-1.5 h-7 bg-[#059669]" : isDark ? "size-1.5 bg-white/30 hover:bg-white/60" : "size-1.5 bg-ink/20 hover:bg-ink/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
