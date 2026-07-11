import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { getPublicSettings } from "@/lib/platformSettings.functions";

const SITE = "https://getmindrop.lovable.app";
const LAST_UPDATED = "November 2025";

const settingsQuery = () => ({
  queryKey: ["public-settings"] as const,
  queryFn: () => getPublicSettings(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/refunds")({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery()),
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy — MinDrop" },
      { name: "description", content: "MinDrop's Refund and Cancellation Policy for the Premium plan." },
      { property: "og:title", content: "Refund & Cancellation Policy — MinDrop" },
      { property: "og:description", content: "MinDrop's Refund and Cancellation Policy for the Premium plan." },
      { property: "og:url", content: SITE + "/refunds" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: SITE + "/refunds" }],
  }),
  component: Refunds,
});

function Refunds() {
  const { data: s } = useSuspenseQuery(settingsQuery());
  const company = "MinDrop";
  const jur = s.companyJurisdiction;

  return (
    <MarketingLayout>
      <section className="mx-auto max-w-3xl px-5 md:px-8 py-14 md:py-20">
        <p className="t-eyebrow text-brand">Legal</p>
        <h1 className="t-display mt-3 text-4xl md:text-5xl leading-tight tracking-tight">Refund & Cancellation Policy</h1>
        <p className="t-meta text-ink/55 mt-3">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 space-y-6 t-body text-ink/85 leading-relaxed">
          <p>
            This Refund & Cancellation Policy applies to all payments made by users to {company} for the MinDrop Premium plan. By making a payment, you acknowledge that you have read, understood, and unconditionally accepted this Policy in its entirety. This Policy is to be read together with our <a href="/terms" className="underline">Terms & Conditions</a> and forms a binding part of the contract between you and {company}.
          </p>

          <div>
            <h2 className="t-title mb-2">1. Digital service — non-refundable</h2>
            <p>MinDrop Premium is a digital, non-tangible service that is delivered, activated, and made available for use immediately upon successful payment. In consideration of the immediate delivery of the service and access to premium features, <strong>all sales are final and no refunds shall be granted</strong>, save as expressly provided in Section 5 of this Policy.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">2. No refunds — illustrative (non-exhaustive) list</h2>
            <p>For the avoidance of doubt, refunds shall NOT be granted for any of the following reasons, and this list is illustrative and not exhaustive:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>change of mind, buyer's remorse, or a decision not to use the service;</li>
              <li>partial or complete non-use of the Premium plan during the validity period;</li>
              <li>dissatisfaction with any Premium feature, feature availability, or product roadmap;</li>
              <li>missed, delayed, duplicate, or non-delivered reminders or notifications;</li>
              <li>outages, changes, deprecation, quota limits, or termination of any third-party service (including Google Drive, Firebase Cloud Messaging, or your device operating system);</li>
              <li>device incompatibility, uninstallation of the application, loss of device, or change of device;</li>
              <li>accidental, mistaken, or duplicate purchase where a valid Premium plan is already active on the same account;</li>
              <li>account suspension or termination by {company} pursuant to a breach of the Terms & Conditions;</li>
              <li>changes in pricing, tier limits, features, or availability introduced after your payment.</li>
            </ul>
          </div>

          <div>
            <h2 className="t-title mb-2">3. No mid-term cancellation</h2>
            <p>The Premium plan is sold as a fixed one-year term. The plan cannot be cancelled or shortened during its validity, and any request to cancel mid-term will not entitle you to any refund, credit, or proration. Your Premium features will remain active until the natural expiry of the term.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">4. No auto-renewal — no cancellation required</h2>
            <p>The Premium plan does <strong>not</strong> renew automatically. On expiry, your account will revert to the free tier automatically. You are therefore <em>not</em> required to take any action to cancel or to prevent further billing. To continue Premium beyond expiry, you must initiate a new payment.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">5. Sole exception — genuine duplicate or non-activation</h2>
            <p>Refunds may be considered only in the following two narrowly-defined circumstances, at {company}'s sole discretion after investigation:</p>
            <ol className="list-decimal pl-5 space-y-1.5 mt-2">
              <li><strong>Duplicate payment.</strong> The same order was charged twice by the payment gateway for the same user account, resulting in more than one payment for a single Premium term.</li>
              <li><strong>Non-activation.</strong> Your payment instrument was successfully debited but Premium features were not activated on your account within twenty-four (24) hours, and the failure was not caused by any act, omission, or misconfiguration on your side (including deletion of your account).</li>
            </ol>
            <p className="mt-2">To request consideration under this Section, you must email <a href={`mailto:${s.supportEmail}`} className="underline">{s.supportEmail}</a> within seven (7) calendar days of the disputed transaction, with the subject line "Refund request — [order id]", and provide the payment transaction reference, the date and time of the transaction, the amount, and the registered email of your account. Refunds, if approved, are made to the original payment instrument within seven (7) to fourteen (14) business days after approval. Refunds after this window will not be entertained.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">6. Chargebacks & disputes</h2>
            <p>You agree to first contact us at <a href={`mailto:${s.supportEmail}`} className="underline">{s.supportEmail}</a> and provide {company} a reasonable opportunity to investigate and resolve any billing dispute before initiating any chargeback, reversal, or dispute with your card issuer, bank, UPI provider, or payment network. Any chargeback filed without first exhausting this contact channel shall constitute a material breach of the Terms & Conditions and may result in (a) immediate suspension or termination of your account, (b) forfeiture of any active Premium term, and (c) recovery of all costs, penalties, and legal fees incurred by {company} in connection with the chargeback.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">7. Service discontinuation by {company}</h2>
            <p>If {company} elects to permanently discontinue the Premium plan or the Service in its entirety for all users, {company} may, at its sole discretion, offer a prorated refund of the unused portion of your then-active Premium term. Nothing in this Section shall be construed as an obligation to offer such a refund or any cash equivalent.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">8. Taxes</h2>
            <p>All applicable taxes are included in the price displayed at checkout unless otherwise stated. Any refund made under this Policy will be net of taxes actually remitted by {company} to the relevant tax authority; {company} shall not be obliged to refund taxes that cannot be recovered.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">9. Governing law & jurisdiction</h2>
            <p>This Policy is governed by the laws of India and the courts at {jur} shall have exclusive jurisdiction over any dispute arising out of or in connection with this Policy, subject to the arbitration clause in our Terms & Conditions.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">10. Contact for refund queries</h2>
            <p>All refund and cancellation queries must be directed to <a href={`mailto:${s.supportEmail}`} className="underline">{s.supportEmail}</a>. Refund correspondence sent to any other address will not be considered.</p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
