import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import { MobileFeatureDock } from "@/components/layout/MobileFeatureDock";
import {
  HeartHandshake, Sparkles, CheckCircle2, ArrowRight, X, ChevronDown, ChevronUp
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
    <div className="w-full h-full bg-[#FFFBEB] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/20 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706] mb-8 sm:mb-12 shadow-sm">
        ✨ UNBURDEN YOUR MIND TODAY
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
    <div className="w-full h-full bg-[#451A03] flex items-center justify-center px-6">
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
    <div className="w-full h-full bg-[#FFFBEB] flex items-center justify-center px-6">
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
    <div className="w-full h-full bg-[#451A03] flex items-center justify-center px-6 text-center">
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

/* Slide 5: Grand Finale — Bridge to Pricing */
function SlideCloser() {
  return (
    <div className="w-full h-full bg-[#FEF3C7] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706]">
          Your second brain is ready
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#78350F] leading-none tracking-tighter">
          Experience zero clutter & ultimate mental peace.
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#78350F]/70 leading-relaxed max-w-2xl">
          MinDrop is engineered for crowded minds who value focus and immediate micro-actions. No subscriptions. No cloud traps. Just peace.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link
            to="/pricing"
            viewTransition
            style={{ viewTransitionName: 'card-pricing' } as React.CSSProperties}
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-5 rounded-2xl bg-[#78350F] text-white font-black text-sm sm:text-base uppercase tracking-wider border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#D97706] hover:border-[#D97706] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center whitespace-nowrap"
          >
            See Transparent Pricing <ArrowRight className="size-5" />
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setCurrent(0);
  }, []);

  const slides = [
    <SlideOpening key="1" />,
    <SlideProblem key="2" />,
    <SlideParadigm key="3" />,
    <SlideCommitment key="4" />,
    <SlideCloser key="5" />,
  ];
  const TOTAL = slides.length;
  const isDark = current === 1 || current === 3;

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
      style={{ viewTransitionName: "card-vision" } as React.CSSProperties}
    >
      {/* 1. Header (Desktop & Mobile: Close + Logo + Get App) */}
      <header className="shrink-0 h-12 border-b-2 border-amber-500/10 z-50 px-4 sm:px-6 flex items-center backdrop-blur-md"
        style={{ backgroundColor: isDark ? "rgba(24,15,6,0.96)" : "rgba(254,243,199,0.96)", transition: "background-color 0.4s ease" }}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 h-full">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-amber-200 hover:text-white" : "text-amber-700/70 hover:text-amber-900"}`}>
            <X className="size-3.5"/> Close
          </Link>

          <Link to="/" hash={backHash} viewTransition aria-label="MinDrop — Home" className="flex items-center justify-center shrink-0 h-full leading-none">
            <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          </Link>

          <Link to="/download" viewTransition
            className="inline-flex items-center justify-center whitespace-nowrap text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md border border-amber-400/40 hover:from-amber-600 hover:to-amber-700 hover:shadow-lg transition-all duration-200 shrink-0 cursor-pointer">
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
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 25, rotateX: 5 }}
              whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              viewport={{ amount: 0.4 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex items-center justify-center"
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
