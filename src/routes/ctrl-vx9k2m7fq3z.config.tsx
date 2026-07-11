import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/layout/AdminShell";
import { RemoteConfigCard } from "@/components/admin/RemoteConfigCard";
import { seedConfig } from "@/lib/memoryos/data";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/config")({ component: ConfigPage });

function ConfigPage() {
  return (
    <AdminShell title="Remote Config">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RemoteConfigCard entries={seedConfig} />
        <div className="bg-white border border-ink/10 rounded-2xl p-6">
          <h3 className="text-sm font-medium uppercase tracking-widest mb-2">
            Environment overrides
          </h3>
          <p className="text-xs text-ink/50">
            Per-environment overrides will appear here once the platform_settings table is wired
            to remote flags.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
