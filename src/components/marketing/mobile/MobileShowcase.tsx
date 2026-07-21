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
  const [swipeDirection, setSwipeDirection] = useState<"next" | "prev">("next");
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
    setSwipeDirection("next");
    setActiveIdx((prev) => (prev + 1) % DECK_CARDS.length);
  };

  const handlePrev = () => {
    setSwipeDirection("prev");
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
      {/* 1. Mobile Header (Sleek Aligned Pills, No Underlines) */}
      <header className="flex justify-between items-center w-full z-30 shrink-0 py-1.5 px-1">
        <Link
          to="/terms"
          viewTransition
          style={{ viewTransitionName: 'card-terms' } as React.CSSProperties}
          className="text-[11px] font-black uppercase tracking-widest text-ink/80 hover:text-ink hover:bg-white/40 px-2.5 py-1 rounded-full transition-all"
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
          className="text-[11px] font-black uppercase tracking-widest text-ink/80 hover:text-ink hover:bg-white/40 px-2.5 py-1 rounded-full transition-all"
        >
          Privacy
        </Link>
      </header>

      {/* 2. Mobile Showcase (Content-Hugging Compact Card, Header Tag -> 1 Space -> Graphic -> 1 Space -> Content, Zero Bottom Space) */}
      <div className="flex-1 w-full min-h-0 my-1 no-scrollbar z-10 block overflow-y-auto no-scrollbar py-2 px-1">
        {viewMode === "deck" ? (
          /* DECK / CAROUSEL MODE */
          <div className="w-full min-h-full flex flex-col items-center justify-center relative py-1">
            <div className="relative w-full max-w-[340px] h-[330px] xs:h-[345px] flex flex-col items-center justify-center">
              <AnimatePresence mode="popLayout" custom={swipeDirection}>
                {/* Behind Stacked Preview Card */}
                <motion.div
                  key={`next-${nextCard.id}`}
                  initial={{ scale: 0.9, y: 12, rotate: 6, opacity: 0.7 }}
                  animate={{ scale: 0.94, y: 6, rotate: 5, opacity: 0.95 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 22 }}
                  className="absolute inset-0 rounded-[2.25rem] border-3 border-ink p-5 flex flex-col justify-start bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] pointer-events-none"
                >
                  <div className="flex justify-between items-center shrink-0 mb-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-ink/40 bg-canvas px-3 py-0.5 rounded-full border border-ink/10">
                      {nextCard.tag}
                    </span>
                  </div>

                  <div className="my-2 flex items-center justify-center overflow-visible w-full opacity-40">
                    {nextCard.id === "later" && <LaterAlarmIllustration />}
                    {nextCard.id === "notify" && <SmartFiltersIllustration />}
                    {nextCard.id === "places" && <PlacesMappingIllustration />}
                    {nextCard.id === "pricing" && <PricingTierIllustration />}
                    {nextCard.id === "faq" && <FAQHelpIllustration />}
                  </div>

                  <div className="shrink-0 mt-1">
                    <h3 className="text-xl font-black text-ink">{nextCard.title}</h3>
                  </div>
                </motion.div>

                {/* Active Front Hero Card */}
                <motion.div
                  key={`active-${currentCard.id}`}
                  custom={swipeDirection}
                  initial={(dir) => ({
                    x: dir === "next" ? 280 : -280,
                    y: -10,
                    rotate: dir === "next" ? 10 : -10,
                    scale: 0.85,
                    opacity: 0
                  })}
                  animate={{ x: 0, y: 0, rotate: -2, scale: 1, opacity: 1 }}
                  exit={(dir) => ({
                    x: dir === "next" ? -300 : 300,
                    y: 15,
                    rotate: dir === "next" ? -18 : 18,
                    scale: 0.85,
                    opacity: 0
                  })}
                  transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.8 }}
                  onClick={handleShowMe}
                  style={{ viewTransitionName: `card-${currentCard.id}` } as React.CSSProperties}
                  className={`absolute inset-0 rounded-[2.25rem] border-3 border-ink p-5 xs:p-6 flex flex-col justify-start shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:scale-[0.98] transition-transform ${currentCard.bgClass}`}
                >
                  {/* Top Bar inside Card (Header Tag) */}
                  <div className="flex justify-between items-center shrink-0 mb-2.5">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-ink bg-white/90 border-2 border-ink px-3 py-1 rounded-full shadow-sm">
                      {currentCard.tag}
                    </span>
                  </div>

                  {/* Graphic Illustration (1 space below header tag, 1 space above content) */}
                  <div className="my-2 flex items-center justify-center overflow-visible w-full relative shrink-0">
                    {currentCard.id === "later" && <LaterAlarmIllustration />}
                    {currentCard.id === "notify" && <SmartFiltersIllustration />}
                    {currentCard.id === "places" && <PlacesMappingIllustration />}
                    {currentCard.id === "pricing" && <PricingTierIllustration />}
                    {currentCard.id === "faq" && <FAQHelpIllustration />}
                  </div>

                  {/* Content below graphic (Title + Description with snug line spacing) */}
                  <div className="shrink-0 mt-1">
                    <h3 className="text-2xl xs:text-3xl font-black text-ink leading-tight tracking-tight mb-1.5">
                      {currentCard.title}
                    </h3>
                    <p className="text-sm xs:text-base text-ink/85 font-normal leading-snug">
                      {currentCard.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* GRID / FEED MODE */
          <div className="w-full max-w-[400px] mx-auto py-1 no-scrollbar z-20">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 pb-16">
              {DECK_CARDS.map((card) => {
                return (
                  <Link
                    key={card.id}
                    to={card.to}
                    search={{ from: "grid" }}
                    viewTransition
                    style={{ viewTransitionName: `card-${card.id}` } as React.CSSProperties}
                    className={`rounded-[2.25rem] border-3 border-ink p-5 flex flex-col justify-start shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98] transition-transform ${card.bgClass}`}
                  >
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-ink bg-white/90 border-2 border-ink px-3 py-1 rounded-full shadow-sm">
                        {card.tag}
                      </span>
                    </div>

                    {/* Graphic Illustration ON TOP Section (Uncut) */}
                    <div className="my-2 flex items-center justify-center overflow-visible w-full relative pointer-events-none">
                      {card.id === "later" && <LaterAlarmIllustration />}
                      {card.id === "notify" && <SmartFiltersIllustration />}
                      {card.id === "places" && <PlacesMappingIllustration />}
                      {card.id === "pricing" && <PricingTierIllustration />}
                      {card.id === "faq" && <FAQHelpIllustration />}
                    </div>

                    {/* Content in LOWER Section */}
                    <div className="mt-1">
                      <h3 className="text-2xl xs:text-3xl font-black text-ink leading-tight tracking-tight mb-1.5">{card.title}</h3>
                      <p className="text-sm xs:text-base text-ink/85 font-normal leading-snug">
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

      {/* 3. Mobile Footer (Frozen Aligned Pills, No Underlines) */}
      <footer className="grid grid-cols-3 w-full items-center z-30 shrink-0 pt-1.5 pb-1 px-1">
        <div className="justify-self-start">
          <button
            onClick={() => setAboutOpen(true)}
            className="text-[11px] font-black uppercase tracking-widest text-ink/80 hover:text-ink hover:bg-white/40 px-2.5 py-1 rounded-full transition-all cursor-pointer"
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
            className="text-[11px] font-black uppercase tracking-widest text-ink/80 hover:text-ink hover:bg-white/40 px-2.5 py-1 rounded-full transition-all"
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
                <p className="text-base sm:text-lg text-ink/80 font-normal mt-3 leading-relaxed">
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
