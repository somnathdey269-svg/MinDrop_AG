import { AlarmClock, BellRing, Navigation, Sparkles, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

export interface DeckCardItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  to: string;
  bgColor: string;
  bgClass: string;
  illustrator: any;
}

export const DECK_CARDS: DeckCardItem[] = [
  {
    id: "notify",
    tag: "Chapter 01/05",
    title: "Smart Filters",
    description: "Silence low-priority chatter. Create keyword rules that convert essential notification streams into actionable tasks.",
    to: "/notify-feature",
    bgColor: "#FEF3C7", // Soft Amber
    bgClass: "bg-[#FEF3C7]",
    illustrator: BellRing,
  },
  {
    id: "places",
    tag: "Chapter 02/05",
    title: "Places & Sweeps",
    description: "Drop pins where items or tasks are bound. MinDrop runs background sweeps and triggers reminders as you enter or leave radii.",
    to: "/places-feature",
    bgColor: "#F3E8FF", // Soft Lavender
    bgClass: "bg-[#F3E8FF]",
    illustrator: Navigation,
  },
  {
    id: "later",
    tag: "Chapter 03/05",
    title: "Looping Alarms",
    description: "Ordinary alerts are easy to ignore. MinDrop alarms ring continuously like a phone call until checked, surviving system restarts.",
    to: "/later-feature",
    bgColor: "#E0F2FE", // Soft Sky Blue
    bgClass: "bg-[#E0F2FE]",
    illustrator: AlarmClock,
  },
  {
    id: "pricing",
    tag: "Chapter 04/05",
    title: "Simple Pricing",
    description: "Zero subscriptions or hidden tiers. Start free forever or upgrade to Unlimited Pro for just Rs. 999 / year.",
    to: "/pricing",
    bgColor: "#FCE7F3", // Soft Rose
    bgClass: "bg-[#FCE7F3]",
    illustrator: Sparkles,
  },
  {
    id: "faq",
    tag: "Chapter 05/05",
    title: "Offline Second Brain",
    description: "Everything runs locally on your device with SQLite. Zero cloud syncing required, ensuring ultimate privacy and offline reliability.",
    to: "/faq",
    bgColor: "#E0F2FE", // Soft Ocean
    bgClass: "bg-[#E0F2FE]",
    illustrator: BrainCircuit,
  },
];

// Unclustered, Borderless Organic Visual Hero Graphics with 1.25x Scaled Badge
export function LaterAlarmIllustration() {
  return (
    <div className="w-full py-1 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        {/* Pulsing Sonar Ring */}
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-[clamp(0.6rem,1.1vw,1.15rem)] rounded-full bg-[#10B981]/25 border-2 border-[#10B981]/40 pointer-events-none"
        />
        {/* Central Floating Icon Badge */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="size-[clamp(5.2rem,7.2vw,7.2rem)] rounded-3xl bg-white/95 border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <AlarmClock className="size-[clamp(2.7rem,3.8vw,3.7rem)] text-[#10B981]" />
        </motion.div>
      </div>
      <span className="text-[clamp(12px,1vw,15px)] font-black uppercase tracking-wider text-ink/80 bg-white/90 border border-ink/20 px-4 py-1.5 rounded-full shadow-sm mt-3 relative z-10">
        🔔 Continuous Ringing
      </span>
    </div>
  );
}

export function SmartFiltersIllustration() {
  return (
    <div className="w-full py-1 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        {/* Pulsing Sonar Ring */}
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-[clamp(0.6rem,1.1vw,1.15rem)] rounded-full bg-[#F59E0B]/25 border-2 border-[#F59E0B]/40 pointer-events-none"
        />
        {/* Central Floating Icon Badge */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="size-[clamp(5.2rem,7.2vw,7.2rem)] rounded-3xl bg-white/95 border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <BellRing className="size-[clamp(2.7rem,3.8vw,3.7rem)] text-[#F59E0B]" />
        </motion.div>
      </div>
      <span className="text-[clamp(12px,1vw,15px)] font-black uppercase tracking-wider text-ink/80 bg-white/90 border border-ink/20 px-4 py-1.5 rounded-full shadow-sm mt-3 relative z-10">
        ✨ Keyword Match Filter
      </span>
    </div>
  );
}

export function PlacesMappingIllustration() {
  return (
    <div className="w-full py-1 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        {/* Pulsing Sonar Radar Ring */}
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-[clamp(0.6rem,1.1vw,1.15rem)] rounded-full bg-[#8B5CF6]/25 border-2 border-dashed border-[#8B5CF6]/50 pointer-events-none"
        />
        {/* Central Floating Icon Badge */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="size-[clamp(5.2rem,7.2vw,7.2rem)] rounded-3xl bg-white/95 border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <Navigation className="size-[clamp(2.7rem,3.8vw,3.7rem)] text-[#8B5CF6] transform rotate-45" />
        </motion.div>
      </div>
      <span className="text-[clamp(12px,1vw,15px)] font-black uppercase tracking-wider text-ink/80 bg-white/90 border border-ink/20 px-4 py-1.5 rounded-full shadow-sm mt-3 relative z-10">
        📍 500m Geofence Boundary
      </span>
    </div>
  );
}

export function PricingTierIllustration() {
  return (
    <div className="w-full py-1 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        {/* Pulsing Sonar Ring */}
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-[clamp(0.6rem,1.1vw,1.15rem)] rounded-full bg-[#EC4899]/25 border-2 border-[#EC4899]/40 pointer-events-none"
        />
        {/* Central Floating Icon Badge */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="size-[clamp(5.2rem,7.2vw,7.2rem)] rounded-3xl bg-white/95 border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <Sparkles className="size-[clamp(2.7rem,3.8vw,3.7rem)] text-[#EC4899]" />
        </motion.div>
      </div>
      <span className="text-[clamp(12px,1vw,15px)] font-black uppercase tracking-wider text-ink/80 bg-white/90 border border-ink/20 px-4 py-1.5 rounded-full shadow-sm mt-3 relative z-10">
        💎 Free Tier • Yearly Pro
      </span>
    </div>
  );
}

export function FAQHelpIllustration() {
  return (
    <div className="w-full py-1 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        {/* Pulsing Sonar Ring */}
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-[clamp(0.6rem,1.1vw,1.15rem)] rounded-full bg-[#0284C7]/25 border-2 border-[#0284C7]/40 pointer-events-none"
        />
        {/* Central Floating Icon Badge */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="size-[clamp(5.2rem,7.2vw,7.2rem)] rounded-3xl bg-white/95 border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <BrainCircuit className="size-[clamp(2.7rem,3.8vw,3.7rem)] text-[#0284C7]" />
        </motion.div>
      </div>
      <span className="text-[clamp(12px,1vw,15px)] font-black uppercase tracking-wider text-ink/80 bg-white/90 border border-ink/20 px-4 py-1.5 rounded-full shadow-sm mt-3 relative z-10">
        🔒 100% Offline SQLite
      </span>
    </div>
  );
}
