import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, LayoutGrid } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MinDropHeaderLogo } from "../MinDropHeaderLogo";
import { 
  DECK_CARDS, 
  ShowcaseCardLayoutPrimitive,
  CARD_TOKENS,
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
      default: return <AboutAppIllustration />;
    }
  };

  const currentCard = DECK_CARDS[activeIdx];
  const nextCard = DECK_CARDS[(activeIdx + 1) % DECK_CARDS.length];

  let activeX = 0;
  let activeRotate = 0;
  if (hoverZone === "left") {
    activeX = -20;
    activeRotate = -2;
  } else if (hoverZone === "right") {
    activeX = 20;
    activeRotate = 2;
  }

  let behindX = 40;
  let behindRotate = 6;
  let behindScale = 0.94;
  if (hoverZone === "left") {
    behindX = 60;
    behindRotate = 9;
    behindScale = 0.92;
  } else if (hoverZone === "right") {
    behindX = 15;
    behindRotate = 2;
    behindScale = 0.96;
  }

  const handleShowMe = () => {
    navigate({ to: currentCard.to, search: { from: "deck" } });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      className="relative w-full h-screen overflow-hidden bg-[#FFC935] flex flex-col justify-between select-none font-sans"
    >
      {/* 1. TOP NAV BAR */}
      <header className="w-full px-8 py-5 flex items-center justify-between z-30 shrink-0">
        <Link 
          to="/terms"
          className="text-xs uppercase font-black tracking-widest text-ink hover:opacity-75 transition-opacity"
        >
          TERMS
        </Link>
        
        <MinDropHeaderLogo />

        <Link 
          to="/privacy"
          className="text-xs uppercase font-black tracking-widest text-ink hover:opacity-75 transition-opacity"
        >
          PRIVACY
        </Link>
      </header>

      {/* 2. MAIN SHOWCASE AREA */}
      <main className="relative flex-1 w-full flex items-center justify-center overflow-hidden px-4">
        {viewMode === "deck" ? (
          /* HERO STACKED DECK VIEW MODE */
          <div className="relative w-full h-full flex flex-col items-center justify-center py-2">
            
            {/* Click Zones (Left = Prev, Right = Next) */}
            <div 
              onClick={handlePrev}
              className="absolute left-0 top-0 w-1/3 h-full z-20 cursor-w-resize"
              title="Previous card"
            />
            <div 
              onClick={handleNext}
              className="absolute right-0 top-0 w-1/3 h-full z-20 cursor-e-resize"
              title="Next card"
            />

            {/* Web Card Container (Prominent Hero Proportions) */}
            <div className="relative w-[clamp(380px,32vw,470px)] min-h-[clamp(420px,65vh,570px)] flex items-center justify-center">
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
                  className="absolute inset-0 w-full h-full"
                >
                  <ShowcaseCardLayoutPrimitive
                    mode="deck"
                    bgClass={nextCard.bgClass}
                    className="opacity-40 pointer-events-none"
                    headerSlot={<span className="text-xs lg:text-sm font-black uppercase tracking-wider text-ink/40">{nextCard.tag}</span>}
                    illustrationSlot={renderIllustration(nextCard.id)}
                    titleSlot={<h3 className="font-black text-ink leading-tight">{nextCard.title}</h3>}
                  />
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
                  className="absolute inset-0 w-full h-full"
                  style={{ 
                    viewTransitionName: `card-${currentCard.id}`,
                  } as React.CSSProperties}
                >
                  <ShowcaseCardLayoutPrimitive
                    mode="deck"
                    bgClass={currentCard.bgClass}
                    onClick={handleShowMe}
                    className="cursor-pointer active:scale-[0.99] transition-transform duration-100"
                    headerSlot={
                      <span className="text-xs lg:text-sm font-black uppercase tracking-wider text-ink bg-white/95 border-2 border-ink/20 px-4 py-1.5 rounded-full shadow-sm">
                        {currentCard.tag}
                      </span>
                    }
                    illustrationSlot={renderIllustration(currentCard.id)}
                    titleSlot={
                      <h3 className={CARD_TOKENS.typography.deck.title}>
                        {currentCard.title}
                      </h3>
                    }
                    descriptionSlot={
                      <p className={CARD_TOKENS.typography.deck.description}>
                        {currentCard.description}
                      </p>
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Read Specs Trigger */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 z-20 text-center cursor-pointer"
              onClick={handleShowMe}
            >
              <span className="text-xs font-black uppercase tracking-widest text-ink/70 hover:text-ink transition-colors underline decoration-2 underline-offset-4">
                Click Card to Explore Feature
              </span>
            </motion.div>

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
                    style={{ 
                      viewTransitionName: `card-${card.id}`,
                    } as React.CSSProperties}
                    className="aspect-[3/3.6] min-h-[300px] block"
                  >
                    <ShowcaseCardLayoutPrimitive
                      mode="grid"
                      bgClass={card.bgClass}
                      className="hover:-translate-y-1 transition-all cursor-pointer"
                      headerSlot={
                        <span className="text-[11px] uppercase font-black tracking-wider text-ink bg-white/90 border border-ink/20 px-3 py-0.5 rounded-full shadow-sm">
                          {card.tag}
                        </span>
                      }
                      illustrationSlot={renderIllustration(card.id)}
                      titleSlot={
                        <h3 className={CARD_TOKENS.typography.grid.title}>
                          {card.title}
                        </h3>
                      }
                      descriptionSlot={
                        <p className={CARD_TOKENS.typography.grid.description}>
                          {card.description}
                        </p>
                      }
                    />
                  </Link>
                );
              })}
            </motion.div>
          </div>
        )}
      </main>

      {/* 3. BOTTOM FLOATING CONTROLS */}
      <footer className="w-full py-4 flex items-center justify-between px-8 z-30 shrink-0">
        <Link 
          to="/about"
          className="text-xs uppercase font-black tracking-widest text-ink hover:opacity-75 transition-opacity"
        >
          ABOUT
        </Link>

        {/* View Toggle Controls */}
        <div className="bg-ink p-1.5 rounded-full flex items-center gap-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <button
            onClick={() => handleToggleView("deck")}
            className={`p-2 rounded-full transition-all ${
              viewMode === "deck" 
                ? "bg-white text-ink shadow-sm" 
                : "text-white/60 hover:text-white"
            }`}
            title="Deck View"
            aria-label="Switch to Deck View"
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
