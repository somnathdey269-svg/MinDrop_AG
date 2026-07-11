import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Plus, Save, Trash2, Sparkles, RefreshCw, Info } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { getPlanLimits, upsertPlanLimit, deletePlanLimit, type PlanLimitRow } from "@/lib/limits.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/ctrl-vx9k2m7fq3z/limits")({ component: LimitsPage });

type Draft = {
  key: string;
  label: string;
  description: string;
  anon_limit: number;
  free_limit: number;
  premium_limit: number;
  isNew?: boolean;
};

function toDraft(r: PlanLimitRow): Draft {
  return {
    key: r.key,
    label: r.label,
    description: r.description ?? "",
    anon_limit: r.anon_limit,
    free_limit: r.free_limit,
    premium_limit: r.premium_limit,
  };
}

function LimitsPage() {
  const list = useServerFn(getPlanLimits);
  const upsert = useServerFn(upsertPlanLimit);
  const remove = useServerFn(deletePlanLimit);
  const [rows, setRows] = useState<Draft[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const { limits } = await list();
      setRows(limits.map(toDraft));
    } catch (e: any) {
      toast.error(e?.message || "Could not load limits");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); /* eslint-disable-next-line */ }, []);

  function updateRow(i: number, patch: Partial<Draft>) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  async function save(i: number) {
    const r = rows[i];
    if (!r.key || !r.label) { toast.error("Key and label are required"); return; }
    setBusy(r.key);
    try {
      await upsert({ data: {
        key: r.key,
        label: r.label,
        description: r.description || null,
        anon_limit: r.anon_limit,
        free_limit: r.free_limit,
        premium_limit: r.premium_limit,
      }});
      toast.success(`${r.label} saved`);
      await refresh();
    } catch (e: any) {
      toast.error(e?.message || "Could not save");
    } finally {
      setBusy(null);
    }
  }

  async function del(i: number) {
    const r = rows[i];
    if (r.isNew) { setRows((rs) => rs.filter((_, idx) => idx !== i)); return; }
    if (!confirm(`Delete limit "${r.label}"? Client fallbacks will apply.`)) return;
    setBusy(r.key);
    try {
      await remove({ data: { key: r.key } });
      toast.success("Deleted");
      await refresh();
    } catch (e: any) {
      toast.error(e?.message || "Could not delete");
    } finally {
      setBusy(null);
    }
  }

  function addRow() {
    setRows((rs) => [...rs, {
      key: "", label: "", description: "",
      anon_limit: 3, free_limit: 5, premium_limit: -1, isNew: true,
    }]);
  }

  return (
    <AdminShell title="Plan Limits">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1">Superadmin only</p>
            <h2 className="font-serif text-2xl mb-2">Per-tier quotas</h2>
            <p className="text-sm text-ink/60 leading-relaxed">
              Set how many of each thing users can create. <b>Anon</b> = not signed in. <b>Free</b> = signed up, not paying.
              <b> Premium</b> = active subscribers. Use <code className="px-1 rounded bg-ink/5">-1</code> for unlimited.
              Changes propagate to every client within ~5 minutes (or on next app load).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="text-xs uppercase tracking-widest text-ink/60 hover:text-ink inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ink/10 hover:bg-ink/5"
            >
              <RefreshCw className="size-3.5" /> Refresh
            </button>
            <button
              onClick={addRow}
              className="text-xs uppercase tracking-widest text-canvas bg-ink inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:opacity-90"
            >
              <Plus className="size-3.5" /> Add limit
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-ink/50">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/15 p-8 text-center">
            <Sparkles className="size-5 mx-auto text-ink/40 mb-2" />
            <p className="text-sm text-ink/60">No limits configured. Add one to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {rows.map((r, i) => (
              <motion.div
                key={r.isNew ? `new-${i}` : r.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-ink/10 rounded-2xl p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <TextField
                        label="Key" mono
                        placeholder="e.g. later_per_day"
                        value={r.key}
                        onChange={(v) => updateRow(i, { key: v.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                        disabled={!r.isNew}
                      />
                      <TextField
                        label="Label"
                        placeholder="e.g. Do-it-later per day"
                        value={r.label}
                        onChange={(v) => updateRow(i, { label: v })}
                      />
                    </div>
                    <TextField
                      label="Description"
                      placeholder="Shown to admins only."
                      value={r.description}
                      onChange={(v) => updateRow(i, { description: v })}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 lg:w-[380px] shrink-0">
                    <NumberField label="Anon" value={r.anon_limit}
                      onChange={(n) => updateRow(i, { anon_limit: n })} />
                    <NumberField label="Free" value={r.free_limit}
                      onChange={(n) => updateRow(i, { free_limit: n })} />
                    <NumberField label="Premium" accent value={r.premium_limit}
                      onChange={(n) => updateRow(i, { premium_limit: n })} />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-[11px] text-ink/40 inline-flex items-center gap-1">
                    <Info className="size-3" /> -1 means unlimited
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => del(i)}
                      disabled={busy === r.key}
                      className="text-xs uppercase tracking-widest text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Trash2 className="size-3.5" /> {r.isNew ? "Discard" : "Delete"}
                    </button>
                    <button
                      onClick={() => save(i)}
                      disabled={busy === r.key || !r.key || !r.label}
                      className="text-xs uppercase tracking-widest text-canvas bg-ink hover:opacity-90 px-4 py-2 rounded-lg inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Save className="size-3.5" /> {busy === r.key ? "Saving…" : "Save"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function TextField({
  label, value, onChange, placeholder, disabled, mono,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean; mono?: boolean }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-widest text-ink/40 mb-1">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-canvas border border-ink/12 rounded-lg px-3 py-2 text-sm outline-none focus:border-ink/40 disabled:opacity-60 ${mono ? "font-mono" : ""}`}
      />
    </label>
  );
}

function NumberField({
  label, value, onChange, accent,
}: { label: string; value: number; onChange: (n: number) => void; accent?: boolean }) {
  return (
    <label className={`block rounded-xl p-3 ${accent ? "bg-brand/8 border border-brand/25" : "bg-canvas border border-ink/10"}`}>
      <span className={`block text-[10px] uppercase tracking-widest mb-1 ${accent ? "text-brand" : "text-ink/50"}`}>{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={-1}
          value={value}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            onChange(Number.isFinite(n) ? n : 0);
          }}
          className="w-full bg-transparent text-2xl font-serif outline-none tabular-nums"
        />
        {value < 0 && <span className="text-[10px] uppercase tracking-widest text-brand/70">∞</span>}
      </div>
    </label>
  );
}
