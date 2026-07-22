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
 * Clean accent icon — centered, no border or background box.
 */
function AccentIcon({ color, Icon }: { color: string; Icon: ElementType }) {
  return (
    <div className="w-full h-full flex items-center justify-center select-none">
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, -1, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="w-full h-full flex items-center justify-center"
      >
        <Icon className="w-full h-full object-contain" style={{ color }} />
      </motion.div>
    </div>
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

/**
 * System Layout Tokens for Card Architecture.
 * Centralizes borders, rounded corners, offset box shadows, padding scales, and typography.
 */
export const CARD_TOKENS = {
  border: "border-3 lg:border-4 border-ink",
  radius: {
    deck: "rounded-[2.2rem] lg:rounded-[2.5rem]",
    grid: "rounded-[1.8rem]",
  },
  shadow: {
    deck: "shadow-[9px_9px_0px_0px_rgba(0,0,0,1)]",
    grid: "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
  },
  typography: {
    deck: {
      title: "font-black text-ink leading-tight tracking-tight text-[1.55em] lg:text-[1.7em]",
      description: "text-ink/85 font-normal leading-relaxed text-[1.02em] lg:text-[1.12em]",
    },
    grid: {
      title: "font-black text-ink leading-tight tracking-tight text-[1.35em]",
      description: "text-ink/80 font-normal leading-relaxed text-[0.85em]",
    },
  },
} as const;

export interface ShowcaseCardLayoutPrimitiveProps {
  mode?: "deck" | "grid";
  bgClass?: string;
  headerSlot: React.ReactNode;
  illustrationSlot: React.ReactNode;
  titleSlot: React.ReactNode;
  descriptionSlot: React.ReactNode;
  footerActionSlot?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Universal Two-Stage Adaptive Card Layout Primitive.
 * Stage 1: Responsive Card Sizing Context (Outer Boundary Math).
 * Stage 2: Dynamic Height Allocation & Auto-Adjusted Typography Scale (Zero Bottom Void).
 * Grid Mode: Fixed structural baselines for perfect horizontal alignment across grid rows.
 */
export function ShowcaseCardLayoutPrimitive({
  mode = "deck",
  bgClass = "bg-white",
  headerSlot,
  illustrationSlot,
  titleSlot,
  descriptionSlot,
  footerActionSlot,
  className = "",
  style,
  onClick,
}: ShowcaseCardLayoutPrimitiveProps) {
  const isDeck = mode === "deck";
  return (
    <div
      onClick={onClick}
      style={{
        containerType: 'inline-size',
        fontSize: isDeck ? 'clamp(1.05rem, 3.8cqi + 0.15rem, 1.7rem)' : 'clamp(0.85rem, 2.5cqi + 0.1rem, 1.12rem)',
        paddingTop: isDeck ? '3.5%' : '1.25rem',
        paddingBottom: isDeck ? '3.5%' : '1.25rem',
        paddingLeft: isDeck ? '6.5%' : '1.25rem',
        paddingRight: isDeck ? '6.5%' : '1.25rem',
        ...style,
      }}
      className={`relative w-full h-full flex flex-col justify-between select-none ${
        isDeck ? CARD_TOKENS.radius.deck : CARD_TOKENS.radius.grid
      } ${CARD_TOKENS.border} ${
        isDeck ? CARD_TOKENS.shadow.deck : CARD_TOKENS.shadow.grid
      } ${bgClass} ${className}`}
    >
      {/* 1. Header Slot */}
      <div className={`shrink-0 flex items-center w-full ${isDeck ? 'min-h-[1.8em] text-[0.75em]' : 'h-7 text-[0.75em]'}`}>
        {headerSlot}
      </div>

      {/* 2. Illustration Zone */}
      <div className={`shrink-0 w-full flex items-center justify-center ${isDeck ? 'flex-1 min-h-0 py-2' : 'h-20 my-2'}`}>
        <div className={`h-full aspect-square flex items-center justify-center ${isDeck ? 'max-h-[min(38%,8.5em)]' : 'max-h-full'}`}>
          {illustrationSlot}
        </div>
      </div>

      {/* 3. Content Zone (Aligned Baselines in Grid Mode) */}
      <div className={`shrink-0 w-full flex flex-col ${isDeck ? 'gap-2.5 mt-auto' : 'flex-1 justify-between gap-1.5'}`}>
        {/* Title Slot (Fixed 3rem baseline container in Grid Mode) */}
        <div className={`w-full flex items-start ${isDeck ? '' : 'h-12'}`}>
          {titleSlot}
        </div>
        {/* Description Slot (Aligned top starting line in Grid Mode) */}
        <div className={`w-full flex flex-col justify-start overflow-hidden ${isDeck ? '' : 'flex-1'}`}>
          {descriptionSlot}
        </div>
        {footerActionSlot && (
          <div className="w-full mt-1">
            {footerActionSlot}
          </div>
        )}
      </div>
    </div>
  );
}
