import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/layout/AdminShell";
import { History } from "lucide-react";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/audit")({ component: AuditPage });

function AuditPage() {
  return (
    <AdminShell title="Audit log">
      <div className="bg-white border border-ink/10 rounded-2xl p-10 text-center">
        <div className="mx-auto size-10 rounded-full bg-brand/10 text-brand grid place-items-center mb-4">
          <History className="size-5" />
        </div>
        <p className="font-serif text-xl mb-1">No audit events yet</p>
        <p className="text-xs text-ink/50 max-w-sm mx-auto">
          Superadmin actions and platform changes will stream here once audit logging is enabled.
        </p>
      </div>
    </AdminShell>
  );
}
