import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Check, X, ArrowRight, ShieldAlert, Play, Layers, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import { getPublicSettings, type CurrencyPrice } from "@/lib/platformSettings.functions";

export const Route = createFileRoute("/pricing")({
  validateSearch: (search: Record<string, unknown>) => {
    return { from: (search.from as string) || undefined };
  },
  head: () => ({
    meta: [
      { title: "Pricing & Plans — MinDrop" },
      { name: "description", content: "Compare MinDrop's Free Plan with the Premium Plan. Unlimited active drops and private Google Drive backup sync." },
    ],
  }),
  component: PricingDetailView,
});

function detectPreferredCurrency(available: string[]): string {
  if (typeof navigator === "undefined") return "INR";
  try {
    const locale = navigator.language || "en-IN";
    const region = new Intl.Locale(locale).maximize().region || "IN";
    const map: Record<string, string> = {
      IN: "INR", US: "USD", GB: "GBP", AU: "AUD", CA: "CAD",
      SG: "SGD", AE: "AED", JP: "JPY",
    };
    const euroCountries = ["DE","FR","IT","ES","NL","BE","AT","IE","PT","FI","GR","LU","SK","SI","EE","LV","LT","MT","CY"];
    if (euroCountries.includes(region)) return available.includes("EUR") ? "EUR" : "INR";
    const guess = map[region] || "INR";
    return available.includes(guess) ? guess : (available.includes("INR") ? "INR" : available[0] || "INR");
  } catch { return "INR"; }
}

