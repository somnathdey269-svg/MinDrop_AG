import { AlarmClock, BellRing, Navigation, Sparkles, BrainCircuit, Compass, ShieldCheck, HeartHandshake } from "lucide-react";
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
    tag: "Chapter 01/07",
    title: "Smart Notification",
    description: "Silence low-priority chatter. Create keyword rules that convert essential notification streams into actionable tasks.",
    to: "/notify-feature",
    bgColor: "#FEF3C7", // Soft Amber
    bgClass: "bg-[#FEF3C7]",
    illustrator: BellRing,
  },
  {
    id: "places",
    tag: "Chapter 02/07",
    title: "Location Reminder",
    description: "Drop pins where items or tasks are bound. MinDrop runs background sweeps and triggers reminders as you enter or leave radii.",
    to: "/places-feature",
    bgColor: "#F3E8FF", // Soft Lavender
    bgClass: "bg-[#F3E8FF]",
    illustrator: Navigation,
  },
  {
    id: "later",
    tag: "Chapter 03/07",
    title: "Looping Alarm",
    description: "Ordinary alerts are easy to ignore. MinDrop alarms ring continuously like a phone call until checked, surviving system restarts.",
    to: "/later-feature",
    bgColor: "#E0F2FE", // Soft Sky Blue
    bgClass: "bg-[#E0F2FE]",
    illustrator: AlarmClock,
  },
  {
    id: "future",
    tag: "Chapter 04/07",
    title: "Future Actions",
    description: "Person-based alerts, cross-app trigger bridges, and local voice drops. Features we are striving to bring natively to Android.",
    to: "/future-feature",
    bgColor: "#EFF6FF", // Soft Indigo
    bgClass: "bg-[#EFF6FF]",
    illustrator: Compass,
  },
  {
    id: "privacy-manifesto",
    tag: "Chapter 05/07",
    title: "Absolute Privacy",
    description: "Zero cloud telemetry, zero subscription traps, and zero ad tracking. Local SQLite persistence engineered for pure peace of mind.",
    to: "/privacy-feature",
    bgColor: "#F0FDF4", // Soft Mint
    bgClass: "bg-[#F0FDF4]",
    illustrator: ShieldCheck,
  },
  {
    id: "pricing",
    tag: "Chapter 06/07",
    title: "Simple Pricing",
    description: "Zero subscriptions or hidden tiers. Upgrade to Unlimited Pro for just Rs. 999 / year.",
    to: "/pricing",
    bgColor: "#FCE7F3", // Soft Rose
    bgClass: "bg-[#FCE7F3]",
    illustrator: Sparkles,
  },
  {
    id: "vision",
    tag: "Chapter 07/07",
    title: "The Closure",
    description: "Revolutionizing micro-tasks. Moving from ignored todo lists to an offline second brain that protects your mental bandwidth.",
    to: "/vision",
    bgColor: "#FFFBEB", // Soft Gold
    bgClass: "bg-[#FFFBEB]",
    illustrator: HeartHandshake,
  },
];

// Unclustered Organic Visual Hero Graphics
export function LaterAlarmIllustration() {
  return (
    <div className="w-full pt-3 pb-1 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-[clamp(0.5rem,0.9vw,0.95rem)] rounded-full bg-[#10B981]/25 border-2 border-[#10B981]/40 pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.04, 1], rotate: [0, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="size-[clamp(4.8rem,6.6vw,6.6rem)] rounded-3xl bg-white/95 border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <AlarmClock className="size-[clamp(2.5rem,3.5vw,3.4rem)] text-[#10B981]" />
        </motion.div>
      </div>
      <span className="text-[clamp(11px,0.95vw,14px)] font-black uppercase tracking-wider text-ink/80 bg-white/90 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm mt-3 relative z-10 whitespace-nowrap">
        🔔 Continuous Ringing
      </span>
    </div>
  );
}

export function SmartFiltersIllustration() {
  return (
    <div className="w-full pt-3 pb-1 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-[clamp(0.5rem,0.9vw,0.95rem)] rounded-full bg-[#F59E0B]/25 border-2 border-[#F59E0B]/40 pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.04, 1], rotate: [0, 2, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="size-[clamp(4.8rem,6.6vw,6.6rem)] rounded-3xl bg-white/95 border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <BellRing className="size-[clamp(2.5rem,3.5vw,3.4rem)] text-[#F59E0B]" />
        </motion.div>
      </div>
      <span className="text-[clamp(11px,0.95vw,14px)] font-black uppercase tracking-wider text-ink/80 bg-white/90 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm mt-3 relative z-10 whitespace-nowrap">
        ✨ Keyword Filter
      </span>
    </div>
  );
}

