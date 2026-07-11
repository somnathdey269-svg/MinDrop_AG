import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Archive, Lock, CalendarClock, Trash2, Bell, AlarmClock, Clock, Mic } from "lucide-react";
import { VoicePlayer } from "@/components/memory/VoicePlayer";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { DoItLaterTabs } from "@/components/layout/DoItLaterTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { useDoItLaterSwipe } from "@/components/layout/useDoItLaterSwipe";
import { GlobalCaptureBar } from "@/components/memory/GlobalCaptureBar";
import { EditMemorySheet } from "@/components/memory/EditMemorySheet";
import { TabEmpty } from "@/components/onboarding/TabEmpty";
import { useOnboarding, useMemories } from "@/lib/memoryos/store";
import type { Memory } from "@/lib/memoryos/types";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

export const Route = createFileRoute("/recovery")({
 component: Recovery,
 validateSearch: (s: Record<string, unknown>) => ({
 tab: s.tab === "erased" ? ("erased" as const) : ("archived" as const),
 }),
});

type TabId = "archived" | "deleted";

function Recovery() {
 const navigate = useNavigate();
 const swipe = useDoItLaterSwipe();
 const { accent1 } = useCountryTheme();
 const search = Route.useSearch();
 const { state, hydrated } = useOnboarding();
 const { list: memories, softDelete, remove, update, persist: persistMemories } = useMemories();
 const tab: TabId = search.tab === "erased" ? "deleted" : "archived";
 const [rescheduling, setRescheduling] = useState<Memory | null>(null);
 const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent1} ${pct}%, ${base})`;

 useEffect(() => { if (hydrated && !state.onboarded) navigate({ to: "/splash" }); }, [hydrated, state.onboarded, navigate]);

 useEffect(() => {
 const tick = () => {
 const now = Date.now();
 let changed = false;
 const next = memories.map((m) => {
 if (m.archivedAt || m.deletedAt || !m.dueAt) return m;
 if (new Date(m.dueAt).getTime() > now) return m;
 if (m.recurrence === "daily") {
 const d = new Date(m.dueAt); d.setDate(d.getDate() + 1);
 changed = true;
 return { ...m, dueAt: d.toISOString() };
 }
 changed = true;
 return { ...m, archivedAt: new Date().toISOString() };
 });
 if (changed) persistMemories(next);
 };
 tick();
 const id = window.setInterval(tick, 30_000);
 return () => window.clearInterval(id);
 }, [memories, persistMemories]);

 const isFree = state.plan === "free";
 const cutoffMs = isFree ? 7 * 24 * 60 * 60 * 1000 : Infinity;
 const now = Date.now();
 const within = (iso?: string) => !iso || (now - new Date(iso).getTime()) <= cutoffMs;

 const archived = memories
 .filter((m) => m.archivedAt && !m.deletedAt && within(m.archivedAt))
 .sort((a, b) => (b.archivedAt || "").localeCompare(a.archivedAt || ""));
 const deleted = memories
 .filter((m) => m.deletedAt && within(m.deletedAt))
 .sort((a, b) => (b.deletedAt || "").localeCompare(a.deletedAt || ""));

 const trimmedCount = memories.filter((m) => (m.archivedAt || m.deletedAt) && !within(m.archivedAt || m.deletedAt)).length;
 const list = tab === "archived" ? archived : deleted;

 const handleResetSave = (patch: Partial<Memory>) => {
 if (!rescheduling) return;
 update(rescheduling.id, { ...patch, archivedAt: undefined, deletedAt: undefined });
 setRescheduling(null);
 };

 return (
 <PhoneFrame>
 <div {...swipe} className="flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]">
 <div className="flex-1 px-6 pt-8 pb-32 relative">
 <PageHeader
 eyebrow={`Do it Later · ${tab === "archived" ? "Archived" : "Erased"}`}
 title={tab === "archived" ? "Already fired." : "Erased, not gone."}
 lede={tab === "archived" ? "Restore a reminder and send it back to Later." : "Reset a thought and bring it back to Later — or erase it forever."}
 accent={accent1}
 />
 <DoItLaterTabs />

 <motion.div
 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
 className="mb-4 flex items-center gap-3 p-3 rounded-2xl border" data-tour="recovery-tabs"
 style={{
 background: `linear-gradient(135deg, ${tint(22, "var(--canvas)")} 0%, ${tint(10, "var(--canvas)")} 100%)`,
 borderColor: tint(42),
 }}
 >
 <div className="size-8 rounded-lg grid place-items-center shrink-0" style={{ background: tint(28, "var(--canvas)") }}>
 {tab === "archived" ? <Archive className="size-3.5" style={{ color: accent1 }} aria-hidden="true" /> : <Trash2 className="size-3.5" style={{ color: accent1 }} aria-hidden="true" />}
 </div>
 <p className="t-meta text-ink/80">
 {tab === "archived" ? "Thoughts that already fired." : "Thoughts you erased."} <span className="t-display">Reset</span>{" "}
 {tab === "archived" ? "to send them back to Later." : "to bring one back."}
 {isFree && <> · Free keeps <span className="">7 days</span>.</>}
 </p>
 </motion.div>

 {list.length === 0 ? (
 <TabEmpty
 accent={accent1}
 Icon={tab === "archived" ? Archive : Trash2}
 eyebrow={tab === "archived" ? "Archives are empty" : "Nothing erased"}
 title={tab === "archived" ? "Already fired reminders wait here." : "Erased thoughts pause here."}
 body={tab === "archived" ? "When a reminder fires, it lands here with the same Later styling — reset it when that thought matters again." : "Deleted thoughts stay here briefly before they disappear — restore one or remove it forever."}
 cards={tab === "archived" ? [
 { icon: Archive, title: "Fired", body: "Completed reminders collect here." },
 { icon: CalendarClock, title: "Reset", body: "Send one back to Later." },
 { icon: Trash2, title: "Erase", body: "Clear what you no longer need." },
 ] : [
 { icon: Trash2, title: "Held briefly", body: "Not gone immediately." },
 { icon: CalendarClock, title: "Restore", body: "Bring it back to Later." },
 { icon: Lock, title: "Free keeps 7 days", body: "Premium keeps more history." },
 ]}
 />
 ) : (
 <div data-tour="recovery-list" className="space-y-2">
 {list.map((m) => {
 const stamp = tab === "archived" ? m.archivedAt : m.deletedAt;
 return (
 <motion.article key={m.id}
 initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
 className="rounded-xl border px-2.5 py-2"
 style={{
 borderColor: tint(32),
 background: `linear-gradient(135deg, ${tint(14, "var(--canvas)")} 0%, ${tint(5, "var(--canvas)")} 100%)`,
 }}
 >
 <div className="flex items-center gap-2">
 <div className="t-body shrink-0 size-7 rounded-lg grid place-items-center" style={{ background: tint(26, "var(--canvas)"), color: accent1 }} aria-hidden="true">
 {m.audioUrl ? <Mic className="size-3.5" /> : tab === "archived" ? <Archive className="size-3.5" /> : <Trash2 className="size-3.5" />}
 </div>
 <div className="flex-1 min-w-0">
 <p className="t-body-sm text-ink truncate">{m.text}</p>
 <div className="t-meta mt-0.5 flex items-center gap-x-2 gap-y-0.5 text-ink/60 flex-wrap">
 <span className="inline-flex items-center gap-0.5"><Clock className="size-2.5" aria-hidden="true" />{m.date || m.time}</span>
 {m.notify && (
 <span className="inline-flex items-center gap-0.5">
 {m.notify === "alarm" ? <><AlarmClock className="size-2.5" aria-hidden="true" /> Alarm</> : <><Bell className="size-2.5" aria-hidden="true" /> Notify</>}
 </span>
 )}
 {stamp && <span className="text-ink/45">· {tab === "archived" ? "Archived" : "Erased"} {new Date(stamp).toLocaleString([], { month: "short", day: "numeric" })}</span>}
 </div>
 </div>
 <div className="flex items-center gap-1 shrink-0">
 <button onClick={() => setRescheduling(m)} aria-label="Reset for future" className="inline-flex items-center justify-center size-8 rounded-full border" style={{ color: accent1, background: tint(12, "var(--canvas)"), borderColor: tint(30) }}>
 <CalendarClock className="size-3.5" aria-hidden="true" />
 </button>
 <button onClick={() => (tab === "deleted" ? remove(m.id) : softDelete(m.id))} aria-label={tab === "deleted" ? "Erase forever" : "Erase"} className="inline-flex items-center justify-center size-8 rounded-full border" style={{ color: accent1, background: tint(8, "var(--canvas)"), borderColor: tint(24) }}>
 <Trash2 className="size-3.5" aria-hidden="true" />
 </button>
 </div>
 </div>
 {m.audioUrl && <div className="mt-1.5 pl-9"><VoicePlayer src={m.audioUrl} knownDuration={m.audioDuration} /></div>}
 </motion.article>
 );
 })}
 </div>
 )}

 {isFree && trimmedCount > 0 && (
 <Link to="/paywall" className="mt-5 flex items-center gap-3 p-3 rounded-2xl border border-dashed transition" style={{ background: tint(7, "var(--canvas)"), borderColor: tint(30) }}>
 <Lock className="size-4 shrink-0" style={{ color: accent1 }} aria-hidden="true" />
 <div className="min-w-0">
 <p className="t-meta text-ink">{trimmedCount} older item{trimmedCount === 1 ? "" : "s"} hidden</p>
 <p className="t-meta text-ink/75">Keep them forever with Premium →</p>
 </div>
 </Link>
 )}
 </div>
 <GlobalCaptureBar />
 <div aria-hidden="true" className="h-40 shrink-0" />
 <BottomTabs />
 </div>

 <EditMemorySheet open={!!rescheduling} memory={rescheduling} onClose={() => setRescheduling(null)} onSave={handleResetSave} />
 </PhoneFrame>
 );
}
