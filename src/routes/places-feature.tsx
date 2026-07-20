import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin, Check, X, Navigation, ChevronDown, ChevronLeft, ChevronRight,
  ShoppingCart, Stethoscope, GraduationCap, Briefcase, Home
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

/* ─── Animated Map Pin ─── */
function AnimatedMap() {
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    setArrived(false);
    const t = setTimeout(() => setArrived(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
      <div className="absolute inset-0 rounded-3xl border-3 border-ink bg-[#E8F5E9] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 300">
          {[...Array(8)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2="300" y2={i * 40} stroke="#166534" strokeWidth="1" />
          ))}
          {[...Array(8)].map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="300" stroke="#166534" strokeWidth="1" />
          ))}
          <path d="M0,120 Q50,80 100,100 Q150,120 200,90 Q250,60 300,80" stroke="#166534" strokeWidth="4" fill="none" opacity="0.5" />
          <rect x="40" y="60" width="50" height="30" rx="4" fill="#166534" opacity="0.15" />
          <rect x="160" y="170" width="60" height="35" rx="4" fill="#166534" opacity="0.15" />
        </svg>

        {/* Destination pin */}
        <div className="absolute top-[35%] left-[55%] flex flex-col items-center">
          <AnimatePresence>
            {arrived && [0, 1, 2].map((i) => (
              <motion.div key={i}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.45 }}
                className="absolute size-5 rounded-full border-2 border-[#16a34a]" />
            ))}
          </AnimatePresence>
          <motion.div
            animate={arrived ? { scale: [1, 1.15, 1] } : { y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="size-7 bg-[#16a34a] rounded-full grid place-items-center shadow-lg z-10">
            <MapPin className="size-3.5 text-white" />
          </motion.div>
        </div>

        {/* Moving dot */}
        <motion.div
          initial={{ left: "8%", top: "70%" }}
          animate={arrived ? { left: "50%", top: "38%" } : { left: "8%", top: "70%" }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute size-4.5 rounded-full bg-blue-500 border-2 border-white shadow-md z-20 grid place-items-center">
          <motion.div animate={{ scale: [1, 1.6, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-blue-300 opacity-40" />
        </motion.div>
      </div>

      {/* Arrival message */}
      <AnimatePresence>
        {arrived && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.6 }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#16a34a] text-white rounded-xl px-4 py-2 shadow-lg flex items-center gap-1.5 whitespace-nowrap border-2 border-ink">
            <Check className="size-3.5 stroke-[3px]" />
            <p className="text-[10px] font-black">Arrived — alarm active!</p>
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
    <div className="w-full max-w-sm flex flex-col gap-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-ink/40">
        Which place triggers a reminder?
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {places.map(p => (
          <button key={p.id} onClick={() => setChosen(p.id)}
            className={`flex flex-col gap-1.5 p-3 rounded-xl border-2 text-left transition cursor-pointer ${
              chosen === p.id
                ? "border-[#16a34a] bg-green-50 shadow-[2px_2px_0px_0px_rgba(22,163,74,0.3)]"
                : "border-ink/15 bg-white hover:border-ink/30"
            }`}>
            <span className="text-xl">{p.emoji}</span>
            <p className={`text-[11px] font-black leading-tight ${chosen === p.id ? "text-ink" : "text-ink/50"}`}>{p.name}</p>
          </button>
        ))}
      </div>
      {chosen && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-green-400 bg-green-50 px-3 py-2">
          <p className="text-[11px] font-black text-green-700 leading-tight">
            ✅ Alarm triggers when you enter {places.find(p => p.id === chosen)?.name}.
          </p>
          <p className="text-[10px] font-semibold text-green-600/70 mt-0.5">
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
    <div className="h-full bg-[#F0FDF4] flex flex-col items-center justify-center text-center px-5">
      <motion.span
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-green-100 px-4 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#16a34a] mb-6 sm:mb-8">
        📍 Location Alarms
      </motion.span>

      <div className="flex flex-col gap-1.5 sm:gap-2 mb-5 sm:mb-7">
        {[
          "You were at the pharmacy last Tuesday.",
          "The doctor said to pick up those tablets.",
          "You walked right past the counter.",
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
        You remembered at home.
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
    <div className="h-full bg-[#14532D] flex items-center justify-center px-5">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-14 max-w-5xl">
        <div className="flex-1 text-left">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/25 mb-3">
            The problem with time-based reminders
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 sm:mb-6">
            Some things cannot be tied to a time.<br />
            <span className="text-[#4ade80]">They need a place.</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-white/50 leading-relaxed max-w-lg">
            A reminder at 5 PM is useless if you reach the market at 6 PM, or at 3 PM on a different day. What you actually need is a reminder the moment you walk through the door.
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-center gap-2">
          <AnimatedMap />
          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Active location entry</p>
        </div>
      </div>
    </div>
  );
}

/* Slide 3: What MinDrop Does */
function SlideDifference() {
  return (
    <div className="h-full bg-[#F0FDF4] flex items-center justify-center px-5">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-6 sm:gap-8 max-w-4xl">
        <div>
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#16a34a] mb-3">
            How MinDrop handles this
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-ink leading-tight">
            You tell MinDrop a place.<br />
            <span className="text-[#16a34a]">The moment you walk in</span>, it rings.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full">
          {[
            { icon: "🗺️", title: "No Specific Time Needed", body: "Don't guess when you'll be somewhere. Simply select the location and let your presence trigger the alert." },
            { icon: "🔋", title: "Zero Battery Drain", body: "MinDrop checks cell tower handshakes rather than running active GPS. Battery usage remains practically zero." },
            { icon: "🔒", title: "100% On-Device Privacy", body: "Location lookups and logs run strictly inside your phone. No tracking server or online databases used." },
          ].map(({ icon, title, body }) => (
            <div key={title} className="bg-white border-3 border-ink rounded-[1.5rem] p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-2">
              <span className="text-2xl">{icon}</span>
              <h3 className="text-sm sm:text-base font-black text-ink">{title}</h3>
              <p className="text-xs sm:text-sm font-semibold text-ink/55 leading-relaxed">{body}</p>
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
    <div className="h-full bg-green-50 flex items-center justify-center px-5">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-4xl">
        <div className="flex-1 text-left">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#16a34a] mb-3">
            Interactive demo
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink leading-tight mb-3 sm:mb-4">
            Pick a place. See how it triggers.
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-ink/55 leading-relaxed mb-4 sm:mb-5 max-w-sm">
            Choose a location trigger below. MinDrop sits ready to ring whenever you check into that zone — today or next week.
          </p>
          <div className="flex flex-col gap-2">
            {[
              "Choose one target destination.",
              "Save it to associate your message.",
              "Entering the boundary triggers a loud loop.",
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="size-5 rounded-full bg-[#16a34a] text-white grid place-items-center shrink-0 text-[9px] font-black">{i+1}</div>
                <p className="text-xs sm:text-sm font-bold text-ink/65 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0 w-full lg:w-auto flex justify-center">
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
  return (
    <div className={`h-full ${color} flex items-center justify-center px-5 relative overflow-hidden`}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[180px] sm:text-[240px] font-black text-ink/5 leading-none select-none pointer-events-none pl-4">
        {step}
      </div>

      <div className="w-[95%] mx-auto max-w-3xl relative z-10">
        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-ink/30 mb-4 sm:mb-5">
          Step {stepNum} of {TOTAL_STEPS} · How It Works
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-ink leading-tight mb-4 sm:mb-6">
          {title}
        </h2>
        <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/55 leading-relaxed max-w-2xl">
          {detail}
        </p>

        <div className="flex gap-2 mt-8 sm:mt-12">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i}
              className={`h-1 rounded-full transition-all ${i === stepNum - 1 ? "w-10 bg-[#16a34a]" : "w-3 bg-ink/15"}`}/>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 9: Scenario Carousel */
function SlideScenarios() {
  const [cardIdx, setCardIdx] = useState(0);

  const scenarios = [
    { icon: ShoppingCart, title: "The Market", scene: "You always forget one thing — the thing your family needed most. Now your phone rings the moment you step inside.", color: "bg-green-50" },
    { icon: Stethoscope, title: "The Clinic or Hospital", scene: "Pick up reports. Collect a prescription. Ask the doctor about that one thing. You can stop trying to remember.", color: "bg-blue-50" },
    { icon: Briefcase, title: "Your Office", scene: "Ask about the leave. Submit the expense form. Reply to that client. Walk in, and MinDrop reminds you.", color: "bg-amber-50" },
    { icon: GraduationCap, title: "Your Child's School", scene: "Pay the fees. Hand in the form. Talk to the teacher. Attach the task to the school — done.", color: "bg-purple-50" },
    { icon: Home, title: "Back Home", scene: "Turn off the geyser. Lock the balcony. Feed the dog. The moment you walk through your door, MinDrop has your list ready.", color: "bg-red-50" },
  ];

  const prev = () => setCardIdx(i => Math.max(0, i - 1));
  const next = () => setCardIdx(i => Math.min(scenarios.length - 1, i + 1));

  return (
    <div className="h-full bg-[#14532D] flex items-center justify-center px-5">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-5 sm:gap-6 max-w-2xl">
        <div className="text-center">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/25 mb-3">
            Places that need this most
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
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
              className={`w-full rounded-[1.75rem] border-3 border-ink p-6 sm:p-7 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${scenarios[cardIdx].color} flex flex-col gap-4`}>
              <div className="size-12 bg-white border-2 border-ink rounded-xl grid place-items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {(() => { const Icon = scenarios[cardIdx].icon; return <Icon className="size-6 text-ink"/>; })()}
              </div>
              <div>
                <p className="text-[10px] font-black text-ink/40 uppercase tracking-wider mb-1.5">{scenarios[cardIdx].title}</p>
                <p className="text-sm sm:text-base font-black text-ink leading-snug">{scenarios[cardIdx].scene}</p>
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

/* Slide 10: Closer */
function SlideCloser({ backHash }: { backHash?: string }) {
  return (
    <div className="h-full bg-[#F0FDF4] flex items-center justify-center px-5 text-center">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-5 sm:gap-6 max-w-3xl">
        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-ink/25">
          Stop carrying it all in your head
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-tight">
          The place will remind you. You just have to show up.
        </h2>
        <p className="text-base sm:text-lg font-semibold text-ink/45 leading-relaxed max-w-xl">
          MinDrop turns every place you visit into a smart helper that knows exactly what you need to do when you arrive. No clocks. No guessing. Just walk in.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mt-2">
          <Link to="/download"
            className="px-8 sm:px-10 py-3.5 bg-ink text-white font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#16a34a] hover:border-[#16a34a] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Download MinDrop — Free
          </Link>
          <Link to="/" hash={backHash} viewTransition
            className="px-8 sm:px-10 py-3.5 bg-white text-ink font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-50 transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
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
  const currentRef = useRef(0);
  const lockedRef  = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const STEPS = [
    {
      step: "01", stepNum: 1, color: "bg-[#ECFDF5]",
      title: "You save a place and add a note.",
      detail: "Open MinDrop, tap on the map, drop a pin on the place you want. Write a short note about what you need to do there. Done.",
    },
    {
      step: "02", stepNum: 2, color: "bg-[#F0FDF4]",
      title: "MinDrop quietly keeps an eye on your location.",
      detail: "Your phone tracks which mobile cell towers it can see. MinDrop checks this in the background — it barely uses any battery, and it does not need GPS running all the time.",
    },
    {
      step: "03", stepNum: 3, color: "bg-[#ECFDF5]",
      title: "When you get close, GPS confirms it.",
      detail: "Once your phone senses you are nearby, it turns on GPS for just a few seconds to confirm you are actually within the area. Then it turns off again.",
    },
    {
      step: "04", stepNum: 4, color: "bg-[#F0FDF4]",
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
      style={{ viewTransitionName: "card-places" } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <header className="shrink-0 border-b-2 border-ink/8 z-50"
        style={{ backgroundColor: isDark ? "rgba(20,83,45,0.96)" : "rgba(240,253,244,0.96)", backdropFilter: "blur(12px)", transition: "background-color 0.4s ease" }}>
        <div className="w-[95%] mx-auto h-14 flex items-center justify-between">
          <Link to="/" hash={backHash} viewTransition
            className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition ${isDark ? "text-white/50 hover:text-white" : "text-ink/50 hover:text-ink"}`}>
            <X className="size-3.5"/> Close
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-7 relative grid place-items-center shrink-0">
              <motion.div animate={{scale:[1,1.5,1],opacity:[0.2,0,0.2]}} transition={{duration:3,repeat:Infinity}}
                className="absolute inset-0 rounded-full border border-[#16a34a]/30"/>
              <motion.div animate={{y:[0,-2,0]}} transition={{duration:3,repeat:Infinity}}
                className="size-5 rounded-md bg-gradient-to-tr from-[#16a34a] to-[#4ade80] grid place-items-center relative">
                <span className="text-white font-black text-[9px]">m</span>
              </motion.div>
            </div>
            <span className={`text-xs font-black uppercase tracking-wider hidden sm:block transition ${isDark ? "text-white/60" : "text-ink/60"}`}>MinDrop</span>
          </div>
          <Link to="/download"
            className={`text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-xl border-2 transition ${isDark ? "bg-white text-ink border-white hover:bg-[#16a34a] hover:text-white hover:border-[#16a34a]" : "bg-ink text-white border-ink hover:bg-[#16a34a] hover:border-[#16a34a]"}`}>
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
                  ? "w-1.5 h-7 bg-[#16a34a]"
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
