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

export function MobileShowcase() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  const touchStartX = useRef(0);
  
  // Mobile View Mode initialized from hash/search
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

  return (
    <div 
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (viewMode !== "deck") return;
        const delta = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 40) {
          if (delta > 0) {
            handleNext();
          } else {
            handlePrev();
          }
        }
      }}
      style={{
        backgroundColor: activeBgColor,
        transition: "background-color 0.4s ease-out"
      }}
      className="fixed inset-0 text-ink font-sans flex flex-col justify-between p-4 xs:p-5 select-none overflow-hidden h-[100dvh] w-screen"
    >
      {/* Background circles */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0"
        style={{
          backgroundColor: viewMode === "deck" ? bgColorPrev : "transparent",
          left: "-45vw",
          width: "90vw",
          height: "90vw",
          opacity: 0.5
        }}
      />
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0"
        style={{
          backgroundColor: viewMode === "deck" ? bgColorNext : "transparent",
          right: "-45vw",
          width: "90vw",
          height: "90vw",
          opacity: 0.5
        }}
      />

      {/* 1. Mobile Header */}
      <header className="flex justify-between items-center w-full z-30 shrink-0">
        <Link
          to="/terms"
          viewTransition
          style={{ viewTransitionName: 'card-terms' } as React.CSSProperties}
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
        >
          Terms
        </Link>
        
        <div className="flex items-center gap-1.5 select-none">
          <div className="size-7 relative grid place-items-center shrink-0">
            <div className="size-5 rounded-lg bg-gradient-to-tr from-[#FF671F] to-[#FFA06E] shadow-sm grid place-items-center border border-white/10">
              <span className="text-white font-black text-[11px] font-sans">m</span>
            </div>
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-ink">MinDrop</span>
        </div>

        <Link
          to="/privacy"
          viewTransition
          style={{ viewTransitionName: 'card-privacy' } as React.CSSProperties}
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
        >
          Privacy
        </Link>
      </header>

      {/* 2. Mobile Content Area */}
      <div 
        className={`flex-1 w-full min-h-0 my-1 no-scrollbar z-10 ${
          viewMode === "deck" 
            ? "flex items-center justify-center relative overflow-hidden" 
            : "block overflow-y-auto no-scrollbar py-2"
        }`}
      >
        {viewMode === "deck" ? (
          /* MOBILE DECK VIEW MODE */
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div className="relative w-[92vw] h-[68vh] max-h-[500px] min-h-[390px] flex items-center justify-center z-10">
              <AnimatePresence mode="popLayout">
                {/* Behind Stacked Card */}
                <motion.div
                  key={`next-${nextCard.id}`}
                  initial={{ scale: 0.9, rotate: 6, opacity: 0.8 }}
                  animate={{ scale: 0.95, rotate: 6, opacity: 0.95 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  className="absolute inset-0 rounded-[2rem] border-3 border-ink p-5 flex flex-col justify-between bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] pointer-events-none"
                >
                  <div className="shrink-0">
                    <span className="text-xs uppercase font-bold tracking-wider text-ink/40">Next Card</span>
                    <h3 className="text-xl font-black text-ink mt-2 leading-tight">{nextCard.title}</h3>
                  </div>

                  <div className="flex-1 my-1 flex items-center justify-center min-h-0 w-full opacity-40 pointer-events-none scale-90">
                    {nextCard.id === "later" && <LaterAlarmIllustration />}
                    {nextCard.id === "notify" && <SmartFiltersIllustration />}
                    {nextCard.id === "places" && <PlacesMappingIllustration />}
                    {nextCard.id === "pricing" && <PricingTierIllustration />}
                    {nextCard.id === "faq" && <FAQHelpIllustration />}
                  </div>

                  <div className="flex justify-end pt-1 shrink-0">
                    <span className="inline-grid place-items-center size-10 rounded-xl bg-canvas border-2 border-ink">
                      {NextIcon && <NextIcon className="size-5 text-ink/40" />}
                    </span>
                  </div>
                </motion.div>

                {/* Active Touch Card */}
                <motion.div
                  key={`active-${currentCard.id}`}
                  initial={{ x: 200, rotate: -10, opacity: 0 }}
                  animate={{ x: 0, rotate: -2, opacity: 1 }}
                  exit={{ x: -300, rotate: -15, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  onClick={handleShowMe}
                  style={{ viewTransitionName: `card-${currentCard.id}` } as React.CSSProperties}
                  className={`absolute inset-0 rounded-[2rem] border-3 border-ink p-5 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98] transition-transform ${currentCard.bgClass}`}
                >
                  <div className="shrink-0">
                    <span className="text-xs uppercase font-bold tracking-wider text-ink/70 bg-white/70 border border-ink/10 px-3 py-0.5 rounded-full">
                      {currentCard.tag}
                    </span>
                    <h3 className="text-2xl font-black text-ink mt-3 leading-tight tracking-tight">
                      {currentCard.title}
                    </h3>
                    <p className="text-xs text-ink/85 font-semibold mt-2 leading-relaxed">
                      {currentCard.description}
                    </p>
                  </div>

                  <div className="flex-1 my-1 flex items-center justify-center min-h-0 w-full">
                    <div className="scale-95 transform-gpu origin-center">
                      {currentCard.id === "later" && <LaterAlarmIllustration />}
                      {currentCard.id === "notify" && <SmartFiltersIllustration />}
                      {currentCard.id === "places" && <PlacesMappingIllustration />}
                      {currentCard.id === "pricing" && <PricingTierIllustration />}
                      {currentCard.id === "faq" && <FAQHelpIllustration />}
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-2 shrink-0">
                    <span className="text-[10px] uppercase font-black text-ink/40 tracking-wider">Tap to open</span>
                    <span className="inline-grid place-items-center size-11 rounded-xl bg-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {CardIcon && <CardIcon className="size-5 text-ink" />}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* MOBILE GRID VIEW MODE */
          <div className="w-full mx-auto px-1 py-1 no-scrollbar z-20">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 pb-12">
              {DECK_CARDS.map((card) => {
                const Icon = card.illustrator;
                return (
                  <Link
                    key={card.id}
                    to={card.to}
                    search={{ from: "grid" }}
                    viewTransition
                    style={{ viewTransitionName: `card-${card.id}` } as React.CSSProperties}
                    className={`rounded-[1.75rem] border-3 border-ink p-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-[0.99] transition-all cursor-pointer min-h-[280px] ${card.bgClass}`}
                  >
                    <div>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider text-ink bg-white/90 border border-ink/20 px-2.5 py-0.5 rounded-full shadow-sm">
                        {card.tag}
                      </span>
                      <h3 className="text-xl font-black text-ink mt-2 leading-tight">{card.title}</h3>
                      <p className="text-xs text-ink/85 font-semibold mt-1.5 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <div className="flex-1 my-2 flex items-center justify-center overflow-hidden w-full scale-90 pointer-events-none">
                      {card.id === "later" && <LaterAlarmIllustration />}
                      {card.id === "notify" && <SmartFiltersIllustration />}
                      {card.id === "places" && <PlacesMappingIllustration />}
                      {card.id === "pricing" && <PricingTierIllustration />}
                      {card.id === "faq" && <FAQHelpIllustration />}
                    </div>
                    
                    <div className="flex justify-between items-end pt-1.5 shrink-0 border-t border-ink/10">
                      <span className="text-[10px] font-black uppercase text-ink/50 tracking-wider">Open card</span>
                      <span className="inline-grid place-items-center size-9 rounded-lg bg-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {Icon && <Icon className="size-4 text-ink" />}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>

      {/* 3. Mobile Footer (Frozen Pinned) */}
      <footer className="grid grid-cols-3 w-full items-center z-30 shrink-0 pt-1">
        <div className="justify-self-start">
          <button
            onClick={() => setAboutOpen(true)}
            className="text-[11px] uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
          >
            About
          </button>
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
            className="text-[11px] uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
          >
            Get App
          </Link>
        </div>
      </footer>

      {/* Mobile About Modal */}
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
                className="bg-white border-3 border-ink p-6 rounded-[2rem] w-full max-w-xs shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative"
              >
                <button
                  onClick={() => setAboutOpen(false)}
                  className="absolute top-5 right-5 size-7 rounded-full border-2 border-ink bg-white grid place-items-center"
                >
                  <X className="size-3.5" />
                </button>
                <span className="inline-flex items-center gap-1 rounded-full border border-ink/15 bg-[#FFFBEB] px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#F59E0B] mb-3">
                  💡 Project Info
                </span>
                <h3 className="text-2xl font-black text-ink leading-tight">About MinDrop</h3>
                <p className="text-xs text-ink/75 font-semibold mt-3 leading-relaxed">
                  MinDrop is an offline second brain for immediate micro-actions—looping alarms for small tasks, location sweeps, and notification filters.
                </p>
                <div className="mt-6 pt-3 border-t-2 border-ink/10 flex">
                  <button
                    onClick={() => setAboutOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-ink text-canvas font-bold text-xs uppercase tracking-wider"
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
