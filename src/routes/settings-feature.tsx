import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Settings, Check, X, ChevronDown, Bell, Moon,
  Sun, Smartphone, User, Shield, RefreshCw, Sliders, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/settings-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "Your Settings — MinDrop" },
      { name: "description", content: "MinDrop works exactly the way you want it to. Change the ringtone, adjust snooze time, set a dark mode — it's all yours to control." },
    ],
  }),
  component: SettingsDetailView,
});

/* ─── Live Settings Playground ─── */
function SettingsPlayground() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [snooze, setSnooze] = useState(5);
  const [ringtone, setRingtone] = useState("Classic");
  const [dnd, setDnd] = useState(true);

  const dark = theme === "dark";

  return (
    <div className={`w-full max-w-sm rounded-[2rem] border-3 border-ink overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors duration-500 ${dark ? "bg-[#111]" : "bg-white"}`}>
      {/* Phone top bar */}
      <div className={`flex justify-between items-center px-5 py-3 border-b-2 ${dark ? "border-white/10" : "border-ink/10"}`}>
        <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? "text-white/30" : "text-ink/30"}`}>MinDrop Settings</span>
        <Settings className={`size-4 ${dark ? "text-white/40" : "text-ink/40"}`} />
      </div>

      <div className="flex flex-col gap-0 p-4 sm:p-5">
        {/* Theme Toggle */}
        <div className={`flex items-center justify-between py-3 border-b ${dark ? "border-white/8" : "border-ink/8"}`}>
          <div className="flex items-center gap-3">
            {dark ? <Moon className="size-4 text-[#818cf8]" /> : <Sun className="size-4 text-amber-500" />}
            <div>
              <p className={`text-xs font-black ${dark ? "text-white" : "text-ink"}`}>App Theme</p>
              <p className={`text-[9px] font-semibold ${dark ? "text-white/30" : "text-ink/30"}`}>{dark ? "Dark" : "Light"} mode is on</p>
            </div>
          </div>
          <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
            className={`relative w-11 h-5.5 rounded-full border-2 border-ink transition-colors cursor-pointer ${dark ? "bg-[#818cf8]" : "bg-white"}`}>
            <motion.div animate={{ x: dark ? 20 : 2 }}
              className="absolute top-0.5 size-3.5 bg-ink rounded-full shadow" />
          </button>
        </div>

        {/* Snooze Time */}
        <div className={`flex items-center justify-between py-3 border-b ${dark ? "border-white/8" : "border-ink/8"}`}>
          <div className="flex items-center gap-3">
            <RefreshCw className={`size-4 ${dark ? "text-amber-400" : "text-amber-500"}`} />
            <div>
              <p className={`text-xs font-black ${dark ? "text-white" : "text-ink"}`}>Snooze Duration</p>
              <p className={`text-[9px] font-semibold ${dark ? "text-white/30" : "text-ink/30"}`}>Rings again after {snooze} min</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setSnooze(s => Math.max(1, s - 1))}
              className={`size-6 rounded-lg border-2 border-ink font-black text-xs grid place-items-center cursor-pointer transition ${dark ? "bg-white/10 text-white" : "bg-white text-ink"}`}>−</button>
            <span className={`text-xs font-black w-5 text-center ${dark ? "text-white" : "text-ink"}`}>{snooze}</span>
            <button onClick={() => setSnooze(s => Math.min(30, s + 1))}
              className={`size-6 rounded-lg border-2 border-ink font-black text-xs grid place-items-center cursor-pointer transition ${dark ? "bg-white/10 text-white" : "bg-white text-ink"}`}>+</button>
          </div>
        </div>

        {/* Ringtone */}
        <div className={`flex items-center justify-between py-3 border-b ${dark ? "border-white/8" : "border-ink/8"}`}>
          <div className="flex items-center gap-3">
            <Bell className={`size-4 text-[#FF671F]`} />
            <div>
              <p className={`text-xs font-black ${dark ? "text-white" : "text-ink"}`}>Alarm Sound</p>
              <p className={`text-[9px] font-semibold ${dark ? "text-white/30" : "text-ink/30"}`}>Sound: {ringtone}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {["Classic", "Loud", "Soft"].map(r => (
              <button key={r} onClick={() => setRingtone(r)}
                className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg border-2 cursor-pointer transition ${
                  ringtone === r
                    ? "border-[#FF671F] bg-[#FF671F] text-white"
                    : `border-ink/20 ${dark ? "text-white/50" : "text-ink/40"}`
                }`}>{r}</button>
            ))}
          </div>
        </div>

        {/* DND Bypass */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Shield className={`size-4 ${dark ? "text-emerald-400" : "text-emerald-600"}`} />
            <div>
              <p className={`text-xs font-black ${dark ? "text-white" : "text-ink"}`}>Break Through Silent</p>
              <p className={`text-[9px] font-semibold ${dark ? "text-white/30" : "text-ink/30"}`}>{dnd ? "Bypasses Silent mode" : "Blocked by Silent"}</p>
            </div>
          </div>
          <button onClick={() => setDnd(d => !d)}
            className={`relative w-11 h-5.5 rounded-full border-2 border-ink transition-colors cursor-pointer ${dnd ? "bg-emerald-500" : "bg-white"}`}>
            <motion.div animate={{ x: dnd ? 20 : 2 }}
              className="absolute top-0.5 size-3.5 bg-ink rounded-full shadow" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SLIDES
══════════════════════════════════════════════ */

/* Slide 1: Opening */
function SlideOpening() {
  return (
    <div className="h-full bg-[#F8F7FF] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-purple-100 px-4 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#8B5CF6] mb-6 sm:mb-8">
        ⚙️ Your Settings
      </motion.span>

      <div className="flex flex-col gap-1.5 sm:gap-2 mb-5 sm:mb-7">
        {[
          "No two people are the same.",
          "Some sleep lightly and a soft alarm is enough.",
          "Some need it very, very loud.",
        ].map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
            className="text-lg sm:text-2xl md:text-3xl font-black text-ink/35 leading-tight">
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.65 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-tight tracking-tight">
        MinDrop works your way.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        className="mt-8 sm:mt-12 flex flex-col items-center gap-1.5 text-ink/20">
        <p className="text-[9px] font-black uppercase tracking-widest">Scroll to continue</p>
        <ChevronDown className="size-4 animate-bounce" />
      </motion.div>
    </div>
  );
}

/* Slide 2: The Problem */
function SlideProblem() {
  return (
    <div className="h-full bg-[#1E1B4B] flex items-center justify-center px-5">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-14 max-w-5xl">
        <div className="flex-1 text-left">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/25 mb-3">
            Why most apps get this wrong
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 sm:mb-6">
            Most apps decide for you.<br />
            <span className="text-[#c084fc]">MinDrop asks you.</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-white/50 leading-relaxed max-w-lg">
            Other reminder apps have one look, one ringtone, one way of doing things. If it does not match how you live, that's your problem. MinDrop believes your phone should work the way you think.
          </p>
        </div>
        <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          {[
            { n: "1", label: "Ringtone style option given. Take it or leave it." },
            { n: "Fixed", label: "Snooze intervals. Locked down by developers." },
            { n: "None", label: "Options to scale alert bypass behaviors." },
          ].map(({ n, label }) => (
            <div key={n} className="bg-white/5 border border-white/8 rounded-xl p-4 text-left">
              <p className="text-xl sm:text-2xl font-black text-[#c084fc]">{n}</p>
              <p className="text-[10px] font-semibold text-white/40 mt-1 leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 3: The Playground */
function SlidePlayground() {
  return (
    <div className="h-full bg-purple-50 flex items-center justify-center px-5">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-4xl">
        <div className="flex-1 text-left">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#8B5CF6] mb-3">
            Interactive playground
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink leading-tight mb-3 sm:mb-4">
            Every setting is yours to change.
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-ink/55 leading-relaxed mb-4 sm:mb-5 max-w-sm">
            Toggle the theme. Adjust the snooze. Try ringtones. Bypass DND. These controls are fully simulated — feel free to tap away!
          </p>
          <div className="flex flex-col gap-2">
            {[
              "Switch between dark and light screens.",
              "Adjust precise snooze cooldown window.",
              "Select different ringtone loudness levels.",
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="size-5 rounded-full bg-[#8B5CF6] text-white grid place-items-center shrink-0 text-[9px] font-black">{i+1}</div>
                <p className="text-xs sm:text-sm font-bold text-ink/65 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0 w-full lg:w-auto flex justify-center">
          <SettingsPlayground />
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Everything You Can Adjust */
function SlideDifference() {
  return (
    <div className="h-full bg-[#F8F7FF] flex items-center justify-center px-5">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-6 sm:gap-8 max-w-4xl">
        <div>
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-ink/25 mb-3">
            Tailored preferences
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-ink leading-tight">
            Comprehensive setup control.<br />
            <span className="text-[#8B5CF6]">Customize exactly</span> how reminders behave.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full">
          {[
            { icon: Bell, color: "bg-[#FFF7ED]", title: "Alarm Sound", body: "Pick between soft hums, standard rings, or intense loops. Pick the sound profile that works best." },
            { icon: RefreshCw, color: "bg-purple-50", title: "Snooze Control", body: "Change snooze delays dynamically between 1 and 30 minutes to match your routines." },
            { icon: Shield, color: "bg-[#F0FDF4]", title: "Silent Override", body: "Establish whitelist bypasses so critical medication reminders break through silent modes." },
          ].map(({ icon: Icon, color, title, body }) => (
            <div key={title} className={`${color} border-3 border-ink rounded-[1.5rem] p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-2`}>
              <Icon className="size-5.5 text-ink shrink-0" />
              <h3 className="text-sm sm:text-base font-black text-ink">{title}</h3>
              <p className="text-xs sm:text-sm font-semibold text-ink/55 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 5: Profiles / Scenarios Carousel */
function SlideScenarios() {
  const [cardIdx, setCardIdx] = useState(0);

  const scenarios = [
    { emoji: "🛌", title: "The Deep Sleeper", desc: "Set the loudest ringtone, maximum volume, and 60-second snooze. MinDrop will not let you sleep through it.", color: "bg-indigo-50" },
    { emoji: "👩‍💼", title: "The Busy Professional", desc: "Quiet vibration during the day. Loud looping alarm for your evening medication. Different rules for different times.", color: "bg-purple-50" },
    { emoji: "👴", title: "The Older Parent", desc: "Big, simple alarm. A long ringtone. No complicated interface. Just ring and done.", color: "bg-amber-50" },
    { emoji: "🎧", title: "The Headphone Wearer", desc: "Set alarms to ring through your earbuds when they are connected. So you never miss it even with your phone in your pocket.", color: "bg-green-50" },
    { emoji: "🤫", title: "The Library Type", desc: "Vibrate only. No sound at all. MinDrop still taps your wrist firmly until you acknowledge it.", color: "bg-red-50" },
  ];

  const prev = () => setCardIdx(i => Math.max(0, i - 1));
  const next = () => setCardIdx(i => Math.min(scenarios.length - 1, i + 1));

  return (
    <div className="h-full bg-[#1E1B4B] flex items-center justify-center px-5">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-5 sm:gap-6 max-w-2xl">
        <div className="text-center">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/25 mb-3">
            Made for different lives
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
            Whether you are a light sleeper or a heavy one.
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
              className={`w-full rounded-[1.75rem] border-3 border-ink p-6 sm:p-7 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${scenarios[cardIdx].color} flex flex-col gap-4`}>
              <span className="text-3xl">{scenarios[cardIdx].emoji}</span>
              <div>
                <p className="text-[10px] font-black text-ink/40 uppercase tracking-wider mb-1.5">{scenarios[cardIdx].title}</p>
                <p className="text-sm sm:text-base font-black text-ink leading-snug">{scenarios[cardIdx].desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button onClick={prev} disabled={cardIdx === 0}
            className="size-9 rounded-full border-2 border-white/20 bg-white/8 grid place-items-center text-white/50 hover:text-white hover:bg-white/20 disabled:opacity-25 transition cursor-pointer">
            <ChevronLeft className="size-4"/>
          </button>
          <div className="flex gap-2">
            {scenarios.map((_, i) => (
              <button key={i} onClick={() => setCardIdx(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${i === cardIdx ? "w-6 h-2 bg-white" : "size-2 bg-white/30 hover:bg-white/50"}`}/>
            ))}
          </div>
          <button onClick={next} disabled={cardIdx === scenarios.length - 1}
            className="size-9 rounded-full border-2 border-white/20 bg-white/8 grid place-items-center text-white/50 hover:text-white hover:bg-white/20 disabled:opacity-25 transition cursor-pointer">
            <ChevronRight className="size-4"/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* Slide 6: Closer */
