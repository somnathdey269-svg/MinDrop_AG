import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import {
  AlarmClock, Check, X, Volume2, RotateCcw, Bell,
  MapPin, Pill, Phone, Flame, ChevronDown, ChevronLeft, ChevronRight, Pencil
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/later-feature")({
  validateSearch: (search: Record<string, unknown>) => ({
    from: (search.from as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Looping Alarms — MinDrop" },
      { name: "description", content: "MinDrop rings a looping alarm until you check off the task. No more silent banners. No more forgotten things." },
    ],
  }),
  component: LaterDetailView,
});

/* ──────────────────────────────────────────────
   SUBTLE STEP ILLUSTRATIONS
────────────────────────────────────────────── */
function PencilNotepad() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <div className="absolute inset-0 border-3 border-ink bg-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)] p-5 flex flex-col gap-2.5 justify-center">
        <div className="h-2.5 w-16 bg-[#10B981]/25 rounded-full"/>
        <div className="h-2.5 w-24 bg-[#10B981]/15 rounded-full"/>
        <div className="h-2.5 w-20 bg-[#10B981]/15 rounded-full"/>
      </div>
      <motion.div
        animate={{ x: [-15, 15, -15], y: [-8, 8, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 right-4 text-[#10B981]"
      >
        <Pencil className="size-12 stroke-[2.5px]" />
      </motion.div>
    </div>
  );
}

function SafeBackground() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="size-20 sm:size-24 bg-[#D1FAE5] border-3 border-[#10B981] rounded-full grid place-items-center relative z-10 shadow-md"
      >
        <AlarmClock className="size-10 text-[#047857] stroke-[2px]" />
      </motion.div>
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 2.2], opacity: [0.35, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 1.0, ease: "easeOut" }}
          className="absolute size-24 border-2 border-[#10B981] rounded-full"
        />
      ))}
    </div>
  );
}

function RingingAlarmIcon() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ rotate: [-6, 6, -6], scale: [1, 1.05, 1] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatType: "reverse" }}
        className="size-20 sm:size-24 bg-[#10B981] border-3 border-ink rounded-3xl grid place-items-center z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)] text-white"
      >
        <Volume2 className="size-10 stroke-[2.5px]"/>
      </motion.div>
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 2.0], opacity: [0.4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6 }}
          className="absolute size-28 border border-[#10B981] rounded-full"
        />
      ))}
    </div>
  );
}

function DoneCheck() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ y: [-8, 0, -8] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="size-20 sm:size-24 bg-white border-3 border-[#10B981] rounded-full grid place-items-center shadow-lg relative z-10"
      >
        <Check className="size-12 text-[#10B981] stroke-[4px]"/>
      </motion.div>
      <motion.div
        animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-4 w-20 h-2 bg-ink/10 rounded-full blur-sm"
      />
    </div>
  );
}

