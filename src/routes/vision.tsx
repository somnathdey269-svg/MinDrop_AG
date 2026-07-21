import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import {
  HeartHandshake, Sparkles, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, X
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

/* Slide 4: Closing Remark */
function SlideCloser({ backHash }: { backHash?: string }) {
  return (
    <div className="h-full bg-[#FEF3C7] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 sm:gap-10 max-w-4xl">
        <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706]">
          Thank you for joining our mission
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#78350F] leading-none tracking-tighter">
          Ready to experience pure focus?
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#78350F]/70 leading-relaxed max-w-2xl">
          MinDrop is engineered with love to protect your time and peace of mind.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link to="/download"
            className="px-10 sm:px-12 py-4.5 sm:py-5 bg-[#78350F] text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#D97706] hover:border-[#D97706] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Get MinDrop Android App
          </Link>
          <Link to="/" hash={backHash} viewTransition
            className="px-10 sm:px-12 py-4.5 sm:py-5 bg-white text-ink font-black text-sm sm:text-base uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFBEB] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Back to Showcase
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
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const lastScrollTime = useRef(0);

  const slides = [
    <SlideOpening />,
    <SlideProblem />,
    <SlideParadigm />,
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
      style={{ viewTransitionName: "card-vision" } as React.CSSProperties}
    >
      <header className="shrink-0 border-b-2 border-[#D97706]/10 z-50"
        style={{ backgroundColor: isDark ? "rgba(69,26,3,0.96)" : "rgba(255,251,235,0.96)", backdropFilter: "blur(12px)", transition: "background-color 0.4s ease" }}>
        <div className="w-[95%] max-w-7xl mx-auto h-14 flex items-center justify-between gap-2 px-2 sm:px-4">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-[#FEF3C7]/70 hover:text-white" : "text-[#D97706]/70 hover:text-[#78350F]"}`}>
            <X className="size-3.5"/> Close
          </Link>
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          <Link to="/download"
            className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 sm:px-4 py-1.5 rounded-full border-2 shrink-0 leading-none whitespace-nowrap shadow-sm transition ${isDark ? "bg-white text-ink border-white hover:bg-[#D97706] hover:text-white hover:border-[#D97706]" : "bg-ink text-white border-ink hover:bg-[#D97706] hover:border-[#D97706]"}`}>
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
                i === current ? "w-1.5 h-7 bg-[#D97706]" : isDark ? "size-1.5 bg-[#FEF3C7]/25 hover:bg-[#FEF3C7]/60" : "size-1.5 bg-[#D97706]/25 hover:bg-[#D97706]/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
