import { Bell, BellRing, Sparkles } from "lucide-react";

interface Props {
  /** Short line describing when/why it will fire next. */
  trigger: string;
  /** "alarm" = loud full-screen ring; "notification" = silent heads-up. */
  delivery: "alarm" | "notification";
  /** Optional secondary detail (e.g. frequency). */
  detail?: string;
  className?: string;
}

/**
 * Compact "What happens next" preview shown inside a rule / reminder editor.
 * Keeps parity across Later, Notify, and Places editors so the user always
 * sees a plain-language summary of the next expected trigger + delivery.
 */
export function NextTriggerPreview({ trigger, delivery, detail, className }: Props) {
  const Icon = delivery === "alarm" ? BellRing : Bell;
  const deliveryLabel = delivery === "alarm" ? "Loud alarm" : "Silent notification";
  return (
    <div
      className={
        "rounded-2xl border border-ink/10 bg-ink/[0.03] px-3.5 py-2.5 flex items-start gap-2.5 " +
        (className ?? "")
      }
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="mt-0.5 shrink-0 size-6 rounded-full grid place-items-center bg-canvas border border-ink/10"
      >
        <Sparkles className="size-3 text-ink/70" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="t-eyebrow text-ink/55">What happens next</p>
        <p className="t-body-sm text-ink mt-0.5 truncate">{trigger}</p>
        <p className="t-meta text-ink/70 mt-1 inline-flex items-center gap-1.5">
          <Icon className="size-3.5" aria-hidden="true" />
          {deliveryLabel}
          {detail ? <span className="text-ink/50">· {detail}</span> : null}
        </p>
      </div>
    </div>
  );
}
