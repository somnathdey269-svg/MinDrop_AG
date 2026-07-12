import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Package,
  Bell,
  MapPin,
  Sparkles,
  Archive,
  Mic,
  Users,
  Zap,
  BookOpen,
  ArrowRight,
  Inbox,
  Moon,
  Plus,
  Home,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { BottomTabs } from "@/components/layout/BottomTabs";
import {
  GroupCard,
  GridTile,
} from "@/components/dashboard/SegmentCard";
import { readSegmentUsage, readPinnedPlaces, readReminderCounts, readNotifyDashboardSummary, readNotifyArchivedCount, readPlacesArchivedCount, type SegmentUsage, type PinnedPlaceLite, type NotifyDashboardSummary } from "@/lib/dashboard/usage";
import { useOnboarding } from "@/lib/memoryos/store";
import { useRecallSuggestions } from "@/lib/memoryos/recall";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";
import { getReadableAccent } from "@/lib/theme/palette";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

const SOON_ACCENT = "#8a7f6d"; // muted taupe, not country-themed

/** Keep each room's sub-cards on the exact same country-selected accent.
 *  The tile component already creates light surfaces from this one color. */
function shades(accent: string): [string, string, string, string] {
  return [accent, accent, accent, accent];
}


function Ring({ value, total, color }: { value: number; total: number; color: string }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : value / total;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true" className="shrink-0">
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(26,26,26,0.08)" strokeWidth="3" />
      <circle
        cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
        transform="rotate(-90 28 28)"
      />
      <text x="28" y="32" textAnchor="middle" fontSize="15" fill="var(--ink)">
        {value}<tspan fill="rgba(26,26,26,0.35)" fontSize="10">/{total}</tspan>
      </text>
    </svg>
  );
}

