import { useEffect, useMemo, useState } from "react";
import { Bell, Clock, MapPin } from "lucide-react";
import { WelcomeBanner, type WelcomeSlide } from "@/components/memory/WelcomeBanner";
import { readPlaceRules } from "@/lib/places/rules";
import { readPlaces } from "@/lib/places/store";
import { readRules as readNotifyRules } from "@/lib/notify/store";
import type { PlaceRule, Place } from "@/lib/places/types";
import type { NotifyRule } from "@/lib/notify/types";
import type { Memory } from "@/lib/memoryos/types";

const MEM_KEY = "memoryos.memories.v1";

type Origin = "later" | "notify" | "places";

type Item = {
  key: string;
  kind: "time" | "notify" | "place";
  title: string;
  subtitle: string;
  Icon: typeof Bell;
};

function readMemories(): Memory[] {
  try {
    const raw = window.localStorage.getItem(MEM_KEY);
    return raw ? (JSON.parse(raw) as Memory[]) : [];
  } catch { return []; }
}

function buildItems(): Item[] {
  const items: Item[] = [];
  for (const m of readMemories()) {
    if (!m.dueAt) continue;
    if (m.archivedAt || m.deletedAt || m.firedAt) continue;
    const when = new Date(m.dueAt);
    items.push({
      key: `mem-${m.id}`,
      kind: "time",
      title: m.text,
      subtitle: when.toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      Icon: Clock,
    });
  }
  const nrules = readNotifyRules().filter((r: NotifyRule) => (r.status ?? "active") === "active" && r.enabled);
  for (const r of nrules) {
    items.push({
      key: `nrule-${r.id}`,
      kind: "notify",
      title: r.remindNote?.trim() || `${r.appName} · ${r.senderMatch || "anything"}`,
      subtitle: `Notify · ${r.appName}${r.remindMode === "after" ? ` · after ${r.afterHours || 0}h ${r.afterMinutes || 0}m` : " · immediately"}`,
      Icon: Bell,
    });
  }
  const places: Place[] = readPlaces();
  const placesById = new Map(places.map((p) => [p.id, p]));
  for (const r of readPlaceRules() as PlaceRule[]) {
    if (r.paused) continue;
    const p = placesById.get(r.placeId);
    if (!p || p.archivedAt || p.deletedAt) continue;
    items.push({
      key: `prule-${r.id}`,
      kind: "place",
      title: r.message,
      subtitle: `${p.emoji ?? "📍"} ${p.name} · ${r.radiusM < 1000 ? `${r.radiusM}m` : `${(r.radiusM/1000).toFixed(1)}km`} · ${r.trigger === "both" ? "enter·exit" : r.trigger}`,
      Icon: MapPin,
    });
  }
  return items;
}

const SLIDES: Record<Origin, WelcomeSlide[]> = {
  later: [
    { kicker: "Start here", title: "Your mind wasn't built to store everything.", body: "Capture the small stuff — where you parked, what your friend said, the password you'll forget by Tuesday. We'll bring it back exactly when you need it." },
    { kicker: "How it works", title: "Drop it in. Forget it. We hand it back.", body: "Type a thought, pick when it matters, choose a nudge. MinDrop stays quiet until the moment you need it." },
    { kicker: "Private by design", title: "Your thoughts never leave your pocket.", body: "Free memories live on your device. Premium syncs to your own personal cloud. No ads. No tracking." },
  ],
  notify: [
    { kicker: "Start here", title: "Turn any ping into a plan.", body: "Filter noisy apps — WhatsApp, banks, delivery. Pick a sender, a keyword, an app. The rest stays out of the way." },
    { kicker: "How it works", title: "Match the ping. Set the follow-up.", body: "Choose an app and sender, decide when to be reminded — right away or after a delay — MinDrop nudges you at the moment it matters." },
    { kicker: "Private by design", title: "Notifications never leave your device.", body: "MinDrop reads what your phone shows — locally. Nothing about who messaged you or what they said ever reaches us." },
  ],
  places: [
    { kicker: "Start here", title: "Nudged when you arrive.", body: "Save a spot, add a rule. MinDrop wakes only when you cross the line — everything on-device." },
    { kicker: "How it works", title: "Drop a pin. Add a rule.", body: "Pick a radius, write the message, choose enter or exit. One place can carry many rules." },
    { kicker: "Private by design", title: "Your location never leaves your phone.", body: "MinDrop watches the geofence only. No location history, no map company, no server ever sees where you are." },
  ],
};

const START_HERE: Record<Origin, string> = {
  later: "Tap Capture a thought below — one tiny thing on your mind.",
  notify: "Tap Link your notification below to pick your first app.",
  places: "Tap Save a place below to drop your first pin.",
};

export function UnifiedRemindersList({ accent, origin = "notify" }: { accent: string; origin?: Origin }) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const refresh = () => setItems(buildItems());
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === MEM_KEY || e.key.startsWith("mindrop.notify.") || e.key.startsWith("mindrop.places.")) {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent} ${pct}%, ${base})`;

  const grouped = useMemo(() => ({
    time: items.filter((i) => i.kind === "time"),
    notify: items.filter((i) => i.kind === "notify"),
    place: items.filter((i) => i.kind === "place"),
  }), [items]);

  if (items.length === 0) {
    return (
      <div className="pt-2 pb-6">
        <WelcomeBanner compact={false} accent={accent} slides={SLIDES[origin]} />
        <div
          className="rounded-2xl border px-4 py-3"
          style={{ background: tint(6), borderColor: tint(20) }}
        >
          <p className="t-eyebrow mb-1" style={{ color: accent }}>Start here</p>
          <p className="t-meta text-ink/75">{START_HERE[origin]}</p>
        </div>
      </div>
    );
  }


  const Section = ({ label, list, Icon }: { label: string; list: Item[]; Icon: typeof Bell }) => (
    list.length === 0 ? null : (
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon className="size-3.5" style={{ color: accent }} />
          <p className="t-eyebrow text-ink/60">{label} · {list.length}</p>
        </div>
        <ul className="space-y-2">
          {list.map((i) => (
            <li key={i.key} className="paper-card p-3">
              <p className="t-body text-ink line-clamp-2">{i.title}</p>
              <p className="t-meta text-ink/55 mt-1 truncate">{i.subtitle}</p>
            </li>
          ))}
        </ul>
      </section>
    )
  );

  return (
    <div className="space-y-5">
      <Section label="Time" list={grouped.time} Icon={Clock} />
      <Section label="Notify" list={grouped.notify} Icon={Bell} />
      <Section label="Places" list={grouped.place} Icon={MapPin} />
    </div>
  );
}
