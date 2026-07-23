import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import {
  AlarmClock, ShieldAlert, Sparkles, Volume2, ChevronLeft, ChevronRight, X, ArrowRight, Pill, Phone, Flame, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/later-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "Looping Alarm — MinDrop Feature" },
      { name: "description", content: "Discover MinDrop's persistent looping alarms: non-ignorable alerts that ring continuously like an incoming call until acknowledged." },
    ],
  }),
  component: LaterFeatureDetailView,
});

/* Slide 1: Opening Statement */
function SlideOpening() {
  return (
    <div className="h-full bg-[#E2F5EC] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/20 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857] mb-8 sm:mb-12 shadow-sm">
        🔔 CHAPTER 03/05 · LOOPING ALARM
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "A single ping is easy to ignore.",
          "Critical tasks shouldn't be optional.",
        ].map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#047857]/60 leading-tight tracking-tight">
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#064E3B] leading-none tracking-tighter">
        MinDrop rings until you check it.
      </motion.p>
    </div>
  );
}

/* Slide 2: The Core Problem (Dark Theme) */
function SlideConflict() {
  return (
    <div className="h-full bg-[#022C22] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#A7F3D0] mb-4">
            The Notification Graveyard
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 sm:mb-8 tracking-tight">
            Standard reminders disappear<br />
            <span className="text-[#34D399]">into your notification shade.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#A7F3D0] leading-relaxed max-w-lg">
            When a single chime sounds while you are washing dishes, cooking, or driving, it vanishes into a list of 30 unread pings. You tell yourself you'll check it later — but later never happens.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-[#34D399]/30 bg-white/5 backdrop-blur-md shadow-2xl">
          <AlarmClock className="size-28 sm:size-36 text-[#34D399]" />
        </div>
      </div>
    </div>
  );
}

