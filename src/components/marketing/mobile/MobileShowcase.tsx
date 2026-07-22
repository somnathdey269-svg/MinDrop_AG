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
                  style={{ 
                    viewTransitionName: `card-${currentCard.id}`,
                    paddingTop: '2.5%',
                    paddingBottom: '2.5%',
                    paddingLeft: '6%',
                    paddingRight: '6%',
                  } as React.CSSProperties}
                  className={`absolute inset-0 w-full h-full rounded-[2.2rem] border-3 border-ink flex flex-col justify-between shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98] transition-transform ${currentCard.bgClass}`}
                >
                  {/* Section 1: Tag Pill (15% height) */}
                  <div className="h-[15%] w-full shrink-0 flex items-center">
                    <span className="text-xs font-black uppercase tracking-wider text-ink bg-white/95 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm">
                      {currentCard.tag}
                    </span>
                  </div>

                  {/* Section 2: Centered Icon (25% height) */}
                  <div className="h-[25%] w-full shrink-0 flex items-center justify-center">
                    <div className="h-full aspect-square flex items-center justify-center">
                      {renderIllustration(currentCard.id)}
                    </div>
                  </div>

                  {/* Section 3: Content Area (55% height) */}
                  <div className="h-[55%] w-full shrink-0 flex flex-col justify-between">
                    {/* Title: 20% of Content Area */}
                    <div className="h-[20%] w-full flex items-center">
                      <h3
                        className="font-black text-ink leading-tight tracking-tight"
                        style={{ fontSize: 'clamp(1.35rem, 3.8vh, 2.2rem)' }}
                      >
                        {currentCard.title}
                      </h3>
                    </div>
                    {/* Description: 80% of Content Area */}
                    <div className="h-[80%] w-full flex flex-col justify-between overflow-hidden pt-1">
                      <p
                        className="text-ink/85 font-normal leading-relaxed"
                        style={{ fontSize: 'clamp(1.05rem, 2.5vh, 1.4rem)', lineHeight: '1.6' }}
                      >
                        {currentCard.description}
                      </p>
                    </div>
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
                      paddingTop: '2.5%',
                      paddingBottom: '2.5%',
                      paddingLeft: '6%',
                      paddingRight: '6%',
                    } as React.CSSProperties}
                    className={`rounded-[1.8rem] border-3 border-ink flex flex-col justify-between shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98] transition-transform aspect-[3/3.6] min-h-[290px] ${card.bgClass}`}
                  >
                    {/* Section 1: Tag Pill (15% height) */}
                    <div className="h-[15%] w-full shrink-0 flex items-center">
                      <span className="text-[11px] uppercase font-black tracking-wider text-ink bg-white/90 border border-ink/20 px-3 py-0.5 rounded-full shadow-sm">
                        {card.tag}
                      </span>
                    </div>

                    {/* Section 2: Centered Icon (25% height) */}
                    <div className="h-[25%] w-full shrink-0 flex items-center justify-center">
                      <div className="h-full aspect-square flex items-center justify-center p-0.5">
                        {renderIllustration(card.id)}
                      </div>
                    </div>

                    {/* Section 3: Content Area (55% height: 20% Title + 80% Description) */}
                    <div className="h-[55%] w-full shrink-0 flex flex-col justify-between">
                      {/* Title: 20% of Content Area */}
                      <div className="h-[20%] w-full flex items-center">
                        <h3
                          className="font-black text-ink leading-tight tracking-tight"
                          style={{ fontSize: 'clamp(1.15rem, 2.8vh, 1.6rem)' }}
                        >
                          {card.title}
                        </h3>
                      </div>
                      {/* Description: 80% of Content Area — full text, exact 2.5% bottom pad */}
                      <div className="h-[80%] w-full flex flex-col justify-between overflow-hidden pt-0.5">
                        <p
                          className="text-ink/80 font-normal leading-relaxed"
                          style={{ fontSize: 'clamp(0.85rem, 1.9vh, 1.08rem)', lineHeight: '1.5' }}
                        >
                          {card.description}
                        </p>
                      </div>
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
