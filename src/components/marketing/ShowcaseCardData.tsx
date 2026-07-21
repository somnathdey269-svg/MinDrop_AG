import { 
  AlarmClock, BellRing, Navigation, 
  Sparkles, BrainCircuit, ShieldCheck 
} from "lucide-react";
import { motion } from "framer-motion";

export interface ShowcaseCard {
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

export const DECK_CARDS: ShowcaseCard[] = [
  {
    id: "later",
    slug: "later-feature",
    title: "Looping Alarms",
    description: "Ordinary alerts are easy to ignore. MinDrop alarms ring continuously like a phone call until checked, surviving system restarts.",
    bgClass: "bg-[#E2F5EC] border-[#10B981]",
    bgColor: "#E2F5EC",
    tag: "Chapter 01/05",
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
    tag: "Chapter 02/05",
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
    tag: "Chapter 03/05",
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
    tag: "Chapter 04/05",
    illustrator: Sparkles,
    to: "/pricing"
  },
  {
    id: "faq",
    slug: "faq",
    title: "FAQ Help",
    description: "Get answers on local geofencing permissions and SQLite database. MinDrop runs fully serverless to keep your data private.",
    bgClass: "bg-[#E0F2FE] border-[#0284C7]",
    bgColor: "#E0F2FE",
    tag: "Chapter 05/05",
    illustrator: BrainCircuit,
    to: "/faq"
  }
];

// Unclustered, Borderless Organic Visual Hero Graphics
export function LaterAlarmIllustration() {
  return (
    <div className="w-full py-4 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        {/* Pulsing Sonar Ring */}
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-5 rounded-full bg-[#10B981]/25 border-2 border-[#10B981]/40"
        />
        {/* Central Floating Icon Badge */}
        <motion.div 
          animate={{ scale: [1, 1.06, 1], rotate: [0, -3, 3, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="size-20 rounded-3xl bg-white/95 border-2.5 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <AlarmClock className="size-10 text-[#10B981]" />
        </motion.div>
      </div>
      <span className="text-[11px] font-black uppercase tracking-wider text-ink/70 bg-white/80 border border-ink/20 px-3 py-1 rounded-full shadow-sm mt-3 relative z-10">
        🔔 Continuous Ringing
      </span>
    </div>
  );
}

export function SmartFiltersIllustration() {
  return (
    <div className="w-full py-4 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        {/* Pulsing Sonar Ring */}
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-5 rounded-full bg-[#F59E0B]/25 border-2 border-[#F59E0B]/40"
        />
        {/* Central Floating Icon Badge */}
        <motion.div 
          animate={{ scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="size-20 rounded-3xl bg-white/95 border-2.5 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <BellRing className="size-10 text-[#F59E0B]" />
        </motion.div>
      </div>
      <span className="text-[11px] font-black uppercase tracking-wider text-ink/70 bg-white/80 border border-ink/20 px-3 py-1 rounded-full shadow-sm mt-3 relative z-10">
        ✨ Keyword Match Filter
      </span>
    </div>
  );
}

export function PlacesMappingIllustration() {
  return (
    <div className="w-full py-4 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        {/* Pulsing Sonar Radar Ring */}
        <motion.div 
          animate={{ scale: [1, 1.45, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-6 rounded-full bg-[#8B5CF6]/25 border-2 border-dashed border-[#8B5CF6]/50"
        />
        {/* Central Floating Icon Badge */}
        <motion.div 
          animate={{ scale: [1, 1.06, 1], rotate: [0, -3, 3, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="size-20 rounded-3xl bg-white/95 border-2.5 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <Navigation className="size-10 text-[#8B5CF6] transform rotate-45" />
        </motion.div>
      </div>
      <span className="text-[11px] font-black uppercase tracking-wider text-ink/70 bg-white/80 border border-ink/20 px-3 py-1 rounded-full shadow-sm mt-3 relative z-10">
        📍 500m Geofence Boundary
      </span>
    </div>
  );
}

export function PricingTierIllustration() {
  return (
    <div className="w-full py-4 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        {/* Pulsing Sonar Ring */}
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-5 rounded-full bg-[#EC4899]/25 border-2 border-[#EC4899]/40"
        />
        {/* Central Floating Icon Badge */}
        <motion.div 
          animate={{ scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="size-20 rounded-3xl bg-white/95 border-2.5 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <Sparkles className="size-10 text-[#EC4899]" />
        </motion.div>
      </div>
      <span className="text-[11px] font-black uppercase tracking-wider text-ink/70 bg-white/80 border border-ink/20 px-3 py-1 rounded-full shadow-sm mt-3 relative z-10">
        💎 Free Plan • Lifetime Pro
      </span>
    </div>
  );
}

export function FAQHelpIllustration() {
  return (
    <div className="w-full py-4 flex flex-col items-center justify-center relative select-none">
      <div className="relative grid place-items-center">
        {/* Pulsing Sonar Ring */}
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 -m-5 rounded-full bg-[#0284C7]/25 border-2 border-[#0284C7]/40"
        />
        {/* Central Floating Icon Badge */}
        <motion.div 
          animate={{ scale: [1, 1.06, 1], rotate: [0, -3, 3, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="size-20 rounded-3xl bg-white/95 border-2.5 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center relative z-10"
        >
          <BrainCircuit className="size-10 text-[#0284C7]" />
        </motion.div>
      </div>
      <span className="text-[11px] font-black uppercase tracking-wider text-ink/70 bg-white/80 border border-ink/20 px-3 py-1 rounded-full shadow-sm mt-3 relative z-10">
        🔒 100% Offline SQLite
      </span>
    </div>
  );
}
