import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPublicSettings } from "@/lib/platformSettings.functions";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check, Scale, BookOpen, AlertTriangle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const SITE = "https://getmindrop.lovable.app";
const LAST_UPDATED = "November 2025";

const settingsQuery = () => ({
  queryKey: ["public-settings"] as const,
  queryFn: () => getPublicSettings(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/terms")({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery()),
  head: () => ({
    meta: [
      { title: "Terms & Conditions — MinDrop" },
      { name: "description", content: "Terms and Conditions governing use of MinDrop." },
      { property: "og:title", content: "Terms & Conditions — MinDrop" },
      { property: "og:description", content: "Terms and Conditions governing use of MinDrop." },
      { property: "og:url", content: SITE + "/terms" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: SITE + "/terms" }],
  }),
  component: Terms,
});

/* ──────────────────────────────────────────────
   SUBTLE STEP ILLUSTRATIONS
────────────────────────────────────────────── */
function TermsIllustration() {
  return (
    <div className="relative size-32 sm:size-40 md:size-48 flex items-center justify-center">
      <motion.div
        animate={{ y: [-12, 12, -12], rotate: [-4, 4, -4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="size-24 sm:size-28 md:size-32 bg-slate-200 border-3 border-slate-700 rounded-[2rem] grid place-items-center shadow-lg text-slate-700"
      >
        <Scale className="size-14 sm:size-16 stroke-[2px]" />
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SLIDES
══════════════════════════════════════════════ */

/* Slide 1: Core Terms Hero */
function SlideOpening() {
  return (
    <div className="h-full bg-[#F8FAFC] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 text-left">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-200 px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-slate-650 mb-6 sm:mb-8">
            📜 Terms of Service
          </motion.span>

          <div className="flex flex-col gap-3 sm:gap-4 mb-6">
            {[
              "Clear legal terms.",
              "Simple user responsibilities.",
              "Transparent service policies.",
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
            Simple rules, no tricks.
          </motion.p>
        </div>

        <div className="shrink-0">
          <TermsIllustration />
        </div>
      </div>
    </div>
  );
}

/* Slide 2: Plain English Summary */
function SlideSummary() {
  return (
    <div className="h-full bg-[#E2E8F0] flex items-center justify-center px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center text-center gap-6 sm:gap-8 max-w-6xl">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-500 mb-2 sm:mb-3">
            layman terms
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 leading-tight tracking-tight">
            Our terms of use, explained simply.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[
            { icon: Scale, title: "Eligibility & Capacity", body: "You must be at least 18 years of age (or have active guardian approval) to download, register accounts, and run alarm triggers on your device." },
            { icon: BookOpen, title: "Simple License Rules", body: "MinDrop grants you a personal, non-exclusive license. No reverse engineering or distributing cracked copies of the app settings." },
            { icon: AlertTriangle, title: "Disclaimer & Liability", body: "MinDrop is a tool to help you stay organized. It does not replace medical supervision. We are not liable if you miss any medications." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white border-3 border-slate-700 rounded-[2rem] p-6 sm:p-8 shadow-[5px_5px_0px_0px_rgba(30,41,59,0.15)] text-left flex flex-col gap-3">
              <Icon className="size-8 text-slate-600 shrink-0" />
              <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-800">{title}</h3>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-600/80 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Slide 3: Full Terms Document Viewer (Verbatim content from original compliance page) */
interface SlideLegalDocProps {
  company: string;
  jur: string;
  supportEmail: string;
}
function SlideLegalDoc({ company, jur, supportEmail }: SlideLegalDocProps) {
  return (
    <div className="h-full bg-[#F8FAFC] overflow-y-auto py-16 px-6">
      <div className="w-[95%] mx-auto flex flex-col items-center gap-6 max-w-4xl">
        <div className="text-center">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-500">
            For compliance
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 mt-1">
            Official Terms & Conditions
          </h2>
        </div>

        <div className="w-full border-3 border-slate-800 bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(30,41,59,0.15)] text-left">
          <div className="space-y-6 text-xs sm:text-sm md:text-[15px] font-semibold text-slate-700 leading-relaxed">
            <p className="font-bold text-slate-900 border-b-2 border-dashed border-slate-200 pb-4">
              These Terms & Conditions constitute a legally binding agreement between you and {company} ("MinDrop", "we", "us", "our"), operator of MinDrop. Last updated: {LAST_UPDATED}.
            </p>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">1. Eligibility</h3>
              <p className="font-medium text-slate-600">You represent and warrant that you are at least eighteen (18) years of age and have the legal capacity to enter into a binding contract, or that you are using the Service under the supervision and with the express consent of a parent or legal guardian who accepts these Terms on your behalf. You further warrant that you are not barred from receiving the Service under the laws of India or any other applicable jurisdiction.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">2. Account & Security</h3>
              <p className="font-medium text-slate-600">You are solely and exclusively responsible for maintaining the confidentiality of your login credentials and for every activity, act, or omission that occurs under your account, whether or not authorised by you. You agree to immediately notify us of any unauthorised access. We are not liable for any loss, damage, cost, or expense arising from your failure to safeguard your credentials.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">3. Licence to Use the Service</h3>
              <p className="font-medium text-slate-600">Subject to your continuing compliance with these Terms, we grant you a personal, limited, revocable, non-exclusive, non-transferable, non-sublicensable licence to install and use the Service on devices you own or control, solely for your personal, non-commercial use. All right, title, and interest in and to the Service, including all intellectual property rights, remain the exclusive property of MinDrop and its licensors.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">4. Acceptable Use</h3>
              <p className="font-medium text-slate-600">You agree that you will not, directly or indirectly: (a) copy, modify, adapt, translate, reverse engineer, decompile, disassemble, or create derivative works based on the Service; (b) rent, lease, lend, sell, resell, sublicense, distribute, or otherwise commercially exploit the Service; (c) use any automated system, bot, spider, scraper, or crawler to access the Service; (d) attempt to gain unauthorised access to any portion of the Service, servers, or infrastructure; (e) use the Service to store, transmit, or trigger reminders that are unlawful, defamatory, obscene, harassing, or that infringe any third-party right; (f) use the Service in any manner that violates any applicable law or regulation; or (g) interfere with or disrupt the integrity or performance of the Service.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">5. User Content & Licence to MinDrop</h3>
              <p className="font-medium text-slate-600">You retain ownership of the memories, notes, reminders, tags, places, photos, and other content you submit to the Service ("User Content"). By submitting User Content, you grant MinDrop a worldwide, perpetual, irrevocable (for the retention period stated in our Privacy Policy), royalty-free, transferable, sublicensable licence to host, store, reproduce, process, transmit, back up, cache, display, and otherwise use such User Content solely for the purposes of operating, providing, securing, and improving the Service.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">6. Third-Party Services</h3>
              <p className="font-medium text-slate-600">The Service may integrate with third-party services including but not limited to Google Sign-in, Google Drive backup, Firebase Cloud Messaging, and Cashfree Payments. Your use of any third-party service is governed by that third party's own terms and privacy policy, and is at your sole risk.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">7. Paid Plans</h3>
              <p className="font-medium text-slate-600">MinDrop offers a paid "Premium" plan for a term of one (1) year from the date of successful payment ("Premium Term"). Pricing is displayed at checkout and may be changed at any time on a prospective basis; changes will not affect an active Premium Term.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">8. Payments</h3>
              <p className="font-medium text-slate-600">All payments are processed by Cashfree Payments Services Private Limited or another payment processor designated by us. MinDrop does not store your card, UPI, or bank account credentials on its own servers. You warrant that any payment instrument used is valid.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">9. No Auto-Renewal</h3>
              <p className="font-medium text-slate-600">The Premium plan does <strong>not</strong> auto-renew. On expiry of the Premium Term, your account will automatically revert to the free tier and any paid features will cease to be available until you elect to pay for a new Premium Term.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">10. Notifications & Communications</h3>
              <p className="font-medium text-slate-600">By using the Service, you expressly consent to receive service-related and transactional communications from MinDrop, including but not limited to push notifications, reminder notifications, email, and, where applicable, SMS.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">11. Reminder Accuracy — No Warranty</h3>
              <p className="font-medium text-slate-600">The Service is a best-effort personal reminder utility. Reminders may be delayed, delivered out of order, duplicated, or fail to deliver entirely. <strong>You are solely responsible for acting on any reminder, and you agree that MinDrop is not a substitute for professional medical, legal, financial, or safety advice.</strong> MinDrop disclaims all liability for any missed or late notification.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">12. Disclaimers</h3>
              <p className="font-medium text-slate-650">THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTY OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. TO THE MAXIMUM EXTENT PERMITTED BY LAW, MINDROP DISCLAIMS ALL WARRANTIES, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, UNINTERRUPTED OR ERROR-FREE OPERATION, ACCURACY, AND SECURITY.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">13. Indemnification</h3>
              <p className="font-medium text-slate-600">You agree to indemnify, defend, and hold harmless MinDrop and its officers from and against any claims, liabilities, damages, losses, and expenses arising out of your access to or use of the Service or your violation of these Terms.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">14. Limitation of Liability</h3>
              <p className="font-medium text-slate-650">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL MINDROP OR ITS PROVIDERS BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">15. Termination</h3>
              <p className="font-medium text-slate-600">We may suspend or terminate your account or access to the Service at any time, with or without cause, in our sole discretion. Upon termination, your right to use the Service will immediately cease.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">16. Modification of Terms</h3>
              <p className="font-medium text-slate-600">MinDrop may modify these Terms at any time. The revised Terms will be effective when posted at this URL. Your continued use of the Service after the effective date constitutes your acceptance of the revised Terms.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">17. Governing Law & Jurisdiction</h3>
              <p className="font-medium text-slate-600">These Terms are governed by and construed in accordance with the laws of India. Subject to the arbitration clause below, the courts at {jur} shall have exclusive jurisdiction over any dispute arising out of or relating to these Terms.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">18. Dispute Resolution & Arbitration</h3>
              <p className="font-medium text-slate-600">The parties shall first attempt to resolve any dispute amicably through good-faith negotiations. If not resolved, the dispute shall be finally settled by arbitration under the Arbitration and Conciliation Act, 1996 (as amended) by a sole arbitrator appointed by MinDrop. The seat of arbitration shall be {jur}.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">19. Force Majeure</h3>
              <p className="font-medium text-slate-600">MinDrop shall not be liable for any failure or delay in performance caused by circumstances beyond its reasonable control, including acts of God, war, terrorism, utility failures, or failures of third-party providers.</p>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide">20. General</h3>
              <p className="font-medium text-slate-600">These Terms, together with our Privacy Policy, constitute the entire agreement between you and MinDrop. If any provision is held invalid, the remaining provisions shall continue in full force. You may not assign or transfer your rights under these Terms.</p>
            </div>

            <div className="border-t border-dashed border-slate-200 pt-4">
              <h3 className="font-black text-slate-900 mb-1.5 uppercase tracking-wide text-base">21. Contact</h3>
              <p className="font-medium text-slate-600">
                Questions about these Terms may be sent to{" "}
                <a href={`mailto:${supportEmail}`} className="underline font-black text-slate-800">{supportEmail}</a>{" "}
                or to the address listed on our <a href="/contact" className="underline font-black text-slate-800">Contact</a> page.
              </p>
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
function Terms() {
  const { data: s } = useSuspenseQuery(settingsQuery());
  const company = s.companyLegalName || "MinDrop";
  const jur = s.companyJurisdiction || "India";

  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const lastScrollTime = useRef(0);

  const slides = [
    <SlideOpening />,
    <SlideSummary />,
    <SlideLegalDoc company={company} jur={jur} supportEmail={s.supportEmail} />,
  ];
  const TOTAL = slides.length;

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= TOTAL) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 850) return;
    lastScrollTime.current = now;
    setCurrent(idx);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      // If we are on Slide 3 (index 2), check if we should allow native scrolling or navigate back
      if (current === 2) {
        const scrollContainer = el.querySelector(".overflow-y-auto");
        if (scrollContainer) {
          const scrollTop = scrollContainer.scrollTop;
          // If we scroll up and we are already at the top, go back to slide 1
          if (e.deltaY < 0 && scrollTop <= 0) {
            e.preventDefault();
            goTo(current - 1);
          }
          return; // Allow native scrolling inside the container
        }
      }

      e.preventDefault();
      if (Math.abs(e.deltaY) < 12) return;
      if (e.deltaY > 0) goTo(current + 1);
      else if (e.deltaY < 0) goTo(current - 1);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [current]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["ArrowDown","PageDown"].includes(e.key)) { e.preventDefault(); goTo(current + 1); }
      if (["ArrowUp","PageUp"].includes(e.key)) { e.preventDefault(); goTo(current - 1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden"
      style={{ viewTransitionName: "card-terms" } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <header className="shrink-0 border-b-2 border-slate-300/40 z-50 bg-[#F8FAFC]/95 backdrop-blur-[12px]">
        <div className="w-[95%] mx-auto h-14 flex items-center justify-between">
          <Link to="/" viewTransition
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition text-slate-500 hover:text-slate-900">
            <X className="size-3.5"/> Close
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-7 relative grid place-items-center shrink-0">
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-slate-400/30" />
              <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="size-5 rounded-md bg-gradient-to-tr from-slate-500 to-slate-200 grid place-items-center relative">
                <span className="text-white font-black text-[9px]">m</span>
              </motion.div>
            </div>
            <span className="text-xs font-black uppercase tracking-wider hidden sm:block text-slate-550">MinDrop</span>
          </div>
          <Link to="/download"
            className="text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-xl border-2 bg-ink text-white border-ink hover:bg-slate-700 hover:border-slate-700 transition">
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
