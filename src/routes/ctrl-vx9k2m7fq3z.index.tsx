import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { getAdminAnalytics } from "@/lib/admin/analytics.functions";
import { motion } from "framer-motion";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/")({ component: Dashboard });

type Analytics = {
  totalUsers: number;
  newLast7Days: number;
  superadmins: number;
  signupsPerHour24h: number[];
  recentSignups: { id: string; email: string | null; created_at: string }[];
  generatedAt: string;
};

function timeAgo(iso: string) {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function Dashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then((r) => setData(r as Analytics))
      .catch((e) => setErr(e?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total users", value: data ? data.totalUsers.toLocaleString() : "—" },
    { label: "New · 7d", value: data ? data.newLast7Days.toLocaleString() : "—" },
    { label: "Superadmins", value: data ? String(data.superadmins) : "—" },
    { label: "Signups · 24h", value: data ? String(data.signupsPerHour24h.reduce((a, b) => a + b, 0)) : "—" },
  ];

  const maxHour = data ? Math.max(1, ...data.signupsPerHour24h) : 1;

  return (
    <AdminShell title="Dashboard">
      <div className="space-y-6">
        {err && <p className="text-xs text-red-600">Analytics: {err}</p>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cards.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-ink/10 rounded-2xl p-5"
            >
              <p className="text-[10px] uppercase tracking-widest text-ink/40">{k.label}</p>
              <p className="font-serif text-3xl mt-2">{loading ? "…" : k.value}</p>
              <p className="text-xs text-brand mt-1">live</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium uppercase tracking-widest">
                Signups · last 24h
              </h3>
              <span className="text-[10px] text-ink/40">by hour</span>
            </div>
            {data && data.signupsPerHour24h.some((n) => n > 0) ? (
              <div className="h-48 flex items-end gap-1">
                {data.signupsPerHour24h.map((n, i) => (
                  <div
                    key={i}
                    title={`${n} signup${n === 1 ? "" : "s"}`}
                    className="flex-1 rounded-t bg-brand/70 min-h-[2px]"
                    style={{ height: `${(n / maxHour) * 100}%` }}
                  />
                ))}
              </div>
            ) : (
              <div className="h-48 grid place-items-center text-xs text-ink/40">
                {loading ? "Loading…" : "No signups in the last 24 hours"}
              </div>
            )}
          </div>
          <div className="bg-white border border-ink/10 rounded-2xl p-6">
            <h3 className="text-sm font-medium uppercase tracking-widest mb-4">
              Recent signups
            </h3>
            {data && data.recentSignups.length > 0 ? (
              <ul className="space-y-3">
                {data.recentSignups.map((u) => (
                  <li key={u.id} className="text-xs flex gap-3">
                    <span className="text-ink/40 w-14 shrink-0">{timeAgo(u.created_at)}</span>
                    <div className="min-w-0">
                      <p className="text-ink/80 truncate">{u.email ?? u.id}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-ink/40">
                {loading ? "Loading…" : "No recent signups."}
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
