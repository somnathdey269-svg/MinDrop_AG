import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import {
  Bell, ShieldAlert, Sparkles, Filter, ChevronLeft, ChevronRight, Check, X, SlidersHorizontal, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/notify-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "Smart Notification Rules — MinDrop Feature" },
      { name: "description", content: "Learn how MinDrop converts high-priority notifications (bank alerts, family texts) into loud alarms while keeping sales spam quiet." },
    ],
  }),
  component: NotifyFeatureDetailView,
});

/* Slide 1: Opening Statement */
function SlideOpening() {
  return (
    <div className="h-full bg-[#FFFBEB] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/20 bg-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706] mb-8 sm:mb-12 shadow-sm">
        🔔 CHAPTER 01/05 · SMART NOTIFICATION
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "Your phone got 47 notifications today.",
          "One said ₹18,000 was debited.",
        ].map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#D97706]/60 leading-tight tracking-tight">
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

/* Slide 2: The Core Conflict (Dark Theme) */
function SlideConflict() {
  return (
    <div className="h-full bg-[#451A03] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#FDE68A] mb-4">
            The Problem
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 sm:mb-8 tracking-tight">
            Not all notifications are equal.<br />
            <span className="text-[#F59E0B]">Why treat them the same?</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#FEF3C7] leading-relaxed max-w-lg">
            A 50% discount offer gets the exact same ping sound as an unauthorized bank debit alert. Your phone cannot distinguish between noise and an emergency — so it treats everything like noise.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-[#F59E0B]/30 bg-white/5 backdrop-blur-md shadow-2xl">
          <Bell className="size-28 sm:size-36 text-[#F59E0B]" />
        </div>
      </div>
    </div>
  );
}

/* Slide 3: The MinDrop Solution */
function SlideSolution() {
  return (
    <div className="h-full bg-[#FFFBEB] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 sm:gap-12 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706] mb-4">
            How MinDrop Handles This
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#78350F] leading-tight tracking-tight">
            MinDrop watches your alerts.<br className="hidden sm:block"/>
            <span className="text-[#D97706]">The important ones become an alarm.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[
            { icon: Filter, title: "You Decide What Matters", body: "Choose which types of messages wake you up. Sales offers stay silent. Your bank alerts ring loudly." },
            { icon: ShieldAlert, title: "Bypasses Silent Mode", body: "When your phone is on silent, important alerts still ring through. Nothing slips past unnoticed." },
            { icon: Sparkles, title: "Stays on Your Phone", body: "MinDrop reads your alerts right there on your phone. Nothing is sent to any server. Your messages stay private." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white border-3 border-[#F59E0B] rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(120,53,15,0.15)] text-left flex flex-col gap-3">
              <div className="size-12 rounded-2xl bg-[#FEF3C7] grid place-items-center text-[#D97706]">
                <Icon className="size-6 stroke-[2.5px]" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#78350F]">{title}</h3>
              <p className="text-sm sm:text-base font-semibold text-[#78350F]/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Interactive Rule Builder Demo */
function SlideInteractiveBuilder() {
  const [keyword, setKeyword] = useState("DEBITED");
  const [selectedApp, setSelectedApp] = useState("Bank / HDFC");
  const [volumeLevel, setVolumeLevel] = useState("Maximum (Loud)");
  const [saved, setSaved] = useState(false);

  const presets = [
    { label: "Bank Debits", kw: "DEBITED", app: "Bank SMS", vol: "Maximum (Loud)" },
    { label: "Family Emergency", kw: "URGENT", app: "WhatsApp", vol: "Medium" },
    { label: "OTP Code", kw: "OTP", app: "Messages", vol: "Soft Tone" },
  ];

  return (
    <div className="h-full bg-[#FEF3C7] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706] mb-3">
            Interactive Rule Engine
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#78350F] leading-tight mb-4 tracking-tight">
            Create your first notification filter rule right now.
          </h2>
          <p className="text-base sm:text-lg font-semibold text-[#78350F]/75 leading-relaxed mb-6">
            Tell MinDrop which app to watch and what magic word turns a standard message into a full-screen alarm.
          </p>

          <div className="flex flex-wrap gap-2.5">
            {presets.map((p) => (
              <button key={p.label} onClick={() => { setKeyword(p.kw); setSelectedApp(p.app); setVolumeLevel(p.vol); setSaved(false); }}
                className={`px-4 py-2 rounded-full border-2 border-[#78350F] font-black text-xs uppercase tracking-wider transition cursor-pointer ${
                  keyword === p.kw ? "bg-[#78350F] text-white" : "bg-white text-[#78350F] hover:bg-[#FEF3C7]"
                }`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[440px] bg-white border-3 border-[#78350F] rounded-[2.5rem] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.2)] text-left flex flex-col gap-5">
          <div className="flex items-center justify-between border-b-2 border-[#FEF3C7] pb-4">
            <span className="font-black text-sm uppercase tracking-wider text-[#78350F] flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-[#D97706]" /> Rule Configuration
            </span>
            <span className="text-xs font-bold text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full">ACTIVE</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase text-[#78350F]/70">Target Application</label>
            <input type="text" value={selectedApp} onChange={(e) => { setSelectedApp(e.target.value); setSaved(false); }}
              className="w-full border-2 border-[#78350F]/20 rounded-xl px-4 py-2.5 text-sm font-bold text-[#78350F] focus:outline-none focus:border-[#D97706]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase text-[#78350F]/70">Trigger Keyword</label>
            <input type="text" value={keyword} onChange={(e) => { setKeyword(e.target.value.toUpperCase()); setSaved(false); }}
              className="w-full border-2 border-[#78350F]/20 rounded-xl px-4 py-2.5 text-sm font-black text-[#D97706] uppercase tracking-wider focus:outline-none focus:border-[#D97706]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase text-[#78350F]/70">Alarm Volume Behavior</label>
            <select value={volumeLevel} onChange={(e) => { setVolumeLevel(e.target.value); setSaved(false); }}
              className="w-full border-2 border-[#78350F]/20 rounded-xl px-4 py-2.5 text-sm font-bold text-[#78350F] focus:outline-none focus:border-[#D97706]">
              <option>Maximum (Loud)</option>
              <option>Medium</option>
              <option>Soft Tone</option>
            </select>
          </div>

          <button onClick={() => setSaved(true)}
            className="mt-2 w-full py-3.5 bg-[#78350F] text-white font-black text-sm uppercase tracking-wider rounded-xl border-2 border-[#78350F] hover:bg-[#D97706] hover:border-[#D97706] transition flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]">
            {saved ? <><Check className="size-4" /> Rule Saved to Local Device</> : "Test & Save Rule"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Slide 5: Real-World Use Cases Carousel */
function SlideScenarios() {
  const [cardIdx, setCardIdx] = useState(0);

  const scenarios = [
    {
      title: "Bank & Transaction Debits",
      desc: "Set MinDrop to listen for words like 'debited', 'spent', or 'withdrawal'. If a suspicious transaction happens at midnight, MinDrop rings out loud even on DND.",
      kw: "DEBITED / WITHDRAWAL",
      app: "SMS Messages",
      color: "bg-[#FFFBEB]",
      borderColor: "border-[#F59E0B]",
    },
    {
      title: "Family Emergency Messages",
      desc: "Specify your spouse or parent's name with words like 'urgent' or 'hospital'. Never miss a family priority while silencing work group chatter.",
      kw: "URGENT / EMERGENCY",
      app: "WhatsApp / iMessage",
      color: "bg-[#FEF3C7]",
      borderColor: "border-[#D97706]",
    },
    {
      title: "Time-Sensitive OTPs",
      desc: "Need an OTP while stepping away from your phone? Escalate verification codes into distinct audible chime sounds so you never miss a 10-minute expiry window.",
      kw: "OTP / CODE",
      app: "Bank Apps & SMS",
      color: "bg-[#FFFBEB]",
      borderColor: "border-[#B45309]",
    },
  ];

  const prev = () => setCardIdx(i => Math.max(0, i - 1));
  const next = () => setCardIdx(i => Math.min(scenarios.length - 1, i + 1));

  return (
    <div className="h-full bg-[#FFFBEB] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 max-w-5xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706] mb-2">
            Real-World Protection Scenarios
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#78350F] leading-tight tracking-tight">
            How people rely on MinDrop notification rules.
          </h2>
        </div>

        <div className="w-full relative overflow-hidden min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={cardIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={`w-full rounded-[2.5rem] border-3 ${scenarios[cardIdx].borderColor} p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.15)] ${scenarios[cardIdx].color} text-left flex flex-col gap-6`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-black uppercase tracking-widest text-[#D97706] bg-white border border-[#D97706]/30 px-3.5 py-1 rounded-full shadow-sm">
                  {scenarios[cardIdx].app}
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-[#78350F] bg-[#FEF3C7] border border-[#78350F]/20 px-3.5 py-1 rounded-full">
                  KEYWORD: {scenarios[cardIdx].kw}
                </span>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#78350F] mb-3">{scenarios[cardIdx].title}</h3>
                <p className="text-base sm:text-xl font-semibold text-[#78350F]/80 leading-relaxed">{scenarios[cardIdx].desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-5">
          <button onClick={prev} disabled={cardIdx === 0}
            className="size-12 rounded-full border-2 border-[#78350F] bg-white text-[#78350F] grid place-items-center disabled:opacity-30 hover:bg-[#FEF3C7] transition cursor-pointer shadow-sm">
            <ChevronLeft className="size-6" />
          </button>
          <div className="flex gap-2">
            {scenarios.map((_, i) => (
              <button key={i} onClick={() => setCardIdx(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${i === cardIdx ? "w-8 h-2.5 bg-[#D97706]" : "size-2.5 bg-[#D97706]/30 hover:bg-[#D97706]/60"}`} />
            ))}
          </div>
          <button onClick={next} disabled={cardIdx === scenarios.length - 1}
            className="size-12 rounded-full border-2 border-[#78350F] bg-white text-[#78350F] grid place-items-center disabled:opacity-30 hover:bg-[#FEF3C7] transition cursor-pointer shadow-sm">
            <ChevronRight className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* Slide 6: Rule Types Grid */
function SlideRuleTypes() {
  return (
    <div className="h-full bg-[#FEF3C7] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706] mb-2">
            Engineered For Precision
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#78350F] leading-tight tracking-tight">
            Four powerful matching modes.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left">
          {[
            { tag: "Exact Match", title: "Literal Keyword Match", body: "Triggers when exact text strings appear in title or message body (e.g. 'DEBITED')." },
            { tag: "Contact Filter", title: "Sender Identification", body: "Restricts notification alerts to specific contacts or sender names while ignoring general broadcasts." },
            { tag: "Volume Boost", title: "Silent Mode Override", body: "Bypasses system DND settings to play a loud ringtone for critical emergency alerts." },
            { tag: "Auto-Dismiss", title: "Spam Suppression", body: "Automatically marks promotional notifications as read so your notification drawer stays clean." },
          ].map(({ tag, title, body }) => (
            <div key={title} className="bg-white border-3 border-[#78350F] rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(120,53,15,0.15)] flex flex-col gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full w-fit">{tag}</span>
              <h3 className="text-lg sm:text-xl font-black text-[#78350F]">{title}</h3>
              <p className="text-sm sm:text-base font-semibold text-[#78350F]/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 7: Technical Security & On-Device Parsing */
function SlideSecurity() {
  return (
    <div className="h-full bg-[#451A03] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#FDE68A] mb-4">
            Zero Telemetry Security Guarantee
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
            100% On-Device Parsing.<br />
            <span className="text-[#F59E0B]">No Cloud Transmission.</span>
          </h2>
          <p className="text-base sm:text-lg font-semibold text-[#FEF3C7] leading-relaxed mb-6">
            MinDrop processes your notification stream strictly within Android's local memory. Your messages, OTPs, and bank transactions are never sent to external servers or stored on remote databases.
          </p>
          <div className="inline-flex items-center gap-2 bg-white border-2 border-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider text-[#78350F] shadow-sm">
            <ShieldAlert className="size-4 text-[#D97706]" /> Local SQLite Encrypted Storage
          </div>
        </div>
        <div className="shrink-0 flex items-center justify-center size-56 sm:size-72 rounded-[2.5rem] border-3 border-[#F59E0B]/30 bg-white/5 backdrop-blur-md shadow-2xl">
          <Filter className="size-28 sm:size-36 text-[#F59E0B]" />
        </div>
      </div>
    </div>
  );
}

/* Slide 8: FAQs */
function SlideFAQ() {
  const faqs = [
    { q: "Does MinDrop read all my notifications?", a: "MinDrop only inspects notification titles and text against your custom keyword rules locally on your phone. Nothing leaves your device." },
    { q: "Will this drain my battery?", a: "No. MinDrop uses native Android NotificationListenerService, consuming under 1% battery per day." },
    { q: "What if my phone is on silent mode?", a: "MinDrop can be configured to request DND policy permission to ring loudly for high-priority matching rules." },
  ];

  return (
    <div className="h-full bg-[#FFFBEB] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 max-w-4xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#D97706] mb-2">
            Common Questions
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#78350F] leading-tight tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4 w-full text-left">
          {faqs.map(({ q, a }) => (
            <div key={q} className="bg-white border-3 border-[#78350F] rounded-[2rem] p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(120,53,15,0.15)] flex flex-col gap-2">
              <h3 className="text-lg sm:text-xl font-black text-[#78350F]">{q}</h3>
              <p className="text-sm sm:text-base font-semibold text-[#78350F]/75 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 9: Motivated Transition Bridge to Chapter 02 (Location Reminder) */
function SlideCloser() {
  return (
    <div className="h-full bg-[#FFFBEB] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-[#FEF3C7] px-5 py-2 text-xs font-black uppercase tracking-widest text-[#D97706] shadow-sm">
          <Sparkles className="size-4" /> UP NEXT · CHAPTER 02
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#78350F] leading-none tracking-tighter">
          What happens when tasks depend on location?
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#78350F]/60 leading-relaxed max-w-2xl">
          Filtered alerts protect your focus at home. Now discover how MinDrop triggers reminders as you enter or leave physical radii.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link to="/places-feature" viewTransition style={{ viewTransitionName: 'card-places' } as React.CSSProperties}
            className="inline-flex items-center justify-center gap-3 px-10 sm:px-12 py-4.5 sm:py-5 bg-[#78350F] text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-2xl border-3 border-[#78350F] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#D97706] hover:border-[#D97706] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Continue to Chapter 02: Location Reminder <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function NotifyFeatureDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;
  const [current, setCurrent] = useState(0);
  const touchStartY = useRef(0);
  const lastScrollTime = useRef(0);

  const slides = [
    <SlideOpening />,
    <SlideConflict />,
    <SlideSolution />,
    <SlideInteractiveBuilder />,
    <SlideScenarios />,
    <SlideRuleTypes />,
    <SlideSecurity />,
    <SlideFAQ />,
    <SlideCloser />,
  ];
  const TOTAL = slides.length;
  const isDark = current === 1 || current === 6;

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= TOTAL) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 350) return;
    lastScrollTime.current = now;
    setCurrent(idx);
  };

  // Global Mouse Wheel Listener
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 10 && Math.abs(e.deltaX) < 10) return;
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta > 0) goTo(current + 1);
      else if (delta < 0) goTo(current - 1);
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, [current]);

  // Global Keyboard Listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        goTo(current + 1);
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(current - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden select-none"
      style={{ viewTransitionName: "card-notify" } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <header className="shrink-0 border-b-2 border-[#F59E0B]/10 z-50 py-2.5 px-3 sm:px-6"
        style={{ backgroundColor: isDark ? "rgba(69,26,3,0.96)" : "rgba(255,251,235,0.96)", backdropFilter: "blur(12px)", transition: "background-color 0.4s ease" }}>
        <div className="w-[95%] max-w-7xl mx-auto flex items-center justify-between gap-2">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-[#FEF3C7]/70 hover:text-white" : "text-[#D97706]/70 hover:text-[#78350F]"}`}>
            <X className="size-3.5"/> Close
          </Link>
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          <Link to="/download"
            className={`inline-flex items-center justify-center text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 sm:px-4 py-1.5 rounded-full border-2 shrink-0 leading-none shadow-sm transition ${isDark ? "bg-white text-ink border-white hover:bg-[#F59E0B] hover:text-white hover:border-[#F59E0B]" : "bg-ink text-white border-ink hover:bg-[#F59E0B] hover:border-[#F59E0B]"}`}>
            Get App
          </Link>
        </div>
      </header>

      {/* ── Slide Stage ── */}
      <div
        className="flex-1 relative overflow-hidden"
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => {
          const delta = touchStartY.current - e.changedTouches[0].clientY;
          if (Math.abs(delta) > 35) {
            if (delta > 0) goTo(current + 1);
            else goTo(current - 1);
          }
        }}
      >
        {/* Subtle Top Up Arrow */}
        {current > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(current - 1);
            }}
            className="absolute top-3 left-1/2 -translate-x-1/2 p-3 z-50 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Previous Slide"
          >
            <div className="flex items-center gap-1.5 bg-black/10 dark:bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-current/10">
              <ChevronUp className={`size-5 transition group-hover:-translate-y-0.5 ${isDark ? "text-[#FEF3C7]" : "text-[#78350F]"}`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-[#FEF3C7]/80" : "text-[#78350F]/80"}`}>UP</span>
            </div>
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

        {/* Subtle Bottom Down Arrow */}
        {current < TOTAL - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(current + 1);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 p-3 z-50 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Next Slide"
          >
            <div className="flex items-center gap-1.5 bg-black/10 dark:bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-current/10">
              <ChevronDown className={`size-5 transition group-hover:translate-y-0.5 ${isDark ? "text-[#FEF3C7]" : "text-[#78350F]"}`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-[#FEF3C7]/80" : "text-[#78350F]/80"}`}>DOWN</span>
            </div>
          </button>
        )}

        {/* Right Dot Navigation */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-50">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-1.5 h-7 bg-[#F59E0B]" : isDark ? "size-1.5 bg-[#FEF3C7]/25 hover:bg-[#FEF3C7]/60" : "size-1.5 bg-[#D97706]/25 hover:bg-[#D97706]/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
