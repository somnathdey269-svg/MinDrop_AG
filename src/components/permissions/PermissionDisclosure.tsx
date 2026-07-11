/**
 * Prominent-disclosure modal — required by Play Console BEFORE requesting
 * ACCESS_BACKGROUND_LOCATION or BIND_NOTIFICATION_LISTENER_SERVICE. The
 * user's ack is persisted in localStorage so we only show it once per key.
 */
import { useEffect, useState } from "react";

export type DisclosureKind = "background-location" | "notification-access";

const COPY: Record<DisclosureKind, { title: string; body: string; note: string; cta: string }> = {
  "background-location": {
    title: "Reminders that fire at a place",
    body: "MinDrop uses your device location in the background only to check whether you've entered or left the exact places you save (home, office, the pharmacy). We do not track your continuous location, we do not store your movement history, and nothing leaves your phone.",
    note: "You can revoke this any time in Android Settings → MinDrop → Permissions.",
    cta: "Open Settings",
  },
  "notification-access": {
    title: "Filter what matters",
    body: "MinDrop reads the notifications on your phone so your rules (\"UPI debit over ₹5,000 → ring\") can match them. Matching happens on your device — the text of your notifications is never uploaded to our servers.",
    note: "You control which rules run. Turn any rule off any time.",
    cta: "Open Settings",
  },
};

const ackKey = (k: DisclosureKind) => `mindrop.disclosure.${k}.v1`;

export function hasAckedDisclosure(k: DisclosureKind): boolean {
  try { return window.localStorage.getItem(ackKey(k)) === "1"; } catch { return false; }
}

function ack(k: DisclosureKind) {
  try { window.localStorage.setItem(ackKey(k), "1"); } catch {}
}

export function PermissionDisclosure({
  kind, open, onDismiss, onProceed,
}: {
  kind: DisclosureKind;
  open: boolean;
  onDismiss: () => void;
  onProceed: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(open); }, [open]);
  if (!mounted) return null;
  const c = COPY[kind];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-5" role="dialog" aria-modal="true">
      <div className="bg-canvas rounded-3xl border border-ink/10 max-w-sm w-full p-6 shadow-xl">
        <p className="t-eyebrow text-ink/50 mb-2">Permission</p>
        <h2 className="t-title mb-3">{c.title}</h2>
        <p className="t-body-sm text-ink/75 mb-3">{c.body}</p>
        <p className="t-meta text-ink/50 mb-6">{c.note}</p>
        <div className="flex gap-2">
          <button
            onClick={onDismiss}
            className="t-button flex-1 py-3 rounded-2xl bg-white border border-ink/15 text-ink/70"
          >
            Not now
          </button>
          <button
            onClick={() => { ack(kind); onProceed(); }}
            className="t-button flex-1 py-3 rounded-2xl bg-ink text-canvas"
          >
            {c.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
