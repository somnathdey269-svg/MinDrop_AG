import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Inbox, Bell, Archive, Trash2, Plus, User, Timer, VolumeX, Target, Lock, RotateCcw, Pencil, Undo2, Brush, Wand2 } from "lucide-react";
import { SummaryTab } from "@/components/notify/summary/SummaryTab";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { SegmentedTabBar } from "@/components/layout/SegmentedTabBar";

import { InboxList } from "@/components/notify/InboxList";
import { InboxFilterBar } from "@/components/notify/InboxFilterBar";

import { RulesList } from "@/components/notify/RulesList";
import { RuleEditorSheet } from "@/components/notify/RuleEditorSheet";
import { NotificationDetailSheet } from "@/components/notify/NotificationDetailSheet";
import { SingleBoxEmpty } from "@/components/onboarding/SingleBoxEmpty";
import { UnifiedRemindersList } from "@/components/reminders/UnifiedRemindersList";
import { HistoryList } from "@/components/history/HistoryList";


import { useInbox, useRules, knownAppsFromInbox } from "@/lib/notify/store";
import { NotifyBridge } from "@/lib/notify/bridge";
import type { CapturedNotification, NotifyRule } from "@/lib/notify/types";
import { useOnboarding } from "@/lib/memoryos/store";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";
import { getReadableAccent } from "@/lib/theme/palette";
import { openPaywall, useTier } from "@/lib/tier";
import { SmartPermissionPrompt, type PromptKind } from "@/components/permissions/SmartPermissionPrompt";
import { shouldPrompt, readPermissions } from "@/lib/permissions/state";

export const Route = createFileRoute("/_authenticated/notify")({
 validateSearch: (s: Record<string, unknown>) => ({
 tab:
 s.tab === "rules" ? ("rules" as const)
 : s.tab === "summary" ? ("summary" as const)
 : s.tab === "archived" ? ("archived" as const)
 : s.tab === "erased" ? ("erased" as const)
 : ("inbox" as const),
 open: s.open === 1 || s.open === "1" ? 1 : undefined,
 title: typeof s.title === "string" ? s.title : undefined,
 note: typeof s.note === "string" ? s.note : undefined,
 }),
 head: () => ({
 meta: [
 { title: "Notify — MinDrop" },
 { name: "description", content: "Capture every incoming notification and turn any of them into a MinDrop alarm." },
 ],
 }),
 component: NotifyPage,
});

type Tab = "inbox" | "rules" | "summary" | "archived" | "erased";

