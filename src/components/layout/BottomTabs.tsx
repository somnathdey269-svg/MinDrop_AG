import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, LayoutDashboard, MapPin, Settings, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

/**
 * Bottom navigation — Home centered as the hero action.
 * Side-tab accents pull from the current country theme so the app palette stays
 * consistent with the dashboard rooms (accent1 = Later, accent3 = Places).
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

function SideTabItem({ tab, active }: { tab: SideTab; active: boolean }) {
  const Icon = tab.icon;
  const color = tab.accent || "var(--ink)";
  return (
    <Link
      to={tab.to as any}
      onClick={() => { try { sessionStorage.removeItem("gmd:from"); } catch {} }}
      aria-current={active ? "page" : undefined}
      aria-label={tab.label}
      className="relative flex flex-col items-center gap-1 pt-2.5 pb-1 press flex-1"
    >
      {active && (
        <motion.span
          layoutId="bottomtab-dot"
          aria-hidden="true"
          className="absolute top-1 h-[3px] w-5 rounded-full"
          style={{ background: color }}
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}
      <motion.span
        animate={{ y: active ? -1 : 0, scale: active ? 1.08 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Icon
          className="size-[19px] transition-colors"
          strokeWidth={active ? 2.1 : 1.6}
          aria-hidden="true"
          style={{ color: active ? color : "color-mix(in oklab, var(--ink) 55%, transparent)" }}
        />
      </motion.span>
      <span
        className="t-eyebrow transition-colors"
        style={{ color: active ? color : "color-mix(in oklab, var(--ink) 50%, transparent)" }}
      >
        {tab.label}
      </span>
    </Link>
  );
}

export function BottomTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { accent1, accent3 } = useCountryTheme();
  const homeActive = isActive(pathname, "/dashboard");
  const leftTabs: SideTab[] = [
    { to: "/home",   label: "Later",  icon: Clock, accent: accent1 },
    { to: "/notify", label: "Notify", icon: Bell },
  ];
  const rightTabs: SideTab[] = [
    { to: "/places",   label: "Places",   icon: MapPin, accent: accent3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav
      data-tour="bottom-tabs"
      className="sticky bottom-0 z-30 shrink-0 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      style={{
        background: "color-mix(in srgb, var(--canvas) 82%, transparent)",
        backdropFilter: "saturate(140%) blur(10px)",
        WebkitBackdropFilter: "saturate(140%) blur(10px)",
        borderTop: "1px solid var(--hairline)",
      }}
      aria-label="Primary"
    >

      <div className="relative flex items-stretch">
        {leftTabs.map((t) => (
          <SideTabItem key={t.to} tab={t} active={isActive(pathname, t.to)} />
        ))}

        {/* Centered Home — inline, icon-only, brand-tinted */}
        <Link
          to="/dashboard"
          onClick={() => { try { sessionStorage.removeItem("gmd:from"); } catch {} }}
          aria-current={homeActive ? "page" : undefined}
          aria-label="Home"
          className="relative flex-1 flex flex-col items-center justify-center pt-2.5 pb-1 press"
        >
          <motion.span
            aria-hidden="true"
            className="absolute top-1 h-[3px] w-6 rounded-full"
            animate={{ opacity: homeActive ? 1 : 0 }}
            style={{ background: "var(--brand)" }}
          />
          <motion.span
            whileTap={{ scale: 0.92 }}
            animate={{ scale: homeActive ? 1 : 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="grid place-items-center size-11 rounded-full text-canvas shadow-[0_6px_16px_-6px_rgba(74,93,78,0.55)]"
            style={{ background: homeActive ? "var(--brand)" : "var(--ink)" }}
          >
            <LayoutDashboard className="size-[20px]" strokeWidth={2} aria-hidden="true" />
          </motion.span>
        </Link>

        {rightTabs.map((t) => (
          <SideTabItem key={t.to} tab={t} active={isActive(pathname, t.to)} />
        ))}
      </div>
    </nav>
  );
}
