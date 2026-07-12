import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import type { SegmentUsage } from "@/lib/dashboard/usage";
import { relTime } from "@/lib/dashboard/usage";
import { getReadableAccent } from "@/lib/theme/palette";

/**
 * Dashboard card primitives.
 *
 * IMPORTANT: GroupCard is a plain container — not a link. It hosts an
 * independently clickable header "chip" and body children (SubTile, Report,
 * Pitch, footer rows) that each own their own navigation target. This avoids
 * nested <a> tags (invalid HTML) and lets a tap on a specific sub-item land
 * on the page for that sub-item — not the parent room.
 */

export function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(1, ...data);
  const w = 64;
  const h = 22;
  const step = w / Math.max(1, data.length - 1);
  const pts = data
    .map((v, i) => `${(i * step).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0" aria-hidden="true">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type GroupCardProps = {
  title: string;
  tagline: string;
  icon: LucideIcon;
  accent: string;
  to?: string;               // header chip target
  search?: Record<string, unknown>;
  eyebrow?: string;
  action?: string;
  children: React.ReactNode;
  disabled?: boolean;
  index?: number;
};

export function GroupCard({
  title,
  tagline,
  icon: Icon,
  accent,
  to,
  search,
  eyebrow,
  action,
  children,
  disabled,
  index = 0,
}: GroupCardProps) {
  const bg = `linear-gradient(145deg, color-mix(in oklab, ${accent} 11%, var(--canvas)) 0%, color-mix(in oklab, ${accent} 4%, var(--card)) 100%)`;
  const border = `color-mix(in oklab, ${accent} 25%, transparent)`;
  const iconBg = `color-mix(in oklab, ${accent} 14%, var(--canvas))`;

  const readable = getReadableAccent(accent);
  const HeaderInner = (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
      <div
        className="grid place-items-center size-11 rounded-2xl shrink-0 border"
        style={{ background: iconBg, borderColor: border }}
      >
        <Icon className="size-[18px]" strokeWidth={1.7} style={{ color: readable }} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h2 className="t-title text-ink truncate">{title}</h2>
          {eyebrow && (
            <span
              className="t-eyebrow rounded-full border px-2 py-0.5"
              style={{ color: readable, borderColor: border, background: iconBg }}
            >
              {eyebrow}
            </span>
          )}
        </div>
        <p className="t-body-sm text-ink/65 mt-1.5">{tagline}</p>
      </div>
      {action && !disabled && (
        <span
          className="t-eyebrow shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5"
          style={{ color: readable, borderColor: border, background: iconBg }}
        >
          {action} <ArrowUpRight className="size-3" aria-hidden="true" />
        </span>
      )}
    </div>
  );

  const motionProps = {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.35 },
    transition: { duration: 0.42, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] },
  } as const;

  return (
    <motion.div
      {...motionProps}
      className={
        "rounded-[28px] border px-4 py-4 shadow-[0_18px_55px_-42px_var(--ink)] sm:px-5 " +
        (disabled ? "opacity-80" : "")
      }
      style={{ background: bg, borderColor: border }}
      aria-disabled={disabled}
    >
      {to && !disabled ? (
        <Link
          to={to as any}
          search={search as any}
          className="block -mx-1 rounded-2xl px-1 py-0.5 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2"
          style={{ ["--tw-ring-color" as any]: border }}
        >
          {HeaderInner}
        </Link>
      ) : (
        HeaderInner
      )}
      <div className="mt-3.5">{children}</div>
    </motion.div>
  );
}

type SubTileProps = {
  to?: string;
  icon: LucideIcon;
  label: string;
  hint: string;
  accent: string;
  stat?: string;
  disabled?: boolean;
};

export function SubTile({ to, icon: Icon, label, hint, accent, stat, disabled }: SubTileProps) {
  const bg = `linear-gradient(160deg, color-mix(in oklab, ${accent} 14%, var(--card)) 0%, color-mix(in oklab, ${accent} 5%, var(--card)) 100%)`;
  const border = `color-mix(in oklab, ${accent} 28%, transparent)`;
  const iconBg = `color-mix(in oklab, ${accent} 18%, var(--card))`;

  const readable = getReadableAccent(accent);
  const body = (
    <motion.div
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className="snap-start shrink-0 w-[168px] min-h-[144px] rounded-2xl border p-3 flex flex-col justify-between"
      style={{ background: bg, borderColor: border, opacity: disabled ? 0.55 : 1 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="grid size-9 place-items-center rounded-xl border shrink-0"
          style={{ background: iconBg, borderColor: border }}
        >
          <Icon className="size-[16px]" strokeWidth={1.8} style={{ color: readable }} aria-hidden="true" />
        </div>
        {stat && (
          <span
            className="t-eyebrow rounded-full px-1.5 py-0.5"
            style={{ color: readable, background: iconBg }}
          >
            {stat}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="t-title text-ink">{label}</p>
        <p className="t-meta text-ink/60 mt-1.5 line-clamp-2">{hint}</p>
        <div className="mt-2 flex items-center gap-1 t-eyebrow" style={{ color: readable }}>
          Open <ChevronRight className="size-3" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );

  if (to && !disabled) {
    return (
      <Link to={to as any} className="focus:outline-none">
        {body}
      </Link>
    );
  }
  return body;
}

export function Report({
  usage,
  accent,
  unitLabel,
  note,
  to,
}: {
  usage: SegmentUsage;
  accent: string;
  unitLabel: string;
  note?: string;
  to?: string;
}) {
  const inner = (
    <div
      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-3.5 py-3 transition hover:-translate-y-[1px]"
      style={{
        background: `color-mix(in oklab, ${accent} 8%, var(--canvas))`,
        borderColor: `color-mix(in oklab, ${accent} 22%, transparent)`,
      }}
    >
      <div className="min-w-0">
        <p className="t-display text-ink">{usage.count}</p>
        <p className="t-meta text-ink/55 mt-1 truncate">
          {unitLabel}
          {usage.lastAt ? ` · ${relTime(usage.lastAt)}` : ""}
        </p>
        {note && <p className="t-meta text-ink/45 mt-1 truncate">{note}</p>}
      </div>
      <Sparkline data={usage.sparkline} color={accent} />
    </div>
  );
  if (to) return <Link to={to as any}>{inner}</Link>;
  return inner;
}

export function Pitch({
  benefit,
  example,
  cta,
  accent,
  points = [],
  to,
}: {
  benefit: string;
  example: string;
  cta: string;
  accent: string;
  points?: string[];
  to?: string;
}) {
  const readable = getReadableAccent(accent);
  const inner = (
    <div
      className="rounded-2xl border px-3.5 py-3 transition hover:-translate-y-[1px]"
      style={{
        borderColor: `color-mix(in oklab, ${accent} 20%, transparent)`,
        background: `color-mix(in oklab, ${accent} 5%, var(--canvas))`,
      }}
    >
      <p className="t-body-sm text-ink/70">
        <span className="t-title" style={{ color: readable }}>Why it helps:</span> {benefit}
      </p>
      {points.length > 0 && (
        <div className="mt-2 grid grid-cols-1 gap-1.5 min-[380px]:grid-cols-2">
          {points.slice(0, 2).map((point) => (
            <span key={point} className="t-meta text-ink/55">
              <span style={{ color: readable }}>•</span> {point}
            </span>
          ))}
        </div>
      )}
      <p className="mt-2 t-meta text-ink/45 truncate">e.g. {example}</p>
      <div className="mt-2.5 flex items-center justify-between gap-3">
        <span className="t-eyebrow text-ink/40">Takes ~30s</span>
        <span
          className="t-eyebrow inline-flex items-center gap-1 shrink-0"
          style={{ color: readable }}
        >
          {cta} <ArrowUpRight className="size-3" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
  if (to) return <Link to={to as any}>{inner}</Link>;
  return inner;
}

/** Backward-compat placeholder so any stale import doesn't hard-fail. */
export type SegmentDef = {
  key: SegmentUsage["key"];
  name: string;
  route: string;
  icon: LucideIcon;
  accent: string;
};

/**
 * GridTile — responsive sub-card that sits inside a CSS grid column.
 * No fixed width. Accepts its own accent so siblings can use tonal shades.
 */
type GridTileProps = {
  to?: string;
  search?: Record<string, unknown>;
  icon: LucideIcon;
  label: string;
  hint: string;
  accent: string;
  stat?: string;
  span?: 1 | 2;
};

export function GridTile({ to, search, icon: Icon, label, hint, accent, stat, span = 1 }: GridTileProps) {
  // Card-on-card: use pure --card base so sub-tiles clearly pop out of the
  // tinted parent room, and mark them with a colored top edge + accent chip.
  const border = `color-mix(in oklab, ${accent} 34%, transparent)`;
  const iconBg = `color-mix(in oklab, ${accent} 22%, var(--canvas))`;

  const readable = getReadableAccent(accent);
  const body = (
    <motion.div
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className={
        "relative h-full overflow-hidden rounded-2xl border bg-card p-3 pt-[13px] flex flex-col justify-between min-h-[116px] shadow-[0_6px_18px_-14px_var(--ink)] " +
        (span === 2 ? "col-span-2" : "")
      }
      style={{ borderColor: border }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${accent}, color-mix(in oklab, ${accent} 45%, transparent))` }}
      />
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
        <div
          className="grid size-8 place-items-center rounded-xl border shrink-0"
          style={{ background: iconBg, borderColor: border }}
        >
          <Icon className="size-[15px]" strokeWidth={1.8} style={{ color: readable }} aria-hidden="true" />
        </div>
        <p className="t-title text-ink truncate">{label}</p>
        {stat && (
          <span
            className="t-eyebrow rounded-full px-1.5 py-0.5 shrink-0"
            style={{ color: readable, background: iconBg }}
          >
            {stat}
          </span>
        )}
      </div>
      <p className="t-meta text-ink/60 mt-2 line-clamp-2">{hint}</p>
      <div className="mt-2 flex items-center gap-1 t-eyebrow" style={{ color: readable }}>
        Open <ChevronRight className="size-3" aria-hidden="true" />
      </div>
    </motion.div>
  );

  const wrapperClass = span === 2 ? "col-span-2 focus:outline-none" : "focus:outline-none";
  if (to) return <Link to={to as any} search={search as any} className={wrapperClass}>{body}</Link>;
  return <div className={wrapperClass}>{body}</div>;
}

