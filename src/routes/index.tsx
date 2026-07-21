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
  bgColor: string;
  tag: string;
  illustrator: any;
  to: string;
}

const DECK_CARDS: ShowcaseCard[] = [
  {
    id: "later",
    slug: "later-feature",
    title: "Looping Alarms",
    description: "Ordinary alerts are easy to ignore. MinDrop alarms ring continuously like a phone call until checked, surviving system restarts.",
    bgClass: "bg-[#E2F5EC] border-[#10B981]",
    bgColor: "#E2F5EC",
    tag: "⏰ Later alarm",
    illustrator: AlarmClock,
    to: "/later-feature"
  },
  {
    id: "notify",
    slug: "notify-feature",
    title: "Smart Filters",
    description: "Avoid notification distraction. Filter incoming Slack, WhatsApp, or SMS alerts to trigger loop rings only for matches.",
    bgClass: "bg-[#FFFBEB] border-[#F59E0B]",
    bgColor: "#FFFBEB",
    tag: "🔔 Smart filters",
    illustrator: BellRing,
    to: "/notify-feature"
  },
  {
    id: "places",
    slug: "places-feature",
    title: "Location Alarms",
    description: "Set reminders that trigger when you enter specific boundaries. Passive tower checks avoid constant GPS battery drain.",
    bgClass: "bg-[#F5F3FF] border-[#8B5CF6]",
    bgColor: "#F5F3FF",
    tag: "📍 Places mapping",
    illustrator: Navigation,
    to: "/places-feature"
  },
  {
    id: "pricing",
    slug: "pricing",
    title: "Pricing Plans",
    description: "MinDrop is free for up to 3 alarms, 3 notify rules, and 3 locations. A yearly subscription unlocks infinite slots and Google Drive backups sync.",
    bgClass: "bg-[#FDF2F7] border-[#EC4899]",
    bgColor: "#FDF2F7",
    tag: "💎 Affordable pricing",
    illustrator: Sparkles,
    to: "/pricing"
  },
  {
    id: "faq",
    slug: "faq",
    title: "FAQ Help",
    description: "Get answers on local geofencing permissions and SQLite database. MinDrop runs fully serverless to keep your data private.",
    bgClass: "bg-[#F0FDF4] border-[#22C55E]",
    bgColor: "#F0FDF4",
    tag: "❔ FAQ Help",
    to: "/faq"
  }
];

/* 
 * 1. Later Alarm Illustration: Rings loopingly with soundwave concentric circles and dismiss/snooze options.
 */
