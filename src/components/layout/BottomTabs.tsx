import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, LayoutDashboard, MapPin, Settings, Clock, Grid, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";
import { useState, useEffect } from "react";

/**
 * Bottom navigation — Space-saving floating radial action menu.
 * Positioned on the bottom-right side of the screen with a pulsing micro-animation.
 * Auto-hides when a native dialog / sheet popup is open to prevent collisions.
 */

type SideTab = { to: string; label: string; icon: any; accent?: string };

function isActive(pathname: string, to: string): boolean {
  if (to === "/home")
    return (
      pathname.startsWith("/home") ||
      pathname.startsWith("/packs") ||
      pathname.startsWith("/recall") ||
      pathname.startsWith("/recovery")
    );
  if (to === "/dashboard") return pathname === "/" || pathname.startsWith("/dashboard");
  return pathname.startsWith(to);
}

export function BottomTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { accent1, accent2, accent3 } = useCountryTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenDialog, setHasOpenDialog] = useState(false);

  // Monitor for modal dialogs / sheet popups in the DOM to prevent collisions
  useEffect(() => {
    if (typeof document === "undefined") return;

    const checkDialogs = () => {
      const dialogs = document.querySelectorAll(
        '[role="dialog"], [role="alertdialog"], [data-radix-portal], .radix-dialog-content'
      );
      setHasOpenDialog(dialogs.length > 0);
    };

    const observer = new MutationObserver(checkDialogs);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check
    checkDialogs();

    return () => observer.disconnect();
  }, []);

  // Close navigation overlay automatically when navigating away
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const allTabs: SideTab[] = [
    { to: "/dashboard",  label: "Home",     icon: LayoutDashboard, accent: "var(--brand)" },
    { to: "/home",       label: "Later",    icon: Clock, accent: accent1 },
    { to: "/notify",     label: "Notify",   icon: Bell, accent: accent2 },
    { to: "/places",     label: "Places",   icon: MapPin, accent: accent3 },
    { to: "/settings",   label: "Settings", icon: Settings },
  ];

  // If a modal or sheet is open in the app, hide the floating menu completely
  if (hasOpenDialog) {
    return null;
  }

  return (
    <div data-tour="bottom-tabs" className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            className="fixed md:absolute inset-0 bg-ink z-30"
            onClick={() => setIsOpen(false)}
          />
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed md:absolute bottom-24 right-6 z-40 flex flex-col gap-1 p-2 rounded-2xl border border-ink/10 bg-canvas/80 backdrop-blur-xl shadow-2xl w-[185px] max-w-[calc(100vw-3rem)]"
          >
            {allTabs.map((t) => {
              const active = isActive(pathname, t.to);
              const Icon = t.icon;
              const color = t.accent || "var(--ink)";
              return (
                <Link
                  key={t.to}
                  to={t.to as any}
                  onClick={() => { try { sessionStorage.removeItem("gmd:from"); } catch {} }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl press select-none transition-colors"
                  style={{
                    background: active
                      ? "color-mix(in oklab, var(--ink) 6%, transparent)"
                      : "transparent",
                  }}
                  aria-label={t.label}
                >
                  <span
                    className="grid place-items-center size-8 rounded-lg text-canvas shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                    style={{
                      background: active ? color : "color-mix(in oklab, var(--ink) 10%, transparent)",
                      color: active ? "var(--canvas)" : "var(--ink)",
                    }}
                  >
                    <Icon className="size-4" strokeWidth={active ? 2.2 : 1.6} />
                  </span>
                  <span
                    className="t-body transition-colors text-sm font-medium"
                    style={{
                      color: active ? color : "var(--ink)",
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    {t.label}
                  </span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.05 }}
        animate={{
          y: [0, -5, 0],
          boxShadow: [
            "0 8px 24px rgba(74, 93, 78, 0.35)",
            "0 14px 32px rgba(74, 93, 78, 0.55)",
            "0 8px 24px rgba(74, 93, 78, 0.35)"
          ]
        }}
        transition={{
          y: { repeat: Infinity, repeatType: "reverse", duration: 3.5, ease: "easeInOut" },
          boxShadow: { repeat: Infinity, repeatType: "reverse", duration: 3.5, ease: "easeInOut" },
          scale: { type: "spring", stiffness: 400, damping: 25 }
        }}
        className="fixed md:absolute bottom-6 right-6 z-40 grid place-items-center size-14 rounded-full text-canvas border border-white/10 press"
        style={{
          background: "linear-gradient(135deg, var(--brand) 0%, color-mix(in oklab, var(--brand) 75%, #ff7655) 100%)",
        }}
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
      >
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 450, damping: 22 }}
          className="flex items-center justify-center"
        >
          {isOpen ? (
            <X className="size-[22px]" strokeWidth={2.4} />
          ) : (
            <Grid className="size-[22px]" strokeWidth={1.8} />
          )}
        </motion.span>
      </motion.button>
    </div>
  );
}
