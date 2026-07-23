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

export function MobileShowcase() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"next" | "prev">("next");

  const touchStartX = useRef<number | null>(null);

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
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
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
  const activeBgColor = viewMode === "deck" ? currentCard.bgColor : "#FFC935";

  const handleShowMe = () => {
    navigate({ to: currentCard.to, search: { from: "deck" } });
  };

  return (
    <div 
      style={{
        backgroundColor: activeBgColor,
        transition: "background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
      }}
      className="fixed inset-0 w-screen h-[100dvh] overflow-hidden flex flex-col justify-between select-none font-sans p-2 sm:p-4"
    >
      {/* 1. TOP NAV BAR (Aligned Terms, Logo, Privacy) */}
      <header className="w-full px-5 pt-3 pb-1 flex items-center justify-between z-30 shrink-0 h-12">
        <Link 
          to="/terms"
          className="text-xs font-black uppercase tracking-wider text-ink hover:text-[#FF671F] transition-colors leading-none flex items-center cursor-pointer"
        >
          Terms
        </Link>
        
        <MinDropHeaderLogo className="text-xl sm:text-2xl flex items-center" />

        <Link 
          to="/privacy"
          className="text-xs font-black uppercase tracking-wider text-ink hover:text-[#FF671F] transition-colors leading-none flex items-center cursor-pointer"
        >
          Privacy
        </Link>
      </header>

      {/* 2. MAIN SHOWCASE AREA */}
      <main className="relative flex-1 w-full flex items-center justify-center overflow-hidden px-3 my-1">
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
                  className="absolute inset-0 w-full h-full"
                  style={{ 
                    viewTransitionName: `card-${currentCard.id}`,
                  } as React.CSSProperties}
                >
                  <ShowcaseCardLayoutPrimitive
                    mode="deck"
                    bgClass={currentCard.bgClass}
                    onClick={handleShowMe}
                    className="active:scale-[0.98] transition-transform cursor-pointer"
                    headerSlot={
                      <span className="text-xs font-black uppercase tracking-wider text-ink bg-white/95 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm">
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
                    } as React.CSSProperties}
                    className="aspect-[3/3.6] min-h-[290px] block"
                  >
                    <ShowcaseCardLayoutPrimitive
                      mode="grid"
                      bgClass={card.bgClass}
                      className="active:scale-[0.98] transition-transform cursor-pointer"
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
            </div>
          </div>
        )}
      </main>

      {/* 3. ELEVATED FLOATING ISLAND DOCK FOOTER */}
      <div className="w-full flex items-center justify-center shrink-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1">
        <footer className="w-full max-w-sm bg-white border-3 border-ink rounded-full px-4 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between select-none">
          <Link 
            to="/about"
            className="text-[11px] uppercase font-black tracking-widest text-ink hover:text-[#FF671F] transition-colors leading-none flex items-center shrink-0 cursor-pointer"
          >
            ABOUT
          </Link>

          {/* Premium Segmented View Switcher */}
          <div className="bg-ink border-2 border-ink rounded-full p-0.5 flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleToggleView("deck")}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer leading-none ${
                viewMode === "deck" 
                  ? "bg-white text-ink shadow-xs" 
                  : "text-white/70 hover:text-white"
              }`}
              aria-label="Switch to Deck View"
            >
              <Layers className="size-3" />
              <span>DECK</span>
            </button>
            <button
              onClick={() => handleToggleView("grid")}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer leading-none ${
                viewMode === "grid" 
                  ? "bg-white text-ink shadow-xs" 
                  : "text-white/70 hover:text-white"
              }`}
              aria-label="Switch to Grid View"
            >
              <LayoutGrid className="size-3" />
              <span>GRID</span>
            </button>
          </div>

          <Link
            to="/download"
            className="text-[11px] uppercase tracking-widest font-black text-ink hover:text-[#FF671F] transition-colors leading-none flex items-center shrink-0 cursor-pointer"
          >
            GET APP
          </Link>
        </footer>
      </div>
    </div>
  );
}
