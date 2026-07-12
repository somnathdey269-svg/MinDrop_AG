import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ComponentType, SVGProps } from "react";
import { getReadableAccent } from "@/lib/theme/palette";

/**
 * Shared segmented tab bar.
 * Warm-paper recessed track, spring-animated pill with a hair-thin accent
 * underline on the active tab. Icons stack over tiny caps labels.
 *
 * Used by:
 *  - Do it Later  (5 tabs, orange accent)
 *  - Notify       (4 tabs, brand-green accent)
 */

export type SegmentedTab = {
  id: string;
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  count?: number;
  to?: string;
  search?: Record<string, unknown>;
  onClick?: () => void;
};

type Props = {
  tabs: SegmentedTab[];
  activeId: string;
  accent: string;
  ariaLabel: string;
  showIcons?: boolean;
  className?: string;
  layoutId?: string;
};

export function SegmentedTabBar({
  tabs,
  activeId,
  accent,
  ariaLabel,
  showIcons,
  className = "",
  layoutId = "segmented-tabbar-pill",
}: Props) {
  const withIcons = showIcons ?? tabs.some((t) => !!t.icon);

  return (
    <div
      className={`relative flex p-1 rounded-[20px] mb-5 paper-recessed ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((t) => {
        const active = activeId === t.id;
        const Icon = t.icon;

        const inner = (
          <>
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-1 rounded-[16px]"
                style={{
                  background: "var(--paper-raised)",
                  boxShadow:
                    "0 2px 8px rgba(26,26,26,0.08), 0 1px 2px rgba(26,26,26,0.04), inset 0 0 0 1px rgba(255,255,255,0.9)",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 38, mass: 0.7 }}
                aria-hidden="true"
              />
            )}
            {active && (
              <motion.span
                layoutId={`${layoutId}-underline`}
                aria-hidden="true"
                className="absolute bottom-[6px] h-[2px] w-6 rounded-full"
                style={{ background: getReadableAccent(accent) }}
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span
              className={`relative flex flex-col items-center justify-center gap-1 leading-none transition-opacity duration-200 ${
                active ? "opacity-100" : "opacity-55 group-hover:opacity-85"
              }`}
            >
              {withIcons && Icon && (
                <div className="relative">
                  <motion.span
                    initial={false}
                    animate={{ scale: active ? 1.08 : 1, y: active ? -1 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="block"
                  >
                    <Icon
                      className="size-[18px]"
                      strokeWidth={active ? 2.2 : 1.75}
                      aria-hidden="true"
                      style={{ color: active ? getReadableAccent(accent) : "var(--ink)" }}
                    />
                  </motion.span>
                  {typeof t.count === "number" && t.count > 0 && (
                    <span
                      className="t-meta absolute -top-1.5 -right-2.5 min-w-[15px] h-[15px] px-1 rounded-full text-white flex items-center justify-center"
                      style={{
                        background: getReadableAccent(accent),
                        border: `2px solid var(--paper-recessed)`,
                        lineHeight: 1,
                      }}
                    >
                      {t.count > 99 ? "99+" : t.count}
                    </span>
                  )}
                </div>
              )}
              <span
                className="t-meta text-ink"
                style={{ fontWeight: active ? 600 : 500 }}
              >
                {t.label}
              </span>
            </span>
          </>
        );

        const commonCls =
          "group relative isolate flex-1 flex items-center justify-center py-2.5 min-h-[52px] rounded-[16px] press";

        if (t.to) {
          return (
            <Link
              key={t.id}
              to={t.to as any}
              search={t.search as any}
              role="tab"
              aria-selected={active}
              aria-current={active ? "page" : undefined}
              className={commonCls}
            >
              {inner}
            </Link>
          );
        }
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-current={active ? "page" : undefined}
            onClick={t.onClick}
            className={commonCls}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}
