import { useMemo } from "react";
import type { Pack, PackTemplate, Recurrence } from "@/lib/memoryos/packs";
import { CaptureWizard, type CaptureSubmit } from "@/components/memory/CaptureWizard";

export interface TemplateEditValue {
  text: string;
  timeOfDay: string;
  recurrence: Recurrence;
  notify: "notification" | "alarm";
}

interface Props {
  open: boolean;
  template: PackTemplate | null;
  pack?: Pack | null;
  onClose: () => void;
  onSave: (v: TemplateEditValue) => void;
  saveLabel?: string;
}

export function TemplateEditSheet({ open, template, pack, onClose, onSave, saveLabel = "Save" }: Props) {
  const fallbackPack = useMemo<Pack | null>(() => {
    if (!template) return null;
    return {
      id: `template-${template.id}`,
      name: "this pack",
      emoji: template.emoji || "💡",
      shortDesc: "",
      longDesc: "",
      primaryCategoryId: template.categoryId || "other",
      benefitBullets: [],
      howItWorks: [],
      recoveryBenefit: "",
      gradient: "peach",
      visibility: "published",
      tags: [],
      templates: [template],
    };
  }, [template]);

  const handleSubmit = (d: CaptureSubmit) => {
    if (!template) return;
    let timeOfDay = template.defaultTimeOfDay;
    if (d.dueAt) {
      const dt = new Date(d.dueAt);
      timeOfDay = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
    }
    const recurrence: Recurrence = d.recurrence === "daily" ? "daily" : template.defaultRecurrence;
    onSave({ text: d.text, timeOfDay, recurrence, notify: d.notify });
  };

  if (!template) return null;
  return (
    <CaptureWizard
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      initial={{ text: template.text, timeOfDay: template.defaultTimeOfDay, notify: template.defaultNotify }}
      mode="pack"
      pack={pack ?? fallbackPack}
      title={`${template.emoji || "💡"} Customise this`}
      submitLabel={saveLabel}
    />
  );
}
