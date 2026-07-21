import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, LayoutGrid, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MinDropHeaderLogo } from "../MinDropHeaderLogo";
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
  const [hoverZone, setHoverZone] = useState<"left" | "right" | "none">("none");
  const wheelLock = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync View Mode with Hash/URL State
  const [viewMode, setViewMode] = useState<"deck" | "grid">(
    () => typeof window !== "undefined" && (window.location.hash.includes("grid") || window.location.search.includes("grid")) ? "grid" : "deck"
  );

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

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % DECK_CARDS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + DECK_CARDS.length) % DECK_CARDS.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== "deck") return;
    const { clientX } = e;
    const { innerWidth } = window;
    const third = innerWidth / 3;

    if (clientX < third) {
      setHoverZone("left");
    } else if (clientX > third * 2) {
      setHoverZone("right");
    } else {
      setHoverZone("none");
    }
  };

  const handleMouseLeave = () => {
    setHoverZone("none");
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== "deck") return;
    if (wheelLock.current) return;

    if (Math.abs(e.deltaY) > 20 || Math.abs(e.deltaX) > 20) {
      wheelLock.current = true;
      if (e.deltaY > 0 || e.deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setTimeout(() => {
        wheelLock.current = false;
      }, 400);
    }
  };

  const handleShowMe = () => {
    const card = DECK_CARDS[activeIdx];
    navigate({ to: card.to, search: { from: "deck" }, viewTransition: true });
  };

  const currentCard = DECK_CARDS[activeIdx];
  const nextCard = DECK_CARDS[(activeIdx + 1) % DECK_CARDS.length];

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
      className="fixed inset-0 text-ink font-sans flex flex-col justify-between p-5 lg:p-6 select-none overflow-hidden h-[100dvh] w-screen"
    >
      {/* Dynamic Background Circles */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0 hidden md:block"
        style={{
          backgroundColor: viewMode === "deck" ? bgColorPrev : "transparent",
          left: "-28vw",
          width: "clamp(400px, 60vw, 900px)",
          height: "clamp(400px, 60vw, 900px)",
          transform: leftBubbleTransform,
          transition: "background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)"
        }}
      />
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0 hidden md:block"
        style={{
          backgroundColor: viewMode === "deck" ? bgColorNext : "transparent",
          right: "-28vw",
          width: "clamp(400px, 60vw, 900px)",
          height: "clamp(400px, 60vw, 900px)",
          transform: rightBubbleTransform,
          transition: "background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)"
        }}
      />

      {/* 1. Desktop Header */}
      <header className="flex justify-between items-center w-full z-30 shrink-0 h-10 px-2">
        <Link
          to="/terms"
          viewTransition
          style={{ viewTransitionName: 'card-terms' } as React.CSSProperties}
          className="text-xs lg:text-sm font-black uppercase tracking-wider text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 hover:border-[#FF671F]"
        >
          Terms
        </Link>
        
        {/* Animated MinDrop Header Wordmark */}
        <MinDropHeaderLogo className="text-xl sm:text-2xl" />

        <Link
          to="/privacy"
          viewTransition
          style={{ viewTransitionName: 'card-privacy' } as React.CSSProperties}
          className="text-xs lg:text-sm font-black uppercase tracking-wider text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 hover:border-[#FF671F]"
        >
          Privacy
        </Link>
      </header>

      {/* 2. Main Desktop Stage */}
      <div ref={containerRef} className="flex-1 w-full min-h-0 my-1 no-scrollbar z-10 flex flex-col justify-center items-center overflow-y-auto">
        {viewMode === "deck" ? (
          /* DECK STACK MODE (NORMAL VIEW) */
          <div className="w-full h-full max-h-[min(720px,84vh)] flex items-center justify-center relative">
            {/* Left Hover Zone */}
            <div 
              onClick={handleNext} 
              className="absolute left-6 lg:left-12 z-30 flex cursor-pointer group"
            >
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase font-extrabold tracking-wider text-ink/40 mb-1 group-hover:text-ink transition">
                  Cycle Deck
                </span>
                <span className="text-2xl lg:text-3xl font-black text-ink underline decoration-3 underline-offset-4 group-hover:text-[#FF671F] transition">
                  Next card
                </span>
              </div>
            </div>

            {/* Web Card Container (Senior Legibility & Balanced Proportions) */}
            <div className="relative w-[clamp(380px,30vw,500px)] h-[clamp(500px,65vh,680px)] flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {/* Behind Stacked Preview Card */}
                <motion.div
                  key={`next-${nextCard.id}`}
                  animate={{
                    x: behindX,
                    rotate: behindRotate,
                    scale: behindScale,
                    opacity: 0.95
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 16 }}
                  className="absolute inset-0 rounded-[2.5rem] border-3 border-ink p-[clamp(1.5rem,2.5vw,2.75rem)] flex flex-col justify-between bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] pointer-events-none"
                >
                  <div className="shrink-0 mb-1">
                    <span className="text-xs lg:text-sm uppercase font-black tracking-wider text-ink/40">{nextCard.tag}</span>
                  </div>

                  <div className="my-auto py-2 flex items-center justify-center overflow-visible w-full opacity-40 pointer-events-none">
                    <div className="scale-[clamp(1.0,1.15vh+0.3vw,1.3)] transform-gpu origin-center">
                      {nextCard.id === "later" && <LaterAlarmIllustration />}
                      {nextCard.id === "notify" && <SmartFiltersIllustration />}
                      {nextCard.id === "places" && <PlacesMappingIllustration />}
                      {nextCard.id === "pricing" && <PricingTierIllustration />}
                      {nextCard.id === "faq" && <FAQHelpIllustration />}
                    </div>
                  </div>

                  <div className="shrink-0 mt-1">
                    <h3 className="text-2xl lg:text-3xl font-black text-ink leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      {nextCard.title}
                    </h3>
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
                  className={`absolute inset-0 rounded-[2.5rem] border-3 border-ink p-[clamp(1.5rem,2.5vw,2.75rem)] flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:scale-[0.99] transition-transform duration-100 ${currentCard.bgClass}`}
                >
                  {/* Section 1: Header Tag Pill */}
                  <div className="shrink-0 flex justify-between items-center mb-2">
                    <span className="text-xs lg:text-sm uppercase font-black tracking-wider text-ink bg-white/90 border border-ink/20 px-4 py-1.5 rounded-full shadow-sm">
                      {currentCard.tag}
                    </span>
                  </div>

                  {/* Section 2: Prominent Hero Graphic */}
                  <div className="my-auto pt-3 pb-1 flex items-center justify-center overflow-visible w-full relative shrink-0">
                    <div className="scale-[clamp(1.05,1.2vh+0.3vw,1.35)] transform-gpu origin-center flex items-center justify-center">
                      {currentCard.id === "later" && <LaterAlarmIllustration />}
                      {currentCard.id === "notify" && <SmartFiltersIllustration />}
                      {currentCard.id === "places" && <PlacesMappingIllustration />}
                      {currentCard.id === "pricing" && <PricingTierIllustration />}
                      {currentCard.id === "faq" && <FAQHelpIllustration />}
                    </div>
                  </div>

                  {/* Section 3: High-Legibility Senior-Accessible Content */}
                  <div className="shrink-0 mt-3">
                    <h3 className="text-2xl lg:text-3xl xl:text-4xl font-black text-ink leading-tight tracking-tight mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                      {currentCard.title}
                    </h3>
                    <p className="text-base lg:text-lg text-ink/90 font-medium leading-relaxed">
                      {currentCard.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Read Specs Trigger */}
            <div className="absolute right-6 lg:right-12 z-30 flex">
              <button
                onClick={handleShowMe}
                className="flex flex-col items-center cursor-pointer group bg-transparent border-0"
              >
                <span className="text-xs uppercase font-extrabold tracking-wider text-ink/40 mb-1 group-hover:text-ink transition">
                  Read Specs
                </span>
                <span className="text-2xl lg:text-3xl font-black text-ink underline decoration-3 underline-offset-4 group-hover:text-[#FF671F] transition">
                  Show me!
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* RESPONSIVE GRID VIEW MODE */
          <div className="w-full max-w-6xl mx-auto px-4 pt-10 pb-24 z-20 h-full overflow-y-auto no-scrollbar">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {DECK_CARDS.map((card) => {
                return (
                  <Link
                    key={card.id}
                    to={card.to}
                    search={{ from: "grid" }}
                    viewTransition
                    style={{ viewTransitionName: `card-${card.id}` } as React.CSSProperties}
                    className={`rounded-[2rem] border-3 border-ink p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer h-[350px] ${card.bgClass}`}
                  >
                    {/* Top Chapter Tag Pill */}
                    <div className="flex justify-between items-center mb-2 shrink-0">
                      <span className="text-xs uppercase font-black tracking-wider text-ink bg-white/90 border border-ink/20 px-3 py-1 rounded-full shadow-sm">
                        {card.tag}
                      </span>
                    </div>

                    {/* Centered Graphic Illustration Section */}
                    <div className="my-auto pt-2 pb-1 flex items-center justify-center overflow-visible w-full pointer-events-none scale-110 transform-gpu origin-center">
                      {card.id === "later" && <LaterAlarmIllustration />}
                      {card.id === "notify" && <SmartFiltersIllustration />}
                      {card.id === "places" && <PlacesMappingIllustration />}
                      {card.id === "pricing" && <PricingTierIllustration />}
                      {card.id === "faq" && <FAQHelpIllustration />}
                    </div>

                    {/* Content Section */}
                    <div className="shrink-0 mt-2">
                      <h3 className="text-xl lg:text-2xl font-black text-ink leading-tight tracking-tight mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
                        {card.title}
                      </h3>
                      <p className="text-sm lg:text-base text-ink/90 font-medium leading-relaxed line-clamp-3">
                        {card.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>

      {/* 3. Desktop Footer */}
      <footer className="grid grid-cols-3 w-full items-center z-30 shrink-0">
        <div className="justify-self-start">
          <button
            onClick={() => setAboutOpen(true)}
            className="text-xs lg:text-sm uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 cursor-pointer hover:border-[#FF671F]"
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
            className="text-xs lg:text-sm uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 hover:border-[#FF671F]"
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
                <p className="text-sm text-ink/85 font-semibold mt-4 leading-relaxed">
                  MinDrop is an offline second brain for immediate micro-actions—looping alarms for small tasks, location sweeps, and notification filters.
                </p>
                <p className="text-xs text-ink/75 font-medium mt-3 leading-relaxed">
                  Engineered with zero cloud dependencies and built with local SQLite persistence for instant privacy.
                </p>
                <div className="mt-6 pt-4 border-t-2 border-ink/10 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-wider text-ink/40">Version 1.0.0</span>
                  <button
                    onClick={() => setAboutOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#000000] text-white font-black text-xs uppercase tracking-wider hover:bg-ink/90 transition cursor-pointer"
                  >
                    Close
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
