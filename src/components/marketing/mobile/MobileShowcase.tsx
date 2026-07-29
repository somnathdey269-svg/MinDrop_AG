import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, LayoutGrid } from "lucide-react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { MinDropHeaderLogo } from "../MinDropHeaderLogo";
import { 
  DECK_CARDS, 
  getDeckCards,
  formatCMSFontSize,
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
import { useCMSPage } from "@/lib/cms/useCMSPage";

export function MobileShowcase() {
  const { fields } = useCMSPage("home");
  const cards = getDeckCards(fields);

  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"next" | "prev">("next");
  const [mobileGridCardHeight, setMobileGridCardHeight] = useState<number>(280);
  const [mobileDeckCardHeight, setMobileDeckCardHeight] = useState<number>(380);
  const measureContainerRef = useRef<HTMLDivElement>(null);

  const touchStartX = useRef<number | null>(null);

  // Sync View Mode with Hash/URL State
  const [viewMode, setViewMode] = useState<"deck" | "grid">(
    () => typeof window !== "undefined" && (window.location.hash.includes("grid") || window.location.search.includes("grid")) ? "grid" : "deck"
  );

  // Measure Mobile Deck & Grid Card Heights — same calcRequiredHeight as DesktopShowcase
  useLayoutEffect(() => {
    if (!measureContainerRef.current) return;

    // Back-calculation for fixed-% slot system: title in 20% slot, desc in 55% slot
    const calcRequiredHeight = (el: Element): number => {
      const titleEl = el.querySelector("h3");
      const descEl = el.querySelector("p");
      const titleH = titleEl ? titleEl.getBoundingClientRect().height : 0;
      const descH = descEl ? descEl.getBoundingClientRect().height : 0;
      const reqFromTitle = titleH > 0 ? titleH / 0.20 : 0;
      const reqFromDesc = descH > 0 ? descH / 0.55 : 0;
      return Math.max(
        reqFromTitle,
        reqFromDesc,
        el.getBoundingClientRect().height
      );
    };

    // Measure mobile deck cards
    const deckElems = measureContainerRef.current.querySelectorAll(".measure-mobile-deck-card");
    let maxDeckH = 0;
    deckElems.forEach((el) => {
      const reqH = calcRequiredHeight(el);
      if (reqH > maxDeckH) maxDeckH = reqH;
    });
    setMobileDeckCardHeight(Math.ceil(maxDeckH + 16));

    // Measure mobile grid cards
    const gridElems = measureContainerRef.current.querySelectorAll(".measure-mobile-grid-card");
    let maxGridH = 0;
    gridElems.forEach((el) => {
      const reqH = calcRequiredHeight(el);
      if (reqH > maxGridH) maxGridH = reqH;
    });
    setMobileGridCardHeight(Math.ceil(maxGridH + 12));
  }, [fields]);

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
    setActiveIdx((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setSwipeDirection("prev");
    setActiveIdx((prev) => (prev - 1 + cards.length) % cards.length);
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

  const currentCard = cards[activeIdx] || cards[0];
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

        {/* ── ALWAYS-MOUNTED OFF-SCREEN MEASUREMENT CONTAINER ──
            Outside the viewMode conditional — measures both deck and grid heights
            on any initial load path. Applies CMS font overrides for accurate measurement. */}
        <div
          ref={measureContainerRef}
          aria-hidden="true"
          className="fixed -top-[9999px] -left-[9999px] opacity-0 pointer-events-none z-0 flex flex-col"
        >
          {/* Deck measurement — matches actual mobile deck card width */}
          <div className="w-[clamp(275px,80vw,340px)]">
            {cards.map((c) => (
              <div key={`mdeck-${c.id}`} className="measure-mobile-deck-card w-full h-auto mb-4">
                <ShowcaseCardLayoutPrimitive
                  mode="deck"
                  bgClass={c.bgClass}
                  style={{ height: 'auto' }}
                  headerSlot={
                    <span
                      style={formatCMSFontSize(c.deckTagSizePx, true) ? { fontSize: formatCMSFontSize(c.deckTagSizePx, true) } : undefined}
                      className="text-xs font-black uppercase tracking-wider text-ink bg-white/95 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm"
                    >
                      {c.tag}
                    </span>
                  }
                  illustrationSlot={renderIllustration(c.id)}
                  titleSlot={
                    <h3
                      style={formatCMSFontSize(c.deckTitleSizePx, true) ? { fontSize: formatCMSFontSize(c.deckTitleSizePx, true) } : undefined}
                      className={CARD_TOKENS.typography.deck.title}
                    >
                      {c.title}
                    </h3>
                  }
                  descriptionSlot={
                    <p
                      style={formatCMSFontSize(c.deckDescSizePx, true) ? { fontSize: formatCMSFontSize(c.deckDescSizePx, true) } : undefined}
                      className={CARD_TOKENS.typography.deck.description}
                    >
                      {c.description}
                    </p>
                  }
                />
              </div>
            ))}
          </div>

          {/* Grid measurement — matches actual full-width mobile grid card */}
          <div className="w-[clamp(275px,80vw,400px)]">
            {cards.map((c) => (
              <div key={`mgrid-${c.id}`} className="measure-mobile-grid-card w-full h-auto mb-4">
                <ShowcaseCardLayoutPrimitive
                  mode="grid"
                  bgClass={c.bgClass}
                  style={{ height: 'auto' }}
                  headerSlot={
                    <span
                      style={formatCMSFontSize(c.gridTagSizePx, true) ? { fontSize: formatCMSFontSize(c.gridTagSizePx, true) } : undefined}
                      className="text-[11px] uppercase font-black tracking-wider text-ink bg-white/90 border border-ink/20 px-3 py-0.5 rounded-full shadow-sm"
                    >
                      {c.tag}
                    </span>
                  }
                  illustrationSlot={renderIllustration(c.id)}
                  titleSlot={
                    <h3
                      style={formatCMSFontSize(c.gridTitleSizePx, true) ? { fontSize: formatCMSFontSize(c.gridTitleSizePx, true) } : undefined}
                      className={CARD_TOKENS.typography.grid.title}
                    >
                      {c.title}
                    </h3>
                  }
                  descriptionSlot={
                    <p
                      style={formatCMSFontSize(c.gridDescSizePx, true) ? { fontSize: formatCMSFontSize(c.gridDescSizePx, true) } : undefined}
                      className={CARD_TOKENS.typography.grid.description}
                    >
                      {c.description}
                    </p>
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {viewMode === "deck" ? (
          /* DECK VIEW MODE (Fluid Mobile Viewport Math) */
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full h-full flex flex-col items-center justify-center relative"
          >
            {/* Mobile Card Container — height driven by content measurement, same principle as web */}
            <div
              className="relative w-[clamp(275px,80vw,340px)] flex items-center justify-center"
              style={{ height: `${mobileDeckCardHeight}px` }}
            >
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
                      <span
                        style={formatCMSFontSize(currentCard.deckTagSizePx, true) ? { fontSize: formatCMSFontSize(currentCard.deckTagSizePx, true) } : undefined}
                        className="text-xs font-black uppercase tracking-wider text-ink bg-white/95 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm"
                      >
                        {currentCard.tag}
                      </span>
                    }
                    illustrationSlot={renderIllustration(currentCard.id)}
                    titleSlot={
                      <h3
                        style={formatCMSFontSize(currentCard.deckTitleSizePx, true) ? { fontSize: formatCMSFontSize(currentCard.deckTitleSizePx, true) } : undefined}
                        className={CARD_TOKENS.typography.deck.title}
                      >
                        {currentCard.title}
                      </h3>
                    }
                    descriptionSlot={
                      <p
                        style={formatCMSFontSize(currentCard.deckDescSizePx, true) ? { fontSize: formatCMSFontSize(currentCard.deckDescSizePx, true) } : undefined}
                        className={CARD_TOKENS.typography.deck.description}
                      >
                        {currentCard.description}
                      </p>
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* GRID VIEW MODE — Fixed-% slot layout, height driven by measurement */
          <div className="w-full h-full overflow-y-auto px-4 pt-2 pb-28 z-20 no-scrollbar">
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              {cards.map((card) => {
                return (
                  <Link
                    key={card.id}
                    to={card.to}
                    search={{ from: "grid" }}
                    viewTransition
                    style={{
                      viewTransitionName: `card-${card.id}`,
                      height: `${mobileGridCardHeight}px`,
                    } as React.CSSProperties}
                    className="w-full block"
                  >
                    <ShowcaseCardLayoutPrimitive
                      mode="grid"
                      bgClass={card.bgClass}
                      className="active:scale-[0.98] transition-transform cursor-pointer"
                      headerSlot={
                        <span
                          style={formatCMSFontSize(card.gridTagSizePx, true) ? { fontSize: formatCMSFontSize(card.gridTagSizePx, true) } : undefined}
                          className="text-[11px] uppercase font-black tracking-wider text-ink bg-white/90 border border-ink/20 px-3 py-0.5 rounded-full shadow-sm"
                        >
                          {card.tag}
                        </span>
                      }
                      illustrationSlot={renderIllustration(card.id)}
                      titleSlot={
                        <h3
                          style={formatCMSFontSize(card.gridTitleSizePx, true) ? { fontSize: formatCMSFontSize(card.gridTitleSizePx, true) } : undefined}
                          className={CARD_TOKENS.typography.grid.title}
                        >
                          {card.title}
                        </h3>
                      }
                      descriptionSlot={
                        <p
                          style={formatCMSFontSize(card.gridDescSizePx, true) ? { fontSize: formatCMSFontSize(card.gridDescSizePx, true) } : undefined}
                          className={CARD_TOKENS.typography.grid.description}
                        >
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
