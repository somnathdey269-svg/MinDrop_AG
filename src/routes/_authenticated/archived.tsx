import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { DoItLaterTabs } from "@/components/layout/DoItLaterTabs";
import { HistoryList } from "@/components/history/HistoryList";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

export const Route = createFileRoute("/_authenticated/archived")({
  head: () => ({
    meta: [
      { title: "Archived — MinDrop" },
      { name: "description", content: "Thoughts you've archived from Later. Restore or purge anytime." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ArchivedPage,
});

function ArchivedPage() {
  const { accent1 } = useCountryTheme();
  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]">
        <div className="flex-1 px-6 pt-8 pb-32 relative">
          <PageHeader
            eyebrow="Do it Later"
            title="Archived."
            lede="Thoughts that fired or were tucked away. Restore anytime."
            accent={accent1}
          />
          <DoItLaterTabs />
          <div className="mt-4">
            <HistoryList origin="later" status="archived" accent={accent1} />
          </div>
        </div>
        <div aria-hidden="true" className="h-40 shrink-0" />
        <BottomTabs />
      </div>
    </PhoneFrame>
  );
}
