import { motion } from "framer-motion";
import { MapPin, LogOut, LogIn } from "lucide-react";
import type { PlaceEvent } from "@/lib/places/types";
import type { Place } from "@/lib/places/types";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

interface Props {
  event: PlaceEvent;
  place?: Place;
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export function EventRow({ event, place }: Props) {
  const Icon = event.kind === "enter" ? LogIn : LogOut;
  const { accent3 } = useCountryTheme();
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="paper-card p-3 flex items-start gap-3"
    >
      <div
        className="shrink-0 size-9 rounded-full grid place-items-center"
        style={{ background: `color-mix(in srgb, ${accent3} 14%, white)`, color: accent3 }}
      >
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="t-body-sm text-ink truncate">
          {event.kind === "enter" ? "Arrived at" : "Left"} {place?.name || "unknown place"}
        </p>
        {place?.message && (
          <p className="t-meta text-ink/70 mt-0.5 line-clamp-2">{place.message}</p>
        )}
        <div className="t-eyebrow mt-1 flex items-center gap-1 text-ink/50">
          <MapPin className="size-3" aria-hidden="true" />
          <span>{formatRelative(event.at)}</span>
        </div>
      </div>
    </motion.li>
  );
}
