import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import { MobileFeatureDock } from "@/components/layout/MobileFeatureDock";
import { Sparkles, Check, X, ArrowRight, ShieldAlert, Play, Layers, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { getPublicSettings, type CurrencyPrice } from "@/lib/platformSettings.functions";
import { useCMSPage } from "@/lib/cms/useCMSPage";
import { DynamicBlockRenderer } from "@/components/cms/DynamicBlockRenderer";

export const Route = createFileRoute("/pricing")({
  validateSearch: (search: Record<string, unknown>): { from?: string } => {
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
    <div className="w-full h-full bg-[#FFF2F7] flex items-center justify-center px-6 sm:px-10 lg:px-16">
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
    <div className="w-full h-full bg-[#FFF2F7] flex items-center justify-center px-6 sm:px-10">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-6 sm:gap-10 max-w-7xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#DB2777] mb-2 sm:mb-3">
            💎 UNLOCK LIFETIME PEACE & TRANSPARENT PLANS
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
    <div className="w-full h-full bg-[#FCE7F3] flex items-center justify-center px-6 sm:px-10">
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
    <div className="w-full h-full bg-[#FFF2F7] flex items-center justify-center px-6 sm:px-10">
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
          <Link
            to="/download"
            resetScroll={true}
            viewTransition
            style={{ viewTransitionName: 'card-download' } as React.CSSProperties}
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-5 rounded-2xl bg-[#EC4899] text-white font-black text-sm sm:text-base uppercase tracking-wider border-3 border-ink shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#BE185D] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer text-center whitespace-nowrap"
          >
            Take MinDrop Home <ArrowRight className="size-5" />
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [prices, setPrices] = useState<Record<string, CurrencyPrice>>({});
  const [currency, setCurrency] = useState<string>("INR");

  useLayoutEffect(() => {
    const resetScroll = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
      setCurrent(0);
    };
    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    const t1 = setTimeout(resetScroll, 0);
    const t2 = setTimeout(resetScroll, 50);
    const t3 = setTimeout(resetScroll, 150);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

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

  const { page, hasBlocks } = useCMSPage("pricing");

  const availableCurrencies = useMemo(() => Object.keys(prices).sort(), [prices]);

  const slides = [
    <SlideOpening key="1" />,
    <SlideTiers key="2" prices={prices} currency={currency} setCurrency={setCurrency} availableCurrencies={availableCurrencies} />,
    <SlideFlow key="3" />,
    <SlideCloser key="4" backHash={backHash} />,
  ];
  const TOTAL = slides.length;

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, clientHeight } = scrollContainerRef.current;
    if (clientHeight > 0) {
      const activeIdx = Math.round(scrollTop / clientHeight);
      if (activeIdx !== current && activeIdx >= 0 && activeIdx < TOTAL) {
        setCurrent(activeIdx);
      }
    }
  };

  const goTo = (idx: number) => {
    if (scrollContainerRef.current && idx >= 0 && idx < TOTAL) {
      const targetY = idx * scrollContainerRef.current.clientHeight;
      scrollContainerRef.current.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden select-none"
      style={{ viewTransitionName: "card-pricing" } as React.CSSProperties}
    >
      {/* 1. Header (Desktop & Mobile: Close + Logo + Get App) */}
      <header className="shrink-0 h-12 border-b-2 border-[#EC4899]/10 z-50 bg-[#FFF2F7]/95 backdrop-blur-md px-4 sm:px-6 flex items-center">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 h-full">
          <Link to="/" hash={backHash} resetScroll={true} viewTransition
            className="flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition text-[#DB2777]/70 hover:text-[#831843]">
            <X className="size-3.5"/> Close
          </Link>

          <Link to="/" hash={backHash} resetScroll={true} viewTransition aria-label="MinDrop — Home" className="flex items-center justify-center shrink-0 h-full leading-none">
            <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" />
          </Link>

          <Link to="/download" resetScroll={true} viewTransition
            className="inline-flex items-center justify-center whitespace-nowrap text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md border border-amber-400/40 hover:from-amber-600 hover:to-amber-700 hover:shadow-lg transition-all duration-200 shrink-0 cursor-pointer">
            Get App
          </Link>
        </div>
      </header>

      {/* 2. Main Content Stage with Native CSS Scroll Snap & 3D Card Stack Overlap */}
      <main 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 w-full overflow-y-auto snap-y snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative"
      >
        {slides.map((slide, idx) => (
          <section key={idx} className="w-full h-full shrink-0 snap-start snap-always flex items-center justify-center relative overflow-hidden perspective-[1200px]">
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
              <div className="w-[450px] h-[450px] rounded-full blur-3xl opacity-20 animate-pulse bg-pink-400" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.90, y: 30, rotateX: 6 }}
              whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              viewport={{ amount: 0.35 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex items-center justify-center relative z-10"
            >
              {slide}
            </motion.div>
          </section>
        ))}

        {/* Right Dot Navigation (Desktop) */}
        <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-40">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-1.5 h-7 bg-[#EC4899]" : "size-1.5 bg-[#BE185D]/25 hover:bg-[#BE185D]/50"
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
        isDark={false}
      />
    </div>
  );
}
