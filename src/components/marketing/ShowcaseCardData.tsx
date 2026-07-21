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
    illustrator: BrainCircuit,
    to: "/faq"
  }
];

export function LaterAlarmIllustration() {
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

export function SmartFiltersIllustration() {
  return (
    <div className="border-2 border-ink bg-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-2 sm:p-3 w-[180px] sm:w-[210px] relative overflow-hidden h-[82px] sm:h-[95px] shrink-0">
      <div className="absolute top-[45%] left-0 right-0 border-t-2 border-dashed border-ink/20 z-0 flex justify-center">
        <span className="bg-white px-1 text-[6px] sm:text-[7px] font-black uppercase tracking-wider -translate-y-[5px] text-ink/60">Filters</span>
      </div>

      <motion.div
        animate={{ y: [-20, 85] }}
        transition={{ repeat: Infinity, duration: 3.2, ease: "linear" }}
        className="absolute left-2 sm:left-4 z-10 px-1.5 py-0.5 border border-ink bg-canvas rounded text-[6px] sm:text-[7px] font-bold text-ink shadow-[1px_1px_0px_rgba(0,0,0,0.15)]"
      >
        💬 Lunch?
      </motion.div>

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

export function PlacesMappingIllustration() {
  return (
    <div className="border-2 border-ink bg-[#FAF9F6] rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-2 w-[180px] sm:w-[210px] h-[82px] sm:h-[95px] relative overflow-hidden shrink-0">
      <div className="absolute left-[35%] top-0 bottom-0 w-1 bg-ink/10" />
      <div className="absolute top-[45%] left-0 right-0 h-1 bg-ink/10" />

      <div className="absolute top-[28%] left-[45%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.5, 0.35] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="size-13 rounded-full border border-dashed border-[#8B5CF6] bg-[#8B5CF6]/10"
        />
        <Navigation className="size-3.5 text-[#8B5CF6] fill-[#8B5CF6] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

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

export function PricingTierIllustration() {
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

export function FAQHelpIllustration() {
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