function NotifyPage() {
 const search = Route.useSearch();
 const [tab, setTab] = useState<Tab>(search.tab);
 const { accent2 } = useCountryTheme();
 const [granted, setGranted] = useState<boolean | null>(null);
 const { list: inbox } = useInbox();
 const { list: rules, upsert: upsertRuleRaw, remove: removeRule, setStatus: setRuleStatus, purge, toggle } = useRules();
 const { tier, limits } = useTier();
 const [pendingPerms, setPendingPerms] = useState<PromptKind[]>([]);
 const [pendingRule, setPendingRule] = useState<NotifyRule | null>(null);

 const upsertRule = async (rule: NotifyRule) => {
   const isNew = !rules.some((r) => r.id === rule.id);
   const activeCount = rules.filter((r) => (r.status ?? "active") === "active").length;
   if (isNew && activeCount >= limits.notifyRules) {
     openPaywall({ reason: "notify", tier, limit: limits.notifyRules });
     return;
   }

   const needed: PromptKind[] = [];
   try {
     const snap = await readPermissions();
     // 1 & 2. Rule delivery JIT
     if (rule.delivery === "alarm") {
       if (snap.exactAlarm !== "granted") needed.push("exact-alarm");
     } else {
       if (snap.notifications !== "granted") needed.push("notifications");
     }

     // 3, 5, 6. First rule JIT checks
     const isFirstRule = rules.length === 0;
     if (isFirstRule) {
       if (snap.battery !== "granted") needed.push("battery");
       if (snap.notificationAccess !== "granted" && NotifyBridge.isNative()) needed.push("notification-access");
       if (snap.mic !== "granted") needed.push("mic");
     }
   } catch (e) {
     console.warn("Failed to check JIT permissions on rule save:", e);
   }

   if (needed.length > 0) {
     setPendingRule(rule);
     setPendingPerms(needed);
     return;
   }

   upsertRuleRaw(rule);
 };

 const [editorOpen, setEditorOpen] = useState(false);
 const [editingRule, setEditingRule] = useState<NotifyRule | null>(null);
 const [prefill, setPrefill] = useState<Partial<CapturedNotification> | undefined>(undefined);
 const [detail, setDetail] = useState<CapturedNotification | null>(null);
 const [filterPkg, setFilterPkg] = useState<string | null>(null);
 const [filterQuery, setFilterQuery] = useState("");

 const activeRules = useMemo(() => rules.filter((r) => (r.status ?? "active") === "active"), [rules]);
 const archivedRules = useMemo(() => rules.filter((r) => r.status === "archived"), [rules]);
 const erasedRules = useMemo(() => rules.filter((r) => r.status === "erased"), [rules]);

 const filteredInbox = useMemo(() => {
 const q = filterQuery.trim().toLowerCase();
 return inbox.filter((n) => {
 if (filterPkg && n.pkg !== filterPkg) return false;
 if (!q) return true;
 return (
 n.title.toLowerCase().includes(q) ||
 n.text.toLowerCase().includes(q) ||
 (n.bigText ?? "").toLowerCase().includes(q)
 );
 });
 }, [inbox, filterPkg, filterQuery]);



 useEffect(() => {
 NotifyBridge.hasPermission().then(setGranted);
 }, []);

 useEffect(() => {
 setTab(search.tab);
 }, [search.tab]);

 // Deep-link from Summary suggestions → open editor prefilled with title/note.
 useEffect(() => {
 if (search.open === 1 && search.tab === "rules" && !editorOpen) {
   const pf: Partial<CapturedNotification> = {
     title: search.title ?? "",
     text: search.note ?? "",
   };
   setEditingRule(null);
   setPrefill(pf);
   setEditorOpen(true);
   // Clear the query so refresh doesn't re-open.
   void navigate({ to: "/notify", search: { tab: "rules" as const }, replace: true });
 }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [search.open, search.tab, search.title, search.note]);

 const knownApps = useMemo(() => knownAppsFromInbox(inbox), [inbox]);

 const [pendingPrefill, setPendingPrefill] = useState<Partial<CapturedNotification> | undefined>(undefined);
 const navigate = useNavigate();
 const openNew = async (pf?: Partial<CapturedNotification>) => {
   if (state.plan === "free" && activeRules.length >= 3) {
     navigate({ to: "/paywall" });
     return;
   }
   // JIT: ask for first rule setup permissions
   const isFirstRule = rules.length === 0;
   if (isFirstRule) {
     try {
       const snap = await readPermissions();
       const needed: PromptKind[] = [];
       if (snap.battery !== "granted") needed.push("battery");
       if (snap.notificationAccess !== "granted" && NotifyBridge.isNative()) needed.push("notification-access");

       if (needed.length > 0) {
         setPendingPrefill(pf);
         setPendingPerms(needed);
         return;
       }
     } catch (e) {
       console.warn("Failed to check first-rule JIT permissions:", e);
     }
   } else {
     // JIT check fallback for single linked notification access if not first rule
     if (NotifyBridge.isNative() && granted === false && shouldPrompt("notification-access")) {
       setPendingPrefill(pf);
       setPendingPerms(["notification-access"]);
       return;
     }
   }
   setEditingRule(null);
   setPrefill(pf);
   setEditorOpen(true);
 };
 const openEdit = (r: NotifyRule) => {
 setEditingRule(r);
 setPrefill(undefined);
 setEditorOpen(true);
 };

 const isPreview = !NotifyBridge.isNative();
 const isInboxFresh = tab === "inbox" && rules.length === 0 && inbox.length === 0;
 const { state } = useOnboarding();

 const order: Tab[] = ["inbox", "rules", "summary", "archived", "erased"];
 const swipeTo = (dir: 1 | -1) => {
 const idx = order.indexOf(tab);
 const next = idx + dir;
 if (next >= 0 && next < order.length) setTab(order[next]);
 };
 const touchRef = { current: null as null | { x: number; y: number } };
 const onTouchStart = (e: React.TouchEvent) => {
 const t = e.touches[0];
 touchRef.current = { x: t.clientX, y: t.clientY };
 };
 const onTouchEnd = (e: React.TouchEvent) => {
 const start = touchRef.current;
 if (!start) return;
 const t = e.changedTouches[0];
 const dx = t.clientX - start.x;
 const dy = t.clientY - start.y;
 touchRef.current = null;
 if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
 swipeTo(dx < 0 ? 1 : -1);
 }
 };

 return (
 <PhoneFrame>
 <SmartPermissionPrompt
   kind={pendingPerms[0] ?? "notification-access"}
   open={pendingPerms.length > 0}
   onResolved={() => {
     setPendingPerms((prev) => {
       const nextList = prev.slice(1);
       if (nextList.length === 0) {
         NotifyBridge.hasPermission().then(setGranted).catch(() => {});
         if (pendingRule) {
           upsertRuleRaw(pendingRule);
           setPendingRule(null);
         } else {
           setEditingRule(null);
           setPrefill(pendingPrefill);
           setEditorOpen(true);
           setPendingPrefill(undefined);
         }
       }
       return nextList;
     });
   }}
 />
 <div
 className="flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]"
 onTouchStart={onTouchStart}
 onTouchEnd={onTouchEnd}
 >
 <div className="flex-1 px-5 sm:px-6 pt-8 pb-32 relative">
 <PageHeader
 eyebrow="Notify"
 title="Turn any ping into a reminder."
 lede="Filter noise, keep what matters."
 accent={accent2}
 />


 {/* Tabs */}
 <div data-tour="notify-tabs">
 <SegmentedTabBar
 ariaLabel="Notify sections"
 accent={accent2}
 layoutId="notify-pill"
 activeId={tab}
 tabs={[
 { id: "inbox", label: "Inbox", icon: Inbox, count: inbox.length, onClick: () => setTab("inbox") },
 { id: "rules", label: "Rules", icon: Target, count: activeRules.length, onClick: () => setTab("rules") },
 { id: "summary", label: "Summary", icon: Wand2, onClick: () => setTab("summary") },
 { id: "archived", label: "Archived", icon: Archive, count: archivedRules.length, onClick: () => setTab("archived") },
 { id: "erased", label: "Erased", icon: Trash2, count: erasedRules.length, onClick: () => setTab("erased") },
 ]}
 />
 </div>


 {state.plan === "free" && (
 (() => {
 const used = Math.min(activeRules.length, 3);
 const pct = (used / 3) * 100;
 const remaining = Math.max(0, 3 - used);
 const full = remaining === 0;
 return (
 <Link
 to="/paywall"
 className="group mb-4 block relative overflow-hidden rounded-2xl border transition"
 style={{
 background: `linear-gradient(135deg, color-mix(in oklab, ${accent2} ${full ? 40 : 22}%, var(--canvas)), color-mix(in oklab, ${accent2} ${full ? 26 : 12}%, var(--canvas)))`,
 borderColor: `color-mix(in oklab, ${accent2} ${full ? 55 : 40}%, transparent)`,
 }}
 >
 <div
 className="absolute inset-y-0 left-0"
 style={{ width: `${pct}%`, background: `color-mix(in oklab, ${accent2} ${full ? 38 : 28}%, transparent)` }}
 aria-hidden="true"
 />
 <div className="relative flex items-center justify-between gap-3 px-4 py-3">
 <div className="flex items-center gap-3 min-w-0">
 <span className="shrink-0 grid place-items-center size-9 rounded-xl" style={{ background: `color-mix(in oklab, ${accent2} 35%, var(--canvas))` }}>
 <Bell className="size-4" style={{ color: getReadableAccent(accent2) }} aria-hidden="true" />
 </span>
 <div className="min-w-0">
 <p className="t-body-sm text-ink">
 {full ? "You're on a roll!" : `${remaining} of 3 rules left`}
 </p>
 <p className="t-meta text-ink/60 mt-0.5">
 {full ? "Unlock unlimited to keep creating rules" : "Free plan · one-time limit"}
 </p>
 </div>
 </div>
 <span className="t-eyebrow shrink-0 px-3 py-1.5 rounded-full text-canvas" style={{ background: getReadableAccent(accent2) }}>
 {full ? "Upgrade" : "Go Pro"}
 </span>
 </div>
 </Link>

 );
 })()
 )}


        {isInboxFresh && (
          <SingleBoxEmpty
            accent={accent2}
            Icon={Inbox}
            eyebrow="Inbox"
            title="Every ping in one place."
            body="Link your notifications and MinDrop keeps them here — turn any into a reminder."
          />
        )}


      <motion.div
 key={tab}
 initial={{ opacity: 0, x: 8 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.18 }}
 >

 {tab === "inbox" && !isInboxFresh && (
 <>
 {isPreview && (
 <div
 className="mb-3 p-3 rounded-2xl border flex items-center justify-between gap-2"
 style={{
 background: `color-mix(in oklab, ${accent2} 5%, var(--canvas))`,
 borderColor: `color-mix(in oklab, ${accent2} 15%, transparent)`,
 }}
 >
 <div className="flex items-center gap-2 min-w-0">
 <Sparkles className="size-3.5 shrink-0" style={{ color: getReadableAccent(accent2) }} />
 <span className="t-meta text-ink/70 truncate">
 Preview mode — inject a mock notification to test.
 </span>
 </div>
 <button
 onClick={() => NotifyBridge.mockPost()}
 className="t-eyebrow shrink-0 px-2 py-1 rounded"
 style={{ color: getReadableAccent(accent2) }}
 >
 + Ping
 </button>
 </div>
 )}
 <InboxFilterBar
 inbox={inbox}
 accent={accent2}
 pkg={filterPkg}
 query={filterQuery}
 onPkgChange={setFilterPkg}
 onQueryChange={setFilterQuery}
 />
 <div data-tour="notify-list">
 <InboxList
 items={filteredInbox}
 accent={accent2}
 onCreateRule={(n) => openNew({ pkg: n.pkg, appName: n.appName, title: n.title, id: n.id })}
 onOpen={(n) => setDetail(n)}
 />
 </div>

 </>
 )}

 {tab === "rules" && (
 activeRules.length === 0 ? (
 <SingleBoxEmpty
 accent={accent2}
 Icon={Target}
 eyebrow="Rules"
 title="Turn any ping into a plan."
 body="Set a rule once — MinDrop watches the apps you pick and nudges you at the exact moment that matters."
 />
 ) : (
 <RulesList
 variant="active"
 rules={activeRules}
 accent={accent2}
 onAdd={() => openNew()}
 onEdit={openEdit}
 onToggle={toggle}
 onDelete={(id) => { if (confirm("Move this rule to Erased?")) removeRule(id); }}
 />
 )
 )}

 {tab === "summary" && (
   <SummaryTab accent={accent2} />
 )}

 {tab === "archived" && (
   <HistoryList origin="notify" status="archived" accent={accent2} />
 )}

 {tab === "erased" && (
   <HistoryList origin="notify" status="erased" accent={accent2} />
 )}
 </motion.div>
 </div>

 {/* Floating CTA pill — prompts linkage until permission granted, then switches to rule creation */}
 {(() => {
 const isLinked = granted === true;
 const label = isLinked ? "Set your rules" : "Link your notification";
 return (
 <motion.button
 onClick={() => openNew()}
 whileTap={{ scale: 0.94 }}
 whileHover={{ y: -1 }}
 transition={{ type: "spring", stiffness: 500, damping: 30 }}
 aria-label={label}
 className="t-button fixed bottom-8 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 pl-4 pr-5 py-3.5 rounded-full bg-ink text-canvas press whitespace-nowrap"
 style={{
 boxShadow: "0 10px 30px -8px rgba(26,26,26,0.4), 0 2px 6px rgba(26,26,26,0.2)",
 }}
 >
 <Plus className="size-4" aria-hidden="true" />
 {label}
 </motion.button>
 );
 })()}

 <div aria-hidden="true" className="h-40 shrink-0" />

 <BottomTabs />
 </div>


 <RuleEditorSheet
 open={editorOpen}
 accent={accent2}
 onClose={() => setEditorOpen(false)}
 onSave={upsertRule}
 rule={editingRule}
 prefill={prefill}
 knownApps={knownApps}
 />
 <NotificationDetailSheet
 notification={detail}
 accent={accent2}
 onClose={() => setDetail(null)}
 onCreateRule={(n) => { setDetail(null); openNew({ pkg: n.pkg, appName: n.appName, title: n.title, id: n.id }); }}
 />
 </PhoneFrame>

 );
}
