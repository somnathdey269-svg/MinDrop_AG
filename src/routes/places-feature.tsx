import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin, Check, X, Navigation, ChevronDown, ChevronLeft, ChevronRight,
  ShoppingCart, Stethoscope, GraduationCap, Briefcase, Home, Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/places-feature")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "Location Alarms — MinDrop" },
      { name: "description", content: "MinDrop rings when you arrive at a place — your office, the market, the clinic. No time needed. Just walk in and the reminder fires." },
    ],
  }),
  component: PlacesDetailView,
});

/* ──────────────────────────────────────────────
   SUBTLE STEP ILLUSTRATIONS
────────────────────────────────────────────── */
function SavePlace() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ y: [-12, 0, -12] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="text-[#8B5CF6] z-10"
      >
        <MapPin className="size-16 stroke-[2.5px] fill-[#DDD6FE]" />
      </motion.div>
      <motion.div
        animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-4 size-10 bg-[#8B5CF6]/20 rounded-full blur-sm"
      />
    </div>
  );
}

function CellMonitor() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <div className="size-20 sm:size-24 bg-white border-3 border-[#8B5CF6] rounded-3xl grid place-items-center shadow-lg text-[#8B5CF6] relative z-10">
        <Navigation className="size-10 stroke-[2.5px] rotate-45"/>
      </div>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 2.2], opacity: [0.35, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
          className="absolute size-24 border border-[#8B5CF6] rounded-full"
        />
      ))}
    </div>
  );
}

function GPSConfirm() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <div className="size-24 border-3 border-dashed border-[#8B5CF6] rounded-full animate-[spin_12s_linear_infinite] absolute" />
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="size-16 bg-[#8B5CF6] border-2 border-white rounded-full grid place-items-center shadow-md z-10 text-white"
      >
        <Navigation className="size-8 stroke-[2.5px]"/>
      </motion.div>
    </div>
  );
}

function ArriveAlarm() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ rotate: [-6, 6, -6], scale: [1, 1.05, 1] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatType: "reverse" }}
        className="size-20 sm:size-24 bg-[#8B5CF6] border-3 border-[#4C1D95] rounded-3xl grid place-items-center z-10 shadow-[0_0_30px_rgba(139,92,246,0.3)] text-white"
      >
        <Volume2 className="size-10 stroke-[2.5px]"/>
      </motion.div>
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 2.0], opacity: [0.4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6 }}
          className="absolute size-28 border border-[#8B5CF6] rounded-full"
        />
      ))}
    </div>
  );
}

