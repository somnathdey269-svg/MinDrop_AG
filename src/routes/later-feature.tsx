import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlarmClock, Check, X, Volume2, RotateCcw, Bell,
  MapPin, Pill, Phone, Flame, ChevronDown
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/later-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "Looping Alarms — MinDrop" },
      { name: "description", content: "MinDrop rings a looping alarm until you check off the task. No more silent banners. No more forgotten things." },
    ],
  }),
  component: LaterDetailView,
});

/* ─── Fade-in-up on scroll ─── */
function FadeUp({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Swipe-away banner demo ─── */
function SwipeAwayDemo() {
  const [phase, setPhase] = useState<"idle" | "show" | "swiped" | "done">("idle");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase("show"), 700);
    const t2 = setTimeout(() => setPhase("swiped"), 2400);
    const t3 = setTimeout(() => setPhase("done"), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [inView]);

  return (
    <div ref={ref} className="relative h-24 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {(phase === "show" || phase === "swiped") && (
          <motion.div
            initial={{ opacity: 0, y: -28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 340 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="flex items-center gap-3 bg-white border border-black/10 shadow-xl rounded-2xl px-4 py-3 w-[280px] sm:w-[320px]"
          >
            <div className="size-10 rounded-xl bg-[#FF671F]/10 grid place-items-center shrink-0">
              <Bell className="size-5 text-[#FF671F]" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-black text-black truncate">MinDrop Reminder</p>
              <p className="text-xs font-semibold text-black/40 truncate">Take evening medication · now</p>
            </div>
            <div className="text-[10px] text-black/20 font-bold shrink-0">now</div>
          </motion.div>
        )}
      </AnimatePresence>
      {phase === "done" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-black text-white/30 uppercase tracking-widest"
        >
          Gone. Forgotten.
        </motion.p>
      )}
    </div>
  );
}

/* ─── Phone Simulator ─── */
function AlarmPlayground() {
  const [state, setState] = useState<"idle" | "ringing" | "snoozed" | "done">("idle");
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (state !== "snoozed") return;
    const t = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) { setState("ringing"); return 8; }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [state]);

  const reset = () => { setState("idle"); setCountdown(8); };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Phone shell */}
      <div className="w-56 sm:w-64 bg-black rounded-[2.5rem] p-2.5 shadow-[0_24px_64px_rgba(0,0,0,0.3)]">
        <div className="bg-[#0D0D0D] rounded-[2rem] overflow-hidden min-h-[380px] sm:min-h-[420px] flex flex-col relative">
          {/* Status bar */}
          <div className="flex justify-between items-center px-5 pt-4 pb-2">
            <span className="text-[9px] text-white/30 font-black">9:41</span>
            <div className="flex gap-1">
              {[0,1,2].map(i => <div key={i} className="w-3 h-1.5 bg-white/20 rounded-full" />)}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">

            {state === "idle" && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-5 text-center">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
                  className="size-16 bg-white/8 rounded-2xl grid place-items-center">
                  <AlarmClock className="size-8 text-white/40" />
                </motion.div>
                <p className="text-white/30 text-xs font-semibold leading-relaxed">
                  Press the button to see<br />what MinDrop feels like.
                </p>
                <button onClick={() => setState("ringing")}
                  className="px-6 py-2.5 bg-[#FF671F] text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition">
                  Start Alarm
                </button>
              </motion.div>
            )}

            {state === "ringing" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 text-center w-full">
                <div className="relative size-20 grid place-items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i}
                      animate={{ scale: [1, 2.4, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full border border-[#FF671F]" />
                  ))}
                  <motion.div animate={{ rotate: [-7, 7, -7] }}
                    transition={{ duration: 0.12, repeat: Infinity }}
                    className="size-16 bg-[#FF671F] rounded-2xl grid place-items-center z-10 shadow-[0_0_28px_rgba(255,103,31,0.5)]">
                    <Volume2 className="size-8 text-white" />
                  </motion.div>
                </div>
                <div>
                  <p className="text-[#FF671F] text-[10px] font-black uppercase tracking-widest animate-pulse">Ringing now</p>
                  <p className="text-white font-black text-sm mt-1">Take Evening Medication</p>
                  <p className="text-white/25 text-[10px] mt-0.5 font-semibold">Bypassing Silent mode · Looping</p>
                </div>
                <div className="flex gap-2 w-full px-2">
                  <button onClick={() => { setCountdown(8); setState("snoozed"); }}
                    className="flex-1 py-2 bg-white/10 text-white font-black text-[11px] uppercase tracking-wide rounded-xl cursor-pointer active:scale-95 transition">
                    Snooze
                  </button>
                  <button onClick={() => setState("done")}
                    className="flex-1 py-2 bg-white text-black font-black text-[11px] uppercase tracking-wide rounded-xl cursor-pointer active:scale-95 transition">
                    Done
                  </button>
                </div>
              </motion.div>
            )}

            {state === "snoozed" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 text-center">
                <motion.div animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="size-16 bg-amber-500/15 rounded-2xl grid place-items-center">
                  <RotateCcw className="size-8 text-amber-400" />
                </motion.div>
                <div>
                  <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest">Snoozed</p>
                  <p className="text-white font-black text-sm mt-1">Ringing again in {countdown}s</p>
                </div>
                <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: "100%" }} animate={{ width: "0%" }}
                    transition={{ duration: 8, ease: "linear" }}
                    className="bg-amber-400 h-full rounded-full" />
                </div>
                <p className="text-white/20 text-[10px] font-semibold">It will not let you forget.</p>
              </motion.div>
            )}

            {state === "done" && (
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4 text-center">
                <div className="size-16 bg-emerald-500/15 rounded-full grid place-items-center">
                  <Check className="size-9 text-emerald-400 stroke-[3px]" />
                </div>
                <div>
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Done!</p>
                  <p className="text-white font-black text-sm mt-1">Your mind can rest now.</p>
                </div>
                <button onClick={reset} className="text-white/25 text-[10px] font-bold underline cursor-pointer mt-1">
                  Try again
                </button>
              </motion.div>
            )}
          </div>

          <div className="h-7 flex items-center justify-center">
            <div className="w-20 h-1 bg-white/15 rounded-full" />
          </div>
        </div>
      </div>
      <p className="text-xs text-ink/25 font-bold uppercase tracking-widest text-center">Try it yourself — it is live</p>
    </div>
  );
}