/* Slide 3: The MinDrop Solution */
function SlideSolution() {
  return (
    <div className="h-full bg-[#E2F5EC] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 sm:gap-12 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857] mb-4">
            How MinDrop Solves This
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#064E3B] leading-tight tracking-tight">
            Continuous audio looping.<br className="hidden sm:block"/>
            <span className="text-[#10B981]">Rings like an incoming phone call.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[
            { icon: Volume2, title: "Un-missable Audio", body: "Rings continuously until explicitly dismissed or snoozed — giving critical tasks the urgency of a phone call." },
            { icon: ShieldAlert, title: "Survives App Restarts", body: "Powered by Android Foreground Services so alarms ring even if the app was swiped away or phone restarted." },
            { icon: Sparkles, title: "Smart Snooze Cycles", body: "Snooze for 5, 15, or 30 minutes with a single tap. If you don't act, MinDrop comes back loud and clear." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white border-3 border-[#10B981] rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(16,185,129,0.15)] text-left flex flex-col gap-3">
              <div className="size-12 rounded-2xl bg-[#D1FAE5] grid place-items-center text-[#047857]">
                <Icon className="size-6 stroke-[2.5px]" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#064E3B]">{title}</h3>
              <p className="text-sm sm:text-base font-semibold text-[#064E3B]/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Scenarios Carousel */
function SlideScenarios() {
  const [cardIdx, setCardIdx] = useState(0);

  const scenarios = [
    {
      icon: Pill,
      title: "Medication & Health Schedules",
      scene: "Taking daily medicine at exact times cannot be delayed or forgotten. MinDrop loops until you physically take your dose.",
      color: "bg-[#E2F5EC]",
    },
    {
      icon: Phone,
      title: "Urgent Callback Reminders",
      scene: "Told a client or family member you'd call back in 20 minutes? A looping alarm ensures you don't break your word.",
      color: "bg-[#D1FAE5]",
    },
    {
      icon: Flame,
      title: "Kitchen & Safety Checks",
      scene: "Turning off the stove or checking an oven timer needs immediate action before damage occurs.",
      color: "bg-[#E2F5EC]",
    },
  ];

  const prev = () => setCardIdx(i => Math.max(0, i - 1));
  const next = () => setCardIdx(i => Math.min(scenarios.length - 1, i + 1));

  const touchStartX = useRef<number | null>(null);

  return (
    <div className="h-full bg-[#E2F5EC] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 max-w-5xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857] mb-2">
            Critical Use Cases
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#064E3B] leading-tight tracking-tight">
            Tasks that demand 100% completion.
          </h2>
        </div>

        <div 
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 35) {
              if (diff > 0) next();
              else prev();
            }
            touchStartX.current = null;
          }}
          className="w-full relative overflow-hidden flex items-center justify-center cursor-pointer select-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={cardIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={`w-full rounded-[2.5rem] border-3 border-[#10B981] p-6 sm:p-12 shadow-[8px_8px_0px_0px_rgba(16,185,129,0.15)] ${scenarios[cardIdx].color} text-left flex gap-4 sm:gap-6 items-start`}
            >
              <div className="size-12 sm:size-14 bg-white border-2 border-[#10B981] rounded-2xl grid place-items-center text-[#047857] shrink-0 shadow-sm">
                {(() => { const Icon = scenarios[cardIdx].icon; return <Icon className="size-6 sm:size-7 text-[#10B981]"/>; })()}
              </div>
              <div>
                <h3 className="text-xl sm:text-3xl font-black text-[#064E3B] mb-1 sm:mb-2">{scenarios[cardIdx].title}</h3>
                <p className="text-sm sm:text-xl font-semibold text-[#064E3B]/80 leading-relaxed">{scenarios[cardIdx].scene}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={prev} disabled={cardIdx === 0}
            className="size-9 sm:size-12 rounded-full border-2 border-[#064E3B] bg-white text-[#064E3B] grid place-items-center disabled:opacity-30 hover:bg-[#D1FAE5] transition cursor-pointer shadow-sm"
            aria-label="Previous scenario"
          >
            <ChevronLeft className="size-5 sm:size-6" />
          </button>
          <div className="flex items-center gap-1.5">
            {scenarios.map((_, i) => (
              <button key={i} onClick={() => setCardIdx(i)}
                className={`shrink-0 rounded-full transition-all duration-300 cursor-pointer ${i === cardIdx ? "w-5 h-2 bg-[#10B981]" : "size-2 bg-[#10B981]/30 hover:bg-[#10B981]/60"}`}
                aria-label={`Go to scenario ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={next} disabled={cardIdx === scenarios.length - 1}
            className="size-9 sm:size-12 rounded-full border-2 border-[#064E3B] bg-white text-[#064E3B] grid place-items-center disabled:opacity-30 hover:bg-[#D1FAE5] transition cursor-pointer shadow-sm"
            aria-label="Next scenario"
          >
            <ChevronRight className="size-5 sm:size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* Slide 5: Motivated Transition Bridge to Chapter 04 (Future Actions) */
function SlideCloser() {
  return (
    <div className="h-full bg-[#E2F5EC] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#D1FAE5] px-5 py-2 text-xs font-black uppercase tracking-widest text-[#047857] shadow-sm">
          <Sparkles className="size-4" /> UP NEXT · CHAPTER 04
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#064E3B] leading-none tracking-tighter">
          Curious about what's coming next on our roadmap?
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#047857]/60 leading-relaxed max-w-2xl">
          Continuous looping alarms hold your critical tasks. Now step into Chapter 04 to explore contact triggers, voice micro-notes, and cross-app bridges.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link to="/future-feature" viewTransition style={{ viewTransitionName: 'card-future' } as React.CSSProperties}
            className="inline-flex items-center justify-center gap-3 px-10 sm:px-12 py-4.5 sm:py-5 bg-[#064E3B] text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-2xl border-3 border-[#064E3B] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#10B981] hover:border-[#10B981] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Continue to Chapter 04: Future Actions <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function LaterFeatureDetailView() {
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
    <SlideConflict />,
    <SlideSolution />,
    <SlideScenarios />,
    <SlideCloser />,
  ];
  const TOTAL = slides.length;
  const isDark = current === 1;

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
      style={{ viewTransitionName: "card-later" } as React.CSSProperties}
    >
      {/* Header */}
      <header className="shrink-0 border-b-2 border-[#10B981]/10 z-50 py-2.5 px-3 sm:px-6"
        style={{ backgroundColor: isDark ? "rgba(6,78,59,0.96)" : "rgba(226,245,236,0.96)", backdropFilter: "blur(12px)", transition: "background-color 0.4s ease" }}>
        <div className="w-[95%] max-w-7xl mx-auto flex items-center justify-between gap-2">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-[#A7F3D0]/70 hover:text-white" : "text-[#047857]/70 hover:text-[#064E3B]"}`}>
            <X className="size-3.5"/> Close
          </Link>
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          <Link to="/download"
            className={`inline-flex items-center justify-center text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 sm:px-4 py-1.5 rounded-full border-2 shrink-0 leading-none shadow-sm transition ${isDark ? "bg-white text-ink border-white hover:bg-[#10B981] hover:text-white hover:border-[#10B981]" : "bg-ink text-white border-ink hover:bg-[#10B981] hover:border-[#10B981]"}`}>
            Get App
          </Link>
        </div>
      </header>

      {/* Full-Screen Slide Stage */}
      <main 
        className="flex-1 min-h-0 w-full relative overflow-y-auto sm:overflow-hidden flex items-center justify-center px-3 sm:px-6 pr-14 sm:pr-16 py-2"
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
                i === current ? "w-1.5 h-7 bg-[#10B981]" : isDark ? "size-1.5 bg-[#A7F3D0]/25 hover:bg-[#A7F3D0]/60" : "size-1.5 bg-[#047857]/25 hover:bg-[#047857]/50"
              }`}
            />
          ))}
        </div>
      </main>

      {/* Subtle & Attractive Bottom-Right Floating Navigation Dock */}
      <div className="fixed right-3.5 sm:right-6 bottom-5 sm:bottom-6 z-50 flex flex-col items-center gap-1.5 p-1.5 rounded-full bg-white/90 dark:bg-ink/90 border-2 border-ink/30 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] backdrop-blur-lg select-none transition-all">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className={`size-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            current === 0
              ? "opacity-25 cursor-not-allowed"
              : isDark
              ? "bg-white/10 hover:bg-white/20 text-[#A7F3D0] active:scale-95"
              : "bg-ink/5 hover:bg-ink/10 text-[#064E3B] active:scale-95"
          }`}
          aria-label="Previous Slide"
        >
          <ChevronUp className="size-4 stroke-[2.5px]" />
        </button>

        <span className={`w-4 h-[1px] ${isDark ? "bg-white/20" : "bg-ink/20"}`} />

        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === TOTAL - 1}
          className={`size-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            current === TOTAL - 1
              ? "opacity-25 cursor-not-allowed"
              : isDark
              ? "bg-white/10 hover:bg-white/20 text-[#A7F3D0] active:scale-95"
              : "bg-ink/5 hover:bg-ink/10 text-[#064E3B] active:scale-95"
          }`}
          aria-label="Next Slide"
        >
          <ChevronDown className="size-4 stroke-[2.5px]" />
        </button>
      </div>
    </div>
  );
}
