import { Fragment, type ReactNode } from "react";

/**
 * Tiny markdown-ish renderer for CMS text.
 * Supports:
 *   **bold**      → <strong>
 *   *italic*      → <em>
 *   __underline__ → <u>
 *   {c:#hex}text{/c} or {c:red}text{/c} → coloured span
 * Line breaks are preserved.
 * Nesting is not supported — patterns are matched in the order listed above.
 */
export function renderRichText(input: string | null | undefined): ReactNode {
  if (!input) return null;
  const lines = input.split(/\r?\n/);
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {parseInline(line)}
          {i < lines.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </>
  );
}

// Order matters: color first (may wrap other markers), then bold, underline, italic.
const PATTERN =
  /(\{c:([^}]+)\}([\s\S]+?)\{\/c\})|(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*]+)\*)/g;

function parseInline(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  PATTERN.lastIndex = 0;
  while ((m = PATTERN.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      const color = safeColor(m[2]);
      nodes.push(
        <span key={key++} style={color ? { color } : undefined}>
          {parseInlineNoColor(m[3])}
        </span>,
      );
    } else if (m[5] !== undefined) nodes.push(<strong key={key++}>{m[5]}</strong>);
    else if (m[7] !== undefined) nodes.push(<u key={key++}>{m[7]}</u>);
    else if (m[9] !== undefined) nodes.push(<em key={key++}>{m[9]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

// Inside a color span we still allow bold/italic/underline, but not nested color.
const INNER = /(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*]+)\*)/g;
function parseInlineNoColor(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  INNER.lastIndex = 0;
  while ((m = INNER.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] !== undefined) nodes.push(<strong key={key++}>{m[2]}</strong>);
    else if (m[4] !== undefined) nodes.push(<u key={key++}>{m[4]}</u>);
    else if (m[6] !== undefined) nodes.push(<em key={key++}>{m[6]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

// Allow hex (#abc / #aabbcc / #aabbccdd) or a short list of safe named colors.
const NAMED = new Set([
  "black", "white", "red", "green", "blue", "orange", "yellow",
  "purple", "pink", "teal", "cyan", "magenta", "brown", "grey", "gray",
]);
function safeColor(raw: string): string | null {
  const v = raw.trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(v)) return v;
  if (NAMED.has(v)) return v;
  return null;
}