/* ──────────────────────────────────────────────
   SUBTLE STEP ILLUSTRATIONS
────────────────────────────────────────────── */
function FloatingGem() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ y: [-12, 12, -12], rotate: [0, 12, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="size-24 sm:size-28 md:size-32 bg-[#FCE7F3] border-3 border-[#EC4899] rounded-[2rem] grid place-items-center shadow-lg text-[#EC4899]"
      >
        <Sparkles className="size-14 sm:size-16 stroke-[2px]" />
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SLIDES
══════════════════════════════════════════════ */

/* Slide 1: Opening Hero */
function SlideOpening() {
  return (
    <div className="h-full bg-[#FFF2F7] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 text-left">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#EC4899]/20 bg-[#FCE7F3] px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#DB2777] mb-6 sm:mb-8">
            💎 Premium Plans
          </motion.span>

          <div className="flex flex-col gap-3 sm:gap-4 mb-6">
            {[
              "App subscriptions are tiring.",
              "MinDrop is built as a utility.",
              "Pay once, use forever.",
            ].map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#DB2777]/45 leading-tight tracking-tight">
                {line}
              </motion.p>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.65 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#831843] leading-none tracking-tighter">
            Keep it free, or unlock limits.
          </motion.p>
        </div>

        <div className="shrink-0">
          <FloatingGem />
        </div>
      </div>
    </div>
  );
}

/* Slide 2: Tiers (Free vs Premium) */
interface SlideTiersProps {
  prices: Record<string, CurrencyPrice>;
  currency: string;
  setCurrency: (c: string) => void;
  availableCurrencies: string[];
}
function SlideTiers({ prices, currency, setCurrency, availableCurrencies }: SlideTiersProps) {
  const selected = prices[currency];
  const priceDisplay = selected ? `${selected.symbol}${selected.displayed}` : "₹999";

  return (
    <div className="h-full bg-[#FFF2F7] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-6 sm:gap-8 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#DB2777] mb-2 sm:mb-3">
            Specs & plans
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#831843] leading-tight tracking-tight">
            Clear pricing. Simple structure.
          </h2>

          {/* Currency Switcher */}
          {availableCurrencies.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
              <span className="text-[10px] font-black text-[#DB2777]/60 uppercase tracking-widest">Select Currency:</span>
              <div className="flex gap-1">
                {availableCurrencies.map(c => (
                  <button key={c} onClick={() => setCurrency(c)}
                    className={`px-2.5 py-1 text-[10px] font-black rounded border-2 transition cursor-pointer ${
                      currency === c
                        ? "bg-[#EC4899] border-[#EC4899] text-white"
                        : "bg-white border-ink/10 text-ink/50"
                    }`}>{c}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-5xl text-left">
          {/* Free Tier */}
          <div className="border-3 border-ink rounded-[2rem] p-6 sm:p-8 bg-white shadow-[6px_6px_0px_0px_rgba(131,24,67,0.15)] flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌱</span>
                <p className="text-xs uppercase font-black text-ink/50 tracking-wider">Free Tier</p>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-ink mt-3">Free Forever</p>
              <ul className="text-xs sm:text-sm md:text-base text-ink/80 font-bold mt-6 space-y-3 border-t border-dashed border-ink/20 pt-4">
                <li className="flex items-center gap-2.5">
                  <Check className="size-4.5 text-[#10B981] stroke-[3px] shrink-0" />
                  <span>Up to 5 concurrent active drops</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4.5 text-[#10B981] stroke-[3px] shrink-0" />
                  <span>Voice capture & offline photo storage</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4.5 text-[#10B981] stroke-[3px] shrink-0" />
                  <span>All triggers (Time, Location, Filters)</span>
                </li>
              </ul>
            </div>
            <p className="text-[10px] text-ink/40 font-black uppercase tracking-wider">Default setup ready offline</p>
          </div>

          {/* Premium Tier */}
          <div className="border-3 border-ink rounded-[2rem] p-6 sm:p-8 bg-[#FFF2F7] shadow-[6px_6px_0px_0px_rgba(131,24,67,0.15)] flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <p className="text-xs uppercase font-black text-[#DB2777] tracking-wider">Premium Plan</p>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-ink mt-3">{priceDisplay} / Year</p>
              <ul className="text-xs sm:text-sm md:text-base text-ink/80 font-bold mt-6 space-y-3 border-t border-dashed border-ink/20 pt-4">
                <li className="flex items-center gap-2.5">
                  <Check className="size-4.5 text-[#EC4899] stroke-[3px] shrink-0" />
                  <span className="text-[#831843]">Infinite concurrent active drops</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4.5 text-[#EC4899] stroke-[3px] shrink-0" />
                  <span className="text-[#831843]">Private Google Drive cloud backup sync</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4.5 text-[#EC4899] stroke-[3px] shrink-0" />
                  <span className="text-[#831843]">Neo-Brutalist visual theme packs</span>
                </li>
              </ul>
            </div>
            <p className="text-[10px] text-[#DB2777]/50 font-black uppercase tracking-wider">Linked to superadmin configs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Flow diagram */
function SlideFlow() {
  return (
    <div className="h-full bg-[#FCE7F3] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-6 sm:gap-8 max-w-5xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#DB2777] mb-2">
            Upgrade flow
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#831843] leading-tight tracking-tight">
            How your upgrade works
          </h2>
        </div>

        {/* Responsive Flex row for step indicators */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 w-full">
          {/* Step 1 */}
          <div className="border-3 border-ink bg-white p-6 rounded-[2rem] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center flex-1 w-full max-w-sm">
            <span className="text-[10px] font-black text-[#DB2777] uppercase tracking-wider">01 / Download</span>
            <h4 className="text-sm sm:text-base font-black text-ink mt-2 leading-snug">Get Free App</h4>
            <p className="text-xs text-ink/60 font-semibold mt-1.5 leading-normal">Runs 100% offline right on your device</p>
          </div>

          <ArrowRight className="size-6 text-ink/30 rotate-90 lg:rotate-0 shrink-0" />

          {/* Step 2 */}
          <div className="border-3 border-ink bg-white p-6 rounded-[2rem] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center flex-1 w-full max-w-sm">
            <span className="text-[10px] font-black text-[#DB2777] uppercase tracking-wider">02 / Subscribe</span>
            <h4 className="text-sm sm:text-base font-black text-ink mt-2 leading-snug">Yearly Plan</h4>
            <p className="text-xs text-ink/60 font-semibold mt-1.5 leading-normal">Unlock settings via in-app dashboard securely</p>
          </div>

          <ArrowRight className="size-6 text-ink/30 rotate-90 lg:rotate-0 shrink-0" />

          {/* Step 3 */}
          <div className="border-3 border-ink bg-white p-6 rounded-[2rem] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center flex-1 w-full max-w-sm">
            <span className="text-[10px] font-black text-[#DB2777] uppercase tracking-wider">03 / Enjoy</span>
            <h4 className="text-sm sm:text-base font-black text-ink mt-2 leading-snug">Unlimited Slots</h4>
            <p className="text-xs text-ink/60 font-semibold mt-1.5 leading-normal">Enjoy geofences and cloud sync instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Specs closer */
function SlideCloser({ backHash }: { backHash?: string }) {
  return (
    <div className="h-full bg-[#FFF2F7] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-6 sm:gap-8 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#DB2777] mb-3">
            Under the hood specs
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#831843] leading-none tracking-tighter">
            An engine built to last.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
          {[
            { icon: ShieldAlert, color: "text-[#EF4444]", title: "Subscription Simplicity", desc: "Clearly visible terms with zero hidden fees. Complete control of plan adjustments." },
            { icon: Play, color: "text-[#EC4899]", title: "Offline Verification", desc: "Settings checks are stored locally on-device. No query delays or server locks." },
            { icon: Layers, color: "text-[#10B981]", title: "Privacy Sync", desc: "Backup loops directly through your Google Drive. We never see your data." },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-white border-3 border-[#EC4899] rounded-[2rem] p-6 shadow-[5px_5px_0px_0px_rgba(131,24,67,0.15)] flex flex-col gap-3">
              <Icon className={`size-7 ${color} shrink-0`} />
              <h3 className="text-base font-black text-[#831843]">{title}</h3>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-[#DB2777]/70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 justify-center">
          <Link to="/download"
            className="px-10 sm:px-12 py-4.5 sm:py-5 bg-ink text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EC4899] hover:border-[#EC4899] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Download MinDrop
          </Link>
          <Link to="/" hash={backHash} viewTransition
            className="px-10 sm:px-12 py-4.5 sm:py-5 bg-white text-ink font-black text-sm sm:text-base uppercase tracking-wider rounded-xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FCE7F3] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center">
            Back to Deck
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN — Full-Page Fade Scroll Controller
══════════════════════════════════════════════ */
function PricingDetailView() {
  const { from } = Route.useSearch();
  const backHash = from === "grid" ? "grid" : undefined;

  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const lastScrollTime = useRef(0);

  const [prices, setPrices] = useState<Record<string, CurrencyPrice>>({});
  const [currency, setCurrency] = useState<string>("INR");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await getPublicSettings();
        if (cancelled) return;
        setPrices(s.displayPrices || {});
        setCurrency(detectPreferredCurrency(Object.keys(s.displayPrices || { INR: {} })));
      } catch (e) {
        console.error("Failed loading superadmin settings", e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const availableCurrencies = useMemo(() => Object.keys(prices).sort(), [prices]);

  const slides = [
    <SlideOpening />,
    <SlideTiers prices={prices} currency={currency} setCurrency={setCurrency} availableCurrencies={availableCurrencies} />,
    <SlideFlow />,
    <SlideCloser backHash={backHash} />,
  ];
  const TOTAL = slides.length;

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
      style={{ viewTransitionName: "card-pricing" } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <header className="shrink-0 border-b-2 border-[#EC4899]/10 z-50 bg-[#FFF2F7]/95 backdrop-blur-[12px] transition-colors duration-300">
        <div className="w-[95%] mx-auto h-14 flex items-center justify-between">
          <Link to="/" hash={backHash} viewTransition
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition text-[#DB2777]/60 hover:text-[#831843]">
            <X className="size-3.5"/> Close
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-7 relative grid place-items-center shrink-0">
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-[#EC4899]/30" />
              <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="size-5 rounded-md bg-gradient-to-tr from-[#EC4899] to-[#FCE7F3] grid place-items-center relative">
                <span className="text-white font-black text-[9px]">m</span>
              </motion.div>
            </div>
            <span className="text-xs font-black uppercase tracking-wider hidden sm:block text-[#DB2777]/70">MinDrop</span>
          </div>
          <Link to="/download"
            className="text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-xl border-2 bg-ink text-white border-ink hover:bg-[#EC4899] hover:border-[#EC4899] transition">
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
            className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 z-20 cursor-pointer group text-[#DB2777]/30 hover:text-[#831843]"
          >
            <ChevronDown className="size-3.5 rotate-180 transition group-hover:-translate-y-0.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">
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
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 z-20 cursor-pointer group text-[#DB2777]/30 hover:text-[#831843]"
          >
            <span className="text-[9px] font-black uppercase tracking-widest">
              scroll or ↓
            </span>
            <ChevronDown className="size-3.5 transition group-hover:translate-y-0.5" />
          </button>
        )}

        {/* ── Right Dot Navigation ── */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-30">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "w-1.5 h-7 bg-[#EC4899]"
                  : "size-1.5 bg-[#DB2777]/25 hover:bg-[#DB2777]/50"
              }`}
            />
          ))}
          <p className="text-[9px] font-black mt-1 tabular-nums text-[#DB2777]/30">
            {current + 1}/{TOTAL}
          </p>
        </div>
      </div>
    </div>
  );
}
