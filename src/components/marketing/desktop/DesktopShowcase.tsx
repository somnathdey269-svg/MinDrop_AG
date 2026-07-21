import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, LayoutGrid, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { 
  DECK_CARDS, 
  LaterAlarmIllustration, 
  SmartFiltersIllustration, 
  PlacesMappingIllustration, 
  PricingTierIllustration, 
  FAQHelpIllustration 
} from "../ShowcaseCardData";

export function DesktopShowcase() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [autoPlay] = useState(false);
  
  // Initialize viewMode synchronously on first paint based on URL hash/query
  const [viewMode, setViewMode] = useState<"deck" | "grid">(()) => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash.includes("grid") || search.includes("grid")) {
        return "grid";
      }
    }
    return "deck";
  });

  useEffect(() => {
    const syncViewMode = () => {
      if (typeof window !== "undefined") {
        const isGrid = window.location.hash.includes("grid") || window.location.search.includes("grid");
        setViewMode(isGrid ? "grid" : "deck");
      }
    };
    syncViewMode();
    window.addEventListener("hashchange", syncViewMode);
    window.addEventListener("popstate", syncViewMode);
    return () => {
      window.removeEventListener("hashchange", syncViewMode);
      window.removeEventListener("popstate", syncViewMode);
    };
  }, []);

  const [hoverZone, setHoverZone] = useState<"center" | "left" | "right">("center");
  const scrollCooldown = useRef(false);

  const handleToggleView = (mode: "deck" | "grid") => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      if (mode === "grid") {
        window.location.hash = "grid";
      } else {
        if (window.location.hash) {
          try {
            window.history.pushState("", document.title, window.location.pathname + window.location.search);
          } catch {
            window.location.hash = "";
          }
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (viewMode !== "deck" || aboutOpen) return;
    const { clientX } = e;
    const width = window.innerWidth;
    const x = (clientX / width) - 0.5;

    if (x < -0.16) {
      setHoverZone("left");
    } else if (x > 0.16) {
      setHoverZone("right");
    } else {
      setHoverZone("center");
    }
  };

  const handleMouseLeave = () => {
    setHoverZone("center");
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== "deck" || aboutOpen) return;
    if (Math.abs(e.deltaY) < 15 && Math.abs(e.deltaX) < 15) return;

    if (scrollCooldown.current) return;
    scrollCooldown.current = true;

    if (e.deltaY > 0 || e.deltaX > 0) {
      setActiveIdx((prev) => (prev + 1) % DECK_CARDS.length);
    } else {
      setActiveIdx((prev) => (prev - 1 + DECK_CARDS.length) % DECK_CARDS.length);
    }

    setTimeout(() => {
      scrollCooldown.current = false;
    }, 850);
  };

  useEffect(() => {
    if (!autoPlay || viewMode !== "deck") return;
    const t = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % DECK_CARDS.length);
    }, 4500);
    return () => clearInterval(t);
  }, [autoPlay, viewMode]);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % DECK_CARDS.length);
  };

  const handleShowMe = () => {
    const card = DECK_CARDS[activeIdx];
    navigate({ to: card.to, search: { from: "deck" }, viewTransition: true });
  };

  const currentCard = DECK_CARDS[activeIdx];
  const nextCard = DECK_CARDS[(activeIdx + 1) % DECK_CARDS.length];
  const CardIcon = currentCard.illustrator;
  const NextIcon = nextCard.illustrator;

  const activeBgColor = viewMode === "deck" ? currentCard.bgColor : "#FFD043";
  const bgColorPrev = DECK_CARDS[(activeIdx - 1 + DECK_CARDS.length) % DECK_CARDS.length].bgColor;
  const bgColorNext = DECK_CARDS[(activeIdx + 1) % DECK_CARDS.length].bgColor;

  let activeX = 0;
  let activeRotate = -2;
  let behindX = 0;
  let behindRotate = 8;
  let behindScale = 0.95;

  let leftBubbleTransform = "translate(0px, -50%) scale(0.85)";
  let rightBubbleTransform = "translate(0px, -50%) scale(0.85)";

  if (hoverZone === "left") {
    activeX = -230;
    activeRotate = -12;
    behindX = 230;
    behindRotate = 2;
    behindScale = 1;

    leftBubbleTransform = "translate(12vw, -50%) scale(1.35)";
    rightBubbleTransform = "translate(-3vw, -50%) scale(0.7)";
  } else if (hoverZone === "right") {
    activeX = 230;
    activeRotate = 12;
    behindX = 0;
    behindRotate = 4;
    behindScale = 0.95;

    leftBubbleTransform = "translate(3vw, -50%) scale(0.7)";
    rightBubbleTransform = "translate(-12vw, -50%) scale(1.35)";
  }

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      style={{
        backgroundColor: activeBgColor,
        transition: "background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
      }}
      className="fixed inset-0 text-ink font-sans flex flex-col justify-between p-6 select-none overflow-hidden h-[100dvh] w-screen"
    >
      {/* Background Circles */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0 hidden md:block"
        style={{
          backgroundColor: viewMode === "deck" ? bgColorPrev : "transparent",
          left: "-30vw",
          width: "65vw",
          height: "65vw",
          transform: leftBubbleTransform,
          transition: "background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)"
        }}
      />
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0 hidden md:block"
        style={{
          backgroundColor: viewMode === "deck" ? bgColorNext : "transparent",
          right: "-30vw",
          width: "65vw",
          height: "65vw",
          transform: rightBubbleTransform,
          transition: "background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)"
        }}
      />

      {/* 1. Desktop Header */}
      <header className="flex justify-between items-center w-full z-30 shrink-0">
        <Link
          to="/terms"
          viewTransition
          style={{ viewTransitionName: 'card-terms' } as React.CSSProperties}
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 hover:border-[#FF671F]"
        >
          Terms
        </Link>
        
        <div className="flex items-center gap-2 select-none">
          <div className="size-8 relative grid place-items-center shrink-0">
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-[#FF671F]/30"
            />
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="size-6 rounded-lg bg-gradient-to-tr from-[#FF671F] to-[#FFA06E] shadow-md grid place-items-center relative border border-white/10"
            >
              <span className="text-white font-black text-xs font-sans">m</span>
            </motion.div>
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-ink">MinDrop</span>
        </div>

        <Link
          to="/privacy"
          viewTransition
          style={{ viewTransitionName: 'card-privacy' } as React.CSSProperties}
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 hover:border-[#FF671F]"
        >
          Privacy
        </Link>
      </header>

      {/* 2. Desktop Content Area */}
      <div 
        className={`flex-1 w-full min-h-0 my-2 no-scrollbar z-10 ${
          viewMode === "deck" 
            ? "flex items-center justify-center relative overflow-hidden" 
            : "block overflow-y-auto no-scrollbar py-2"
        }`}
      >
        {viewMode === "deck" ? (
          /* DECK VIEW MODE */
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            {/* Cycle Deck Trigger */}
            <div className="absolute left-12 z-30 flex">
              <button
                onClick={handleNext}
                className="flex flex-col items-start gap-1 group text-left cursor-pointer"
              >
                <span className="text-[10px] uppercase font-bold tracking-widest text-ink/40">Cycle Deck</span>
                <span className="text-2xl lg:text-3xl font-black text-ink border-b-3 border-ink group-hover:text-[#FF671F] group-hover:border-[#FF671F] transition-colors pb-0.5">
                  Next card
                </span>
              </button>
            </div>

            {/* 3D Stacked Cards Deck */}
            <div className="relative w-[460px] lg:w-[490px] h-[460px] lg:h-[480px] flex items-center justify-center z-10">
              <AnimatePresence mode="popLayout">
                {/* Behind card */}
                <motion.div
                  key={`next-${nextCard.id}`}
                  initial={{ scale: 0.9, rotate: 6, x: 0, opacity: 0.8 }}
                  animate={{
                    scale: behindScale,
                    rotate: behindRotate,
                    x: behindX,
                    opacity: 0.95
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 16 }}
                  className="absolute inset-0 rounded-[2.5rem] border-3 border-ink p-7 flex flex-col justify-between bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] pointer-events-none"
                >
                  <div className="shrink-0">
                    <span className="text-sm uppercase font-bold tracking-wider text-ink/40">Next Card</span>
                    <h3 className="text-2xl lg:text-3xl font-black text-ink mt-4 leading-tight">{nextCard.title}</h3>
                  </div>

                  <div className="flex-1 my-2 flex items-center justify-center min-h-0 w-full opacity-40 pointer-events-none scale-95">
                    {nextCard.id === "later" && <LaterAlarmIllustration />}
                    {nextCard.id === "notify" && <SmartFiltersIllustration />}
                    {nextCard.id === "places" && <PlacesMappingIllustration />}
                    {nextCard.id === "pricing" && <PricingTierIllustration />}
                    {nextCard.id === "faq" && <FAQHelpIllustration />}
                  </div>

                  <div className="flex justify-end pt-1 shrink-0">
                    <span className="inline-grid place-items-center size-12 rounded-2xl bg-canvas border-2 border-ink">
                      {NextIcon && <NextIcon className="size-6 text-ink/40" />}
                    </span>
                  </div>
                </motion.div>

                {/* Active Front Card */}
                <motion.div
                  key={`active-${currentCard.id}`}
                  initial={{ x: 250, rotate: -15, scale: 0.85, opacity: 0 }}
                  animate={{
                    x: activeX,
                    rotate: activeRotate,
                    scale: 1,
                    opacity: 1
                  }}
                  exit={{ x: -400, rotate: -18, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 16 }}
                  onClick={handleShowMe}
                  style={{ viewTransitionName: `card-${currentCard.id}` } as React.CSSProperties}
                  className={`absolute inset-0 rounded-[2.5rem] border-3 border-ink p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:scale-[0.99] transition-transform duration-100 ${currentCard.bgClass}`}
                >
                  <div className="shrink-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm uppercase font-bold tracking-wider text-ink/70 bg-white/60 border border-ink/10 px-3.5 py-1 rounded-full">
                        {currentCard.tag}
                      </span>
                    </div>

                    <h3 className="text-4xl lg:text-5xl font-black text-ink mt-4 leading-tight tracking-tight">
                      {currentCard.title}
                    </h3>

                    <p className="text-lg text-ink/85 font-semibold mt-3 leading-relaxed">
                      {currentCard.description}
                    </p>
                  </div>

                  <div className="flex-1 my-2 flex items-center justify-center min-h-0 w-full overflow-visible">
                    <div className="scale-100 transform-gpu origin-center flex items-center justify-center">
                      {currentCard.id === "later" && <LaterAlarmIllustration />}
                      {currentCard.id === "notify" && <SmartFiltersIllustration />}
                      {currentCard.id === "places" && <PlacesMappingIllustration />}
                      {currentCard.id === "pricing" && <PricingTierIllustration />}
                      {currentCard.id === "faq" && <FAQHelpIllustration />}
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-4 shrink-0">
                    <span className="text-sm uppercase font-black text-ink/40 tracking-wider">MinDrop Brain</span>
                    <span className="inline-grid place-items-center size-14 rounded-2xl bg-white border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      {CardIcon && <CardIcon className="size-7 text-ink" />}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Read Specs Trigger */}
            <div className="absolute right-12 z-30 flex">
              <button
                onClick={handleShowMe}
                className="flex flex-col items-end gap-1 group text-right cursor-pointer"
              >
                <span className="text-[10px] uppercase font-bold tracking-widest text-ink/40">Read specs</span>
                <span className="text-2xl lg:text-3xl font-black text-ink border-b-3 border-ink group-hover:text-[#FF671F] group-hover:border-[#FF671F] transition-colors pb-0.5">
                  Show me!
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* GRID VIEW MODE */
          <div className="w-full max-w-6xl mx-auto px-4 py-2 no-scrollbar z-20">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-6 pb-16">
              {DECK_CARDS.map((card) => {
                const Icon = card.illustrator;
                return (
                  <Link
                    key={card.id}
                    to={card.to}
                    search={{ from: "grid" }}
                    viewTransition
                    style={{ viewTransitionName: `card-${card.id}` } as React.CSSProperties}
                    className={`rounded-[2rem] border-3 border-ink p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer min-h-[340px] ${card.bgClass}`}
                  >
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-wider text-ink bg-white/90 border border-ink/20 px-3 py-1 rounded-full shadow-sm">
                        {card.tag}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black text-ink mt-3 leading-tight tracking-tight">{card.title}</h3>
                      <p className="text-base text-ink/85 font-semibold mt-2 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <div className="flex-1 my-3 flex items-center justify-center overflow-hidden w-full max-h-[120px] scale-[0.9] pointer-events-none">
                      {card.id === "later" && <LaterAlarmIllustration />}
                      {card.id === "notify" && <SmartFiltersIllustration />}
                      {card.id === "places" && <PlacesMappingIllustration />}
                      {card.id === "pricing" && <PricingTierIllustration />}
                      {card.id === "faq" && <FAQHelpIllustration />}
                    </div>
                    
                    <div className="flex justify-between items-end pt-2 shrink-0 border-t border-ink/10">
                      <span className="text-xs font-black uppercase text-ink/50 tracking-wider">Open card</span>
                      <span className="inline-grid place-items-center size-10 rounded-xl bg-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {Icon && <Icon className="size-5 text-ink" />}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>

      {/* 3. Desktop Footer (Frozen Pinned) */}
      <footer className="grid grid-cols-3 w-full items-center z-30 shrink-0">
        <div className="justify-self-start">
          <button
            onClick={() => setAboutOpen(true)}
            className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 cursor-pointer hover:border-[#FF671F]"
          >
            About
          </button>
        </div>

        <div className="justify-self-center flex items-center bg-ink border-2 border-ink rounded-full p-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] gap-1">
          <button
            onClick={() => handleToggleView("deck")}
            className={`p-2 rounded-full transition cursor-pointer ${
              viewMode === "deck" ? "bg-white text-ink" : "bg-ink text-canvas hover:text-[#FF671F]"
            }`}
            aria-label="Deck View"
          >
            <Layers className="size-4" />
          </button>
          <button
            onClick={() => handleToggleView("grid")}
            className={`p-2 rounded-full transition cursor-pointer ${
              viewMode === "grid" ? "bg-white text-ink" : "bg-ink text-canvas hover:text-[#FF671F]"
            }`}
            aria-label="Grid View"
          >
            <LayoutGrid className="size-4" />
          </button>
        </div>

        <div className="justify-self-end">
          <Link
            to="/download"
            className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 hover:border-[#FF671F]"
          >
            Get App
          </Link>
        </div>
      </footer>

      {/* About Modal */}
      <AnimatePresence>
        {aboutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setAboutOpen(false)}
              className="fixed inset-0 bg-ink z-40"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white border-3 border-ink p-8 rounded-[2.5rem] w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
              >
                <button
                  onClick={() => setAboutOpen(false)}
                  className="absolute top-6 right-6 cursor-pointer size-8 rounded-full border-2 border-ink bg-white grid place-items-center hover:bg-ink/5 transition"
                >
                  <X className="size-4" />
                </button>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-[#FFFBEB] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] mb-4">
                  💡 Project Info
                </span>
                <h3 className="text-3xl font-black text-ink leading-tight">About MinDrop</h3>
                <p className="text-xs text-ink/75 font-semibold mt-4 leading-relaxed">
                  MinDrop is an offline second brain for immediate micro-actions—looping alarms for small tasks, location sweeps, and notification filters.
                </p>
                <p className="text-xs text-ink/65 font-medium mt-3 leading-relaxed">
                  Built fully statically on Cloudflare Pages using React, Tailwind V4, and TanStack Start, mimicking the exact deck/grid animations of Google's Web Showcase.
                </p>
                <div className="mt-8 pt-4 border-t-2 border-ink/8 flex gap-3">
                  <button
                    onClick={() => setAboutOpen(false)}
                    className="flex-1 text-center py-3 rounded-xl bg-ink text-canvas hover:opacity-90 font-bold transition text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Got it
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
