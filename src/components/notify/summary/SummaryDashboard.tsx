import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Loader2, Download, Trash2, Clock, FileText, KeyRound,
  Filter, Pencil, ShieldCheck, Check,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getActiveProvider, getKey, listSaved, setActiveProvider } from "@/lib/notify/summary/keyring";
import { getProvider } from "@/lib/notify/summary/providers";
import type { ProviderId } from "@/lib/notify/summary/types";
import { getEnabledModelsForProvider } from "@/lib/notify/summary/adminConfig";
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
  reloadKey,
}: {
  accent: string;
  busy: boolean;
  progress: string;
  onGenerate: (customModel?: string) => void;
  reloadKey: number;
}) {
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>(getActiveProvider() || "gemini");

  const stored = getKey(selectedProvider);
  const providerInfo = getProvider(selectedProvider);

  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    const sched = readSchedule();
    const enabledModels = getEnabledModelsForProvider(selectedProvider);
    if (sched.providerId === selectedProvider && sched.modelId && enabledModels.some((m) => m.id === sched.modelId)) {
      setSelectedModel(sched.modelId);
    } else if (stored && enabledModels.some((m) => m.id === stored.model)) {
      setSelectedModel(stored.model);
    } else {
      setSelectedModel(enabledModels[0]?.id || "");
    }
  }, [selectedProvider, stored]);

  const [reports, setReports] = useState<ReportRecord[]>([]);

  useEffect(() => {
    setReports(listReports());
  }, [reloadKey]);

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
      {/* Informative info banner */}
      <div className="p-3 mb-4 rounded-xl bg-ink/5 border border-ink/5 flex items-start gap-2.5">
        <Clock className="size-4 text-ink/60 mt-0.5 shrink-0" />
        <p className="t-meta text-ink/70 leading-normal">
          <strong>Instant reports</strong> summarize your notifications right now. Daily or weekly scheduled automation triggers can be managed under <strong>Settings</strong>.
        </p>
      </div>

      {/* Provider Selector Tabs */}
      <div className="flex rounded-xl p-1 bg-ink/5 mb-4">
        {(["gemini", "openai", "anthropic"] as ProviderId[]).map((tab) => {
          const isSel = selectedProvider === tab;
          const hasKey = !!getKey(tab);
          return (
            <button
              key={tab}
              onClick={() => {
                setSelectedProvider(tab);
                if (hasKey) setActiveProvider(tab);
              }}
              className="flex-1 py-2 text-center rounded-lg t-meta font-semibold transition-all relative"
              style={{
                color: isSel ? accent : "var(--color-ink-70)",
                background: isSel ? "var(--canvas)" : "transparent",
                boxShadow: isSel ? "0 1px 3px rgba(0,0,0,0.05)" : "none"
              }}
            >
              <span className="capitalize">{tab}</span>
              {hasKey && (
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full" style={{ backgroundColor: accent }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Main configuration run area */}
      {!stored ? (
        <div className="p-5 rounded-2xl bg-ink/[0.02] border border-dashed border-ink/15 text-center mb-6">
          <KeyRound className="size-8 mx-auto text-ink/40 mb-2" />
          <p className="t-body font-semibold text-ink">API Key Required</p>
          <p className="t-meta text-ink/70 mt-1 mb-4">
            Configure your {selectedProvider === "gemini" ? "Gemini" : selectedProvider === "openai" ? "OpenAI" : "Anthropic"} key in settings to unlock summary reports.
          </p>
          <Link
            to="/settings"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-ink/10 rounded-xl t-meta font-semibold hover:shadow-sm active:bg-ink/[0.02] text-ink"
          >
            Link Key in Settings ↗
          </Link>
        </div>
      ) : (
        <div className="mb-5 space-y-4">
          <div>
            <label className="block t-meta font-semibold text-ink/70 mb-2">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-canvas text-ink t-body-sm focus:outline-none focus:border-ink/30"
            >
              {getEnabledModelsForProvider(selectedProvider).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={busy}
            onClick={() => onGenerate(selectedModel)}
            className="w-full t-button py-3.5 rounded-2xl text-canvas inline-flex items-center justify-center gap-2 disabled:opacity-40 font-bold"
            style={{ background: accent }}
          >
            {busy ? (
              <><Loader2 className="size-4 animate-spin" /> {progress || "Working…"}</>
            ) : hasToday ? (
              <><Sparkles className="size-4" /> Regenerate Today's Report</>
            ) : (
              <><Sparkles className="size-4" /> Get Instant Report</>
            )}
          </motion.button>
        </div>
      )}

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
