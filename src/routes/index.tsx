import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { 
  Smartphone, Download, AlarmClock, BellRing, Navigation, 
  ShieldAlert, Sparkles, BrainCircuit, ChevronDown, Check, X, 
  ShieldCheck, HelpCircle, Activity, Heart, Home, ArrowLeft, ArrowUpRight
} from "lucide-react";
import { useState, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MinDrop — The Quiet Second Memory" },
      { name: "description", content: "A high-performance offline second brain for the immediate, tiny details your memory shouldn't have to carry. Loop alarms, smart notification filters, and geofenced triggers." },
      { property: "og:title", content: "MinDrop — The Quiet Second Memory" },
      { property: "og:description", content: "A high-performance offline second brain for immediate, tiny details. Loop alarms, smart filters, and geofencing." },
      { property: "og:url", content: "https://www.mindrop.in/" },
    ],
  }),
  component: LandingPage,
});

interface FeatureCardData {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  colorClass: string;
  accentColor: string;
  tag: string;
  summary: string;
  details: string[];
}

const FEATURES: FeatureCardData[] = [
  {
    id: "later",
    title: "Later Module",
    subtitle: "Persistent loop alarms for task captures.",
    icon: AlarmClock,
    colorClass: "bg-[#E2F5EC] border-[#10B981]",
    accentColor: "#10B981",
    tag: "⏰ Alarms",
    summary: "Rings continuously like a phone call until you actively acknowledge it. Built for tasks you absolutely cannot ignore.",
    details: [
      "🎤 Voice notes: Dictate a thought and trigger it as an alarm.",
      "📸 Image clips: Snapshot a parking spot or a physical prescription.",
      "🔄 Reboot resilience: Reschedules alarms automatically when the phone restarts.",
      "💤 Flexible snooze intervals: Quick mute for 5m, 15m, or custom durations."
    ]
  },
  {
    id: "notify",
    title: "Notify Module",
    subtitle: "Filter messy pings into critical loop alarms.",
    icon: BellRing,
    colorClass: "bg-[#FFFBEB] border-[#F59E0B]",
    accentColor: "#F59E0B",
    tag: "🔔 Smart Filters",
    summary: "Mutes social media clutter while converting critical transaction codes or system warnings into immediate alarms.",
    details: [
      "📝 Regex rules: Filter text from apps like WhatsApp, Slack, or banking apps.",
      "🔇 DND Override: Sounds alarms even when the device is set to silent or Do Not Disturb.",
      "💰 UPI confirmers: Set rules to trigger alarms for specific incoming transaction receipts.",
      "🔒 Private parser: Reads notifications locally without sending anything to the cloud."
    ]
  },
  {
    id: "places",
    title: "Places Module",
    subtitle: "Geofence-triggered drops and reminders.",
    icon: Navigation,
    colorClass: "bg-[#F5F3FF] border-[#8B5CF6]",
    accentColor: "#8B5CF6",
    tag: "📍 Location",
    summary: "Register geographic coordinates and trigger active looping alarms the moment you cross the boundary.",
    details: [
      "🔋 Zero-drain API: Uses system cell tower hooks rather than constant active GPS.",
      "⭕ Radius boundaries: Configure custom trigger radiuses from 50m to 1km.",
      "🛒 Smart locations: Automatically triggers medicine checklists when near a pharmacy.",
      "🗺️ Full offline mapping: Stored coordinates remain local inside your SQLite database."
    ]
  },
  {
    id: "recall",
    title: "Recall Engine",
    subtitle: "Train your brain using cognitive tests.",
    icon: BrainCircuit,
    colorClass: "bg-[#FDF2F2] border-[#EF5350]",
    accentColor: "#EF5350",
    tag: "🧠 Memory Quiz",
    summary: "Provides pattern-match challenge alerts to reinforce your memory and check if you recall your drops.",
    details: [
      "🎮 Active quiz prompts: Interactive question popups about your recent drops.",
      "📊 Spaced repetition: Automates quiz intervals to improve cognitive retention.",
      "🎯 Focus challenges: Simple pattern match validations to verify recall accuracy."
    ]
  },
  {
    id: "summary",
    title: "Load Summaries",
    subtitle: "Visual reviews of your cognitive load.",
    icon: Sparkles,
    colorClass: "bg-[#FDF2F7] border-[#EC4899]",
    accentColor: "#EC4899",
    tag: "📈 Analytics",
    summary: "Provides structural charts showing you exactly when your mind is carrying the most baggage.",
    details: [
      "📉 Clutter duration trackers: Graphing tools mapping active drops over time.",
      "📅 Weekly performance reports: Summaries of completed items versus snoozes.",
      "📁 Drop archives: Local search and query panel to check past entries."
    ]
  },
  {
    id: "privacy",
    title: "Privacy Guard",
    subtitle: "100% offline, absolute ownership.",
    icon: ShieldCheck,
    colorClass: "bg-[#F0FDF4] border-[#22C55E]",
    accentColor: "#22C55E",
    tag: "🔒 Privacy",
    summary: "Your data stays on your device. Period. No telemetry, no backend trackers.",
    details: [
      "💽 SQLite Local Storage: All text and media is kept locally inside the app sandbox.",
      "☁️ Zero-knowledge backups: Premium backups sync directly to your private Google Drive.",
      "📵 Zero server connections: Runs fully offline without any sign-up requirements."
    ]
  },
  {
    id: "future",
    title: "Future Bridges",
    subtitle: "Connect and make other apps smart.",
    icon: Smartphone,
    colorClass: "bg-[#EFF6FF] border-[#3B82F6] border-dashed",
    accentColor: "#3B82F6",
    tag: "🚀 Coming Soon",
    summary: "Making other apps and devices smart by bridging external triggers to MinDrop's loop alarms.",
    details: [
      "❤️ Vital overrides: Link fitness bands to trigger alarms on abnormal heart rates.",
      "🏡 Home breach alerts: Sound location-based DND overrides if garage is open after 10 PM.",
      "🔌 Cable disconnect: Alert alarms when specific chargers or desks disconnect.",
      "🤖 Webhook bridge: Open API endpoint to trigger drops from other development scripts."
    ]
  }
];

function LandingPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Custom cursor hover coordinates for 3D perspective effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 35, y: y * 35 });
  };

  const selectedFeature = FEATURES.find(f => f.id === selectedId);

  return (
    <MarketingLayout>
      {/* 1. Hero Section (Physics/Visual playground) */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
        className="relative overflow-hidden bg-canvas py-16 md:py-24 border-b-3 border-ink transition-all duration-300"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-[520px] rounded-full bg-[#FF671F]/5 blur-[80px]" />
        
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16 grid gap-12 lg:grid-cols-12 items-center relative">
          <div className="lg:col-span-7 text-left">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="size-2.5 rounded-full bg-[#FF671F] animate-ping" /> The Web Can Do What!?
            </span>
            
            <h1 className="mt-6 text-5xl sm:text-6xl md:text-7xl font-black leading-[1] text-ink tracking-tight">
              A kind <br />
              <span className="text-[#FF671F] underline decoration-3 decoration-ink">second brain</span> <br />
              for minor details.
            </h1>

            <p className="mt-6 text-ink/80 text-base md:text-lg leading-relaxed max-w-xl font-medium">
              MinDrop is a offline second memory built to hold the small details your brain shouldn't have to carry. Capture key locations, filter push notifications locally, or set looping time alerts.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/download"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl border-3 border-ink bg-[#FF671F] text-white px-7 py-4.5 hover:bg-[#ff7b3a] transition font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
              >
                <Download className="size-4.5" />
                <span>Download Android APK</span>
              </Link>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl border-3 border-ink bg-[#f1ede4]/60 text-ink/30 px-7 py-4.5 cursor-not-allowed select-none text-sm font-bold"
              >
                <Smartphone className="size-4.5" />
                <span>Play Store — Coming Soon</span>
              </a>
            </div>
            <p className="mt-4 text-ink/50 text-xs font-semibold">Free Tier · SQLite On-Device Storage · Fully Offline</p>
          </div>

          {/* Interactive Floating 3D Shapes */}
          <div className="lg:col-span-5 flex justify-center relative h-[380px] lg:h-[480px]">
            <motion.div
              style={{
                perspective: 1000,
              }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Central Capsule Shape */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  y: [0, -10, 0]
                }}
                transition={{
                  rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{
                  x: mousePos.x * 0.4,
                  y: mousePos.y * 0.4,
                }}
                className="w-44 h-24 rounded-full border-3 border-ink bg-[#FFBB25] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] absolute z-20 flex items-center justify-center"
              >
                <span className="text-ink font-black text-3xl tracking-wider select-none">M</span>
              </motion.div>

              {/* Green Shape */}
              <motion.div
                animate={{
                  y: [0, 15, 0],
                  rotateZ: [0, 45, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  x: mousePos.x * -0.6 - 120,
                  y: mousePos.y * -0.6 - 80,
                }}
                className="size-24 rounded-3xl border-3 border-ink bg-[#1fb254] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] absolute z-10"
              />

              {/* Blue Shape */}
              <motion.div
                animate={{
                  x: [0, 10, 0],
                  y: [0, -15, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  x: mousePos.x * 0.8 + 110,
                  y: mousePos.y * 0.8 + 90,
                }}
                className="w-28 h-28 rounded-full border-3 border-ink bg-[#007CF3] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] absolute z-10"
              />

              {/* Red Shape */}
              <motion.div
                animate={{
                  rotateZ: [0, -90, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  x: mousePos.x * -0.3 + 90,
                  y: mousePos.y * -0.3 - 100,
                }}
                className="w-20 h-20 border-3 border-ink bg-[#EA3323] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] absolute z-10 rounded-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Visual Card Gallery Grid */}
      <section className="py-20 bg-canvas border-b-3 border-ink">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Interactive Gallery
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-ink">Explore the Capabilities</h2>
            <p className="mt-2 text-ink/70 font-semibold text-sm">Click on any card to slide open technical details & comparisons.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  layoutId={`card-${feature.id}`}
                  onClick={() => setSelectedId(feature.id)}
                  whileHover={{ 
                    scale: 1.02,
                    rotate: -1,
                    y: -5
                  }}
                  className={`cursor-pointer p-6 rounded-[2rem] border-3 border-ink shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${feature.colorClass} flex flex-col justify-between h-[300px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="inline-grid place-items-center size-12 rounded-2xl bg-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Icon className="size-5.5 text-ink" />
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-ink/60 border border-ink/10 px-2 py-0.5 rounded-full bg-white/40">
                        {feature.tag}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-black text-ink mt-6">{feature.title}</h3>
                    <p className="text-xs text-ink/75 font-semibold mt-2.5 leading-relaxed">{feature.subtitle}</p>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-ink hover:underline pt-4">
                    <span>Expand Details</span>
                    <ArrowUpRight className="size-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Detailed Competitor Comparison Grid */}
      <section className="py-20 bg-[#f9f7f2] border-b-3 border-ink">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Comparison
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-ink">Why not use a standard checklist?</h2>
            <p className="mt-2 text-ink/75 font-semibold text-sm">Compare how MinDrop handles the details compared to standard apps.</p>
          </div>

          <div className="overflow-x-auto border-3 border-ink rounded-[2rem] bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b-3 border-ink bg-canvas">
                  <th className="p-5 font-bold text-xs uppercase text-ink/50 tracking-wider">Capabilities</th>
                  <th className="p-5 font-bold text-xs uppercase text-[#FF671F] tracking-wider bg-[#FF671F]/5">MinDrop Second Brain</th>
                  <th className="p-5 font-bold text-xs uppercase text-ink/50 tracking-wider">Standard Checklists (Todoist)</th>
                  <th className="p-5 font-bold text-xs uppercase text-ink/50 tracking-wider">Calendar Apps (Google Cal)</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/8 font-medium">
                <tr>
                  <td className="p-5 font-bold text-sm text-ink">Looping Alarm Alerts</td>
                  <td className="p-5 text-emerald-600 bg-[#FF671F]/5"><Check className="size-5 stroke-[3px]" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5 stroke-[2.5px]" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5 stroke-[2.5px]" /></td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-sm text-ink">Notification Rule Filters</td>
                  <td className="p-5 text-emerald-600 bg-[#FF671F]/5"><Check className="size-5 stroke-[3px]" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5 stroke-[2.5px]" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5 stroke-[2.5px]" /></td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-sm text-ink">Zero-Drain Geofencing</td>
                  <td className="p-5 text-emerald-600 bg-[#FF671F]/5"><Check className="size-5 stroke-[3px]" /></td>
                  <td className="p-5 text-ink/30"><Check className="size-5 stroke-[3px]" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5 stroke-[2.5px]" /></td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-sm text-ink">100% Offline SQLite database</td>
                  <td className="p-5 text-emerald-600 bg-[#FF671F]/5"><Check className="size-5 stroke-[3px]" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5 stroke-[2.5px]" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5 stroke-[2.5px]" /></td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-sm text-ink">Reboot alarm resilience</td>
                  <td className="p-5 text-emerald-600 bg-[#FF671F]/5"><Check className="size-5 stroke-[3px]" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5 stroke-[2.5px]" /></td>
                  <td className="p-5 text-ink/30"><X className="size-5 stroke-[2.5px]" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Pricing and Downloads CTA Banner */}
      <section className="py-20 bg-canvas border-b-3 border-ink text-center">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="max-w-2xl mx-auto rounded-[2.5rem] border-3 border-ink p-8 md:p-12 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#FF671F] text-white text-[9px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-bl-2xl border-l-2 border-b-2 border-ink">
              Installer
            </div>
            
            <h2 className="text-3xl font-black text-ink">Ready to start dropping?</h2>
            <p className="mt-3 text-ink/75 font-semibold max-w-sm mx-auto text-sm leading-relaxed">
              Start offline with up to 5 active loops on the Free plan, or upgrade inside the app anytime.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/download" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink text-canvas px-6 py-3.5 hover:opacity-90 font-bold transition text-xs uppercase tracking-wider">
                Get free APK
              </Link>
              <Link to="/pricing" className="inline-flex items-center justify-center gap-2 rounded-2xl border-3 border-ink text-ink px-6 py-3.5 hover:bg-ink/[0.02] font-bold transition text-xs uppercase tracking-wider">
                See Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Expanding Card Detail Modal Backdrop */}
      <AnimatePresence>
        {selectedId && selectedFeature && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-ink z-40"
            />

            {/* Expanded Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                layoutId={`card-${selectedId}`}
                className={`w-full max-w-xl rounded-[2.5rem] border-3 border-ink p-7 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between max-h-[85vh] overflow-y-auto ${selectedFeature.colorClass}`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="inline-grid place-items-center size-14 rounded-2xl bg-white border-3 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      {(() => {
                        const Icon = selectedFeature.icon;
                        return <Icon className="size-6.5 text-ink" />;
                      })()}
                    </span>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="cursor-pointer size-10 rounded-full border-3 border-ink bg-white grid place-items-center hover:bg-ink/5 active:scale-95 transition"
                      aria-label="Close details"
                    >
                      <X className="size-5 text-ink" />
                    </button>
                  </div>

                  <h3 className="text-3xl font-black text-ink mt-8">{selectedFeature.title}</h3>
                  <p className="text-sm font-semibold text-ink/75 mt-3">{selectedFeature.subtitle}</p>
                  
                  <div className="border-t-3 border-dashed border-ink/15 my-6 pt-5">
                    <p className="text-sm font-semibold text-ink leading-relaxed">
                      {selectedFeature.summary}
                    </p>
                    
                    <h4 className="text-xs uppercase font-bold tracking-wider text-ink/50 mt-6 mb-3">Key Features:</h4>
                    <ul className="space-y-2.5">
                      {selectedFeature.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs md:text-sm font-semibold text-ink/80 leading-relaxed">
                          <Check className="size-4 text-ink shrink-0 mt-0.5" style={{ color: selectedFeature.accentColor }} />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 flex gap-3 border-t-3 border-ink/8">
                  <Link
                    to="/download"
                    onClick={() => setSelectedId(null)}
                    className="flex-1 text-center py-3 rounded-2xl bg-ink text-canvas hover:opacity-90 font-bold transition text-xs uppercase tracking-wider"
                  >
                    Install App
                  </Link>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="cursor-pointer flex-1 text-center py-3 rounded-2xl border-3 border-ink bg-white hover:bg-ink/[0.02] text-ink font-bold transition text-xs uppercase tracking-wider"
                  >
                    Back to Gallery
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </MarketingLayout>
  );
}
