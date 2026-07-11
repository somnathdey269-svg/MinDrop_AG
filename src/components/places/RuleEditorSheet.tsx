import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, MapPin, X, Bell, BellRing } from "lucide-react";
import type { Place, PlaceRule, Trigger, Frequency, PlaceDelivery } from "@/lib/places/types";
import { RadiusSlider } from "./RadiusSlider";
import { NextTriggerPreview } from "@/components/reminders/NextTriggerPreview";

type StepId = "place" | "radius" | "note" | "trigger" | "delivery" | "frequency" | "review";

interface Props {
  open: boolean;
  accent: string;
  places: Place[];
  rule: PlaceRule | null;
  onClose: () => void;
  onSave: (rule: PlaceRule) => void;
  onSaveNewPlace?: () => void;
}

export function PlaceRuleEditorSheet({ open, accent, places, rule, onClose, onSave, onSaveNewPlace }: Props) {
  const steps: StepId[] = ["place", "radius", "note", "trigger", "delivery", "frequency", "review"];
  const [stepIdx, setStepIdx] = useState(0);
  const [placeId, setPlaceId] = useState<string>("");
  const [radiusM, setRadiusM] = useState(200);
  const [note, setNote] = useState("");
  const [exitMessage, setExitMessage] = useState("");
  const [trigger, setTrigger] = useState<Trigger>("enter");
  const [delivery, setDelivery] = useState<PlaceDelivery>("notification");
  const [frequency, setFrequency] = useState<Frequency>("always");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    if (rule) {
      setPlaceId(rule.placeId);
      setRadiusM(rule.radiusM);
      setNote(rule.remindNote || rule.message || "");
      setExitMessage(rule.exitMessage ?? "");
      setTrigger(rule.trigger);
      setDelivery(rule.delivery ?? "notification");
      setFrequency(rule.frequency);
      setStepIdx(1);
    } else {
      setPlaceId("");
      setRadiusM(200);
      setNote("");
      setExitMessage("");
      setTrigger("enter");
      setDelivery("notification");
      setFrequency("always");
      setStepIdx(0);
    }
    setSearch("");
  }, [open, rule?.id]);

  const step = steps[Math.min(stepIdx, steps.length - 1)];
  const goNext = () => setStepIdx((i) => Math.min(i + 1, steps.length - 1));
  const goBack = () => setStepIdx((i) => Math.max(i - 1, 0));

  const filteredPlaces = useMemo(() => {
    const q = search.trim().toLowerCase();
    const active = places.filter((p) => !p.archivedAt && !p.deletedAt);
    if (!q) return active;
    return active.filter((p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
  }, [places, search]);

  const chosenPlace = places.find((p) => p.id === placeId) ?? null;

  const nextDisabled =
    (step === "place" && !placeId) ||
    (step === "note" && !note.trim());

  const save = () => {
    if (!placeId || !note.trim()) return;
    const built: PlaceRule = {
      id: rule?.id ?? `pr-${Date.now().toString(36)}`,
      placeId,
      radiusM,
      message: note.trim(),      // keep `message` for backup compatibility
      remindNote: note.trim(),
      exitMessage: (trigger !== "enter" && exitMessage.trim()) ? exitMessage.trim() : undefined,
      trigger,
      delivery,
      frequency,
      paused: rule?.paused ?? false,
      createdAt: rule?.createdAt ?? new Date().toISOString(),
    };
    onSave(built);
    onClose();
  };

  const stepTitle: Record<StepId, string> = {
    place: "Which place",
    radius: "Radius",
    note: "What to remind",
    trigger: "Trigger",
    delivery: "Delivery",
    frequency: "Frequency",
    review: "Review",
  };

  // Subtle neutral palette (parity with Notify RuleEditorSheet). Accent only
  // for the progress bar and primary CTA.
  const selectedTile = "bg-ink/5 border-ink/25";
  const idleTile = "bg-card border-ink/10";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/50 z-40"
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-[440px] md:w-full rounded-t-[2rem] bg-canvas border-t border-ink/10 max-h-[92dvh] flex flex-col"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-canvas border-b border-ink/5">
              <div className="flex items-center gap-2 min-w-0">
                {stepIdx > 0 && (
                  <button onClick={goBack} aria-label="Back" className="size-8 rounded-full grid place-items-center hover:bg-ink/5">
                    <ArrowLeft className="size-4" />
                  </button>
                )}
                <span className="t-eyebrow text-ink/70 truncate">
                  {rule ? "Edit rule" : "New rule"} · {stepTitle[step]}
                </span>
              </div>
              <button onClick={onClose} aria-label="Close" className="size-8 rounded-full grid place-items-center hover:bg-ink/5">
                <X className="size-4" />
              </button>
            </div>

            <div className="px-5 pt-3 flex gap-1.5" aria-hidden="true">
              {steps.map((s, i) => (
                <span key={s} className="h-1 flex-1 rounded-full transition" style={{ background: i <= stepIdx ? "var(--ink)" : "color-mix(in oklab, var(--ink) 12%, transparent)" }} />
              ))}
            </div>

            {(() => {
              const radiusText = radiusM < 1000 ? `${radiusM} m` : `${(radiusM / 1000).toFixed(1)} km`;
              const dir = trigger === "enter" ? "arrive at" : trigger === "exit" ? "leave" : "arrive at or leave";
              const placeName = chosenPlace?.name ?? "a saved place";
              const triggerLine = `When you ${dir} ${placeName} (${radiusText})`;
              const freq = frequency === "always" ? "Every crossing" : "First crossing only";
              return (
                <div className="px-5 pt-3">
                  <NextTriggerPreview trigger={triggerLine} delivery={delivery} detail={freq} />
                </div>
              );
            })()}

            <div className="px-5 py-5 overflow-y-auto flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  {step === "place" && (
                    <>
                      <div>
                        <p className="t-display text-ink mb-1">Which place?</p>
                        <p className="t-body-sm text-ink/60">Pick one of your saved places.</p>
                      </div>
                      {places.filter((p) => !p.archivedAt && !p.deletedAt).length === 0 ? (
                        <div className="p-4 rounded-2xl border border-ink/10 bg-card">
                          <p className="t-body-sm text-ink/70 mb-3">You haven't saved any places yet.</p>
                          <button
                            type="button"
                            onClick={() => { onClose(); onSaveNewPlace?.(); }}
                            className="t-button w-full py-3 rounded-2xl text-canvas"
                            style={{ background: accent }}
                          >
                            + Save a place first
                          </button>
                        </div>
                      ) : (
                        <>
                          <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search places…"
                            className="t-body w-full px-3 py-2.5 rounded-2xl bg-card border border-ink/10 focus:outline-none focus:border-ink/30"
                          />
                          <div className="rounded-2xl bg-card border border-ink/10 divide-y divide-ink/5 max-h-72 overflow-y-auto">
                            {filteredPlaces.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => { setPlaceId(p.id); goNext(); }}
                                className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 ${placeId === p.id ? "bg-ink/5" : ""}`}
                              >
                                <div className="min-w-0 flex items-center gap-2">
                                  <span aria-hidden="true">{p.emoji || "📍"}</span>
                                  <div className="min-w-0">
                                    <p className="t-body truncate">{p.name}</p>
                                    <p className="t-meta text-ink/50 truncate">{p.address}</p>
                                  </div>
                                </div>
                                {placeId === p.id && <Check className="size-4 shrink-0 text-ink/70" />}
                              </button>
                            ))}
                            {filteredPlaces.length === 0 && (
                              <p className="t-meta text-ink/60 p-4">No matches.</p>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {step === "radius" && (
                    <>
                      <div>
                        <p className="t-display text-ink mb-1">How close?</p>
                        <p className="t-body-sm text-ink/60">The radius that fires this reminder.</p>
                      </div>
                      <div className="paper-card p-4">
                        <RadiusSlider valueM={radiusM} onChange={setRadiusM} />
                      </div>
                    </>
                  )}

                  {step === "note" && (
                    <>
                      <div>
                        <p className="t-display text-ink mb-1">What should we remind you?</p>
                        <p className="t-body-sm text-ink/60">This is the message you'll see when the rule fires.</p>
                      </div>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="e.g. Buy oat milk"
                        rows={3}
                        maxLength={500}
                        className="t-body w-full px-3 py-2.5 rounded-2xl border border-ink/10 bg-card focus:outline-none focus:border-ink/30 resize-none"
                      />
                      {trigger !== "enter" && (
                        <>
                          <p className="t-eyebrow text-ink/60">Message when leaving (optional)</p>
                          <textarea
                            value={exitMessage}
                            onChange={(e) => setExitMessage(e.target.value)}
                            placeholder="Did you lock the door?"
                            rows={2}
                            maxLength={500}
                            className="t-body w-full px-3 py-2.5 rounded-2xl border border-ink/10 bg-card focus:outline-none focus:border-ink/30 resize-none"
                          />
                        </>
                      )}
                    </>
                  )}

                  {step === "trigger" && (
                    <>
                      <div>
                        <p className="t-display text-ink mb-1">When should it fire?</p>
                        <p className="t-body-sm text-ink/60">On arrival, on leaving, or both.</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(["enter","exit","both"] as Trigger[]).map((t) => (
                          <button
                            key={t}
                            onClick={() => setTrigger(t)}
                            aria-pressed={trigger === t}
                            className={`py-2.5 rounded-xl t-button press border ${trigger === t ? selectedTile : idleTile} text-ink`}
                          >
                            {t === "both" ? "Enter · Exit" : t}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {step === "delivery" && (
                    <>
                      <div>
                        <p className="t-display text-ink mb-1">How should we alert you?</p>
                        <p className="t-body-sm text-ink/60">Loud alarm rings until you dismiss it. Notification is silent heads-up.</p>
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={() => setDelivery("alarm")}
                          aria-pressed={delivery === "alarm"}
                          className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left press ${delivery === "alarm" ? selectedTile : idleTile}`}
                        >
                          <BellRing className="size-5 mt-0.5 text-ink/70" aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="t-body text-ink">Loud alarm</p>
                            <p className="t-meta text-ink/55">Full-screen ring, plays your chosen tone.</p>
                          </div>
                          {delivery === "alarm" && <Check className="size-4 ml-auto text-ink/70" />}
                        </button>
                        <button
                          onClick={() => setDelivery("notification")}
                          aria-pressed={delivery === "notification"}
                          className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left press ${delivery === "notification" ? selectedTile : idleTile}`}
                        >
                          <Bell className="size-5 mt-0.5 text-ink/70" aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="t-body text-ink">Silent notification</p>
                            <p className="t-meta text-ink/55">Quiet heads-up in the notification tray.</p>
                          </div>
                          {delivery === "notification" && <Check className="size-4 ml-auto text-ink/70" />}
                        </button>
                      </div>
                    </>
                  )}

                  {step === "frequency" && (
                    <>
                      <div>
                        <p className="t-display text-ink mb-1">How often?</p>
                        <p className="t-body-sm text-ink/60">Fire every crossing, or just the first one.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => setFrequency("always")}
                          aria-pressed={frequency === "always"}
                          className={`w-full text-left p-4 rounded-2xl border press ${frequency === "always" ? selectedTile : idleTile}`}
                        >
                          <p className="t-body text-ink">Every time</p>
                          <p className="t-meta text-ink/55">Fires each time you enter or leave the radius.</p>
                        </button>
                        <button
                          onClick={() => setFrequency("once")}
                          aria-pressed={frequency === "once"}
                          className={`w-full text-left p-4 rounded-2xl border press ${frequency === "once" ? selectedTile : idleTile}`}
                        >
                          <p className="t-body text-ink">Immediately (just once)</p>
                          <p className="t-meta text-ink/55">Fires the first crossing, then stops.</p>
                        </button>
                      </div>
                    </>
                  )}

                  {step === "review" && (
                    <div className="paper-card p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-ink/60" />
                        <p className="t-body text-ink">{chosenPlace?.name ?? "—"}</p>
                      </div>
                      <p className="t-meta text-ink/60">{chosenPlace?.address}</p>
                      <div className="pt-2 border-t border-ink/10 space-y-1">
                        <p className="t-body-sm text-ink"><b>Radius:</b> {radiusM < 1000 ? `${radiusM} m` : `${(radiusM/1000).toFixed(1)} km`}</p>
                        <p className="t-body-sm text-ink"><b>Remind:</b> {note}</p>
                        {exitMessage && trigger !== "enter" && (
                          <p className="t-body-sm text-ink"><b>On exit:</b> {exitMessage}</p>
                        )}
                        <p className="t-body-sm text-ink"><b>Trigger:</b> {trigger === "both" ? "Enter · Exit" : trigger}</p>
                        <p className="t-body-sm text-ink"><b>Delivery:</b> {delivery === "alarm" ? "Loud alarm" : "Silent notification"}</p>
                        <p className="t-body-sm text-ink"><b>Frequency:</b> {frequency === "always" ? "Every time" : "Immediately (just once)"}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="sticky bottom-0 px-5 py-3 bg-canvas border-t border-ink/5 flex gap-2">
              {step !== "review" ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={nextDisabled}
                  className="t-button w-full py-3 rounded-2xl bg-ink text-canvas disabled:opacity-40"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={save}
                  className="t-button w-full py-3 rounded-2xl bg-ink text-canvas inline-flex items-center justify-center gap-2"
                >
                  <Check className="size-4" /> Save rule
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
