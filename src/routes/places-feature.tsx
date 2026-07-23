import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import {
  MapPin, ShieldAlert, Sparkles, Navigation, ChevronLeft, ChevronRight, X, ArrowRight, Pill, ShoppingBag, Briefcase, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/places-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "Location Reminder — MinDrop Feature" },
      { name: "description", content: "Learn how MinDrop triggers alerts based on physical location: entry, exit, and radius triggers with zero battery drain." },
    ],
  }),
  component: PlacesFeatureDetailView,
});

/* Slide 1: Opening Statement */
function SlideOpening() {
  return (
    <div className="h-full bg-[#F5F3FF] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/20 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#8B5CF6] mb-8 sm:mb-12 shadow-sm">
        📍 CHAPTER 02/05 · LOCATION REMINDER
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "You needed medicine.",
          "You drove past the pharmacy twice.",
        ].map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#8B5CF6]/60 leading-tight tracking-tight">
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#4C1D95] leading-none tracking-tighter">
        You remembered at home.
      </motion.p>
    </div>
  );
}

/* Slide 2: The Core Problem (Dark Theme) */
function SlideConflict() {
  return (
    <div className="h-full bg-[#2E1065] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#DDD6FE] mb-4">
            The Location Gap
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 sm:mb-8 tracking-tight">
            Time-based alarms fail<br />
            <span className="text-[#C4B5FD]">when tasks belong to places.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#DDD6FE] leading-relaxed max-w-lg">
            Setting an alarm for 5:00 PM doesn't help if you reach the grocery store at 5:45 PM. You don't need a clock — you need a reminder that triggers when your feet touch the threshold.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-[#C4B5FD]/30 bg-white/5 backdrop-blur-md shadow-2xl">
          <MapPin className="size-28 sm:size-36 text-[#C4B5FD]" />
        </div>
      </div>
    </div>
  );
}

/* Slide 3: The MinDrop Solution */
function SlideSolution() {
  return (
    <div className="h-full bg-[#F5F3FF] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 sm:gap-12 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#8B5CF6] mb-4">
            How MinDrop Solves This
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#4C1D95] leading-tight tracking-tight">
            Drop a pin. Set a radius.<br className="hidden sm:block"/>
            <span className="text-[#8B5CF6]">Walk in. Get reminded.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[
            { icon: Navigation, title: "Arrive & Depart Triggers", body: "Set reminders that fire when you arrive at a location OR when you leave it — so you never forget your keys at work." },
            { icon: ShieldAlert, title: "Zero GPS Battery Drain", body: "Uses native Android Geofencing APIs. Doesn't run GPS continuously in the background — ultra-light on battery." },
            { icon: Sparkles, title: "100% Private Locations", body: "Your saved places stay strictly on your phone in SQLite. No tracking, no cloud sync, no data sold." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white border-3 border-[#8B5CF6] rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(139,92,246,0.15)] text-left flex flex-col gap-3">
              <div className="size-12 rounded-2xl bg-[#EDE9FE] grid place-items-center text-[#8B5CF6]">
                <Icon className="size-6 stroke-[2.5px]" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#4C1D95]">{title}</h3>
              <p className="text-sm sm:text-base font-semibold text-[#4C1D95]/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Interactive Geofence Radius Selector */
function SlideRadiusDemo() {
  const [radius, setRadius] = useState(200);
  const [triggerMode, setTriggerMode] = useState<"enter" | "exit">("enter");

  return (
    <div className="h-full bg-[#EDE9FE] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#8B5CF6] mb-3">
            Interactive Geofence Control
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4C1D95] leading-tight mb-4 tracking-tight">
            Adjust your reminder trigger zone.
          </h2>
          <p className="text-base sm:text-lg font-semibold text-[#4C1D95]/75 leading-relaxed mb-6">
            Choose how far away you want to be alerted. A small 100m radius for a specific shop, or a wide 500m zone for your neighborhood.
          </p>

          <div className="flex gap-3 mb-6">
            <button onClick={() => setTriggerMode("enter")}
              className={`px-5 py-2.5 rounded-full border-2 border-[#4C1D95] font-black text-xs uppercase tracking-wider transition cursor-pointer ${
                triggerMode === "enter" ? "bg-[#4C1D95] text-white" : "bg-white text-[#4C1D95] hover:bg-[#F5F3FF]"
              }`}>
              When Arriving (Entry)
            </button>
            <button onClick={() => setTriggerMode("exit")}
              className={`px-5 py-2.5 rounded-full border-2 border-[#4C1D95] font-black text-xs uppercase tracking-wider transition cursor-pointer ${
                triggerMode === "exit" ? "bg-[#4C1D95] text-white" : "bg-white text-[#4C1D95] hover:bg-[#F5F3FF]"
              }`}>
              When Leaving (Exit)
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[440px] bg-white border-3 border-[#4C1D95] rounded-[2.5rem] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(76,29,149,0.2)] text-left flex flex-col gap-6">
          <div className="flex items-center justify-between border-b-2 border-[#EDE9FE] pb-4">
            <span className="font-black text-sm uppercase tracking-wider text-[#4C1D95]">Geofence Preview</span>
            <span className="text-xs font-black text-[#8B5CF6] bg-[#EDE9FE] px-3 py-1 rounded-full">{radius} METERS</span>
          </div>

          <div className="relative h-44 bg-[#F5F3FF] border-2 border-[#8B5CF6]/30 rounded-2xl flex items-center justify-center overflow-hidden">
            <motion.div
              animate={{ size: Math.max(60, (radius / 500) * 140) }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className="rounded-full border-2 border-dashed border-[#8B5CF6] bg-[#8B5CF6]/15 flex items-center justify-center"
            >
              <div className="size-8 rounded-full bg-[#4C1D95] text-white grid place-items-center shadow-md">
                <MapPin className="size-4" />
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-black uppercase text-[#4C1D95]/70">
              <span>100m (Tight)</span>
              <span>500m (Wide Area)</span>
            </div>
            <input type="range" min="100" max="500" step="50" value={radius} onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-[#8B5CF6] cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Slide 5: Scenarios Carousel */
function SlideScenarios() {
  const [cardIdx, setCardIdx] = useState(0);

  const scenarios = [
    {
      icon: Pill,
      title: "Pharmacy & Medical Drops",
      scene: "Never drive past your chemist without picking up prescription refills. MinDrop alerts you right as you turn into the street.",
      color: "bg-[#F5F3FF]",
    },
    {
      icon: ShoppingBag,
      title: "Supermarket & Grocery List",
      scene: "Step inside your local grocery store and your saved list immediately rings so you don't forget milk or eggs.",
      color: "bg-[#EDE9FE]",
    },
    {
      icon: Briefcase,
      title: "Office Exit Checklist",
      scene: "Trigger a reminder as you leave your office building to make sure your laptop charger and ID card are in your bag.",
      color: "bg-[#F5F3FF]",
    },
  ];

  const prev = () => setCardIdx(i => Math.max(0, i - 1));
  const next = () => setCardIdx(i => Math.min(scenarios.length - 1, i + 1));

  const touchStartX = useRef<number | null>(null);

  return (
    <div className="h-full bg-[#F5F3FF] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 max-w-5xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#8B5CF6] mb-2">
            Everyday Geofence Triggers
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4C1D95] leading-tight tracking-tight">
            How location reminders change your day.
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
              className={`w-full rounded-[2.5rem] border-3 border-[#8B5CF6] p-6 sm:p-12 shadow-[8px_8px_0px_0px_rgba(139,92,246,0.15)] ${scenarios[cardIdx].color} text-left flex gap-4 sm:gap-6 items-start`}
            >
              <div className="size-12 sm:size-14 bg-white border-2 border-[#8B5CF6] rounded-2xl grid place-items-center text-[#4C1D95] shrink-0 shadow-sm">
                {(() => { const Icon = scenarios[cardIdx].icon; return <Icon className="size-6 sm:size-7 text-[#8B5CF6]"/>; })()}
              </div>
              <div>
                <h3 className="text-xl sm:text-3xl font-black text-[#4C1D95] mb-1 sm:mb-2">{scenarios[cardIdx].title}</h3>
                <p className="text-sm sm:text-xl font-semibold text-[#4C1D95]/80 leading-relaxed">{scenarios[cardIdx].scene}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={prev} disabled={cardIdx === 0}
            className="size-9 sm:size-12 rounded-full border-2 border-[#4C1D95] bg-white text-[#4C1D95] grid place-items-center disabled:opacity-30 hover:bg-[#EDE9FE] transition cursor-pointer shadow-sm"
            aria-label="Previous scenario"
          >
            <ChevronLeft className="size-5 sm:size-6" />
          </button>
          <div className="flex items-center gap-1.5">
            {scenarios.map((_, i) => (
              <button key={i} onClick={() => setCardIdx(i)}
                className={`shrink-0 rounded-full transition-all duration-300 cursor-pointer ${i === cardIdx ? "w-5 h-2 bg-[#8B5CF6]" : "size-2 bg-[#8B5CF6]/30 hover:bg-[#8B5CF6]/60"}`}
                aria-label={`Go to scenario ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={next} disabled={cardIdx === scenarios.length - 1}
            className="size-9 sm:size-12 rounded-full border-2 border-[#4C1D95] bg-white text-[#4C1D95] grid place-items-center disabled:opacity-30 hover:bg-[#EDE9FE] transition cursor-pointer shadow-sm"
            aria-label="Next scenario"
          >
            <ChevronRight className="size-5 sm:size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* Slide 6: Motivated Transition Bridge to Chapter 03 (Looping Alarm) */
function SlideCloser() {
  return (
    <div className="h-full bg-[#F5F3FF] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#EDE9FE] px-5 py-2 text-xs font-black uppercase tracking-widest text-[#8B5CF6] shadow-sm">
          <Sparkles className="size-4" /> UP NEXT · CHAPTER 03
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#4C1D95] leading-none tracking-tighter">
          What happens when an alert must never be ignored?
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#4C1D95]/60 leading-relaxed max-w-2xl">
          Geofences trigger when you arrive. Now see how MinDrop's looping alarms ring continuously until checked, surviving app restarts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link to="/later-feature" viewTransition style={{ viewTransitionName: 'card-later' } as React.CSSProperties}
            className="inline-flex items-center justify-center gap-3 px-10 sm:px-12 py-4.5 sm:py-5 bg-[#4C1D95] text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-2xl border-3 border-[#4C1D95] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#8B5CF6] hover:border-[#8B5CF6] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Continue to Chapter 03: Looping Alarm <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function PlacesFeatureDetailView() {
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
    <SlideRadiusDemo />,
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
      style={{ viewTransitionName: "card-places" } as React.CSSProperties}
    >
      {/* 1. Header (Fixed Top Bar) */}
      <header className="shrink-0 h-12 border-b-2 border-[#8B5CF6]/10 z-50 px-4 sm:px-6 flex items-center"
        style={{ backgroundColor: isDark ? "rgba(46,16,101,0.96)" : "rgba(245,243,255,0.96)", backdropFilter: "blur(12px)", transition: "background-color 0.4s ease" }}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-[#DDD6FE]/70 hover:text-white" : "text-[#8B5CF6]/70 hover:text-[#4C1D95]"}`}>
            <X className="size-3.5"/> Close
          </Link>
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          <Link to="/download"
            className={`inline-flex items-center justify-center text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 sm:px-4 py-1.5 rounded-full border-2 shrink-0 leading-none shadow-sm transition ${isDark ? "bg-white text-ink border-white hover:bg-[#8B5CF6] hover:text-white hover:border-[#8B5CF6]" : "bg-ink text-white border-ink hover:bg-[#8B5CF6] hover:border-[#8B5CF6]"}`}>
            Get App
          </Link>
        </div>
      </header>

      {/* 2. Dedicated Top UP Navigation Bar */}
      <div className="shrink-0 h-9 flex items-center justify-center z-40">
        {current > 0 ? (
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            className="cursor-pointer group opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Previous Slide"
          >
            <div className="flex items-center gap-1.5 bg-black/10 dark:bg-white/10 backdrop-blur-md px-3 py-0.5 rounded-full border border-current/10 shadow-xs">
              <ChevronUp className={`size-4 transition group-hover:-translate-y-0.5 ${isDark ? "text-[#DDD6FE]" : "text-[#4C1D95]"}`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-[#DDD6FE]" : "text-[#4C1D95]"}`}>UP</span>
            </div>
          </button>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {/* 3. Center Middle Stage (Content perfectly centered between UP & DOWN) */}
      <main 
        className="flex-1 min-h-0 w-full relative overflow-y-auto sm:overflow-hidden flex items-center justify-center px-3 sm:px-6 py-1"
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

        {/* Right Dot Navigation */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-50">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-1.5 h-7 bg-[#8B5CF6]" : isDark ? "size-1.5 bg-[#DDD6FE]/25 hover:bg-[#DDD6FE]/60" : "size-1.5 bg-[#4C1D95]/25 hover:bg-[#4C1D95]/50"
              }`}
            />
          ))}
        </div>
      </main>

      {/* 4. Dedicated Bottom DOWN Navigation Bar */}
      <div className="shrink-0 h-9 flex items-center justify-center z-40 pb-[env(safe-area-inset-bottom,0.25rem)]">
        {current < TOTAL - 1 ? (
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            className="cursor-pointer group opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Next Slide"
          >
            <div className="flex items-center gap-1.5 bg-black/10 dark:bg-white/10 backdrop-blur-md px-3 py-0.5 rounded-full border border-current/10 shadow-xs">
              <ChevronDown className={`size-4 transition group-hover:translate-y-0.5 ${isDark ? "text-[#DDD6FE]" : "text-[#4C1D95]"}`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-[#DDD6FE]" : "text-[#4C1D95]"}`}>DOWN</span>
            </div>
          </button>
        ) : (
          <div className="h-6" />
        )}
      </div>
    </div>
  );
}
