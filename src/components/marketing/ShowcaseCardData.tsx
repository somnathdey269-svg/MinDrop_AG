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

// Shared Vector Illustrations
export function LaterAlarmIllustration() {
  return (
    <div className="size-48 xs:size-52 bg-white rounded-2xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col items-center justify-center relative overflow-hidden select-none">
      <div className="absolute top-2 left-3 flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-[#FF671F] animate-ping" />
        <span className="text-[10px] uppercase font-black tracking-wider text-ink/40">Loop Active</span>
      </div>
      <div className="relative my-2">
        <motion.div 
          animate={{ scale: [1, 1.15, 1], rotate: [0, -4, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="size-16 rounded-full bg-[#E2F5EC] border-2 border-ink grid place-items-center shadow-sm"
        >
          <AlarmClock className="size-9 text-[#10B981]" />
        </motion.div>
      </div>
      <span className="text-xs font-black text-ink uppercase tracking-wider mt-1">Alarm Ringing</span>
      <div className="flex gap-2 mt-3 w-full">
        <button className="flex-1 py-1.5 bg-[#10B981] text-white font-black text-[10px] uppercase rounded-lg border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Dismiss
        </button>
        <button className="flex-1 py-1.5 bg-white text-ink font-black text-[10px] uppercase rounded-lg border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Snooze
        </button>
      </div>
    </div>
  );
}

export function SmartFiltersIllustration() {
  return (
    <div className="size-48 xs:size-52 bg-white rounded-2xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3.5 flex flex-col justify-between select-none">
      <div className="flex items-center justify-between border-b-2 border-ink/10 pb-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-ink/40">Keyword Filter</span>
        <span className="text-[9px] font-black uppercase text-[#F59E0B] bg-[#FFFBEB] px-2 py-0.5 rounded-full border border-[#F59E0B]/30">
          Match: "URGENT"
        </span>
      </div>
      <div className="space-y-1.5 my-1">
        <div className="bg-canvas border border-ink/20 p-2 rounded-lg flex items-center justify-between opacity-40">
          <span className="text-[10px] font-bold text-ink">Lunch tomorrow?</span>
          <span className="text-[9px] text-ink/40 font-mono">Ignored</span>
        </div>
        <div className="bg-[#FFFBEB] border-2 border-ink p-2 rounded-lg flex items-center justify-between shadow-sm">
          <span className="text-[10px] font-black text-ink">URGENT: Server Down!</span>
          <span className="text-[9px] font-black text-[#F59E0B] uppercase">Ringing</span>
        </div>
      </div>
      <div className="pt-1 border-t border-ink/10 flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-ink/60">
        <span>Slack / SMS</span>
        <BellRing className="size-3 text-[#F59E0B]" />
      </div>
    </div>
  );
}

export function PlacesMappingIllustration() {
  return (
    <div className="size-48 xs:size-52 bg-white rounded-2xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 flex flex-col justify-between select-none relative overflow-hidden">
      {/* Map grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] opacity-10" />
      <div className="relative z-10 flex items-center justify-between border-b-2 border-ink/10 pb-1.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-ink/40">Passive Geofence</span>
        <span className="text-[9px] font-black text-[#8B5CF6]">500m Radius</span>
      </div>
      
      <div className="relative z-10 my-auto grid place-items-center">
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 -m-4 rounded-full bg-[#8B5CF6]/20 border-2 border-dashed border-[#8B5CF6]"
          />
          <div className="size-10 rounded-full bg-[#F5F3FF] border-2 border-ink grid place-items-center shadow-sm relative z-10">
            <Navigation className="size-5 text-[#8B5CF6] transform rotate-45" />
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-1 border-t border-ink/10 flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-ink">
        <span>Arrive @ Office</span>
        <span className="text-[#8B5CF6]">Triggered</span>
      </div>
    </div>
  );
}

export function PricingTierIllustration() {
  return (
    <div className="size-48 xs:size-52 bg-white rounded-2xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3.5 flex flex-col justify-between select-none">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-ink/40">Pricing</span>
        <span className="text-[9px] font-black uppercase bg-[#EC4899] text-white px-2 py-0.5 rounded-full">
          One Plan
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 my-1">
        <div className="bg-canvas border border-ink/20 p-2 rounded-xl flex flex-col justify-between h-20">
          <span className="text-[9px] font-bold text-ink/60 uppercase">Free</span>
          <span className="text-[11px] font-black text-ink">3 Active Alarms</span>
          <div className="w-full h-1 bg-ink/10 rounded-full overflow-hidden">
            <div className="w-full h-full bg-[#EC4899]" />
          </div>
        </div>
        <div className="bg-[#FDF2F7] border-2 border-ink p-2 rounded-xl flex flex-col justify-between h-20 shadow-sm relative">
          <Sparkles className="size-3 text-[#EC4899] absolute top-1.5 right-1.5" />
          <span className="text-[9px] font-black text-[#EC4899] uppercase">Pro</span>
          <span className="text-[11px] font-black text-ink">Unlimited</span>
          <span className="text-[8px] font-black uppercase text-white bg-[#EC4899] text-center py-0.5 rounded">
            Unlock All
          </span>
        </div>
      </div>
      <div className="text-[9px] text-center font-bold text-ink/50 uppercase tracking-wider">
        No subscription trap
      </div>
    </div>
  );
}

export function FAQHelpIllustration() {
  return (
    <div className="size-48 xs:size-52 bg-white rounded-2xl border-3 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3.5 flex flex-col justify-between select-none">
      <div className="flex items-center justify-between border-b-2 border-ink/10 pb-1.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-ink/40">Privacy First</span>
        <ShieldCheck className="size-4 text-[#0284C7]" />
      </div>
      
      <div className="my-1 space-y-2">
        <div className="bg-[#E0F2FE] border-2 border-ink p-2 rounded-xl flex items-center justify-between">
          <span className="text-[10px] font-black text-ink">Local SQLite DB</span>
          <span className="text-[9px] font-black text-[#0284C7] bg-white px-2 py-0.5 rounded border border-ink/20">100% Offline</span>
        </div>
        <div className="bg-canvas border border-ink/20 p-2 rounded-xl flex items-center justify-between opacity-80">
          <span className="text-[10px] font-bold text-ink">Zero Cloud Syncing</span>
          <span className="text-[9px] font-bold text-ink/50">Private</span>
        </div>
      </div>

      <div className="text-[9px] text-center font-black text-ink/60 uppercase tracking-wider">
        Your data stays on device
      </div>
    </div>
  );
}