function Dashboard() {
  const { state } = useOnboarding();
  const { accent1, accent2, accent3, name: countryName, flag } = useCountryTheme();
  const laterShades = shades(accent1);
  const notifyShades = shades(accent2);
  const placesShades = shades(accent3);


  const [usage, setUsage] = useState<Record<SegmentUsage["key"], SegmentUsage> | null>(null);
  const [reminderCounts, setReminderCounts] = useState<{ active: number; archived: number }>({ active: 0, archived: 0 });
  const [pinned, setPinned] = useState<PinnedPlaceLite[]>([]);
  const [notifySummary, setNotifySummary] = useState<NotifyDashboardSummary>({ used: false, count: 0, label: "items", tab: "rules" });
  const [notifyArchived, setNotifyArchived] = useState(0);
  const [placesArchived, setPlacesArchived] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setUsage(readSegmentUsage());
      setReminderCounts(readReminderCounts());
      setPinned(readPinnedPlaces(3));
      setNotifySummary(readNotifyDashboardSummary());
      setNotifyArchived(readNotifyArchivedCount());
      setPlacesArchived(readPlacesArchivedCount());
    };
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  // Live recall triggers — rotate every 5s if there are multiple
  const recallSuggestions = useRecallSuggestions();
  const recallTitles = useMemo(
    () => recallSuggestions.map((s) => s.rule.title).filter(Boolean),
    [recallSuggestions],
  );
  const [recallIdx, setRecallIdx] = useState(0);
  useEffect(() => {
    if (recallTitles.length <= 1) return;
    const id = window.setInterval(() => setRecallIdx((i) => (i + 1) % recallTitles.length), 5000);
    return () => window.clearInterval(id);
  }, [recallTitles.length]);
  const currentRecall = recallTitles[recallIdx % Math.max(1, recallTitles.length)];

  const displayName = state.name || state.email?.split("@")[0] || "you";
  const reminders = reminderCounts.active;

  // The 3 rooms
  const laterActive = reminders > 0 || (usage?.packs.active ?? false) || (usage?.recall.active ?? false);
  const notify = notifySummary;
  const places = usage?.places;

  const { done, weekActivity } = useMemo(() => {
    const total = 3;
    let d = 0;
    if (laterActive) d++;
    if (notify.used) d++;
    if (places?.active) d++;
    const week =
      (usage
        ? Object.values(usage).reduce((n, u) => n + u.sparkline.reduce((a, b) => a + b, 0), 0)
        : 0);
    return { done: d, weekActivity: week, total };
  }, [usage, laterActive, notify, places]);

  const isNew = done === 0;

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen md:min-h-[calc(100vh-3rem)]">
        <div className="flex-1 px-5 pt-6 pb-32">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[30px] border border-hairline p-5 shadow-[var(--shadow-lift)]"
            style={{
              background: `linear-gradient(135deg,
                color-mix(in oklab, ${accent1} 6%, var(--canvas)) 0%,
                var(--canvas) 54%,
                color-mix(in oklab, ${accent2} 6%, var(--canvas)) 100%)`,
            }}
          >
            <div className="absolute inset-x-0 top-0 h-1.5" aria-hidden="true">
              <div className="grid h-full grid-cols-3">
                <span style={{ background: accent1 }} />
                <span style={{ background: "color-mix(in oklab, var(--canvas) 85%, white)" }} />
                <span style={{ background: accent2 }} />
              </div>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 top-8 size-36 rounded-full border opacity-20"
              style={{ borderColor: accent3 }}
            />
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <p className="t-eyebrow text-ink/50 truncate">
                <span aria-hidden="true">{flag}</span> <span>{countryName}</span>
              </p>
            </div>
            <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <h1 className="t-display text-ink">
                  Hello, {displayName}.
                </h1>
                <p className="t-body-sm text-ink/65 mt-2 max-w-[28ch]">
                  {isNew
                    ? "Start with three simple reminder flows. Crisp now, useful later."
                    : `${weekActivity} nudges this week · your reminder report is ready.`}
                </p>
              </div>
              <Ring value={done} total={3} color={accent3} />
            </div>
          </motion.section>

          <div className="mt-7 mb-3 flex items-end justify-between gap-3 px-1">
            <p className="t-eyebrow text-ink/45">Your reminder cards</p>
            <span className="t-meta text-ink/40">Swipe inside cards</span>
          </div>

          <section data-tour="dashboard-usage" aria-label="Rooms" className="flex flex-col gap-3">
            {/* ─────────── 1 · Do it Later (composite) ─────────── */}
            <GroupCard
              title="Do it Later"
              tagline="Park ideas, choose routines, and let important notes return."
              icon={Bookmark}
              accent={accent1}
              to="/home"
              eyebrow={laterActive ? undefined : "Start here"}
              action={laterActive ? "Open" : undefined}
              index={0}
            >
              <div className="grid grid-cols-2 gap-2.5">
                <GridTile
                  to="/home"
                  icon={Bookmark}
                  label="Reminder"
                  hint={reminders > 0 ? `${reminders} active ${reminders === 1 ? "reminder" : "reminders"}` : "Save a thought in seconds."}
                  stat={reminders > 0 ? "Active" : "30s"}
                  accent={laterShades[0]}
                />
                <GridTile
                  to="/packs"
                  icon={Package}
                  label="Packs"
                  hint={
                    usage?.packs.active
                      ? `${usage.packs.count} installed`
                      : "Ready-made reminder routines."
                  }
                  stat={usage?.packs.active ? "Used" : "New"}
                  accent={laterShades[1]}
                />
                <Link to="/recall" className="col-span-2 focus:outline-none">
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 26 }}
                    className="relative h-full overflow-hidden rounded-2xl border bg-card p-3 pt-[13px] shadow-[0_6px_18px_-14px_var(--ink)]"
                    style={{ borderColor: `color-mix(in oklab, ${laterShades[2]} 34%, transparent)` }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-[3px]"
                      style={{ background: `linear-gradient(90deg, ${laterShades[2]}, color-mix(in oklab, ${laterShades[2]} 45%, transparent))` }}
                    />
                    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
                      <div
                        className="grid size-8 place-items-center rounded-xl border shrink-0"
                        style={{
                          background: `color-mix(in oklab, ${laterShades[2]} 22%, var(--canvas))`,
                          borderColor: `color-mix(in oklab, ${laterShades[2]} 34%, transparent)`,
                        }}
                      >
                        <Sparkles className="size-[15px]" strokeWidth={1.8} style={{ color: laterShades[2] }} aria-hidden="true" />
                      </div>
                      <p className="t-title text-ink truncate">Recall</p>
                      <span
                        className="t-eyebrow rounded-full px-1.5 py-0.5 shrink-0"
                        style={{
                          color: laterShades[2],
                          background: `color-mix(in oklab, ${laterShades[2]} 22%, var(--canvas))`,
                        }}
                      >
                        {recallTitles.length > 0 ? `${recallTitles.length} trigger${recallTitles.length === 1 ? "" : "s"}` : "Smart"}
                      </span>
                    </div>
                    <div className="mt-2.5 min-h-[34px] relative overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={currentRecall || "empty"}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="t-body-sm text-ink/75 line-clamp-2"
                        >
                          {currentRecall ? `“${currentRecall}”` : "Keep saving — smart triggers show up here."}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    {recallTitles.length > 1 && (
                      <div className="mt-2 flex items-center gap-1" aria-hidden="true">
                        {recallTitles.slice(0, 5).map((_, i) => (
                          <span
                            key={i}
                            className="h-1 rounded-full transition-all"
                            style={{
                              width: i === recallIdx % recallTitles.length ? 14 : 4,
                              background: i === recallIdx % recallTitles.length ? laterShades[2] : `color-mix(in oklab, ${laterShades[2]} 25%, transparent)`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-1 t-eyebrow" style={{ color: laterShades[2] }}>
                      Open recall <ChevronRight className="size-3" aria-hidden="true" />
                    </div>
                  </motion.div>
                </Link>
              </div>
              <Link
                to="/recovery"
                search={{ tab: "archived" } as any}
                className="mt-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border px-3 py-2 transition hover:-translate-y-[1px]"
                style={{
                  background: `color-mix(in oklab, ${accent1} 8%, var(--canvas))`,
                  borderColor: `color-mix(in oklab, ${accent1} 20%, transparent)`,
                }}
              >
                <Archive className="size-3.5" style={{ color: getReadableAccent(accent1) }} aria-hidden="true" />
                <span className="t-meta text-ink/65">
                  {reminderCounts.archived > 0
                    ? `${reminderCounts.archived} reminder${reminderCounts.archived === 1 ? "" : "s"} fired — view history`
                    : "Completed reminders gather here for reference"}
                </span>
                <ArrowRight className="size-3" style={{ color: getReadableAccent(accent1) }} aria-hidden="true" />
              </Link>
            </GroupCard>

            {/* ─────────── 2 · Notify ─────────── */}
            <GroupCard
              title="Notify"
              tagline="Set gentle nudges by time, habit, or quiet-hour rules."
              icon={Bell}
              accent={accent2}
              to="/notify"
              search={{ tab: notify.tab }}
              eyebrow={notify.used ? undefined : "New"}
              action={notify.used ? "Open" : undefined}
              index={1}
            >
              <div className="grid grid-cols-2 gap-2.5">
                <GridTile
                  to="/notify"
                  search={{ tab: "inbox" }}
                  icon={Inbox}
                  label="Inbox"
                  hint={notify.used ? `${notify.count} ${notify.label} · tap to open` : "Link notifications to see them here."}
                  stat={notify.used ? String(notify.count) : "Link"}
                  accent={notifyShades[0]}
                />
                <GridTile
                  to="/notify"
                  search={{ tab: "rules" }}
                  icon={Bell}
                  label="Rules"
                  hint="Nudges for specific apps or people."
                  stat="New"
                  accent={notifyShades[2]}
                />
                <GridTile
                  to="/notify"
                  search={{ tab: "rules" }}
                  icon={Moon}
                  label="Quiet hours"
                  hint="Keep notification reminders calm when needed."
                  stat="Calm"
                  accent={notifyShades[3]}
                  span={2}
                />
              </div>


              <Link
                to="/notify"
                search={{ tab: "archived" } as any}
                className="mt-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border px-3 py-2 transition hover:-translate-y-[1px]"
                style={{
                  background: `color-mix(in oklab, ${accent2} 8%, var(--canvas))`,
                  borderColor: `color-mix(in oklab, ${accent2} 20%, transparent)`,
                }}
              >
                <Archive className="size-3.5" style={{ color: accent2 }} aria-hidden="true" />
                <span className="t-meta text-ink/65">
                  {notifyArchived > 0
                    ? `${notifyArchived} notification rule${notifyArchived === 1 ? "" : "s"} on pause — review or restore`
                    : "Paused notification rules rest here until you need them"}
                </span>
                <ArrowRight className="size-3" style={{ color: accent2 }} aria-hidden="true" />
              </Link>
            </GroupCard>

            {/* ─────────── 3 · Location ─────────── */}
            <GroupCard
              title="Location"
              tagline="Pin places so the reminder appears exactly where it matters."
              icon={MapPin}
              accent={accent3}
              to="/places"
              eyebrow={places?.active ? undefined : "New"}
              action={places?.active ? "Open" : undefined}
              index={2}
            >
              {places?.active ? (
                <GridTile
                  to="/places"
                  icon={MapPin}
                  label="Places"
                  hint={`${places.count} pinned ${places.count === 1 ? "place" : "places"} · tap to open`}
                  stat={String(places.count)}
                  accent={placesShades[0]}
                  span={2}
                />
              ) : (

                <div className="grid grid-cols-2 gap-2.5">
                  <GridTile
                    to="/places/new"
                    icon={Home}
                    label="Home"
                    hint="Ping when you arrive home."
                    stat="Pin"
                    accent={placesShades[0]}
                  />
                  <GridTile
                    to="/places/new"
                    icon={Briefcase}
                    label="Work"
                    hint="Nudges tied to the office."
                    stat="Pin"
                    accent={placesShades[2]}
                  />
                  <GridTile
                    to="/places/new"
                    icon={Plus}
                    label="Add a place"
                    hint="Market, gym, a friend's house — anywhere."
                    stat="New"
                    accent={placesShades[3]}
                    span={2}
                  />
                </div>
              )}

              <Link
                to="/places"
                search={{ tab: "archived" } as any}
                className="mt-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border px-3 py-2 transition hover:-translate-y-[1px]"
                style={{
                  background: `color-mix(in oklab, ${accent3} 8%, var(--canvas))`,
                  borderColor: `color-mix(in oklab, ${accent3} 20%, transparent)`,
                }}
              >
                <Archive className="size-3.5" style={{ color: accent3 }} aria-hidden="true" />
                <span className="t-meta text-ink/65">
                  {placesArchived > 0
                    ? `${placesArchived} saved place${placesArchived === 1 ? "" : "s"} tucked away — review or restore`
                    : "Places you tucked away rest here when not in use"}
                </span>
                <ArrowRight className="size-3" style={{ color: accent3 }} aria-hidden="true" />
              </Link>
            </GroupCard>

            {/* ─────────── 4 · Coming Soon ─────────── */}
            <GroupCard
              title="More reminders"
              tagline="New ways to remember, arriving soon."
              icon={Zap}
              accent={SOON_ACCENT}
              eyebrow="Coming soon"
              disabled
              index={3}
            >
              <div className="flex flex-wrap gap-1.5">
                {[
                  { icon: Users, label: "People" },
                  { icon: Mic, label: "Voice" },
                  { icon: BookOpen, label: "Rules" },
                  { icon: Sparkles, label: "Context" },
                ].map((c) => (
                  <span
                    key={c.label}
                    className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 t-meta text-ink/60"
                    style={{
                      background: `color-mix(in oklab, ${SOON_ACCENT} 8%, white)`,
                      borderColor: `color-mix(in oklab, ${SOON_ACCENT} 22%, transparent)`,
                    }}
                  >
                    <c.icon className="size-3" strokeWidth={1.7} aria-hidden="true" />
                    {c.label}
                  </span>
                ))}
              </div>
              <p className="mt-2.5 t-meta text-ink/50">
                More reminder parameters like people, voice, context and smarter rules.
              </p>
            </GroupCard>
          </section>

          <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-1">
            <Link to="/home" className="t-eyebrow text-brand inline-flex items-center gap-1 min-w-0">
              <span className="truncate">Open later feed</span> <ArrowRight className="size-3" aria-hidden="true" />
            </Link>
            <span className="t-meta text-ink/40 shrink-0">Local · yours only</span>
          </div>
        </div>

        <div aria-hidden="true" className="h-40 shrink-0" />

        <BottomTabs />
      </div>
    </PhoneFrame>
  );
}
