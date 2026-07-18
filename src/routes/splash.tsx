import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { useOnboarding } from "@/lib/memoryos/store";

export const Route = createFileRoute("/splash")({
  head: () => ({
    meta: [
      { title: "Welcome to MinDrop" },
      { name: "description", content: "A quiet second memory for the small things you'd rather not carry." },
      { property: "og:title", content: "Welcome to MinDrop" },
      { property: "og:description", content: "A quiet second memory for the small things you'd rather not carry." },
    ],
  }),
  component: Splash,
});

export const SPLASH_SHOWN_KEY = "mindrop.splash.shown.v1";

type Slide = {
  eyebrow: string;
  title: string;
  body: string;
  benefit?: string;
  accent: string;
  visual: "logo" | "later" | "notify" | "places" | "privacy" | "quote";
};

const slides: Slide[] = [
  {
    eyebrow: "Welcome to MinDrop",
    title: "Declutter your mind.",
    body: "MinDrop is a quiet second memory for the tiny tasks, reminders, and notes your brain shouldn't have to carry. Fast, offline, and beautiful.",
    accent: "#FF671F",
    visual: "logo",
  },
  {
    eyebrow: "Later Module",
    title: "Reminders that ring.",
    body: "Type a word, snap a photo, or record a voice note. MinDrop triggers a loud, persistent alarm at the exact minute you ask—even after a phone reboot.",
    benefit: "Get back the 20 minutes of sleep lost to midnight admin.",
    accent: "#10b981",
    visual: "later",
  },
  {
    eyebrow: "Notify Module",
    title: "Intelligent noise filters.",
    body: "Turn noisy phone notifications into alarms. Ring loud only for Slack messages from your boss, family contacts, or transaction alerts above ₹5,000.",
    benefit: "Stop scrolling your feed. The ones that matter will ring.",
    accent: "#f59e0b",
    visual: "notify",
  },
  {
    eyebrow: "Places Module",
    title: "Geo-targeted alerts.",
    body: "Get reminded exactly where it matters. Pick up meds when arriving at the pharmacy, or call your parents the moment you leave the office.",
    benefit: "The right thought at the right spot. Zero mental load.",
    accent: "#8b5cf6",
    visual: "places",
  },
  {
    eyebrow: "Privacy Standard",
    title: "100% private by default.",
    body: "Your reminders never leave your device. Zero servers, zero trackers. On Premium, sync goes directly to your private Google Drive—never ours.",
    benefit: "No ads. No analytics. No exceptions.",
    accent: "#64748b",
    visual: "privacy",
  },
  {
    eyebrow: "Letting Go",
    title: "Lighten the load.",
    body: "\"The palest ink is better than the sharpest memory.\"\n\nYou have carried enough today. Let MinDrop carry the rest.",
    accent: "#d97706",
    visual: "quote",
  },
];

