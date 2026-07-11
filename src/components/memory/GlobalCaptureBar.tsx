import { useNavigate } from "@tanstack/react-router";
import { CaptureBar } from "@/components/memory/CaptureBar";
import type { CaptureSubmit } from "@/components/memory/CaptureWizard";
import { useOnboarding, useMemories } from "@/lib/memoryos/store";
import { isPersonalMemory } from "@/lib/memoryos/types";

/**
 * Renders the floating Capture Bar on any screen and persists captures
 * to the shared memory store so they show up in Later/Recovery.
 */
export function GlobalCaptureBar() {
  const navigate = useNavigate();
  const { state } = useOnboarding();
  const { list, add } = useMemories();

  const limit = state.plan === "free" ? 5 : Infinity;

  const onCapture = (d: CaptureSubmit) => {
    const activeCount = list.filter((m) => !m.archivedAt && !m.deletedAt && isPersonalMemory(m)).length;
    if (activeCount >= limit) { navigate({ to: "/paywall" }); return; }
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    add({
      id: `m-${Date.now()}`,
      time,
      date: d.when,
      text: d.text,
      tags: ["Actionable"],
      category: d.category,
      notify: d.notify,
      imageUrl: d.imageUrl,
      audioUrl: d.audioUrl,
      audioDuration: d.audioDuration,
      dueAt: d.dueAt,
      recurrence: d.recurrence,
      until: d.until,
      source: d.kind === "recording" ? { kind: "recording" } : { kind: "capture" },
    });
    navigate({ to: "/home" });
  };

  return (
    <CaptureBar
      plan={state.plan}
      onCapture={onCapture}
      onUpgrade={() => navigate({ to: "/paywall" })}
    />
  );
}