function LaterAlarmIllustration() {
  return (
    <div className="border-2 border-ink bg-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1.5 w-[180px] sm:w-[210px] relative overflow-hidden shrink-0">
      <div className="relative size-9 sm:size-11 flex items-center justify-center">
        <motion.div
          animate={{ rotate: [-7, 7, -7] }}
          transition={{ repeat: Infinity, duration: 0.15, ease: "linear" }}
          className="p-1.5 bg-[#E2F5EC] border-2 border-ink rounded-full relative z-10"
        >
          <AlarmClock className="size-4 sm:size-5 text-ink" />
        </motion.div>

        {/* Pulsing expanding rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
            className="absolute border-2 border-[#10B981]/50 rounded-full size-8"
          />
          <motion.div
            animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="absolute border border-[#10B981]/30 rounded-full size-8"
          />
        </div>
      </div>

      <div className="text-[8px] sm:text-[9px] font-black uppercase text-[#10B981] animate-pulse tracking-wide">Alarm Ringing</div>

      <div className="flex gap-1.5 mt-0.5 w-full z-10">
        <div className="flex-1 py-1 text-[7px] sm:text-[8px] font-black uppercase text-center border-2 border-ink bg-[#10B981] text-white rounded-md shadow-[1px_1px_0px_rgba(0,0,0,1)]">Dismiss</div>
        <div className="flex-1 py-1 text-[7px] sm:text-[8px] font-black uppercase text-center border-2 border-ink bg-white text-ink rounded-md shadow-[1px_1px_0px_rgba(0,0,0,1)]">Snooze</div>
      </div>
    </div>
  );
}

/* 
 * 2. Smart Filters Illustration: Notifications stream down, rules block normal pings, boss alerts trigger alarms.
 */
function SmartFiltersIllustration() {
  return (
    <div className="border-2 border-ink bg-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-2 sm:p-3 w-[180px] sm:w-[210px] relative overflow-hidden h-[82px] sm:h-[95px] shrink-0">
      {/* Target boundary line */}
      <div className="absolute top-[45%] left-0 right-0 border-t-2 border-dashed border-ink/20 z-0 flex justify-center">
        <span className="bg-white px-1 text-[6px] sm:text-[7px] font-black uppercase tracking-wider -translate-y-[5px] text-ink/60">Filters</span>
      </div>

      {/* Standard Ping */}
      <motion.div
        animate={{ y: [-20, 85] }}
        transition={{ repeat: Infinity, duration: 3.2, ease: "linear" }}
        className="absolute left-2 sm:left-4 z-10 px-1.5 py-0.5 border border-ink bg-canvas rounded text-[6px] sm:text-[7px] font-bold text-ink shadow-[1px_1px_0px_rgba(0,0,0,0.15)]"
      >
        💬 Lunch?
      </motion.div>

      {/* Critical Boss Ping */}
      <motion.div
        animate={{ y: [-20, 32, 32, 85], opacity: [1, 1, 1, 0] }}
        transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
        className="absolute right-2 sm:right-4 z-10 px-1.5 py-0.5 border-2 border-ink bg-[#FFFBEB] rounded text-[6px] sm:text-[7px] font-black text-ink shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center gap-0.5"
      >
        <motion.span
          animate={{ color: ["#111", "#EF4444", "#111"] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        >
          🚨 Boss ping
        </motion.span>
      </motion.div>

      {/* Alert Indicator Bell */}
      <div className="absolute right-1 bottom-1 z-10">
        <motion.div
          animate={{ rotate: [-6, 6, -6], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 0.18 }}
          className="p-1 bg-[#F59E0B] border border-ink text-white rounded-md"
        >
          <BellRing className="size-3.5" />
        </motion.div>
      </div>
    </div>
  );
}

/* 
 * 3. Places Mapping Illustration: Locator pin walking into geofence circular perimeter, popping checklists.
 */
function PlacesMappingIllustration() {
  return (
    <div className="border-2 border-ink bg-[#FAF9F6] rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-2 w-[180px] sm:w-[210px] h-[82px] sm:h-[95px] relative overflow-hidden shrink-0">
      <div className="absolute left-[35%] top-0 bottom-0 w-1 bg-ink/10" />
      <div className="absolute top-[45%] left-0 right-0 h-1 bg-ink/10" />

      {/* Pulse Geofence perimeter */}
      <div className="absolute top-[28%] left-[45%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.5, 0.35] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="size-13 rounded-full border border-dashed border-[#8B5CF6] bg-[#8B5CF6]/10"
        />
        <Navigation className="size-3.5 text-[#8B5CF6] fill-[#8B5CF6] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Walking GPS Dot */}
      <motion.div
        animate={{
          x: [8, 55, 55, 55],
          y: [45, 45, 12, 12],
          scale: [1, 1, 1.25, 1]
        }}
        transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
        className="absolute size-3.5 rounded-full border border-ink bg-[#8B5CF6] shadow-[1px_1px_0px_rgba(0,0,0,0.15)] flex items-center justify-center text-[6px]"
      >
        📍
      </motion.div>

      {/* Popup reminder checklist */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 0, 1, 1, 0],
          scale: [0.8, 0.8, 1, 1, 0.8],
          x: [90, 90, 78, 78, 90]
        }}
        transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
        className="absolute right-1 top-1 p-1 border border-ink bg-white rounded shadow-[1px_1px_0px_rgba(0,0,0,1)] max-w-[70px]"
      >
        <div className="text-[6px] font-black leading-none text-[#8B5CF6] uppercase">Home</div>
        <div className="text-[5px] font-bold text-ink mt-0.5">✓ Keys</div>
      </motion.div>
    </div>
  );
}

/* 
 * 4. Pricing Tier Illustration: Free drops max visual slider beside glowing support star.
 */
function PricingTierIllustration() {
  return (
    <div className="flex gap-1.5 justify-center items-center w-[180px] sm:w-[210px] shrink-0">
      <div className="flex-1 border border-ink bg-white rounded-xl p-2 h-[82px] sm:h-[92px] flex flex-col justify-between shadow-[1px_1px_0px_rgba(0,0,0,1)] opacity-80">
        <div>
          <div className="text-[7px] font-black uppercase text-ink/60">Free</div>
          <div className="text-[9px] font-black mt-0.5 text-ink">3 active alarms</div>
        </div>
        <div className="w-full bg-ink/10 h-1.5 rounded-full overflow-hidden border border-ink/20">
          <div className="bg-[#EC4899] h-full w-[80%]" />
        </div>
      </div>

      <div className="flex-1 border-2 border-ink bg-[#FFFBEB] rounded-xl p-2 h-[82px] sm:h-[92px] flex flex-col justify-between shadow-[2px_2px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-1 right-1">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          >
            <Sparkles className="size-3.5 text-[#F59E0B]" />
          </motion.div>
        </div>
        <div>
          <div className="text-[7px] font-black uppercase text-[#EC4899]">Pro</div>
          <div className="text-[9px] font-black mt-0.5 text-ink">Unlimited</div>
        </div>
        <div className="flex items-center gap-0.5">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="text-[6px] font-black bg-[#EC4899] text-white px-1.5 py-0.5 rounded shadow-sm"
          >
            Unlock all
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* 
 * 5. FAQ Help Illustration: Brain circuit database linking green checks with safe signal.
 */
function FAQHelpIllustration() {
  return (
    <div className="border border-ink bg-white rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-2.5 w-[180px] sm:w-[210px] h-[82px] sm:h-[95px] flex items-center justify-between relative overflow-hidden shrink-0">
      <div className="flex flex-col items-center gap-0.5 z-10">
        <div className="p-1 bg-[#F0FDF4] border border-ink rounded shadow-[1px_1px_0px_rgba(0,0,0,1)]">
          <BrainCircuit className="size-5 text-ink" />
        </div>
        <span className="text-[6px] font-black uppercase text-ink/60">Local DB</span>
      </div>

      <div className="flex flex-col items-center justify-center relative z-10">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="p-1 bg-[#22C55E]/10 border border-[#22C55E] rounded-full text-[#22C55E]"
        >
          <ShieldCheck className="size-4.5" />
        </motion.div>
        <span className="text-[5px] font-black uppercase text-[#22C55E] mt-0.5">Secure</span>
      </div>

      {/* Sync ripple light signals */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-20 z-0">
        <motion.div
          animate={{ x: [-10, 110] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="size-1 bg-[#22C55E] rounded-full"
        />
      </div>
    </div>
  );
}

function ShowcaseDeckPage() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [viewMode, setViewMode] = useState<"deck" | "grid">("deck");
  
  // Track active hover zones
  const [hoverZone, setHoverZone] = useState<"center" | "left" | "right">("center");
  const scrollCooldown = useRef(false);
  const touchStartX = useRef(0);

  // Safely check if the view is on a mobile device to bypass desktop mouse offsets
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.hash === "#grid") {
        setViewMode("grid");
      } else {
        setViewMode("deck");
      }
    }
  }, []);

  const handleToggleView = (mode: "deck" | "grid") => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      window.location.hash = mode === "grid" ? "grid" : "";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (viewMode !== "deck" || aboutOpen || isMobile) return;
    const { clientX } = e;
    const width = window.innerWidth;
    
    // Normalized X from -0.5 (left side) to 0.5 (right side)
    const x = (clientX / width) - 0.5;

    if (x < -0.16) {
      setHoverZone("left");
    } else if (x > 0.16) {
      setHoverZone("right");
    } else {
      setHoverZone("center");
    }
  };

  const handleMouseLeave = () => {
    setHoverZone("center");
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== "deck" || aboutOpen) return;
    if (Math.abs(e.deltaY) < 15 && Math.abs(e.deltaX) < 15) return;

    if (scrollCooldown.current) return;
    scrollCooldown.current = true;

    if (e.deltaY > 0 || e.deltaX > 0) {
      setActiveIdx((prev) => (prev + 1) % DECK_CARDS.length);
    } else {
      setActiveIdx((prev) => (prev - 1 + DECK_CARDS.length) % DECK_CARDS.length);
    }

    setTimeout(() => {
      scrollCooldown.current = false;
    }, 850);
  };

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
    navigate({ to: card.to, search: { from: "deck" }, viewTransition: true });
  };

  const currentCard = DECK_CARDS[activeIdx];
  const nextCard = DECK_CARDS[(activeIdx + 1) % DECK_CARDS.length];
  const CardIcon = currentCard.illustrator;
  const NextIcon = nextCard.illustrator;

  const activeBgColor = viewMode === "deck" ? currentCard.bgColor : "#FFD043";
  const bgColorPrev = DECK_CARDS[(activeIdx - 1 + DECK_CARDS.length) % DECK_CARDS.length].bgColor;
  const bgColorNext = DECK_CARDS[(activeIdx + 1) % DECK_CARDS.length].bgColor;

  // Custom positioning offsets passed directly to Framer Motion animate parameters
  let activeX = 0;
  let activeRotate = -2;
  let behindX = 0;
  let behindRotate = 8;
  let behindScale = 0.95;

  let leftBubbleTransform = "translate(0px, -50%) scale(0.85)";
  let rightBubbleTransform = "translate(0px, -50%) scale(0.85)";

  // Enforce zero layout translation shifts on mobile viewports
  if (!isMobile) {
    if (hoverZone === "left") {
      // Mouse goes Left -> Active card slides LEFT (-230px), behind card slides RIGHT (230px) and flattens out (Match Screenshot 1)
      activeX = -230;
      activeRotate = -12;
      behindX = 230;
      behindRotate = 2;
      behindScale = 1;

      leftBubbleTransform = "translate(12vw, -50%) scale(1.35)";
      rightBubbleTransform = "translate(-3vw, -50%) scale(0.7)";
    } else if (hoverZone === "right") {
      // Mouse goes Right -> Active card slides RIGHT (230px), behind card remains at original place in stack (Match Screenshot 2)
      activeX = 230;
      activeRotate = 12;
      behindX = 0;
      behindRotate = 4;
      behindScale = 0.95;

      leftBubbleTransform = "translate(3vw, -50%) scale(0.7)";
      rightBubbleTransform = "translate(-12vw, -50%) scale(1.35)";
    }
  }

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const delta = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 50) {
          if (delta > 0) {
            handleNext();
          } else {
            handlePrev();
          }
        }
      }}
      style={{
        backgroundColor: activeBgColor,
        transition: "background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
      }}
      className="fixed inset-0 text-ink font-sans flex flex-col justify-between p-6 select-none overflow-hidden h-[100dvh] w-screen"
    >
      
      {/* Dynamic Background Circles */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0 hidden md:block"
        style={{
          backgroundColor: viewMode === "deck" ? bgColorPrev : "transparent",
          left: "-30vw",
          width: "65vw",
          height: "65vw",
          transform: leftBubbleTransform,
          transition: "background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)"
        }}
      />
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0 hidden md:block"
        style={{
          backgroundColor: viewMode === "deck" ? bgColorNext : "transparent",
          right: "-30vw",
          width: "65vw",
          height: "65vw",
          transform: rightBubbleTransform,
          transition: "background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)"
        }}
      />

      {/* 1. Header Corners */}
      <header className="flex justify-between items-center w-full z-30 shrink-0">
        <Link
          to="/terms"
          viewTransition
          style={{ viewTransitionName: 'card-terms' } as React.CSSProperties}
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 hover:border-[#FF671F]"
        >
          Terms
        </Link>
        
        <div className="flex items-center gap-2 select-none">
          <div className="size-8 relative grid place-items-center shrink-0">
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-[#FF671F]/30"
            />
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="size-6 rounded-lg bg-gradient-to-tr from-[#FF671F] to-[#FFA06E] shadow-md grid place-items-center relative border border-white/10"
            >
              <span className="text-white font-black text-xs font-sans">m</span>
            </motion.div>
          </div>
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline text-ink">MinDrop</span>
        </div>

        <Link
          to="/privacy"
          viewTransition
          style={{ viewTransitionName: 'card-privacy' } as React.CSSProperties}
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 hover:border-[#FF671F]"
        >
          Privacy
        </Link>
      </header>

      {/* 2. Main content area depending on mode (Centered block grid to enable smooth mobile overflows) */}
      <div 
        className={`flex-1 w-full my-2 no-scrollbar z-10 ${
          viewMode === "deck" 
            ? "flex items-center justify-center relative overflow-hidden" 
            : "block overflow-y-auto py-6"
        }`}
      >
        
        {viewMode === "deck" ? (
          /* DECK VIEW MODE */
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            
            {/* Desktop-only Next Card Trigger on the Left */}
            <div className="absolute left-4 lg:left-12 z-30 hidden md:flex">
              <button
                onClick={handleNext}
                className="flex flex-col items-start gap-1 group text-left cursor-pointer"
              >
                <span className="text-[10px] uppercase font-bold tracking-widest text-ink/40">Cycle Deck</span>
                <span className="text-xl md:text-2xl lg:text-3xl font-black text-ink border-b-3 border-ink group-hover:text-[#FF671F] group-hover:border-[#FF671F] transition-colors pb-0.5">
                  Next card
                </span>
              </button>
            </div>

            {/* 3D Stacked Cards Deck */}
            <div className="relative w-[92vw] sm:w-[390px] md:w-[460px] lg:w-[490px] h-[72vh] max-h-[540px] min-h-[420px] sm:h-[440px] md:h-[460px] lg:h-[480px] flex items-center justify-center z-10">
              <AnimatePresence mode="popLayout">
                {/* Behind stacked preview card */}
                <motion.div
                  key={`next-${nextCard.id}`}
                  initial={{ scale: 0.9, rotate: 6, x: 0, opacity: 0.8 }}
                  animate={{
                    scale: behindScale,
                    rotate: behindRotate,
                    x: behindX,
                    opacity: 0.95
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 16 }}
                  className="absolute inset-0 rounded-[2.5rem] border-3 border-ink p-5 sm:p-7 flex flex-col justify-between bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] pointer-events-none"
                >
                  <div className="shrink-0">
                    <span className="text-xs sm:text-sm uppercase font-bold tracking-wider text-ink/40">Next Card</span>
                    <h3 className="text-2xl sm:text-2xl lg:text-3xl font-black text-ink mt-2 sm:mt-4 leading-tight">{nextCard.title}</h3>
                  </div>

                  {/* Behind card illustration preview */}
                  <div className="flex-1 my-2 flex items-center justify-center min-h-0 w-full opacity-40 pointer-events-none scale-90 sm:scale-95">
                    {nextCard.id === "later" && <LaterAlarmIllustration />}
                    {nextCard.id === "notify" && <SmartFiltersIllustration />}
                    {nextCard.id === "places" && <PlacesMappingIllustration />}
                    {nextCard.id === "pricing" && <PricingTierIllustration />}
                    {nextCard.id === "faq" && <FAQHelpIllustration />}
                  </div>

                  <div className="flex justify-end pt-1 shrink-0">
                    <span className="inline-grid place-items-center size-10 sm:size-12 rounded-2xl bg-canvas border-2 border-ink">
                      <NextIcon className="size-5 sm:size-6 text-ink/40" />
                    </span>
                  </div>
                </motion.div>

                {/* Front Active Card */}
                <motion.div
                  key={`active-${currentCard.id}`}
                  initial={{ x: 250, rotate: -15, scale: 0.85, opacity: 0 }}
                  animate={{
                    x: activeX,
                    rotate: activeRotate,
                    scale: 1,
                    opacity: 1
                  }}
                  exit={{ x: -400, rotate: -18, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 16 }}
                  onClick={handleShowMe}
                  style={{ viewTransitionName: `card-${currentCard.id}` } as React.CSSProperties}
                  className={`absolute inset-0 rounded-[2.5rem] border-3 border-ink p-6 sm:p-7 md:p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:scale-[0.99] transition-transform duration-100 ${currentCard.bgClass}`}
                >
                  <div className="shrink-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm uppercase font-bold tracking-wider text-ink/70 bg-white/60 border border-ink/10 px-3.5 py-1 rounded-full">
                        {currentCard.tag}
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-ink mt-3 sm:mt-4 leading-tight tracking-tight">
                      {currentCard.title}
                    </h3>

                    <p className="text-base sm:text-base md:text-lg text-ink/85 font-semibold mt-2 sm:mt-3 leading-relaxed">
                      {currentCard.description}
                    </p>
                  </div>

                  {/* Centered Premium Live Illustration Component */}
                  <div className="flex-1 my-2 flex items-center justify-center min-h-0 w-full overflow-visible">
                    <div className="scale-110 sm:scale-100 transform-gpu origin-center flex items-center justify-center">
                      {currentCard.id === "later" && <LaterAlarmIllustration />}
                      {currentCard.id === "notify" && <SmartFiltersIllustration />}
                      {currentCard.id === "places" && <PlacesMappingIllustration />}
                      {currentCard.id === "pricing" && <PricingTierIllustration />}
                      {currentCard.id === "faq" && <FAQHelpIllustration />}
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-3 sm:pt-4 shrink-0">
                    <span className="text-xs sm:text-sm uppercase font-black text-ink/40 tracking-wider">MinDrop Brain</span>
                    <span className="inline-grid place-items-center size-11 sm:size-14 rounded-2xl bg-white border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <CardIcon className="size-6 sm:size-7 text-ink" />
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop-only Detailed View Trigger on the Right */}
            <div className="absolute right-4 lg:right-12 z-30 hidden md:flex">
              <button
                onClick={handleShowMe}
                className="flex flex-col items-end gap-1 group text-right cursor-pointer"
              >
                <span className="text-[10px] uppercase font-bold tracking-widest text-ink/40">Read specs</span>
                <span className="text-xl md:text-2xl lg:text-3xl font-black text-ink border-b-3 border-ink group-hover:text-[#FF671F] group-hover:border-[#FF671F] transition-colors pb-0.5">
                  Show me!
                </span>
              </button>
            </div>



          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto px-4 z-10">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 justify-center items-stretch"
            >
              {DECK_CARDS.map((card, idx) => {
                const Icon = card.illustrator;
                const colSpanClass = idx === 4 
                  ? "sm:col-span-2 lg:col-span-3" 
                  : idx === 3 
                    ? "lg:col-span-3" 
                    : "lg:col-span-2";
                return (
                  <Link
                    key={card.id}
                    to={card.to}
                    search={{ from: "grid" }}
                    viewTransition
                    style={{ viewTransitionName: `card-${card.id}` } as React.CSSProperties}
                    className={`rounded-[2.5rem] border-3 border-ink p-6 sm:p-8 flex flex-col justify-between min-h-[380px] sm:min-h-[410px] md:min-h-[430px] lg:min-h-[450px] h-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 cursor-pointer ${card.bgClass} ${colSpanClass}`}
                  >
                    <div className="flex flex-col justify-start gap-2 mb-4">
                      <span className="text-xs uppercase font-black text-ink/50 bg-white/40 border border-ink/10 px-2.5 py-0.5 rounded-full self-start">
                        {card.tag}
                      </span>
                      <h3 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl font-black text-ink mt-2 leading-tight tracking-tight">{card.title}</h3>
                      <p className="text-sm sm:text-sm md:text-base lg:text-[15px] text-ink/75 font-medium mt-1.5 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    {/* Centered Live Vector Illustration scaled to 88% */}
                    <div className="flex-1 my-3 flex items-center justify-center overflow-hidden w-full max-h-[110px] scale-[0.88] pointer-events-none">
                      {card.id === "later" && <LaterAlarmIllustration />}
                      {card.id === "notify" && <SmartFiltersIllustration />}
                      {card.id === "places" && <PlacesMappingIllustration />}
                      {card.id === "pricing" && <PricingTierIllustration />}
                      {card.id === "faq" && <FAQHelpIllustration />}
                    </div>
                    
                    <div className="flex justify-between items-end pt-2 shrink-0">
                      <span className="text-xs font-black uppercase text-ink/40 tracking-wider">Open card</span>
                      <span className="inline-grid place-items-center size-10 rounded-xl bg-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Icon className="size-5 text-ink" />
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
      <footer className="grid grid-cols-3 w-full items-center z-30 shrink-0">
        <div className="justify-self-start">
          <button
            onClick={() => setAboutOpen(true)}
            className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 cursor-pointer hover:border-[#FF671F]"
          >
            About
          </button>
        </div>

        {/* Dynamic Pill Switcher Grid/Deck Controls */}
        <div className="justify-self-center flex items-center bg-ink border-2 border-ink rounded-full p-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] gap-1">
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

        <div className="justify-self-end">
          <Link
            to="/download"
            className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5 hover:border-[#FF671F]"
          >
            Get App
          </Link>
        </div>
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
