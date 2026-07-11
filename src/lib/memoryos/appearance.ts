import { useEffect, useState, useCallback } from "react";

/**
 * Appearance preferences — user-controlled font family + size.
 *
 * Applied by mutating CSS custom properties on <html>, so it affects every
 * screen instantly without re-rendering the tree.
 *
 * Persisted to localStorage; falls back to defaults on first load.
 */

export type FontChoice = "sans" | "serif" | "mono";
export type SizeChoice = "s" | "m" | "l" | "xl";

export type Appearance = {
  font: FontChoice;
  size: SizeChoice;
};

export const DEFAULT_APPEARANCE: Appearance = { font: "sans", size: "s" };

const KEY = "mindrop.appearance.v1";

// Distinct stacks so the Font tile is a real accessibility control:
// Serif suits readers who prefer print-like feel; Mono has wide-set letters
// that many dyslexic readers find easier. apply() remaps every font var to
// the chosen stack so the whole app follows one Font choice.
export const FONT_STACKS: Record<FontChoice, string> = {
  sans: `"Inter", ui-sans-serif, system-ui, sans-serif`,
  serif: `"Instrument Serif", "Lora", ui-serif, Georgia, serif`,
  mono: `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace`,
};

export const FONT_LABELS: Record<FontChoice, string> = {
  sans: "Sans",
  serif: "Serif",
  mono: "Mono",
};

// Root font-size in px. Every rem-based Tailwind spacing/size class and every
// .t-* type role uses rem, so both text AND spacing scale from this single
// value — the viewport (100dvh) stays fixed, so fixed elements (bottom tabs,
// floating CTAs) keep their positions relative to the screen.
export const SIZE_PX: Record<SizeChoice, number> = {
  s: 14,
  m: 16,
  l: 18,
  xl: 20,
};

export const SIZE_LABELS: Record<SizeChoice, string> = {
  s: "S",
  m: "M",
  l: "L",
  xl: "XL",
};

function apply(a: Appearance) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const stack = FONT_STACKS[a.font];
  root.style.setProperty("--font-sans", stack);
  root.style.setProperty("--font-serif", stack);
  root.style.setProperty("--font-mono", stack);
  root.style.fontSize = `${SIZE_PX[a.size]}px`;
  root.dataset.font = a.font;
  root.dataset.size = a.size;
}

function read(): Appearance {
  if (typeof window === "undefined") return DEFAULT_APPEARANCE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_APPEARANCE;
    const parsed = JSON.parse(raw) as Partial<Appearance>;
    return {
      font: (parsed.font as FontChoice) || DEFAULT_APPEARANCE.font,
      size: (parsed.size as SizeChoice) || DEFAULT_APPEARANCE.size,
    };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

/** Run once at app boot, before the first paint if possible. */
export function bootAppearance() {
  apply(read());
}

export function useAppearance() {
  const [appearance, setAppearance] = useState<Appearance>(DEFAULT_APPEARANCE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const a = read();
    setAppearance(a);
    apply(a);
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      const next = read();
      setAppearance(next);
      apply(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const set = useCallback((patch: Partial<Appearance>) => {
    setAppearance((prev) => {
      const next = { ...prev, ...patch };
      try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      apply(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try { window.localStorage.removeItem(KEY); } catch {}
    setAppearance(DEFAULT_APPEARANCE);
    apply(DEFAULT_APPEARANCE);
  }, []);

  return { appearance, set, reset, hydrated };
}
