import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useRef } from "react";

/**
 * Left/right swipe navigation across the 5 "Do it Later" tabs, mirroring
 * the same gesture on the Notify surface.
 *
 * Order: Reminder → Packs → Recall → Archived → Erased
 * Usage: const swipe = useDoItLaterSwipe(); <div {...swipe}>...</div>
 */

type Step = { to: string; search?: Record<string, unknown>; id: string };

const ORDER: Step[] = [
  { id: "reminder", to: "/home" },
  { id: "packs",    to: "/packs" },
  { id: "recall",   to: "/recall" },
  { id: "archived", to: "/recovery", search: { tab: "archived" } },
  { id: "erased",   to: "/recovery", search: { tab: "erased" } },
];

function currentIndex(pathname: string, search: Record<string, unknown>): number {
  if (pathname.startsWith("/home")) return 0;
  if (pathname.startsWith("/packs")) return 1;
  if (pathname.startsWith("/recall")) return 2;
  if (pathname.startsWith("/recovery")) return search?.tab === "erased" ? 4 : 3;
  return -1;
}

export function useDoItLaterSwipe() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.search as Record<string, unknown> });
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const go = (dir: 1 | -1) => {
    const idx = currentIndex(pathname, search);
    if (idx < 0) return;
    const next = idx + dir;
    if (next < 0 || next >= ORDER.length) return;
    const step = ORDER[next];
    navigate({ to: step.to as any, search: step.search as any });
  };

  return {
    onTouchStart: (e: React.TouchEvent) => {
      const t = e.touches[0];
      touchRef.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const start = touchRef.current;
      if (!start) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      touchRef.current = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        go(dx < 0 ? 1 : -1);
      }
    },
  };
}
