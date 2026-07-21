import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, LayoutGrid, X, ArrowRight } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<"deck" | "grid">(() => {
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

  const activeBgColor = viewMode === "deck" ? currentCard.bgColor : "#FFD043";

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
      className="fixed inset-0 text-ink font-sans flex flex-col justify-between p-3.5 sm:p-5 select-none overflow-hidden h-[100dvh] w-screen"
    >
      {/* 1. Header (Frozen) */}
      <header className="flex justify-between items-center w-full z-30 shrink-0 py-1 px-1">
        <Link
          to="/terms"
          viewTransition
          style={{ viewTransitionName: 'card-terms' } as React.CSSProperties}
          className="text-xs uppercase tracking-widest font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
        >
          Terms
        </Link>
        
        <div className="flex items-center gap-1.5 select-none">
          <div className="size-7 relative grid place-items-center shrink-0">
            <div className="size-6 rounded-lg bg-gradient-to-tr from-[#FF671F] to-[#FFA06E] shadow-sm grid place-items-center border border-white/20">
              <span className="text-white font-black text-xs font-sans">m</span>
            </div>
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-ink">MinDrop</span>
        </div>

        <Link
          to="/privacy"
          viewTransition
          style={{ viewTransitionName: 'card-privacy' } as React.CSSProperties}
          className="text-xs uppercase tracking-widest font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
        >
          Privacy
        </Link>
      </header>

      {/* 2. Concept A: Google Showcase / Apple Wallet Deck Mode */}
      <div className="flex-1 w-full min-h-0 my-1 no-scrollbar z-10 block overflow-y-auto no-scrollbar py-2 px-1">
        {viewMode === "deck" ? (
          /* CONCEPT A: 3D STACKED GOOGLE SHOWCASE DECK */
          <div className="w-full min-h-full flex flex-col items-center justify-center relative py-1">
            <div className="relative w-full max-w-[380px] h-[480px] flex flex-col items-center justify-center">
              <AnimatePresence mode="popLayout">
                {/* Behind Stacked Preview Card */}
                <motion.div
                  key={`next-${nextCard.id}`}
                  initial={{ scale: 0.9, rotate: 6, opacity: 0.8 }}
                  animate={{ scale: 0.94, rotate: 5, opacity: 0.95 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  className="absolute inset-0 rounded-[2.25rem] border-3 border-ink p-5 flex flex-col justify-between bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] pointer-events-none"
                >
                  <div className="flex justify-between items-center shrink-0">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-ink/40 bg-canvas px-3 py-0.5 rounded-full border border-ink/10">Next Card</span>
                    <span className="text-xs font-mono font-bold text-ink/30">0{((activeIdx + 1) % DECK_CARDS.length) + 1}/05</span>
                  </div>

                  <div className="my-2 flex items-center justify-center overflow-hidden w-full bg-white/60 border-2 border-ink rounded-2xl py-4 opacity-40">
                    {nextCard.id === "later" && <LaterAlarmIllustration />}
                    {nextCard.id === "notify" && <SmartFiltersIllustration />}
                    {nextCard.id === "places" && <PlacesMappingIllustration />}
                    {nextCard.id === "pricing" && <PricingTierIllustration />}
                    {nextCard.id === "faq" && <FAQHelpIllustration />}
                  </div>

                  <div className="shrink-0">
                    <h3 className="text-xl font-black text-ink">{nextCard.title}</h3>
                  </div>
                </motion.div>

                {/* Active Front Hero Card (Concept A: Google Showcase Edition) */}
                <motion.div
                  key={`active-${currentCard.id}`}
                  initial={{ x: 220, rotate: -12, scale: 0.88, opacity: 0 }}
                  animate={{ x: 0, rotate: -2, scale: 1, opacity: 1 }}
                  exit={{ x: -280, rotate: -16, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 110, damping: 16 }}
                  style={{ viewTransitionName: `card-${currentCard.id}` } as React.CSSProperties}
                  className={`absolute inset-0 rounded-[2.25rem] border-3 border-ink p-5 sm:p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform ${currentCard.bgClass}`}
                >
                  {/* Top Bar inside Card */}
                  <div className="flex justify-between items-center shrink-0">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-ink bg-white/90 border-2 border-ink px-3 py-1 rounded-full shadow-sm">
                      {currentCard.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-ink/60 bg-white/60 border border-ink/10 px-2.5 py-0.5 rounded-full">
                      0{activeIdx + 1}/05
                    </span>
                  </div>

                  {/* Top 50% Visual Hero Showcase Canvas */}
                  <div className="my-2.5 flex items-center justify-center overflow-hidden w-full bg-white/80 border-2 border-ink rounded-2xl py-5 shadow-sm relative">
                    <div className="scale-110 transform-gpu origin-center">
                      {currentCard.id === "later" && <LaterAlarmIllustration />}
                      {currentCard.id === "notify" && <SmartFiltersIllustration />}
                      {currentCard.id === "places" && <PlacesMappingIllustration />}
                      {currentCard.id === "pricing" && <PricingTierIllustration />}
                      {currentCard.id === "faq" && <FAQHelpIllustration />}
                    </div>
                  </div>

                  {/* Bottom 50% Editorial Text & Action */}
                  <div className="shrink-0">
                    <h3 className="text-2xl sm:text-3xl font-black text-ink leading-tight tracking-tight mb-1.5">
                      {currentCard.title}
                    </h3>
                    <p className="text-base sm:text-lg text-ink/80 font-medium leading-relaxed">
                      {currentCard.description}
                    </p>
                  </div>

                  {/* Integrated Organic CTA Row (Replaces Heavy Black Bar) */}
                  <button
                    onClick={handleShowMe}
                    className="w-full flex items-center justify-between pt-3 mt-1 border-t-2 border-ink/15 group cursor-pointer"
                  >
                    <div className="text-left">
                      <span className="text-xs font-black uppercase tracking-wider text-ink group-hover:text-[#FF671F] transition-colors block">
                        Explore feature →
                      </span>
                      <span className="text-[10px] font-bold text-ink/50 block">Tap to view specifications</span>
                    </div>
                    <span className="inline-grid place-items-center size-10 rounded-2xl bg-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-ink group-hover:text-canvas transition shrink-0">
                      <ArrowRight className="size-5 text-ink group-hover:text-canvas transition-colors" />
                    </span>
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sleek Progress Line Indicator (Concept A) */}
            <div className="w-44 mx-auto h-1.5 bg-ink/15 rounded-full overflow-hidden mt-4 relative z-30">
              <motion.div
                className="h-full bg-ink rounded-full"
                animate={{
                  width: `${100 / DECK_CARDS.length}%`,
                  x: `${activeIdx * 100}%`
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>
        ) : (
          /* CONCEPT A: GRID / FEED MODE */
          <div className="w-full max-w-[400px] mx-auto py-1 no-scrollbar z-20">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 pb-16">
              {DECK_CARDS.map((card, idx) => {
                return (
                  <div
                    key={card.id}
                    className={`rounded-[2.25rem] border-3 border-ink p-5 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${card.bgClass}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-ink bg-white/90 border-2 border-ink px-3 py-1 rounded-full shadow-sm">
                        {card.tag}
                      </span>
                      <span className="text-xs font-mono font-bold text-ink/50">0{idx + 1}/05</span>
                    </div>

                    <div className="my-2.5 flex items-center justify-center overflow-hidden w-full bg-white/80 border-2 border-ink rounded-2xl py-5 shadow-sm relative pointer-events-none">
                      <div className="scale-105 transform-gpu origin-center">
                        {card.id === "later" && <LaterAlarmIllustration />}
                        {card.id === "notify" && <SmartFiltersIllustration />}
                        {card.id === "places" && <PlacesMappingIllustration />}
                        {card.id === "pricing" && <PricingTierIllustration />}
                        {card.id === "faq" && <FAQHelpIllustration />}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-ink leading-tight tracking-tight mb-1.5">{card.title}</h3>
                      <p className="text-base sm:text-lg text-ink/80 font-medium leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <Link
                      to={card.to}
                      search={{ from: "grid" }}
                      className="w-full flex items-center justify-between pt-3.5 mt-2 border-t-2 border-ink/15 group cursor-pointer"
                    >
                      <div className="text-left">
                        <span className="text-xs font-black uppercase tracking-wider text-ink group-hover:text-[#FF671F] transition-colors block">
                          Explore feature →
                        </span>
                        <span className="text-[10px] font-bold text-ink/50 block">Tap to view specifications</span>
                      </div>
                      <span className="inline-grid place-items-center size-10 rounded-2xl bg-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-ink group-hover:text-canvas transition shrink-0">
                        <ArrowRight className="size-5 text-ink group-hover:text-canvas transition-colors" />
                      </span>
                    </Link>
                  </div>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>

      {/* 3. Mobile Footer (Frozen) */}
      <footer className="grid grid-cols-3 w-full items-center z-30 shrink-0 pt-2 pb-1 px-1">
        <div className="justify-self-start">
          <button
            onClick={() => setAboutOpen(true)}
            className="text-xs uppercase tracking-widest font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 cursor-pointer"
          >
            About
          </button>
        </div>

        <div className="justify-self-center flex items-center bg-ink border-2 border-ink rounded-full p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] gap-1">
          <button
            onClick={() => handleToggleView("deck")}
            className={`p-2 rounded-full transition cursor-pointer ${
              viewMode === "deck" ? "bg-white text-ink" : "bg-ink text-canvas"
            }`}
            aria-label="Deck View"
          >
            <Layers className="size-4" />
          </button>
          <button
            onClick={() => handleToggleView("grid")}
            className={`p-2 rounded-full transition cursor-pointer ${
              viewMode === "grid" ? "bg-white text-ink" : "bg-ink text-canvas"
            }`}
            aria-label="Grid View"
          >
            <LayoutGrid className="size-4" />
          </button>
        </div>

        <div className="justify-self-end">
          <Link
            to="/download"
            className="text-xs uppercase tracking-widest font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
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
                className="bg-white border-3 border-ink p-6 rounded-[2rem] w-full max-w-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative"
              >
                <button
                  onClick={() => setAboutOpen(false)}
                  className="absolute top-5 right-5 size-8 rounded-full border-2 border-ink bg-white grid place-items-center cursor-pointer"
                >
                  <X className="size-4" />
                </button>
                <span className="inline-flex items-center gap-1 rounded-full border border-ink/15 bg-[#FFFBEB] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-3">
                  💡 Project Info
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-ink leading-tight">About MinDrop</h3>
                <p className="text-base sm:text-lg text-ink/80 font-medium mt-3 leading-relaxed">
                  MinDrop is an offline second brain for immediate micro-actions—looping alarms for small tasks, location sweeps, and notification filters.
                </p>
                <div className="mt-6 pt-3 border-t-2 border-ink/10 flex">
                  <button
                    onClick={() => setAboutOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-ink text-canvas font-black text-xs uppercase tracking-wider cursor-pointer"
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
