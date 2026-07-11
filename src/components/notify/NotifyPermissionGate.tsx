import { motion } from "framer-motion";
import { Bell, ExternalLink, Sparkles } from "lucide-react";
import { NotifyBridge } from "@/lib/notify/bridge";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

export function NotifyPermissionGate({ onGranted }: { onGranted: () => void }) {
  const isNative = NotifyBridge.isNative();
  const { accent2 } = useCountryTheme();
  const tint = (pct: number, base = "transparent") => `color-mix(in oklab, ${accent2} ${pct}%, ${base})`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4"
    >
      <div className="p-5 rounded-3xl border" style={{ background: `linear-gradient(135deg, ${tint(22, "var(--canvas)")}, ${tint(8, "var(--canvas)")})`, borderColor: tint(30) }}>
        <div className="size-12 rounded-2xl grid place-items-center mb-3" style={{ background: tint(18, "var(--canvas)") }}>
          <Bell className="size-6" style={{ color: accent2 }} aria-hidden="true" />
        </div>
        <h2 className="t-display mb-1.5">
          Let MinDrop read your notifications.
        </h2>
        <p className="t-body text-ink/70">
          Notify captures WhatsApp, Gmail, news and every other notification so
          you can jump straight to the source app — and trigger reminders when
          messages from specific people arrive.
        </p>
      </div>

      <ul className="space-y-2.5 px-1">
        {[
          { emoji: "📱", text: "Runs 100% on your phone — nothing sent to any server." },
          { emoji: "🔕", text: "You choose which apps trigger rules. Everything else is ignored." },
          { emoji: "🗑️", text: "Uninstall MinDrop = every captured notification vanishes with it." },
        ].map((b) => (
          <li key={b.emoji} className="t-body flex gap-3 text-ink/80">
            <span className="t-title mt-0.5" aria-hidden="true">{b.emoji}</span>
            <span>{b.text}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={async () => { await NotifyBridge.openPermissionSettings(); onGranted(); }}
        className="t-button w-full bg-ink text-canvas py-4 rounded-2xl inline-flex items-center justify-center gap-2"
      >
        <ExternalLink className="size-4" />
        {isNative ? "Open notification access" : "Enable (preview mock)"}
      </button>

      {!isNative && (
        <div className="t-meta mt-2 p-3 rounded-2xl border flex gap-2.5 text-ink/70" style={{ background: tint(5, "var(--canvas)"), borderColor: tint(15) }}>
          <Sparkles className="size-3.5 shrink-0 mt-0.5" style={{ color: accent2 }} />
          <span>
            You're in web preview — Android's Notification Access dialog only
            appears in the installed APK. Tap the button to unlock a mock feed
            so you can design here.
          </span>
        </div>
      )}
    </motion.div>
  );
}
