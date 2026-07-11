import { AnimatePresence, motion, useMotionValueEvent, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * PhoneLive — embeds one of the real app routes inside the small phone card.
 *
 * The iframe is rendered at a phone-sized viewport (390×844) and scaled down
 * with CSS transform to fit whatever container it lives in. It is fully
 * decorative: no pointer events, no focus, no scroll.
 *
 * `screens` is a list of in-app paths (e.g. "/do-it-later", "/packs") that
 * rotate as the scene's `progress` MotionValue advances across beats.
 */

interface PhoneLiveProps {
  progress: MotionValue<number>;
  screens: string[];
  /** Design width the app is captured at, before scaling. */
  frameWidth?: number;
  /** Design height the app is captured at, before scaling. */
  frameHeight?: number;
}

export function PhoneLive({
  progress,
  screens,
  frameWidth = 390,
  frameHeight = 844,
}: PhoneLiveProps) {
  const [idx, setIdx] = useState(0);
  const fitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = fitRef.current;
    if (!el) return;
    const apply = () => {
      const rect = el.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (!w || !h) return;
      const scale = Math.min(w / frameWidth, h / frameHeight);
      el.style.setProperty("--phone-scale", String(scale));
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [frameWidth, frameHeight]);

  useMotionValueEvent(progress, "change", (v) => {
    if (screens.length <= 1) return;
    const next = Math.min(
      screens.length - 1,
      Math.max(0, Math.round(v * (screens.length - 1))),
    );
    setIdx((prev) => (prev === next ? prev : next));
  });

  const path = screens[Math.min(idx, screens.length - 1)] ?? screens[0];
  const src = path
    ? `${path}${path.includes("?") ? "&" : "?"}embed=1`
    : "about:blank";

  return (
    <div
      ref={fitRef}
      className="absolute inset-0 overflow-hidden bg-canvas"
      style={{ "--phone-scale": 0.18 } as CSSProperties}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.iframe
          key={src}
          src={src}
          title="MinDrop screen preview"
          aria-hidden="true"
          tabIndex={-1}
          scrolling="no"
          loading="lazy"
          initial={{ opacity: 0, y: 8, scale: 0.985, filter: "blur(1px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.01, filter: "blur(1px)" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 border-0 pointer-events-none origin-top-left"
          style={{
            width: frameWidth,
            height: frameHeight,
            transform: `scale(var(--phone-scale, 0.33))`,
          }}
        />
      </AnimatePresence>
    </div>
  );
}
