import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: string;
  lede?: string;
  accent?: string;
  /** Right-aligned slot (small icon action, filter, etc.) */
  action?: ReactNode;
  className?: string;
}

/**
 * Editorial page header — eyebrow · oversized Instrument Serif h1 · lede · hairline rule.
 *
 * Used at the top of every consumer route so the app reads like a magazine
 * section rather than a stack of headings.
 */
export function PageHeader({ eyebrow, title, lede, accent, action, className = "" }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`relative mb-5 ${className}`}
    >
      <div className="flex items-baseline justify-between gap-3">
        {eyebrow && (
          <p
            className="eyebrow inline-flex items-center gap-1.5"
            style={accent ? { color: accent } : undefined}
          >
            {accent && (
              <span
                aria-hidden="true"
                className="inline-block size-1.5 rounded-full"
                style={{ background: accent }}
              />
            )}
            {eyebrow}
          </p>
        )}
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <h1 className="t-display text-ink -ml-0.5 mt-2">
        {title}
      </h1>
      {lede && (
        <p className="t-body-sm mt-2 text-ink/70 max-w-[38ch]">
          {lede}
        </p>
      )}
      <div className="mt-4 rule-hair" />
    </motion.header>
  );
}
