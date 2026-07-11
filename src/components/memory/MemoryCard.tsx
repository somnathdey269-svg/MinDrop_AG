import { motion } from "framer-motion";
import { Clock, Mic } from "lucide-react";
import type { Memory } from "@/lib/memoryos/types";
import { AlarmStatusChip } from "@/components/alarms/AlarmStatusChip";

interface Props {
  memory: Memory;
  index?: number;
  categoryColor?: string;
  categoryEmoji?: string;
}

/**
 * Compact editorial thought card — the atom of every Do-it-Later / Recovery /
 * Notify list. Warm paper-raised surface with a colored left rail derived
 * from the category tint, a serif thought line, and a hairline meta strip.
 */
export function MemoryCard({ memory, index = 0, categoryColor, categoryEmoji }: Props) {
  const tint = categoryColor || "rgba(26,26,26,0.10)";

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden paper-card press"
      style={{
        background: `linear-gradient(180deg, ${tint}0F 0%, var(--paper-raised) 45%)`,
      }}
    >
      {/* colored rail */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: tint }}
      />

      <div className="pl-4 pr-4 py-3.5">
        {/* meta row */}
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="t-eyebrow inline-flex items-center gap-1 text-ink/60"
          >
            <Clock className="size-3 opacity-70" aria-hidden="true" /> {memory.time}
          </span>
          {memory.category && (
            <span
              className="t-eyebrow inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full"
              style={{
                background: `${tint}22`,
                color: "var(--ink)",
              }}
            >
              {categoryEmoji && <span className="t-meta">{categoryEmoji}</span>}
              <span className="opacity-80">{memory.category}</span>
            </span>
          )}
          {memory.notify && (
            <AlarmStatusChip notify={memory.notify as "alarm" | "notification"} />
          )}
          {!memory.notify && memory.audioUrl && (
            <span className="t-eyebrow inline-flex items-center gap-1 text-ink/55 ml-auto">
              <Mic className="size-3" aria-hidden="true" /> Voice
            </span>
          )}
        </div>

        {/* body */}
        <p className="t-body text-ink">
          {memory.text}
        </p>

        {memory.imageUrl && (
          <img
            src={memory.imageUrl}
            alt=""
            loading="lazy"
            className="mt-3 w-full aspect-[2/1] object-cover rounded-xl border border-hairline"
          />
        )}

        {/* tags — only if present and not just "Actionable" */}
        {memory.tags && memory.tags.filter((t) => t !== "Actionable").length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {memory.tags.filter((t) => t !== "Actionable").map((t) => (
              <span
                key={t}
                className="t-eyebrow px-1.5 py-0.5 rounded-full bg-ink/[0.05] text-ink/60"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
