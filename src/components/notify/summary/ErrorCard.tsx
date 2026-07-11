import { useState } from "react";
import { AlertCircle, Copy, X } from "lucide-react";
import type { FriendlyError } from "@/lib/notify/summary/errors";

export function ErrorCard({
  error, accent, onRetry, onDismiss, onAction,
}: {
  error: FriendlyError;
  accent: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  onAction?: (kind: FriendlyError["kind"]) => void;
}) {
  const [countdown, setCountdown] = useState(error.retryAfterSec ?? 0);
  useState(() => {
    if (!error.retryAfterSec) return;
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${error.title}\n${error.cause}\n\n${error.raw ?? ""}`);
    } catch {}
  };

  return (
    <div
      role="alert"
      className="rounded-2xl border p-4 mb-4"
      style={{
        borderColor: "#c85555",
        background: "color-mix(in oklab, #c85555 6%, var(--canvas))",
      }}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="size-5 shrink-0 mt-0.5" style={{ color: "#c85555" }} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="t-body font-semibold text-ink">{error.title}</p>
          <p className="t-body-sm text-ink/70 mt-1">{error.cause}</p>
          <ol className="mt-2 space-y-1 list-decimal list-inside">
            {error.fixSteps.map((s, i) => (
              <li key={i} className="t-body-sm text-ink/80">{s}</li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2 mt-3">
            {error.action?.href && (
              <a
                href={error.action.href}
                target="_blank"
                rel="noreferrer"
                className="t-button px-3 py-1.5 rounded-full bg-ink text-canvas"
              >
                {error.action.label}
              </a>
            )}
            {error.action && !error.action.href && (
              <button
                onClick={() => onAction?.(error.kind)}
                className="t-button px-3 py-1.5 rounded-full text-canvas"
                style={{ background: accent }}
              >
                {error.action.label}
              </button>
            )}
            {onRetry && (
              <button
                onClick={onRetry}
                disabled={countdown > 0}
                className="t-button px-3 py-1.5 rounded-full border border-ink/20 text-ink disabled:opacity-40"
              >
                {countdown > 0 ? `Retry in ${countdown}s` : "Retry"}
              </button>
            )}
            <button
              onClick={copy}
              aria-label="Copy error details"
              className="t-button px-3 py-1.5 rounded-full border border-ink/10 text-ink/70 inline-flex items-center gap-1"
            >
              <Copy className="size-3" aria-hidden="true" /> Copy details
            </button>
          </div>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} aria-label="Dismiss" className="text-ink/40 hover:text-ink shrink-0">
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
