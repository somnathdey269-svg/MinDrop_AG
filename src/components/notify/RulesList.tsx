import { motion } from "framer-motion";
import { Archive, Bell, MessageCircle, Clock, Zap, RefreshCw, Trash, Undo, Pencil, RotateCcw, Trash2, Undo2, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { NotifyRule } from "@/lib/notify/types";

type Variant = "active" | "archived" | "erased";

function ruleDescription(r: NotifyRule, accent: string): React.ReactNode {
 let filter: React.ReactNode;
 const mark = (text: React.ReactNode) => <b style={{ color: accent }}>{text}</b>;
 if ((r.matchMode ?? "sender") === "topic") {
 const inc = r.includeAny ?? [];
 filter = inc.length > 0
 ? <>about {mark(<>{inc.slice(0, 3).join(", ")}{inc.length > 3 ? "…" : ""}</>)}</>
 : <>about {mark("anything")}</>;
 } else {
 const sender = r.senderMatch?.trim() || "anyone";
 filter = <>from {mark(sender)}</>;
 }
 let when: React.ReactNode = mark("immediately");
 if (r.remindMode === "after") {
 const h = r.afterHours ?? 0;
 const m = r.afterMinutes ?? 0;
 const parts = [h ? `${h}h` : null, m ? `${m}m` : null].filter(Boolean).join(" ") || "5m";
 when = <>in {mark(parts)}</>;
 }
 const freq = r.frequency ?? "once";
 const freqLabel = freq === "always" ? " · every time" : "";
 const deliveryLabel = (r.delivery ?? "notification") === "alarm"
 ? <> · {mark("ring alarm")}</>
 : <> · {mark("send notification")}</>;
 return (
 <>
 If {mark(r.appName)} {filter}{r.priorityOnly ? <> · {mark("priority")}</> : null} → remind me {when}{freqLabel}{deliveryLabel}
 </>
 );
}

function firedAgo(ms?: number) {
 if (!ms) return null;
 const diff = Date.now() - ms;
 const mins = Math.round(diff / 60000);
 if (mins < 1) return "just now";
 if (mins < 60) return `${mins}m ago`;
 const hrs = Math.round(mins / 60);
 if (hrs < 24) return `${hrs}h ago`;
 const days = Math.round(hrs / 24);
 return `${days}d ago`;
}

export function RulesList({
 rules,
 accent,
 variant = "active",
 onAdd,
 onEdit,
 onToggle,
 onDelete,
 onReuse,
 onRestore,
}: {
 rules: NotifyRule[];
 accent: string;
 variant?: Variant;
 onAdd: () => void;
 onEdit: (r: NotifyRule) => void;
 onToggle: (id: string) => void;
 onDelete: (id: string) => void;
 onReuse?: (id: string) => void;
 onRestore?: (id: string) => void;
}) {
 const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent} ${pct}%, ${base})`;
 const emptyCards = variant === "archived"
 ? {
 eyebrow: "Archived",
 title: "Fired rules land here.",
 body: "The moment a rule pings you, it retires to Archived so your live list stays clean.",
 cards: [
 { icon: Archive, title: "Auto‑retire", body: "One reminder → rule steps aside. No manual cleanup." },
 { icon: RefreshCw, title: "Reuse in a tap", body: "Bring a past rule back the next time the same ping matters." },
 { icon: Pencil, title: "Tweak & relaunch", body: "Edit the timing or sender before you re‑arm it." },
 ],
 }
 : variant === "erased"
 ? {
 eyebrow: "Erased",
 title: "A safety net for deletes.",
 body: "Rules you erase rest here — quietly recoverable until you say otherwise.",
 cards: [
 { icon: Undo, title: "Restore anytime", body: "Change your mind? Send it back to Rules in one tap." },
 { icon: Trash, title: "Purge for good", body: "Permanently remove what you'll never use again." },
 { icon: Sparkles, title: "Zero clutter", body: "Deletes leave your active list — but not your history." },
 ],
 }
 : {
 eyebrow: "How rules work",
 title: "Never miss what matters.",
 body: "Set a rule once — MinDrop watches your pings and nudges you at the right moment.",
 cards: [
 { icon: MessageCircle, title: "Filter by who or what", body: "Match a sender, an app, or a topic keyword." },
 { icon: Clock, title: "Remind on your timing", body: "Now, in 5 minutes, or at a specific time." },
 { icon: Zap, title: "Silence the rest", body: "Only priority pings break through — the rest wait." },
 ],
 };

 return (
 <div className="space-y-3">

 {rules.length === 0 ? (
 <div className="pt-2 pb-6">
 <motion.div
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 className="relative overflow-hidden rounded-3xl border p-5 mb-3"
 style={{ background: `linear-gradient(135deg, ${tint(18, "var(--canvas)")}, ${tint(6, "var(--canvas)")})`, borderColor: tint(28) }}
 >
 <div className="absolute -top-8 -right-8 size-32 rounded-full blur-2xl" style={{ background: tint(14) }} aria-hidden="true" />
 <p className="t-eyebrow mb-2" style={{ color: accent }}>{emptyCards.eyebrow}</p>
 <p className="t-display text-ink mb-2">{emptyCards.title}</p>
 <p className="t-body text-ink/70">{emptyCards.body}</p>
 </motion.div>
 <ul className="space-y-2">
 {emptyCards.cards.map((c, i) => (
 <motion.li
 key={c.title}
 initial={{ opacity: 0, y: 6 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.08 + i * 0.06 }}
 className="flex gap-3 items-start p-4 rounded-2xl border"
 style={{ background: tint(5, "var(--card)"), borderColor: tint(16) }}
 >
 <span className="size-9 rounded-xl grid place-items-center shrink-0" style={{ background: tint(14, "var(--canvas)"), color: accent }}>
 <c.icon className="size-4" />
 </span>
 <div className="min-w-0">
 <p className="t-body-sm text-ink">{c.title}</p>
 <p className="t-meta text-ink/60 mt-0.5">{c.body}</p>
 </div>
 </motion.li>
 ))}
 </ul>
 {variant === "active" && (
 <button
 onClick={onAdd}
 className="t-button w-full mt-3 py-3 rounded-2xl text-canvas transition"
 style={{ background: accent }}
 >
 + Create your first rule
 </button>
 )}
 </div>
 ) : (
 <ul className="space-y-2">
 {rules.map((r, i) => {
 const muted = variant !== "active";
 return (
 <motion.li
 key={r.id}
 initial={{ opacity: 0, y: 6 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: Math.min(i * 0.03, 0.15) }}
 className="p-4 rounded-2xl border"
 style={{ background: muted ? tint(5, "var(--canvas)") : "var(--card)", borderColor: muted ? tint(18) : "var(--hairline)" }}
 >
 <div className="flex gap-3 items-start">
 <button
 onClick={() => onEdit(r)}
 className="flex-1 text-left min-w-0"
 >
 {variant === "archived" && (
 <p className="t-eyebrow mb-1" style={{ color: accent }}>
 Archived{r.lastFiredAt ? ` · fired ${firedAgo(r.lastFiredAt)}` : ""}
 </p>
 )}
 {variant === "erased" && (
 <p className="t-eyebrow text-ink/40 mb-1">
 Erased{r.statusAt ? ` · ${firedAgo(r.statusAt)}` : ""}
 </p>
 )}
 <p className={`t-body ${muted ? "text-ink/50" : r.enabled ? "text-ink" : "text-ink/40"}`}>
 {ruleDescription(r, accent)}
 </p>
 </button>
 {variant === "active" && (
 <Switch
 checked={r.enabled}
 onCheckedChange={() => onToggle(r.id)}
 aria-label={r.enabled ? "Disable rule" : "Enable rule"}
 style={{ "--switch-accent": accent } as React.CSSProperties}
 />
 )}
 </div>
 <div className="flex flex-wrap gap-1 mt-2 -mx-1 opacity-90">
 {variant === "active" && (
 <>
 <button
 onClick={() => onEdit(r)}
 className="t-eyebrow text-ink/60 px-2 py-1 rounded inline-flex items-center gap-1"
 >
 <Pencil className="size-3" /> Edit
 </button>
 <button
 onClick={() => onDelete(r.id)}
 className="t-eyebrow text-ink/60 px-2 py-1 rounded inline-flex items-center gap-1"
 >
 <Trash2 className="size-3" /> Erase
 </button>
 </>
 )}
 {variant === "archived" && (
 <>
 <button
 onClick={() => onReuse?.(r.id)}
 className="t-eyebrow px-2 py-1 rounded inline-flex items-center gap-1"
 style={{ color: accent }}
 >
 <RotateCcw className="size-3" /> Reuse
 </button>
 <button
 onClick={() => onEdit(r)}
 className="t-eyebrow text-ink/60 px-2 py-1 rounded inline-flex items-center gap-1"
 >
 <Pencil className="size-3" /> Edit
 </button>
 <button
 onClick={() => onDelete(r.id)}
 className="t-eyebrow text-ink/60 px-2 py-1 rounded inline-flex items-center gap-1"
 >
 <Trash2 className="size-3" /> Erase
 </button>
 </>
 )}
 {variant === "erased" && (
 <>
 <button
 onClick={() => onRestore?.(r.id)}
 className="t-eyebrow px-2 py-1 rounded inline-flex items-center gap-1"
 style={{ color: accent }}
 >
 <Undo2 className="size-3" /> Restore
 </button>
 <button
 onClick={() => onDelete(r.id)}
 className="t-eyebrow text-ink/60 px-2 py-1 rounded inline-flex items-center gap-1"
 >
 <Trash2 className="size-3" /> Delete forever
 </button>
 </>
 )}
 </div>
 </motion.li>
 );
 })}
 </ul>
 )}
 </div>
 );
}
