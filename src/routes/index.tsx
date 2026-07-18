import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, Download, AlarmClock, BellRing, Navigation, 
  ShieldAlert, Sparkles, BrainCircuit, X, Play, RotateCcw, 
  Layers, Volume2, ShieldCheck, Heart, Home, Key, LayoutGrid
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MinDrop — A Kind Second Brain" },
      { name: "description", content: "Discover how MinDrop can carry the small things your brain shouldn't have to. Loop alarms, smart notification filters, and geofences." },
      { property: "og:title", content: "MinDrop — A Kind Second Brain" },
      { property: "og:description", content: "Discover how MinDrop can carry the small things your brain shouldn't have to." },
      { property: "og:url", content: "https://www.mindrop.in/" },
    ],
  }),
  component: ShowcaseDeckPage,
});

interface ShowcaseCard {
  id: string;
  slug: string;
  title: string;
  description: string;
  bgClass: string;
  tag: string;
  illustrator: any;
  to: string;
}

const DECK_CARDS: ShowcaseCard[] = [
  {
    id: "later",
    slug: "later-feature",
    title: "Ring looping alarms for tasks.",
    description: "MinDrop Later alarms ring continuously like a phone call until checked, surviving power restarts.",
    bgClass: "bg-[#E2F5EC] border-[#10B981]",
    tag: "⏰ Later alarm",
    illustrator: AlarmClock,
    to: "/later-feature"
  },
  {
    id: "notify",
    slug: "notify-feature",
    title: "Filter messy pings into alarms.",
    description: "Build local rules matching Slack boss alerts or UPI receipts to trigger immediate loop rings.",
    bgClass: "bg-[#FFFBEB] border-[#F59E0B]",
    tag: "🔔 Smart filters",
    illustrator: BellRing,
    to: "/notify-feature"
  },
  {
    id: "places",
    slug: "places-feature",
    title: "Trigger reminders near locations.",
    description: "Define coordinates and trigger active checklists exactly when stepping inside the perimeter.",
    bgClass: "bg-[#F5F3FF] border-[#8B5CF6]",
    tag: "📍 Places mapping",
    illustrator: Navigation,
    to: "/places-feature"
  },
  {
    id: "pricing",
    slug: "pricing",
    title: "Keep it free, or unlock limits.",
    description: "Start free with up to 5 concurrent active drops, or support the project for unlimited storage.",
    bgClass: "bg-[#FDF2F7] border-[#EC4899]",
    tag: "💎 Affordable pricing",
    illustrator: Sparkles,
    to: "/pricing"
  },
  {
    id: "faq",
    slug: "faq",
    title: "Get answers to key questions.",
    description: "Read details about SQLite storage databases, permission listeners, and native background sweeps.",
    bgClass: "bg-[#F0FDF4] border-[#22C55E]",
    tag: "❔ FAQ Help",
    illustrator: ShieldCheck,
    to: "/faq"
  }
];

