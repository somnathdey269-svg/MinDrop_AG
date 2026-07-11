import { useEffect, useState } from "react";

/**
 * Returns pixels currently covered by the on-screen keyboard (or other
 * layout-viewport-shrinking UI) at the bottom of the window.
 *
 * Uses visualViewport when available. Falls back to 0 elsewhere. Safe to
 * call in SSR — always starts at 0.
 */
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const vv = window.visualViewport;
    if (!vv) return;

    let raf = 0;
    const compute = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const gap = window.innerHeight - (vv.height + vv.offsetTop);
        setInset(gap > 40 ? gap : 0);
      });
    };
    compute();
    vv.addEventListener("resize", compute);
    vv.addEventListener("scroll", compute);
    return () => {
      cancelAnimationFrame(raf);
      vv.removeEventListener("resize", compute);
      vv.removeEventListener("scroll", compute);
    };
  }, []);

  return inset;
}
