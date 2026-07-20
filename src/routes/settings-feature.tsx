import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Settings, Check, X, ChevronDown, Bell, Moon,
  Sun, Smartphone, User, Shield, RefreshCw, Sliders
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useState, useRef } from "react";

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

/* ─── Fade in on scroll ─── */
function FadeUp({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Live Settings Playground ─── */
function SettingsPlayground() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [snooze, setSnooze] = useState(5);
  const [ringtone, setRingtone] = useState("Classic");
  const [dnd, setDnd] = useState(true);

  const dark = theme === "dark";

  return (
    <div className={`rounded-[2rem] border-3 border-ink overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors duration-500 ${dark ? "bg-[#111]" : "bg-white"}`}>
      {/* Phone top bar */}
      <div className={`flex justify-between items-center px-5 py-3 border-b-2 ${dark ? "border-white/10" : "border-ink/10"}`}>
        <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? "text-white/30" : "text-ink/30"}`}>MinDrop Settings</span>
        <Settings className={`size-4 ${dark ? "text-white/40" : "text-ink/40"}`} />
      </div>

      <div className="flex flex-col gap-0 p-4 sm:p-5">
        {/* Theme Toggle */}
        <div className={`flex items-center justify-between py-4 border-b ${dark ? "border-white/8" : "border-ink/8"}`}>
          <div className="flex items-center gap-3">
            {dark ? <Moon className="size-4 text-[#818cf8]" /> : <Sun className="size-4 text-amber-500" />}
            <div>
              <p className={`text-sm font-black ${dark ? "text-white" : "text-ink"}`}>App Theme</p>
              <p className={`text-[10px] font-semibold ${dark ? "text-white/30" : "text-ink/30"}`}>{dark ? "Dark" : "Light"} mode is on</p>
            </div>
          </div>
          <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
            className={`relative w-12 h-6 rounded-full border-2 border-ink transition-colors cursor-pointer ${dark ? "bg-[#818cf8]" : "bg-white"}`}>
            <motion.div animate={{ x: dark ? 22 : 2 }}
              className="absolute top-0.5 size-4 bg-ink rounded-full shadow" />
          </button>
        </div>

        {/* Snooze Time */}
        <div className={`flex items-center justify-between py-4 border-b ${dark ? "border-white/8" : "border-ink/8"}`}>
          <div className="flex items-center gap-3">
            <RefreshCw className={`size-4 ${dark ? "text-amber-400" : "text-amber-500"}`} />
            <div>
              <p className={`text-sm font-black ${dark ? "text-white" : "text-ink"}`}>Snooze Duration</p>
              <p className={`text-[10px] font-semibold ${dark ? "text-white/30" : "text-ink/30"}`}>Alarm rings again after {snooze} min</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSnooze(s => Math.max(1, s - 1))}
              className={`size-7 rounded-lg border-2 border-ink font-black text-sm grid place-items-center cursor-pointer transition ${dark ? "bg-white/10 text-white" : "bg-white text-ink"}`}>−</button>
            <span className={`text-sm font-black w-6 text-center ${dark ? "text-white" : "text-ink"}`}>{snooze}</span>
            <button onClick={() => setSnooze(s => Math.min(30, s + 1))}
              className={`size-7 rounded-lg border-2 border-ink font-black text-sm grid place-items-center cursor-pointer transition ${dark ? "bg-white/10 text-white" : "bg-white text-ink"}`}>+</button>
          </div>
        </div>

        {/* Ringtone */}
        <div className={`flex items-center justify-between py-4 border-b ${dark ? "border-white/8" : "border-ink/8"}`}>
          <div className="flex items-center gap-3">
            <Bell className={`size-4 ${dark ? "text-[#FF671F]" : "text-[#FF671F]"}`} />
            <div>
              <p className={`text-sm font-black ${dark ? "text-white" : "text-ink"}`}>Alarm Sound</p>
              <p className={`text-[10px] font-semibold ${dark ? "text-white/30" : "text-ink/30"}`}>Now playing: {ringtone}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {["Classic", "Loud", "Soft"].map(r => (
              <button key={r} onClick={() => setRingtone(r)}
                className={`text-[10px] font-black px-2 py-1 rounded-lg border-2 cursor-pointer transition ${
                  ringtone === r
                    ? "border-[#FF671F] bg-[#FF671F] text-white"
                    : `border-ink/20 ${dark ? "text-white/50" : "text-ink/40"}`
                }`}>{r}</button>
            ))}
          </div>
        </div>

        {/* DND Bypass */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Shield className={`size-4 ${dark ? "text-emerald-400" : "text-emerald-600"}`} />
            <div>
              <p className={`text-sm font-black ${dark ? "text-white" : "text-ink"}`}>Break Through Silent</p>
              <p className={`text-[10px] font-semibold ${dark ? "text-white/30" : "text-ink/30"}`}>{dnd ? "Urgent alarms bypass Silent mode" : "Silent mode blocks all alarms"}</p>
            </div>
          </div>
          <button onClick={() => setDnd(d => !d)}
            className={`relative w-12 h-6 rounded-full border-2 border-ink transition-colors cursor-pointer ${dnd ? "bg-emerald-500" : "bg-white"}`}>
            <motion.div animate={{ x: dnd ? 22 : 2 }}
              className="absolute top-0.5 size-4 bg-ink rounded-full shadow" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
function SettingsDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;

  return (
    <div className="w-full min-h-screen bg-[#F8F7FF] text-ink font-sans overflow-x-hidden">

      {/* ── Sticky Nav ── */}
      <header className="sticky top-0 z-50 bg-[#F8F7FF]/92 backdrop-blur-md border-b-2 border-ink/8">
        <div className="w-[95%] mx-auto h-14 flex items-center justify-between">
          <Link to="/" hash={backHash} viewTransition
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-ink/50 hover:text-ink transition">
            <X className="size-3.5" /> Close
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-7 relative grid place-items-center shrink-0">
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-[#8B5CF6]/30" />
              <motion.div animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="size-5 rounded-md bg-gradient-to-tr from-[#8B5CF6] to-[#c084fc] grid place-items-center relative">
                <span className="text-white font-black text-[9px]">m</span>
              </motion.div>
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-ink/60 hidden sm:block">MinDrop</span>
          </div>
          <Link to="/download"
            className="text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-xl bg-ink text-white border-2 border-ink hover:bg-[#8B5CF6] hover:border-[#8B5CF6] transition">
            Get App
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          SECTION 1 — Opening Scene
      ══════════════════════════════════════════ */}
      <section className="min-h-[88vh] flex flex-col items-center justify-center text-center py-16 sm:py-24">
        <div className="w-[95%] mx-auto flex flex-col items-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-purple-100 px-4 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#8B5CF6] mb-8">
            ⚙️ Your Settings
          </motion.span>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ink/35 leading-relaxed tracking-tight">
            No two people are the same.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ink/35 leading-relaxed tracking-tight mt-1 sm:mt-2">
            Some people sleep lightly and a soft alarm is enough.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ink/35 leading-relaxed tracking-tight mt-1 sm:mt-2">
            Some people need it very, very loud.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55, duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-ink leading-tight tracking-tight mt-5 sm:mt-7">
            MinDrop works your way.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
            className="mt-12 sm:mt-16 flex flex-col items-center gap-2 text-ink/20">
            <p className="text-[10px] font-black uppercase tracking-widest">See what you can change</p>
            <ChevronDown className="size-5 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — The Problem
      ══════════════════════════════════════════ */}
      <section className="bg-[#1E1B4B] text-white py-16 sm:py-24">
        <div className="w-[95%] mx-auto flex flex-col items-center gap-10 sm:gap-14 text-center">
          <FadeUp className="max-w-3xl">
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/25 mb-4">
              Why most apps get this wrong
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              Most apps decide for you.<br />
              <span className="text-[#c084fc]">MinDrop asks you.</span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.08} className="max-w-2xl">
            <p className="text-base sm:text-lg font-semibold text-white/50 leading-relaxed">
              Other reminder apps have one look, one ringtone, one way of doing things. If it does not match how you live, that's your problem. MinDrop believes your phone should work the way you think — not the other way around.
            </p>
          </FadeUp>

          <FadeUp delay={0.14} className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            {[
              { n: "1", label: "Ringtone most reminder apps give you. Take it or leave it." },
              { n: "Fixed", label: "Snooze time in most apps. You cannot change it to fit your life." },
              { n: "None", label: "Options to choose how urgent or quiet your alarms feel." },
            ].map(({ n, label }) => (
              <div key={n} className="bg-white/5 border border-white/8 rounded-2xl p-5 sm:p-6 text-left">
                <p className="text-3xl sm:text-4xl font-black text-[#c084fc]">{n}</p>
                <p className="text-sm font-semibold text-white/40 mt-2 leading-relaxed">{label}</p>
              </div>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — The Playground
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-purple-50">
        <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          <div className="flex-1 w-full">
            <FadeUp>
              <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#8B5CF6] mb-4">
                Play with it right now
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink leading-tight mb-4 sm:mb-5">
                Every setting is yours to change.
              </h2>
              <p className="text-base sm:text-lg font-semibold text-ink/55 leading-relaxed mb-6 sm:mb-8 max-w-lg">
                Toggle the theme. Change the snooze time. Pick a ringtone. Turn DND bypass on or off. These are all live — just like the real app.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  "Switch between light and dark — MinDrop follows your eyes.",
                  "Set how long a snooze lasts — 1 minute or 30, your choice.",
                  "Pick Classic, Loud, or Soft — however you need to be woken.",
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="size-6 rounded-full bg-[#8B5CF6] text-white grid place-items-center shrink-0 text-[11px] font-black mt-0.5">{i + 1}</div>
                    <p className="text-sm sm:text-base font-bold text-ink/65 leading-relaxed">{s}</p>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>

          <FadeUp delay={0.1} className="w-full lg:w-[360px] shrink-0">
            <SettingsPlayground />
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — What You Can Change
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#F8F7FF]">
        <div className="w-[95%] mx-auto">
          <FadeUp className="text-center mb-10 sm:mb-14">
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-ink/25 mb-4">Everything you can adjust</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink leading-tight max-w-2xl mx-auto">
              Here is your full list of controls.
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
            {[
              {
                icon: Bell,
                color: "bg-[#FFF7ED]",
                accent: "text-[#FF671F]",
                title: "Alarm Sound",
                body: "Choose from multiple ringtones — soft, medium, or very loud. Pick whatever makes sure you will actually hear it.",
              },
              {
                icon: RefreshCw,
                color: "bg-purple-50",
                accent: "text-[#8B5CF6]",
                title: "Snooze Length",
                body: "Set how many minutes the snooze gives you before the alarm rings again. Anywhere from 1 to 30 minutes.",
              },
              {
                icon: Moon,
                color: "bg-[#EEF2FF]",
                accent: "text-indigo-500",
                title: "Dark Mode",
                body: "Switch between a bright white screen and a dark one. Great for late nights when you don't want a bright screen in your face.",
              },
              {
                icon: Shield,
                color: "bg-[#F0FDF4]",
                accent: "text-emerald-600",
                title: "Break Through Silent Mode",
                body: "Choose which alarms can ring even when your phone is on silent. You decide which ones are urgent enough.",
              },
              {
                icon: Sliders,
                color: "bg-amber-50",
                accent: "text-amber-600",
                title: "Alarm Volume",
                body: "Set the alarm volume separately from your phone's main volume. So a loud alarm doesn't mean a loud phone all day.",
              },
              {
                icon: Smartphone,
                color: "bg-pink-50",
                accent: "text-pink-600",
                title: "Vibration Pattern",
                body: "Turn vibration on or off for alarms. Or set it to vibrate only — useful when you are in a quiet place like a hospital.",
              },
            ].map(({ icon: Icon, color, accent, title, body }) => (
              <FadeUp key={title}>
                <div className={`${color} border-3 border-ink rounded-[1.75rem] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3 h-full`}>
                  <Icon className={`size-6 ${accent}`} />
                  <h3 className="text-base sm:text-lg font-black text-ink">{title}</h3>
                  <p className="text-sm font-semibold text-ink/55 leading-relaxed">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — Profiles
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#1E1B4B] overflow-hidden">
        <div className="w-[95%] mx-auto mb-10 sm:mb-14 text-center">
          <FadeUp>
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/25 mb-4">
              Made for different people
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight max-w-2xl mx-auto">
              Whether you are a light sleeper or a heavy one — MinDrop has a setting for you.
            </h2>
          </FadeUp>
        </div>

        <div className="flex gap-4 sm:gap-5 overflow-x-auto pl-[2.5%] pr-[2.5%] pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}>
          {[
            { emoji: "🛌", title: "The Deep Sleeper", desc: "Set the loudest ringtone, maximum volume, and 60-second snooze. MinDrop will not let you sleep through it.", color: "bg-indigo-50" },
            { emoji: "👩‍💼", title: "The Busy Professional", desc: "Quiet vibration during the day. Loud looping alarm for your evening medication. Different rules for different times.", color: "bg-purple-50" },
            { emoji: "👴", title: "The Older Parent", desc: "Big, simple alarm. A long ringtone. No complicated interface. Just ring and done.", color: "bg-amber-50" },
            { emoji: "🎧", title: "The Headphone Wearer", desc: "Set alarms to ring through your earbuds when they are connected. So you never miss it even with your phone in your pocket.", color: "bg-green-50" },
            { emoji: "🤫", title: "The Library Type", desc: "Vibrate only. No sound at all. MinDrop still taps your wrist firmly until you acknowledge it.", color: "bg-red-50" },
          ].map(({ emoji, title, desc, color }) => (
            <div key={title} className="snap-start shrink-0 w-60 sm:w-72">
              <div className={`rounded-[1.75rem] border-3 border-ink p-5 sm:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${color} flex flex-col gap-4`}>
                <span className="text-3xl">{emoji}</span>
                <div>
                  <p className="text-xs font-black text-ink/40 uppercase tracking-wider mb-1">{title}</p>
                  <p className="text-sm sm:text-base font-black text-ink leading-snug">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6 — Closer
      ══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-[#F8F7FF] text-center">
        <div className="w-[95%] mx-auto flex flex-col items-center gap-7 sm:gap-8">
          <FadeUp>
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-ink/25 mb-4 sm:mb-6">
              An app that adapts to you
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-tight max-w-3xl mx-auto">
              Set it up once. It works your way — forever.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1} className="max-w-xl">
            <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/45 leading-relaxed">
              MinDrop remembers all your preferences. Once you set it the way you like, you never have to touch it again. It just works, quietly and reliably, exactly how you need it to.
            </p>
          </FadeUp>
          <FadeUp delay={0.18} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto">
            <Link to="/download"
              className="px-8 sm:px-10 py-4 bg-ink text-white font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#8B5CF6] hover:border-[#8B5CF6] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
              Download MinDrop — It's Free
            </Link>
            <Link to="/" hash={backHash} viewTransition
              className="px-8 sm:px-10 py-4 bg-white text-ink font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-purple-50 transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
              See All Features
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t-2 border-ink/10 bg-purple-50 py-5 sm:py-6">
        <div className="w-[95%] mx-auto flex flex-wrap justify-between items-center gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-ink/25">MinDrop · Settings · Made for You</span>
          <div className="flex gap-4 sm:gap-5">
            <Link to="/privacy" className="text-xs font-black text-ink/35 hover:text-ink transition">Privacy</Link>
            <Link to="/terms" className="text-xs font-black text-ink/35 hover:text-ink transition">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