function Visual({ kind, accent }: { kind: Slide["visual"]; accent: string }) {
  if (kind === "logo")
    return (
      <div className="mx-auto size-36 relative grid place-items-center">
        {/* concentric ripples */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-orange-500/20"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.05, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute inset-4 rounded-full border border-orange-500/30"
        />
        
        {/* Central logo */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="size-24 rounded-[2rem] bg-gradient-to-tr from-[#FF671F] to-[#FFA06E] shadow-lg shadow-[#FF671F]/30 grid place-items-center relative border border-white/20"
        >
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            className="text-white font-black text-4xl font-sans select-none"
          >
            m
          </motion.span>
        </motion.div>
      </div>
    );

  if (kind === "later")
    return (
      <div className="mx-auto w-52 h-36 relative grid place-items-center">
        <div className="absolute inset-0 rounded-3xl bg-emerald-500/[0.04] border border-emerald-500/10" />
        
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex items-center gap-3.5 px-4.5 py-3 rounded-2xl bg-white border border-ink/8 shadow-md"
        >
          <motion.div
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="size-12 rounded-xl bg-emerald-50 grid place-items-center text-emerald-600 border border-emerald-100"
          >
            <span style={{ fontSize: 24 }}>⏰</span>
          </motion.div>
          
          <div className="text-left">
            <motion.p 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="t-eyebrow text-emerald-600 font-bold"
            >
              Tomorrow
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="t-body-sm text-ink font-semibold mt-0.5"
            >
              08:30 · pay rent
            </motion.p>
          </div>
        </motion.div>
      </div>
    );

  if (kind === "notify")
    return (
      <div className="mx-auto w-56 h-36 relative overflow-hidden flex flex-col justify-center">
        <div className="absolute inset-0 rounded-3xl bg-amber-500/[0.04] border border-amber-500/15" />
        
        <div className="absolute inset-x-4 top-3 flex flex-col gap-2">
          <motion.div
            animate={{ y: [-10, -25], opacity: [0.6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="h-6 rounded-lg bg-white/70 border border-ink/5 flex items-center px-2 gap-2 scale-95"
          >
            <div className="size-2 rounded-full bg-ink/30" />
            <div className="h-1 rounded-full flex-1 bg-ink/20" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -15], opacity: [0.9, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="h-7 rounded-lg bg-white border border-ink/8 flex items-center px-2.5 gap-2 shadow-sm"
          >
            <div className="size-2.5 rounded-full bg-ink/40" />
            <div className="h-1 rounded-full flex-1 bg-ink/30" />
          </motion.div>
        </div>

        <motion.div
          animate={{ scale: [1, 1.03, 1], y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-x-4 bottom-3 h-11 rounded-2xl bg-gradient-to-r from-amber-500 to-[#FF8E53] text-white flex items-center justify-center gap-2 border border-white/10 shadow-lg shadow-amber-500/20 px-3"
        >
          <motion.span
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            style={{ fontSize: 16 }}
          >
            🔔
          </motion.span>
          <span className="t-meta font-bold text-white tracking-wide uppercase text-[10px]">High priority rule fired</span>
        </motion.div>
      </div>
    );

  if (kind === "places")
    return (
      <div className="mx-auto w-52 h-36 relative grid place-items-center">
        <div className="absolute inset-0 rounded-3xl bg-purple-500/[0.04] border border-purple-500/10" />
        
        <div className="absolute size-24">
          <motion.div
            animate={{ scale: [0.8, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-purple-500/30"
          />
          <motion.div
            animate={{ scale: [0.8, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1.25 }}
            className="absolute inset-0 rounded-full border border-purple-500/30"
          />
        </div>

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: [ -30, 0, -6, 0 ], opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="relative size-10 grid place-items-center text-purple-600 bg-purple-50 rounded-full border border-purple-100 shadow-md"
        >
          <span style={{ fontSize: 20 }}>📍</span>
        </motion.div>
      </div>
    );

  if (kind === "privacy")
    return (
      <div className="mx-auto w-52 h-36 relative grid place-items-center">
        <div className="absolute inset-0 rounded-3xl bg-slate-500/[0.04] border border-slate-500/10" />
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute size-24 rounded-full border border-dashed border-slate-400/30"
        />

        <motion.div
          animate={{ rotate: [0, -10, 0], scale: [0.95, 1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
          className="size-16 rounded-2xl bg-white border border-ink/8 shadow-md grid place-items-center relative"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              d="M9 12l2 2 4-4" 
              stroke="#FF671F"
            />
          </svg>
        </motion.div>
      </div>
    );

  // quote
  return (
    <div className="mx-auto w-52 h-36 relative grid place-items-center overflow-hidden">
      <div className="absolute inset-0 rounded-3xl bg-amber-500/[0.03] border border-amber-500/10" />
      
      <motion.span 
        animate={{ y: [0, -5, 0], x: [0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-6 top-4 opacity-[0.08] text-amber-900 font-serif text-[120px] select-none"
      >
        “
      </motion.span>
      
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="size-16 rounded-2xl bg-white border border-ink/8 shadow-md grid place-items-center"
      >
        <span className="text-amber-700 text-4xl font-serif">“</span>
      </motion.div>
    </div>
  );
}

function markSplashShown() {
  try { window.localStorage.setItem(SPLASH_SHOWN_KEY, "1"); } catch {}
}

function Splash() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const { update } = useOnboarding();
  const last = i === slides.length - 1;
  const s = slides[i];

  // Allow explicit "replay" via ?intro=1 — clear the seen flag on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("intro") === "1") {
      try { window.localStorage.removeItem(SPLASH_SHOWN_KEY); } catch {}
    }
  }, []);

  const finish = () => {
    markSplashShown();
    update({ onboarded: true });
    navigate({ to: "/dashboard" });
  };
  const next = () => { if (last) finish(); else setI(i + 1); };
  const back = () => i > 0 && setI(i - 1);
  const skip = () => finish();

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full p-5 sm:p-6 md:p-8 overflow-hidden bg-canvas">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1.5 flex-1">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: idx === i ? 40 : 12,
                  backgroundColor: idx === i ? s.accent : "rgba(0,0,0,0.1)"
                }}
              />
            ))}
          </div>
          {i > 0 && !last && (
            <button
              onClick={skip}
              className="t-eyebrow text-ink/50 px-2 py-1 cursor-pointer hover:text-ink transition-colors"
              aria-label="Skip intro"
            >
              Skip
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center max-w-sm mx-auto flex flex-col items-center"
            >
              {/* Visual Box */}
              <div className="mb-6 scale-90 sm:scale-100 w-full">
                <Visual kind={s.visual} accent={s.accent} />
              </div>

              {/* Eyebrow Animation */}
              <motion.p 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="t-eyebrow mb-2 font-bold tracking-wider"
                style={{ color: s.accent }}
              >
                {s.eyebrow}
              </motion.p>

              {/* Heading Animation */}
              <motion.h1 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="t-display mb-3 text-ink leading-tight"
              >
                {s.title}
              </motion.h1>

              {/* Body Text Animation */}
              <motion.p 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="t-body-sm text-ink/65 whitespace-pre-line leading-relaxed max-w-[280px]"
              >
                {s.body}
              </motion.p>

              {/* Benefit Label Animation */}
              {s.benefit && (
                <motion.p 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45, type: "spring", stiffness: 100 }}
                  className="t-meta mt-4.5 px-3 py-1.5 rounded-full border bg-white font-semibold text-[10px] uppercase tracking-wider"
                  style={{ color: s.accent, borderColor: s.accent + "33", backgroundColor: s.accent + "0a" }}
                >
                  {s.benefit}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 shrink-0 pt-3">
          {i > 0 && (
            <button
              onClick={back}
              className="t-button px-6 bg-white border border-ink/15 rounded-2xl text-ink/70 hover:bg-ink/[0.02] cursor-pointer transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={next}
            className="t-button flex-1 text-white py-4 rounded-2xl hover:opacity-95 cursor-pointer shadow-md select-none transition-all active:scale-[0.99]"
            style={{ backgroundColor: s.accent, boxShadow: `0 4px 14px ${s.accent}33` }}
          >
            {last ? "Begin" : "Next"}
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
