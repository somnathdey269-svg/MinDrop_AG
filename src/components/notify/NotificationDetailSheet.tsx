import { AnimatePresence, motion } from "framer-motion";
import { Smartphone, Sparkles, X } from "lucide-react";
import type { CapturedNotification } from "@/lib/notify/types";
import { NotifyBridge } from "@/lib/notify/bridge";

function formatWhen(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString([], {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

export function NotificationDetailSheet({
  notification,
  accent,
  onClose,
  onCreateRule,
}: {
  notification: CapturedNotification | null;
  accent: string;
  onClose: () => void;
  onCreateRule: (n: CapturedNotification) => void;
}) {
  const n = notification;
  const body = n?.bigText?.trim() || n?.text || "";
  const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent} ${pct}%, ${base})`;

  const openApp = async () => {
    if (!n) return;
    await NotifyBridge.launchApp(n.pkg);
  };

  return (
    <AnimatePresence>
      {n && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/50 z-40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed z-50
              inset-x-0 bottom-0 rounded-t-3xl bg-canvas border-t border-ink/10
              max-h-[85dvh] h-fit w-full
              md:inset-0 md:m-auto md:max-w-[420px] md:max-h-[min(640px,85vh)]
              md:rounded-3xl md:border md:shadow-2xl md:h-fit
              flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Notification detail"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-canvas border-b border-ink/5">
              <span className="t-eyebrow text-ink/70">Notification</span>
              <button
                onClick={onClose}
                aria-label="Close"
                className="size-8 rounded-full grid place-items-center hover:bg-ink/5"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="px-5 pt-4 pb-2 flex items-center gap-3">
              <span className="t-title size-12 rounded-xl grid place-items-center shrink-0" style={{ background: tint(18, "var(--canvas)"), color: accent }}>
                <Smartphone className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="t-eyebrow truncate" style={{ color: accent }}>
                  {n.appName}
                </p>
                <p className="t-meta text-ink/50 tabular-nums">{formatWhen(n.timestamp)}</p>
              </div>
            </div>

            <div className="px-5 py-4 overflow-y-auto flex-1">
              <div className="bg-white border border-ink/[0.06] rounded-[24px] p-5 shadow-sm space-y-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-ink/40 font-bold mb-1">Subject / Header</p>
                  <h3 className="text-base font-bold text-ink leading-snug break-words">
                    {n.title || "—"}
                  </h3>
                </div>
                <div className="h-px bg-ink/[0.06]" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-ink/40 font-bold mb-2">Message Content</p>
                  <p className="text-ink/80 text-sm leading-relaxed whitespace-pre-wrap break-words select-text">
                    {body || <span className="text-ink/30 italic">No message body</span>}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 pt-3 pb-5 grid grid-cols-2 gap-3 border-t border-ink/5 bg-canvas">
              <button
                onClick={() => { onCreateRule(n); }}
                className="t-meta py-2 rounded-xl border border-ink/10 text-ink/80 inline-flex items-center justify-center gap-1.5 hover:bg-ink/[0.03] transition"
              >
                <Sparkles className="size-3.5" style={{ color: accent }} /> Create rule
              </button>
              <button
                onClick={openApp}
                className="t-meta py-2 rounded-xl bg-ink/90 text-canvas inline-flex items-center justify-center gap-1.5 hover:bg-ink transition"
              >
                <Smartphone className="size-3.5" /> Open app
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
