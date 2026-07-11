import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { getPublicSettings } from "@/lib/platformSettings.functions";

const SITE = "https://getmindrop.lovable.app";

const settingsQuery = () => ({
  queryKey: ["public-settings"] as const,
  queryFn: () => getPublicSettings(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/contact")({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery()),
  head: () => ({
    meta: [
      { title: "Contact — MinDrop" },
      { name: "description", content: "Contact MinDrop support, grievance officer, and registered office." },
      { property: "og:title", content: "Contact — MinDrop" },
      { property: "og:description", content: "Contact MinDrop support, grievance officer, and registered office." },
      { property: "og:url", content: SITE + "/contact" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: SITE + "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const { data: s } = useSuspenseQuery(settingsQuery());
  return (
    <MarketingLayout>
      <section className="mx-auto max-w-3xl px-5 md:px-8 py-14 md:py-20">
        <p className="t-eyebrow text-brand">Contact</p>
        <h1 className="t-display mt-3 text-4xl md:text-5xl leading-tight tracking-tight">Contact us</h1>

        <div className="mt-8 space-y-6 t-body text-ink/80 leading-relaxed">
          <div>
            <h2 className="t-title mb-2">Registered office</h2>
            <address className="not-italic whitespace-pre-line">
              {s.companyLegalName}
              {"\n"}
              {s.companyAddress}
            </address>
          </div>

          <div>
            <h2 className="t-title mb-2">Support</h2>
            <p>
              Email:{" "}
              <a href={`mailto:${s.supportEmail}`} className="underline">{s.supportEmail}</a>
            </p>
            <p className="t-meta text-ink/60 mt-1">Response time: within 3 business days.</p>
          </div>

          <div>
            <h2 className="t-title mb-2">Grievance Officer</h2>
            <p>Under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and the Digital Personal Data Protection Act, 2023, the Grievance Officer for {s.companyLegalName} is:</p>
            <ul className="mt-2 space-y-1">
              <li><strong>Name:</strong> {s.grievanceOfficerName}</li>
              <li>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${s.grievanceOfficerEmail}`} className="underline">{s.grievanceOfficerEmail}</a>
              </li>
              <li><strong>Address:</strong> {s.companyAddress}</li>
            </ul>
            <p className="t-meta text-ink/60 mt-2">
              Complaints are acknowledged within 48 hours and resolved within 15 days of receipt, in accordance with applicable law.
            </p>
          </div>

          <div>
            <h2 className="t-title mb-2">Business & legal</h2>
            <p>
              For legal notices, please write to{" "}
              <a href={`mailto:${s.supportEmail}`} className="underline">{s.supportEmail}</a>{" "}
              with the subject line "Legal — [subject]". Physical notices should be sent to the registered office address above.
            </p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