export function PlacesMappingIllustration() {
  return (
    <div className="w-full pt-3 pb-1 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-[clamp(0.5rem,0.9vw,0.95rem)] rounded-full bg-[#8B5CF6]/25 border-2 border-dashed border-[#8B5CF6]/50 pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.04, 1], rotate: [0, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="size-[clamp(4.8rem,6.6vw,6.6rem)] rounded-3xl bg-white/95 border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <Navigation className="size-[clamp(2.5rem,3.5vw,3.4rem)] text-[#8B5CF6] transform rotate-45" />
        </motion.div>
      </div>
      <span className="text-[clamp(11px,0.95vw,14px)] font-black uppercase tracking-wider text-ink/80 bg-white/90 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm mt-3 relative z-10 whitespace-nowrap">
        📍 500m Geofence
      </span>
    </div>
  );
}

export function FutureActionsIllustration() {
  return (
    <div className="w-full pt-3 pb-1 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-[clamp(0.5rem,0.9vw,0.95rem)] rounded-full bg-[#2563EB]/25 border-2 border-[#2563EB]/40 pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.04, 1], rotate: [0, 2, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="size-[clamp(4.8rem,6.6vw,6.6rem)] rounded-3xl bg-white/95 border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <Compass className="size-[clamp(2.5rem,3.5vw,3.4rem)] text-[#2563EB]" />
        </motion.div>
      </div>
      <span className="text-[clamp(11px,0.95vw,14px)] font-black uppercase tracking-wider text-ink/80 bg-white/90 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm mt-3 relative z-10 whitespace-nowrap">
        🔮 Coming Soon
      </span>
    </div>
  );
}

export function PrivacyManifestoIllustration() {
  return (
    <div className="w-full pt-3 pb-1 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-[clamp(0.5rem,0.9vw,0.95rem)] rounded-full bg-[#059669]/25 border-2 border-[#059669]/40 pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.04, 1], rotate: [0, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="size-[clamp(4.8rem,6.6vw,6.6rem)] rounded-3xl bg-white/95 border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <ShieldCheck className="size-[clamp(2.5rem,3.5vw,3.4rem)] text-[#059669]" />
        </motion.div>
      </div>
      <span className="text-[clamp(11px,0.95vw,14px)] font-black uppercase tracking-wider text-ink/80 bg-white/90 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm mt-3 relative z-10 whitespace-nowrap">
        🔒 100% Private
      </span>
    </div>
  );
}

export function PricingTierIllustration() {
  return (
    <div className="w-full pt-3 pb-1 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-[clamp(0.5rem,0.9vw,0.95rem)] rounded-full bg-[#EC4899]/25 border-2 border-[#EC4899]/40 pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.04, 1], rotate: [0, 2, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="size-[clamp(4.8rem,6.6vw,6.6rem)] rounded-3xl bg-white/95 border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <Sparkles className="size-[clamp(2.5rem,3.5vw,3.4rem)] text-[#EC4899]" />
        </motion.div>
      </div>
      <span className="text-[clamp(11px,0.95vw,14px)] font-black uppercase tracking-wider text-ink/80 bg-white/90 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm mt-3 relative z-10 whitespace-nowrap">
        💎 Free • Pro
      </span>
    </div>
  );
}

export function ClosureVisionIllustration() {
  return (
    <div className="w-full pt-3 pb-1 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-[clamp(0.5rem,0.9vw,0.95rem)] rounded-full bg-[#D97706]/25 border-2 border-[#D97706]/40 pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.04, 1], rotate: [0, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="size-[clamp(4.8rem,6.6vw,6.6rem)] rounded-3xl bg-white/95 border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <HeartHandshake className="size-[clamp(2.5rem,3.5vw,3.4rem)] text-[#D97706]" />
        </motion.div>
      </div>
      <span className="text-[clamp(11px,0.95vw,14px)] font-black uppercase tracking-wider text-ink/80 bg-white/90 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm mt-3 relative z-10 whitespace-nowrap">
        ✨ The Vision
      </span>
    </div>
  );
}

export function FAQHelpIllustration() {
  return (
    <div className="w-full pt-3 pb-1 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-[clamp(0.5rem,0.9vw,0.95rem)] rounded-full bg-[#0284C7]/25 border-2 border-[#0284C7]/40 pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.04, 1], rotate: [0, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="size-[clamp(4.8rem,6.6vw,6.6rem)] rounded-3xl bg-white/95 border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <BrainCircuit className="size-[clamp(2.5rem,3.5vw,3.4rem)] text-[#0284C7]" />
        </motion.div>
      </div>
      <span className="text-[clamp(11px,0.95vw,14px)] font-black uppercase tracking-wider text-ink/80 bg-white/90 border border-ink/20 px-3.5 py-1 rounded-full shadow-sm mt-3 relative z-10 whitespace-nowrap">
        🔒 Offline SQLite
      </span>
    </div>
  );
}
