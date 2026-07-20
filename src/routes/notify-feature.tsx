import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BellRing, Check, X, Filter, Volume2, Bell,
  ChevronDown, CreditCard, MessageSquare, ShoppingBag, Banknote, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/notify-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "Smart Filters — MinDrop" },
      { name: "description", content: "MinDrop watches your incoming alerts and turns the ones that really matter into loud, looping alarms. So the important ones never get buried." },
    ],
  }),
  component: NotifyDetailView,
});

/* ──────────────────────────────────────────────
   SUBTLE STEP ILLUSTRATIONS
────────────────────────────────────────────── */
function AlertArrives() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ rotate: [-6, 6, -6], y: [0, -6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="size-20 sm:size-24 bg-[#FEF3C7] border-3 border-[#F59E0B] rounded-3xl grid place-items-center shadow-lg text-[#78350F]"
      >
        <Bell className="size-10 stroke-[2.5px]"/>
      </motion.div>
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 2.0], opacity: [0.35, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 1.25 }}
          className="absolute size-24 border-2 border-[#F59E0B] rounded-full"
        />
      ))}
    </div>
  );
}

function ChecksMatches() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="size-20 sm:size-24 bg-white border-3 border-[#F59E0B] rounded-3xl grid place-items-center shadow-lg text-[#F59E0B]"
      >
        <Filter className="size-10 stroke-[2.5px]"/>
      </motion.div>
      {/* Scanning bar */}
      <motion.div
        animate={{ y: [-24, 24, -24] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        className="absolute w-24 h-1.5 bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.8)] rounded-full z-20"
      />
    </div>
  );
}

function RingingAlarmIcon() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ rotate: [-6, 6, -6], scale: [1, 1.05, 1] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatType: "reverse" }}
        className="size-20 sm:size-24 bg-[#F59E0B] border-3 border-[#78350F] rounded-3xl grid place-items-center z-10 shadow-[0_0_30px_rgba(245,158,11,0.3)] text-white"
      >
        <Volume2 className="size-10 stroke-[2.5px]"/>
      </motion.div>
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 2.0], opacity: [0.4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6 }}
          className="absolute size-28 border border-[#F59E0B] rounded-full"
        />
      ))}
    </div>
  );
}

function SilentBell() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <div className="size-20 sm:size-24 bg-white border-3 border-[#F59E0B]/30 rounded-3xl grid place-items-center shadow-md text-[#78350F]/30 relative z-10">
        <Bell className="size-10 stroke-[2px]"/>
        <div className="absolute w-24 h-1.5 bg-[#78350F]/20 rotate-45 rounded-full" />
      </div>
    </div>
  );
}

