import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, LayoutGrid } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MinDropHeaderLogo } from "../MinDropHeaderLogo";
import { 
  DECK_CARDS, 
  AboutAppIllustration,
  LaterAlarmIllustration, 
  SmartFiltersIllustration, 
  PlacesMappingIllustration, 
  FutureActionsIllustration,
  PrivacyManifestoIllustration,
  PricingTierIllustration, 
  ClosureVisionIllustration
} from "../ShowcaseCardData";

export function DesktopShowcase() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
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
    activeX = -200;
    activeRotate = -10;
    behindX = 200;
    behindRotate = 2;
    behindScale = 1;

    leftBubbleTransform = "translate(12vw, -50%) scale(1.35)";
    rightBubbleTransform = "translate(-3vw, -50%) scale(0.7)";
  } else if (hoverZone === "right") {
    activeX = 200;
    activeRotate = 10;
    behindX = 0;
    behindRotate = 4;
    behindScale = 0.95;

    leftBubbleTransform = "translate(3vw, -50%) scale(0.7)";
    rightBubbleTransform = "translate(-12vw, -50%) scale(1.35)";
  }

  const renderIllustration = (id: string) => {
    switch (id) {
      case "about": return <AboutAppIllustration />;
      case "notify": return <SmartFiltersIllustration />;
      case "places": return <PlacesMappingIllustration />;
      case "later": return <LaterAlarmIllustration />;
      case "future": return <FutureActionsIllustration />;
      case "privacy-manifesto": return <PrivacyManifestoIllustration />;
      case "pricing": return <PricingTierIllustration />;
      case "vision": return <ClosureVisionIllustration />;
      default: return null;
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      style={{
        backgroundColor: activeBgColor,
        transition: "background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
      }}
      className="fixed inset-0 text-ink font-sans flex flex-col justify-between p-3 sm:p-4 lg:p-6 select-none overflow-hidden h-[100dvh] w-screen"
    >
      {/* Dynamic Background Circles */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0 hidden md:block"
        style={{
          backgroundColor: viewMode === "deck" ? bgColorPrev : "transparent",
          left: "-28vw",
          width: "clamp(350px, 55vw, 850px)",
          height: "clamp(350px, 55vw, 850px)",
          transform: leftBubbleTransform,
          transition: "background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)"
        }}
      />
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0 hidden md:block"
        style={{
          backgroundColor: viewMode === "deck" ? bgColorNext : "transparent",
          right: "-28vw",
          width: "clamp(350px, 55vw, 850px)",
          height: "clamp(350px, 55vw, 850px)",
          transform: rightBubbleTransform,
          transition: "background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)"
        }}
      />

      {/* 1. Desktop Header */}
      <header className="flex justify-between items-center w-full z-30 shrink-0 h-9 px-2">
        <Link
          to="/terms"
          viewTransition
          style={{ viewTransitionName: 'card-terms' } as React.CSSProperties}
          className="text-xs lg:text-sm font-black uppercase tracking-wider text-ink hover:text-[#FF671F] transition-colors cursor-pointer"
        >
          Terms
        </Link>
        
        {/* Animated MinDrop Header Wordmark */}
        <MinDropHeaderLogo className="text-xl sm:text-2xl" />

        <Link
          to="/privacy"
          viewTransition
          style={{ viewTransitionName: 'card-privacy' } as React.CSSProperties}
          className="text-xs lg:text-sm font-black uppercase tracking-wider text-ink hover:text-[#FF671F] transition-colors cursor-pointer"
        >
          Privacy
        </Link>
      </header>

      {/* 2. Main Desktop Stage */}
      <div ref={containerRef} className="flex-1 w-full min-h-0 my-1 z-10 flex flex-col justify-center items-center overflow-hidden">
        {viewMode === "deck" ? (
          /* DECK STACK MODE (NORMAL VIEW) */
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Left Hover Zone */}
            <div 
              onClick={handleNext} 
              className="absolute left-4 lg:left-12 z-30 flex cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-[11px] lg:text-xs uppercase font-extrabold tracking-wider text-ink/40 mb-0.5 group-hover:text-ink transition">
                  Cycle Deck
                </span>
                <span className="text-xl lg:text-3xl font-black text-ink group-hover:text-[#FF671F] transition">
                  Next card
                </span>
              </div>
            </div>

            {/* Web Card Container (Prominent Hero Proportions) */}
            <div className="relative w-[clamp(420px,38vw,600px)] h-[clamp(520px,75vh,740px)] flex items-center justify-center">
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
                  className="absolute inset-0 rounded-[2.5rem] border-3 lg:border-4 border-ink p-7 lg:p-8 flex flex-col justify-between bg-white shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] pointer-events-none"
                >
                  <div className="shrink-0 h-8 flex items-center">
                    <span className="text-xs lg:text-sm uppercase font-black tracking-wider text-ink/40">{nextCard.tag}</span>
                  </div>

                  <div className="flex-1 min-h-0 flex items-center justify-center py-3 overflow-hidden w-full opacity-40 pointer-events-none">
                    <div className="transform-gpu origin-center flex items-center justify-center">
                      {renderIllustration(nextCard.id)}
                    </div>
                  </div>

                  <div className="shrink-0 mt-3">
                    <h3 className="text-3xl lg:text-4xl font-black text-ink leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
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
                  className={`absolute inset-0 rounded-[2.5rem] border-3 lg:border-4 border-ink p-7 lg:p-8 flex flex-col justify-between shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:scale-[0.99] transition-transform duration-100 ${currentCard.bgClass}`}
                >
                  {/* Section 1: Header Tag Pill */}
                  <div className="shrink-0 flex justify-between items-center h-8">
                    <span className="text-xs lg:text-sm font-black uppercase tracking-wider text-ink bg-white/95 border-2 border-ink/20 px-4 py-1.5 rounded-full shadow-sm">
                      {currentCard.tag}
                    </span>
                  </div>

                  {/* Section 2: Centered Hero Graphic Area */}
                  <div className="flex-1 min-h-0 flex items-center justify-center py-3 overflow-hidden w-full relative">
                    <div className="transform-gpu origin-center flex items-center justify-center">
                      {renderIllustration(currentCard.id)}
                    </div>
                  </div>

                  {/* Section 3: Title & Description */}
                  <div className="shrink-0 mt-3">
                    <h3 className="text-3xl lg:text-4xl xl:text-5xl font-black text-ink leading-tight tracking-tight mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                      {currentCard.title}
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-ink font-medium leading-relaxed">
                      {currentCard.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Read Specs Trigger */}
            <div className="absolute right-4 lg:right-12 z-30 flex">
              <button
                onClick={handleShowMe}
                className="flex flex-col items-center text-center cursor-pointer group bg-transparent border-0"
              >
                <span className="text-[11px] lg:text-xs uppercase font-extrabold tracking-wider text-ink/40 mb-0.5 group-hover:text-ink transition">
                  Read Specs
                </span>
                <span className="text-xl lg:text-3xl font-black text-ink group-hover:text-[#FF671F] transition">
                  Show me!
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* RESPONSIVE GRID VIEW MODE (Fluid auto-fit cards) */
          <div className="w-full max-w-7xl mx-auto px-3 py-2 z-20 h-full overflow-y-auto no-scrollbar">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 xl:gap-6 items-stretch pb-24"
            >
              {DECK_CARDS.map((card) => {
                return (
                  <Link
                    key={card.id}
                    to={card.to}
                    search={{ from: "grid" }}
                    viewTransition
                    style={{ viewTransitionName: `card-${card.id}` } as React.CSSProperties}
                    className={`rounded-[1.8rem] border-3 border-ink p-4 lg:p-5 xl:p-6 flex flex-col justify-between shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer h-[clamp(340px,38vh,480px)] ${card.bgClass}`}
                  >
                    {/* Top Chapter Tag Pill */}
                    <div className="shrink-0 flex items-center justify-between h-7 mb-1">
                      <span className="text-[11px] uppercase font-black tracking-wider text-ink bg-white/90 border border-ink/20 px-3 py-0.5 rounded-full shadow-sm">
                        {card.tag}
                      </span>
                    </div>

                    {/* Fluid Graphic Area */}
                    <div className="flex-1 min-h-0 flex items-center justify-center py-2 overflow-hidden w-full pointer-events-none">
                      <div className="scale-100 lg:scale-110 transform-gpu origin-center flex items-center justify-center">
                        {renderIllustration(card.id)}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="shrink-0 mt-1">
                      <h3 className="text-xl lg:text-2xl xl:text-3xl font-black text-ink leading-tight tracking-tight mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
                        {card.title}
                      </h3>
                      <p className="text-sm lg:text-base xl:text-lg text-ink/80 font-normal leading-relaxed line-clamp-2">
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
      <footer className="grid grid-cols-3 w-full items-center z-30 shrink-0 h-10">
        <div className="justify-self-start">
          <Link
            to="/about"
            viewTransition
            style={{ viewTransitionName: 'card-[#about]' } as React.CSSProperties}
            className="text-xs lg:text-sm uppercase tracking-wider font-black text-ink hover:text-[#FF671F] transition-colors cursor-pointer"
          >
            About
          </Link>
        </div>

        <div className="justify-self-center flex items-center bg-ink border-2 border-ink rounded-full p-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] gap-1">
          <button
            onClick={() => handleToggleView("deck")}
            className={`p-1.5 sm:p-2 rounded-full transition cursor-pointer ${
              viewMode === "deck" ? "bg-white text-ink" : "bg-ink text-canvas hover:text-[#FF671F]"
            }`}
            aria-label="Deck View"
          >
            <Layers className="size-4" />
          </button>
          <button
            onClick={() => handleToggleView("grid")}
            className={`p-1.5 sm:p-2 rounded-full transition cursor-pointer ${
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
            className="text-xs lg:text-sm uppercase tracking-wider font-black text-ink hover:text-[#FF671F] transition-colors"
          >
            Get App
          </Link>
        </div>
      </footer>
    </div>
  );
}
