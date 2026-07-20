import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BellRing, Check, X, Filter, Volume2, Bell,
  ChevronDown, CreditCard, MessageSquare, ShoppingBag, Banknote
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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

/* ─── Notification flood demo ─── */
function NotificationFlood() {
  const [visible, setVisible] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  const notifs = [
    { icon: "💬", app: "WhatsApp Group", text: "Rahul sent a meme 😂", color: "bg-green-50 border-green-200" },
    { icon: "🛒", app: "Swiggy Offer", text: "60% off your next order!", color: "bg-orange-50 border-orange-200" },
    { icon: "🏦", app: "HDFC Bank", text: "₹15,000 debited from your account", color: "bg-red-50 border-red-200", important: true },
    { icon: "📱", app: "Instagram", text: "Priya liked your photo", color: "bg-pink-50 border-pink-200" },
    { icon: "🛍️", app: "Amazon Sale", text: "Today only — 80% off!", color: "bg-yellow-50 border-yellow-200" },
  ];

  useEffect(() => {
    if (!inView) return;
    notifs.forEach((_, i) => {
      setTimeout(() => setVisible(v => [...v, i]), i * 400 + 300);
    });
  }, [inView]);

  return (
    <div ref={ref} className="flex flex-col gap-2 w-full max-w-sm">
      {notifs.map((n, i) => (
        <AnimatePresence key={i}>
          {visible.includes(i) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className={`flex items-center gap-3 border rounded-2xl px-4 py-3 ${n.color} ${n.important ? "ring-2 ring-amber-400" : ""}`}>
              <span className="text-xl">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-black/50 uppercase tracking-wide">{n.app}</p>
                <p className={`text-xs font-bold leading-snug truncate ${n.important ? "text-red-700" : "text-black/60"}`}>{n.text}</p>
              </div>
              {n.important && (
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}
                  className="text-[9px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
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
    { id: "bank", label: "Bank alerts (debit / credit)", emoji: "🏦", matched: true },
    { id: "upi", label: "UPI payment messages", emoji: "💳", matched: true },
    { id: "promo", label: "Sale and discount offers", emoji: "🛒", matched: false },
    { id: "social", label: "Likes, comments, follows", emoji: "📱", matched: false },
    { id: "chat", label: "Group chat messages", emoji: "💬", matched: false },
  ];

  const [active, setActive] = useState<string[]>(["bank", "upi"]);

  const toggle = (id: string) =>
    setActive(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);

  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-xs font-black uppercase tracking-widest text-ink/40">
        Which types of alerts should wake you up?
      </p>
      <div className="flex flex-col gap-2">
        {rules.map(r => (
          <button key={r.id} onClick={() => toggle(r.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition cursor-pointer ${
              active.includes(r.id)
                ? "border-[#F59E0B] bg-amber-50 shadow-[3px_3px_0px_0px_rgba(245,158,11,0.3)]"
                : "border-ink/15 bg-white"
            }`}>
            <span className="text-xl">{r.emoji}</span>
            <p className={`flex-1 text-sm font-bold ${active.includes(r.id) ? "text-ink" : "text-ink/40"}`}>{r.label}</p>
            {active.includes(r.id) && <Volume2 className="size-4 text-amber-500 shrink-0" />}
          </button>
        ))}
      </div>
      <div className={`rounded-2xl border-2 px-4 py-3 transition-all ${active.length > 0 ? "border-amber-400 bg-amber-50" : "border-ink/10 bg-white"}`}>
        <p className="text-xs font-black text-amber-700">
          {active.length === 0
            ? "No filters active. All alerts will behave normally."
            : `${active.length} filter${active.length > 1 ? "s" : ""} active. Those alerts will ring as a looping alarm.`}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
function NotifyDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;

  return (
    <div className="w-full min-h-screen bg-[#FFFDF5] text-ink font-sans overflow-x-hidden">

      {/* ── Sticky Nav ── */}
      <header className="sticky top-0 z-50 bg-[#FFFDF5]/92 backdrop-blur-md border-b-2 border-ink/8">
        <div className="w-[95%] mx-auto h-14 flex items-center justify-between">
          <Link to="/" hash={backHash} viewTransition
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-ink/50 hover:text-ink transition">
            <X className="size-3.5" /> Close
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-7 relative grid place-items-center shrink-0">
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-[#F59E0B]/30" />
              <motion.div animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="size-5 rounded-md bg-gradient-to-tr from-[#F59E0B] to-[#FCD34D] grid place-items-center relative">
                <span className="text-white font-black text-[9px]">m</span>
              </motion.div>
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-ink/60 hidden sm:block">MinDrop</span>
          </div>
          <Link to="/download"
            className="text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-xl bg-ink text-white border-2 border-ink hover:bg-[#F59E0B] hover:border-[#F59E0B] transition">
            Get App
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          SECTION 1 — Opening Scene
      ══════════════════════════════════════════ */}
      <section
        className="min-h-[90vh] flex flex-col items-center justify-center text-center py-16 sm:py-24"
        style={{ viewTransitionName: 'card-notify' } as React.CSSProperties}
      >
        <div className="w-[95%] mx-auto flex flex-col items-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-amber-100 px-4 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#D97706] mb-8">
            🔔 Smart Filters
          </motion.span>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ink/35 leading-relaxed tracking-tight">
            Your phone got 47 notifications today.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-ink/35 leading-relaxed tracking-tight mt-1 sm:mt-2">
            One of them said ₹18,000 was taken from your account.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-ink leading-tight tracking-tight mt-5 sm:mt-7">
            You saw it 4 hours later.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
            className="mt-12 sm:mt-16 flex flex-col items-center gap-2 text-ink/20">
            <p className="text-[10px] font-black uppercase tracking-widest">Your important alerts deserve better</p>
            <ChevronDown className="size-5 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — The Noise Problem
      ══════════════════════════════════════════ */}
      <section className="bg-[#1C1917] text-white py-16 sm:py-24">
        <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <FadeUp className="flex-1 text-left">
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/25 mb-4">
              Why everything gets lost in your phone
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-6">
              Every app shouts.<br />
              <span className="text-[#F59E0B]">The important ones get lost</span><br />
              in the crowd.
            </h2>
            <p className="text-base sm:text-lg font-semibold text-white/50 leading-relaxed max-w-lg">
              Sales offers, group chats, likes, reminders, cricket scores — they all arrive looking exactly the same. Your brain tunes them all out. Including the one that actually needed your attention.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="shrink-0 w-full lg:w-auto flex justify-center">
            <NotificationFlood />
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — What MinDrop Does
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#FFFDF5]">
        <div className="w-[95%] mx-auto flex flex-col items-center gap-10 sm:gap-14 text-center">
          <FadeUp className="max-w-3xl">
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#D97706] mb-4">
              How MinDrop handles this
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-ink leading-tight">
              MinDrop watches your alerts.<br />
              <span className="text-[#F59E0B]">The important ones</span> get turned into a ringing alarm.
            </h2>
          </FadeUp>

          <FadeUp delay={0.08} className="max-w-2xl">
            <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/55 leading-relaxed">
              You tell MinDrop what matters to you — bank alerts, payment messages, anything else you choose. When those arrive, instead of showing a silent banner, MinDrop rings your phone loudly until you look at it.
            </p>
          </FadeUp>

          {/* Three pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 w-full mt-2">
            {[
              { icon: "🎯", title: "You Decide What Matters", body: "Choose which types of messages should wake you up. Sales offers stay silent. Your bank alert rings." },
              { icon: "📴", title: "Works Even in Silent Mode", body: "When your phone is on silent, important alerts still ring through. Nothing slips past unnoticed." },
              { icon: "🔒", title: "Stays on Your Phone Only", body: "MinDrop reads your alerts right there on your phone. Nothing is sent to any server. Your messages stay private." },
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
          SECTION 4 — Build Your Filter
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-amber-50">
        <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          <div className="flex-1 w-full">
            <FadeUp>
              <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#D97706] mb-4">
                You are in control
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink leading-tight mb-4 sm:mb-5">
                Set it once. Then forget it.
              </h2>
              <p className="text-base sm:text-lg font-semibold text-ink/55 leading-relaxed mb-7 max-w-lg">
                Pick the types of alerts that should never be missed. MinDrop takes care of the rest. Toggle the ones that matter to you below.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.1} className="w-full lg:w-[420px] shrink-0">
            <FilterSimulator />
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — How It Works
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#FFFDF5]">
        <div className="w-[95%] mx-auto">
          <FadeUp className="text-center mb-10 sm:mb-14">
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-ink/25 mb-4">How it works</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink leading-tight max-w-2xl mx-auto">
              What happens from the moment<br />an alert arrives on your phone.
            </h2>
          </FadeUp>

          <div className="flex flex-col w-full">
            {[
              {
                step: "01", color: "bg-[#FFFBEB]",
                title: "An alert arrives on your phone.",
                detail: "This could be anything — a WhatsApp message, a bank SMS, an Instagram like. It arrives the same way it always does.",
              },
              {
                step: "02", color: "bg-[#FFF7ED]",
                title: "MinDrop checks if it matches your filters.",
                detail: "In less than a second, MinDrop reads the alert and checks if it matches the types you said matter to you. This all happens right on your phone — nothing leaves it.",
              },
              {
                step: "03", color: "bg-[#FFFBEB]",
                title: "If it matches, the alarm rings.",
                detail: "Instead of a quiet banner, your phone starts ringing — just like a phone call. It does not stop until you see it and decide what to do.",
              },
              {
                step: "04", color: "bg-[#FFF7ED]",
                title: "If it does not match, nothing changes.",
                detail: "Promos, chats, random updates — they behave exactly as they always did. Silent when you want silence. MinDrop only acts on what you told it to watch.",
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
          SECTION 6 — Real Moments
      ══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#1C1917] overflow-hidden">
        <div className="w-[95%] mx-auto mb-10 sm:mb-14 text-center">
          <FadeUp>
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/25 mb-4">
              Moments this saves you
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight max-w-2xl mx-auto">
              These are the alerts that cannot wait.
            </h2>
          </FadeUp>
        </div>

        <div className="flex gap-4 sm:gap-5 overflow-x-auto pl-[2.5%] pr-[2.5%] pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}>
          {[
            { icon: Banknote, title: "Money Movement", scene: "₹18,000 was just taken from your account. You need to know this the moment it happens.", color: "bg-red-50" },
            { icon: CreditCard, title: "UPI Payment", scene: "Someone sent you money via UPI. Or charged your card. Either way, this cannot sit unread.", color: "bg-green-50" },
            { icon: MessageSquare, title: "That One Person", scene: "Your child messaged you. Your doctor sent a reply. Not every message is equal — and now they won't be treated equally.", color: "bg-blue-50" },
            { icon: ShoppingBag, title: "Order Going Wrong", scene: "Your delivery was cancelled. Your return was rejected. These need your attention right now, not tomorrow.", color: "bg-purple-50" },
            { icon: Bell, title: "Any Alert You Choose", scene: "You are not limited to our list. Add any keyword, any app name, any amount. You are in full control.", color: "bg-amber-50" },
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
      <section className="py-24 sm:py-32 bg-[#FFFDF5] text-center">
        <div className="w-[95%] mx-auto flex flex-col items-center gap-7 sm:gap-8">
          <FadeUp>
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-ink/25 mb-4 sm:mb-6">
              Stop treating all alerts the same
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-tight max-w-3xl mx-auto">
              Some things demand your attention. Others don't.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1} className="max-w-xl">
            <p className="text-base sm:text-lg md:text-xl font-semibold text-ink/45 leading-relaxed">
              MinDrop gives your truly important alerts a voice loud enough to be heard — and keeps everything else quiet, just the way you like it.
            </p>
          </FadeUp>
          <FadeUp delay={0.18} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto">
            <Link to="/download"
              className="px-8 sm:px-10 py-4 bg-ink text-white font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#F59E0B] hover:border-[#F59E0B] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
              Download MinDrop — It's Free
            </Link>
            <Link to="/" hash={backHash} viewTransition
              className="px-8 sm:px-10 py-4 bg-white text-ink font-black text-sm uppercase tracking-wider rounded-xl border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-50 transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
              See All Features
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t-2 border-ink/10 bg-amber-50 py-5 sm:py-6">
        <div className="w-[95%] mx-auto flex flex-wrap justify-between items-center gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-ink/25">MinDrop · Filters · Private by Design</span>
          <div className="flex gap-4 sm:gap-5">
            <Link to="/privacy" className="text-xs font-black text-ink/35 hover:text-ink transition">Privacy</Link>
            <Link to="/terms" className="text-xs font-black text-ink/35 hover:text-ink transition">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
