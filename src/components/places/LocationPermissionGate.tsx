import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

interface Props {
  onGranted: () => void;
}

export function LocationPermissionGate({ onGranted }: Props) {
  const { accent3 } = useCountryTheme();
  const request = async () => {
    if (!("geolocation" in navigator)) { onGranted(); return; }
    navigator.geolocation.getCurrentPosition(
      () => {
        try {
          if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission().catch(() => {});
          }
        } catch { /* ignore */ }
        onGranted();
      },
      () => onGranted(),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4"
    >
      <div className="p-5 rounded-3xl paper-card">
        <div className="size-12 rounded-2xl grid place-items-center mb-3" style={{ background: `color-mix(in srgb, ${accent3} 12%, transparent)` }}>
          <MapPin className="size-6" style={{ color: accent3 }} aria-hidden="true" />
        </div>
        <h2 className="t-display mb-1.5">
          Let MinDrop know where you are.
        </h2>
        <p className="t-body text-ink/70">
          Places uses your location only on your device to fire a reminder when
          you arrive at a saved spot. Nothing leaves your phone.
        </p>
      </div>

      <ul className="space-y-2.5 px-1">
        {[
          { emoji: "📍", text: "Coordinates stay in your browser storage — no server." },
          { emoji: "🎯", text: "Only fires for spots you saved, inside their radius." },
          { emoji: "🗑️", text: "Delete a place and its trace disappears with it." },
        ].map((b) => (
          <li key={b.emoji} className="t-body flex gap-3 text-ink/80">
            <span className="t-title mt-0.5" aria-hidden="true">{b.emoji}</span>
            <span>{b.text}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={request}
        className="t-button w-full bg-ink text-canvas py-4 rounded-2xl inline-flex items-center justify-center gap-2 press"
      >
        <ExternalLink className="size-4" aria-hidden="true" />
        Enable location
      </button>
    </motion.div>
  );
}
