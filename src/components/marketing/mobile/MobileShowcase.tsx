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
  const CardIcon = currentCard.illustrator;

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

      {/* 2. Main Mobile Content Area (Auto-Fitting h-auto Cards, 28px/18px Senior Typography) */}
      <div className="flex-1 w-full min-h-0 my-1.5 no-scrollbar z-10 block overflow-y-auto no-scrollbar py-2 px-1">
        {viewMode === "deck" ? (
          /* DECK / CAROUSEL MODE */
          <div className="w-full min-h-full flex flex-col items-center justify-center relative py-2">
            <div className="w-full max-w-[400px] mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`card-${currentCard.id}`}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`w-full rounded-[2rem] border-3 border-ink p-5 sm:p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${currentCard.bgClass}`}
                >
                  {/* Tag Pill */}
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-ink bg-white border-2 border-ink px-3 py-1 rounded-full shadow-sm inline-block">
                      {currentCard.tag}
                    </span>
                    {/* 28px Senior-Friendly Title */}
                    <h3 className="text-3xl font-black text-ink leading-tight tracking-tight mt-3 mb-2">
                      {currentCard.title}
                    </h3>
                    {/* 18px High Contrast Body Copy */}
                    <p className="text-lg text-ink font-bold leading-relaxed">
                      {currentCard.description}
                    </p>
                  </div>

                  {/* Feature Vector Illustration Widget */}
                  <div className="my-4 flex items-center justify-center overflow-hidden w-full py-1">
                    <div className="scale-105 transform-gpu origin-center">
                      {currentCard.id === "later" && <LaterAlarmIllustration />}
                      {currentCard.id === "notify" && <SmartFiltersIllustration />}
                      {currentCard.id === "places" && <PlacesMappingIllustration />}
                      {currentCard.id === "pricing" && <PricingTierIllustration />}
                      {currentCard.id === "faq" && <FAQHelpIllustration />}
                    </div>
                  </div>

                  {/* Full-Width Touch CTA Button */}
                  <button
                    onClick={handleShowMe}
                    className="w-full py-3.5 bg-ink text-canvas font-black text-xs uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition mt-1"
                  >
                    <span>Explore Feature</span>
                    {CardIcon && <CardIcon className="size-4 text-canvas" />}
                  </button>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Pagination Dots */}
              <div className="flex justify-center items-center gap-2 mt-4">
                {DECK_CARDS.map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`transition-all rounded-full border border-ink ${
                      idx === activeIdx 
                        ? "w-6 h-2.5 bg-ink shadow-sm" 
                        : "size-2.5 bg-white/70"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* GRID / FEED MODE */
          <div className="w-full max-w-[420px] mx-auto py-1 no-scrollbar z-20">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 pb-16">
              {DECK_CARDS.map((card) => {
                const Icon = card.illustrator;
                return (
                  <div
                    key={card.id}
                    className={`rounded-[1.85rem] border-3 border-ink p-5 flex flex-col justify-between shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${card.bgClass}`}
                  >
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-wider text-ink bg-white border-2 border-ink px-3 py-1 rounded-full shadow-sm inline-block">
                        {card.tag}
                      </span>
                      {/* 28px Senior-Friendly Title */}
                      <h3 className="text-2xl sm:text-3xl font-black text-ink leading-tight tracking-tight mt-2.5 mb-2">{card.title}</h3>
                      {/* 18px High Contrast Body Copy */}
                      <p className="text-base sm:text-lg text-ink font-bold leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <div className="my-3 flex items-center justify-center overflow-hidden w-full py-1">
                      <div className="scale-100 transform-gpu origin-center pointer-events-none">
                        {card.id === "later" && <LaterAlarmIllustration />}
                        {card.id === "notify" && <SmartFiltersIllustration />}
                        {card.id === "places" && <PlacesMappingIllustration />}
                        {card.id === "pricing" && <PricingTierIllustration />}
                        {card.id === "faq" && <FAQHelpIllustration />}
                      </div>
                    </div>
                    
                    <Link
                      to={card.to}
                      search={{ from: "grid" }}
                      className="w-full py-3 bg-ink text-canvas font-black text-xs uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition mt-1"
                    >
                      <span>Explore Feature</span>
                      {Icon && <Icon className="size-4 text-canvas" />}
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

      {/* Senior-Friendly Mobile About Modal */}
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
                <p className="text-base sm:text-lg text-ink font-bold mt-3 leading-relaxed">
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
