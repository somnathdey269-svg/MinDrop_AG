import { AlarmClock, BellRing, Navigation, Sparkles, Compass, ShieldCheck, HeartHandshake, BookOpen } from "lucide-react";
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
    id: "about",
    tag: "INDEX",
    title: "About the App",
    description: "Built for immediate micro-actions. An offline second brain that captures urgent thoughts and protects your mental bandwidth.",
    to: "/about",
    bgColor: "#F8FAFC",
    bgClass: "bg-[#F8FAFC]",
    illustrator: BookOpen,
  },
  {
    id: "notify",
    tag: "Chapter 01/05",
    title: "Smart Notification",
    description: "Silence low-priority chatter. Create keyword rules that convert essential notification streams into actionable tasks.",
    to: "/notify-feature",
    bgColor: "#FEF3C7",
    bgClass: "bg-[#FEF3C7]",
    illustrator: BellRing,
  },
  {
    id: "places",
    tag: "Chapter 02/05",
    title: "Location Reminder",
    description: "Drop pins where items or tasks are bound. MinDrop runs background sweeps and triggers reminders as you enter or leave radii.",
    to: "/places-feature",
    bgColor: "#F3E8FF",
    bgClass: "bg-[#F3E8FF]",
    illustrator: Navigation,
  },
  {
    id: "later",
    tag: "Chapter 03/05",
    title: "Looping Alarm",
    description: "Ordinary alerts are easy to ignore. MinDrop alarms ring continuously like a phone call until checked, surviving system restarts.",
    to: "/later-feature",
    bgColor: "#E0F2FE",
    bgClass: "bg-[#E0F2FE]",
    illustrator: AlarmClock,
  },
  {
    id: "future",
    tag: "Chapter 04/05",
    title: "Future Actions",
    description: "Person-based alerts, cross-app trigger bridges, and local voice drops. Features we are striving to bring natively to Android.",
    to: "/future-feature",
    bgColor: "#EFF6FF",
    bgClass: "bg-[#EFF6FF]",
    illustrator: Compass,
  },
  {
    id: "privacy-manifesto",
    tag: "Chapter 05/05",
    title: "Absolute Privacy",
    description: "Zero cloud telemetry, zero subscription traps, and zero ad tracking. Local SQLite persistence engineered for pure peace of mind.",
    to: "/privacy-feature",
    bgColor: "#F0FDF4",
    bgClass: "bg-[#F0FDF4]",
    illustrator: ShieldCheck,
  },
  {
    id: "vision",
    tag: "THE CLOSURE",
    title: "The Closure",
    description: "Revolutionizing micro-tasks. Moving from ignored todo lists to an offline second brain that protects your mental bandwidth.",
    to: "/vision",
    bgColor: "#FFFBEB",
    bgClass: "bg-[#FFFBEB]",
    illustrator: HeartHandshake,
  },
  {
    id: "pricing",
    tag: "PRICING",
    title: "Simple Pricing",
    description: "Zero subscriptions or hidden tiers. Upgrade to Unlimited Pro for just Rs. 999 / year.",
    to: "/pricing",
    bgColor: "#FCE7F3",
    bgClass: "bg-[#FCE7F3]",
    illustrator: Sparkles,
  },
];

// Subtle icon accent — small, centred, no dominant label
function SubtleIllustration({ 
  color, 
  Icon, 
  animateRotate = false 
}: { 
  color: string; 
  Icon: React.ElementType; 
  animateRotate?: boolean;
}) {
  return (
    <div className="flex items-center justify-center select-none">
      <div className="relative grid place-items-center">
        {/* Soft glow ring — very subtle */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.05, 0.2] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 -m-2 sm:-m-3 lg:-m-4 rounded-full pointer-events-none"
          style={{ backgroundColor: `${color}30`, border: `1.5px solid ${color}40` }}
        />
        {/* Icon box — clean, light shadow */}
        <motion.div
          animate={{ scale: [1, 1.03, 1], rotate: animateRotate ? [0, -1.5, 1.5, 0] : [0, -1, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="size-20 sm:size-24 lg:size-28 xl:size-32 2xl:size-36 rounded-[1.5rem] lg:rounded-[1.8rem] bg-white/90 border-2 border-ink/80 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)] grid place-items-center relative z-10"
        >
          <Icon
            className="size-10 sm:size-12 lg:size-14 xl:size-16 2xl:size-18"
            style={{ color }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export function AboutAppIllustration() {
  return <SubtleIllustration color="#6366F1" Icon={BookOpen} />;
}

export function LaterAlarmIllustration() {
  return <SubtleIllustration color="#10B981" Icon={AlarmClock} />;
}

export function SmartFiltersIllustration() {
  return <SubtleIllustration color="#F59E0B" Icon={BellRing} animateRotate />;
}

export function PlacesMappingIllustration() {
  return <SubtleIllustration color="#8B5CF6" Icon={Navigation} />;
}

export function FutureActionsIllustration() {
  return <SubtleIllustration color="#2563EB" Icon={Compass} animateRotate />;
}

export function PrivacyManifestoIllustration() {
  return <SubtleIllustration color="#059669" Icon={ShieldCheck} />;
}

export function PricingTierIllustration() {
  return <SubtleIllustration color="#EC4899" Icon={Sparkles} animateRotate />;
}

export function ClosureVisionIllustration() {
  return <SubtleIllustration color="#D97706" Icon={HeartHandshake} />;
}
