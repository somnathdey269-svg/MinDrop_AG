import { motion } from "framer-motion";
import { MapPin, Pause, Play, Pencil, Zap, Archive, Trash2, RotateCcw, SlidersHorizontal } from "lucide-react";
import type { Place } from "@/lib/places/types";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

interface Props {
  place: Place;
  distanceM?: number | null;
  rulesCount?: number;
  onEdit?: () => void;
  onPause?: () => void;
  onTest?: () => void;
  onArchive?: () => void;
  onErase?: () => void;
  onRestore?: () => void;
  onAddRule?: () => void;
  variant?: "saved" | "archived";
}

function formatDistance(m?: number | null): string {
  if (m == null) return "—";
  if (m < 1000) return `${Math.round(m)} m away`;
  return `${(m / 1000).toFixed(1)} km away`;
}

export function PlaceCard({
  place, distanceM, rulesCount, onEdit, onPause, onTest, onArchive, onErase, onRestore, onAddRule, variant = "saved",
}: Props) {
  const { accent3 } = useCountryTheme();
  const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent3} ${pct}%, ${base})`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative paper-card overflow-hidden"
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: accent3 }}
      />
      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {place.emoji && <span className="t-body" aria-hidden="true">{place.emoji}</span>}
              <h3 className="t-display text-ink truncate">
                {place.name}
              </h3>
              {place.paused && (
                <span className="t-eyebrow px-1.5 py-0.5 rounded-full bg-ink/10 text-ink/60">
                  Paused
                </span>
              )}
            </div>
            <p className="t-meta text-ink/60 truncate">
              {place.address}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span
                className="t-eyebrow inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{
                  background: tint(14, "var(--canvas)"),
                  color: accent3,
                  border: `1px solid ${tint(30)}`,
                }}
              >
                <SlidersHorizontal className="size-3" aria-hidden="true" />
                {rulesCount ?? 0} rule{(rulesCount ?? 0) === 1 ? "" : "s"}
              </span>
              {distanceM != null && (
                <span
                  className="t-eyebrow inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
                  style={{ background: "color-mix(in oklab, var(--ink) 5%, transparent)", borderColor: "color-mix(in oklab, var(--ink) 10%, transparent)", color: "color-mix(in oklab, var(--ink) 60%, transparent)" }}
                >
                  <MapPin className="size-3" aria-hidden="true" />
                  {formatDistance(distanceM)}
                </span>
              )}
            </div>
          </div>
        </div>


        <div className="mt-3 pt-3 border-t border-[color:var(--hairline)] flex items-center justify-end gap-1">
          {variant === "saved" && (
            <>
              {onAddRule && (
                <button
                  type="button" onClick={onAddRule} aria-label="Add rule for this place"
                  className="grid place-items-center size-8 rounded-full hover:bg-canvas press text-ink/60"
                >
                  <SlidersHorizontal className="size-4" aria-hidden="true" />
                </button>
              )}
              {onTest && (
                <button
                  type="button" onClick={onTest} aria-label="Test fire this place"
                  className="grid place-items-center size-8 rounded-full hover:bg-canvas press text-ink/60"
                >
                  <Zap className="size-4" aria-hidden="true" />
                </button>
              )}
              {onPause && (
                <button
                  type="button" onClick={onPause} aria-label={place.paused ? "Resume" : "Pause"}
                  className="grid place-items-center size-8 rounded-full hover:bg-canvas press text-ink/60"
                >
                  {place.paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
                </button>
              )}
              {onEdit && (
                <button
                  type="button" onClick={onEdit} aria-label="Edit place"
                  className="grid place-items-center size-8 rounded-full hover:bg-canvas press text-ink/60"
                >
                  <Pencil className="size-4" aria-hidden="true" />
                </button>
              )}
              {onArchive && (
                <button
                  type="button" onClick={onArchive} aria-label="Archive place"
                  className="grid place-items-center size-8 rounded-full hover:bg-canvas press text-ink/60"
                >
                  <Archive className="size-4" aria-hidden="true" />
                </button>
              )}
            </>
          )}
          {variant === "archived" && (
            <>
              {onRestore && (
                <button
                  type="button" onClick={onRestore} aria-label="Restore place"
                  className="grid place-items-center size-8 rounded-full hover:bg-canvas press text-ink/60"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                </button>
              )}
              {onErase && (
                <button
                  type="button" onClick={onErase} aria-label="Erase place forever"
                  className="grid place-items-center size-8 rounded-full hover:bg-canvas press text-ink/60"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
}
