import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/layout/AdminShell";
import { FlagMatrix } from "@/components/admin/FlagToggle";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/flags")({ component: FlagsPage });

function FlagsPage() {
  return (
    <AdminShell title="Feature Flags">
      <div className="space-y-4">
        <p className="text-sm text-ink/60 max-w-2xl">
          Toggle a feature off to swap the consumer surface for a shared "Coming soon" screen in that
          environment. The consumer picks its environment from the build (Prod on the published
          site, Dev in preview) and can be overridden per-tab with <code className="font-mono text-xs bg-ink/5 px-1 py-0.5 rounded">?env=staging</code>.
        </p>
        <FlagMatrix />
      </div>
    </AdminShell>
  );
}
