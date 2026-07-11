import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Bell, Check, Plus } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { GRADIENTS, usePackInstalls, type Pack } from "@/lib/memoryos/packs";
import { useCustomPacks, type CustomSection } from "@/lib/memoryos/customPacks";
import { useMemories } from "@/lib/memoryos/store";
import type { Memory } from "@/lib/memoryos/types";
import { CaptureWizard, type CaptureSubmit } from "@/components/memory/CaptureWizard";

export const Route = createFileRoute("/_authenticated/packs/custom/$customId")({
  component: CustomPackDetail,
  validateSearch: (s: Record<string, unknown>) => {
    const raw = Number(s.start);
    const start = Number.isFinite(raw) && raw >= 0 && raw <= 3 ? raw : undefined;
    return { start } as { start?: number };
  },
});

function CustomPackDetail() {
  const { customId } = useParams({ from: "/packs/custom/$customId" });
  const { start } = Route.useSearch();
  const navigate = useNavigate();
  const { list, addSection, updateSection } = useCustomPacks();
  const { list: memories, persist: persistMemories } = useMemories();
  const { install } = usePackInstalls();
  const pack = useMemo(() => list.find((p) => p.id === customId), [list, customId]);
  // 0 = your pack your nudges, 1 = what's inside, 2 = three taps to peace, 3 = pick & customise
  const [page, setPage] = useState<0 | 1 | 2 | 3>((start ?? 0) as 0 | 1 | 2 | 3);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<CustomSection | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  if (!pack) {
    return (
      <PhoneFrame>
        <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center gap-3">
          <p className="t-display">Pack not found.</p>
          <button onClick={() => navigate({ to: "/packs" })} className="t-eyebrow text-brand">
            Back to library
          </button>
        </div>
        <div aria-hidden="true" className="h-40 shrink-0" />
        <BottomTabs />
      </PhoneFrame>
    );
  }

  const g = GRADIENTS[pack.gradient];

  const wizardPack: Pack = {
    id: pack.id,
    name: pack.name,
    emoji: pack.emoji,
    shortDesc: pack.shortDesc,
    longDesc: "A pack you built around what matters to you.",
    primaryCategoryId: pack.name,
    benefitBullets: [],
    howItWorks: [],
    recoveryBenefit: "",
    gradient: pack.gradient,
    visibility: "published",
    tags: [],
    templates: [],
  };

  const timeFromSubmit = (d: CaptureSubmit, fallback: string) => {
    if (!d.dueAt) return fallback;
    const dt = new Date(d.dueAt);
    return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
  };

  const selectableSections = pack.sections;
  const allSelected = selectableSections.length > 0 && selectableSections.every((s) => selected.has(s.id));
  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(selectableSections.map((s) => s.id)));
  };
  const goToPick = () => {
    setSelected(new Set(selectableSections.map((s) => s.id)));
    setPage(3);
  };
  const buildMemoryFromSection = (s: CustomSection, seed: number): Memory => {
    const now = new Date();
    const [h, m] = s.timeOfDay.split(":").map(Number);
    const due = new Date();
    due.setHours(h, m, 0, 0);
    if (due.getTime() <= now.getTime()) due.setDate(due.getDate() + 1);
    const label = `${due.getDate() === now.getDate() ? "Today" : "Tomorrow"} at ${(due.getHours()%12||12)}:${String(due.getMinutes()).padStart(2,"0")} ${due.getHours()>=12?"PM":"AM"}`;
    return {
      id: `m_${Date.now().toString(36)}_${seed}_${s.id}`,
      time: `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`,
      date: label,
      text: s.text,
      category: pack.name,
      notify: "notification",
      dueAt: due.toISOString(),
      recurrence: "once",
      source: { kind: "pack", packId: pack.id, templateId: s.id, userAdded: true },
    };
  };
  const installSelected = () => {
    const chosen = pack.sections.filter((s) => selected.has(s.id));
    if (chosen.length === 0) return;
    const newMems = chosen.map((s, i) => buildMemoryFromSection(s, i));
    persistMemories([...newMems, ...memories]);
    install(pack.id, chosen.map((s) => s.id));
    navigate({ to: "/home" });
  };

  const yourPackSteps = [
    "Preview each section — these are the thoughts you saved.",
    "Tap Install to send them to Later, or pick just the ones you want.",
    "They land in Later at the time you set. Done.",
  ];

  const threeTapsSteps = [
    "Install the pack — defaults are already smart.",
    "Tweak any reminder text or time so it fits you.",
    "MinDrop nudges you at the right moment, every time.",
  ];

  return (
    <PhoneFrame>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 relative" style={{ background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)` }}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: "/packs" })}
              className="t-eyebrow inline-flex items-center gap-1 text-ink/75 hover:text-ink"
            >
              <ArrowLeft className="size-3" /> Library
            </button>
            <span className="t-eyebrow px-2 py-0.5 rounded-full bg-white/85 text-ink/80">
              Custom
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="t-title size-12 rounded-2xl bg-white/70 grid place-items-center shrink-0">{pack.emoji}</div>
            <div className="min-w-0">
              <p className="t-eyebrow text-ink/70">Memory pack</p>
              <h1 className="t-display text-ink truncate">{pack.name}</h1>
            </div>
          </div>
          {page < 3 && (
            <div className="mt-4 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`h-1 rounded-full transition-all ${i === page ? "w-6 bg-ink" : "w-3 bg-ink/20"}`} />
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <AnimatePresence mode="wait">
            {page === 0 && (
              <motion.div key="p0" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-4">
                <p className="t-eyebrow text-ink/70">How it works</p>
                <h2 className="t-display text-ink">Your pack, your nudges.</h2>
                <div className="space-y-2.5 pt-1">
                  {yourPackSteps.map((step, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-ink/[0.03] border border-ink/5">
                      <div className="t-meta size-7 rounded-full bg-ink text-canvas grid place-items-center shrink-0">{i + 1}</div>
                      <p className="t-body text-ink/85">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {page === 1 && (
              <motion.div key="p1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="t-eyebrow text-ink/70">What's inside</p>
                    <h2 className="t-display text-ink">
                      {pack.sections.length} ready-to-go thought{pack.sections.length === 1 ? "" : "s"}.
                    </h2>
                  </div>
                  <button
                    onClick={() => setAddOpen(true)}
                    className="t-eyebrow inline-flex items-center gap-1 text-ink/60 hover:text-ink underline-offset-2 hover:underline shrink-0"
                  >
                    <Plus className="size-3" /> Add section
                  </button>
                </div>
                {pack.sections.length === 0 ? (
                  <p className="t-body text-ink/70 pt-1">No sections yet. Tap “Add section” to start.</p>
                ) : (
                  <div className="space-y-2 pt-1">
                    {pack.sections.map((s) => (
                      <div key={s.id} className="w-full flex items-center gap-3 p-3 rounded-xl border bg-white border-ink/10">
                        <span className="t-title shrink-0">{s.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="t-body text-ink truncate">{s.text}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="t-eyebrow text-ink/70">
                              {s.timeOfDay} · Daily
                            </span>
                            <Bell className="size-3 text-ink/70" />
                          </div>
                        </div>
                        <button
                          onClick={() => setEditing(s)}
                          className="t-eyebrow text-brand shrink-0 hover:underline underline-offset-2"
                        >
                          Customise
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {page === 2 && (
              <motion.div key="p2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-4">
                <p className="t-eyebrow text-ink/70">How it works</p>
                <h2 className="t-display text-ink">Simple as one, two, done.</h2>
                <div className="space-y-2.5 pt-1">
                  {threeTapsSteps.map((step, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-ink/[0.03] border border-ink/5">
                      <div className="t-meta size-7 rounded-full bg-ink text-canvas grid place-items-center shrink-0">{i + 1}</div>
                      <p className="t-body text-ink/85">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {page === 3 && (
              <motion.div key="p3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="t-eyebrow text-ink/70">Pick & customise</p>
                    <h2 className="t-display text-ink">You decide what sticks.</h2>
                  </div>
                  {selectableSections.length > 0 && (
                    <button
                      onClick={toggleAll}
                      className="t-eyebrow shrink-0 text-ink/60 hover:text-ink/90 underline-offset-2 hover:underline"
                    >
                      {allSelected ? "Deselect all" : "Select all"}
                    </button>
                  )}
                </div>
                {pack.sections.length === 0 ? (
                  <p className="t-body text-ink/70 pt-1">No sections yet.</p>
                ) : (
                  <div className="space-y-2 pt-1">
                    {pack.sections.map((s) => {
                      const isSelected = selected.has(s.id);
                      return (
                        <div
                          key={s.id}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${
                            isSelected ? "bg-white border-ink/60" : "bg-white border-ink/10 hover:border-ink/30"
                          }`}
                        >
                          <button onClick={() => toggleSelected(s.id)} className="flex flex-1 min-w-0 items-center gap-3 text-left">
                            <span
                              className={`size-4 rounded-sm border grid place-items-center shrink-0 transition ${
                                isSelected ? "bg-ink/80 border-ink/80 text-canvas" : "border-ink/20 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="size-2.5" strokeWidth={3} />}
                            </span>
                            <span className="t-title shrink-0">{s.emoji}</span>
                            <span className="flex-1 min-w-0">
                              <span className="t-body block text-ink truncate">{s.text}</span>
                              <span className="t-eyebrow block text-ink/70">Default {s.timeOfDay}</span>
                            </span>
                          </button>
                          <button
                            onClick={() => setEditing(s)}
                            className="t-eyebrow text-brand shrink-0 hover:underline underline-offset-2"
                          >
                            Customise
                          </button>
                        </div>
                      );
                    })}
                    <button
                      onClick={() => setAddOpen(true)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-ink/20 text-ink/70 hover:text-ink hover:border-ink/40 bg-white/60 transition"
                    >
                      <span className="size-7 rounded-full bg-ink/5 grid place-items-center shrink-0"><Plus className="size-4" /></span>
                      <div className="flex-1 text-left min-w-0">
                        <p className="t-title">Add a section</p>
                        <p className="t-eyebrow text-ink/70">Stays inside this pack</p>
                      </div>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        <div className="shrink-0 px-5 py-3 bg-canvas/95 backdrop-blur border-t border-ink/10">
          {page < 2 && (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => page === 0 ? navigate({ to: "/packs" }) : setPage((page - 1) as 0)}
                className="t-button inline-flex items-center gap-1 text-ink/70 px-3 py-2"
              >
                <ArrowLeft className="size-3.5" /> Back
              </button>
              <button
                onClick={() => setPage((page + 1) as 1 | 2)}
                className="t-button inline-flex items-center gap-1.5 bg-ink text-canvas rounded-xl px-5 py-3"
              >
                Next <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}
          {page === 2 && (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setPage(1)}
                className="t-button inline-flex items-center gap-1 text-ink/70 px-3 py-2"
              >
                <ArrowLeft className="size-3.5" /> Back
              </button>
              <button
                onClick={goToPick}
                disabled={pack.sections.length === 0}
                className="t-button inline-flex items-center gap-1.5 bg-ink text-canvas rounded-xl px-5 py-3 disabled:opacity-40"
              >
                <Sparkles className="size-3.5" /> Install
              </button>
            </div>
          )}
          {page === 3 && (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setPage(2)}
                className="t-button inline-flex items-center gap-1 text-ink/70 px-3 py-2"
              >
                <ArrowLeft className="size-3.5" /> Back
              </button>
              <button
                onClick={installSelected}
                disabled={selected.size === 0}
                className="t-button inline-flex items-center gap-1.5 bg-ink text-canvas rounded-xl px-5 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="size-3.5" /> Install {selected.size > 0 ? `(${selected.size})` : ""}
              </button>
            </div>
          )}
        </div>
        <BottomTabs />
      </div>

      <CaptureWizard
        open={addOpen}
        onClose={() => setAddOpen(false)}
        mode="pack"
        pack={wizardPack}
        submitLabel="Add section"
        onSubmit={(d) => {
          let timeOfDay = "09:00";
          if (d.dueAt) {
            const dt = new Date(d.dueAt);
            timeOfDay = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
          }
          const sectionId = addSection(pack.id, { text: d.text, emoji: pack.emoji || "💡", timeOfDay });
          setSelected((prev) => new Set([...prev, sectionId]));
        }}
      />
      <CaptureWizard
        open={!!editing}
        onClose={() => setEditing(null)}
        mode="pack"
        pack={wizardPack}
        initial={editing ? { text: editing.text, timeOfDay: editing.timeOfDay, notify: "notification" } : undefined}
        title={editing ? `${editing.emoji} Customise this` : "Customise this"}
        submitLabel="Save"
        onSubmit={(d) => {
          if (!editing) return;
          updateSection(pack.id, editing.id, {
            text: d.text,
            emoji: editing.emoji || pack.emoji || "💡",
            timeOfDay: timeFromSubmit(d, editing.timeOfDay),
          });
          setEditing(null);
        }}
      />
    </PhoneFrame>
  );
}
