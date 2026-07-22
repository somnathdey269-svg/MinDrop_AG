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

export function MobileShowcase() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"next" | "prev">("next");
  const touchStartX = useRef(0);
  
  // Sync View Mode with Hash/URL State
  const [viewMode, setViewMode] = useState<"deck" | "grid">(
    () => typeof window !== "undefined" && window.location.hash.includes("grid") ? "grid" : "deck"
  );

  useEffect(() => {
    const syncViewMode = () => {
      if (typeof window !== "undefined") {
        setViewMode(window.location.hash.includes("grid") ? "grid" : "deck");
      }
    };
    syncViewMode();
    window.addEventListener("hashchange", syncViewMode);
    return () => window.removeEventListener("hashchange", syncViewMode);
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
    setSwipeDirection("next");
    setActiveIdx((prev) => (prev + 1) % DECK_CARDS.length);
  };

  const handlePrev = () => {
    setSwipeDirection("prev");
    setActiveIdx((prev) => (prev - 1 + DECK_CARDS.length) % DECK_CARDS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (viewMode !== "deck") return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const handleShowMe = () => {
    const card = DECK_CARDS[activeIdx];
    navigate({ to: card.to, search: { from: "deck" }, viewTransition: true });
  };

  const currentCard = DECK_CARDS[activeIdx];

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
      style={{
        backgroundColor: viewMode === "deck" ? currentCard.bgColor : "#FFD043",
        transition: "background-color 0.5s ease"
      }}
      className="fixed inset-0 text-ink font-sans flex flex-col justify-between p-3 sm:p-4 select-none overflow-hidden h-[100dvh] w-screen"
    >
      {/* 1. Mobile Header */}
      <header className="flex justify-between items-center w-full z-30 shrink-0 h-10 px-2">
        <div className="flex items-center h-full">
          <Link
            to="/terms"
            viewTransition
            style={{ viewTransitionName: 'card-terms' } as React.CSSProperties}
            className="text-xs sm:text-sm font-black uppercase tracking-wider text-ink/80 hover:text-ink transition-all flex items-center leading-none"
          >
            Terms
          </Link>
        </div>
        
        {/* Animated MinDrop Header Logo */}
        <div className="flex items-center h-full">
          <MinDropHeaderLogo className="text-xl sm:text-2xl" />
        </div>

        <div className="flex items-center h-full">
          <Link
            to="/privacy"
            viewTransition
            style={{ viewTransitionName: 'card-privacy' } as React.CSSProperties}
            className="text-xs sm:text-sm font-black uppercase tracking-wider text-ink/80 hover:text-ink transition-all flex items-center leading-none"
          >
            Privacy
          </Link>
        </div>
      </header>

      {/* 2. Mobile Main Stage */}
      <div className="flex-1 w-full min-h-0 my-1 z-10 flex flex-col justify-center items-center overflow-hidden">
        {viewMode === "deck" ? (
          /* DECK VIEW MODE (Fluid Mobile Viewport Math) */
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full h-full flex flex-col items-center justify-center relative"
          >
            {/* Mobile Card Container (Prominent Hero Proportions) */}
            <div className="relative w-[clamp(275px,80vw,340px)] min-h-[clamp(300px,50vh,400px)] flex items-center justify-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={currentCard.id}
                  initial={{ 
                    x: swipeDirection === "next" ? 280 : -280, 
                    rotate: swipeDirection === "next" ? 12 : -12,
                    scale: 0.9,
                    opacity: 0 
                  }}
                  animate={{ x: 0, rotate: -2, scale: 1, opacity: 1 }}
                  exit={{ 
                    x: swipeDirection === "next" ? -280 : 280, 
                    rotate: swipeDirection === "next" ? -12 : 12,
                    scale: 0.9,
                    opacity: 0 
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  onClick={handleShowMe}
                  style={{ viewTransitionName: `card-${currentCard.id}` } as React.CSSProperties}
                  className={`absolute inset-0 rounded-[2.2rem] border-3 border-ink flex flex-col shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98] transition-transform ${currentCard.bgClass}`}
                  style={{ padding: '5%', containerType: 'inline-size' } as React.CSSProperties}
                >
                  {/* TOP: Tag Pill */}
                  <div className="shrink-0 mb-[5%]">
                    <span className="text-xs font-black uppercase tracking-wider text-ink bg-white/95 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm">
                      {currentCard.tag}
                    </span>
                  </div>

                  {/* BOTTOM: Icon (22% width, square) + Content — all width-proportional */}
                  <div className="flex-1 flex flex-col justify-end">
                    {/* Icon scales with card width: 22% × card-width = auto square */}
                    <div className="w-[22%] aspect-square mb-[4%]">
                      {renderIllustration(currentCard.id)}
                    </div>
                    <h3
                      className="font-black text-ink leading-tight tracking-tight mb-[2.5%]"
                      style={{ fontSize: 'clamp(1rem, 7cqw, 2.2rem)' }}
                    >
                      {currentCard.title}
                    </h3>
                    <p
                      className="text-ink/75 font-normal leading-snug"
                      style={{ fontSize: 'clamp(0.78rem, 4cqw, 1.05rem)' }}
                    >
                      {currentCard.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* GRID VIEW MODE */
          <div className="w-full h-full overflow-y-auto px-1 pt-1 pb-24 z-20 no-scrollbar">
            <div className="flex flex-col gap-4">
              {DECK_CARDS.map((card) => {
                return (
                  <Link
                    key={card.id}
                    to={card.to}
                    search={{ from: "grid" }}
                    viewTransition
                    style={{ 
                      viewTransitionName: `card-${card.id}`,
                      padding: '5%',
                      containerType: 'inline-size'
                    } as React.CSSProperties}
                    className={`rounded-[1.8rem] border-3 border-ink flex flex-col shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98] transition-transform min-h-[clamp(250px,35vh,330px)] ${card.bgClass}`}
                  >
                    {/* TOP: Tag Pill */}
                    <div className="shrink-0 mb-[5%]">
                      <span className="text-[11px] uppercase font-black tracking-wider text-ink bg-white/90 border border-ink/20 px-3 py-0.5 rounded-full shadow-sm">
                        {card.tag}
                      </span>
                    </div>

                    {/* BOTTOM: Icon + Content — width-proportional */}
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="w-[20%] aspect-square mb-[4%]">
                        {renderIllustration(card.id)}
                      </div>
                      <h3
                        className="font-black text-ink leading-tight tracking-tight mb-[2%]"
                        style={{ fontSize: 'clamp(0.9rem, 6.5cqw, 1.8rem)' }}
                      >
                        {card.title}
                      </h3>
                      <p
                        className="text-ink/70 font-normal leading-snug"
                        style={{ fontSize: 'clamp(0.72rem, 3.8cqw, 1rem)' }}
                      >
                        {card.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Mobile Footer */}
      <footer className="grid grid-cols-3 w-full items-center z-30 shrink-0 h-10">
        <div className="justify-self-start">
          <Link
            to="/about"
            viewTransition
            style={{ viewTransitionName: 'card-[#about]' } as React.CSSProperties}
            className="text-xs sm:text-sm uppercase tracking-wider font-black text-ink hover:text-[#FF671F] transition-colors"
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
            className="text-xs sm:text-sm uppercase tracking-wider font-black text-ink hover:text-[#FF671F] transition-colors"
          >
            Get App
          </Link>
        </div>
      </footer>
    </div>
  );
}
