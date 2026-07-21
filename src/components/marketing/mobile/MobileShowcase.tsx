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
      className="fixed inset-0 text-ink font-sans flex flex-col justify-between p-3.5 sm:p-5 select-none overflow-hidden h-[100dvh] w-screen"
    >
      {/* 1. Mobile Header */}
      <header className="flex justify-between items-center w-full z-30 shrink-0 h-12 px-2">
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
      <div className="flex-1 w-full min-h-0 my-2 no-scrollbar z-10 flex flex-col justify-center items-center">
        {viewMode === "deck" ? (
          /* DECK VIEW MODE */
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full h-full max-h-[84vh] flex flex-col items-center justify-center relative"
          >
            {/* Mobile Card Container */}
            <div className="relative w-[min(90vw,360px)] h-[min(530px,74vh)] flex items-center justify-center">
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
                  className={`absolute inset-0 rounded-[2.2rem] border-3 border-ink p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98] transition-transform ${currentCard.bgClass}`}
                >
                  {/* Section 1: Header Tag Pill */}
                  <div className="shrink-0 flex justify-between items-center h-7 mb-1">
                    <span className="text-xs font-black uppercase tracking-wider text-ink bg-white/90 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm">
                      {currentCard.tag}
                    </span>
                  </div>

                  {/* Section 2: Hero Graphic */}
                  <div className="shrink-0 h-[210px] flex flex-col items-center justify-center pt-4 pb-2 overflow-visible w-full">
                    <div className="scale-[1.50] sm:scale-[1.60] transform-gpu origin-center">
                      {renderIllustration(currentCard.id)}
                    </div>
                  </div>

                  {/* Section 3: Header & Description Typography */}
                  <div className="shrink-0 mt-2">
                    <h3 className="text-3xl sm:text-4xl font-black text-ink leading-tight tracking-tight mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                      {currentCard.title}
                    </h3>
                    <p className="text-lg sm:text-xl text-ink/80 font-normal leading-relaxed">
                      {currentCard.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* GRID VIEW MODE */
          <div className="w-full h-full overflow-y-auto px-1 pt-2 pb-32 z-20 no-scrollbar">
            <div className="flex flex-col gap-5">
              {DECK_CARDS.map((card) => {
                return (
                  <Link
                    key={card.id}
                    to={card.to}
                    search={{ from: "grid" }}
                    viewTransition
                    style={{ viewTransitionName: `card-${card.id}` } as React.CSSProperties}
                    className={`rounded-[2rem] border-3 border-ink p-6 flex flex-col justify-between shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98] transition-transform min-h-[380px] ${card.bgClass}`}
                  >
                    {/* Top Chapter Tag Pill */}
                    <div className="shrink-0 flex items-center justify-between h-7 mb-2">
                      <span className="text-xs uppercase font-black tracking-wider text-ink bg-white/90 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm">
                        {card.tag}
                      </span>
                    </div>

                    {/* Graphic Section */}
                    <div className="shrink-0 h-[200px] flex flex-col items-center justify-center pt-3 pb-1 overflow-visible w-full pointer-events-none">
                      <div className="scale-120 transform-gpu origin-center flex items-center justify-center">
                        {renderIllustration(card.id)}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col justify-start mt-2">
                      <h3 className="text-2xl font-black text-ink leading-tight tracking-tight mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
                        {card.title}
                      </h3>
                      <p className="text-base text-ink/80 font-normal leading-relaxed">
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
      <footer className="grid grid-cols-3 w-full items-center z-30 shrink-0">
        <div className="justify-self-start">
          <Link
            to="/about"
            viewTransition
            style={{ viewTransitionName: 'card-[#about]' } as React.CSSProperties}
            className="text-xs sm:text-sm font-black uppercase tracking-widest text-ink/80 hover:text-ink transition-all cursor-pointer"
          >
            About
          </Link>
        </div>

        <div className="justify-self-center flex items-center bg-ink border-2 border-ink rounded-full p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] gap-1">
          <button
            onClick={() => handleToggleView("deck")}
            className={`p-1.5 rounded-full transition ${
              viewMode === "deck" ? "bg-white text-ink" : "bg-ink text-canvas"
            }`}
            aria-label="Deck View"
          >
            <Layers className="size-3.5" />
          </button>
          <button
            onClick={() => handleToggleView("grid")}
            className={`p-1.5 rounded-full transition ${
              viewMode === "grid" ? "bg-white text-ink" : "bg-ink text-canvas"
            }`}
            aria-label="Grid View"
          >
            <LayoutGrid className="size-3.5" />
          </button>
        </div>

        <div className="justify-self-end">
          <Link
            to="/download"
            className="text-xs sm:text-sm font-black uppercase tracking-widest text-ink/80 hover:text-ink transition-all"
          >
            Get App
          </Link>
        </div>
      </footer>
    </div>
  );
}
