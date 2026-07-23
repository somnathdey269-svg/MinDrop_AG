import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
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
      { name: "description", content: "Compare MinDrop's Free Plan with the Premium Plan. Unlimited active alarms, notifications, and location rules." },
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
    <div className="relative size-32 sm:size-40 md:size-48 lg:size-56 flex items-center justify-center">
      <motion.div
        animate={{ y: [-15, 15, -15], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="size-24 sm:size-32 md:size-36 lg:size-40 bg-[#FCE7F3] border-3 border-[#EC4899] rounded-[2rem] grid place-items-center shadow-lg text-[#EC4899]"
      >
        <Sparkles className="size-14 sm:size-18 md:size-20 stroke-[2px]" />
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
    <div className="h-full bg-[#FFF2F7] flex items-center justify-center px-6 sm:px-10 lg:px-16">
      <div className="w-[95%] mx-auto max-w-7xl relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 text-left">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#EC4899]/20 bg-[#FCE7F3] px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#DB2777] mb-6 sm:mb-8">
            💎 Premium Plans
          </motion.span>

          <div className="flex flex-col gap-3 sm:gap-5 mb-6 sm:mb-8">
            {[
              "App subscriptions are tiring.",
              "MinDrop is built as a utility.",
              "Pay once, use forever.",
            ].map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-[#DB2777]/45 leading-tight tracking-tight">
                {line}
              </motion.p>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.65 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#831843] leading-none tracking-tighter">
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
    <div className="h-full bg-[#FFF2F7] flex items-center justify-center px-6 sm:px-10">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-6 sm:gap-10 max-w-7xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#DB2777] mb-2 sm:mb-3">
            Specs & plans
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#831843] leading-tight tracking-tight">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 w-full max-w-6xl text-left">
          {/* Free Tier */}
          <div className="border-3 border-ink rounded-[2rem] p-6 sm:p-10 bg-white shadow-[8px_8px_0px_0px_rgba(131,24,67,0.15)] flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl">🌱</span>
                <p className="text-xs sm:text-sm uppercase font-black text-ink/50 tracking-wider">Free Tier</p>
              </div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink mt-3">Free Forever</p>
              <ul className="text-sm sm:text-sm md:text-base lg:text-lg text-ink/80 font-bold mt-6 space-y-3.5 border-t border-dashed border-ink/20 pt-5">
                <li className="flex items-center gap-2.5">
                  <Check className="size-5 text-[#10B981] stroke-[3px] shrink-0" />
                  <span>Up to 3 active alarms</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-5 text-[#10B981] stroke-[3px] shrink-0" />
                  <span>Up to 3 notification filter rules</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-5 text-[#10B981] stroke-[3px] shrink-0" />
                  <span>Up to 3 saved places / locations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-5 text-[#10B981] stroke-[3px] shrink-0" />
                  <span>Voice capture & offline photo storage</span>
                </li>
              </ul>
            </div>
            <p className="text-xs sm:text-xs text-ink/40 font-black uppercase tracking-wider">Default setup ready offline</p>
          </div>

          {/* Premium Tier */}
          <div className="border-3 border-ink rounded-[2rem] p-6 sm:p-10 bg-[#FFF2F7] shadow-[8px_8px_0px_0px_rgba(131,24,67,0.15)] flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl">💎</span>
                <p className="text-xs sm:text-sm uppercase font-black text-[#DB2777] tracking-wider">Premium Plan</p>
              </div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink mt-3">{priceDisplay} / Year</p>
              <ul className="text-sm sm:text-sm md:text-base lg:text-lg text-ink/80 font-bold mt-6 space-y-3.5 border-t border-dashed border-ink/20 pt-5">
                <li className="flex items-center gap-2.5">
                  <Check className="size-5 text-[#EC4899] stroke-[3px] shrink-0" />
                  <span className="text-[#831843]">Infinite active alarms</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-5 text-[#EC4899] stroke-[3px] shrink-0" />
                  <span className="text-[#831843]">Infinite notification filter rules</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-5 text-[#EC4899] stroke-[3px] shrink-0" />
                  <span className="text-[#831843]">Infinite saved places / locations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-5 text-[#EC4899] stroke-[3px] shrink-0" />
                  <span className="text-[#831843]">Private Google Drive cloud backup sync</span>
                </li>
              </ul>
            </div>
            <p className="text-xs sm:text-xs text-[#DB2777]/50 font-black uppercase tracking-wider">Linked to superadmin configs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Flow diagram */
function SlideFlow() {
  return (
    <div className="h-full bg-[#FCE7F3] flex items-center justify-center px-6 sm:px-10">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-8 sm:gap-12 max-w-7xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#DB2777] mb-2 sm:mb-3">
            Upgrade flow
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#831843] leading-tight tracking-tight">
            How your upgrade works
          </h2>
        </div>

        {/* Responsive Flex row for step indicators with responsive sizes */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 w-full max-w-6xl">
          {/* Step 1 */}
          <div className="border-3 border-ink bg-white p-8 sm:p-10 lg:p-12 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center flex-1 w-full">
            <span className="text-xs sm:text-sm font-black text-[#DB2777] uppercase tracking-wider">01 / Download</span>
            <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-ink mt-3 leading-snug">Get Free App</h4>
            <p className="text-sm sm:text-base md:text-lg text-ink/60 font-bold mt-2 leading-relaxed">Runs offline. Set up to 3 alarms, filters, & locations.</p>
          </div>

          <ArrowRight className="size-8 text-ink/30 rotate-90 lg:rotate-0 shrink-0" />

          {/* Step 2 */}
          <div className="border-3 border-ink bg-white p-8 sm:p-10 lg:p-12 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center flex-1 w-full">
            <span className="text-xs sm:text-sm font-black text-[#DB2777] uppercase tracking-wider">02 / Subscribe</span>
            <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-ink mt-3 leading-snug">Yearly Plan</h4>
            <p className="text-sm sm:text-base md:text-lg text-ink/60 font-bold mt-2 leading-relaxed">Unlock settings securely via in-app dashboard.</p>
          </div>

          <ArrowRight className="size-8 text-ink/30 rotate-90 lg:rotate-0 shrink-0" />

          {/* Step 3 */}
          <div className="border-3 border-ink bg-white p-8 sm:p-10 lg:p-12 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center flex-1 w-full">
            <span className="text-xs sm:text-sm font-black text-[#DB2777] uppercase tracking-wider">03 / Enjoy</span>
            <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-ink mt-3 leading-snug">Unlimited Slots</h4>
            <p className="text-sm sm:text-base md:text-lg text-ink/60 font-bold mt-2 leading-relaxed">Enjoy geofences and cloud sync instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Slide 4: Specs closer */
function SlideCloser({ backHash }: { backHash?: string }) {
  return (
    <div className="h-full bg-[#FFF2F7] flex items-center justify-center px-6 sm:px-10">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-6 sm:gap-10 max-w-7xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#DB2777] mb-3">
            Under the hood specs
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#831843] leading-none tracking-tighter">
            An engine built to last.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full text-left">
          {[
            { icon: ShieldAlert, color: "text-[#EF4444]", title: "Subscription Simplicity", desc: "Clearly visible terms with zero hidden fees. Complete control of plan adjustments." },
            { icon: Play, color: "text-[#EC4899]", title: "Offline Verification", desc: "Settings checks are stored locally on-device. No query delays or server locks." },
            { icon: Layers, color: "text-[#10B981]", title: "Privacy Sync", desc: "Backup loops directly through your Google Drive. We never see your data." },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-white border-3 border-[#EC4899] rounded-[2rem] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(131,24,67,0.15)] flex flex-col gap-3">
              <Icon className={`size-8 ${color} shrink-0`} />
              <h3 className="text-base sm:text-lg md:text-xl font-black text-[#831843]">{title}</h3>
              <p className="text-sm sm:text-sm md:text-base font-semibold text-[#DB2777]/70 leading-relaxed">{desc}</p>
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
      {/* 1. Header (Responsive: Logo-only on Mobile, Close + Logo + Get App on Desktop) */}
      <header className="shrink-0 h-12 border-b-2 border-[#EC4899]/10 z-50 bg-[#FFF2F7]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-center sm:justify-between">
        <Link to="/" hash={backHash} viewTransition
          className="hidden sm:flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition text-[#DB2777]/70 hover:text-[#831843]">
          <X className="size-3.5"/> Close
        </Link>

        <Link to="/" hash={backHash} viewTransition aria-label="MinDrop — Home">
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" />
        </Link>

        <Link to="/download" viewTransition
          className="hidden sm:inline-flex items-center justify-center text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 sm:px-4 py-1.5 rounded-full border-2 bg-ink text-white border-ink hover:bg-[#EC4899] hover:border-[#EC4899] shrink-0 leading-none whitespace-nowrap shadow-sm transition">
          Get App
        </Link>
      </header>

      {/* 2. Main Content Stage */}
      <main 
        ref={containerRef}
        className="flex-1 min-h-0 w-full relative overflow-y-auto sm:overflow-hidden flex items-center justify-center px-3 sm:px-6 py-2"
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => {
          const delta = touchStartY.current - e.changedTouches[0].clientY;
          if (Math.abs(delta) > 50) {
            if (delta > 0) goTo(current + 1);
            else goTo(current - 1);
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
                i === current
                  ? "w-1.5 h-7 bg-[#EC4899]"
                  : "size-1.5 bg-[#DB2777]/25 hover:bg-[#DB2777]/50"
              }`}
            />
          ))}
        </div>
      </main>

      {/* 3. ELEVATED FLOATING ISLAND DOCK FOOTER (Mobile Only) */}
      <div className="sm:hidden w-full flex items-center justify-center shrink-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1">
        <footer className="w-full max-w-sm bg-white border-3 border-ink rounded-full px-4 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between select-none">
          <Link 
            to="/"
            hash={backHash}
            viewTransition
            className="text-[11px] uppercase font-black tracking-widest text-ink hover:text-[#FF671F] transition-colors leading-none flex items-center shrink-0 cursor-pointer"
          >
            HOME
          </Link>

          {/* Segmented UP / DOWN Controls */}
          <div className="bg-ink border-2 border-ink rounded-full p-0.5 flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer leading-none ${
                current === 0 
                  ? "opacity-30 text-white/50 cursor-not-allowed" 
                  : "bg-white text-ink shadow-xs"
              }`}
              aria-label="Previous Slide (UP)"
            >
              <ChevronUp className="size-3 stroke-[2.5px]" />
              <span>UP</span>
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              disabled={current === TOTAL - 1}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer leading-none ${
                current === TOTAL - 1 
                  ? "opacity-30 text-white/50 cursor-not-allowed" 
                  : "bg-white text-ink shadow-xs"
              }`}
              aria-label="Next Slide (DOWN)"
            >
              <ChevronDown className="size-3 stroke-[2.5px]" />
              <span>DOWN</span>
            </button>
          </div>

          <Link
            to="/download"
            viewTransition
            className="text-[11px] uppercase tracking-widest font-black text-ink hover:text-[#FF671F] transition-colors leading-none flex items-center shrink-0 cursor-pointer"
          >
            GET APP
          </Link>
        </footer>
      </div>
    </div>
  );
}
