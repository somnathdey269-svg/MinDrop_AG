import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPublicSettings } from "@/lib/platformSettings.functions";
import { motion } from "framer-motion";
import { X } from "lucide-react";

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

function Terms() {
  const { data: s } = useSuspenseQuery(settingsQuery());
  const company = s.companyLegalName;
  const jur = s.companyJurisdiction;

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-between p-6 select-none overflow-y-auto">
      
      {/* Top Header Sync */}
      <header className="flex justify-between items-center w-full z-10 shrink-0 mb-8">
        <span className="text-xs uppercase tracking-wider font-black text-ink/40">Legal Doc</span>
        <div className="flex items-center gap-2">
          <span className="inline-grid place-items-center size-8 rounded-lg bg-[#FF671F] text-white font-black border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm">M</span>
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline text-ink/80">MinDrop Specs</span>
        </div>
        <Link
          to="/"
          viewTransition
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
        >
          View Deck
        </Link>
      </header>

      {/* Main Showcase Card Wrapper */}
      <main className="flex-1 flex items-center justify-center relative w-full mb-12">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          style={{ viewTransitionName: 'card-terms' } as React.CSSProperties}
          className="w-full max-w-4xl bg-white border-3 border-ink rounded-[2.5rem] p-6 sm:p-10 md:p-14 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col gap-8 text-left"
        >
          {/* Close button inside card */}
          <Link
            to="/"
            viewTransition
            className="absolute top-6 right-6 size-10 rounded-full border-2 border-ink bg-white grid place-items-center hover:bg-ink/5 transition z-20 cursor-pointer active:scale-95"
            aria-label="Close"
          >
            <X className="size-5 text-ink" />
          </Link>

          {/* Title Hero */}
          <div className="flex flex-col gap-2 border-b-2 border-dashed border-ink/10 pb-6 mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-slate-100 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2 w-max">
              📜 Terms of Service
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-ink leading-tight tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs text-ink/50 font-bold mt-1">Last updated: {LAST_UPDATED}</p>
          </div>

          {/* Content Block */}
          <div className="space-y-6 text-sm font-bold text-ink/80 leading-relaxed max-w-none">
            <p>
              These Terms & Conditions ("Terms") constitute a legally binding agreement between you ("User", "you", "your") and {company} ("MinDrop", "we", "us", "our"), operator of the MinDrop mobile and web application and any related services (collectively, the "Service"). By accessing, downloading, installing, registering for, or using the Service in any manner, you unconditionally accept these Terms in their entirety. If you do not agree, you must immediately discontinue all use of the Service.
            </p>

            <div>
              <h2 className="text-base font-black text-ink mb-2">1. Eligibility</h2>
              <p className="font-medium text-ink/70">You represent and warrant that you are at least eighteen (18) years of age and have the legal capacity to enter into a binding contract, or that you are using the Service under the supervision and with the express consent of a parent or legal guardian who accepts these Terms on your behalf. You further warrant that you are not barred from receiving the Service under the laws of India or any other applicable jurisdiction.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">2. Account & security</h2>
              <p className="font-medium text-ink/70">You are solely and exclusively responsible for maintaining the confidentiality of your login credentials and for every activity, act, or omission that occurs under your account, whether or not authorised by you. You agree to immediately notify us of any unauthorised access. We are not liable for any loss, damage, cost, or expense arising from your failure to safeguard your credentials or from any use (authorised or unauthorised) of your account.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">3. Licence to use the Service</h2>
              <p className="font-medium text-ink/70">Subject to your continuing compliance with these Terms, we grant you a personal, limited, revocable, non-exclusive, non-transferable, non-sublicensable licence to install and use the Service on devices you own or control, solely for your personal, non-commercial use. All right, title, and interest in and to the Service, including all intellectual property rights, remain the exclusive property of MinDrop and its licensors. Nothing in these Terms transfers any such rights to you.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">4. Acceptable use</h2>
              <p className="font-medium text-ink/70">You agree that you will not, directly or indirectly: (a) copy, modify, adapt, translate, reverse engineer, decompile, disassemble, or create derivative works based on the Service; (b) rent, lease, lend, sell, resell, sublicense, distribute, or otherwise commercially exploit the Service; (c) use any automated system, bot, spider, scraper, or crawler to access the Service; (d) attempt to gain unauthorised access to any portion of the Service, servers, or infrastructure; (e) use the Service to store, transmit, or trigger reminders that are unlawful, defamatory, obscene, harassing, or that infringe any third-party right; (f) use the Service in any manner that violates any applicable law or regulation; or (g) interfere with or disrupt the integrity or performance of the Service.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">5. User content & licence to MinDrop</h2>
              <p className="font-medium text-ink/70">You retain ownership of the memories, notes, reminders, tags, places, photos, and other content you submit to the Service ("User Content"). By submitting User Content, you grant MinDrop a worldwide, perpetual, irrevocable (for the retention period stated in our Privacy Policy), royalty-free, transferable, sublicensable licence to host, store, reproduce, process, transmit, back up, cache, display, and otherwise use such User Content solely for the purposes of operating, providing, securing, and improving the Service and complying with law. You represent and warrant that you have all rights necessary to grant this licence and that your User Content does not violate the rights of any third party.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">6. Third-party services</h2>
              <p className="font-medium text-ink/70">The Service may integrate with third-party services including but not limited to Google Sign-in, Google Drive backup, Firebase Cloud Messaging, and Cashfree Payments. Your use of any third-party service is governed by that third party's own terms and privacy policy, and is at your sole risk. MinDrop is not responsible for the availability, accuracy, content, or practices of any third party, or for any outage, deletion, quota, policy change, or loss of data arising from your use of a third-party service.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">7. Paid plans</h2>
              <p className="font-medium text-ink/70">MinDrop offers a paid "Premium" plan for a term of one (1) year from the date of successful payment ("Premium Term"). Pricing is displayed at checkout and may be changed at any time on a prospective basis; changes will not affect an active Premium Term. Premium features may be added, removed, changed, or discontinued at MinDrop's sole discretion without notice.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">8. Payments</h2>
              <p className="font-medium text-ink/70">All payments are processed by Cashfree Payments Services Private Limited or another payment processor designated by us. MinDrop does not store your card, UPI, or bank account credentials on its own servers. You warrant that any payment instrument used is valid and that you are authorised to use it. All applicable taxes are your responsibility.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">9. No auto-renewal</h2>
              <p className="font-medium text-ink/70">The Premium plan does <strong>not</strong> auto-renew. On expiry of the Premium Term, your account will automatically revert to the free tier and any paid features will cease to be available until you elect to pay for a new Premium Term.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">10. Notifications & communications</h2>
              <p className="font-medium text-ink/70">By using the Service, you expressly consent to receive service-related and transactional communications from MinDrop, including but not limited to push notifications, reminder notifications, email, and, where applicable, SMS. You may opt out of purely marketing communications at any time; transactional and reminder messages are integral to the Service and cannot be opted out of while your account remains active.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">11. Reminder accuracy — no warranty</h2>
              <p className="font-medium text-ink/70">The Service is a best-effort personal reminder utility. Reminders may be delayed, delivered out of order, duplicated, or fail to deliver entirely due to device state, operating system behaviour, network availability, third-party push provider limitations, or other factors outside MinDrop's control. <strong>You are solely responsible for acting on any reminder, and you agree that MinDrop is not a substitute for professional medical, legal, financial, or safety advice, nor for any device, system, or service intended for such purposes.</strong> MinDrop expressly disclaims all liability for any missed, late, duplicate, or non-delivered notification and for any consequence, loss, or damage arising therefrom.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">12. Disclaimers</h2>
              <p className="font-medium text-ink/70">THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTY OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. TO THE MAXIMUM EXTENT PERMITTED BY LAW, MINDROP DISCLAIMS ALL WARRANTIES, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, UNINTERRUPTED OR ERROR-FREE OPERATION, ACCURACY, AND SECURITY. MINDROP DOES NOT WARRANT THAT REMINDERS WILL FIRE ON TIME OR AT ALL.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">13. Limitation of liability</h2>
              <p className="font-medium text-ink/70">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL MINDROP, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING LOSS OF PROFITS, LOSS OF DATA, LOSS OF GOODWILL, MISSED APPOINTMENTS, BUSINESS INTERRUPTION, OR ANY OTHER INTANGIBLE LOSS, ARISING OUT OF OR RELATING TO YOUR USE OF (OR INABILITY TO USE) THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT, STATUTE, OR ANY OTHER LEGAL THEORY. MINDROP'S AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS SHALL NOT EXCEED THE LOWER OF (A) THE AMOUNT ACTUALLY PAID BY YOU TO MINDROP DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR (B) INR 1,000. THIS LIMITATION APPLIES EVEN IF MINDROP HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">14. Indemnity</h2>
              <p className="font-medium text-ink/70">You agree to defend, indemnify, and hold harmless MinDrop, its affiliates, officers, directors, employees, agents, and licensors from and against any and all claims, actions, demands, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or in any way connected with (a) your use or misuse of the Service, (b) your User Content, (c) your violation of these Terms, or (d) your violation of any law or the rights of any third party.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">15. Suspension & termination</h2>
              <p className="font-medium text-ink/70">MinDrop may at its sole discretion, with or without notice and with or without cause, suspend, restrict, or permanently terminate your account or access to the Service, including for suspected breach of these Terms, suspected fraudulent activity, or long inactivity. On termination, no refund of any amount previously paid shall be owed or made, and the licence granted to you under these Terms shall immediately cease.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">16. Modification of Terms</h2>
              <p className="font-medium text-ink/70">MinDrop may modify these Terms at any time. The revised Terms will be effective when posted at this URL. Your continued use of the Service after the effective date constitutes your acceptance of the revised Terms. If you do not agree with the revised Terms you must discontinue use of the Service.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">17. Governing law & jurisdiction</h2>
              <p className="font-medium text-ink/70">These Terms are governed by and construed in accordance with the laws of India, without regard to conflict-of-law principles. Subject to the arbitration clause below, the courts at {jur} shall have exclusive jurisdiction over any dispute, claim, or matter arising out of or relating to these Terms or the Service.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">18. Dispute resolution & arbitration</h2>
              <p className="font-medium text-ink/70">The parties shall first attempt to resolve any dispute amicable through good-faith negotiations for a period of thirty (30) days. If not resolved, the dispute shall be finally settled by arbitration under the Arbitration and Conciliation Act, 1996 (as amended). The arbitration shall be conducted by a sole arbitrator appointed by MinDrop. The seat and venue of arbitration shall be {jur}. The language of arbitration shall be English. The award shall be final and binding on the parties.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">19. Force majeure</h2>
              <p className="font-medium text-ink/70">MinDrop shall not be liable for any failure or delay in performance caused by circumstances beyond its reasonable control, including acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, epidemics, pandemics, network or utility failures, or failures of third-party services or providers.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">20. General</h2>
              <p className="font-medium text-ink/70">These Terms, together with our Privacy Policy and Refund & Cancellation Policy, constitute the entire agreement between you and MinDrop and supersede all prior agreements. If any provision is held invalid or unenforceable, the remaining provisions shall continue in full force. Failure to enforce any right or provision is not a waiver of that right. You may not assign or transfer your rights under these Terms; MinDrop may freely assign its rights and obligations. Nothing in these Terms creates any agency, partnership, employment, or joint-venture relationship.</p>
            </div>

            <div>
              <h2 className="text-base font-black text-ink mb-2">21. Contact</h2>
              <p className="font-medium text-ink/70">
                Questions about these Terms may be sent to{" "}
                <a href={`mailto:${s.supportEmail}`} className="underline font-black text-[#FF671F]">{s.supportEmail}</a>{" "}
                or to the address listed on our <a href="/contact" className="underline font-black text-[#FF671F]">Contact</a> page.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer Sync */}
      <footer className="flex justify-between items-center w-full z-10 shrink-0 mt-4">
        <span className="text-xs font-black uppercase tracking-wider text-ink/40">India · Terms & Conditions</span>
        <Link
          to="/privacy"
          viewTransition
          className="text-xs uppercase tracking-wider font-black text-ink hover:text-[#FF671F] border-b-2 border-ink pb-0.5"
        >
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}