/**
 * PlacesStrip — Places-only summary. Up to N pinned places as chips connected
 * by a dotted route line. Each chip links directly to that place.
 */
type PlacesStripProps = {
  places: { id: string; name: string; emoji?: string; radiusM?: number }[];
  accent: string;
  totalCount: number;
  lastLabel?: string;
};

export function PlacesStrip({ places, accent, totalCount, lastLabel }: PlacesStripProps) {
  const border = `color-mix(in oklab, ${accent} 22%, transparent)`;
  const chipBg = `color-mix(in oklab, ${accent} 10%, var(--canvas))`;
  const iconBg = `color-mix(in oklab, ${accent} 18%, var(--card))`;

  const readable = getReadableAccent(accent);
  return (
    <div
      className="relative rounded-2xl border px-3 py-3"
      style={{
        background: `color-mix(in oklab, ${accent} 6%, var(--canvas))`,
        borderColor: border,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="t-meta text-ink/60 truncate">
          <span className="t-title text-ink mr-1">{totalCount}</span>
          {totalCount === 1 ? "place pinned" : "places pinned"}
          {lastLabel ? ` · ${lastLabel}` : ""}
        </p>
        <Link
          to="/places"
          className="t-eyebrow inline-flex items-center gap-0.5 shrink-0"
          style={{ color: readable }}
        >
          See all <ChevronRight className="size-3" aria-hidden="true" />
        </Link>
      </div>

      <div className="relative mt-3">
        <svg
          className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-[2px] w-[calc(100%-16px)] pointer-events-none"
          viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true"
        >
          <line x1="0" y1="1" x2="100" y2="1"
            stroke={readable} strokeWidth="0.6" strokeDasharray="1.5 1.5" opacity="0.45" />
        </svg>
        <div className="relative flex flex-wrap gap-2">
          {places.map((p) => (
            <Link
              key={p.id}
              to="/places/$placeId"
              params={{ placeId: p.id }}
              className="inline-flex items-center gap-1.5 rounded-full border pl-1 pr-2.5 py-1 transition hover:-translate-y-[1px]"
              style={{ background: chipBg, borderColor: border }}
            >
              <span
                className="grid size-5 place-items-center rounded-full text-[10px]"
                style={{ background: iconBg, color: readable }}
                aria-hidden="true"
              >
                {p.emoji || "📍"}
              </span>
              <span className="t-title text-ink truncate max-w-[10ch]">{p.name}</span>
              {typeof p.radiusM === "number" && (
                <span className="t-meta text-ink/50">· {p.radiusM}m</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
