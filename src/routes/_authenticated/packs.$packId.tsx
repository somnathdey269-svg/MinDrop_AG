import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Bell, AlarmClock, Check, Sparkles, Plus, Trash2 } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { GRADIENTS, usePacks, usePackInstalls, type PackTemplate } from "@/lib/memoryos/packs";
import { useMemories } from "@/lib/memoryos/store";
import { TemplateEditSheet, type TemplateEditValue } from "@/components/packs/TemplateEditSheet";
import { AddPackThoughtSheet } from "@/components/packs/AddPackThoughtSheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { isPackOwnedMemory, isUserCreatedPackTemplateId, type Memory } from "@/lib/memoryos/types";

export const Route = createFileRoute("/_authenticated/packs/$packId")({
  component: PackDetail,
  validateSearch: (s: Record<string, unknown>) => {
    const raw = Number(s.start);
    const start = Number.isFinite(raw) && raw >= 0 && raw <= 4 ? raw : undefined;
    return { start } as { start?: number };
  },
});

function PackDetail() {
  const { packId } = useParams({ from: "/_authenticated/packs/$packId" });
  const { start } = Route.useSearch();
  const navigate = useNavigate();
  const { list: packs, addTemplate, updateTemplate } = usePacks();
  const { install, uninstall, get: getInstall } = usePackInstalls();
  const { list: memories, persist: persistMemories } = useMemories();
  const pack = useMemo(() => packs.find((p) => p.id === packId), [packs, packId]);

  const [page, setPage] = useState<number>(start ?? 0); // 0..3 preview, 4 = customize
  const [editing, setEditing] = useState<PackTemplate | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const removePack = () => {
    const originalTemplateIds = new Set(pack!.templates.map((t) => t.id));
    persistMemories(memories.filter((m) => !isPackOwnedMemory(m, pack!.id, originalTemplateIds)));
    uninstall(pack!.id);
    setRemoveOpen(false);
    navigate({ to: "/packs" });
  };

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
  const install_ = getInstall(pack.id);
  const activeIds = new Set(install_?.activeTemplateIds ?? []);

  const saveTemplateCustomisation = (t: PackTemplate, v: TemplateEditValue) => {
    updateTemplate(pack.id, t.id, {
      text: v.text,
      defaultTimeOfDay: v.timeOfDay,
      defaultRecurrence: v.recurrence,
      defaultNotify: v.notify,
    });
  };

  const installAllDefaults = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const newMems: Memory[] = pack.templates
      .filter((t) => !activeIds.has(t.id))
      .map((t) => ({
        id: `m-${Date.now()}-${t.id}`,
        time,
        date: `Today · ${t.defaultTimeOfDay}`,
        text: t.text,
        tags: ["Actionable"],
        category: t.categoryId,
        notify: t.defaultNotify,
        recurrence: t.defaultRecurrence,
        source: isUserCreatedPackTemplateId(t.id) ? { kind: "capture" } : { kind: "pack", packId: pack.id, templateId: t.id },
      }));
    persistMemories([...newMems, ...memories]);
    install(pack.id, pack.templates.map((t) => t.id));
    navigate({ to: "/home" });
  };


  const selectableTemplates = pack.templates.filter((t) => !activeIds.has(t.id));
  const allSelected = selectableTemplates.length > 0 && selectableTemplates.every((t) => selected.has(t.id));
  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(selectableTemplates.map((t) => t.id)));
  };
  const goToPick = () => {
    setSelected(new Set(selectableTemplates.map((t) => t.id)));
    setPage(4);
  };
  const installSelected = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const chosen = pack.templates.filter((t) => selected.has(t.id));
    const newMems: Memory[] = chosen.map((t) => ({
      id: `m-${Date.now()}-${t.id}`,
      time,
      date: `Today · ${t.defaultTimeOfDay}`,
      text: t.text,
      tags: ["Actionable"],
      category: t.categoryId,
      notify: t.defaultNotify,
      recurrence: t.defaultRecurrence,
      source: isUserCreatedPackTemplateId(t.id) ? { kind: "capture" } : { kind: "pack", packId: pack.id, templateId: t.id },
    }));
    persistMemories([...newMems, ...memories]);
    if (chosen.length) install(pack.id, chosen.map((t) => t.id));
    navigate({ to: "/home" });
  };

  return (
    <PhoneFrame>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        {/* Header */}
        <div
          className="px-5 pt-5 pb-4 relative"
          style={{ background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)` }}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: "/packs" })}
              className="t-eyebrow inline-flex items-center gap-1 text-ink/75 hover:text-ink"
            >
              <ArrowLeft className="size-3" /> Library
            </button>
            {install_ && (
              <button
                onClick={() => setRemoveOpen(true)}
                className="t-eyebrow inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/70 hover:bg-white text-ink/70 border border-ink/10"
              >
                <Trash2 className="size-3" /> Remove pack
              </button>
            )}
          </div>
          <div data-tour="pack-header" className="mt-3 flex items-center gap-3">
            <div className="t-title size-12 rounded-2xl bg-white/70 grid place-items-center shrink-0">
              {pack.emoji}
            </div>
            <div className="min-w-0">
              <p className="t-eyebrow text-ink/70">Memory pack</p>
              <h1 className="t-display text-ink truncate">{pack.name}</h1>
            </div>
          </div>
          {/* dots */}
          {page < 4 && (
            <div className="mt-4 flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all ${i === page ? "w-6 bg-ink" : "w-3 bg-ink/20"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          <AnimatePresence mode="wait">
            {page === 0 && (
              <motion.div
                key="p0"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                <p className="t-eyebrow text-ink/70">Meet the pack</p>
                <h2 className="t-display text-ink">{pack.shortDesc}.</h2>
                <p className="t-body text-ink/70">{pack.longDesc}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {pack.tags.map((t) => (
                    <span key={t} className="t-eyebrow px-2.5 py-1 rounded-full bg-ink/[0.05] text-ink/75 border border-ink/10">
                      #{t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={installAllDefaults}
                  className="t-eyebrow text-ink/70 underline-offset-2 hover:underline"
                >
                  Skip preview — install all with defaults
                </button>
              </motion.div>
            )}

            {page === 1 && (
              <motion.div
                key="p1"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                <p className="t-eyebrow text-ink/70">Why it helps</p>
                <h2 className="t-display text-ink">Less to carry. More that lands.</h2>
                <div className="space-y-3 pt-2">
                  {pack.benefitBullets.map((b, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-4 rounded-2xl border border-ink/10"
                      style={{ background: `${g.from}55` }}
                    >
                      <div className="size-8 rounded-full bg-white grid place-items-center shrink-0">
                        <Check className="size-4" style={{ color: g.ink }} />
                      </div>
                      <p className="t-body text-ink">{b}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {page === 2 && (
              <motion.div
                key="p2"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                className="space-y-3"
              >
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="t-eyebrow text-ink/70">What's inside</p>
                    <h2 className="t-display text-ink">
                      {pack.templates.length} ready-to-go thoughts.
                    </h2>
                  </div>
                  <button
                    onClick={() => setAddOpen(true)}
                    data-tour="pack-add"
                    className="t-eyebrow inline-flex items-center gap-1 text-ink/60 hover:text-ink underline-offset-2 hover:underline shrink-0"
                  >
                    <Plus className="size-3" /> Add your own
                  </button>

                </div>
                <div className="space-y-2 pt-1">
                  {pack.templates.map((t) => {
                    const added = activeIds.has(t.id);
                    return (
                      <div
                        key={t.id}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${
                          added ? "bg-ink/[0.04] border-ink/10" : "bg-white border-ink/10"
                        }`}
                      >
                        <span className="t-title shrink-0">{t.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="t-body text-ink truncate">{t.text}</p>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="t-eyebrow text-ink/70">
                              {t.defaultTimeOfDay} · {t.defaultRecurrence}
                            </span>
                            {t.defaultNotify === "alarm" ? (
                              <AlarmClock className="size-3 text-ink/70" />
                            ) : (
                              <Bell className="size-3 text-ink/70" />
                            )}
                          </div>
                        </div>
                        {added ? (
                          <span className="t-eyebrow inline-flex items-center gap-1 text-ink/70 shrink-0">
                            <Check className="size-3.5" /> Added
                          </span>
                        ) : (
                          <button
                            onClick={() => setEditing(t)}
                            className="t-eyebrow text-brand shrink-0 hover:underline underline-offset-2"
                          >
                            Customise
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {page === 3 && (
              <motion.div
                key="p3"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                <p className="t-eyebrow text-ink/70">How it works</p>
                <h2 className="t-display text-ink">Three taps to peace.</h2>
                <div className="space-y-2.5 pt-1">
                  {pack.howItWorks.map((step, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-ink/[0.03] border border-ink/5">
                      <div className="t-meta size-7 rounded-full bg-ink text-canvas grid place-items-center shrink-0">
                        {i + 1}
                      </div>
                      <p className="t-body text-ink/85">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {page === 4 && (
              <motion.div
                key="p4"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                className="space-y-3"
              >
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="t-eyebrow text-ink/70">Pick & customise</p>
                    <h2 className="t-display text-ink">Choose what lands in Later.</h2>
                  </div>
                  {selectableTemplates.length > 0 && (
                    <button
                      onClick={toggleAll}
                      className="t-eyebrow shrink-0 text-ink/60 hover:text-ink/90 underline-offset-2 hover:underline"
                    >
                      {allSelected ? "Deselect all" : "Select all"}
                    </button>
                  )}
                </div>
                <div className="space-y-2 pt-1">
                  {pack.templates.map((t) => {
                    const added = activeIds.has(t.id);
                    const isSelected = selected.has(t.id);
                    return (
                      <div
                        key={t.id}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${
                          added
                            ? "bg-ink/[0.04] border-ink/10 opacity-75"
                            : isSelected
                              ? "bg-white border-ink/60"
                              : "bg-white border-ink/10 hover:border-ink/30"
                        }`}
                      >
                        <button
                          onClick={() => !added && toggleSelected(t.id)}
                          disabled={added}
                          className="flex flex-1 min-w-0 items-center gap-3 text-left disabled:cursor-default"
                        >
                          <span
                            className={`size-4 rounded-sm border grid place-items-center shrink-0 transition ${
                              added || isSelected ? "bg-ink/80 border-ink/80 text-canvas" : "border-ink/20 bg-white"
                            }`}
                          >
                            {(added || isSelected) && <Check className="size-2.5" strokeWidth={3} />}
                          </span>
                          <span className="t-title shrink-0">{t.emoji}</span>
                          <span className="flex-1 min-w-0">
                            <span className="t-body block text-ink truncate">{t.text}</span>
                            <span className="t-eyebrow block text-ink/70">
                              {t.defaultTimeOfDay} · {t.defaultRecurrence}
                            </span>
                          </span>
                        </button>
                        {added ? (
                          <span className="t-eyebrow text-ink/70 shrink-0">Added</span>
                        ) : (
                          <button
                            onClick={() => setEditing(t)}
                            className="t-eyebrow text-brand shrink-0 hover:underline underline-offset-2"
                          >
                            Customise
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <button
                    onClick={() => setAddOpen(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-ink/20 text-ink/70 hover:text-ink hover:border-ink/40 bg-white/60 transition"
                  >
                    <span className="size-7 rounded-full bg-ink/5 grid place-items-center shrink-0"><Plus className="size-4" /></span>
                    <div className="flex-1 text-left min-w-0">
                      <p className="t-title">Add your own thought</p>
                      <p className="t-eyebrow text-ink/70">Stays inside this pack · about {pack.name.toLowerCase()}</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer nav — in-flow, sits above fixed BottomTabs */}
        <div className="shrink-0 px-5 py-3 bg-canvas/95 backdrop-blur border-t border-ink/10">

          {page < 3 && (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => page > 0 ? setPage(page - 1) : navigate({ to: "/packs" })}
                className="t-button inline-flex items-center gap-1 text-ink/70 px-3 py-2"
              >
                <ArrowLeft className="size-3.5" /> Back
              </button>
              <button
                onClick={() => setPage(page + 1)}
                className="t-button inline-flex items-center gap-1.5 bg-ink text-canvas rounded-xl px-5 py-3"
              >
                Next <ArrowRight className="size-3.5" />
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
                onClick={goToPick}
                className="t-button inline-flex items-center gap-1.5 bg-ink text-canvas rounded-xl px-5 py-3"
              >
                <Sparkles className="size-3.5" /> Install
              </button>
            </div>
          )}
          {page === 4 && (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setPage(3)}
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

      <TemplateEditSheet
        open={!!editing}
        template={editing}
        pack={pack}
        onClose={() => setEditing(null)}
        onSave={(v) => {
          if (editing) saveTemplateCustomisation(editing, v);
          setEditing(null);
        }}
      />

      <AddPackThoughtSheet
        open={addOpen}
        pack={pack}
        onClose={() => setAddOpen(false)}
        onAdd={(tpl, v) => {
          addTemplate(pack.id, tpl);
          setSelected((prev) => new Set([...prev, tpl.id]));
          setAddOpen(false);
        }}
      />

      <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="t-display">Take a break from {pack.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              We'll uninstall this pack and clear the thoughts it added to your list. Your own captures stay put. You can reinstall it anytime — no hard feelings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction onClick={removePack} className="bg-ink text-canvas hover:bg-ink/90">
              Yes, remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PhoneFrame>
  );
}
