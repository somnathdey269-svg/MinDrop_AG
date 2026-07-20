import { createFileRoute, Link } from "@tanstack/react-router";
import { AlarmClock, Check, X, ArrowRight, Bell, Play, ShieldAlert, Sparkles, Volume2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/later-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Later Module — MinDrop Alarms" },
      { name: "description", content: "Learn how MinDrop's Later alarms ring persistently until checked and survive restarts." },
    ],
  }),
  component: LaterDetailView,
});

function AlarmSimulator() {
  const [state, setState] = useState<"idle" | "ringing" | "snoozed" | "success">("idle");
  const [snoozeCount, setSnoozeCount] = useState(10);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state === "snoozed") {
      timer = setInterval(() => {
        setSnoozeCount((prev) => {
          if (prev <= 1) {
            setState("ringing");
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state]);

  const triggerAlarm = () => {
    setState("ringing");
  };

  const snoozeAlarm = () => {
    setSnoozeCount(10);
    setState("snoozed");
  };

  const dismissAlarm = () => {
    setState("success");
    setTimeout(() => {
      setState("idle");
    }, 2500);
  };

  return (
    <div className="w-full max-w-sm bg-[#F9F7F2] border-3 border-ink rounded-[2.5rem] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden select-none">
      {state === "idle" && (
        <div className="flex flex-col items-center text-center gap-4">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="size-16 rounded-2xl bg-white border-2 border-ink grid place-items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <AlarmClock className="size-8 text-ink" />
          </motion.div>
          <div>
            <h4 className="text-xs uppercase font-black text-ink/40 tracking-wider">Interactive Simulator</h4>
            <p className="text-sm font-black text-ink mt-1">Want to feel how it works?</p>
          </div>
          <button
            onClick={triggerAlarm}
            className="px-5 py-2.5 rounded-xl bg-[#10B981] text-white font-black text-xs uppercase tracking-wider border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#059669] transition cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          >
            Trigger Alarm
          </button>
        </div>
      )}

      {state === "ringing" && (
        <div className="flex flex-col items-center text-center gap-4 w-full z-10">
          {/* Pulsing Concentric Circles */}
          <div className="relative size-16 grid place-items-center">
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-[#EA3323]"
            />
            <motion.div
              animate={{ scale: [1, 2.2, 1], opacity: [0.15, 0, 0.15] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
              className="absolute inset-0 rounded-full border-2 border-[#EA3323]"
            />
            <motion.div
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ duration: 0.15, repeat: Infinity, ease: "easeInOut" }}
              className="size-12 rounded-xl bg-white border-2 border-ink grid place-items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-[#FEE2E2]"
            >
              <Volume2 className="size-6 text-[#EA3323]" />
            </motion.div>
          </div>

          <div>
            <h4 className="text-xs uppercase font-black text-[#EA3323] tracking-widest animate-pulse">ALARM RINGING</h4>
            <p className="text-sm font-black text-ink mt-1">"Take Evening Medication"</p>
            <p className="text-[11px] text-ink/50 font-semibold mt-0.5">Survives Silent / DND Modes</p>
          </div>

          <div className="flex gap-2.5 w-full mt-2">
            <button
              onClick={snoozeAlarm}
              className="flex-1 py-2.5 rounded-xl bg-white text-ink font-black text-xs uppercase tracking-wider border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 transition cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            >
              Snooze (10s)
            </button>
            <button
              onClick={dismissAlarm}
              className="flex-1 py-2.5 rounded-xl bg-ink text-white font-black text-xs uppercase tracking-wider border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:opacity-90 transition cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {state === "snoozed" && (
        <div className="flex flex-col items-center text-center gap-4 w-full">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="size-16 rounded-2xl bg-white border-2 border-ink grid place-items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-[#FEF3C7]"
          >
            <RotateCcw className="size-8 text-[#D97706]" />
          </motion.div>

          <div>
            <h4 className="text-xs uppercase font-black text-[#D97706] tracking-wider">Alarm Snoozed</h4>
            <p className="text-sm font-bold text-ink mt-1">Ringing again in {snoozeCount}s...</p>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full border border-ink overflow-hidden max-w-[200px]">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="bg-[#D97706] h-full"
            />
          </div>
        </div>
      )}

      {state === "success" && (
        <div className="flex flex-col items-center text-center gap-3 w-full">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            className="size-16 rounded-full bg-[#D1FAE5] border-2 border-ink grid place-items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <Check className="size-8 text-[#10B981] stroke-[4px]" />
          </motion.div>
          <div>
            <h4 className="text-xs uppercase font-black text-[#10B981] tracking-wider">Task Completed!</h4>
            <p className="text-sm font-black text-ink mt-1">Your mind can rest now.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function LaterDetailView() {
  const { from } = Route.useSearch();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen w-full bg-[#E2F5EC] flex flex-col justify-between p-6 select-none overflow-y-auto">
      
      {/* Top Header Sync */}
      <header className="flex justify-between items-center w-full z-10 shrink-0 mb-8">
        <span className="text-xs uppercase tracking-wider font-black text-ink/40">Spec Sheet</span>
        <div className="flex items-center gap-2">
          <div className="size-8 relative grid place-items-center shrink-0">
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-[#FF671F]/30"
            />
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="size-6 rounded-lg bg-gradient-to-tr from-[#FF671F] to-[#FFA06E] shadow-md grid place-items-center relative border border-white/10"
            >
              <span className="text-white font-black text-xs font-sans">m</span>
            </motion.div>
          </div>
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline text-ink/80">MinDrop Specs</span>
        </div>
        <Link
          to="/"
          hash={from === "grid" ? "grid" : undefined}
          viewTransition
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
        >
          View Deck
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center relative w-full mb-12">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          style={{ viewTransitionName: 'card-later' } as React.CSSProperties}
          className="w-full max-w-5xl bg-white border-3 border-ink rounded-[2.5rem] p-6 sm:p-10 md:p-14 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col gap-10"
        >
          {/* Close button inside card */}
          <Link
            to="/"
            hash={from === "grid" ? "grid" : undefined}
            viewTransition
            className="absolute top-6 right-6 size-10 rounded-full border-2 border-ink bg-white grid place-items-center hover:bg-ink/5 transition z-20 cursor-pointer active:scale-95"
            aria-label="Close"
          >
            <X className="size-5 text-ink" />
          </Link>

          {/* Hero Row */}
          <div className="flex flex-col md:flex-row justify-between gap-8 items-start md:items-center mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="flex-1 text-left"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-[#E2F5EC] px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#10B981] mb-4">
                ⏰ Looping Alarms
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink leading-tight tracking-tight">
                Ring looping alarms for tasks.
              </h1>
              <p className="text-base sm:text-lg font-bold text-ink/50 mt-3 max-w-xl">
                Your brain was not built to remember endless lists. Let MinDrop carry the load.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="shrink-0 self-center md:self-auto w-full md:w-auto flex justify-center"
            >
              <AlarmSimulator />
            </motion.div>
          </div>

          {/* Process Flow Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="border-3 border-ink rounded-[2rem] p-6 sm:p-8 bg-[#F9F7F2] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <h3 className="font-black text-ink mb-6 uppercase tracking-wider text-xs sm:text-sm border-b-2 border-ink/10 pb-3 flex items-center gap-2">
              <Sparkles className="size-4.5 text-[#10B981]" />
              Process Flow Diagram
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
              {/* Step 1 */}
              <motion.div
                animate={activeStep === 0 ? { scale: [1, 1.02, 1], borderColor: ["#10B981", "#000000", "#10B981"] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`border-2 p-4.5 rounded-2xl text-center transition-all ${
                  activeStep === 0 ? "bg-[#EEFDF7] border-[#10B981] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-ink bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                }`}
              >
                <span className="text-[10px] font-black text-[#10B981] uppercase tracking-wider">01 / Setup</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">Task Created</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">Write memo, set a strict due time.</p>
              </motion.div>

              {/* Arrow 1 */}
              <div className="flex justify-center text-ink/30 rotate-90 md:rotate-0 py-1 md:py-0">
                <ArrowRight className="size-6 shrink-0" />
              </div>

              {/* Step 2 */}
              <motion.div
                animate={activeStep === 1 ? { scale: [1, 1.02, 1], borderColor: ["#10B981", "#000000", "#10B981"] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`border-2 p-4.5 rounded-2xl text-center transition-all ${
                  activeStep === 1 ? "bg-[#EEFDF7] border-[#10B981] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-ink bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                }`}
              >
                <span className="text-[10px] font-black text-[#10B981] uppercase tracking-wider">02 / Alert</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">Ringer Loops</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">Phone rings persistently like a call.</p>
              </motion.div>

              {/* Arrow 2 */}
              <div className="flex justify-center text-ink/30 rotate-90 md:rotate-0 py-1 md:py-0">
                <ArrowRight className="size-6 shrink-0" />
              </div>

              {/* Step 3 */}
              <motion.div
                animate={activeStep === 2 ? { scale: [1, 1.02, 1], borderColor: ["#10B981", "#000000", "#10B981"] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`border-2 p-4.5 rounded-2xl text-center transition-all ${
                  activeStep === 2 ? "bg-[#EEFDF7] border-[#10B981] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-ink bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                }`}
              >
                <span className="text-[10px] font-black text-[#10B981] uppercase tracking-wider">03 / Guard</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">Auto Recovery</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">System sweeps reschedule on device restarts.</p>
              </motion.div>

              {/* Arrow 3 */}
              <div className="flex justify-center text-ink/30 rotate-90 md:rotate-0 py-1 md:py-0">
                <ArrowRight className="size-6 shrink-0" />
              </div>

              {/* Step 4 */}
              <motion.div
                animate={activeStep === 3 ? { scale: [1, 1.02, 1], borderColor: ["#10B981", "#000000", "#10B981"] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`border-2 p-4.5 rounded-2xl text-center transition-all ${
                  activeStep === 3 ? "bg-[#EEFDF7] border-[#10B981] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-ink bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                }`}
              >
                <span className="text-[10px] font-black text-[#10B981] uppercase tracking-wider">04 / Action</span>
                <h4 className="text-xs sm:text-sm font-black text-ink mt-1.5 leading-snug">Manual Check</h4>
                <p className="text-[11px] text-ink/60 font-semibold mt-1 leading-normal">Requires deliberate check-off to clear.</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Structured Context Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* The Pain */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 }}
              className="border-3 border-ink p-6 sm:p-10 rounded-[2rem] bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-3"
            >
              <h3 className="font-black text-[#EA3323] text-sm uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="size-5 shrink-0" />
                Your mind is overloaded.
              </h3>
              <p className="text-base font-semibold text-ink/70 leading-relaxed">
                Standard notification badges are designed to be swiped away. When you are busy or tired, it is too easy to clear a banner and completely forget the task. Static list apps fail because they rely on you remembering to check them.
              </p>
            </motion.div>

            {/* The Solution */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 }}
              className="border-3 border-ink p-6 sm:p-10 rounded-[2rem] bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-3"
            >
              <h3 className="font-black text-[#10B981] text-sm uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="size-5 shrink-0" />
                An alarm that demands action.
              </h3>
              <p className="text-base font-semibold text-ink/70 leading-relaxed">
                MinDrop treats your critical tasks differently. Instead of a silent banner, it rings persistently like an incoming phone call. The loop locks your focus until you choose to snooze the sweep or check it off as done.
              </p>
            </motion.div>

            {/* The Engine */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="border-3 border-ink p-6 sm:p-10 rounded-[2rem] bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-3"
            >
              <h3 className="font-black text-brand text-sm uppercase tracking-wider flex items-center gap-2">
                <Play className="size-5 shrink-0" />
                Locally-scheduled reliability.
              </h3>
              <p className="text-base font-semibold text-ink/70 leading-relaxed">
                We value your privacy. All alarm engines run fully on-device. The app schedules native OS system alarms directly. Even if your phone runs out of battery or reboots, a background boot sweep instantly restores all your pending alarms.
              </p>
            </motion.div>

            {/* Core Capabilities */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.24 }}
              className="border-3 border-ink p-6 sm:p-10 rounded-[2rem] bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left"
            >
              <h3 className="font-black text-ink text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <Bell className="size-5 shrink-0" />
                Product Features
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-base font-bold text-ink">
                  <Check className="size-5.5 text-[#10B981] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>Attach custom voice notes or photos to context sweeps</span>
                </li>
                <li className="flex items-start gap-3 text-base font-bold text-ink">
                  <Check className="size-5.5 text-[#10B981] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>Configure adaptive snooze windows (from 5 minutes up to 2 hours)</span>
                </li>
                <li className="flex items-start gap-3 text-base font-bold text-ink">
                  <Check className="size-5.5 text-[#10B981] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>Bypass standard silent/DND profiles for emergency tasks</span>
                </li>
                <li className="flex items-start gap-3 text-base font-bold text-ink">
                  <Check className="size-5.5 text-[#10B981] shrink-0 stroke-[3.5px] mt-0.5" />
                  <span>Automatic boot-recovery listener guards schedules</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer Sync */}
      <footer className="flex justify-between items-center w-full z-10 shrink-0 mt-4">
        <span className="text-xs font-black uppercase tracking-wider text-ink/40">India · Offline Engine</span>
        <Link
          to="/privacy"
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
        >
          Privacy Promise
        </Link>
      </footer>
    </div>
  );
}