/* ─── Animated Map Pin ─── */
function AnimatedMap() {
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    setArrived(false);
    const t = setTimeout(() => setArrived(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
      <div className="absolute inset-0 rounded-[2rem] border-3 border-ink bg-[#F5F3FF] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 300">
          {[...Array(8)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2="300" y2={i * 40} stroke="#8B5CF6" strokeWidth="1" />
          ))}
          {[...Array(8)].map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="300" stroke="#8B5CF6" strokeWidth="1" />
          ))}
          <path d="M0,120 Q50,80 100,100 Q150,120 200,90 Q250,60 300,80" stroke="#8B5CF6" strokeWidth="4" fill="none" opacity="0.5" />
          <rect x="40" y="60" width="50" height="30" rx="4" fill="#8B5CF6" opacity="0.15" />
          <rect x="160" y="170" width="60" height="35" rx="4" fill="#8B5CF6" opacity="0.15" />
        </svg>

        {/* Destination pin */}
        <div className="absolute top-[35%] left-[55%] flex flex-col items-center">
          <AnimatePresence>
            {arrived && [0, 1, 2].map((i) => (
              <motion.div key={i}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.45 }}
                className="absolute size-6 rounded-full border-2 border-[#8B5CF6]" />
            ))}
          </AnimatePresence>
          <motion.div
            animate={arrived ? { scale: [1, 1.15, 1] } : { y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="size-9 bg-[#8B5CF6] rounded-full grid place-items-center shadow-lg z-10">
            <MapPin className="size-4.5 text-white" />
          </motion.div>
        </div>

        {/* Moving dot */}
        <motion.div
          initial={{ left: "8%", top: "70%" }}
          animate={arrived ? { left: "50%", top: "38%" } : { left: "8%", top: "70%" }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute size-5.5 rounded-full bg-[#8B5CF6] border-2 border-white shadow-md z-20 grid place-items-center">
          <motion.div animate={{ scale: [1, 1.6, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-[#DDD6FE] opacity-40" />
        </motion.div>
      </div>

      {/* Arrival message */}
      <AnimatePresence>
        {arrived && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.6 }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#8B5CF6] text-white rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-1.5 whitespace-nowrap border-2 border-ink">
            <Check className="size-4 stroke-[3px]" />
            <p className="text-xs font-black">Arrived — alarm active!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Place Setter Simulator ─── */
function PlaceSimulator() {
  const [chosen, setChosen] = useState<string | null>(null);
  const places = [
    { id: "market", emoji: "🛒", name: "Vegetable Market", hint: "Remind me to buy tomatoes and onions" },
    { id: "office", emoji: "🏢", name: "My Office", hint: "Remind me to ask boss about leave" },
    { id: "pharmacy", emoji: "💊", name: "Pharmacy", hint: "Pick up blood pressure tablets" },
    { id: "home", emoji: "🏠", name: "Home", hint: "Turn off the geyser when I get back" },
  ];

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <p className="text-xs font-black uppercase tracking-widest text-[#4C1D95]/40">
        Which place triggers a reminder?
      </p>
      <div className="grid grid-cols-2 gap-3">
        {places.map(p => (
          <button key={p.id} onClick={() => setChosen(p.id)}
            className={`flex flex-col gap-2 p-4 rounded-2xl border-3 text-left transition cursor-pointer ${
              chosen === p.id
                ? "border-[#8B5CF6] bg-[#EDE9FE] shadow-[3px_3px_0px_0px_rgba(139,92,246,0.3)]"
                : "border-[#8B5CF6]/20 bg-white hover:border-[#8B5CF6]/30"
            }`}>
            <span className="text-2xl">{p.emoji}</span>
            <p className={`text-xs sm:text-sm font-black leading-tight ${chosen === p.id ? "text-ink" : "text-ink/50"}`}>{p.name}</p>
          </button>
        ))}
      </div>
      {chosen && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-3 border-[#8B5CF6]/40 bg-[#F5F3FF] px-4 py-3">
          <p className="text-xs sm:text-sm font-black text-[#4C1D95] leading-tight">
            ✅ Alarm triggers when you enter {places.find(p => p.id === chosen)?.name}.
          </p>
          <p className="text-xs font-semibold text-[#4C1D95]/70 mt-1">
            "{places.find(p => p.id === chosen)?.hint}"
          </p>
        </motion.div>
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
    <div className="h-full bg-[#F5F3FF] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/20 bg-[#EDE9FE] px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#7C3AED] mb-8 sm:mb-12">
        📍 Location Alarms
      </motion.span>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[
          "You were at the pharmacy last Tuesday.",
          "The doctor said to pick up those tablets.",
          "You walked right past the counter.",
        ].map((line, i) => (
          <motion.p key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#7C3AED]/45 leading-tight tracking-tight">
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.65 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#4C1D95] leading-none tracking-tighter">
        You remembered at home.
      </motion.p>
    </div>
  );
}

/* Slide 2: The Problem */
function SlideProblem() {
  return (
    <div className="h-full bg-[#2E1065] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#DDD6FE]/30 mb-4">
            The problem with time-based reminders
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 sm:mb-8 tracking-tight">
            Some things cannot be tied to a time.<br />
            <span className="text-[#A78BFA]">They need a place.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#EDE9FE]/60 leading-relaxed max-w-lg">
            A reminder at 5 PM is useless if you reach the market at 6 PM, or at 3 PM on a different day. What you actually need is a reminder the moment you walk through the door.
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-center gap-4">
          <AnimatedMap />
          <p className="text-[10px] sm:text-xs font-black text-[#EDE9FE]/20 uppercase tracking-widest">Active location entry</p>
        </div>
      </div>
    </div>
  );
}

/* Slide 3: What MinDrop Does */
function SlideDifference() {
  return (
    <div className="h-full bg-[#F5F3FF] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 sm:gap-12 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#7C3AED] mb-4">
            How MinDrop handles this
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#4C1D95] leading-tight tracking-tight">
            You tell MinDrop a place.<br />
            <span className="text-[#8B5CF6]">The moment you walk in</span>, it rings.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[
            { icon: "🗺️", title: "No Specific Time Needed", body: "Don't guess when you'll be somewhere. Simply select the location and let your presence trigger the alert." },
            { icon: "🔋", title: "Zero Battery Drain", body: "MinDrop checks cell tower handshakes rather than running active GPS. Battery usage remains practically zero." },
            { icon: "🔒", title: "100% On-Device Privacy", body: "Location lookups and logs run strictly inside your phone. No tracking server or online databases used." },
          ].map(({ icon, title, body }) => (
            <div key={title} className="bg-white border-3 border-[#8B5CF6] rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(76,29,149,0.15)] text-left flex flex-col gap-3">
              <span className="text-3xl sm:text-4xl">{icon}</span>
              <h3 className="text-base sm:text-lg md:text-xl font-black text-[#4C1D95]">{title}</h3>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-[#4C1D95]/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Set One Right Now */
function SlidePlayground() {
  return (
    <div className="h-full bg-[#EDE9FE] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-20 max-w-6xl">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#7C3AED] mb-4">
            Interactive demo
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4C1D95] leading-tight mb-4 sm:mb-6 tracking-tight">
            Pick a place. See how it triggers.
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#4C1D95]/75 leading-relaxed mb-6 sm:mb-8 max-w-md">
            Choose a location trigger below. MinDrop sits ready to ring whenever you check into that zone — today or next week.
          </p>
          <div className="flex flex-col gap-3.5">
            {[
              "Choose one target destination.",
              "Save it to associate your message.",
              "Entering the boundary triggers a loud loop.",
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3.5">
                <div className="size-6 sm:size-7 rounded-full bg-[#8B5CF6] text-white grid place-items-center shrink-0 text-xs font-black">{i+1}</div>
                <p className="text-sm sm:text-base md:text-lg font-bold text-[#4C1D95]/80 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          <PlaceSimulator />
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
      case 1: return <SavePlace />;
      case 2: return <CellMonitor />;
      case 3: return <GPSConfirm />;
      case 4: return <ArriveAlarm />;
      default: return null;
    }
  };

  return (
    <div className={`h-full ${color} flex items-center justify-center px-6 relative overflow-hidden`}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[240px] sm:text-[340px] md:text-[440px] lg:text-[540px] font-black text-[#8B5CF6]/5 leading-none select-none pointer-events-none pl-4">
        {step}
      </div>

      <div className="w-[95%] mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 text-left">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#4C1D95]/40 mb-4 sm:mb-5">
            Step {stepNum} of {TOTAL_STEPS} · How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#4C1D95] leading-tight mb-4 sm:mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#4C1D95]/70 leading-relaxed">
            {detail}
          </p>

          <div className="flex gap-2.5 mt-8 sm:mt-12">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i}
                className={`h-1.5 rounded-full transition-all ${i === stepNum - 1 ? "w-14 bg-[#8B5CF6]" : "w-4 bg-[#8B5CF6]/20"}`}/>
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
    { icon: ShoppingCart, title: "The Market", scene: "You always forget one thing — the thing your family needed most. Now your phone rings the moment you step inside.", color: "bg-[#F5F3FF]" },
    { icon: Stethoscope, title: "The Clinic or Hospital", scene: "Pick up reports. Collect a prescription. Ask the doctor about that one thing. You can stop trying to remember.", color: "bg-[#EDE9FE]" },
    { icon: Briefcase, title: "Your Office", scene: "Ask about the leave. Submit the expense form. Reply to that client. Walk in, and MinDrop reminds you.", color: "bg-[#DDD6FE]/60" },
    { icon: GraduationCap, title: "Your Child's School", scene: "Pay the fees. Hand in the form. Talk to the teacher. Attach the task to the school — done.", color: "bg-[#F5F3FF]" },
    { icon: Home, title: "Back Home", scene: "Turn off the geyser. Lock the balcony. Feed the dog. The moment you walk through your door, MinDrop has your list ready.", color: "bg-[#EDE9FE]" },
  ];

  const prev = () => setCardIdx(i => Math.max(0, i - 1));
  const next = () => setCardIdx(i => Math.min(scenarios.length - 1, i + 1));

  return (
    <div className="h-full bg-[#2E1065] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 sm:gap-10 max-w-3xl">
        <div className="text-center">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#DDD6FE]/30 mb-4">
            Places that need this most
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            You visit these places. Every time is a chance to forget.
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
              className={`w-full rounded-[2rem] border-3 border-[#8B5CF6] p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(139,92,246,0.4)] ${scenarios[cardIdx].color} flex flex-col gap-6`}>
              <div className="size-14 bg-white border-2 border-[#8B5CF6] rounded-xl grid place-items-center shadow-[4px_4px_0px_0px_rgba(139,92,246,0.2)]">
                {(() => { const Icon = scenarios[cardIdx].icon; return <Icon className="size-7 text-[#4C1D95]"/>; })()}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-[#4C1D95] uppercase tracking-wider mb-2">{scenarios[cardIdx].title}</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-[#4C1D95] leading-snug tracking-tight">{scenarios[cardIdx].scene}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-5">
          <button onClick={prev} disabled={cardIdx === 0}
            className="size-11 sm:size-12 rounded-full border-2 border-[#8B5CF6]/30 bg-white/5 grid place-items-center text-[#DDD6FE]/60 hover:text-white hover:bg-white/10 disabled:opacity-25 transition cursor-pointer">
            <ChevronLeft className="size-5"/>
          </button>
          <div className="flex gap-2.5">
            {scenarios.map((_, i) => (
              <button key={i} onClick={() => setCardIdx(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${i === cardIdx ? "w-8 h-2 bg-[#8B5CF6]" : "size-2.5 bg-[#DDD6FE]/30 hover:bg-white/50"}`}/>
            ))}
          </div>
          <button onClick={next} disabled={cardIdx === scenarios.length - 1}
            className="size-11 sm:size-12 rounded-full border-2 border-[#8B5CF6]/30 bg-white/5 grid place-items-center text-[#DDD6FE]/60 hover:text-white hover:bg-white/10 disabled:opacity-25 transition cursor-pointer">
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
    <div className="h-full bg-[#F5F3FF] flex items-center justify-center px-6 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-8 sm:gap-10 max-w-4xl">
        <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#4C1D95]/45">
          Stop carrying it all in your head
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#4C1D95] leading-none tracking-tighter">
          The place will remind you. You just have to show up.
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#4C1D95]/60 leading-relaxed max-w-2xl">
          MinDrop turns every place you visit into a smart helper that knows exactly what you need to do when you arrive. No clocks. No guessing. Just walk in.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link to="/download"
            className="px-10 sm:px-12 py-4.5 sm:py-5 bg-ink text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#8B5CF6] hover:border-[#8B5CF6] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Download MinDrop — Free
          </Link>
          <Link to="/" hash={backHash} viewTransition
            className="px-10 sm:px-12 py-4.5 sm:py-5 bg-white text-ink font-black text-sm sm:text-base uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EDE9FE] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
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
function PlacesDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;

  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const lastScrollTime = useRef(0);

  const STEPS = [
    {
      step: "01", stepNum: 1, color: "bg-[#F5F3FF]",
      title: "You save a place and add a note.",
      detail: "Open MinDrop, tap on the map, drop a pin on the place you want. Write a short note about what you need to do there. Done.",
    },
    {
      step: "02", stepNum: 2, color: "bg-[#EDE9FE]",
      title: "MinDrop quietly keeps an eye on your location.",
      detail: "Your phone tracks which mobile cell towers it can see. MinDrop checks this in the background — it barely uses any battery, and it does not need GPS running all the time.",
    },
    {
      step: "03", stepNum: 3, color: "bg-[#F5F3FF]",
      title: "When you get close, GPS confirms it.",
      detail: "Once your phone senses you are nearby, it turns on GPS for just a few seconds to confirm you are actually within the area. Then it turns off again.",
    },
    {
      step: "04", stepNum: 4, color: "bg-[#EDE9FE]",
      title: "The alarm rings the moment you arrive.",
      detail: "As soon as you enter the area, your phone rings with the reminder note you wrote. You deal with it, mark it done, and carry on. No re-setting required.",
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
      style={{ viewTransitionName: "card-places" } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <header className="shrink-0 border-b-2 border-[#8B5CF6]/10 z-50"
        style={{ backgroundColor: isDark ? "rgba(46,16,101,0.96)" : "rgba(245,243,255,0.96)", backdropFilter: "blur(12px)", transition: "background-color 0.4s ease" }}>
        <div className="w-[95%] mx-auto h-14 flex items-center justify-between">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition ${isDark ? "text-[#DDD6FE]/60 hover:text-white" : "text-[#7C3AED]/60 hover:text-[#4C1D95]"}`}>
            <X className="size-3.5"/> Close
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-7 relative grid place-items-center shrink-0">
              <motion.div animate={{scale:[1,1.5,1],opacity:[0.2,0,0.2]}} transition={{duration:3,repeat:Infinity}}
                className="absolute inset-0 rounded-full border border-[#8B5CF6]/30"/>
              <motion.div animate={{y:[0,-2,0]}} transition={{duration:3,repeat:Infinity}}
                className="size-5 rounded-md bg-gradient-to-tr from-[#8B5CF6] to-[#DDD6FE] grid place-items-center relative">
                <span className="text-white font-black text-[9px]">m</span>
              </motion.div>
            </div>
            <span className={`text-xs font-black uppercase tracking-wider hidden sm:block transition ${isDark ? "text-[#DDD6FE]/70" : "text-[#7C3AED]/70"}`}>MinDrop</span>
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
            <ChevronDown className={`size-3.5 rotate-180 transition group-hover:-translate-y-0.5 ${isDark ? "text-[#DDD6FE]/30 group-hover:text-white" : "text-[#7C3AED]/30 group-hover:text-[#4C1D95]"}`} />
            <span className={`text-[9px] font-black uppercase tracking-widest transition ${isDark ? "text-[#DDD6FE]/30 group-hover:text-white" : "text-[#7C3AED]/30 group-hover:text-[#4C1D95]"}`}>
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
            className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-0.5 z-20 cursor-pointer group"
          >
            <span className={`text-[9px] font-black uppercase tracking-widest transition ${isDark ? "text-[#DDD6FE]/20 group-hover:text-white" : "text-[#7C3AED]/20 group-hover:text-[#4C1D95]"}`}>
              scroll or ↓
            </span>
            <ChevronDown className={`size-3.5 transition group-hover:translate-y-0.5 ${isDark ? "text-[#DDD6FE]/20 group-hover:text-white" : "text-[#7C3AED]/20 group-hover:text-[#4C1D95]"}`} />
          </button>
        )}

        {/* ── Right Dot Navigation ── */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-30">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "w-1.5 h-7 bg-[#8B5CF6]"
                  : isDark
                    ? "size-1.5 bg-[#DDD6FE]/25 hover:bg-[#DDD6FE]/60"
                    : "size-1.5 bg-[#7C3AED]/25 hover:bg-[#7C3AED]/50"
              }`}
            />
          ))}
          <p className={`text-[9px] font-black mt-1 tabular-nums transition ${isDark ? "text-[#DDD6FE]/30" : "text-[#7C3AED]/30"}`}>
            {current + 1}/{TOTAL}
          </p>
        </div>
      </div>
    </div>
  );
}
