import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, LayoutDashboard, MapPin, Settings, Clock, Grid, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";
import { useState, useEffect } from "react";

/**
 * Bottom navigation — Space-saving floating radial action menu.
 * Tapping the trigger rotates the icon and expands an elegant glassmorphism dock.
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
  const { accent1, accent3 } = useCountryTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Close navigation overlay automatically when navigating away
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const allTabs: SideTab[] = [
    { to: "/home",       label: "Later",    icon: Clock, accent: accent1 },
    { to: "/notify",     label: "Notify",   icon: Bell },
    { to: "/dashboard",  label: "Home",     icon: LayoutDashboard, accent: "var(--brand)" },
    { to: "/places",     label: "Places",   icon: MapPin, accent: accent3 },
    { to: "/settings",   label: "Settings", icon: Settings },
  ];

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
            initial={{ opacity: 0, scale: 0.9, y: 15, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: 15, x: "-50%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed md:absolute bottom-24 left-1/2 z-40 flex items-center justify-around gap-2 px-4 py-3 rounded-[2rem] border border-ink/10 bg-canvas/80 backdrop-blur-xl shadow-2xl w-[90%] max-w-[380px]"
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
                  className="flex flex-col items-center gap-1.5 p-2 press flex-1 min-w-0"
                  aria-label={t.label}
                >
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="grid place-items-center size-10 rounded-full text-canvas shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                    style={{ background: active ? color : "color-mix(in oklab, var(--ink) 12%, transparent)", color: active ? "var(--canvas)" : "var(--ink)" }}
                  >
                    <Icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.6} />
                  </motion.span>
                  <span
                    className="t-eyebrow transition-colors truncate max-w-full text-[10px]"
                    style={{ color: active ? color : "color-mix(in oklab, var(--ink) 60%, transparent)", fontWeight: active ? 600 : 400 }}
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
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        className="fixed md:absolute bottom-6 left-1/2 -translate-x-1/2 z-40 grid place-items-center size-14 rounded-full bg-ink text-canvas shadow-[0_8px_24px_rgba(0,0,0,0.22)] border border-white/10 press"
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
      >
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 450, damping: 22 }}
        >
          {isOpen ? <X className="size-[22px]" strokeWidth={2.2} /> : <Grid className="size-[22px]" strokeWidth={1.8} />}
        </motion.span>
      </motion.button>
    </div>
  );
}
