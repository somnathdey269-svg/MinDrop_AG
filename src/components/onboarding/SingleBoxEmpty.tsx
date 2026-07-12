import type { LucideIcon } from "lucide-react";
import { getReadableAccent } from "@/lib/theme/palette";

export function SingleBoxEmpty({
  accent,
  Icon,
  eyebrow,
  title,
  body,
}: {
  accent: string;
  Icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
}) {
  const tint = (pct: number, base = "transparent") =>
    `color-mix(in oklab, ${accent} ${pct}%, ${base})`;
  const readable = getReadableAccent(accent);
  return (
    <div
      className="rounded-3xl p-6 border text-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${tint(30, "var(--canvas)")} 0%, ${tint(14, "var(--canvas)")} 58%, var(--canvas) 100%)`,
        borderColor: tint(45),
      }}
    >
      <div
        className="size-16 mx-auto rounded-full grid place-items-center mb-4"
        style={{ background: tint(22, "var(--canvas)") }}
      >
        <Icon className="size-7" style={{ color: readable }} aria-hidden="true" />
      </div>
      <p className="t-eyebrow mb-2" style={{ color: readable }}>
        {eyebrow}
      </p>
      <p className="t-display text-ink mb-2">{title}</p>
      <p className="t-meta text-ink/75">{body}</p>
    </div>
  );
}