function ShowcaseDeckPage() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [viewMode, setViewMode] = useState<"deck" | "grid">("deck");
  
  // Ref to prevent scrolling too quickly (cooldown)
  const scrollCooldown = useRef(false);

  // Sync viewMode from location hash on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.hash === "#grid") {
        setViewMode("grid");
      } else {
        setViewMode("deck");
      }
    }
  }, []);

  // Update hash when viewMode changes
  const handleToggleView = (mode: "deck" | "grid") => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      window.location.hash = mode === "grid" ? "grid" : "";
    }
  };

  // Mouse wheel scroll event listener to change slides
  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== "deck" || aboutOpen) return;
    
    // Check threshold for delta
    if (Math.abs(e.deltaY) < 15 && Math.abs(e.deltaX) < 15) return;

    if (scrollCooldown.current) return;
    scrollCooldown.current = true;

    if (e.deltaY > 0 || e.deltaX > 0) {
      // Scroll down or right -> Next Card
      setActiveIdx((prev) => (prev + 1) % DECK_CARDS.length);
    } else {
      // Scroll up or left -> Prev Card
      setActiveIdx((prev) => (prev - 1 + DECK_CARDS.length) % DECK_CARDS.length);
    }

    setTimeout(() => {
      scrollCooldown.current = false;
    }, 8500); // 850ms transition cooldown
  };

  // Auto-play cycling effect if toggled
  useEffect(() => {
    if (!autoPlay || viewMode !== "deck") return;
    const t = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % DECK_CARDS.length);
    }, 4500);
    return () => clearInterval(t);
  }, [autoPlay, viewMode]);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % DECK_CARDS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + DECK_CARDS.length) % DECK_CARDS.length);
  };

  const handleShowMe = () => {
    const card = DECK_CARDS[activeIdx];
    navigate({ to: card.to, search: { from: "deck" } });
  };

  const currentCard = DECK_CARDS[activeIdx];
  const nextCard = DECK_CARDS[(activeIdx + 1) % DECK_CARDS.length];
  const CardIcon = currentCard.illustrator;
  const NextIcon = nextCard.illustrator;

  return (
    <div 
      onWheel={handleWheel}
      className="fixed inset-0 bg-canvas text-ink font-sans flex flex-col justify-between p-6 select-none overflow-hidden h-[100dvh] w-screen"
    >
      
      {/* 1. Header Corners */}
      <header className="flex justify-between items-center w-full z-30 shrink-0">
        <button
          onClick={() => setAboutOpen(true)}
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 cursor-pointer hover:border-[#FF671F]"
        >
          About
        </button>
        
        <div className="flex items-center gap-2">
          <span className="inline-grid place-items-center size-8 rounded-lg bg-[#FF671F] text-white font-black border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm">M</span>
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline text-ink">MinDrop — The Web Can Do What!?</span>
        </div>

        <Link
          to="/download"
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 hover:border-[#FF671F]"
        >
          Get App
        </Link>
      </header>

      {/* 2. Main content area depending on mode */}
      <div className="flex-1 flex items-center justify-center relative w-full my-4 overflow-y-auto no-scrollbar">
        
        {viewMode === "deck" ? (
          /* DECK VIEW MODE */
          <div className="w-full h-full flex items-center justify-center relative">
            
            {/* Next Card Trigger on the Left */}
            <div className="absolute left-4 lg:left-12 z-30">
              <button
                onClick={handleNext}
                className="flex flex-col items-start gap-1 group text-left cursor-pointer"
              >
                <span className="text-[10px] uppercase font-bold tracking-widest text-ink/40">Cycle Deck</span>
                <span className="text-xl md:text-2xl font-black text-ink border-b-3 border-ink group-hover:text-[#FF671F] group-hover:border-[#FF671F] transition-colors pb-0.5">
                  Next card
                </span>
              </button>
            </div>

            {/* 3D Stacked Cards Deck */}
            <div className="relative w-[300px] sm:w-[360px] md:w-[400px] h-[400px] sm:h-[460px] flex items-center justify-center z-10">
              <AnimatePresence mode="popLayout">
                {/* Behind stacked preview card */}
                <motion.div
                  key={`next-${nextCard.id}`}
                  initial={{ scale: 0.9, rotate: 6, opacity: 0.8 }}
                  animate={{ scale: 0.94, rotate: 8, opacity: 0.9 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-[2.5rem] border-3 border-ink p-8 flex flex-col justify-between bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] pointer-events-none"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-ink/40">Next Card</span>
                    <h3 className="text-2xl font-black text-ink mt-8 leading-tight">{nextCard.title}</h3>
                  </div>
                  <div className="flex justify-end pt-4">
                    <span className="inline-grid place-items-center size-12 rounded-2xl bg-canvas border-2 border-ink">
                      <NextIcon className="size-6 text-ink/40" />
                    </span>
                  </div>
                </motion.div>

                {/* Front Active Card */}
                <motion.div
                  key={`active-${currentCard.id}`}
                  initial={{ x: 200, rotate: -15, scale: 0.85, opacity: 0 }}
                  animate={{ x: 0, rotate: -2, scale: 1, opacity: 1 }}
                  exit={{ x: -350, rotate: -18, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 14 }}
                  className={`absolute inset-0 rounded-[2.5rem] border-3 border-ink p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${currentCard.bgClass}`}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-ink/60 bg-white/40 border border-ink/10 px-2 py-0.5 rounded-full">
                        {currentCard.tag}
                      </span>
                    </div>

                    <h3 className="text-3xl font-black text-ink mt-8 leading-tight">
                      {currentCard.title}
                    </h3>

                    <p className="text-xs text-ink/75 font-semibold mt-4 leading-relaxed">
                      {currentCard.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-end pt-6">
                    <span className="text-[9px] uppercase font-black text-ink/40">MinDrop Brain</span>
                    <span className="inline-grid place-items-center size-14 rounded-2xl bg-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <CardIcon className="size-7 text-ink" />
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Detailed View Trigger on the Right */}
            <div className="absolute right-4 lg:right-12 z-30">
              <button
                onClick={handleShowMe}
                className="flex flex-col items-end gap-1 group text-right cursor-pointer"
              >
                <span className="text-[10px] uppercase font-bold tracking-widest text-ink/40">Read specs</span>
                <span className="text-xl md:text-2xl font-black text-ink border-b-3 border-ink group-hover:text-[#FF671F] group-hover:border-[#FF671F] transition-colors pb-0.5">
                  Show me!
                </span>
              </button>
            </div>

          </div>
        ) : (
          /* GRID VIEW MODE CATALOG */
          <div className="w-full max-w-6xl mx-auto px-4 py-8 z-10">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 justify-center items-stretch"
            >
              {DECK_CARDS.map((card) => {
                const Icon = card.illustrator;
                return (
                  <Link
                    key={card.id}
                    to={card.to}
                    search={{ from: "grid" }}
                    className={`rounded-[2rem] border-3 border-ink p-6 flex flex-col justify-between h-[250px] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 cursor-pointer ${card.bgClass}`}
                  >
                    <div>
                      <span className="text-[9px] uppercase font-black text-ink/50 bg-white/40 border border-ink/10 px-2 py-0.5 rounded-full">
                        {card.tag}
                      </span>
                      <h3 className="text-xl font-black text-ink mt-6 leading-tight">{card.title}</h3>
                    </div>
                    
                    <div className="flex justify-between items-end pt-4">
                      <span className="text-[9px] font-black uppercase text-ink/40">Open card</span>
                      <span className="inline-grid place-items-center size-10 rounded-xl bg-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Icon className="size-5.5 text-ink" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        )}

      </div>

      {/* 3. Footer Corners */}
      <footer className="flex justify-between items-center w-full z-30 shrink-0">
        <div className="text-xs font-black uppercase tracking-wider text-ink/50">
          Chrome for Developers (Inspired)
        </div>

        {/* Dynamic Pill Switcher Grid/Deck Controls */}
        <div className="flex items-center bg-ink border-2 border-ink rounded-full p-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] gap-1">
          <button
            onClick={() => handleToggleView("deck")}
            className={`p-2 rounded-full transition cursor-pointer ${
              viewMode === "deck" ? "bg-white text-ink" : "bg-ink text-canvas hover:text-[#FF671F]"
            }`}
            aria-label="Deck View"
          >
            <Layers className="size-4" />
          </button>
          <button
            onClick={() => handleToggleView("grid")}
            className={`p-2 rounded-full transition cursor-pointer ${
              viewMode === "grid" ? "bg-white text-ink" : "bg-ink text-canvas hover:text-[#FF671F]"
            }`}
            aria-label="Grid View"
          >
            <LayoutGrid className="size-4" />
          </button>
        </div>

        <Link
          to="/privacy"
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 hover:border-[#FF671F]"
        >
          Privacy
        </Link>
      </footer>

      {/* About Dialog Modal Overlay */}
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
                className="bg-white border-3 border-ink p-8 rounded-[2.5rem] w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
              >
                <button
                  onClick={() => setAboutOpen(false)}
                  className="absolute top-6 right-6 cursor-pointer size-8 rounded-full border-2 border-ink bg-white grid place-items-center hover:bg-ink/5 transition"
                >
                  <X className="size-4" />
                </button>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-[#FFFBEB] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] mb-4">
                  💡 Project Info
                </span>
                <h3 className="text-3xl font-black text-ink leading-tight">About MinDrop</h3>
                <p className="text-xs text-ink/75 font-semibold mt-4 leading-relaxed">
                  MinDrop is an offline second brain for immediate micro-actions—looping alarms for small tasks, location sweeps, and notification filters.
                </p>
                <p className="text-xs text-ink/65 font-medium mt-3 leading-relaxed">
                  Built fully statically on Cloudflare Pages using React, Tailwind V4, and TanStack Start, mimicking the exact deck/grid animations of Google's Web Showcase.
                </p>
                <div className="mt-8 pt-4 border-t-2 border-ink/8 flex gap-3">
                  <button
                    onClick={() => setAboutOpen(false)}
                    className="flex-1 text-center py-3 rounded-xl bg-ink text-canvas hover:opacity-90 font-bold transition text-xs uppercase tracking-wider cursor-pointer"
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
