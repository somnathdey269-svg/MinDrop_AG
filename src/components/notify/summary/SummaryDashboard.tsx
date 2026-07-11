import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Loader2, Download, Trash2, Clock, FileText, KeyRound,
  Filter, Pencil, ShieldCheck, Check,
} from "lucide-react";
import { getActiveProvider, getKey } from "@/lib/notify/summary/keyring";
import { getProvider } from "@/lib/notify/summary/providers";
import { usePresets } from "@/lib/notify/summary/sources";
import { readSchedule } from "@/lib/notify/summary/scheduler";
import { GUIDES } from "@/lib/notify/summary/onboarding";
import { listReports, getReportBlob, deleteReport } from "@/lib/notify/summary/history";
import type { ReportRecord } from "@/lib/notify/summary/types";
import { FaqAccordion } from "@/components/notify/summary/FaqAccordion";
import type { WizardStep } from "@/components/notify/summary/SummaryWizard";

function today() { return new Date().toISOString().slice(0, 10); }

export function SummaryDashboard({
  accent,
  busy,
  progress,
  onGenerate,
  onEdit,
  reloadKey,
}: {
  accent: string;
  busy: boolean;
  progress: string;
  onGenerate: () => void;
  onEdit: (step: WizardStep) => void;
  /** Bumped when the underlying reports/settings change so we refetch. */
  reloadKey: number;
}) {
  const providerId = getActiveProvider();
  const stored = providerId ? getKey(providerId) : null;
  const provider = providerId ? getProvider(providerId) : null;
  const model = provider?.models.find((m) => m.id === stored?.model) ?? provider?.models[0];
  const { list: presets, activeId } = usePresets();
  const preset = presets.find((p) => p.id === activeId);
  const sched = readSchedule();

  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setReports(listReports()); }, [reloadKey]);

  const hasToday = useMemo(() => reports.some((r) => r.date === today()), [reports]);

  async function download(r: ReportRecord) {
    const b = await getReportBlob(r.id);
    if (!b) return;
    const url = URL.createObjectURL(b);
    const a = document.createElement("a"); a.href = url; a.download = r.filename; a.click();
    URL.revokeObjectURL(url);
  }
  async function remove(r: ReportRecord) {
    if (!confirm(`Delete ${r.filename}?`)) return;
    await deleteReport(r.id);
    setReports(listReports());
  }

  const grouped = useMemo(() => groupByMonth(reports), [reports]);

  return (
    <div>
      {/* Status strip */}
      <section
        className="rounded-2xl border p-4 mb-4"
        style={{
          borderColor: `color-mix(in oklab, ${accent} 30%, transparent)`,
          background: `color-mix(in oklab, ${accent} 5%, var(--canvas))`,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="size-10 rounded-full grid place-items-center shrink-0"
            style={{ background: `color-mix(in oklab, ${accent} 15%, var(--canvas))` }}
          >
            <Check className="size-5" style={{ color: accent }} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="t-body font-semibold text-ink">You're set up</p>
            <p className="t-body-sm text-ink/70 truncate">
              {providerId ? GUIDES[providerId].label : ""} · {model?.label ?? ""}
            </p>
            <p className="t-meta text-ink/60 mt-0.5 truncate">
              {preset?.name ?? "All apps"} · {sched.enabled ? `Daily at ${sched.hhmm}` : "Manual"}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Edit settings"
              className="p-2 rounded-full hover:bg-ink/5"
            >
              <Pencil className="size-4 text-ink/60" aria-hidden="true" />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-10 z-10 w-48 rounded-2xl border border-ink/10 bg-canvas shadow-lg p-1"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <MenuItem icon={<KeyRound className="size-3.5" />} label="Change API key" onClick={() => { setMenuOpen(false); onEdit("key"); }} />
                <MenuItem icon={<Filter className="size-3.5" />} label="Change sources" onClick={() => { setMenuOpen(false); onEdit("sources"); }} />
                <MenuItem icon={<Clock className="size-3.5" />} label="Change schedule" onClick={() => { setMenuOpen(false); onEdit("schedule"); }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Generate today */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        disabled={busy}
        onClick={onGenerate}
        className="w-full t-button py-3 rounded-full text-canvas inline-flex items-center justify-center gap-2 disabled:opacity-40 mb-4"
        style={{ background: accent }}
      >
        {busy ? (
          <><Loader2 className="size-4 animate-spin" /> {progress || "Working…"}</>
        ) : hasToday ? (
          <><Sparkles className="size-4" /> Regenerate today's report</>
        ) : (
          <><Sparkles className="size-4" /> Generate today's report</>
        )}
      </motion.button>

      {/* Reports list */}
      <section className="rounded-2xl border border-ink/10 bg-canvas p-4 mb-4">
        <header className="flex items-center gap-2 mb-3">
          <FileText className="size-4" style={{ color: accent }} aria-hidden="true" />
          <h3 className="t-body font-semibold text-ink">Your reports</h3>
          <span className="ml-auto t-meta text-ink/50">{reports.length} saved</span>
        </header>
        {reports.length === 0 ? (
          <p className="t-body-sm text-ink/60">No reports yet. Tap "Generate" above to make your first one.</p>
        ) : (
          <div className="space-y-4">
            {grouped.map(({ month, items }) => (
              <div key={month}>
                <p className="t-eyebrow text-ink/50 mb-1">{month}</p>
                <ul className="divide-y divide-ink/10">
                  {items.map((r) => (
                    <li key={r.id} className="py-2 flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="t-body-sm text-ink truncate">{r.filename}</p>
                        <p className="t-meta text-ink/50">{r.date} · {r.provider}/{r.model} · {r.sizeKB} KB</p>
                      </div>
                      <button onClick={() => download(r)} aria-label={`Download ${r.filename}`} className="p-2 rounded-full hover:bg-ink/5">
                        <Download className="size-4 text-ink/70" aria-hidden="true" />
                      </button>
                      <button onClick={() => remove(r)} aria-label={`Delete ${r.filename}`} className="p-2 rounded-full hover:bg-ink/5">
                        <Trash2 className="size-4 text-ink/50" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center gap-2 mb-4 rounded-2xl px-3 py-2 border border-ink/10 bg-canvas">
        <ShieldCheck className="size-4 shrink-0" style={{ color: accent }} aria-hidden="true" />
        <p className="t-meta text-ink/70">
          Keys, notifications and reports stay on this device.
        </p>
      </div>

      <details>
        <summary className="t-body-sm text-ink/70 cursor-pointer">FAQ & privacy</summary>
        <div className="mt-2"><FaqAccordion accent={accent} /></div>
      </details>
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-ink/5 text-left"
    >
      <span className="text-ink/60">{icon}</span>
      <span className="t-body-sm text-ink">{label}</span>
    </button>
  );
}

function groupByMonth(reports: ReportRecord[]): { month: string; items: ReportRecord[] }[] {
  const map = new Map<string, ReportRecord[]>();
  for (const r of reports) {
    const d = new Date(r.date);
    const key = d.toLocaleString(undefined, { month: "long", year: "numeric" });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return Array.from(map.entries()).map(([month, items]) => ({ month, items }));
}
