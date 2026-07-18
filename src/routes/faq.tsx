import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { useState } from "react";
import { ChevronDown, ArrowLeft, HelpCircle } from "lucide-react";

const faqData = [
  {
    q: "Is my data private and secure?",
    a: "Absolutely. MinDrop is built on a zero-knowledge local storage model. Your drops, notes, photos, and voice clips are stored locally on your Android device in a secure SQLite database. If you upgrade to Premium, backups sync directly to your private Google Drive folder. We have zero servers, zero trackers, and zero access to your information."
  },
  {
    q: "Do I need a sign-in or account to use MinDrop?",
    a: "No. You don't need to sign in, verify emails, or input passwords. Simply install the APK and start using it immediately. Your local device session holds your local data."
  },
  {
    q: "How does the location geofencing work offline?",
    a: "MinDrop integrates with Android's OS-level Geofencing APIs. It registers coordinate boundary circles around your locations (like your home, office, or local store). The phone monitors these zones locally. It does not send coordinates to any cloud API, meaning it works entirely offline."
  },
  {
    q: "Will background tracking drain my phone battery?",
    a: "No. Standard GPS tracking runs constantly in the foreground, causing heavy battery drain. MinDrop registers geofences with the operating system, allowing the OS to trigger boundary events only when cell towers indicate movement. This reduces background battery consumption to 0%."
  },
  {
    q: "What happens to my alarms when my phone reboots?",
    a: "MinDrop is built with native reboot listeners. When your Android device boots up or restarts, MinDrop automatically executes a local background sweep and schedules all your pending alarms, ensuring nothing is ever missed."
  },
  {
    q: "How do Notify filters read incoming notifications?",
    a: "MinDrop requests Android's Notification Listener Permission. This is a local service that runs on your device to inspect incoming notification banners. When it matches a word rule you set (e.g., 'boss' on Slack, or '₹' on bank messages), it plays a looping alarm. No notification data ever leaves your device."
  },
  {
    q: "Can I run MinDrop on my computer or web browser?",
    a: "MinDrop is designed to run natively on mobile devices. If you hit authenticated dashboard pages on a desktop web browser, the app displays a 'Get App' download gate. Developers can bypass this gate during local testing by adding `?native=1` to the URL query string."
  },
  {
    q: "What is the difference between the Free and Premium plans?",
    a: "The Free plan includes full access to all three modules (Later, Notify, Places) but limits you to keeping 5 active concurrent drops at a time. The Premium plan unlocks unlimited drops, Google Drive sync, and custom theme packs."
  },
  {
    q: "Will there be an iOS / iPhone app?",
    a: "Currently, we only support Android. iOS has strict limitations on notification listeners and custom background alarm scheduling, which are required for MinDrop's core loop alarms and Notify filters to run reliably."
  }
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ & Help Center — MinDrop" },
      { name: "description", content: "Answers to common questions about MinDrop's privacy, location geofencing, notification filters, and battery performance." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <MarketingLayout>
      <section className="relative overflow-hidden bg-canvas py-16 md:py-24 border-b border-ink/5">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-[520px] rounded-full bg-orange-500/5 blur-[100px]" />
        
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[#FF671F] hover:underline font-bold text-xs uppercase tracking-wider mb-6">
            <ArrowLeft className="size-3.5" /> Back to Home
          </Link>

          <span className="t-eyebrow inline-flex items-center gap-2 rounded-full bg-orange-50 px-3.5 py-1.5 text-[#FF671F] font-bold border border-orange-100 mb-5">
            <HelpCircle className="size-4" /> FAQ Center
          </span>

          <h1 className="t-display text-4xl sm:text-5xl font-black leading-tight text-ink">
            Frequently Asked <span className="text-[#FF671F]">Questions.</span>
          </h1>

          <p className="t-body mt-4 text-ink/75 max-w-xl mx-auto leading-relaxed">
            Honest, technical answers about how MinDrop respects your privacy, manages your battery, and handles alarms locally on your device.
          </p>
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="py-20 bg-[#f9f7f2]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="bg-white rounded-3xl border border-ink/8 overflow-hidden shadow-sm transition-all duration-300">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-ink cursor-pointer hover:bg-ink/[0.01] text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`size-5 text-ink/50 transition-transform duration-200 shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-ink/5 text-ink/75 t-body-sm leading-relaxed text-sm md:text-base">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Help Banner */}
      <section className="py-16 bg-white border-b border-ink/5 text-center">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
          <h3 className="t-title font-bold text-xl text-ink">Still have questions?</h3>
          <p className="t-body-sm text-ink/70 mt-2 max-w-md mx-auto leading-relaxed">
            We are here to help you get the most out of your second brain. Contact our developer support team directly.
          </p>
          <div className="mt-6">
            <Link to="/contact" className="t-button inline-flex items-center gap-2 rounded-2xl bg-ink text-canvas px-6 py-3.5 hover:opacity-90 font-bold transition text-xs uppercase tracking-wider">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
