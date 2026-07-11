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

function Privacy() {
  const { data: s } = useSuspenseQuery(settingsQuery());

  return (
    <MarketingLayout>
      <section className="mx-auto max-w-3xl px-5 md:px-8 py-14 md:py-20">
        <p className="t-eyebrow text-brand">Legal</p>
        <h1 className="t-display mt-3 text-4xl md:text-5xl leading-tight tracking-tight">Privacy Policy</h1>
        <p className="t-meta text-ink/55 mt-3">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 space-y-6 t-body text-ink/85 leading-relaxed">
          <p>
            This Privacy Policy describes how MinDrop ("MinDrop", "we", "us", "our") collects, uses, discloses, retains, and protects personal data when you access or use the MinDrop mobile and web application and related services (the "Service"). This Policy is issued pursuant to and in accordance with the Digital Personal Data Protection Act, 2023 ("DPDP Act"), the Information Technology Act, 2000, and the rules made thereunder, as applicable to us. By using the Service, you consent to the processing of your personal data as described in this Policy.
          </p>


          <div>
            <h2 className="t-title mb-2">1. Scope</h2>
            <p>This Policy applies to the MinDrop application and website and to all personal data we process as data fiduciary in the course of providing the Service. It does not apply to any third-party service that you may choose to connect to the Service, which is governed by that third party's own privacy policy.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">2. Personal data we collect</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Account data:</strong> name, email address, avatar (from your sign-in provider or supplied by you).</li>
              <li><strong>User content:</strong> memories, notes, tags, reminders, notification rules, saved places, and any other content you submit.</li>
              <li><strong>Device & technical data:</strong> device identifier, operating system, app version, timezone, language, push notification token (FCM).</li>
              <li><strong>Usage data:</strong> feature interactions, session information, crash reports, diagnostic logs.</li>
              <li><strong>Payment data:</strong> we do <em>not</em> collect or store your card, UPI, or bank account details. We store only the payment gateway's transaction identifier, amount, currency, and status.</li>
              <li><strong>Location data:</strong> if and only if you grant permission, we process approximate device location strictly to trigger place-based reminders. Location data is not shared with third parties for advertising.</li>
              <li><strong>Communications:</strong> when you email us for support, we retain the correspondence for the period necessary to resolve your query and for our records.</li>
            </ul>
          </div>

          <div>
            <h2 className="t-title mb-2">3. Purposes of processing</h2>
            <p>We process your personal data to: (a) provide, operate, maintain, and secure the Service; (b) authenticate you and prevent unauthorised access; (c) deliver notifications and reminders you have configured; (d) process payments and manage your Premium plan; (e) back up your data and enable optional Google Drive backup; (f) detect, investigate, and prevent fraud, abuse, and violations of our Terms; (g) provide customer support; (h) improve the Service, including product analytics and crash diagnostics; (i) comply with applicable law and respond to lawful requests; and (j) enforce our legal rights.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">4. Legal basis</h2>
            <p>We process your personal data on the basis of your consent (obtained at the time of account creation and at each relevant permission prompt) and on the basis of legitimate uses permitted under the DPDP Act, including the performance of contract, compliance with law, and reasonable purposes such as fraud prevention and information security.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">5. How we share your data</h2>
            <p>We do not sell your personal data. We share personal data only with:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Cashfree Payments</strong> — for processing payments.</li>
              <li><strong>Google (Sign-in and Drive)</strong> — for authentication and, if you choose, backup.</li>
              <li><strong>Firebase Cloud Messaging</strong> — to deliver push notifications.</li>
              <li><strong>Cloud infrastructure providers</strong> — for hosting, database, and edge compute.</li>
              <li><strong>Analytics and crash reporting providers</strong> — in de-identified or aggregated form where feasible.</li>
              <li><strong>Law enforcement, regulators, or courts</strong> — where required by law or to protect our rights.</li>
              <li><strong>Successors</strong> — in the event of a merger, acquisition, reorganisation, or sale of all or part of our assets.</li>
            </ul>
          </div>

          <div>
            <h2 className="t-title mb-2">6. International transfers</h2>
            <p>Our processors may store and process personal data outside India in jurisdictions permitted under the DPDP Act. By using the Service, you consent to such cross-border transfer where necessary to provide the Service.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">7. Retention</h2>
            <p>We retain personal data for as long as your account is active and for a further period of up to three (3) years thereafter for legal, audit, tax, dispute-resolution, and enforcement purposes. Backups are purged on a rolling ninety (90) day cycle. Aggregated or de-identified data that no longer identifies you may be retained indefinitely.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">8. Security</h2>
            <p>We employ commercially reasonable technical, administrative, and organisational safeguards, including encryption in transit (TLS), row-level access controls, secret management, and least-privilege access. You acknowledge that no system is entirely secure and that residual risk cannot be eliminated. You are responsible for keeping your device and login credentials secure.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">9. Your rights</h2>
            <p>Subject to applicable law, you have the right to: (a) access the personal data we hold about you; (b) request correction of inaccurate or incomplete data; (c) request erasure of your personal data; (d) withdraw consent (which will not affect processing carried out before withdrawal); (e) nominate another person to exercise your rights in the event of your death or incapacity; and (f) grievance redress. To exercise any right, contact our Grievance Officer via the <a href="/contact" className="underline">Contact</a> page. We may require verification of identity and may charge a reasonable fee for repeated or manifestly unfounded requests, as permitted by law.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">10. Children</h2>
            <p>The Service is not directed at persons under the age of eighteen (18). We do not knowingly collect personal data from children. If we become aware that personal data of a child has been submitted to us without verifiable parental consent, we will delete that data and terminate the account.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">11. Cookies & local storage</h2>
            <p>We use cookies, local storage, and similar technologies to keep you signed in, remember your preferences, cache your tier and settings, and gather anonymous usage statistics. You can clear these at any time via your browser or device settings; doing so may sign you out and reset your preferences.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">12. Third-party links</h2>
            <p>The Service may contain links to third-party websites or services. We are not responsible for their privacy practices. You should review their privacy policies before providing any personal data.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">13. Changes to this Policy</h2>
            <p>We may amend this Policy from time to time. The revised Policy will be effective when posted at this URL. Where required by law, we will provide additional notice. Your continued use of the Service after the effective date constitutes your acceptance of the revised Policy.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">14. Grievance Officer</h2>
            <ul className="mt-2 space-y-1">
              <li><strong>Name:</strong> {s.grievanceOfficerName}</li>
              <li>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${s.grievanceOfficerEmail}`} className="underline">{s.grievanceOfficerEmail}</a>
              </li>
              <li><strong>Address:</strong> {s.companyAddress}</li>
            </ul>
            <p className="t-meta text-ink/60 mt-2">Complaints acknowledged within 48 hours and resolved within 15 days.</p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