function SlideCloser({ backHash }: { backHash?: string }) {
  return (
    <div className="h-full bg-[#F8F7FF] flex items-center justify-center px-5 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-5 sm:gap-6 max-w-3xl">
        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-ink/25">
          An app that adapts to you
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-tight">
          Set it up once. It works your way — forever.
        </h2>
        <p className="text-base sm:text-lg font-semibold text-ink/45 leading-relaxed max-w-xl">
          MinDrop remembers all your preferences. Once you set it the way you like, you never have to touch it again. It just works, quietly and reliably, exactly how you need it to.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mt-2">
          <Link to="/download"
            className="px-8 sm:px-10 py-3.5 bg-ink text-white font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#8B5CF6] hover:border-[#8B5CF6] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Download MinDrop — Free
          </Link>
          <Link to="/" hash={backHash} viewTransition
            className="px-8 sm:px-10 py-3.5 bg-white text-ink font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-purple-50 transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
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
function SettingsDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;

  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const lockedRef  = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const slides = [
    <SlideOpening />,
    <SlideProblem />,
    <SlidePlayground />,
    <SlideDifference />,
    <SlideScenarios />,
    <SlideCloser backHash={backHash} />,
  ];
  const TOTAL = slides.length;

  const DARK_SLIDES = [1, 4];
  const isDark = DARK_SLIDES.includes(current);

  const goTo = (idx: number) => {
    if (lockedRef.current || idx < 0 || idx >= TOTAL) return;
    lockedRef.current = true;
    currentRef.current = idx;
    setCurrent(idx);
    setTimeout(() => { lockedRef.current = false; }, 750);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (lockedRef.current) return;
      if (e.deltaY > 0) goTo(currentRef.current + 1);
      else if (e.deltaY < 0) goTo(currentRef.current - 1);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["ArrowDown","PageDown"].includes(e.key)) { e.preventDefault(); goTo(currentRef.current + 1); }
      if (["ArrowUp","PageUp"].includes(e.key)) { e.preventDefault(); goTo(currentRef.current - 1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden"
      style={{ viewTransitionName: "card-settings" } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <header className="shrink-0 border-b-2 border-ink/8 z-50"
        style={{ backgroundColor: isDark ? "rgba(30,27,75,0.96)" : "rgba(248,247,255,0.96)", backdropFilter: "blur(12px)", transition: "background-color 0.4s ease" }}>
        <div className="w-[95%] mx-auto h-14 flex items-center justify-between">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition ${isDark ? "text-white/50 hover:text-white" : "text-ink/50 hover:text-ink"}`}>
            <X className="size-3.5"/> Close
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-7 relative grid place-items-center shrink-0">
              <motion.div animate={{scale:[1,1.5,1],opacity:[0.2,0,0.2]}} transition={{duration:3,repeat:Infinity}}
                className="absolute inset-0 rounded-full border border-[#8B5CF6]/30"/>
              <motion.div animate={{y:[0,-2,0]}} transition={{duration:3,repeat:Infinity}}
                className="size-5 rounded-md bg-gradient-to-tr from-[#8B5CF6] to-[#c084fc] grid place-items-center relative">
                <span className="text-white font-black text-[9px]">m</span>
              </motion.div>
            </div>
            <span className={`text-xs font-black uppercase tracking-wider hidden sm:block transition ${isDark ? "text-white/60" : "text-ink/60"}`}>MinDrop</span>
          </div>
          <Link to="/download"
            className={`text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-xl border-2 transition ${isDark ? "bg-white text-ink border-white hover:bg-[#8B5CF6] hover:text-white hover:border-[#8B5CF6]" : "bg-ink text-white border-ink hover:bg-[#8B5CF6] hover:border-[#8B5CF6]"}`}>
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
            if (delta > 0) goTo(currentRef.current + 1);
            else goTo(currentRef.current - 1);
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

        {/* ── Right Dot Navigation ── */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-30">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "w-1.5 h-7 bg-[#8B5CF6]"
                  : isDark
                    ? "size-1.5 bg-white/25 hover:bg-white/60"
                    : "size-1.5 bg-ink/20 hover:bg-ink/50"
              }`}
            />
          ))}
          <p className={`text-[9px] font-black mt-1 tabular-nums transition ${isDark ? "text-white/25" : "text-ink/25"}`}>
            {current + 1}/{TOTAL}
          </p>
        </div>

        {/* ── Bottom hint ── */}
        {current < TOTAL - 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 pointer-events-none">
            <p className={`text-[9px] font-black uppercase tracking-widest transition ${isDark ? "text-white/15" : "text-ink/15"}`}>
              scroll or ↓
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
