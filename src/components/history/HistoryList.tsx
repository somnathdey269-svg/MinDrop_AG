import { Undo2, Trash2, Bell, MapPin, Bookmark } from "lucide-react";
import type { HistoryItem, HistoryOrigin } from "@/lib/history/useHistory";
import { useHistory } from "@/lib/history/useHistory";
import { SingleBoxEmpty } from "@/components/onboarding/SingleBoxEmpty";

const ORIGIN_ICON: Record<HistoryOrigin, typeof Bell> = {
  later: Bookmark,
  notify: Bell,
  places: MapPin,
};

interface Props {
  origin: HistoryOrigin;
  status: "archived" | "erased";
  accent: string;
}

/**
 * Per-section list of Archived / Erased items. Uses the shared `useHistory`
 * data source but shows only the rows matching this section + status.
 */
export function HistoryList({ origin, status, accent }: Props) {
  const { items, restore, purge } = useHistory();
  const list = items.filter((i) => i.origin === origin && i.status === status);
  const tint = (pct: number, base = "transparent") =>
    `color-mix(in oklab, ${accent} ${pct}%, ${base})`;

  if (list.length === 0) {
    return (
      <SingleBoxEmpty
        accent={accent}
        Icon={status === "archived" ? Undo2 : Trash2}
        eyebrow={status === "archived" ? "Archived" : "Erased"}
        title={status === "archived" ? "Nothing archived yet." : "Nothing erased yet."}
        body={
          status === "archived"
            ? "Items you tuck away or that fire once will land here — restore anytime."
            : "Anything you delete stays here for a while — restore or purge for good."
        }
      />
    );
  }

  return (
    <ul className="space-y-2">
      {list.map((item) => (
        <Row key={`${item.status}-${item.id}`} item={item} accent={accent} tint={tint} onRestore={() => restore(item)} onPurge={() => purge(item)} />
      ))}
    </ul>
  );
}

function Row({
  item,
  accent,
  tint,
  onRestore,
  onPurge,
}: {
  item: HistoryItem;
  accent: string;
  tint: (pct: number, base?: string) => string;
  onRestore: () => void;
  onPurge: () => void;
}) {
  const OriginIcon = ORIGIN_ICON[item.origin];
  return (
    <li className="paper-card p-3">
      <div className="flex items-start gap-3">
        <span
          className="shrink-0 size-9 rounded-2xl grid place-items-center"
          style={{ background: tint(14, "var(--canvas)") }}
        >
          <OriginIcon className="size-4" style={{ color: accent }} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="t-meta text-ink/55 truncate mb-0.5">{item.subtitle}</p>
          <p className="t-body text-ink line-clamp-2">{item.title}</p>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-[color:var(--hairline)] flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={onRestore}
          className="grid place-items-center size-8 rounded-full hover:bg-canvas press text-ink/60"
          aria-label="Restore"
          title="Restore"
        >
          <Undo2 className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => { if (confirm("Purge permanently?")) onPurge(); }}
          className="grid place-items-center size-8 rounded-full hover:bg-canvas press text-ink/60"
          aria-label="Purge"
          title="Purge"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
  );
}
