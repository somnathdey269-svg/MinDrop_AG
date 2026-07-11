import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/layout/AdminShell";
import { FlagToggle } from "@/components/admin/FlagToggle";
import { FlaskConical } from "lucide-react";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/experiments")({
  component: ExperimentsPage,
});

function ExperimentsPage() {
  return (
    <AdminShell title="Experiments">
      <FlagToggle slug="experiments" /><div className="bg-white border border-ink/10 rounded-2xl p-10 text-center">
        <div className="mx-auto size-10 rounded-full bg-brand/10 text-brand grid place-items-center mb-4">
          <FlaskConical className="size-5" />
        </div>
        <p className="font-serif text-xl mb-1">No experiments configured</p>
        <p className="text-xs text-ink/50 max-w-sm mx-auto">
          When A/B tests are wired to the platform, they will appear here with live splits and metrics.
        </p>
      </div>
    </AdminShell>
  );
}