/* ─── Scenario Card ─── */
function ScenarioCard({ icon: Icon, title, scene, color }: {
  icon: React.ElementType; title: string; scene: string; color: string;
}) {
  return (
    <div className={`flex-shrink-0 w-60 sm:w-68 rounded-[1.75rem] border-3 border-ink p-5 sm:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${color} flex flex-col gap-3`}>
      <div className="size-11 bg-white border-2 border-ink rounded-xl grid place-items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <Icon className="size-5 text-ink" />
      </div>
      <div>
        <p className="text-[10px] font-black text-ink/40 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-sm sm:text-base font-black text-ink leading-snug">{scene}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
function LaterDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-ink font-sans overflow-x-hidden">

      {/* ── Sticky Nav (same feel as home page, full-width with p-6) ── */}
      <header className="sticky top-0 z-50 bg-[#FAFAF8]/92 backdrop-blur-md border-b-2 border-ink/8">
        <div className="w-[95%] mx-auto h-14 flex items-center justify-between">
          <Link to="/" hash={backHash} viewTransition
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-ink/50 hover:text-ink transition">
            <X className="size-3.5" /> Close
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-7 relative grid place-items-center shrink-0">
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-[#FF671F]/30" />
              <motion.div animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="size-5 rounded-md bg-gradient-to-tr from-[#FF671F] to-[#FFA06E] grid place-items-center relative">
                <span className="text-white font-black text-[9px]">m</span>
              </motion.div>
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-ink/60 hidden sm:block">MinDrop</span>
          </div>
          <Link to="/download"
            className="text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-xl bg-ink text-white border-2 border-ink hover:bg-[#FF671F] hover:border-[#FF671F] transition">
            Get App
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          SECTION 1 — Opening Scene
      ══════════════════════════════════════════ */}
      <section
        className="min-h-[90vh] flex flex-col items-center justify-center text-center py-16 sm:py-24"
        style={{ viewTransitionName: 'card-later' } as React.CSSProperties}
      >
        <div className="w-[95%] mx-auto flex flex-col items-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-[#E2F5EC] px-4 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#10B981] mb-8 sm:mb-10">
            ⏰ Looping Alarms
          </motion.span>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ink/35 leading-relaxed tracking-tight">
            It is 10:47 PM.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ink/35 leading-relaxed tracking-tight mt-1 sm:mt-2">
            Your reminder went off at 8:00 PM.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ink/35 leading-relaxed tracking-tight mt-1 sm:mt-2">
            You tapped it away during a call.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-ink leading-tight tracking-tight mt-5 sm:mt-7">
            You forgot your medication.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 2.1 }}
            className="mt-12 sm:mt-16 flex flex-col items-center gap-2 text-ink/20">
            <p className="text-[10px] font-black uppercase tracking-widest">There is a better way</p>
            <ChevronDown className="size-5 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — The Problem
      ══════════════════════════════════════════ */}
      <section className="bg-[#1A1A1A] text-white py-16 sm:py-24">
        <div className="w-[95%] mx-auto flex flex-col items-center gap-10 sm:gap-14">
          <FadeUp className="text-center max-w-2xl">
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/25 mb-4">
              Why your current reminder apps keep failing you
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              A normal alert disappears in 3 seconds.<br />
              <span className="text-[#FF671F]">Your task sits in your head</span><br />
              all night long.
            </h2>
          </FadeUp>

          <FadeUp delay={0.1} className="w-full max-w-sm">
            <SwipeAwayDemo />
          </FadeUp>

          {/* Stats row */}
          <FadeUp delay={0.15} className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            {[
              { n: "3s", label: "How long a normal alert stays visible before it fades away on its own." },
              { n: "68%", label: "Of app reminders get tapped away without the person doing anything." },
              { n: "0", label: "Times a normal alert comes back to remind you if you missed it." },
            ].map(({ n, label }) => (
              <div key={n} className="bg-white/5 border border-white/8 rounded-2xl p-5 sm:p-6">
                <p className="text-3xl sm:text-4xl font-black text-[#FF671F]">{n}</p>
                <p className="text-sm font-semibold text-white/45 mt-2 leading-relaxed">{label}</p>
              </div>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — The MinDrop Difference
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#FAFAF8]">
        <div className="w-[95%] mx-auto flex flex-col items-center gap-10 sm:gap-14 text-center">
          <FadeUp className="max-w-3xl">
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#10B981] mb-4">
              What makes MinDrop different
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-ink leading-tight">
              MinDrop keeps ringing until you act.<br />
              <span className="text-[#10B981]">Just like a phone call</span> from someone important.
            </h2>
          </FadeUp>

          <FadeUp delay={0.08} className="max-w-2xl">
            <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/55 leading-relaxed">
              Instead of a banner you can ignore, MinDrop rings your phone over and over — like when your mum calls and you do not pick up. It stops only when you say so.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 w-full mt-2">
            {[
              { icon: "📳", title: "Rings Like a Phone Call", body: "The sound plays again and again, just like a normal phone call. You will hear it no matter what you are doing." },
              { icon: "🛡️", title: "Works Even in Silent Mode", body: "Set a task as urgent and MinDrop will ring through Silent and Do Not Disturb. No more missed alarms." },
              { icon: "🔄", title: "Comes Back After Restart", body: "Even if your phone runs out of battery or shuts down, your alarms come back on their own when it turns on again." },
            ].map(({ icon, title, body }) => (
              <FadeUp key={title}>
                <div className="bg-white border-3 border-ink rounded-[1.75rem] p-6 sm:p-7 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-3 h-full">
                  <span className="text-3xl">{icon}</span>
                  <h3 className="text-base sm:text-lg font-black text-ink">{title}</h3>
                  <p className="text-sm font-semibold text-ink/55 leading-relaxed">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — Interactive Playground
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#E2F5EC]">
        <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-left w-full">
            <FadeUp>
              <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#10B981] mb-4">
                Try it before you download
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink leading-tight mb-4 sm:mb-5">
                Feel it for yourself, right now.
              </h2>
              <p className="text-base sm:text-lg font-semibold text-ink/55 leading-relaxed mb-6 sm:mb-8 max-w-lg">
                Press the button below to start a fake alarm. Snooze it and watch it come back. Dismiss it when you are ready. This is exactly what it feels like on your phone.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  "Press Start Alarm to hear it ring.",
                  "Snooze it — watch it count down and ring again.",
                  "Press Done when you are ready. That stops it.",
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="size-6 rounded-full bg-[#10B981] text-white grid place-items-center shrink-0 text-[11px] font-black mt-0.5">{i + 1}</div>
                    <p className="text-sm sm:text-base font-bold text-ink/65 leading-relaxed">{s}</p>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>

          <FadeUp delay={0.1} className="shrink-0 w-full lg:w-auto flex justify-center">
            <AlarmPlayground />
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — How It Works
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#FAFAF8]">
        <div className="w-[95%] mx-auto">
          <FadeUp className="text-center mb-10 sm:mb-14">
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-ink/25 mb-4">
              How it works, step by step
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink leading-tight max-w-2xl mx-auto">
              Simple to set up.<br />Impossible to ignore.
            </h2>
          </FadeUp>

          {/* Step panels */}
          <div className="flex flex-col w-full">
            {[
              {
                step: "01", title: "You write a task and pick a time.",
                detail: "Give it a name, add a photo or voice note if you want, then set a time. That is it. Takes about 10 seconds.",
                color: "bg-[#FFF7ED]",
              },
              {
                step: "02", title: "Your phone keeps it safe in the background.",
                detail: "MinDrop does not need a server to ring you. It tells your phone's own alarm system directly — the same system that wakes you up every morning.",
                color: "bg-[#EEFDF7]",
              },
              {
                step: "03", title: "At the exact time, the alarm starts ringing.",
                detail: "The phone lights up and the ringtone plays on repeat. It stays there, ringing, until you do something about it. It will not go away on its own.",
                color: "bg-[#FFF7ED]",
              },
              {
                step: "04", title: "You snooze or mark it done. That is all.",
                detail: "Snooze gives you a few more minutes. Marking it done stops the alarm and clears the task. You are in control of when it stops, not the app.",
                color: "bg-[#EEFDF7]",
              },
            ].map(({ step, title, detail, color }, i, arr) => (
              <FadeUp key={step} delay={i * 0.06}>
                <div className={`
                  flex flex-col sm:flex-row gap-5 sm:gap-8 items-start p-6 sm:p-8 md:p-10 border-x-3 border-t-3 border-ink
                  ${i === 0 ? "rounded-t-[2rem]" : ""}
                  ${i === arr.length - 1 ? "border-b-3 rounded-b-[2rem]" : ""}
                  ${color}
                `}>
                  <span className="text-4xl sm:text-5xl font-black text-ink/10 shrink-0">{step}</span>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-ink mb-2">{title}</h3>
                    <p className="text-sm sm:text-base font-semibold text-ink/50 leading-relaxed">{detail}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6 — Real Scenarios
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#1A1A1A] overflow-hidden">
        <div className="w-[95%] mx-auto mb-10 sm:mb-14 text-center">
          <FadeUp>
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/25 mb-4">
              Real moments where MinDrop helps
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight max-w-2xl mx-auto">
              You will see yourself in at least one of these.
            </h2>
          </FadeUp>
        </div>

        {/* Horizontal scroll row — bleeds edge to edge */}
        <div className="flex gap-4 sm:gap-5 overflow-x-auto pl-[2.5%] pr-[2.5%] pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}>
          {[
            { icon: Pill, title: "The Evening Ritual", scene: "You take a tablet every night at the same time. No exceptions. It cannot wait until you remember.", color: "bg-[#FFF7ED]" },
            { icon: Phone, title: "The Call You Keep Delaying", scene: "You told yourself you would call your mum back after dinner. That was two hours ago.", color: "bg-[#EFF6FF]" },
            { icon: Flame, title: "Before You Leave the House", scene: "Did you turn the gas off? Lock the door? You always wonder once you are halfway down the road.", color: "bg-[#FEF2F2]" },
            { icon: MapPin, title: "The After-Meeting Task", scene: "Your manager asked you to send a follow-up note within 2 hours. The meeting just ended.", color: "bg-[#F0FDF4]" },
            { icon: Bell, title: "The Deadline You Kept Pushing", scene: "The last date to submit that form is today. You have been saying tomorrow since last week.", color: "bg-[#FAF5FF]" },
          ].map(({ icon, title, scene, color }) => (
            <div key={title} className="snap-start shrink-0">
              <ScenarioCard icon={icon} title={title} scene={scene} color={color} />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 7 — The Closer
      ══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-[#FAFAF8] text-center">
        <div className="w-[95%] mx-auto flex flex-col items-center gap-7 sm:gap-8">
          <FadeUp>
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-ink/25 mb-4 sm:mb-6">
              The last reminder app you will ever need
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-tight max-w-3xl mx-auto">
              You have been remembering too much on your own.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1} className="max-w-xl">
            <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/45 leading-relaxed">
              MinDrop was built so your brain can let go — your pills, your calls, your tasks, your deadlines. Hand them over. We will make sure you never miss them.
            </p>
          </FadeUp>
          <FadeUp delay={0.18} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto">
            <Link to="/download"
              className="px-8 sm:px-10 py-4 bg-ink text-white font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF671F] hover:border-[#FF671F] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
              Download MinDrop — It's Free
            </Link>
            <Link to="/" hash={backHash} viewTransition
              className="px-8 sm:px-10 py-4 bg-white text-ink font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
              See All Features
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t-2 border-ink/10 bg-[#F1F5F9] py-5 sm:py-6">
        <div className="w-[95%] mx-auto flex flex-wrap justify-between items-center gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-ink/25">MinDrop · India · Offline</span>
          <div className="flex gap-4 sm:gap-5">
            <Link to="/privacy" className="text-xs font-black text-ink/35 hover:text-ink transition">Privacy</Link>
            <Link to="/terms" className="text-xs font-black text-ink/35 hover:text-ink transition">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
