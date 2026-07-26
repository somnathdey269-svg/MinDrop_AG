import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Zap,
  Cpu,
  Lock,
  ArrowRight,
  Brain,
  Download as DownloadIcon,
} from "lucide-react";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import { MobileFeatureDock } from "@/components/layout/MobileFeatureDock";
import { AnimatedIcon } from "@/components/common/AnimatedIcon";
import { useCMSPage } from "@/lib/cms/useCMSPage";
import { DynamicBlockRenderer } from "@/components/cms/DynamicBlockRenderer";

export const Route = createFileRoute("/download")({
  validateSearch: (search: Record<string, unknown>): { from?: string } => {
    return {
      from: (search.from as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Download MinDrop — Google Play Store" },
      {
        name: "description",
        content:
          "Download MinDrop on Android: an offline second brain for immediate micro-actions, zero cloud tracking, and instant mental peace.",
      },
    ],
  }),
  component: DownloadStoryView,
});

/**
 * Replace this with your Google Play Store URL whenever live!
 * When set, the 'Coming Soon' button automatically transforms into an active 1-click Play Store redirect.
 */
const PLAYSTORE_URL: string | null = null;

/* Slide 1: Android-Exclusive (Humorous Android First Statement) */
function SlideAndroidFirst() {
  return (
    <div className="w-full h-full bg-[#EFF6FF] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/20 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#2563EB] mb-6 sm:mb-8 shadow-sm"
      >
        🤖 ANDROID FIRST · CHAPTER 08
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-8">
        {["Sorry iPhone Friends.", "Your Notch Isn't Ready."].map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 + i * 0.45 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#2563EB]/70 leading-tight tracking-tight"
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.div
        animate={{ y: [-4, 4, -4], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="size-36 sm:size-48 md:size-52 my-3 bg-white border-3 border-ink rounded-[2.2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center shrink-0"
      >
        <AnimatedIcon animation="float">
          <Smartphone className="size-16 sm:size-20 md:size-24 text-[#2563EB] stroke-[2.2px]" />
        </AnimatedIcon>
      </motion.div>

      <p className="text-sm sm:text-base md:text-lg font-semibold text-ink/80 max-w-2xl leading-relaxed mt-4">
        We love sleek glass phones and dynamic islands, but MinDrop needs raw local power without background task throttles. Android gives us background geofence sweeps, continuous looping alarms, and instant local SQLite access.
      </p>

      <p className="text-xs sm:text-sm font-medium text-ink/60 italic max-w-lg mt-3">
        iPhone version? Maybe when Siri learns to stay 100% offline without asking for Wi-Fi! 😉
      </p>
    </div>
  );
}

/* Slide 2: Hardware Power & Native Execution */
function SlideHardwarePower() {
  return (
    <div className="w-full h-full bg-[#1E3A8A] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#93C5FD] mb-4">
            Zero Battery Drain · Native WorkManager
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 sm:mb-8 tracking-tight">
            Built directly on Android's<br />
            <span className="text-[#93C5FD]">hardware-native APIs.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-blue-100 leading-relaxed max-w-lg">
            MinDrop isn't a laggy web wrapper. It utilizes native Android WorkManager tasks, low-power OS geofencing, and local SQLite caching so your alarms fire instantly—even during device restarts.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
          <AnimatedIcon animation="pulse">
            <Cpu className="size-28 sm:size-36 text-[#93C5FD]" />
          </AnimatedIcon>
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Privacy & Zero Cloud Telemetry */
function SlidePrivacySovereignty() {
  return (
    <div className="w-full h-full bg-[#EFF6FF] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/20 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#2563EB] shadow-sm">
          <AnimatedIcon animation="pulse">
            <Lock className="size-4 text-[#2563EB]" />
          </AnimatedIcon> 100% LOCAL DATA SOVEREIGNTY
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-ink leading-tight tracking-tight">
          Your micro-thoughts stay strictly on your phone.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-2">
          {[
            { icon: ShieldCheck, title: "No Cloud DB", body: "No database servers collecting your personal drops or notes." },
            { icon: Lock, title: "DPDP Compliant", body: "Built from day one to respect user data sovereignty completely." },
            { icon: Zap, title: "Instant Access", body: "No login delays or server outage dependencies ever." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white border-3 border-ink rounded-[2rem] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-2">
              <div className="size-10 rounded-xl bg-[#DBEAFE] grid place-items-center text-[#2563EB]">
                <Icon className="size-5 stroke-[2.5px]" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-ink">{title}</h3>
              <p className="text-xs sm:text-sm font-semibold text-ink/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Download & Play Store Launch Action */
function SlideDownloadAction() {
  return (
    <div className="w-full h-full bg-[#ECFDF5] flex flex-col items-center justify-center text-center p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center justify-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#059669] mb-4 shadow-sm">
          🚀 GOOGLE PLAY STORE
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-[1.05] tracking-tight max-w-3xl mb-4">
          Your Mind Deserves a Second Brain.
        </h2>
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="size-36 sm:size-48 md:size-52 my-3 bg-white border-3 border-ink rounded-[2.2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] grid place-items-center shrink-0"
        >
          <AnimatedIcon animation="pulse">
            <ShieldCheck className="size-16 sm:size-20 md:size-24 text-[#059669] stroke-[2.2px]" />
          </AnimatedIcon>
        </motion.div>
        <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/80 max-w-2xl leading-relaxed mb-6">
          We are fine-tuning the ultimate zero-cloud, instant-action companion. Zero cloud tracking, zero subscription traps—just pure mental peace in your pocket.
        </p>
        <div>
          {PLAYSTORE_URL ? (
            <a
              href={PLAYSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-[#059669] text-white border-3 border-ink hover:bg-ink transition font-black text-sm uppercase tracking-wider shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
            >
              <Sparkles className="size-5 fill-current" /> Download on Google Play
            </a>
          ) : (
            <div className="inline-flex flex-col sm:flex-row items-center gap-3">
              <button
                disabled
                className="px-8 py-5 rounded-2xl bg-ink text-white border-3 border-ink font-black text-xs sm:text-sm uppercase tracking-wider shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 select-none"
              >
                <Sparkles className="size-4 text-[#F59E0B] fill-current" /> COMING SOON TO GOOGLE PLAY
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DownloadStoryView() {
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

  const { page, hasBlocks } = useCMSPage("download");

  if (hasBlocks && page && page.blocks && page.blocks.length > 0) {
    return (
      <div
        className="min-h-screen bg-[#EFF6FF] flex flex-col select-none"
        style={{ viewTransitionName: "card-download" } as React.CSSProperties}
      >
        <header className="shrink-0 h-14 border-b-2 border-[#2563EB]/10 z-50 bg-[#EFF6FF]/96 backdrop-blur-md px-4 sm:px-6 flex items-center">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 h-full">
            <Link to="/" hash={backHash} resetScroll={true} viewTransition
              className="flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition text-[#2563EB]/70 hover:text-[#1D4ED8]">
              <X className="size-3.5"/> Close
            </Link>

            <Link to="/" hash={backHash} resetScroll={true} viewTransition aria-label="MinDrop — Home" className="flex items-center justify-center shrink-0 h-full leading-none">
              <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" />
            </Link>

            <Link to="/" resetScroll={true} viewTransition
              className="inline-flex items-center justify-center whitespace-nowrap text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#1D4ED8] shadow-md transition-all duration-200 shrink-0 cursor-pointer">
              Story Book
            </Link>
          </div>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto p-6 sm:p-12">
          <DynamicBlockRenderer blocks={page.blocks} />
        </main>
      </div>
    );
  }

  const slides = [
    <SlideAndroidFirst key="1" />,
    <SlideHardwarePower key="2" />,
    <SlidePrivacySovereignty key="3" />,
    <SlideDownloadAction key="4" />,
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
      style={{ viewTransitionName: "card-[#download]" } as React.CSSProperties}
    >
      {/* 1. Header (Desktop & Mobile: Close + Logo + Home) */}
      <header
        className="shrink-0 h-12 border-b-2 border-[#2563EB]/10 z-50 px-4 sm:px-6 flex items-center backdrop-blur-md"
        style={{
          backgroundColor: isDark
            ? "rgba(30,58,138,0.96)"
            : "rgba(239,246,255,0.96)",
          transition: "background-color 0.4s ease",
        }}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 h-full">
          <Link
            to="/"
            hash={backHash}
            resetScroll={true}
            viewTransition
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${
              isDark
                ? "text-[#93C5FD]/70 hover:text-white"
                : "text-[#2563EB]/70 hover:text-[#1D4ED8]"
            }`}
          >
            <X className="size-3.5" /> Close
          </Link>

          <Link
            to="/"
            hash={backHash}
            resetScroll={true}
            viewTransition
            aria-label="MinDrop — Home"
            className="flex items-center justify-center shrink-0 h-full leading-none"
          >
            <MinDropHeaderLogo
              className="text-lg sm:text-2xl shrink-0"
              isDarkBg={isDark}
            />
          </Link>

          <Link
            to="/"
            resetScroll={true}
            viewTransition
            className={`inline-flex items-center justify-center whitespace-nowrap text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md border shrink-0 transition-all duration-200 cursor-pointer ${
              isDark
                ? "bg-white text-[#1E3A8A] border-white hover:bg-[#2563EB] hover:text-white"
                : "bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#1D4ED8]"
            }`}
          >
            Story Book
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
          <section
            key={idx}
            className="w-full h-full shrink-0 snap-start snap-always flex items-center justify-center relative overflow-hidden perspective-[1200px]"
          >
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
              <div
                className={`w-[450px] h-[450px] rounded-full blur-3xl opacity-20 animate-pulse ${
                  isDark ? "bg-blue-400" : "bg-[#2563EB]"
                }`}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 6 }}
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
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "w-1.5 h-7 bg-[#2563EB]"
                  : isDark
                  ? "size-1.5 bg-white/30 hover:bg-white/60"
                  : "size-1.5 bg-ink/20 hover:bg-ink/50"
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
            ? "bg-white text-[#1E3A8A] border-white hover:bg-[#3B82F6] hover:text-white"
            : "bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#1D4ED8]"
        }
      />
    </div>
  );
}
