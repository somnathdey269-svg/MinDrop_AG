import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlarmClock, Check, X, Volume2, RotateCcw, Bell,
  MapPin, Pill, Phone, Flame, ChevronDown, ArrowRight
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

/* ─── Utility: fade-in-up on scroll ─── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Notification Badge (gets swiped away) ─── */
function SwipeAwayDemo() {
  const [phase, setPhase] = useState<"idle" | "show" | "swiped" | "done">("idle");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase("show"), 600);
    const t2 = setTimeout(() => setPhase("swiped"), 2200);
    const t3 = setTimeout(() => setPhase("done"), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [inView]);

  return (
    <div ref={ref} className="relative h-28 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {phase === "show" || phase === "swiped" ? (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 320 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="flex items-center gap-3 bg-white border-2 border-ink/10 shadow-xl rounded-2xl px-5 py-3 min-w-[260px]"
          >
            <div className="size-10 rounded-xl bg-[#FF671F]/10 grid place-items-center shrink-0">
              <Bell className="size-5 text-[#FF671F]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-ink">MinDrop Reminder</p>
              <p className="text-xs font-semibold text-ink/50">Take evening medication · now</p>
            </div>
            <div className="ml-auto text-[10px] text-ink/30 font-bold">now</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {phase === "done" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-black text-ink/30 uppercase tracking-widest"
        >
          Gone. Forgotten.
        </motion.p>
      )}
    </div>
  );
}

/* ─── Interactive Alarm Playground ─── */
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
    <div className="w-full flex flex-col items-center gap-6">
      {/* Phone Shell */}
      <div className="w-64 bg-ink rounded-[2.5rem] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        <div className="bg-[#0D0D0D] rounded-[2rem] overflow-hidden min-h-[420px] flex flex-col relative">
          {/* Phone status bar */}
          <div className="flex justify-between items-center px-5 pt-4 pb-2">
            <span className="text-[10px] text-white/40 font-black">9:41</span>
            <div className="flex gap-1">
              <div className="w-3 h-1.5 bg-white/40 rounded-full" />
              <div className="w-3 h-1.5 bg-white/40 rounded-full" />
              <div className="w-3 h-1.5 bg-white/40 rounded-full" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">

            {state === "idle" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-5 text-center"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="size-16 bg-white/10 rounded-2xl grid place-items-center"
                >
                  <AlarmClock className="size-8 text-white/60" />
                </motion.div>
                <p className="text-white/40 text-xs font-bold leading-relaxed">
                  No pending alarms.<br />Set one to feel the difference.
                </p>
                <button
                  onClick={() => setState("ringing")}
                  className="px-6 py-2.5 bg-[#FF671F] text-white font-black text-xs uppercase tracking-wider rounded-xl active:scale-95 transition cursor-pointer"
                >
                  Trigger Alarm
                </button>
              </motion.div>
            )}

            {state === "ringing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-5 text-center w-full"
              >
                {/* Ripples */}
                <div className="relative size-20 grid place-items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 2.2, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full border border-[#FF671F]"
                    />
                  ))}
                  <motion.div
                    animate={{ rotate: [-8, 8, -8] }}
                    transition={{ duration: 0.12, repeat: Infinity }}
                    className="size-16 bg-[#FF671F] rounded-2xl grid place-items-center z-10 shadow-[0_0_30px_rgba(255,103,31,0.6)]"
                  >
                    <Volume2 className="size-8 text-white" />
                  </motion.div>
                </div>
                <div>
                  <p className="text-[#FF671F] text-[10px] font-black uppercase tracking-widest animate-pulse">Ringing</p>
                  <p className="text-white font-black text-sm mt-1">Take Evening Medication</p>
                  <p className="text-white/30 text-[10px] mt-0.5 font-semibold">Bypassing DND · Looping</p>
                </div>
                <div className="flex gap-2 w-full px-2">
                  <button
                    onClick={() => { setCountdown(8); setState("snoozed"); }}
                    className="flex-1 py-2 bg-white/10 text-white font-black text-[11px] uppercase tracking-wide rounded-xl cursor-pointer active:scale-95 transition"
                  >
                    Snooze
                  </button>
                  <button
                    onClick={() => setState("done")}
                    className="flex-1 py-2 bg-white text-[#0D0D0D] font-black text-[11px] uppercase tracking-wide rounded-xl cursor-pointer active:scale-95 transition"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            )}

            {state === "snoozed" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="size-16 bg-amber-500/20 rounded-2xl grid place-items-center"
                >
                  <RotateCcw className="size-8 text-amber-400" />
                </motion.div>
                <div>
                  <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest">Snoozed</p>
                  <p className="text-white font-black text-sm mt-1">Ringing again in {countdown}s</p>
                </div>
                <div className="w-full px-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 8, ease: "linear" }}
                    className="bg-amber-400 h-full rounded-full"
                  />
                </div>
                <p className="text-white/20 text-[10px] font-semibold">It will not let you forget.</p>
              </motion.div>
            )}

            {state === "done" && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div className="size-16 bg-emerald-500/20 rounded-full grid place-items-center">
                  <Check className="size-9 text-emerald-400 stroke-[3px]" />
                </div>
                <div>
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Cleared</p>
                  <p className="text-white font-black text-sm mt-1">Your mind can rest now.</p>
                </div>
                <button
                  onClick={reset}
                  className="text-white/30 text-[10px] font-bold underline cursor-pointer mt-2"
                >
                  Try again
                </button>
              </motion.div>
            )}
          </div>

          <div className="h-8 flex items-center justify-center">
            <div className="w-24 h-1 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>

      <p className="text-xs text-ink/30 font-bold uppercase tracking-widest text-center">Interactive · Try it yourself</p>
    </div>
  );
}

