import { createFileRoute, Link } from "@tanstack/react-router";
import { FeatureGate } from "@/components/consumer/FeatureGate";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCcw, ChevronDown, Plus, Pencil } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { GlobalCaptureBar } from "@/components/memory/GlobalCaptureBar";
import { BackHeader } from "@/components/layout/BackHeader";
import { Switch } from "@/components/ui/switch";
import { useRulesCatalog, useUserRules, useSuggestedRules, type RuleDef } from "@/lib/memoryos/rules";
import { SmartPermissionPrompt, type PromptKind } from "@/components/permissions/SmartPermissionPrompt";
import { readPermissions, isAndroid } from "@/lib/permissions/state";
import { NotifyBridge } from "@/lib/notify/bridge";

export const Route = createFileRoute("/_authenticated/rules")({ component: () => <FeatureGate slug="rules"><RulesPage /></FeatureGate> });

const CATEGORY_TINT: Record<string, string> = {
 "Smart tags": "#FFE7C2",
 "Quiet hours": "#D9ECFF",
 "Timing": "#E8DCFF",
 "Routines": "#D6F2E0",
};

function RulesPage() {
  const { catalog, hydrated } = useRulesCatalog();
  const { isOn, toggle, resetRule, state } = useUserRules();
  const suggested = useSuggestedRules();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [pendingPerms, setPendingPerms] = useState<PromptKind[]>([]);
  const [pendingRuleToggle, setPendingRuleToggle] = useState<RuleDef | null>(null);

  const handleToggle = async (r: RuleDef) => {
    const turningOn = !isOn(r);
    if (turningOn) {
      const activeCount = Object.values(state.enabled).filter(Boolean).length;
      const isFirstRule = activeCount === 0;
      if (isFirstRule) {
        const needed: PromptKind[] = [];
        try {
          const snap = await readPermissions();
          if (snap.battery !== "granted") needed.push("battery");
          if (snap.notificationAccess !== "granted" && NotifyBridge.isNative()) needed.push("notification-access");
          if (snap.mic !== "granted") needed.push("mic");
        } catch (e) {
          console.warn("Failed to check JIT permissions on rule toggle:", e);
        }

        if (needed.length > 0) {
          setPendingRuleToggle(r);
          setPendingPerms(needed);
          return;
        }
      }
    }
    toggle(r);
  };

 const groups = useMemo(() => {
 const by: Record<string, RuleDef[]> = {};
 catalog.forEach((r) => {
 const k = r.category ?? "Smart tags";
 (by[k] ??= []).push(r);
 });
 return by;
 }, [catalog]);

 if (!hydrated) {
 return <PhoneFrame><div className="t-body p-8 text-ink/70">Loading…</div><div aria-hidden="true" className="h-40 shrink-0" /><BottomTabs /></PhoneFrame>;
 }

 const hasOverride = (id: string) => state.enabled[id] !== undefined;

 return (
 <PhoneFrame>
 <div className="flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]">
 <div className="flex-1 px-6 pt-6 pb-32">
 <BackHeader />
 <p className="t-eyebrow text-ink/70 mb-2">My rules</p>
 <h1 className="t-display mb-1">Quiet automations.</h1>
 <p className="t-body text-ink/75 mb-6">
 Small If/Then choices that pre-fill the capture wizard.
 Flip what works, ignore what doesn't.
 </p>

 {/* Suggested for you */}
 {suggested.length > 0 && (
 <section className="mb-6 rounded-2xl bg-gradient-to-br from-brand/10 via-brand/5 to-canvas border border-brand/25 p-4">
 <div className="flex items-center gap-2 mb-3">
 <Sparkles className="size-4 text-brand" />
 <p className="t-eyebrow text-brand">Suggested for you</p>
 </div>
 <div className="space-y-2">
 {suggested.map((r) => (
 <div key={r.id} className="bg-white rounded-xl p-3 flex items-start gap-3 border border-ink/5">
 <p className="t-body flex-1 text-ink">{r.sentence}</p>
 <button onClick={() => handleToggle(r)}
 className="t-eyebrow shrink-0 inline-flex items-center gap-1.5 bg-ink text-canvas px-3 py-1.5 rounded-full">
 <Plus className="size-3" /> Add
 </button>
 </div>
 ))}
 </div>
 </section>
 )}

 {/* All rules grouped */}
 <div data-tour="rules-list" className="space-y-6">

 {Object.entries(groups).map(([cat, rules]) => (
 <section key={cat}>
 <div className="flex items-center gap-2 mb-2">
 <span className="inline-block size-2.5 rounded-full" style={{ background: CATEGORY_TINT[cat] || "#eee" }} />
 <p className="t-eyebrow text-ink/70">{cat}</p>
 </div>
 <div className="space-y-2">
 {rules.map((r) => {
 const on = isOn(r);
 return (
 <motion.div
 key={r.id}
 layout
 className="p-4 bg-white rounded-2xl border border-ink/10"
 style={{ background: on ? `linear-gradient(135deg, ${CATEGORY_TINT[cat] ?? "#fff"}33 0%, #ffffff 70%)` : undefined }}
 >
 <div className="flex items-start gap-3">
 <p className="t-body flex-1 text-ink">{r.sentence}</p>
 <Switch checked={on} onCheckedChange={() => handleToggle(r)} aria-label={on ? "Turn off" : "Turn on"} />
 </div>
 <div className="mt-2 flex items-center justify-between">
 <span className="t-eyebrow text-ink/70">
 {on ? "On" : "Off"}{hasOverride(r.id) && " · You changed this"}
 </span>
 {hasOverride(r.id) && (
 <button
 onClick={() => resetRule(r.id)}
 className="t-eyebrow inline-flex items-center gap-1 text-ink/70 hover:text-brand"
 >
 <RotateCcw className="size-3" /> Back to default
 </button>
 )}
 </div>
 </motion.div>
 );
 })}
 </div>
 </section>
 ))}
 </div>

 {/* What "default" means */}
 <div className="t-meta mt-6 rounded-2xl bg-ink/[0.03] border border-ink/10 p-4 text-ink/65">
 <p className=" text-ink mb-1">What "Back to default" does</p>
 <p>
 Reverts the rule to whatever MinDrop shipped it as.
 Your captured thoughts are never touched.
 </p>
 </div>

 {/* Power-user toggle */}
 <button
 onClick={() => setShowAdvanced((s) => !s)}
 data-tour="rules-add"
 className="t-eyebrow mt-5 w-full inline-flex items-center justify-center gap-1.5 text-ink/70 hover:text-brand"
 >
 <Pencil className="size-3" />
 {showAdvanced ? "Hide" : "Show"} advanced — build your own
 <ChevronDown className={`size-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
 </button>

 {showAdvanced && (
 <div className="t-meta mt-3 rounded-2xl border border-dashed border-ink/20 p-4 text-ink/75">
 Custom rules let you wire When → If → Then yourself. Coming soon.
 <Link to="/packs" className="t-eyebrow block mt-3 text-brand">
 + Add rules from a pack
 </Link>
 </div>
 )}
 </div>
 <GlobalCaptureBar />
 <BottomTabs />
 </div>
 <SmartPermissionPrompt
    kind={pendingPerms[0] ?? "notification-access"}
    open={pendingPerms.length > 0}
    onResolved={() => {
      setPendingPerms((prev) => {
        const nextList = prev.slice(1);
        if (nextList.length === 0) {
          if (pendingRuleToggle) {
            toggle(pendingRuleToggle);
            setPendingRuleToggle(null);
          }
        }
        return nextList;
      });
    }}
  />
 </PhoneFrame>
 );
}
