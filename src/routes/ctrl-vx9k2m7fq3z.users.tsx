import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { listPlatformUsers } from "@/lib/admin/analytics.functions";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/users")({ component: UsersPage });

type Row = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function UsersPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    listPlatformUsers()
      .then((r) => setRows(r as Row[]))
      .catch((e) => setErr(e?.message || "Failed to load"));
  }, []);

  return (
    <AdminShell title="Users">
      {err && <p className="text-xs text-red-600 mb-3">Users: {err}</p>}
      <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-canvas text-[10px] uppercase tracking-widest text-ink/50">
              <tr>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4 hidden sm:table-cell">Roles</th>
                <th className="text-left p-4 hidden md:table-cell">Joined</th>
                <th className="text-left p-4 hidden lg:table-cell">Last sign-in</th>
              </tr>
            </thead>
            <tbody>
              {rows === null && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs text-ink/40">
                    Loading…
                  </td>
                </tr>
              )}
              {rows && rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs text-ink/40">
                    No users yet.
                  </td>
                </tr>
              )}
              {rows?.map((u) => (
                <tr key={u.id} className="border-t border-ink/5">
                  <td className="p-4 font-medium">{u.email ?? u.id}</td>
                  <td className="p-4 hidden sm:table-cell">
                    {u.roles.length === 0 ? (
                      <span className="text-[10px] uppercase tracking-widest text-ink/40">
                        member
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-brand/10 text-brand"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4 hidden md:table-cell text-ink/60 text-xs">
                    {fmt(u.created_at)}
                  </td>
                  <td className="p-4 hidden lg:table-cell text-ink/60 text-xs">
                    {fmt(u.last_sign_in_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
