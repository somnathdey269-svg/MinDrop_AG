import { createFileRoute, Link } from "@tanstack/react-router";
import { MinDropHeaderLogo } from "@/components/marketing/MinDropHeaderLogo";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPublicSettings } from "@/lib/platformSettings.functions";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check, Shield, FolderOpen, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const SITE = "https://getmindrop.lovable.app";
const LAST_UPDATED = "November 2025";

const settingsQuery = () => ({
  queryKey: ["public-settings"] as const,
  queryFn: () => getPublicSettings(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/privacy")({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery()),
  head: () => ({
    meta: [
      { title: "Privacy Policy — MinDrop" },
      { name: "description", content: "How MinDrop collects, uses, stores, and shares personal data. DPDP Act, 2023 compliant." },
      { property: "og:title", content: "Privacy Policy — MinDrop" },
      { property: "og:description", content: "How MinDrop collects, uses, stores, and shares personal data." },
      { property: "og:url", content: SITE + "/privacy" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: SITE + "/privacy" }],
  }),
  component: Privacy,
});

/* ──────────────────────────────────────────────
   SUBTLE STEP ILLUSTRATIONS
────────────────────────────────────────────── */
function ShieldIllustration() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ y: [-12, 12, -12], rotate: [-4, 4, -4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="size-24 sm:size-28 md:size-32 bg-slate-200 border-3 border-slate-700 rounded-[2rem] grid place-items-center shadow-lg text-slate-700"
      >
        <Shield className="size-14 sm:size-16 stroke-[2px]" />
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SLIDES
══════════════════════════════════════════════ */

/* Slide 1: Core Philosophy */
function SlideOpening() {
  return (
    <div className="w-full h-full bg-[#F1F5F9] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 text-left">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-200 px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-slate-650 mb-6 sm:mb-8">
            🛡️ Privacy Promise
          </motion.span>

          <div className="flex flex-col gap-3 sm:gap-4 mb-6">
            {[
              "We do not track your clicks.",
              "We do not read your notes.",
              "Your data is yours alone.",
            ].map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.45 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-500/50 leading-tight tracking-tight">
                {line}
              </motion.p>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.65 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-800 leading-none tracking-tighter">
            Zero servers. Zero trackers.
          </motion.p>
        </div>

        <div className="shrink-0">
          <ShieldIllustration />
        </div>
      </div>
    </div>
  );
}

/* Slide 2: Plain English Summary */
function SlideSummary() {
  return (
    <div className="w-full h-full bg-[#E2E8F0] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-6 sm:gap-8 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-500 mb-2 sm:mb-3">
            layman terms
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 leading-tight tracking-tight">
            Our privacy rules, explained simply.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[
            { icon: Shield, title: "100% On-Device", body: "All your tasks, voice clips, geofence coordinates, and schedules are stored locally inside a private database on your phone. Nothing leaves." },
            { icon: FolderOpen, title: "Your Drive Sync", body: "When you back up your tasks, they go straight to your own personal Google Drive storage space. We do not host any of your backups." },
            { icon: AlertCircle, title: "No Hidden Trackers", body: "No Google Analytics, Facebook SDKs, or background telemetry profiles. We don't analyze how you use the app." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white border-3 border-slate-700 rounded-[2rem] p-6 sm:p-8 shadow-[5px_5px_0px_0px_rgba(30,41,59,0.15)] text-left flex flex-col gap-3">
              <Icon className="size-8 text-slate-600 shrink-0" />
              <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-800">{title}</h3>
              <p className="text-sm sm:text-sm md:text-base font-semibold text-slate-600/80 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Full Legal Document Viewer (Verbatim content from original compliance page) */
interface SlideLegalDocProps {
  officer: string;
  officerEmail: string;
  address: string;
}
function SlideLegalDoc({ officer, officerEmail, address }: SlideLegalDocProps) {
  return (
    <div className="w-full h-full bg-[#F1F5F9] overflow-y-auto py-16 px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-6 max-w-4xl">
        <div className="text-center">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-500">
            For compliance
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 mt-1">
            Official Privacy Policy
          </h2>
        </div>

        <div className="w-full border-3 border-slate-800 bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(30,41,59,0.15)] text-left">
          <div className="space-y-6 text-sm sm:text-sm md:text-base font-semibold text-slate-700 leading-relaxed">
            <p className="font-bold text-slate-900 border-b-2 border-dashed border-slate-200 pb-4">
              This Privacy Policy describes how MinDrop ("MinDrop", "we", "us", "our") collects, uses, discloses, retains, and protects personal data when you use the MinDrop mobile application. DPDP Act, 2023 Compliant. Last updated: {LAST_UPDATED}.
            </p>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">1. Scope</h3>
              <p className="font-medium text-slate-600">This Policy applies strictly to the MinDrop application. MinDrop acts as a data fiduciary on-device. It does not apply to any third-party services you choose to connect (like Google Drive), which are governed by their respective owners.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">2. Personal Data We Collect</h3>
              <ul className="list-disc pl-5 space-y-2 mt-2 font-medium text-slate-600">
                <li><strong>Account data:</strong> Name, email address, avatar (from your sign-in provider or supplied by you).</li>
                <li><strong>User content:</strong> Memories, notes, tags, reminders, notification rules, saved places, and any other content you submit.</li>
                <li><strong>Device & technical data:</strong> Device identifier, operating system, app version, timezone, language, push notification token (FCM).</li>
                <li><strong>Usage data:</strong> Feature interactions, session information, crash reports, diagnostic logs.</li>
                <li><strong>Payment data:</strong> We do not collect or store your card, UPI, or bank account details. We store only the transaction identifier, amount, currency, and status.</li>
                <li><strong>Location data:</strong> If and only if you grant permission, we process approximate device location strictly to trigger place-based reminders. Location data is not shared with third parties for advertising.</li>
                <li><strong>Communications:</strong> When you email us for support, we retain the correspondence for the period necessary to resolve your query.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">3. Purposes of Processing</h3>
              <p className="font-medium text-slate-600">We process your personal data to: (a) provide, operate, maintain, and secure the Service; (b) authenticate you and prevent unauthorised access; (c) deliver notifications and reminders you have configured; (d) process payments and manage your Premium plan; (e) back up your data and enable optional Google Drive backup; (f) detect, investigate, and prevent fraud, abuse, and violations of our Terms; (g) provide customer support; (h) improve the Service, including product analytics and crash diagnostics; (i) comply with applicable law; and (j) enforce our legal rights.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">4. Legal Basis</h3>
              <p className="font-medium text-slate-600">We process your personal data on the basis of your consent (obtained at the time of account creation and at each relevant permission prompt) and on the basis of legitimate uses permitted under the DPDP Act, including the performance of contract, compliance with law, and reasonable purposes such as fraud prevention and information security.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">5. How We Share Your Data</h3>
              <p className="font-medium text-slate-600">We do not sell your personal data. We share personal data only with Cashfree Payments (for processing payments), Google (Sign-in and Drive backup), Firebase Cloud Messaging (to deliver push notifications), and edge hosting providers.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">6. International Transfers</h3>
              <p className="font-medium text-slate-600">Our processors may store and process personal data outside India in jurisdictions permitted under the DPDP Act. By using the Service, you consent to such cross-border transfer where necessary to provide the Service.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">7. Retention</h3>
              <p className="font-medium text-slate-600">We retain personal data for as long as your account is active and for a further period of up to three (3) years thereafter for legal, audit, tax, dispute-resolution, and enforcement purposes.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">8. Security</h3>
              <p className="font-medium text-slate-600">We employ commercially reasonable technical, administrative, and organisational safeguards, including encryption in transit (TLS), row-level access controls, secret management, and least-privilege access.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">9. Your Rights</h3>
              <p className="font-medium text-slate-600">Subject to applicable law, you have the right to: (a) access the personal data we hold about you; (b) request correction of inaccurate data; (c) request erasure of your personal data; (d) withdraw consent; and (e) nominate another person to exercise your rights in the event of death.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">10. Children</h3>
              <p className="font-medium text-slate-600">The Service is not directed at persons under the age of eighteen (18). We do not knowingly collect personal data from children without verifiable parental consent.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">11. Cookies & Local Storage</h3>
              <p className="font-medium text-slate-600">We use cookies, local storage, and similar technologies to keep you signed in, remember your preferences, and gather anonymous usage statistics.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">12. Third-Party Links</h3>
              <p className="font-medium text-slate-600">The Service may contain links to third-party websites. We are not responsible for their privacy practices.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">13. Changes to this Policy</h3>
              <p className="font-medium text-slate-600">We may amend this Policy from time to time. The revised Policy will be effective when posted at this URL.</p>
            </div>

            <div className="border-t border-dashed border-slate-200 pt-4">
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide text-base">14. Grievance Officer</h3>
              <ul className="mt-2 space-y-1 font-medium text-slate-600">
                <li><strong>Name:</strong> {officer}</li>
                <li>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${supportEmail}`} className="underline font-black text-slate-800">{supportEmail}</a>
                </li>
                <li><strong>Address:</strong> {jur}</li>
              </ul>
              <p className="text-xs text-slate-400 mt-2 font-bold">Complaints acknowledged within 48 hours and resolved within 15 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN — Full-Page Fade Scroll Controller
══════════════════════════════════════════════ */
function Privacy() {
  const { data: s } = useSuspenseQuery(settingsQuery());
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  currentRef.current = current;

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isWheelActive = useRef(false);
  const wheelDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    <SlideOpening />,
    <SlideSummary />,
    <SlideLegalDoc company={s.grievanceOfficerName} jur={s.companyAddress} supportEmail={s.grievanceOfficerEmail} />,
  ];
  const TOTAL = slides.length;

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= TOTAL) return;
    setCurrent(idx);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      const activeIdx = currentRef.current;
      if (activeIdx === 2) {
        const scrollContainer = el.querySelector(".overflow-y-auto");
        if (scrollContainer) {
          const scrollTop = scrollContainer.scrollTop;
          if (e.deltaY < 0 && scrollTop <= 0) {
            e.preventDefault();
            goTo(activeIdx - 1);
          }
          return;
        }
      }

      e.preventDefault();
      if (Math.abs(e.deltaY) < 10 && Math.abs(e.deltaX) < 10) return;

      if (!isWheelActive.current) {
        isWheelActive.current = true;
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (delta > 0) goTo(activeIdx + 1);
        else if (delta < 0) goTo(activeIdx - 1);
      }

      if (wheelDebounceTimer.current) clearTimeout(wheelDebounceTimer.current);
      wheelDebounceTimer.current = setTimeout(() => {
        isWheelActive.current = false;
      }, 250);
    };

    const keyHandler = (e: KeyboardEvent) => {
      const activeIdx = currentRef.current;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); goTo(activeIdx + 1); }
      if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); goTo(activeIdx - 1); }
    };

    el.addEventListener("wheel", handler, { passive: false });
    window.addEventListener("keydown", keyHandler);
    return () => {
      el.removeEventListener("wheel", handler);
      window.removeEventListener("keydown", keyHandler);
      if (wheelDebounceTimer.current) clearTimeout(wheelDebounceTimer.current);
    };
  }, []);

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden"
      style={{ viewTransitionName: "card-privacy" } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <header className="shrink-0 border-b-2 border-slate-300/40 z-50 bg-[#F1F5F9]/95 backdrop-blur-[12px]">
        <div className="w-[95%] max-w-7xl mx-auto h-14 flex items-center justify-between gap-2 px-2 sm:px-4">
          <Link to="/" viewTransition
            className="flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition text-slate-500 hover:text-slate-900">
            <X className="size-3.5"/> Close
          </Link>
          <MinDropHeaderLogo className="text-lg sm:text-2xl shrink-0" />
          <Link to="/download"
            className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 sm:px-4 py-1.5 rounded-full border-2 bg-ink text-white border-ink hover:bg-slate-700 hover:border-slate-700 shrink-0 leading-none whitespace-nowrap shadow-sm transition">
            Get App
          </Link>
        </div>
      </header>

      {/* ── Slide Stage ── */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onTouchStart={(e) => {
          if (current === 2) {
            touchStartY.current = e.touches[0].clientY;
            return;
          }
          touchStartY.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          if (current === 2) {
            const scrollContainer = (e.currentTarget as HTMLElement).querySelector(".overflow-y-auto");
            if (scrollContainer) {
              const scrollTop = scrollContainer.scrollTop;
              const delta = touchStartY.current - e.changedTouches[0].clientY;
              if (delta < -50 && scrollTop <= 0) {
                goTo(current - 1);
              }
            }
            return;
          }
          const delta = touchStartY.current - e.changedTouches[0].clientY;
          if (Math.abs(delta) > 50) {
            if (delta > 0) goTo(current + 1);
            else goTo(current - 1);
          }
        }}
      >
        {/* ── Top hint (Scroll Up) ── */}
        {current > 0 && (
          <button
            onClick={() => goTo(current - 1)}
            className="absolute top-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-0.5 z-20 cursor-pointer group text-slate-400 hover:text-slate-800"
          >
            <ChevronDown className="size-3.5 rotate-180 transition group-hover:-translate-y-0.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              scroll or ↑
            </span>
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {slides[current]}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom hint (Scroll Down) ── */}
        {current < TOTAL - 1 && (
          <button
            onClick={() => goTo(current + 1)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-0.5 z-20 cursor-pointer group text-slate-400 hover:text-slate-800"
          >
            <span className="text-[9px] font-black uppercase tracking-widest">
              scroll or ↓
            </span>
            <ChevronDown className="size-3.5 transition group-hover:translate-y-0.5" />
          </button>
        )}

        {/* ── Right Dot Navigation ── */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-30">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "w-1.5 h-7 bg-slate-600"
                  : "size-1.5 bg-slate-400/25 hover:bg-slate-400/50"
              }`}
            />
          ))}
          <p className="text-[9px] font-black mt-1 tabular-nums text-slate-400">
            {current + 1}/{TOTAL}
          </p>
        </div>
      </div>
    </div>
  );
}
