import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import { MobileFeatureDock } from "@/components/layout/MobileFeatureDock";
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
  const [activeCard, setActiveCard] = useState(0);

  const solutionItems = [
    { icon: Filter, title: "You Decide What Matters", body: "Choose which types of messages wake you up. Sales offers stay silent. Your bank alerts ring loudly." },
    { icon: ShieldAlert, title: "Bypasses Silent Mode", body: "When your phone is on silent, important alerts still ring through. Nothing slips past unnoticed." },
    { icon: Sparkles, title: "Stays on Your Phone", body: "MinDrop reads your alerts right there on your phone. Nothing is sent to any server. Your messages stay private." },
  ];

  return (
    <div className="h-full w-full bg-[#FFFBEB] flex items-center justify-center px-4 sm:px-6 py-2">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center gap-4 sm:gap-10">
        <div>
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#D97706] mb-1 sm:mb-3">
            How MinDrop Handles This
          </p>
          <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#78350F] leading-tight tracking-tight">
            MinDrop watches your alerts.<br className="hidden sm:block"/>
            <span className="text-[#D97706]">The important ones become an alarm.</span>
          </h2>
        </div>

        {/* Mobile Horizontal Carousel (< sm) */}
        <div className="w-full block sm:hidden">
          <div 
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const diff = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 35) {
                if (diff > 0) setActiveCard((prev) => (prev + 1) % solutionItems.length);
                else setActiveCard((prev) => (prev - 1 + solutionItems.length) % solutionItems.length);
              }
              touchStartX.current = null;
            }}
            className="w-full max-w-sm mx-auto bg-white border-3 border-[#F59E0B] rounded-[1.8rem] p-4 shadow-md text-left flex flex-col gap-2 cursor-pointer select-none"
          >
            {(() => {
              const { icon: Icon, title, body } = solutionItems[activeCard];
              return (
                <>
                  <div className="flex items-center justify-between">
                    <div className="size-9 rounded-xl bg-[#FEF3C7] grid place-items-center text-[#D97706]">
                      <Icon className="size-5 stroke-[2.5px]" />
                    </div>
                    <span className="text-[10px] font-black text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">
                      {activeCard + 1} / {solutionItems.length}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#78350F]">{title}</h3>
                  <p className="text-xs font-medium text-[#78350F]/80 leading-relaxed">{body}</p>
                </>
              );
            })()}
          </div>
          {/* Subtle Mobile Navigation Dots */}
          <div className="flex justify-center items-center gap-1.5 mt-3">
            {solutionItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCard(i)}
                className={`shrink-0 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeCard ? "w-5 h-2 bg-[#D97706]" : "size-2 bg-[#D97706]/30 hover:bg-[#D97706]/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop 3-Column Grid (>= sm) */}
        <div className="hidden sm:grid grid-cols-3 gap-6 sm:gap-8 w-full">
          {solutionItems.map(({ icon: Icon, title, body }) => (
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
    <div className="h-full w-full bg-[#FEF3C7] flex items-center justify-center px-4 sm:px-6 py-2">
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-4 lg:gap-12">
        <div className="flex-1 text-center lg:text-left">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#D97706] mb-1 sm:mb-2">
            Interactive Rule Engine
          </p>
          <h2 className="text-xl sm:text-4xl md:text-5xl font-black text-[#78350F] leading-tight mb-2 tracking-tight">
            Create your first notification filter rule right now.
          </h2>
          <p className="text-xs sm:text-base font-semibold text-[#78350F]/75 leading-relaxed mb-3 sm:mb-5 hidden sm:block">
            Tell MinDrop which app to watch and what magic word turns a standard message into a full-screen alarm.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2.5">
            {presets.map((p) => (
              <button key={p.label} onClick={() => { setKeyword(p.kw); setSelectedApp(p.app); setVolumeLevel(p.vol); setSaved(false); }}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full border-2 border-[#78350F] font-black text-[10px] sm:text-xs uppercase tracking-wider transition cursor-pointer ${
                  keyword === p.kw ? "bg-[#78350F] text-white" : "bg-white text-[#78350F] hover:bg-[#FEF3C7]"
                }`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-sm lg:w-[420px] bg-white border-3 border-[#78350F] rounded-[1.8rem] sm:rounded-[2.2rem] p-4 sm:p-6 shadow-md text-left flex flex-col gap-3">
          <div className="flex items-center justify-between border-b-2 border-[#FEF3C7] pb-2.5">
            <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-[#78350F] flex items-center gap-1.5">
              <SlidersHorizontal className="size-4 text-[#D97706]" /> Rule Configuration
            </span>
            <span className="text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">ACTIVE</span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] sm:text-xs font-black uppercase text-[#78350F]/70">Target Application</label>
            <input type="text" value={selectedApp} onChange={(e) => { setSelectedApp(e.target.value); setSaved(false); }}
              className="w-full border-2 border-[#78350F]/20 rounded-lg px-3 py-1.5 text-xs font-bold text-[#78350F] focus:outline-none focus:border-[#D97706]" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] sm:text-xs font-black uppercase text-[#78350F]/70">Trigger Keyword</label>
            <input type="text" value={keyword} onChange={(e) => { setKeyword(e.target.value.toUpperCase()); setSaved(false); }}
              className="w-full border-2 border-[#78350F]/20 rounded-lg px-3 py-1.5 text-xs font-black text-[#D97706] uppercase tracking-wider focus:outline-none focus:border-[#D97706]" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] sm:text-xs font-black uppercase text-[#78350F]/70">Alarm Volume Behavior</label>
            <select value={volumeLevel} onChange={(e) => { setVolumeLevel(e.target.value); setSaved(false); }}
              className="w-full border-2 border-[#78350F]/20 rounded-lg px-3 py-1.5 text-xs font-bold text-[#78350F] focus:outline-none focus:border-[#D97706]">
              <option>Maximum (Loud)</option>
              <option>Medium</option>
              <option>Soft Tone</option>
            </select>
          </div>

          <button onClick={() => setSaved(true)}
            className="mt-1 w-full py-2.5 bg-[#78350F] text-white font-black text-xs uppercase tracking-wider rounded-lg border-2 border-[#78350F] hover:bg-[#D97706] hover:border-[#D97706] transition flex items-center justify-center gap-2 cursor-pointer shadow-xs">
            {saved ? <><Check className="size-3.5" /> Rule Saved to Local Device</> : "Test & Save Rule"}
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
    <div className="h-full w-full bg-[#FFFBEB] flex items-center justify-center px-4 sm:px-6 py-2">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-3 sm:gap-6">
        <div>
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#D97706] mb-0.5">
            Real-World Protection Scenarios
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-[#78350F] leading-tight tracking-tight">
            How people rely on MinDrop notification rules.
          </h2>
        </div>

        <div 
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 35) {
              if (diff > 0) next();
              else prev();
            }
            touchStartX.current = null;
          }}
          className="w-full relative overflow-hidden flex items-center justify-center cursor-pointer select-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={cardIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={`w-full max-w-sm sm:max-w-none rounded-[1.6rem] sm:rounded-[2.2rem] border-3 ${scenarios[cardIdx].borderColor} p-4 sm:p-8 shadow-md ${scenarios[cardIdx].color} text-left flex flex-col gap-2.5 sm:gap-5`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#D97706] bg-white border border-[#D97706]/30 px-2.5 py-0.5 rounded-full shadow-xs">
                  {scenarios[cardIdx].app}
                </span>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#78350F] bg-[#FEF3C7] border border-[#78350F]/20 px-2.5 py-0.5 rounded-full">
                  KEYWORD: {scenarios[cardIdx].kw}
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-2xl md:text-3xl font-black text-[#78350F] mb-1 sm:mb-2">{scenarios[cardIdx].title}</h3>
                <p className="text-xs sm:text-base font-medium text-[#78350F]/85 leading-relaxed">{scenarios[cardIdx].desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Ultra-subtle Mini Controls */}
        <div className="flex items-center gap-3">
          <button onClick={prev} disabled={cardIdx === 0}
            className="size-8 sm:size-10 rounded-full border border-[#78350F]/30 bg-white text-[#78350F] grid place-items-center disabled:opacity-20 hover:bg-[#FEF3C7] transition cursor-pointer shadow-xs"
            aria-label="Previous scenario"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {scenarios.map((_, i) => (
              <button key={i} onClick={() => setCardIdx(i)}
                className={`shrink-0 rounded-full transition-all duration-300 cursor-pointer ${i === cardIdx ? "w-5 h-2 bg-[#D97706]" : "size-2 bg-[#D97706]/25 hover:bg-[#D97706]/50"}`}
                aria-label={`Go to scenario ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={next} disabled={cardIdx === scenarios.length - 1}
            className="size-8 sm:size-10 rounded-full border border-[#78350F]/30 bg-white text-[#78350F] grid place-items-center disabled:opacity-20 hover:bg-[#FEF3C7] transition cursor-pointer shadow-xs"
            aria-label="Next scenario"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* Slide 6: Rule Types Grid */
function SlideRuleTypes() {
  const [activeIdx, setActiveIdx] = useState(0);

  const ruleTypes = [
    { tag: "Exact Match", title: "Literal Keyword Match", body: "Triggers when exact text strings appear in title or message body (e.g. 'DEBITED')." },
    { tag: "Contact Filter", title: "Sender Identification", body: "Restricts notification alerts to specific contacts or sender names while ignoring general broadcasts." },
    { tag: "Volume Boost", title: "Silent Mode Override", body: "Bypasses system DND settings to play a loud ringtone for critical emergency alerts." },
    { tag: "Auto-Dismiss", title: "Spam Suppression", body: "Automatically marks promotional notifications as read so your notification drawer stays clean." },
  ];

  return (
    <div className="h-full w-full bg-[#FEF3C7] flex items-center justify-center px-4 sm:px-6 py-2">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center gap-3 sm:gap-8">
        <div>
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#D97706] mb-1 sm:mb-2">
            Engineered For Precision
          </p>
          <h2 className="text-xl sm:text-4xl md:text-5xl font-black text-[#78350F] leading-tight tracking-tight">
            Four powerful matching modes.
          </h2>
        </div>

        {/* Mobile Horizontal Carousel (< sm) */}
        <div className="w-full block sm:hidden">
          <div 
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const diff = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 35) {
                if (diff > 0) setActiveIdx((prev) => (prev + 1) % ruleTypes.length);
                else setActiveIdx((prev) => (prev - 1 + ruleTypes.length) % ruleTypes.length);
              }
              touchStartX.current = null;
            }}
            className="w-full max-w-sm mx-auto bg-white border-3 border-[#78350F] rounded-[1.6rem] p-4 shadow-md text-left flex flex-col gap-2 cursor-pointer select-none"
          >
            {(() => {
              const { tag, title, body } = ruleTypes[activeIdx];
              return (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                    <span className="text-[10px] font-bold text-[#78350F]/60">
                      {activeIdx + 1} / {ruleTypes.length}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#78350F]">{title}</h3>
                  <p className="text-xs font-medium text-[#78350F]/80 leading-relaxed">{body}</p>
                </>
              );
            })()}
          </div>

          {/* Ultra-subtle Mini Dots */}
          <div className="flex justify-center items-center gap-1.5 mt-3">
            {ruleTypes.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`shrink-0 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIdx ? "w-5 h-2 bg-[#D97706]" : "size-2 bg-[#D97706]/25 hover:bg-[#D97706]/50"
                }`}
                aria-label={`Go to rule type ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop 2-Column Grid (>= sm) */}
        <div className="hidden sm:grid grid-cols-2 gap-6 w-full text-left">
          {ruleTypes.map(({ tag, title, body }) => (
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

/* Slide 7: Closing Statement & Action */
function SlideClosing() {
  return (
    <div className="h-full bg-[#451A03] flex flex-col items-center justify-center text-center px-6">
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-white/5 backdrop-blur-md px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#FDE68A] mb-8 shadow-sm">
        🔒 PRIVACY FIRST · ZERO TELEMETRY
      </motion.span>

      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 max-w-4xl tracking-tight">
        Never miss an emergency.<br />
        <span className="text-[#F59E0B]">Never get distracted by noise.</span>
      </h2>

      <p className="text-sm sm:text-base md:text-lg font-semibold text-[#FEF3C7]/80 leading-relaxed max-w-xl mb-8 sm:mb-12">
        MinDrop notification rules execute 100% offline on your device using Android&apos;s native notification listener service. No servers, no tracking.
      </p>

      <Link to="/download"
        className="px-8 py-4 bg-[#F59E0B] text-ink font-black text-base uppercase tracking-wider rounded-2xl border-3 border-white hover:bg-white transition flex items-center gap-3 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] cursor-pointer">
        Get MinDrop For Android
      </Link>
    </div>
  );
}

export function NotifyFeatureDetailView() {
  const [current, setCurrent] = useState(0);
  const search = Route.useSearch();
  const backHash = search.from === "grid" ? "grid" : "";
  const touchStartY = useRef<number>(0);
  const wheelDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    <SlideOpening key="1" />,
    <SlideConflict key="2" />,
    <SlideSolution key="3" />,
    <SlideInteractiveBuilder key="4" />,
    <SlideScenarios key="5" />,
    <SlideRuleTypes key="6" />,
    <SlideClosing key="7" />,
  ];

  const TOTAL = slides.length;
  const isDark = current === 1 || current === 6;

  const currentRef = useRef(current);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < TOTAL) {
      setCurrent(idx);
    }
  };

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goTo(currentRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(currentRef.current - 1);
      }
    };

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      if (wheelDebounceTimer.current) return;

      if (Math.abs(e.deltaY) > 25) {
        if (e.deltaY > 0) goTo(currentRef.current + 1);
        else goTo(currentRef.current - 1);

        wheelDebounceTimer.current = setTimeout(() => {
          wheelDebounceTimer.current = null;
        }, 500);
      }
    };

    window.addEventListener("keydown", keyHandler);
    window.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      window.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("keydown", keyHandler);
      if (wheelDebounceTimer.current) clearTimeout(wheelDebounceTimer.current);
    };
  }, []);

  return (
    <div
      className={`h-[100dvh] flex flex-col overflow-hidden select-none relative transition-colors duration-400 ${isDark ? "bg-[#451A03]" : "bg-[#FFFBEB]"}`}
      style={{ viewTransitionName: "card-notify" } as React.CSSProperties}
    >
      {/* 1. Header (Desktop: Close + Logo + Get App | Mobile: Logo Only) */}
      <header className="shrink-0 h-12 border-b border-[#F59E0B]/15 z-50 px-4 sm:px-6 flex items-center backdrop-blur-md"
        style={{ backgroundColor: isDark ? "rgba(69,26,3,0.92)" : "rgba(255,251,235,0.92)", transition: "background-color 0.4s ease" }}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-center md:justify-between gap-2 h-full">
          <Link to="/" hash={backHash} viewTransition
            className={`hidden md:flex items-center gap-1 text-xs font-black uppercase tracking-wider shrink-0 transition ${isDark ? "text-[#FEF3C7]/70 hover:text-white" : "text-[#D97706]/70 hover:text-[#78350F]"}`}>
            <X className="size-3.5"/> Close
          </Link>

          <Link to="/" hash={backHash} viewTransition aria-label="MinDrop — Home" className="flex items-center justify-center shrink-0 h-full leading-none">
            <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" isDarkBg={isDark} />
          </Link>

          <Link to="/download" viewTransition
            className={`hidden md:inline-flex items-center justify-center text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 sm:px-4 py-1.5 rounded-full border-2 shrink-0 leading-none shadow-sm transition ${isDark ? "bg-white text-ink border-white hover:bg-[#F59E0B] hover:text-white hover:border-[#F59E0B]" : "bg-ink text-white border-ink hover:bg-[#F59E0B] hover:border-[#F59E0B]"}`}>
            Get App
          </Link>
        </div>
      </header>

      {/* 2. Main Content Stage */}
      <main 
        className="flex-1 min-h-0 w-full relative overflow-y-auto sm:overflow-hidden flex items-center justify-center p-0"
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => {
          const delta = touchStartY.current - e.changedTouches[0].clientY;
          if (Math.abs(delta) > 35) {
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
            className="w-full h-full flex items-center justify-center"
          >
            {slides[current]}
          </motion.div>
        </AnimatePresence>

        {/* Right Dot Navigation (Desktop) */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-40">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-1.5 h-7 bg-[#F59E0B]" : isDark ? "size-1.5 bg-[#FEF3C7]/25 hover:bg-[#FEF3C7]/60" : "size-1.5 bg-[#D97706]/25 hover:bg-[#D97706]/50"
              }`}
            />
          ))}
        </div>
      </main>

      {/* 3. ELEVATED FLOATING ISLAND DOCK FOOTER (Mobile Only) */}
      <MobileFeatureDock
        current={current}
        total={TOTAL}
        goTo={goTo}
        backHash={backHash}
        isDark={isDark}
      />
    </div>
  );
}
