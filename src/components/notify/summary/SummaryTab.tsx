import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useInbox } from "@/lib/notify/store";
import { getActiveProvider, getKey } from "@/lib/notify/summary/keyring";
import { getProvider } from "@/lib/notify/summary/providers";
import { preprocess } from "@/lib/notify/summary/preprocess";
import { systemPrompt } from "@/lib/notify/summary/prompt";
import { readProfile } from "@/lib/notify/summary/profile";
import { buildReminderContext, reconcileRecap } from "@/lib/reminders/stats";
import { renderSummaryPdf } from "@/lib/notify/summary/pdf";
import { saveReport, listReports } from "@/lib/notify/summary/history";
import { classify } from "@/lib/notify/summary/errors";
import type { FriendlyError } from "@/lib/notify/summary/errors";
import { usePresets, DEFAULT_SOURCES } from "@/lib/notify/summary/sources";
import { readSchedule, writeSchedule, armScheduler } from "@/lib/notify/summary/scheduler";
import { saveLastReport } from "@/lib/notify/summary/lastReport";
import { SummaryEmpty } from "@/components/notify/summary/SummaryEmpty";
import { SummaryDashboard } from "@/components/notify/summary/SummaryDashboard";
import { SummaryWizard, type WizardStep } from "@/components/notify/summary/SummaryWizard";
import { ErrorCard } from "@/components/notify/summary/ErrorCard";

function todayISO() { return new Date().toISOString().slice(0, 10); }
function tz() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "UTC"; } }

export function SummaryTab({ accent }: { accent: string }) {
  const navigate = useNavigate();
  const { list: inbox } = useInbox();
  const { list: presets, activeId } = usePresets();

  const [wizard, setWizard] = useState<{ open: boolean; step: WizardStep; mode: "create" | "edit" }>(
    { open: false, step: "provider", mode: "create" },
  );
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [err, setErr] = useState<FriendlyError | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const providerId = getActiveProvider();
  const ready = !!providerId && !!getKey(providerId);

  const generate = useCallback(async () => {
    const pid = getActiveProvider();
    if (!pid) return;
    const stored = getKey(pid);
    if (!stored) return;
    const active = presets.find((p) => p.id === activeId);
    const sources = active?.sources ?? DEFAULT_SOURCES;

    setBusy(true); setErr(null); setProgress("Filtering notifications on device…");
    try {
      const date = todayISO();
      const payload = preprocess(inbox, sources, { date, rangeDays: 1, timezone: tz(), presetName: active?.name });
      if (payload.raw.itemsAfterFilter === 0) {
        setErr({
          kind: "empty_input", title: "Nothing to summarise today",
          cause: "No notifications matched your sources.",
          fixSteps: ["Widen your sources under Edit → Change sources.", "Or try again later when more pings arrive."],
        });
        setBusy(false); return;
      }
      const reminders = buildReminderContext(date, 1);
      const profile = readProfile();
      setProgress("Asking your AI provider…");
      const provider = getProvider(pid);
      const raw = await provider.generate({
        key: stored.key, model: stored.model,
        system: systemPrompt(),
        user: { notifications: payload, reminders, userProfile: profile },
      });
      const reconciled = reconcileRecap(raw, reminders);
      setProgress("Building your PDF…");
      const blob = renderSummaryPdf(reconciled, {
        date, provider: pid, model: stored.model, presetName: active?.name,
      });
      const filename = `MinDrop-Digest-${date}.pdf`;
      await saveReport({ date, provider: pid, model: stored.model, filename }, blob);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
      writeSchedule({ ...readSchedule(), lastRunDate: date });
      saveLastReport(reconciled, date);
      setReloadKey((k) => k + 1);
      setProgress("");
    } catch (e) {
      const pv = getProvider(pid);
      setErr(classify(e, { provider: pv.label, model: getKey(pid)?.model }));
    } finally {
      setBusy(false); setProgress("");
    }
  }, [inbox, presets, activeId]);

  function openWizard(step: WizardStep = "provider", mode: "create" | "edit" = "create") {
    setWizard({ open: true, step, mode });
  }

  function finishWizard({ generateNow }: { generateNow: boolean }) {
    setWizard((w) => ({ ...w, open: false }));
    setReloadKey((k) => k + 1);
    // Arm the daily scheduler if enabled
    const s = readSchedule();
    if (s.enabled) armScheduler(() => { void generate(); });
    if (generateNow) void generate();
  }

  return (
    <div>
      {err && (
        <ErrorCard
          error={err} accent={accent}
          onDismiss={() => setErr(null)}
          onRetry={() => { setErr(null); void generate(); }}
        />
      )}

      {ready ? (
        <SummaryDashboard
          accent={accent}
          busy={busy}
          progress={progress}
          onGenerate={() => { void generate(); }}
          onEdit={(step) => openWizard(step, "edit")}
          reloadKey={reloadKey}
        />
      ) : (
        <SummaryEmpty accent={accent} onStart={() => openWizard("provider", "create")} />
      )}

      {wizard.open && (
        <SummaryWizard
          accent={accent}
          initialStep={wizard.step}
          mode={wizard.mode}
          onClose={() => setWizard((w) => ({ ...w, open: false }))}
          onFinish={finishWizard}
        />
      )}
    </div>
  );
}
