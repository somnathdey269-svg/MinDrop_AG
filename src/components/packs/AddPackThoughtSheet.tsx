import type { Pack, PackTemplate, Recurrence } from "@/lib/memoryos/packs";
import type { TemplateEditValue } from "./TemplateEditSheet";
import { CaptureWizard, type CaptureSubmit } from "@/components/memory/CaptureWizard";

interface Props {
  open: boolean;
  pack: Pack | null;
  plan?: "free" | "premium" | null;
  onClose: () => void;
  onUpgrade?: () => void;
  onAdd: (tpl: PackTemplate, v: TemplateEditValue) => void;
}

// Reuse the capture wizard in "pack" mode so the UX stays identical.
export function AddPackThoughtSheet({ open, pack, plan, onClose, onUpgrade, onAdd }: Props) {
  const handleSubmit = (d: CaptureSubmit) => {
    if (!pack) return;
    // Derive time-of-day + recurrence from the wizard's due date.
    let timeOfDay = "09:00";
    if (d.dueAt) {
      const dt = new Date(d.dueAt);
      timeOfDay = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
    }
    const rec: Recurrence = d.recurrence === "daily" ? "daily" : "once";
    const tpl: PackTemplate = {
      id: `tpl-custom-${Date.now()}`,
      text: d.text,
      emoji: pack.emoji,
      categoryId: pack.primaryCategoryId,
      defaultTimeOfDay: timeOfDay,
      defaultRecurrence: rec,
      defaultNotify: d.notify,
    };
    onAdd(tpl, { text: tpl.text, timeOfDay, recurrence: rec, notify: d.notify });
  };

  return (
    <CaptureWizard
      open={open}
      onClose={onClose}
      plan={plan}
      onUpgrade={onUpgrade}
      onSubmit={handleSubmit}
      mode="pack"
      pack={pack}
      submitLabel="Add to pack"
    />
  );
}
