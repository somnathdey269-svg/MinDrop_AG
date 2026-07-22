import { ElementType } from "react";
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
  illustrator: ElementType;
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

/**
 * Width-proportional accent icon — fills its parent container completely.
 * Parent card controls size via: <div className="w-[22%] aspect-square">
 * This makes icon automatically scale with card width on any screen.
 */
function AccentIcon({ color, Icon }: { color: string; Icon: ElementType }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.04, 1], rotate: [0, -1, 1, 0] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      className="w-full h-full rounded-2xl bg-white/90 border-2 border-ink/70 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] grid place-items-center select-none overflow-hidden"
    >
      <Icon className="w-[55%] h-[55%]" style={{ color }} />
    </motion.div>
  );
}

export function AboutAppIllustration() {
  return <AccentIcon color="#6366F1" Icon={BookOpen} />;
}
export function LaterAlarmIllustration() {
  return <AccentIcon color="#10B981" Icon={AlarmClock} />;
}
export function SmartFiltersIllustration() {
  return <AccentIcon color="#F59E0B" Icon={BellRing} />;
}
export function PlacesMappingIllustration() {
  return <AccentIcon color="#8B5CF6" Icon={Navigation} />;
}
export function FutureActionsIllustration() {
  return <AccentIcon color="#2563EB" Icon={Compass} />;
}
export function PrivacyManifestoIllustration() {
  return <AccentIcon color="#059669" Icon={ShieldCheck} />;
}
export function PricingTierIllustration() {
  return <AccentIcon color="#EC4899" Icon={Sparkles} />;
}
export function ClosureVisionIllustration() {
  return <AccentIcon color="#D97706" Icon={HeartHandshake} />;
}
