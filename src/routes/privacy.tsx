import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPublicSettings } from "@/lib/platformSettings.functions";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check, Shield, FolderOpen, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const SITE = "https://getmindrop.lovable.app";
const LAST_UPDATED = "November 2025";

const settingsQuery = () => ({
  queryKey: ["public-settings"] as const,
  queryFn: () => getPublicSettings(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/privacy")({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery()),
  head: () => ({
    meta: [
      { title: "Privacy Policy — MinDrop" },
      { name: "description", content: "How MinDrop collects, uses, stores, and shares personal data. DPDP Act, 2023 compliant." },
      { property: "og:title", content: "Privacy Policy — MinDrop" },
      { property: "og:description", content: "How MinDrop collects, uses, stores, and shares personal data." },
      { property: "og:url", content: SITE + "/privacy" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: SITE + "/privacy" }],
  }),
  component: Privacy,
});

/* ══════════════════════════════════════════════
   SLIDES
══════════════════════════════════════════════ */

/* Slide 1: Core Philosophy */
function SlideOpening() {
  return (
    <div className="h-full bg-[#F1F5F9] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 rounded-full border border-slate-350 bg-slate-200 px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-slate-600 mb-8 sm:mb-12">
        🛡️ Privacy Promise
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "We do not track your clicks.",
          "We do not read your notes.",
          "Your data is yours alone.",
        ].map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-500/50 leading-tight tracking-tight">
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.65 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-800 leading-none tracking-tighter">
        Zero servers. Zero trackers.
      </motion.p>
    </div>
  );
}

/* Slide 2: Plain English Summary */
function SlideSummary() {
  return (
    <div className="h-full bg-[#E2E8F0] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-500 mb-3">
            layman terms
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 leading-tight tracking-tight">
            Our privacy rules, explained simply.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[
            { icon: Shield, title: "100% On-Device", body: "All your tasks, voice clips, geofence coordinates, and schedules are stored locally inside a private database on your phone. Nothing leaves." },
            { icon: FolderOpen, title: "Your Drive Sync", body: "When you back up your tasks, they go straight to your own personal Google Drive storage space. We do not host any of your backups." },
            { icon: AlertCircle, title: "No Hidden Trackers", body: "No Google Analytics, Facebook SDKs, or background telemetry profiles. We don't analyze how you use the app." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white border-3 border-slate-700 rounded-[2rem] p-6 sm:p-8 shadow-[5px_5px_0px_0px_rgba(30,41,59,0.15)] text-left flex flex-col gap-3">
              <Icon className="size-8 text-slate-600 shrink-0" />
              <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-800">{title}</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-600/80 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Full Legal Document Viewer */
function SlideLegalDoc() {
  return (
    <div className="h-full bg-[#F1F5F9] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-6 max-w-4xl h-[76vh]">
        <div className="text-center">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-500">
            For compliance
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
            Official Privacy Policy
          </h2>
        </div>

        {/* Scrollable document box */}
        <div className="flex-1 w-full border-3 border-slate-800 bg-white rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(30,41,59,0.15)] overflow-y-auto text-left">
          <div className="space-y-6 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
            <p className="font-bold text-slate-900 border-b-2 border-dashed border-slate-200 pb-4">
              This Privacy Policy describes how MinDrop ("MinDrop", "we", "us", "our") collects, uses, discloses, retains, and protects personal data when you use the MinDrop mobile application. DPDP Act, 2023 Compliant. Last updated: {LAST_UPDATED}.
            </p>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">1. Scope</h3>
              <p>This Policy applies strictly to the MinDrop application. MinDrop acts as a data fiduciary on-device. It does not apply to any third-party services you choose to connect (like Google Drive), which are governed by their respective owners.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">2. Data Storage & Architecture</h3>
              <p>Your notes, lists, voice recordings, pictures, and coordinates are saved inside a sandboxed SQLite database configuration. This data never travels across a server unless you trigger manual backup sync mechanisms directly into your authorized Google Drive.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">3. Required Permissions</h3>
              <p>To run offline, MinDrop requests: (a) Notification Listener Access to scan for filter rules, (b) Background Location access to monitor geofences, and (c) Battery optimization exclusions to avoid background CPU execution locks. These run locally on-device.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">4. Contact Information</h3>
              <p>For any queries about DPDP Act compliance or your data rights, contact us at security@getmindrop.app.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN — Full-Page Fade Scroll Controller
══════════════════════════════════════════════ */
function Privacy() {
  const { data: s } = useSuspenseQuery(settingsQuery());
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const lastScrollTime = useRef(0);

  const slides = [
    <SlideOpening />,
    <SlideSummary />,
    <SlideLegalDoc />,
  ];
  const TOTAL = slides.length;

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= TOTAL) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 850) return;
    lastScrollTime.current = now;
    setCurrent(idx);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      // Allow scrolling inside the legal document scrollbox
      const isScrollDoc = (e.target as HTMLElement).closest(".overflow-y-auto");
      if (isScrollDoc) return;

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
      style={{ viewTransitionName: "card-privacy" } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <header className="shrink-0 border-b-2 border-slate-300/40 z-50 bg-[#F1F5F9]/95 backdrop-blur-[12px]">
        <div className="w-[95%] mx-auto h-14 flex items-center justify-between">
          <Link to="/" viewTransition
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition text-slate-500 hover:text-slate-900">
            <X className="size-3.5"/> Close
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-7 relative grid place-items-center shrink-0">
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-slate-400/30" />
              <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="size-5 rounded-md bg-gradient-to-tr from-slate-500 to-slate-200 grid place-items-center relative">
                <span className="text-white font-black text-[9px]">m</span>
              </motion.div>
            </div>
            <span className="text-xs font-black uppercase tracking-wider hidden sm:block text-slate-550">MinDrop</span>
          </div>
          <Link to="/download"
            className="text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-xl border-2 bg-ink text-white border-ink hover:bg-slate-700 hover:border-slate-700 transition">
            Get App
          </Link>
        </div>
      </header>

      {/* ── Slide Stage ── */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => {
          // Allow swiping inside inner document scrollbox
          const isScrollDoc = (e.target as HTMLElement).closest(".overflow-y-auto");
          if (isScrollDoc) return;

          const delta = touchStartY.current - e.changedTouches[0].clientY;
          if (Math.abs(delta) > 50) {
            if (delta > 0) goTo(current + 1);
            else goTo(current - 1);
          }
        }}
      >
        {/* ── Top hint (Scroll Up) ── */}
        {current > 0 && (
          <button
            onClick={() => goTo(current - 1)}
            className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 z-20 cursor-pointer group text-slate-400 hover:text-slate-800"
          >
            <ChevronDown className="size-3.5 rotate-180 transition group-hover:-translate-y-0.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              scroll or ↑
            </span>
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

        {/* ── Bottom hint (Scroll Down) ── */}
        {current < TOTAL - 1 && (
          <button
            onClick={() => goTo(current + 1)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 z-20 cursor-pointer group text-slate-400 hover:text-slate-800"
          >
            <span className="text-[9px] font-black uppercase tracking-widest">
              scroll or ↓
            </span>
            <ChevronDown className="size-3.5 transition group-hover:translate-y-0.5" />
          </button>
        )}

        {/* ── Right Dot Navigation ── */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-30">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "w-1.5 h-7 bg-slate-600"
                  : "size-1.5 bg-slate-400/25 hover:bg-slate-400/50"
              }`}
            />
          ))}
          <p className="text-[9px] font-black mt-1 tabular-nums text-slate-400">
            {current + 1}/{TOTAL}
          </p>
        </div>
      </div>
    </div>
  );
}
