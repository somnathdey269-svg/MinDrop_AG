import { useRouterState } from "@tanstack/react-router";
import { Archive, Bookmark, Package, Sparkles, Trash2 } from "lucide-react";
import { SegmentedTabBar, type SegmentedTab } from "./SegmentedTabBar";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

/**
 * Top-tab bar for the "Do it Later" surface.
 * Reminder · Packs · Recall · Archived · Erased.
 */

const TABS: SegmentedTab[] = [
  { id: "reminder", label: "Reminder", icon: Bookmark, to: "/home" },
  { id: "packs",    label: "Packs",    icon: Package,  to: "/packs" },
  { id: "recall",   label: "Recall",   icon: Sparkles, to: "/recall" },
  { id: "archived", label: "Archived", icon: Archive,  to: "/archived" },
  { id: "erased",   label: "Erased",   icon: Trash2,   to: "/erased" },
];

export function DoItLaterTabs({ className = "" }: { className?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { accent1 } = useCountryTheme();

  const activeId = (() => {
    if (pathname.startsWith("/home")) return "reminder";
    if (pathname.startsWith("/packs")) return "packs";
    if (pathname.startsWith("/recall")) return "recall";
    if (pathname.startsWith("/archived")) return "archived";
    if (pathname.startsWith("/erased")) return "erased";
    return "";
  })();

  return (
    <SegmentedTabBar
      tabs={TABS}
      activeId={activeId}
      accent={accent1}
      ariaLabel="Do it Later sections"
      layoutId="do-it-later-pill"
      className={className}
    />
  );
}
