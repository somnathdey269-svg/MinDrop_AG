import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { PAYWALL_EVENT, type PaywallEventDetail } from "@/lib/tier";

const COPY: Record<PaywallEventDetail["reason"], { title: string; body: (limit: number) => string }> = {
  snooze: {
    title: "Do-it-later limit reached",
    body: (l) => `You've used your ${l} do-it-laters today. Upgrade for unlimited.`,
  },
  notify: {
    title: "Notify rules limit reached",
    body: (l) => `You've got ${l} active notify rules. Premium removes the cap.`,
  },
  places: {
    title: "Saved places limit reached",
    body: (l) => `You've got ${l} saved places. Premium removes the cap.`,
  },
};

export function PaywallSheet() {
  const [detail, setDetail] = useState<PaywallEventDetail | null>(null);
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<PaywallEventDetail>).detail;
      if (d) setDetail(d);
    };
    window.addEventListener(PAYWALL_EVENT, onOpen as EventListener);
    return () => window.removeEventListener(PAYWALL_EVENT, onOpen as EventListener);
  }, []);

  if (!detail) return null;
  const copy = COPY[detail.reason];
  const isAnon = detail.tier === "anon";

  const close = () => setDetail(null);
  const goUpgrade = () => { close(); navigate({ to: "/paywall" }); };
  const goSignIn = () => {
    close();
    const next = router.state.location.pathname + router.state.location.search;
    navigate({ to: "/auth", search: { next } as never });
  };

  return (
    <AnimatePresence>
      {detail && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-ink/70 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={copy.title}
        >
          <motion.div
            initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-canvas p-6 pb-8"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-ink/5 text-ink/70 active:bg-ink/10"
            >
              <X className="size-4" />
            </button>
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-brand/10 text-brand">
              <Sparkles className="size-7" />
            </div>
            <h2 className="t-title text-ink text-center mb-2">{copy.title}</h2>
            <p className="t-body text-ink/75 text-center mb-6">
              {copy.body(detail.limit)}
              {isAnon && " Or sign in to get 2 more free."}
            </p>
            <div className="grid gap-2">
              <button
                onClick={goUpgrade}
                className="t-button bg-ink text-canvas py-3.5 rounded-2xl"
              >
                Upgrade to Premium
              </button>
              {isAnon && (
                <button
                  onClick={goSignIn}
                  className="t-button bg-canvas border border-ink/15 text-ink py-3.5 rounded-2xl"
                >
                  Sign in for +2 free
                </button>
              )}
              <button
                onClick={close}
                className="t-button text-ink/60 py-2"
              >
                Not now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
