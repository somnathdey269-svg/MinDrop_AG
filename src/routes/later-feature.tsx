import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import { MobileFeatureDock } from "@/components/layout/MobileFeatureDock";
import { AnimatedIcon } from "@/components/common/AnimatedIcon";
import {
  AlarmClock, ShieldAlert, Sparkles, Volume2, ChevronLeft, ChevronRight, X, ArrowRight, Pill, MessageSquare, Utensils, ChevronDown, ChevronUp, Phone, Flame
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/later-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "Critical Task Alarm — MinDrop Feature" },
      { name: "description", content: "Discover MinDrop's full-screen critical alarms: continuous looping audio, snooze cycles, and foreground service reliability." },
    ],
  }),
  component: LaterFeatureDetailView,
});

/* Slide 1: Opening Statement */
function SlideOpening() {
  return (
    <div className="w-full h-full bg-[#E2F5EC] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/20 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857] mb-8 sm:mb-12 shadow-sm">
        ⏰ NEVER MISS A CRITICAL TASK
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "You set a reminder for 8:00 PM.",
          "It made a 1-second ping sound.",
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
        You forgot to take your pills.
      </motion.p>
    </div>
  );
}

/* Slide 2: The Core Problem (Dark Theme) */
function SlideConflict() {
  return (
    <div className="w-full h-full bg-[#022C22] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl"
      >
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
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-[#34D399]/30 bg-white/5 backdrop-blur-md shadow-2xl"
        >
          <AnimatedIcon animation="pulse">
            <AlarmClock className="size-28 sm:size-36 text-[#34D399]" />
          </AnimatedIcon>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* Slide 3: The MinDrop Solution */
function SlideSolution() {
  return (
    <div className="w-full h-full bg-[#E2F5EC] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 sm:gap-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857] mb-4">
            How MinDrop Solves This
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#064E3B] leading-tight tracking-tight">
            Continuous audio looping.<br className="hidden sm:block"/>
            <span className="text-[#10B981]">Rings like an incoming phone call.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[
            { icon: Volume2, title: "Un-missable Audio", body: "Rings continuously until explicitly dismissed or snoozed — giving critical tasks the urgency of a phone call." },
            { icon: ShieldAlert, title: "Survives App Restarts", body: "Powered by Android Foreground Services so alarms ring even if the app was swiped away or phone restarted." },
            { icon: Sparkles, title: "Smart Snooze Cycles", body: "Snooze for 5, 15, or 30 minutes with a single tap. If you don't act, MinDrop comes back loud and clear." },
          ].map(({ icon: Icon, title, body }, idx) => (
            <motion.div 
              key={title} 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.45, delay: idx * 0.12 }}
              className="bg-white border-3 border-[#10B981] rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(16,185,129,0.15)] text-left flex flex-col gap-3"
            >
              <div className="size-12 rounded-2xl bg-[#D1FAE5] grid place-items-center text-[#047857]">
                <AnimatedIcon animation="subtle-bounce">
                  <Icon className="size-6 stroke-[2.5px]" />
                </AnimatedIcon>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#064E3B]">{title}</h3>
              <p className="text-sm sm:text-base font-semibold text-[#064E3B]/70 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Scenarios Carousel */
function SlideScenarios() {
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

  return (
    <div className="h-full w-full bg-[#E2F5EC] flex items-center justify-center px-4 sm:px-6 py-2">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center gap-3 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#047857] mb-0.5">
            Critical Use Cases
          </p>
          <h2 className="text-xl sm:text-3xl md:text-5xl font-black text-[#064E3B] leading-tight tracking-tight">
            Tasks that demand 100% completion.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-6 w-full text-left">
          {scenarios.map(({ title, scene, icon: Icon, color }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.45, delay: idx * 0.12 }}
              className={`rounded-2xl sm:rounded-[2.5rem] border-2 sm:border-3 border-[#10B981] p-3.5 sm:p-7 shadow-xs sm:shadow-[8px_8px_0px_0px_rgba(16,185,129,0.15)] ${color} flex flex-col gap-2 sm:gap-4`}
            >
              <div className="size-9 sm:size-12 bg-white border-2 border-[#10B981] rounded-xl sm:rounded-2xl grid place-items-center text-[#047857] shrink-0 shadow-xs">
                <Icon className="size-4 sm:size-6 text-[#10B981]"/>
              </div>
              <div>
                <h3 className="text-sm sm:text-xl font-black text-[#064E3B] mb-1">{title}</h3>
                <p className="text-xs sm:text-base font-semibold text-[#064E3B]/80 leading-relaxed">{scene}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 5: Motivated Transition Bridge to Chapter 04 (Future Actions) */
function SlideCloser() {
  return (
    <div className="w-full h-full bg-[#E2F5EC] flex items-center justify-center px-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl"
      >
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
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4.5 sm:py-5 bg-[#064E3B] text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-2xl border-3 border-[#064E3B] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#10B981] hover:border-[#10B981] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center whitespace-nowrap">
            Unveil What&apos;s Cooking in R&amp;D <ArrowRight className="size-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function LaterFeatureDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;
  const [current, setCurrent] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const slides = [
    <SlideOpening key="1" />,
    <SlideConflict key="2" />,
    <SlideSolution key="3" />,
    <SlideScenarios key="4" />,
    <SlideCloser key="5" />,
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
      style={{ viewTransitionName: "card-later" } as React.CSSProperties}
    >
      <header className="shrink-0 h-12 border-b-2 border-[#10B981]/10 z-50 px-4 sm:px-6 flex items-center backdrop-blur-md"
        style={{ backgroundColor: isDark ? "rgba(2,44,34,0.96)" : "rgba(226,245,236,0.96)", transition: "background-color 0.4s ease" }}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 h-full">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-[#A7F3D0]/70 hover:text-white" : "text-[#047857]/70 hover:text-[#064E3B]"}`}>
            <X className="size-3.5"/> Close
          </Link>

          <Link to="/" hash={backHash} viewTransition aria-label="MinDrop — Home" className="flex items-center justify-center shrink-0 h-full leading-none">
            <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          </Link>

          <Link to="/download" viewTransition
            className={`inline-flex items-center justify-center whitespace-nowrap text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md border shrink-0 transition-all duration-200 cursor-pointer ${
              isDark
                ? "bg-white text-[#064E3B] border-white hover:bg-[#10B981] hover:text-white"
                : "bg-[#10B981] text-white border-[#10B981] hover:bg-[#047857]"
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
                i === current ? "w-1.5 h-7 bg-[#10B981]" : isDark ? "size-1.5 bg-[#A7F3D0]/25 hover:bg-[#A7F3D0]/60" : "size-1.5 bg-[#047857]/25 hover:bg-[#047857]/50"
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
            ? "bg-white text-[#064E3B] border-white hover:bg-[#10B981] hover:text-white"
            : "bg-[#047857] text-white border-[#047857] hover:bg-[#065F46]"
        }
      />
    </div>
  );
}
