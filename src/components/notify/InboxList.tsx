import { useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Bell, Eye, Sparkles } from "lucide-react";
import type { CapturedNotification } from "@/lib/notify/types";
import { NotifyBridge } from "@/lib/notify/bridge";

const LONG_PRESS_MS = 500;

export function InboxList({
  items,
  accent,
  onCreateRule,
  onOpen,
  onEmpty,
}: {
  items: CapturedNotification[];
  accent: string;
  onCreateRule: (n: CapturedNotification) => void;
  onOpen: (n: CapturedNotification) => void;
  onEmpty?: React.ReactNode;
}) {
  const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent} ${pct}%, ${base})`;
  const timerRef = useRef<number | null>(null);
  const longFiredRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const clearTimer = () => {
    if (timerRef.current) { window.clearTimeout(timerRef.current); timerRef.current = null; }
  };
  const startPress = (e: React.PointerEvent, n: CapturedNotification) => {
    longFiredRef.current = false;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    clearTimer();
    timerRef.current = window.setTimeout(async () => {
      longFiredRef.current = true;
      clearTimer();
      try { navigator.vibrate?.(30); } catch {}
      const ok = await NotifyBridge.launchNotification(n.id);
      if (!ok) await NotifyBridge.launchApp(n.pkg);
    }, LONG_PRESS_MS);
  };
  const movePress = (e: React.PointerEvent) => {
    if (!startPosRef.current) return;
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    if (dx * dx + dy * dy > 100) {
      clearTimer();
      startPosRef.current = null;
    }
  };
  const endPress = (n: CapturedNotification) => {
    const hadTimer = !!timerRef.current;
    clearTimer();
    startPosRef.current = null;
    if (hadTimer && !longFiredRef.current) onOpen(n);
  };
  const cancelPress = () => { clearTimer(); startPosRef.current = null; };

  if (items.length === 0) {
    return (
      <div className="mt-10 text-center px-4">
        <div className="mx-auto size-14 rounded-2xl grid place-items-center mb-4" style={{ background: tint(16, "var(--canvas)") }}>
          <Bell className="size-6" style={{ color: accent }} aria-hidden="true" />
        </div>
        <p className="t-display text-ink mb-1.5">Inbox is quiet.</p>
        <p className="t-body text-ink/60">
          Incoming notifications from other apps will land here.
        </p>
        {onEmpty}
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {items.map((n, i) => {
        const initial = (n.title?.trim()?.[0] || n.appName?.[0] || "•").toUpperCase();
        return (
          <motion.li
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.025, 0.18), type: "spring", stiffness: 320, damping: 26 }}
          >
            <div className="group relative overflow-hidden rounded-[22px] bg-card border border-ink/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_14px_32px_-14px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all duration-300">
              {/* Accent bar */}
              <span
                aria-hidden="true"
                className="absolute inset-y-3 left-0 w-[3px] rounded-r-full opacity-90"
                style={{ background: accent }}
              />

              <div className="flex gap-3 pl-4 pr-3 py-3.5">
                <button
                  onPointerDown={(e) => startPress(e, n)}
                  onPointerMove={movePress}
                  onPointerUp={() => endPress(n)}
                  onPointerCancel={cancelPress}
                  onContextMenu={(e) => e.preventDefault()}
                  className="flex gap-3 flex-1 text-left min-w-0 select-none touch-manipulation"
                  aria-label={`Open notification from ${n.appName} — ${n.title}. Long-press to jump to app.`}
                >
                  {/* Avatar: monogram over the section accent only */}
                  <span className="relative shrink-0">
                    <span
                      className="t-display size-11 rounded-2xl text-canvas grid place-items-center shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_8px_-2px_rgba(0,0,0,0.25)] ring-1"
                      style={{ background: `linear-gradient(135deg, ${accent}, ${tint(70, "var(--ink)")})`, borderColor: tint(30) }}
                    >
                      {initial}
                    </span>
                    <span
                      className="t-meta absolute -bottom-1 -right-1 size-5 rounded-full grid place-items-center shadow ring-2 ring-card"
                      style={{ background: tint(18, "var(--canvas)"), color: accent }}
                      aria-hidden="true"
                    >
                      <Bell className="size-3" />
                    </span>
                  </span>

                  <div className="min-w-0 flex-1 py-0.5">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="t-eyebrow truncate" style={{ color: accent }}>
                        {n.appName}
                      </p>
                      <span className="size-1 rounded-full bg-ink/25" aria-hidden="true" />
                      <span className="t-meta text-ink/40 shrink-0 tabular-nums">
                        {formatDistanceToNow(n.timestamp, { addSuffix: false })}
                      </span>
                    </div>
                    <p className="t-body text-ink truncate">
                      {n.title || "—"}
                    </p>
                    <p className="t-body-sm text-ink/60 line-clamp-2 mt-1">
                      {n.text}
                    </p>
                  </div>
                </button>

                <div className="flex flex-col items-stretch gap-1.5 shrink-0 self-center">
                  <button
                    onClick={() => onCreateRule(n)}
                    aria-label="Create rule from this"
                    className="t-eyebrow h-8 pl-2.5 pr-3 rounded-full text-canvas inline-flex items-center gap-1.5 shadow-sm transition-colors"
                    style={{ background: accent }}
                    title="Create rule from this"
                  >
                    <Sparkles className="size-3" />
                    Rule
                  </button>
                  <button
                    onClick={() => onOpen(n)}
                    aria-label="View notification"
                    className="t-eyebrow h-8 pl-2.5 pr-3 rounded-full bg-ink/[0.05] text-ink/70 hover:bg-ink/[0.09] inline-flex items-center gap-1.5 transition-colors"
                    title="View notification"
                  >
                    <Eye className="size-3" />
                    View
                  </button>
                </div>
              </div>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
