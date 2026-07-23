import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import { MobileFeatureDock } from "@/components/layout/MobileFeatureDock";
import {
  HeartHandshake, Sparkles, CheckCircle2, RotateCcw, Rocket, X, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/vision")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "The Closure — Revolutionizing Reminder Apps" },
      { name: "description", content: "The Closure: How MinDrop is revolutionizing reminder apps by moving from ignored todo lists to an offline second brain for micro-actions." },
    ],
  }),
  component: VisionDetailView,
});

/* Slide 1: Opening */
function SlideOpening() {
  return (
    <div className="h-full bg-[#FFFBEB] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/20 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706] mb-8 sm:mb-12 shadow-sm">
        ✨ THE CLOSURE · REVOLUTIONIZING REMINDERS
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "No more forgotten todo lists.",
          "Immediate closure for every thought.",
        ].map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#D97706]/60 leading-tight tracking-tight">
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#78350F] leading-none tracking-tighter">
        The Future of Micro-Tasks.
      </motion.p>
    </div>
  );
}

/* Slide 2: Why Traditional Apps Cause Guilt (Dark Theme) */
function SlideProblem() {
  return (
    <div className="h-full bg-[#451A03] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#FDE68A] mb-4">
            The failure of standard todo apps
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 sm:mb-8 tracking-tight">
            Todo lists create guilt.<br />
            <span className="text-[#F59E0B]">MinDrop delivers action.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#FEF3C7] leading-relaxed max-w-lg">
            Traditional todo apps become long graveyards of uncompleted items. You open them, feel overwhelmed by 50 overdue items, and close them. MinDrop treats tasks as immediate, active drops.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-[#F59E0B]/30 bg-white/5 backdrop-blur-md shadow-2xl">
          <HeartHandshake className="size-28 sm:size-36 text-[#F59E0B]" />
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Paradigm Shift */
function SlideParadigm() {
  return (
    <div className="h-full bg-[#FFFBEB] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 sm:gap-12 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706] mb-4">
            How MinDrop Changes Everything
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#78350F] leading-tight tracking-tight">
            A radical shift in task architecture.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[
            { title: "Continuous Ringing", body: "Alarms ring continuously like an incoming call so you never miss what's critical." },
            { title: "Geofence Sweeps", body: "Drop pins at real physical locations so tasks trigger right when you walk into radius." },
            { title: "Smart Keyword Filters", body: "Silence junk notifications automatically while escalating high-priority messages into loud alerts." },
          ].map(({ title, body }) => (
            <div key={title} className="bg-white border-3 border-[#F59E0B] rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(120,53,15,0.15)] text-left flex flex-col gap-3">
              <div className="size-12 rounded-2xl bg-[#FEF3C7] grid place-items-center text-[#D97706]">
                <CheckCircle2 className="size-6 stroke-[2.5px]" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#78350F]">{title}</h3>
              <p className="text-sm sm:text-base font-semibold text-[#78350F]/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 4: The Founder's Commitment */
function SlideCommitment() {
  return (
    <div className="h-full bg-[#451A03] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-[#FDE68A]">
          <Sparkles className="size-4" /> OUR PROMISE TO YOU
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
          Quiet software built for peaceful minds.
        </h2>
        <p className="text-base sm:text-xl font-semibold text-[#FEF3C7] max-w-2xl leading-relaxed">
          We promise to keep MinDrop zero-cloud, ultra-fast, and free of subscriptions or ad clutter. Software should respect your attention, not exploit it.
        </p>
      </div>
    </div>
  );
}

/* Slide 5: Grand Finale & Replay Bridge */
function SlideCloser() {
  return (
    <div className="h-full bg-[#FEF3C7] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706]">
          Your second brain is ready
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#78350F] leading-none tracking-tighter">
          Experience zero clutter & ultimate mental peace.
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#78350F]/70 leading-relaxed max-w-2xl">
          MinDrop is engineered for crowded minds who value focus and immediate micro-actions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link to="/download"
            className="inline-flex items-center justify-center gap-2 px-10 sm:px-12 py-4.5 sm:py-5 bg-[#78350F] text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-2xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#D97706] hover:border-[#D97706] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            <Rocket className="size-5" /> Get MinDrop Android App
          </Link>
          <Link to="/about" viewTransition style={{ viewTransitionName: 'card-[#about]' } as React.CSSProperties}
            className="inline-flex items-center justify-center gap-2 px-10 sm:px-12 py-4.5 sm:py-5 bg-white text-ink font-black text-sm sm:text-base uppercase tracking-wider rounded-2xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFBEB] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            <RotateCcw className="size-5" /> Replay from Index (About)
          </Link>
        </div>
      </div>
    </div>
  );
}

function VisionDetailView() {
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
    <SlideParadigm />,
    <SlideCommitment />,
    <SlideCloser />,
  ];
  const TOTAL = slides.length;
  const isDark = current === 1 || current === 3;

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
      style={{ viewTransitionName: "card-vision" } as React.CSSProperties}
    >
      {/* 1. Header (Desktop: Close + Logo + Get App | Mobile: Logo Only) */}
      <header className="shrink-0 h-12 border-b-2 border-[#D97706]/10 z-50 px-4 sm:px-6 flex items-center backdrop-blur-md"
        style={{ backgroundColor: isDark ? "rgba(69,26,3,0.96)" : "rgba(255,251,235,0.96)", transition: "background-color 0.4s ease" }}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-center md:justify-between gap-2 h-full">
          <Link to="/" hash={backHash} viewTransition
            className={`hidden md:flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-[#FEF3C7]/70 hover:text-white" : "text-[#D97706]/70 hover:text-[#78350F]"}`}>
            <X className="size-3.5"/> Close
          </Link>

          <Link to="/" hash={backHash} viewTransition aria-label="MinDrop — Home" className="flex items-center justify-center shrink-0 h-full leading-none">
            <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          </Link>

          <Link to="/download" viewTransition
            className={`hidden md:inline-flex items-center justify-center text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 sm:px-4 py-1.5 rounded-full border-2 shrink-0 leading-none shadow-sm transition ${isDark ? "bg-white text-ink border-white hover:bg-[#D97706] hover:text-white hover:border-[#D97706]" : "bg-ink text-[#FFFBEB] border-ink hover:bg-[#D97706] hover:border-[#D97706]"}`}>
            Get App
          </Link>
        </div>
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
                i === current ? "w-1.5 h-7 bg-[#D97706]" : isDark ? "size-1.5 bg-[#FEF3C7]/25 hover:bg-[#FEF3C7]/60" : "size-1.5 bg-[#D97706]/25 hover:bg-[#D97706]/50"
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
      />
    </div>
  );
}
