import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin, Check, X, Navigation, ChevronDown,
  ShoppingCart, Stethoscope, GraduationCap, Briefcase, Home
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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

/* ─── Animated Map Pin ─── */
function AnimatedMap() {
  const [arrived, setArrived] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setArrived(true), 2000);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <div ref={ref} className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
      {/* Map background grid */}
      <div className="absolute inset-0 rounded-3xl border-3 border-ink bg-[#E8F5E9] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 300">
          {[...Array(8)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2="300" y2={i * 40} stroke="#166534" strokeWidth="1" />
          ))}
          {[...Array(8)].map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="300" stroke="#166534" strokeWidth="1" />
          ))}
          <path d="M0,120 Q50,80 100,100 Q150,120 200,90 Q250,60 300,80" stroke="#166534" strokeWidth="4" fill="none" opacity="0.5" />
          <path d="M0,200 Q60,180 120,200 Q180,220 240,190 Q270,175 300,185" stroke="#166534" strokeWidth="3" fill="none" opacity="0.3" />
          <rect x="40" y="60" width="50" height="30" rx="4" fill="#166534" opacity="0.15" />
          <rect x="160" y="170" width="60" height="35" rx="4" fill="#166534" opacity="0.15" />
          <rect x="100" y="130" width="40" height="25" rx="4" fill="#166534" opacity="0.1" />
        </svg>

        {/* Destination pin */}
        <div className="absolute top-[35%] left-[55%] flex flex-col items-center">
          <AnimatePresence>
            {arrived && [0, 1, 2].map((i) => (
              <motion.div key={i}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.45 }}
                className="absolute size-6 rounded-full border-2 border-[#16a34a]" />
            ))}
          </AnimatePresence>
          <motion.div
            animate={arrived ? { scale: [1, 1.2, 1] } : { y: [0, -6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="size-8 bg-[#16a34a] rounded-full grid place-items-center shadow-lg z-10">
            <MapPin className="size-4 text-white" />
          </motion.div>
        </div>

        {/* Moving dot (you) */}
        <motion.div
          initial={{ left: "8%", top: "70%" }}
          animate={arrived ? { left: "50%", top: "38%" } : { left: "8%", top: "70%" }}
          transition={{ duration: 1.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute size-5 rounded-full bg-blue-500 border-3 border-white shadow-md z-20 grid place-items-center">
          <motion.div animate={{ scale: [1, 1.8, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-blue-300 opacity-40" />
        </motion.div>
      </div>

      {/* Arrival notification */}
      <AnimatePresence>
        {arrived && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2.2 }}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#16a34a] text-white rounded-2xl px-5 py-2.5 shadow-xl flex items-center gap-2 whitespace-nowrap border-2 border-ink">
            <Check className="size-4 stroke-[3px]" />
            <p className="text-xs font-black">You arrived — alarm is ringing!</p>
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
    <div className="w-full flex flex-col gap-4">
      <p className="text-xs font-black uppercase tracking-widest text-ink/40">
        Which place should trigger a reminder?
      </p>
      <div className="grid grid-cols-2 gap-3">
        {places.map(p => (
          <button key={p.id} onClick={() => setChosen(p.id)}
            className={`flex flex-col gap-2 p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
              chosen === p.id
                ? "border-[#16a34a] bg-green-50 shadow-[3px_3px_0px_0px_rgba(22,163,74,0.3)]"
                : "border-ink/15 bg-white hover:border-ink/30"
            }`}>
            <span className="text-2xl">{p.emoji}</span>
            <p className={`text-xs font-black leading-snug ${chosen === p.id ? "text-ink" : "text-ink/50"}`}>{p.name}</p>
          </button>
        ))}
      </div>
      {chosen && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-green-400 bg-green-50 px-4 py-3">
          <p className="text-xs font-black text-green-700">
            ✅ MinDrop will ring when you walk into {places.find(p => p.id === chosen)?.name}.
          </p>
          <p className="text-xs font-semibold text-green-600/70 mt-1">
            "{places.find(p => p.id === chosen)?.hint}"
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
function PlacesDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;

  return (
    <div className="w-full min-h-screen bg-[#F0FDF4] text-ink font-sans overflow-x-hidden">

      {/* ── Sticky Nav ── */}
      <header className="sticky top-0 z-50 bg-[#F0FDF4]/92 backdrop-blur-md border-b-2 border-ink/8">
        <div className="w-[95%] mx-auto h-14 flex items-center justify-between">
          <Link to="/" hash={backHash} viewTransition
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-ink/50 hover:text-ink transition">
            <X className="size-3.5" /> Close
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-7 relative grid place-items-center shrink-0">
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-[#16a34a]/30" />
              <motion.div animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="size-5 rounded-md bg-gradient-to-tr from-[#16a34a] to-[#4ade80] grid place-items-center relative">
                <span className="text-white font-black text-[9px]">m</span>
              </motion.div>
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-ink/60 hidden sm:block">MinDrop</span>
          </div>
          <Link to="/download"
            className="text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-xl bg-ink text-white border-2 border-ink hover:bg-[#16a34a] hover:border-[#16a34a] transition">
            Get App
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          SECTION 1 — Opening Scene
      ══════════════════════════════════════════ */}
      <section
        className="min-h-[90vh] flex flex-col items-center justify-center text-center py-16 sm:py-24"
        style={{ viewTransitionName: 'card-places' } as React.CSSProperties}
      >
        <div className="w-[95%] mx-auto flex flex-col items-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-green-100 px-4 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#16a34a] mb-8">
            📍 Location Alarms
          </motion.span>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ink/35 leading-relaxed tracking-tight">
            You were at the pharmacy last Tuesday.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ink/35 leading-relaxed tracking-tight mt-1 sm:mt-2">
            Your doctor said to pick up those tablets.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ink/35 leading-relaxed tracking-tight mt-1 sm:mt-2">
            You walked right past the counter.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55, duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-ink leading-tight tracking-tight mt-5 sm:mt-7">
            You remembered at home.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
            className="mt-12 sm:mt-16 flex flex-col items-center gap-2 text-ink/20">
            <p className="text-[10px] font-black uppercase tracking-widest">Your location can remind you instead</p>
            <ChevronDown className="size-5 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — The Problem
      ══════════════════════════════════════════ */}
      <section className="bg-[#14532D] text-white py-16 sm:py-24">
        <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <FadeUp className="flex-1 text-left">
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/25 mb-4">
              The problem with time-based reminders
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-6">
              Some things cannot be tied<br />
              to a time.<br />
              <span className="text-[#4ade80]">They need a place.</span>
            </h2>
            <p className="text-base sm:text-lg font-semibold text-white/50 leading-relaxed max-w-lg">
              A reminder at 5 PM is useless if you reach the market at 6 PM, or at 3 PM on a different day. What you actually need is a reminder the moment you walk through the door.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="shrink-0 w-full lg:w-auto flex justify-center mt-8 lg:mt-0">
            <AnimatedMap />
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — What MinDrop Does
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#F0FDF4]">
        <div className="w-[95%] mx-auto flex flex-col items-center gap-10 sm:gap-14 text-center">
          <FadeUp className="max-w-3xl">
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#16a34a] mb-4">
              How MinDrop handles this
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-ink leading-tight">
              You tell MinDrop a place.<br />
              <span className="text-[#16a34a]">The moment you walk in</span>, it rings.
            </h2>
          </FadeUp>

          <FadeUp delay={0.08} className="max-w-2xl">
            <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/55 leading-relaxed">
              Pick a location from the map — your market, your gym, your office, wherever. Attach a reminder to it. The next time you arrive there, MinDrop rings your phone. No clock involved. Just your location.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 w-full mt-2">
            {[
              { icon: "🗺️", title: "Works Without Setting a Time", body: "You don't know exactly when you'll be at a place. Neither should your reminder. Just mark the place and MinDrop does the rest." },
              { icon: "🔋", title: "Does Not Drain Your Battery", body: "MinDrop uses your phone's cell towers to quietly check your location — not GPS. This uses almost no battery at all." },
              { icon: "🏠", title: "Your Location Never Leaves Your Phone", body: "All location checking happens on your device. MinDrop never sends your location data to any server, ever." },
            ].map(({ icon, title, body }) => (
              <FadeUp key={title}>
                <div className="bg-white border-3 border-ink rounded-[1.75rem] p-6 sm:p-7 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-3 h-full">
                  <span className="text-3xl">{icon}</span>
                  <h3 className="text-base sm:text-lg font-black text-ink">{title}</h3>
                  <p className="text-sm font-semibold text-ink/55 leading-relaxed">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — Place Simulator
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-green-50">
        <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          <div className="flex-1 w-full">
            <FadeUp>
              <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#16a34a] mb-4">
                Set one right now
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink leading-tight mb-4 sm:mb-5">
                Pick a place. See how it works.
              </h2>
              <p className="text-base sm:text-lg font-semibold text-ink/55 leading-relaxed mb-7 max-w-lg">
                Choose a place below. MinDrop will ring the next time you walk into that area — even if it has been three days.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.1} className="w-full lg:w-[400px] shrink-0">
            <PlaceSimulator />
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — How It Works
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#F0FDF4]">
        <div className="w-[95%] mx-auto">
          <FadeUp className="text-center mb-10 sm:mb-14">
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-ink/25 mb-4">How it works</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink leading-tight max-w-2xl mx-auto">
              From the map to the moment<br />you walk in — here is the journey.
            </h2>
          </FadeUp>

          <div className="flex flex-col w-full">
            {[
              {
                step: "01", color: "bg-[#ECFDF5]",
                title: "You save a place and add a note.",
                detail: "Open MinDrop, tap on the map, drop a pin on the place you want. Write a short note about what you need to do there. Done.",
              },
              {
                step: "02", color: "bg-[#F0FDF4]",
                title: "MinDrop quietly keeps an eye on your location.",
                detail: "Your phone tracks which mobile cell towers it can see. MinDrop checks this in the background — it barely uses any battery, and it does not need GPS running all the time.",
              },
              {
                step: "03", color: "bg-[#ECFDF5]",
                title: "When you get close, GPS confirms it.",
                detail: "Once your phone senses you are nearby, it turns on GPS for just a few seconds to confirm you are actually within the area. Then it turns off again.",
              },
              {
                step: "04", color: "bg-[#F0FDF4]",
                title: "The alarm rings the moment you arrive.",
                detail: "As soon as you enter the area, your phone rings with the reminder note you wrote. You deal with it, mark it done, and carry on. No re-setting required.",
              },
            ].map(({ step, title, detail, color }, i, arr) => (
              <FadeUp key={step} delay={i * 0.06}>
                <div className={`
                  flex flex-col sm:flex-row gap-5 sm:gap-8 items-start p-6 sm:p-8 md:p-10 border-x-3 border-t-3 border-ink
                  ${i === 0 ? "rounded-t-[2rem]" : ""}
                  ${i === arr.length - 1 ? "border-b-3 rounded-b-[2rem]" : ""}
                  ${color}
                `}>
                  <span className="text-4xl sm:text-5xl font-black text-ink/10 shrink-0">{step}</span>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-ink mb-2">{title}</h3>
                    <p className="text-sm sm:text-base font-semibold text-ink/50 leading-relaxed">{detail}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6 — Real Scenarios
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#14532D] overflow-hidden">
        <div className="w-[95%] mx-auto mb-10 sm:mb-14 text-center">
          <FadeUp>
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/25 mb-4">
              Places that need this most
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight max-w-2xl mx-auto">
              You visit these places. Every time is a chance to forget something.
            </h2>
          </FadeUp>
        </div>

        <div className="flex gap-4 sm:gap-5 overflow-x-auto pl-[2.5%] pr-[2.5%] pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}>
          {[
            { icon: ShoppingCart, title: "The Market", scene: "You always forget one thing — the thing your family needed most. Now your phone rings the moment you step inside.", color: "bg-green-50" },
            { icon: Stethoscope, title: "The Clinic or Hospital", scene: "Pick up reports. Collect a prescription. Ask the doctor about that one thing. You can stop trying to remember.", color: "bg-blue-50" },
            { icon: Briefcase, title: "Your Office", scene: "Ask about the leave. Submit the expense form. Reply to that client. Walk in, and MinDrop reminds you.", color: "bg-amber-50" },
            { icon: GraduationCap, title: "Your Child's School", scene: "Pay the fees. Hand in the form. Talk to the teacher. Attach the task to the school — done.", color: "bg-purple-50" },
            { icon: Home, title: "Back Home", scene: "Turn off the geyser. Lock the balcony. Feed the dog. The moment you walk through your door, MinDrop has your list ready.", color: "bg-red-50" },
          ].map(({ icon: Icon, title, scene, color }) => (
            <div key={title} className="snap-start shrink-0 w-60 sm:w-72">
              <div className={`rounded-[1.75rem] border-3 border-ink p-5 sm:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${color} flex flex-col gap-4`}>
                <div className="size-11 bg-white border-2 border-ink rounded-xl grid place-items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Icon className="size-5 text-ink" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-ink/40 uppercase tracking-wider mb-1">{title}</p>
                  <p className="text-sm sm:text-base font-black text-ink leading-snug">{scene}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 7 — Closer
      ══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-[#F0FDF4] text-center">
        <div className="w-[95%] mx-auto flex flex-col items-center gap-7 sm:gap-8">
          <FadeUp>
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-ink/25 mb-4 sm:mb-6">
              Stop carrying it all in your head
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-tight max-w-3xl mx-auto">
              The place will remind you. You just have to show up.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1} className="max-w-xl">
            <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/45 leading-relaxed">
              MinDrop turns every place you visit into a smart helper that knows exactly what you need to do when you arrive. No clocks. No guessing. Just walk in.
            </p>
          </FadeUp>
          <FadeUp delay={0.18} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto">
            <Link to="/download"
              className="px-8 sm:px-10 py-4 bg-ink text-white font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#16a34a] hover:border-[#16a34a] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
              Download MinDrop — It's Free
            </Link>
            <Link to="/" hash={backHash} viewTransition
              className="px-8 sm:px-10 py-4 bg-white text-ink font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-green-50 transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
              See All Features
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t-2 border-ink/10 bg-green-50 py-5 sm:py-6">
        <div className="w-[95%] mx-auto flex flex-wrap justify-between items-center gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-ink/25">MinDrop · Location Alarms · Private</span>
          <div className="flex gap-4 sm:gap-5">
            <Link to="/privacy" className="text-xs font-black text-ink/35 hover:text-ink transition">Privacy</Link>
            <Link to="/terms" className="text-xs font-black text-ink/35 hover:text-ink transition">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