/* ──────────────────────────────────────────────
   SHARED: Compact Alarm Playground
────────────────────────────────────────────── */
function AlarmPlayground() {
  const [state, setState] = useState<"idle" | "ringing" | "snoozed" | "done">("idle");
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (state !== "snoozed") return;
    const t = setInterval(() => {
      setCountdown(n => { if (n <= 1) { setState("ringing"); return 8; } return n - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [state]);

  const reset = () => { setState("idle"); setCountdown(8); };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-56 sm:w-64 md:w-72 bg-[#064E3B] rounded-[2.5rem] p-2.5 shadow-[0_20px_60px_rgba(4,120,87,0.3)] border-3 border-ink">
        <div className="bg-[#022C22] rounded-[2rem] overflow-hidden min-h-[320px] sm:min-h-[380px] flex flex-col">
          {/* Status bar */}
          <div className="flex justify-between items-center px-5 pt-3 pb-1.5">
            <span className="text-[10px] text-[#A7F3D0]/40 font-black">9:41</span>
            <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-2.5 h-1 bg-[#A7F3D0]/20 rounded-full"/>)}</div>
          </div>
          {/* Screen */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
            {state === "idle" && (
              <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="flex flex-col items-center gap-4 text-center">
                <motion.div animate={{y:[0,-5,0]}} transition={{duration:3,repeat:Infinity}} className="size-16 bg-[#A7F3D0]/10 rounded-xl grid place-items-center">
                  <AlarmClock className="size-8 text-[#A7F3D0]/30"/>
                </motion.div>
                <p className="text-[#A7F3D0]/30 text-xs font-semibold leading-relaxed">Press to feel<br/>what MinDrop does.</p>
                <button onClick={()=>setState("ringing")} className="px-5 py-2.5 bg-[#10B981] text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition">
                  Start Alarm
                </button>
              </motion.div>
            )}
            {state === "ringing" && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center gap-3.5 text-center w-full">
                <div className="relative size-18 grid place-items-center">
                  {[0,1,2].map(i=>(
                    <motion.div key={i} animate={{scale:[1,2.4,1],opacity:[0.4,0,0.4]}} transition={{duration:1.8,repeat:Infinity,delay:i*0.5}} className="absolute inset-0 rounded-full border border-[#10B981]"/>
                  ))}
                  <motion.div animate={{rotate:[-7,7,-7]}} transition={{duration:0.12,repeat:Infinity}} className="size-15 bg-[#10B981] rounded-xl grid place-items-center z-10 shadow-[0_0_24px_rgba(16,185,129,0.5)]">
                    <Volume2 className="size-7 text-white"/>
                  </motion.div>
                </div>
                <div>
                  <p className="text-[#10B981] text-[10px] font-black uppercase tracking-widest animate-pulse">Ringing now</p>
                  <p className="text-white font-black text-sm sm:text-base mt-1">Take Evening Medication</p>
                  <p className="text-[#A7F3D0]/40 text-[10px] mt-1">Bypassing Silent · Looping</p>
                </div>
                <div className="flex gap-2 w-full px-2">
                  <button onClick={()=>{setCountdown(8);setState("snoozed");}} className="flex-1 py-2 bg-white/10 text-white font-black text-xs uppercase rounded-xl cursor-pointer active:scale-95 transition">Snooze</button>
                  <button onClick={()=>setState("done")} className="flex-1 py-2 bg-white text-black font-black text-xs uppercase rounded-xl cursor-pointer active:scale-95 transition">Done</button>
                </div>
              </motion.div>
            )}
            {state === "snoozed" && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center gap-3.5 text-center">
                <motion.div animate={{rotate:360}} transition={{duration:3,repeat:Infinity,ease:"linear"}} className="size-16 bg-[#10B981]/15 rounded-xl grid place-items-center">
                  <RotateCcw className="size-7 text-[#10B981]"/>
                </motion.div>
                <div>
                  <p className="text-[#10B981] text-[10px] font-black uppercase tracking-widest">Snoozed</p>
                  <p className="text-white font-black text-sm sm:text-base mt-1">Ringing again in {countdown}s</p>
                </div>
                <div className="w-36 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{width:"100%"}} animate={{width:"0%"}} transition={{duration:8,ease:"linear"}} className="bg-[#10B981] h-full rounded-full"/>
                </div>
                <p className="text-[#A7F3D0]/20 text-[10px] font-semibold">It will not let you forget.</p>
              </motion.div>
            )}
            {state === "done" && (
              <motion.div initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} className="flex flex-col items-center gap-3.5 text-center">
                <div className="size-16 bg-[#10B981]/15 rounded-full grid place-items-center">
                  <Check className="size-10 text-[#10B981] stroke-[3px]"/>
                </div>
                <div>
                  <p className="text-[#10B981] text-[10px] font-black uppercase tracking-widest">Done!</p>
                  <p className="text-white font-black text-sm sm:text-base mt-1">Your mind can rest now.</p>
                </div>
                <button onClick={reset} className="text-[#A7F3D0]/30 text-[10px] font-bold underline cursor-pointer mt-1">Try again</button>
              </motion.div>
            )}
          </div>
          <div className="h-6 flex items-center justify-center">
            <div className="w-20 h-0.5 bg-[#A7F3D0]/10 rounded-full"/>
          </div>
        </div>
      </div>
      <p className="text-[11px] sm:text-xs text-[#064E3B]/30 font-black uppercase tracking-widest">Interactive · Try it yourself</p>
    </div>
  );
}

/* ──────────────────────────────────────────────
   SHARED: Swipe-Away Banner Demo
────────────────────────────────────────────── */
function SwipeAwayDemo() {
  const [phase, setPhase] = useState<"idle" | "show" | "swiped" | "done">("idle");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 500);
    const t2 = setTimeout(() => setPhase("swiped"), 2200);
    const t3 = setTimeout(() => setPhase("done"), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="relative h-24 flex items-center justify-center overflow-hidden w-[290px] sm:w-[360px]">
      <AnimatePresence>
        {(phase === "show" || phase === "swiped") && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 360 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="flex items-center gap-4 bg-[#E2F5EC] border border-[#10B981]/20 shadow-xl rounded-2xl px-5 py-3.5 w-full animate-pulse"
          >
            <div className="size-11 rounded-xl bg-[#10B981]/10 grid place-items-center shrink-0">
              <Bell className="size-5 text-[#10B981]"/>
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-black text-[#064E3B]">MinDrop Reminder</p>
              <p className="text-xs font-semibold text-[#064E3B]/60 truncate">Take evening medication · now</p>
            </div>
            <div className="text-[10px] text-[#064E3B]/30 font-bold shrink-0">now</div>
          </motion.div>
        )}
      </AnimatePresence>
      {phase === "done" && (
        <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-sm font-black text-[#A7F3D0]/20 uppercase tracking-widest animate-pulse">
          Gone. Forgotten.
        </motion.p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SLIDES
══════════════════════════════════════════════ */

/* Slide 1: Opening */
function SlideOpening() {
  return (
    <div className="h-full bg-[#E2F5EC] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
        className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/20 bg-[#D1FAE5] px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857] mb-8 sm:mb-12">
        ⏰ Looping Alarms
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "It is 10:47 PM.",
          "Your reminder went off at 8:00 PM.",
          "You tapped it away during a call.",
        ].map((line, i) => (
          <motion.p key={i}
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.35 + i * 0.45}}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#047857]/45 leading-tight tracking-tight">
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:1.75}}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#064E3B] leading-none tracking-tighter">
        You forgot your medication.
      </motion.p>
    </div>
  );
}

/* Slide 2: The Problem */
function SlideProblem() {
  return (
    <div className="h-full bg-[#022C22] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#A7F3D0] mb-4">
            Why your current app keeps failing you
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 sm:mb-8 tracking-tight">
            A normal alert disappears in 3 seconds.<br/>
            <span className="text-[#10B981]">Your task sits in your head all night long.</span>
          </h2>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {[
              { n: "3s", label: "How long the alert is visible before it fades away" },
              { n: "68%", label: "Of reminders tapped away without any action" },
              { n: "0", label: "Times a normal notification comes back on its own" },
            ].map(({ n, label }) => (
              <div key={n} className="bg-white/5 border border-[#10B981]/25 rounded-2xl p-4 sm:p-6">
                <p className="text-3xl sm:text-3xl md:text-4xl font-black text-[#10B981]">{n}</p>
                <p className="text-xs sm:text-sm font-semibold text-[#A7F3D0] mt-2 leading-relaxed">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-center gap-4">
          <SwipeAwayDemo />
          <p className="text-xs sm:text-xs font-black text-[#A7F3D0]/70 uppercase tracking-widest">Watch it disappear</p>
        </div>
      </div>
    </div>
  );
}

/* Slide 3: MinDrop Difference */
function SlideDifference() {
  return (
    <div className="h-full bg-[#E2F5EC] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 sm:gap-12 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857] mb-4">
            What makes MinDrop different
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#064E3B] leading-tight tracking-tight">
            MinDrop keeps ringing until you act.<br/>
            <span className="text-[#10B981]">Like a phone call</span> from someone important.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[
            { icon: "📳", title: "Rings Like a Call", body: "The sound plays again and again, just like when someone calls you. You will hear it no matter what you are doing." },
            { icon: "🛡️", title: "Works in Silent Mode", body: "Mark a task as urgent and MinDrop rings through Silent and Do Not Disturb. Nothing blocks it." },
            { icon: "🔄", title: "Survives Restart", body: "If your phone shuts down or restarts, your alarms come back on their own when it turns on again." },
          ].map(({ icon, title, body }) => (
            <div key={title} className="bg-white border-3 border-[#10B981] rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(2,44,34,0.15)] text-left flex flex-col gap-3">
              <span className="text-3xl sm:text-4xl">{icon}</span>
              <h3 className="text-base sm:text-lg md:text-xl font-black text-[#064E3B]">{title}</h3>
              <p className="text-sm sm:text-sm md:text-base font-semibold text-[#047857]/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Interactive Playground */
function SlidePlayground() {
  return (
    <div className="h-full bg-[#D1FAE5] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-20 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857] mb-4">
            Try it before you download
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#064E3B] leading-tight mb-4 sm:mb-6 tracking-tight">
            Feel it for yourself, right now.
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#047857]/70 leading-relaxed mb-6 sm:mb-8 max-w-md">
            Press Start Alarm. Snooze it and watch it come back. Press Done when you are ready. This is exactly what it feels like on your phone.
          </p>
          <div className="flex flex-col gap-3.5">
            {[
              "Press Start Alarm to begin the loop.",
              "Snooze — watch it count down and ring again.",
              "Press Done when you are ready. That stops it.",
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3.5">
                <div className="size-6 sm:size-7 rounded-full bg-[#10B981] text-white grid place-items-center shrink-0 text-xs font-black">{i+1}</div>
                <p className="text-sm sm:text-base md:text-lg font-bold text-[#047857]/80 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          <AlarmPlayground />
        </div>
      </div>
    </div>
  );
}

/* Slides 5–8: How It Works — one step per slide */
function SlideStep({ step, stepNum, title, detail, color }: {
  step: string; stepNum: number; title: string; detail: string; color: string;
}) {
  const TOTAL_STEPS = 4;

  const renderIllustration = (num: number) => {
    switch (num) {
      case 1: return <PencilNotepad />;
      case 2: return <SafeBackground />;
      case 3: return <RingingAlarmIcon />;
      case 4: return <DoneCheck />;
      default: return null;
    }
  };

  return (
    <div className={`h-full ${color} flex items-center justify-center px-6 relative overflow-hidden`}>
      {/* Giant watermark step number */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[240px] sm:text-[340px] md:text-[440px] lg:text-[540px] font-black text-[#10B981]/5 leading-none select-none pointer-events-none pl-4">
        {step}
      </div>

      <div className="w-[95%] mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857]/40 mb-4 sm:mb-5">
            Step {stepNum} of {TOTAL_STEPS} · How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#064E3B] leading-tight mb-4 sm:mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#047857]/70 leading-relaxed">
            {detail}
          </p>

          {/* Step progress bar */}
          <div className="flex gap-2.5 mt-8 sm:mt-12">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i}
                className={`h-1.5 rounded-full transition-all ${i === stepNum - 1 ? "w-14 bg-[#10B981]" : "w-4 bg-[#10B981]/20"}`}/>
            ))}
          </div>
        </div>

        {/* Subtle Animated Illustration */}
        <div className="shrink-0 flex items-center justify-center size-52 sm:size-64 rounded-[2rem] border-3 border-ink bg-white/40 shadow-lg">
          {renderIllustration(stepNum)}
        </div>
      </div>
    </div>
  );
}

/* Slide 9: Scenarios Carousel */
function SlideScenarios() {
  const [cardIdx, setCardIdx] = useState(0);

  const scenarios = [
    {
      icon: Pill,
      title: "The Evening Ritual",
      scene: "Your medication has to be taken at the same time every single night. Not approximately. Exactly. Missing it once can have real consequences.",
      color: "bg-[#F0FDF4]",
    },
    {
      icon: Phone,
      title: "The Call You Keep Delaying",
      scene: "You told yourself you would call your mum back after dinner. It has been two hours. She is waiting. You are just busy and keep forgetting.",
      color: "bg-[#E2F5EC]",
    },
    {
      icon: Flame,
      title: "Before You Leave the House",
      scene: "Did you turn the gas off? Lock the balcony? You always wonder about this once you are already halfway down the road.",
      color: "bg-[#D1FAE5]",
    },
    {
      icon: MapPin,
      title: "The After-Meeting Task",
      scene: "Your manager asked you to send a follow-up note within 2 hours. The meeting just ended. You need to remember this — but you have three more calls.",
      color: "bg-[#A7F3D0]",
    },
    {
      icon: Bell,
      title: "The Deadline You Kept Pushing",
      scene: "The last date to submit that form is today. You have been saying tomorrow since last Tuesday. Today is the day — and you cannot forget.",
      color: "bg-[#ECFDF5]",
    },
  ];

  const prev = () => setCardIdx(i => Math.max(0, i - 1));
  const next = () => setCardIdx(i => Math.min(scenarios.length - 1, i + 1));

  return (
    <div className="h-full bg-[#022C22] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 sm:gap-10 max-w-3xl">
        <div className="text-center">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#A7F3D0]/30 mb-4">
            Real moments MinDrop is built for
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            You will see yourself in one of these.
          </h2>
        </div>

        {/* Card */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div key={cardIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={`w-full rounded-[2rem] border-3 border-[#10B981] p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(4,120,87,0.4)] ${scenarios[cardIdx].color} flex flex-col gap-6`}>
              <div className="size-14 bg-white border-2 border-[#10B981] rounded-2xl grid place-items-center shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)]">
                {(() => { const Icon = scenarios[cardIdx].icon; return <Icon className="size-7 text-[#064E3B]"/>; })()}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-[#047857] uppercase tracking-wider mb-2">{scenarios[cardIdx].title}</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-[#064E3B] leading-snug tracking-tight">{scenarios[cardIdx].scene}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-5">
          <button onClick={prev} disabled={cardIdx === 0}
            className="size-11 sm:size-12 rounded-full border-2 border-[#10B981]/30 bg-white/5 grid place-items-center text-[#A7F3D0]/60 hover:text-white hover:bg-white/10 disabled:opacity-25 transition cursor-pointer">
            <ChevronLeft className="size-5"/>
          </button>
          <div className="flex gap-2.5">
            {scenarios.map((_, i) => (
              <button key={i} onClick={() => setCardIdx(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${i === cardIdx ? "w-8 h-2 bg-[#10B981]" : "size-2.5 bg-[#A7F3D0]/30 hover:bg-white/50"}`}/>
            ))}
          </div>
          <button onClick={next} disabled={cardIdx === scenarios.length - 1}
            className="size-11 sm:size-12 rounded-full border-2 border-[#10B981]/30 bg-white/5 grid place-items-center text-[#A7F3D0]/60 hover:text-white hover:bg-white/10 disabled:opacity-25 transition cursor-pointer">
            <ChevronRight className="size-5"/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* Slide 10: Closer */
function SlideCloser({ backHash }: { backHash?: string }) {
  return (
    <div className="h-full bg-[#E2F5EC] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 sm:gap-10 max-w-4xl">
        <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#047857]/55">
          The last reminder app you will ever need
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#064E3B] leading-none tracking-tighter">
          You have been remembering<br className="hidden sm:block"/> too much on your own.
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#047857]/60 leading-relaxed max-w-2xl">
          MinDrop holds your pills, your calls, your tasks, and your deadlines. Hand them over. We will make sure you never miss them again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link to="/download"
            className="px-10 sm:px-12 py-4.5 sm:py-5 bg-ink text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#10B981] hover:border-[#10B981] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Download MinDrop — Free
          </Link>
          <Link to="/" hash={backHash} viewTransition
            className="px-10 sm:px-12 py-4.5 sm:py-5 bg-white text-ink font-black text-sm sm:text-base uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#D1FAE5] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            See All Features
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN — Full-Page Fade Scroll Controller
══════════════════════════════════════════════ */
function LaterDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;

  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const lastScrollTime = useRef(0);

  const STEPS = [
    {
      step: "01", stepNum: 1, color: "bg-[#F0FDF4]",
      title: "You write a task and pick a time.",
      detail: "Give it a name. Add a photo or voice note if you need context. Then set the time you want to be reminded. That is it — about 10 seconds of effort and it is all locked in.",
    },
    {
      step: "02", stepNum: 2, color: "bg-[#E2F5EC]",
      title: "Your phone quietly keeps it safe in the background.",
      detail: "MinDrop talks directly to your phone's own alarm system — the same one that wakes you up every morning. It does not need a server or an internet connection to do its job.",
    },
    {
      step: "03", stepNum: 3, color: "bg-[#F0FDF4]",
      title: "At the exact time, the alarm starts ringing.",
      detail: "Your phone lights up and the ringtone plays on repeat. It stays there, ringing, until you decide to deal with it. It does not quietly go away after a few seconds.",
    },
    {
      step: "04", stepNum: 4, color: "bg-[#E2F5EC]",
      title: "You snooze or mark it done. That stops it.",
      detail: "Snooze gives you a few more minutes and then the alarm rings again. Marking it done clears it completely. You always decide when it stops — the app never does it for you.",
    },
  ];

  const slides = [
    <SlideOpening />,
    <SlideProblem />,
    <SlideDifference />,
    <SlidePlayground />,
    ...STEPS.map(s => <SlideStep key={s.step} {...s} />),
    <SlideScenarios />,
    <SlideCloser backHash={backHash} />,
  ];
  const TOTAL = slides.length;

  const DARK_SLIDES = [1, 8];
  const isDark = DARK_SLIDES.includes(current);

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
      style={{ viewTransitionName: "card-later" } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <header className="shrink-0 border-b-2 border-[#10B981]/10 z-50"
        style={{ backgroundColor: isDark ? "rgba(2,44,34,0.96)" : "rgba(226,245,236,0.96)", backdropFilter: "blur(12px)", transition: "background-color 0.4s ease" }}>
        <div className="w-[95%] max-w-7xl mx-auto h-14 flex items-center justify-between gap-2 px-2 sm:px-4">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-[#A7F3D0]/70 hover:text-white" : "text-[#047857]/70 hover:text-[#064E3B]"}`}>
            <X className="size-3.5"/> Close
          </Link>
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          <Link to="/download"
            className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 sm:px-4 py-1.5 rounded-full border-2 shrink-0 leading-none whitespace-nowrap shadow-sm transition ${isDark ? "bg-white text-ink border-white hover:bg-[#10B981] hover:text-white hover:border-[#10B981]" : "bg-ink text-white border-ink hover:bg-[#10B981] hover:border-[#10B981]"}`}>
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
            className="absolute top-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-0.5 z-20 cursor-pointer group"
          >
            <ChevronDown className={`size-3.5 rotate-180 transition group-hover:-translate-y-0.5 ${isDark ? "text-[#A7F3D0]/30 group-hover:text-white" : "text-[#047857]/30 group-hover:text-[#064E3B]"}`} />
            <span className={`text-[9px] font-black uppercase tracking-widest transition ${isDark ? "text-[#A7F3D0]/30 group-hover:text-white" : "text-[#047857]/30 group-hover:text-[#064E3B]"}`}>
              scroll or ↑
            </span>
          </button>
        )}

        {/* Slide Content */}
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
            className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-0.5 z-20 cursor-pointer group"
          >
            <span className={`text-[9px] font-black uppercase tracking-widest transition ${isDark ? "text-[#A7F3D0]/30 group-hover:text-white" : "text-[#047857]/30 group-hover:text-[#064E3B]"}`}>
              scroll or ↓
            </span>
            <ChevronDown className={`size-3.5 transition group-hover:translate-y-0.5 ${isDark ? "text-[#A7F3D0]/30 group-hover:text-white" : "text-[#047857]/30 group-hover:text-[#064E3B]"}`} />
          </button>
        )}

        {/* ── Right Dot Navigation ── */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-30">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "w-1.5 h-7 bg-[#10B981]"
                  : isDark
                    ? "size-1.5 bg-[#A7F3D0]/25 hover:bg-[#A7F3D0]/60"
                    : "size-1.5 bg-[#047857]/25 hover:bg-[#047857]/50"
              }`}
            />
          ))}
          <p className={`text-[9px] font-black mt-1 tabular-nums transition ${isDark ? "text-[#A7F3D0]/30" : "text-[#047857]/30"}`}>
            {current + 1}/{TOTAL}
          </p>
        </div>
      </div>
    </div>
  );
}
