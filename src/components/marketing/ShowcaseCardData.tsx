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
    bgColor: "#E0F2FE",
    bgClass: "bg-[#E0F2FE]",
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

export interface DeckCardItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  tagSizePx?: string;
  titleSizePx?: string;
  descSizePx?: string;
  gridTagSizePx?: string;
  gridTitleSizePx?: string;
  gridDescSizePx?: string;
  deckTagSizePx?: string;
  deckTitleSizePx?: string;
  deckDescSizePx?: string;
  to: string;
  bgColor: string;
  bgClass: string;
  illustrator: ElementType;
}

export function getDeckCards(fields: Record<string, string> = {}): DeckCardItem[] {
  return DECK_CARDS.map((card) => {
    const key = card.id === "privacy-manifesto" ? "privacy" : card.id;
    const gridTag = fields[`card_${key}_grid_tag_size`] || fields[`card_${key}_tag_size`] || "";
    const gridTitle = fields[`card_${key}_grid_title_size`] || fields[`card_${key}_title_size`] || "";
    const gridDesc = fields[`card_${key}_grid_desc_size`] || fields[`card_${key}_desc_size`] || "";

    const deckTag = fields[`card_${key}_deck_tag_size`] || fields[`card_${key}_tag_size`] || "";
    const deckTitle = fields[`card_${key}_deck_title_size`] || fields[`card_${key}_title_size`] || "";
    const deckDesc = fields[`card_${key}_deck_desc_size`] || fields[`card_${key}_desc_size`] || "";

    return {
      ...card,
      tag: fields[`card_${key}_tag`] || card.tag,
      title: fields[`card_${key}_title`] || card.title,
      description: fields[`card_${key}_description`] || card.description,
      tagSizePx: fields[`card_${key}_tag_size`] || "",
      titleSizePx: fields[`card_${key}_title_size`] || "",
      descSizePx: fields[`card_${key}_desc_size`] || "",
      gridTagSizePx: gridTag,
      gridTitleSizePx: gridTitle,
      gridDescSizePx: gridDesc,
      deckTagSizePx: deckTag,
      deckTitleSizePx: deckTitle,
      deckDescSizePx: deckDesc,
    };
  });
}

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
      title: "font-black text-ink leading-tight tracking-tight text-[1.25em]",
      description: "text-ink/80 font-normal leading-relaxed text-[0.88em]",
    },
  },
} as const;

export interface ShowcaseCardLayoutPrimitiveProps {
  mode?: "deck" | "grid" | "mobile-grid";
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
 * Mobile-Grid Mode: Dynamic fluid height with Deck-level typography scale.
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
  const isMobileGrid = mode === "mobile-grid";
  const isFluid = isDeck || isMobileGrid;

  return (
    <div
      onClick={onClick}
      style={{
        containerType: 'inline-size',
        fontSize: isFluid ? 'clamp(1.05rem, 3.8cqi + 0.15rem, 1.7rem)' : 'clamp(0.82rem, 2.2cqi + 0.1rem, 1.05rem)',
        paddingTop: isMobileGrid ? '1.25rem' : '2.5%',
        paddingBottom: isMobileGrid ? '1.25rem' : '2.5%',
        paddingLeft: isMobileGrid ? '1.5rem' : '5.5%',
        paddingRight: isMobileGrid ? '1.5rem' : '5.5%',
        ...style,
      }}
      className={`relative w-full ${isMobileGrid || style?.height === 'auto' ? 'h-auto' : 'h-full'} flex flex-col select-none ${
        isFluid ? CARD_TOKENS.radius.deck : CARD_TOKENS.radius.grid
      } ${CARD_TOKENS.border} ${
        isFluid ? CARD_TOKENS.shadow.deck : CARD_TOKENS.shadow.grid
      } ${bgClass} ${className}`}
    >
      {/* 1. Header Slot (15% Height for Pill Badge Tag) */}
      <div className={`shrink-0 flex items-center w-full ${style?.height === 'auto' ? 'min-h-[1.6em]' : 'h-[15%]'}`}>
        {headerSlot}
      </div>

      {/* 5% Space Gap 1 */}
      <div className={`w-full ${style?.height === 'auto' ? 'h-1' : 'h-[5%] shrink-0'}`} />

      {/* 2. Illustration Zone (20% Height for Accent Icon) */}
      <div className={`shrink-0 w-full flex items-center justify-center ${
        style?.height === 'auto' ? (isMobileGrid ? 'h-20 my-1' : 'h-14 my-1') : 'h-[20%]'
      }`}>
        <div className="h-full aspect-square flex items-center justify-center max-h-full">
          {illustrationSlot}
        </div>
      </div>

      {/* 5% Space Gap 2 */}
      <div className={`w-full ${style?.height === 'auto' ? 'h-1' : 'h-[5%] shrink-0'}`} />

      {/* 3. Content Zone (50% Height for Title, 10% Gap, Description) */}
      <div className={`w-full flex flex-col ${
        style?.height === 'auto' ? 'gap-1' : 'h-[50%] shrink-0 justify-start'
      }`}>
        {/* Title / Header Slot (20% of Content Zone = 10% Total Card Height) */}
        <div className={`w-full flex items-start ${style?.height === 'auto' ? 'h-auto' : 'h-[20%] shrink-0'}`}>
          {titleSlot}
        </div>
        {/* 10% Space Gap 3 (between Title and Description) */}
        <div className={`w-full ${style?.height === 'auto' ? 'h-1' : 'h-[10%] shrink-0'}`} />
        {/* Description Slot (70% of Content Zone = 35% Total Card Height) */}
        <div className={`w-full flex flex-col justify-start ${style?.height === 'auto' ? 'h-auto' : 'h-[70%] shrink-0'}`}>
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
