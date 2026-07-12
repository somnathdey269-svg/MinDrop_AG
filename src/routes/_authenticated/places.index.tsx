import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, MapPin, Zap, Archive, Pin, SlidersHorizontal, Mail, Footprints, Clock, Brush, Undo2, Package, Bell, Pencil, Pause, Play } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlacesTabs, type PlacesTab } from "@/components/places/PlacesTabs";
import { PlaceCard } from "@/components/places/PlaceCard";
import { EventRow } from "@/components/places/EventRow";
import { TabEmpty } from "@/components/onboarding/TabEmpty";
import { SingleBoxEmpty } from "@/components/onboarding/SingleBoxEmpty";
import { PlaceRuleEditorSheet } from "@/components/places/RuleEditorSheet";
import { UnifiedRemindersList } from "@/components/reminders/UnifiedRemindersList";
import { HistoryList } from "@/components/history/HistoryList";

import { usePlaces, usePlaceEvents } from "@/lib/places/store";
import { usePlaceRules } from "@/lib/places/rules";
import { testFireRule } from "@/lib/places/runtime";
import { haversineMeters } from "@/lib/places/engine";
import type { PlaceRule } from "@/lib/places/types";
import { useOnboarding } from "@/lib/memoryos/store";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";
import { getReadableAccent } from "@/lib/theme/palette";
import { openPaywall, useTier } from "@/lib/tier";

export const Route = createFileRoute("/_authenticated/places/")({
  validateSearch: (
    s: Record<string, unknown>,
  ): { tab?: PlacesTab } => {
    const t = s.tab;
    return {
      tab: (t === "saved" || t === "rules" || t === "archived" || t === "erased") ? t : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Places — MinDrop" },
      { name: "description", content: "Save a spot, add rules that fire when you arrive." },
      { property: "og:title", content: "Places — MinDrop" },
      { property: "og:description", content: "Location-triggered reminders that stay on your device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlacesIndex,
});

function useCurrentPosition() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    const id = navigator.geolocation.watchPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, maximumAge: 30_000, timeout: 15_000 },
    );
    return () => { try { navigator.geolocation.clearWatch(id); } catch {} };
  }, []);
  return pos;
}