/* ─── Scenario Card ─── */
function ScenarioCard({ icon: Icon, title, scene, color }: {
  icon: React.ElementType; title: string; scene: string; color: string;
}) {
  return (
    <div className={`flex-shrink-0 w-64 sm:w-72 rounded-[2rem] border-3 border-ink p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${color} flex flex-col gap-4`}>
      <div className="size-12 bg-white border-2 border-ink rounded-xl grid place-items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <Icon className="size-6 text-ink" />
      </div>
      <div>
        <p className="text-xs font-black text-ink/50 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-base font-black text-ink leading-snug">{scene}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
function LaterDetailView() {
  const { from } = Route.useSearch();
  const backTo = "/";
  const backHash = from === "grid" ? "grid" : undefined;

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-ink font-sans overflow-x-hidden">
      
      {/* ── Sticky Nav ── */}
      <header className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link
            to={backTo}
            hash={backHash}
            viewTransition
            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-ink/50 hover:text-ink transition"
          >
            <X className="size-4" /> Close
          </Link>
          <div className="flex items-center gap-2">
            <span className="size-6 rounded-lg bg-[#FF671F] grid place-items-center">
              <span className="text-white font-black text-[10px]">m</span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-ink/60 hidden sm:block">MinDrop</span>
          </div>
          <Link
            to="/download"
            className="text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-xl bg-ink text-white border-2 border-ink hover:bg-[#FF671F] transition"
          >
            Get App
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════ */}
      {/* SECTION 1 — The Opening Scene         */}
      {/* ══════════════════════════════════════ */}
      <section
        className="min-h-[90vh] flex flex-col items-center justify-center text-center px-5 py-20 relative"
        style={{ viewTransitionName: 'card-later' } as React.CSSProperties}
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-[#E2F5EC] px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#10B981] mb-8"
        >
          ⏰ Looping Alarms
        </motion.span>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="text-2xl sm:text-3xl md:text-4xl font-black text-ink/40 max-w-3xl leading-relaxed tracking-tight"
        >
          It is 10:47 PM.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.9 }}
          className="text-2xl sm:text-3xl md:text-4xl font-black text-ink/40 max-w-3xl leading-relaxed tracking-tight mt-2"
        >
          Your reminder fired at 8:00 PM.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="text-2xl sm:text-3xl md:text-4xl font-black text-ink/40 max-w-3xl leading-relaxed tracking-tight mt-2"
        >
          You swiped it away while in a meeting.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.9 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ink max-w-3xl leading-tight tracking-tight mt-6"
        >
          You forgot your medication.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mt-14 flex flex-col items-center gap-2 text-ink/25"
        >
          <p className="text-xs font-black uppercase tracking-widest">There is a better way</p>
          <ChevronDown className="size-5 animate-bounce" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* SECTION 2 — The Villain               */}
      {/* ══════════════════════════════════════ */}
      <section className="bg-[#1A1A1A] text-white py-24 px-5">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-12">
          <FadeUp className="text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4">The problem with every other app</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight max-w-2xl">
              A banner lives for 3 seconds.<br />
              <span className="text-[#FF671F]">Your task lives in your head</span><br />
              for the rest of the night.
            </h2>
          </FadeUp>

          <FadeUp delay={0.1} className="w-full max-w-sm">
            <SwipeAwayDemo />
          </FadeUp>

          <FadeUp delay={0.15} className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl text-left">
            {[
              { n: "3s", label: "How long a push banner is visible before it fades." },
              { n: "68%", label: "Of reminders are swiped away without any action taken." },
              { n: "0", label: "Persistence. A standard notification does not come back." },
            ].map(({ n, label }) => (
              <div key={n} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-3xl font-black text-[#FF671F]">{n}</p>
                <p className="text-sm font-semibold text-white/50 mt-1 leading-relaxed">{label}</p>
              </div>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* SECTION 3 — The Reveal                */}
      {/* ══════════════════════════════════════ */}
      <section className="py-24 px-5 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-10 text-center">
          <FadeUp>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#10B981] mb-4">How MinDrop is different</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink leading-tight max-w-3xl">
              MinDrop refuses to be ignored.<br />
              <span className="text-[#10B981]">Like an incoming call</span> from someone who matters.
            </h2>
          </FadeUp>

          <FadeUp delay={0.1} className="max-w-2xl">
            <p className="text-lg sm:text-xl font-semibold text-ink/60 leading-relaxed">
              Instead of a silent banner, MinDrop rings your phone with a looping ringtone — the kind you cannot ignore — until you actively choose to snooze or check it off. Not a nudge. A firm, friendly insistence.
            </p>
          </FadeUp>

          {/* Three pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-4">
            {[
              { icon: "📳", title: "Loops Like a Call", body: "The ringtone plays on repeat, just like when someone calls you on your phone. You cannot miss it." },
              { icon: "🛡️", title: "Bypasses DND", body: "When you mark a task as urgent, it breaks through Silent and Do Not Disturb profiles to reach you." },
              { icon: "🔄", title: "Survives Restarts", body: "Even if your phone dies or restarts, your alarms are restored automatically on boot. Nothing is lost." },
            ].map(({ icon, title, body }) => (
              <FadeUp key={title} className="bg-white border-3 border-ink rounded-[2rem] p-7 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-3">
                <span className="text-3xl">{icon}</span>
                <h3 className="text-lg font-black text-ink">{title}</h3>
                <p className="text-sm font-semibold text-ink/60 leading-relaxed">{body}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* SECTION 4 — Playground                */}
      {/* ══════════════════════════════════════ */}
      <section className="py-24 px-5 bg-[#E2F5EC]">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-left">
            <FadeUp>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#10B981] mb-4">Feel it before you download</p>
              <h2 className="text-3xl sm:text-4xl font-black text-ink leading-tight mb-5">
                Your phone just became unforgettable.
              </h2>
              <p className="text-lg font-semibold text-ink/60 leading-relaxed mb-7">
                Trigger a live alarm right here. Feel what it means for something to actually fight for your attention — and then let go the moment you say so.
              </p>
              <ul className="space-y-3">
                {[
                  "Tap Trigger Alarm to start the loop.",
                  "Snooze it — watch it count down and ring again.",
                  "Dismiss it when you are ready. That's it.",
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="size-6 rounded-full bg-[#10B981] text-white grid place-items-center shrink-0 text-[11px] font-black mt-0.5">{i + 1}</div>
                    <p className="text-sm font-bold text-ink/70 leading-relaxed">{s}</p>
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

      {/* ══════════════════════════════════════ */}
      {/* SECTION 5 — How It Works (Trust)      */}
      {/* ══════════════════════════════════════ */}
      <section className="py-24 px-5 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-widest text-ink/30 mb-4">Under the surface</p>
            <h2 className="text-3xl sm:text-4xl font-black text-ink leading-tight max-w-2xl mx-auto">
              Everything happens on your phone. Nothing leaves it.
            </h2>
          </FadeUp>

          {/* Step flow */}
          <div className="flex flex-col gap-0">
            {[
              { step: "01", title: "You write a task and set a time.", detail: "Give the task a name, attach a voice memo or photo if you need context, and pick a time. That's all you need to do.", color: "bg-[#FFF7ED]" },
              { step: "02", title: "Your phone's own scheduler locks it in.", detail: "MinDrop does not rely on a cloud server to fire your alarm. It talks directly to your device's native alarm system — the same one that wakes you up in the morning.", color: "bg-[#EEFDF7]" },
              { step: "03", title: "At the exact time, the loop begins.", detail: "A foreground service wakes up and starts playing your chosen ringtone on a loop. It holds the phone's screen, bypasses audio profiles, and waits for you.", color: "bg-[#FFF7ED]" },
              { step: "04", title: "You snooze or check it off. Done.", detail: "Snooze gives you a few more minutes. Checking it off marks the task complete and silences the alarm immediately. The loop stops only when you decide.", color: "bg-[#EEFDF7]" },
            ].map(({ step, title, detail, color }, i) => (
              <FadeUp key={step} delay={i * 0.08}>
                <div className={`flex flex-col sm:flex-row gap-6 items-start p-8 border-x-3 border-t-3 border-ink ${i === 3 ? "border-b-3 rounded-b-[2rem]" : ""} ${i === 0 ? "rounded-t-[2rem]" : ""} ${color} shadow-none`}>
                  <div className="shrink-0">
                    <span className="text-4xl font-black text-ink/10">{step}</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-ink mb-2">{title}</h3>
                    <p className="text-base font-semibold text-ink/55 leading-relaxed">{detail}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* SECTION 6 — Real Scenarios            */}
      {/* ══════════════════════════════════════ */}
      <section className="py-24 bg-[#1A1A1A] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center px-5 mb-12">
            <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4">Moments MinDrop is built for</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight max-w-2xl mx-auto">
              You will recognise yourself in at least one of these.
            </h2>
          </FadeUp>

          {/* Horizontal Scroll Row */}
          <div className="flex gap-5 overflow-x-auto px-5 pb-4 no-scrollbar snap-x snap-mandatory">
            {[
              { icon: Pill, title: "The Evening Ritual", scene: "Your medication has to be taken at the same time every night. Not approximately. Exactly.", color: "bg-[#FFF7ED]" },
              { icon: Phone, title: "The Call You Cannot Miss", scene: "Your mother calls every Sunday at 7 PM. You keep forgetting to call her first.", color: "bg-[#EFF6FF]" },
              { icon: Flame, title: "Before You Leave", scene: "The gas. The iron. The door. You always remember halfway down the street.", color: "bg-[#FEF2F2]" },
              { icon: MapPin, title: "The Post-Meeting Task", scene: "Your manager asked you to send a follow-up email within 2 hours. The meeting just ended.", color: "bg-[#F0FDF4]" },
              { icon: Bell, title: "The Deadline That Bites", scene: "The last date to submit that form is today. You have been saying 'I'll do it later' since Monday.", color: "bg-[#FAF5FF]" },
            ].map(({ icon, title, scene, color }) => (
              <div key={title} className="snap-start shrink-0 w-64 sm:w-72">
                <ScenarioCard icon={icon} title={title} scene={scene} color={color} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ */}
      {/* SECTION 7 — The Closer               */}
      {/* ══════════════════════════════════════ */}
      <section className="py-32 px-5 bg-[#FAFAF8] text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
          <FadeUp>
            <p className="text-[11px] font-black uppercase tracking-widest text-ink/30 mb-6">The last reminder app you will download</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-ink leading-tight">
              You have been carrying too much in your head.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-xl font-semibold text-ink/50 max-w-xl leading-relaxed">
              MinDrop was built so your brain can finally let go of the small things — the pills, the calls, the tasks — and trust that something reliable will hold them for you.
            </p>
          </FadeUp>
          <FadeUp delay={0.2} className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              to="/download"
              className="px-10 py-4 bg-ink text-white font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF671F] hover:border-[#FF671F] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
            >
              Download MinDrop Free
            </Link>
            <Link
              to="/"
              hash={backHash}
              viewTransition
              className="px-10 py-4 bg-white text-ink font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
            >
              See All Features
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t-3 border-ink bg-[#F1F5F9] py-6 px-5">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-ink/30">MinDrop · India · Offline Engine</span>
          <div className="flex gap-5">
            <Link to="/privacy" className="text-xs font-black text-ink/40 hover:text-ink transition">Privacy</Link>
            <Link to="/terms" className="text-xs font-black text-ink/40 hover:text-ink transition">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