/* ─── Notification flood demo ─── */
function NotificationFlood() {
  const [visible, setVisible] = useState<number[]>([]);
  const notifs = [
    { icon: "💬", app: "WhatsApp Group", text: "Rahul sent a meme 😂", color: "bg-[#FFFDF5] border-[#F59E0B]/20" },
    { icon: "🛒", app: "Swiggy Offer", text: "60% off your next order!", color: "bg-[#FEF3C7]/40 border-[#F59E0B]/20" },
    { icon: "🏦", app: "HDFC Bank", text: "₹15,000 debited from your account", color: "bg-[#FEF3C7] border-[#F59E0B]/40", important: true },
    { icon: "📱", app: "Instagram", text: "Priya liked your photo", color: "bg-[#FFFDF5] border-[#F59E0B]/20" },
    { icon: "🛍️", app: "Amazon Sale", text: "Today only — 80% off!", color: "bg-[#FDE68A]/30 border-[#F59E0B]/30" },
  ];

  useEffect(() => {
    setVisible([]);
    notifs.forEach((_, i) => {
      setTimeout(() => setVisible(v => [...v, i]), i * 400 + 300);
    });
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      {notifs.map((n, i) => (
        <AnimatePresence key={i}>
          {visible.includes(i) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className={`flex items-center gap-4 border rounded-[1.25rem] px-5 py-3 sm:py-4 ${n.color} ${n.important ? "ring-3 ring-[#F59E0B]" : ""}`}>
              <span className="text-xl sm:text-2xl">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-black text-[#78350F]/50 uppercase tracking-wide">{n.app}</p>
                <p className={`text-xs sm:text-sm md:text-base font-bold leading-snug truncate ${n.important ? "text-[#78350F]" : "text-[#78350F]/70"}`}>{n.text}</p>
              </div>
              {n.important && (
                <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}
                  className="text-[9px] sm:text-xs font-black text-[#78350F] bg-[#FEF3C7] px-2.5 py-1 rounded-full shrink-0">
                  IMPORTANT
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}

/* ─── Filter Simulator ─── */
function FilterSimulator() {
  const rules = [
    { id: "bank", label: "Bank alerts (debit / credit)", emoji: "🏦" },
    { id: "upi", label: "UPI payment messages", emoji: "💳" },
    { id: "promo", label: "Sale and discount offers", emoji: "🛒" },
    { id: "social", label: "Likes, comments, follows", emoji: "📱" },
  ];

  const [active, setActive] = useState<string[]>(["bank", "upi"]);
  const toggle = (id: string) =>
    setActive(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <p className="text-xs font-black uppercase tracking-widest text-[#78350F]/40">
        Which alerts should wake you up?
      </p>
      <div className="flex flex-col gap-2">
        {rules.map(r => (
          <button key={r.id} onClick={() => toggle(r.id)}
            className={`flex items-center gap-4 px-4 py-3 sm:py-3.5 rounded-2xl border-3 text-left transition cursor-pointer ${
              active.includes(r.id)
                ? "border-[#F59E0B] bg-[#FEF3C7] shadow-[3px_3px_0px_0px_rgba(245,158,11,0.3)]"
                : "border-[#F59E0B]/20 bg-white"
            }`}>
            <span className="text-xl sm:text-2xl">{r.emoji}</span>
            <p className={`flex-1 text-xs sm:text-sm md:text-base font-bold ${active.includes(r.id) ? "text-[#78350F]" : "text-[#78350F]/40"}`}>{r.label}</p>
            {active.includes(r.id) && <Volume2 className="size-4.5 text-[#F59E0B] shrink-0" />}
          </button>
        ))}
      </div>
      <div className={`rounded-2xl border-3 px-4 py-3 transition-all ${active.length > 0 ? "border-[#F59E0B]/40 bg-[#FFFBEB]" : "border-[#F59E0B]/10 bg-white"}`}>
        <p className="text-xs sm:text-sm font-black text-[#78350F] leading-tight">
          {active.length === 0
            ? "No filters active. All alerts behave normally."
            : `${active.length} filter${active.length > 1 ? "s" : ""} active. Those will ring as a looping alarm.`}
        </p>
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
    <div className="h-full bg-[#FFFBEB] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/20 bg-[#FEF3C7] px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706] mb-8 sm:mb-12">
        🔔 Smart Filters
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "Your phone got 47 notifications today.",
          "One said ₹18,000 was debited.",
        ].map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#D97706]/45 leading-tight tracking-tight">
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#78350F] leading-none tracking-tighter">
        You saw it 4 hours later.
      </motion.p>
    </div>
  );
}

/* Slide 2: The Noise Problem */
function SlideProblem() {
  return (
    <div className="h-full bg-[#451A03] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#FDE68A]/30 mb-4">
            Why everything gets lost in your phone
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 sm:mb-8 tracking-tight">
            Every app shouts.<br />
            <span className="text-[#F59E0B]">The important ones get lost</span> in the crowd.
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#FEF3C7]/60 leading-relaxed max-w-lg">
            Sales offers, group chats, likes, reminders, cricket scores — they all arrive looking exactly the same. Your brain tunes them all out. Including the one that actually needed your attention.
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-center gap-4 w-full lg:w-auto">
          <NotificationFlood />
          <p className="text-[10px] sm:text-xs font-black text-[#FEF3C7]/20 uppercase tracking-widest">All alerts look identical</p>
        </div>
      </div>
    </div>
  );
}

/* Slide 3: What MinDrop Does */
function SlideDifference() {
  return (
    <div className="h-full bg-[#FFFBEB] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 sm:gap-12 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706] mb-4">
            How MinDrop handles this
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#78350F] leading-tight tracking-tight">
            MinDrop watches your alerts.<br />
            <span className="text-[#F59E0B]">The important ones</span> become an alarm.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[
            { icon: "🎯", title: "You Decide What Matters", body: "Choose which types of messages wake you up. Sales offers stay silent. Your bank alerts ring loudly." },
            { icon: "📴", title: "Bypasses Silent Mode", body: "When your phone is on silent, important alerts still ring through. Nothing slips past unnoticed." },
            { icon: "🔒", title: "Stays on Your Phone", body: "MinDrop reads your alerts right there on your phone. Nothing is sent to any server. Your messages stay private." },
          ].map(({ icon, title, body }) => (
            <div key={title} className="bg-white border-3 border-[#F59E0B] rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(120,53,15,0.15)] text-left flex flex-col gap-3">
              <span className="text-3xl sm:text-4xl">{icon}</span>
              <h3 className="text-base sm:text-lg md:text-xl font-black text-[#78350F]">{title}</h3>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-[#78350F]/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Build Your Filter */
function SlidePlayground() {
  return (
    <div className="h-full bg-[#FEF3C7] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-20 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706] mb-4">
            Build your filter rules
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#78350F] leading-tight mb-4 sm:mb-6 tracking-tight">
            Set it once. Then forget it.
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#78350F]/75 leading-relaxed mb-6 sm:mb-8 max-w-md">
            Pick the types of alerts that should never be missed. MinDrop takes care of the rest. Toggle the options to see rule changes.
          </p>
          <div className="flex flex-col gap-3.5">
            {[
              "Toggle on alerts you want to hear.",
              "MinDrop watches for matching notifications.",
              "Urgent alerts trigger a looping phone ring.",
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3.5">
                <div className="size-6 sm:size-7 rounded-full bg-[#F59E0B] text-white grid place-items-center shrink-0 text-xs font-black">{i+1}</div>
                <p className="text-sm sm:text-base md:text-lg font-bold text-[#78350F]/80 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          <FilterSimulator />
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
      case 1: return <AlertArrives />;
      case 2: return <ChecksMatches />;
      case 3: return <RingingAlarmIcon />;
      case 4: return <SilentBell />;
      default: return null;
    }
  };

  return (
    <div className={`h-full ${color} flex items-center justify-center px-6 relative overflow-hidden`}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[240px] sm:text-[340px] md:text-[440px] lg:text-[540px] font-black text-[#F59E0B]/5 leading-none select-none pointer-events-none pl-4">
        {step}
      </div>

      <div className="w-[95%] mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#78350F]/40 mb-4 sm:mb-5">
            Step {stepNum} of {TOTAL_STEPS} · How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#78350F] leading-tight mb-4 sm:mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#78350F]/70 leading-relaxed">
            {detail}
          </p>

          <div className="flex gap-2.5 mt-8 sm:mt-12">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i}
                className={`h-1.5 rounded-full transition-all ${i === stepNum - 1 ? "w-14 bg-[#F59E0B]" : "w-4 bg-[#F59E0B]/20"}`}/>
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

/* Slide 9: Scenario Carousel */
function SlideScenarios() {
  const [cardIdx, setCardIdx] = useState(0);

  const scenarios = [
    { icon: Banknote, title: "Money Movement", scene: "₹18,000 was just taken from your account. You need to know this the moment it happens.", color: "bg-[#FFFBEB]" },
    { icon: CreditCard, title: "UPI Payment", scene: "Someone sent you money via UPI. Or charged your card. Either way, this cannot sit unread.", color: "bg-[#FEF3C7]" },
    { icon: MessageSquare, title: "That One Person", scene: "Your child messaged you. Your doctor sent a reply. Not every message is equal — and now they won't be treated equally.", color: "bg-[#FDE68A]/60" },
    { icon: ShoppingBag, title: "Order Going Wrong", scene: "Your delivery was cancelled. Your return was rejected. These need your attention right now, not tomorrow.", color: "bg-[#FFFBEB]" },
    { icon: Bell, title: "Any Alert You Choose", scene: "You are not limited to our list. Add any keyword, any app name, any amount. You are in full control.", color: "bg-[#FEF3C7]" },
  ];

  const prev = () => setCardIdx(i => Math.max(0, i - 1));
  const next = () => setCardIdx(i => Math.min(scenarios.length - 1, i + 1));

  return (
    <div className="h-full bg-[#451A03] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 sm:gap-10 max-w-3xl">
        <div className="text-center">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#FEF3C7]/30 mb-4">
            Moments this saves you
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            These are the alerts that cannot wait.
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
              className={`w-full rounded-[2rem] border-3 border-[#F59E0B] p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.4)] ${scenarios[cardIdx].color} flex flex-col gap-6`}>
              <div className="size-14 bg-white border-2 border-[#F59E0B] rounded-xl grid place-items-center shadow-[4px_4px_0px_0px_rgba(245,158,11,0.2)]">
                {(() => { const Icon = scenarios[cardIdx].icon; return <Icon className="size-7 text-[#78350F]"/>; })()}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-[#78350F] uppercase tracking-wider mb-2">{scenarios[cardIdx].title}</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-[#78350F] leading-snug tracking-tight">{scenarios[cardIdx].scene}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-5">
          <button onClick={prev} disabled={cardIdx === 0}
            className="size-11 sm:size-12 rounded-full border-2 border-[#F59E0B]/30 bg-white/5 grid place-items-center text-[#FEF3C7]/60 hover:text-white hover:bg-white/10 disabled:opacity-25 transition cursor-pointer">
            <ChevronLeft className="size-5"/>
          </button>
          <div className="flex gap-2.5">
            {scenarios.map((_, i) => (
              <button key={i} onClick={() => setCardIdx(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${i === cardIdx ? "w-8 h-2 bg-[#F59E0B]" : "size-2.5 bg-[#FEF3C7]/30 hover:bg-white/50"}`}/>
            ))}
          </div>
          <button onClick={next} disabled={cardIdx === scenarios.length - 1}
            className="size-11 sm:size-12 rounded-full border-2 border-[#F59E0B]/30 bg-white/5 grid place-items-center text-[#FEF3C7]/60 hover:text-white hover:bg-white/10 disabled:opacity-25 transition cursor-pointer">
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
    <div className="h-full bg-[#FFFBEB] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 sm:gap-10 max-w-4xl">
        <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#78350F]/55">
          Stop treating all alerts the same
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#78350F] leading-none tracking-tighter">
          Some things demand your attention. Others don't.
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#78350F]/60 leading-relaxed max-w-2xl">
          MinDrop gives your truly important alerts a voice loud enough to be heard — and keeps everything else quiet, just the way you like it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link to="/download"
            className="px-10 sm:px-12 py-4.5 sm:py-5 bg-ink text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#F59E0B] hover:border-[#F59E0B] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Download MinDrop — Free
          </Link>
          <Link to="/" hash={backHash} viewTransition
            className="px-10 sm:px-12 py-4.5 sm:py-5 bg-white text-ink font-black text-sm sm:text-base uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FEF3C7] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
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
function NotifyDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;

  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const lastScrollTime = useRef(0);

  const STEPS = [
    {
      step: "01", stepNum: 1, color: "bg-[#FFFBEB]",
      title: "An alert arrives on your phone.",
      detail: "This could be anything — a WhatsApp message, a bank SMS, an Instagram like. It arrives the same way it always does.",
    },
    {
      step: "02", stepNum: 2, color: "bg-[#FEF3C7]/40",
      title: "MinDrop checks if it matches your filters.",
      detail: "In less than a second, MinDrop reads the alert and checks if it matches the types you said matter to you. This all happens right on your phone — nothing leaves it.",
    },
    {
      step: "03", stepNum: 3, color: "bg-[#FFFBEB]",
      title: "If it matches, the alarm rings.",
      detail: "Instead of a quiet banner, your phone starts ringing — just like a phone call. It does not stop until you see it and decide what to do.",
    },
    {
      step: "04", stepNum: 4, color: "bg-[#FEF3C7]/40",
      title: "If it does not match, nothing changes.",
      detail: "Promos, chats, random updates — they behave exactly as they always did. Silent when you want silence. MinDrop only acts on what you told it to watch.",
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
    if (now - lastScrollTime.current < 1100) return;
    lastScrollTime.current = now;
    setCurrent(idx);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 35) return;
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
      style={{ viewTransitionName: "card-notify" } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <header className="shrink-0 border-b-2 border-[#F59E0B]/10 z-50"
        style={{ backgroundColor: isDark ? "rgba(69,26,3,0.96)" : "rgba(255,251,235,0.96)", backdropFilter: "blur(12px)", transition: "background-color 0.4s ease" }}>
        <div className="w-[95%] mx-auto h-14 flex items-center justify-between">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition ${isDark ? "text-[#FEF3C7]/60 hover:text-white" : "text-[#D97706]/60 hover:text-[#78350F]"}`}>
            <X className="size-3.5"/> Close
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-7 relative grid place-items-center shrink-0">
              <motion.div animate={{scale:[1,1.5,1],opacity:[0.2,0,0.2]}} transition={{duration:3,repeat:Infinity}}
                className="absolute inset-0 rounded-full border border-[#F59E0B]/30"/>
              <motion.div animate={{y:[0,-2,0]}} transition={{duration:3,repeat:Infinity}}
                className="size-5 rounded-md bg-gradient-to-tr from-[#F59E0B] to-[#FEF3C7] grid place-items-center relative">
                <span className="text-white font-black text-[9px]">m</span>
              </motion.div>
            </div>
            <span className={`text-xs font-black uppercase tracking-wider hidden sm:block transition ${isDark ? "text-[#FEF3C7]/70" : "text-[#D97706]/70"}`}>MinDrop</span>
          </div>
          <Link to="/download"
            className={`text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-xl border-2 transition ${isDark ? "bg-white text-ink border-white hover:bg-[#F59E0B] hover:text-white hover:border-[#F59E0B]" : "bg-ink text-white border-ink hover:bg-[#F59E0B] hover:border-[#F59E0B]"}`}>
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
            className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 z-20 cursor-pointer group"
          >
            <ChevronDown className={`size-3.5 rotate-180 transition group-hover:-translate-y-0.5 ${isDark ? "text-[#FEF3C7]/30 group-hover:text-white" : "text-[#D97706]/30 group-hover:text-[#78350F]"}`} />
            <span className={`text-[9px] font-black uppercase tracking-widest transition ${isDark ? "text-[#FEF3C7]/30 group-hover:text-white" : "text-[#D97706]/30 group-hover:text-[#78350F]"}`}>
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
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 z-20 cursor-pointer group"
          >
            <span className={`text-[9px] font-black uppercase tracking-widest transition ${isDark ? "text-[#FEF3C7]/30 group-hover:text-white" : "text-[#D97706]/30 group-hover:text-[#78350F]"}`}>
              scroll or ↓
            </span>
            <ChevronDown className={`size-3.5 transition group-hover:translate-y-0.5 ${isDark ? "text-[#FEF3C7]/30 group-hover:text-white" : "text-[#D97706]/30 group-hover:text-[#78350F]"}`} />
          </button>
        )}

        {/* ── Right Dot Navigation ── */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-30">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "w-1.5 h-7 bg-[#F59E0B]"
                  : isDark
                    ? "size-1.5 bg-[#FEF3C7]/25 hover:bg-[#FEF3C7]/60"
                    : "size-1.5 bg-[#D97706]/25 hover:bg-[#D97706]/50"
              }`}
            />
          ))}
          <p className={`text-[9px] font-black mt-1 tabular-nums transition ${isDark ? "text-[#FEF3C7]/30" : "text-[#D97706]/30"}`}>
            {current + 1}/{TOTAL}
          </p>
        </div>
      </div>
    </div>
  );
}