function PlacesIndex() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { list, patch, remove } = usePlaces();
  const { list: events, clear } = usePlaceEvents();
  const { list: rules, upsert: upsertRule, remove: removeRule, patch: patchRule } = usePlaceRules();
  const [tab, setTab] = useState<PlacesTab>(search.tab ?? "saved");
  const [granted, setGranted] = useState<boolean | null>(null);
  const pos = useCurrentPosition();
  const { accent3 } = useCountryTheme();
  const { state } = useOnboarding();
  const { tier, limits } = useTier();

  const [ruleEditorOpen, setRuleEditorOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PlaceRule | null>(null);

  useEffect(() => { setTab(search.tab ?? "saved"); }, [search.tab]);

  useEffect(() => {
    const flag = window.localStorage.getItem("mindrop.places.granted") === "1";
    if (flag) setGranted(true);
    else if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" as PermissionName }).then((res) => {
        setGranted(res.state === "granted");
        res.onchange = () => setGranted(res.state === "granted");
      }).catch(() => setGranted(false));
    } else setGranted(false);
  }, []);

  useEffect(() => {
    if (granted) window.localStorage.setItem("mindrop.places.granted", "1");
  }, [granted]);

  const saved = useMemo(() => list.filter((p) => !p.archivedAt && !p.deletedAt), [list]);
  const archived = useMemo(() => list.filter((p) => p.archivedAt && !p.deletedAt), [list]);
  const eventsWithPlace = useMemo(
    () => events.map((e) => ({ event: e, place: list.find((p) => p.id === e.placeId) })),
    [events, list],
  );
  const rulesCountByPlace = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rules) m.set(r.placeId, (m.get(r.placeId) ?? 0) + 1);
    return m;
  }, [rules]);
  const activeRules = useMemo(
    () => rules.filter((r) => {
      const p = list.find((x) => x.id === r.placeId);
      return p && !p.archivedAt && !p.deletedAt;
    }),
    [rules, list],
  );

  const distanceFor = (lat: number, lng: number) =>
    pos ? haversineMeters(pos.lat, pos.lng, lat, lng) : null;

  const openNewRule = (placeId?: string) => {
    if (state.plan === "free" && activeRules.length >= limits.places) {
      openPaywall({ reason: "places", tier, limit: limits.places });
      return;
    }
    setEditingRule(placeId ? ({
      id: `pr-${Date.now().toString(36)}`,
      placeId,
      radiusM: 200,
      message: "",
      trigger: "enter",
      frequency: "always",
      paused: false,
      createdAt: new Date().toISOString(),
    } as PlaceRule) : null);
    setRuleEditorOpen(true);
  };

  const openEditRule = (r: PlaceRule) => {
    setEditingRule(r);
    setRuleEditorOpen(true);
  };

  const cta =
    tab === "rules" ? { label: saved.length === 0 ? "Save a place first" : "+ New rule", onClick: () => saved.length === 0 ? navigate({ to: "/places/new" }) : openNewRule() }
    : { label: "Save a place", onClick: () => {
        if (state.plan === "free" && saved.length >= limits.places) {
          navigate({ to: "/paywall" });
          return;
        }
        navigate({ to: "/places/new" });
      } };

  return (
    <PhoneFrame>
      <PlaceRuleEditorSheet
        open={ruleEditorOpen}
        accent={accent3}
        places={list}
        rule={editingRule && rules.find((r) => r.id === editingRule.id) ? editingRule : (editingRule && !rules.find((r) => r.id === editingRule.id) ? null : null)}
        onClose={() => { setRuleEditorOpen(false); setEditingRule(null); }}
        onSave={(r) => { upsertRule(r); }}
        onSaveNewPlace={() => navigate({ to: "/places/new" })}
      />
      <div className="flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]">
        <div className="flex-1 px-6 pt-8 pb-32 relative">
          <PageHeader
            eyebrow="Places"
            title="Places that remember for you."
            lede="Save a spot, get a nudge on arrival."
            accent={accent3}
          />

          <PlacesTabs
            activeId={tab}
            onSelect={(t) => { setTab(t); navigate({ to: "/places", search: { tab: t } as any, replace: true }); }}
            savedCount={saved.length}
            rulesCount={activeRules.length}
            archivedCount={archived.length}
          />


          {state.plan === "free" && (
            (() => {
              const used = Math.min(saved.length, 3);
              const pct = (used / 3) * 100;
              const remaining = Math.max(0, 3 - used);
              const full = remaining === 0;
              return (
                <Link
                  to="/paywall"
                  className="group mb-4 block relative overflow-hidden rounded-2xl border transition"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in oklab, ${accent3} ${full ? 40 : 22}%, var(--canvas)), color-mix(in oklab, ${accent3} ${full ? 26 : 12}%, var(--canvas)))`,
                    borderColor: `color-mix(in oklab, ${accent3} ${full ? 55 : 40}%, transparent)`,
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{ width: `${pct}%`, background: `color-mix(in oklab, ${accent3} ${full ? 38 : 28}%, transparent)` }}
                    aria-hidden="true"
                  />
                  <div className="relative flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0 grid place-items-center size-9 rounded-xl" style={{ background: `color-mix(in oklab, ${accent3} 35%, var(--canvas))` }}>
                        <MapPin className="size-4" style={{ color: getReadableAccent(accent3) }} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="t-body-sm text-ink">
                          {full ? "You're on a roll!" : `${remaining} of 3 places left`}
                        </p>
                        <p className="t-meta text-ink/60 mt-0.5">
                          {full ? "Unlock unlimited to keep saving places" : "Free plan · one-time limit"}
                        </p>
                      </div>
                    </div>
                    <span className="t-eyebrow shrink-0 px-3 py-1.5 rounded-full text-canvas" style={{ background: getReadableAccent(accent3) }}>
                      {full ? "Upgrade" : "Go Pro"}
                    </span>
                  </div>
                </Link>
              );
            })()
          )}

          {tab === "saved" && list.length === 0 && events.length === 0 && (
            <SingleBoxEmpty
              accent={accent3}
              Icon={Pin}
              eyebrow="Saved"
              title="Save a spot. Add a rule."
              body="Places is your address book. Rules turn those spots into reminders that fire when you arrive."
            />
          )}


          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >

              {tab === "saved" && (
                saved.length === 0 ? (
                  list.length === 0 && events.length === 0 ? null : (
                    <TabEmpty
                      accent={accent3}
                      Icon={MapPin}
                      eyebrow="Saved"
                      title="Pin the spots that matter."
                      body="Save the address book. Rules that fire live in the Rules tab."
                      cards={[
                        { icon: Pin, title: "Drop a pin", body: "Shop, gym, friend's place." },
                        { icon: SlidersHorizontal, title: "Add rules later", body: "One place, many rules." },
                        { icon: Mail, title: "Get the nudge", body: "Only when you arrive." },
                      ]}
                      cta={{ label: "+ Save your first place", onClick: () => navigate({ to: "/places/new" }) }}
                    />
                  )
                ) : (
                  <ul data-tour="places-list" className="space-y-3">
                    {saved.map((p) => (
                      <li key={p.id}>
                        <PlaceCard
                          place={p}
                          distanceM={distanceFor(p.lat, p.lng)}
                          rulesCount={rulesCountByPlace.get(p.id) ?? 0}
                          onAddRule={() => openNewRule(p.id)}
                          onEdit={() => navigate({ to: "/places/$placeId", params: { placeId: p.id } })}
                          onPause={() => patch(p.id, { paused: !p.paused })}
                          onArchive={() => patch(p.id, { archivedAt: new Date().toISOString() })}
                        />
                      </li>
                    ))}
                  </ul>
                )
              )}

              {tab === "rules" && (
                activeRules.length === 0 ? (
                  <SingleBoxEmpty
                    accent={accent3}
                    Icon={SlidersHorizontal}
                    eyebrow="Rules"
                    title="Turn a place into a nudge."
                    body="Pick one of your saved places, set the radius, message, trigger. Save. That's the reminder."
                  />
                ) : (
                  <ul className="space-y-2">
                    {activeRules.map((r) => {
                      const p = list.find((x) => x.id === r.placeId)!;
                      return (
                        <li key={r.id} className="paper-card p-3">
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5" aria-hidden="true">{p.emoji ?? "📍"}</span>
                            <div className="min-w-0 flex-1">
                              <p className="t-body text-ink">{r.message}</p>
                              <p className="t-meta text-ink/55 truncate">
                                {p.name} · {r.radiusM < 1000 ? `${r.radiusM}m` : `${(r.radiusM/1000).toFixed(1)}km`} · {r.trigger === "both" ? "enter·exit" : r.trigger} · {r.frequency === "always" ? "every time" : "once"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-[color:var(--hairline)] flex items-center justify-end gap-1">
                            <button type="button" onClick={() => testFireRule(p, r)} aria-label="Test fire" className="grid place-items-center size-8 rounded-full hover:bg-canvas press text-ink/60">
                              <Zap className="size-4" />
                            </button>
                            <button type="button" onClick={() => patchRule(r.id, { paused: !r.paused })} aria-label={r.paused ? "Resume" : "Pause"} className="grid place-items-center size-8 rounded-full hover:bg-canvas press text-ink/60">
                              {r.paused ? <Play className="size-4" /> : <Pause className="size-4" />}
                            </button>
                            <button type="button" onClick={() => openEditRule(r)} aria-label="Edit rule" className="grid place-items-center size-8 rounded-full hover:bg-canvas press text-ink/60">
                              <Pencil className="size-4" />
                            </button>
                            <button type="button" onClick={() => { if (confirm("Erase this rule?")) removeRule(r.id); }} aria-label="Erase rule" className="grid place-items-center size-8 rounded-full hover:bg-canvas press text-ink/60">
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )
              )}

              {tab === "archived" && (
                <HistoryList origin="places" status="archived" accent={accent3} />
              )}

              {tab === "erased" && (
                <HistoryList origin="places" status="erased" accent={accent3} />
              )}



              {/* Triggered + Archived tabs moved to Settings › History */}
            </motion.div>
          </AnimatePresence>

          {(() => {
            const pillCta = cta;
            return (
              <motion.button
                onClick={pillCta.onClick}
                whileTap={{ scale: 0.94 }}
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                aria-label={pillCta.label}
                data-tour="places-add"
                className="t-button fixed bottom-8 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 pl-4 pr-5 py-3.5 rounded-full bg-ink text-canvas press"
                style={{ boxShadow: "0 10px 30px -8px rgba(26,26,26,0.4), 0 2px 6px rgba(26,26,26,0.2)" }}
              >
                <Plus className="size-4" aria-hidden="true" />
                {pillCta.label}
              </motion.button>
            );
          })()}

        </div>
        <div aria-hidden="true" className="h-40 shrink-0" />
        <BottomTabs />
      </div>
    </PhoneFrame>
  );
}
// unused-import guard
void Bell;
