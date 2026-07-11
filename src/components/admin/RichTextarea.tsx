import { useRef, useState, type KeyboardEvent } from "react";
import { Bold, Italic, Underline, CornerDownLeft, Palette, X } from "lucide-react";
import { renderRichText } from "@/lib/marketing/richText";

type Marker = "**" | "*" | "__";

const PRESET_COLORS = [
  "#1a1a1a", "#4a5d4e", "#c44536", "#d97706",
  "#2563eb", "#7c3aed", "#db2777", "#0d9488",
];

/**
 * Textarea with a mini formatting toolbar (bold / italic / underline / colour)
 * and standard keyboard shortcuts (Cmd/Ctrl + B / I / U). Stores markdown-ish
 * markers in the value so the site can render them safely.
 */
export function RichTextarea({
  label, value, onChange, rows = 3, help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  help?: string;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [colorOpen, setColorOpen] = useState(false);

  const wrap = (marker: Marker) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const before = value.slice(0, start);
    const sel = value.slice(start, end) || "text";
    const after = value.slice(end);
    const next = `${before}${marker}${sel}${marker}${after}`;
    onChange(next);
    requestAnimationFrame(() => {
      if (!ref.current) return;
      const s = start + marker.length;
      const e = s + sel.length;
      ref.current.focus();
      ref.current.setSelectionRange(s, e);
    });
  };

  const wrapColor = (color: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const before = value.slice(0, start);
    const sel = value.slice(start, end) || "text";
    const after = value.slice(end);
    const open = `{c:${color}}`;
    const close = `{/c}`;
    const next = `${before}${open}${sel}${close}${after}`;
    onChange(next);
    requestAnimationFrame(() => {
      if (!ref.current) return;
      const s = start + open.length;
      const e = s + sel.length;
      ref.current.focus();
      ref.current.setSelectionRange(s, e);
    });
    setColorOpen(false);
  };

  const clearColor = () => {
    // Remove {c:...} and {/c} tags from the current selection (or all if empty).
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const hasSel = end > start;
    const target = hasSel ? value.slice(start, end) : value;
    const cleaned = target.replace(/\{c:[^}]+\}/g, "").replace(/\{\/c\}/g, "");
    const next = hasSel ? value.slice(0, start) + cleaned + value.slice(end) : cleaned;
    onChange(next);
    setColorOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.metaKey || e.ctrlKey)) return;
    const k = e.key.toLowerCase();
    if (k === "b") { e.preventDefault(); wrap("**"); }
    else if (k === "i") { e.preventDefault(); wrap("*"); }
    else if (k === "u") { e.preventDefault(); wrap("__"); }
  };

  const insertNewline = () => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const next = value.slice(0, start) + "\n" + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      if (!ref.current) return;
      const pos = start + 1;
      ref.current.focus();
      ref.current.setSelectionRange(pos, pos);
    });
  };

  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-ink/40">{label}</span>
      <div className="mt-1 rounded-lg border border-ink/10 bg-white overflow-visible focus-within:ring-2 focus-within:ring-brand/40">
        <div className="relative flex items-center gap-1 px-2 py-1 border-b border-ink/10 bg-canvas/60">
          <ToolbarBtn onClick={() => wrap("**")} title="Bold (Cmd/Ctrl+B)"><Bold className="size-3.5" /></ToolbarBtn>
          <ToolbarBtn onClick={() => wrap("*")} title="Italic (Cmd/Ctrl+I)"><Italic className="size-3.5" /></ToolbarBtn>
          <ToolbarBtn onClick={() => wrap("__")} title="Underline (Cmd/Ctrl+U)"><Underline className="size-3.5" /></ToolbarBtn>
          <ToolbarBtn onClick={insertNewline} title="Insert line break (Enter)"><CornerDownLeft className="size-3.5" /></ToolbarBtn>
          <ToolbarBtn onClick={() => setColorOpen((v) => !v)} title="Text colour"><Palette className="size-3.5" /></ToolbarBtn>
          <span className="ml-auto text-[10px] text-ink/40">Enter = new line · **b** *i* __u__ · colour</span>

          {colorOpen && (
            <div
              className="absolute z-20 top-full left-0 mt-1 rounded-lg border border-ink/10 bg-white shadow-lg p-2 flex items-center gap-1.5"
              onMouseDown={(e) => e.preventDefault()}
            >
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => wrapColor(c)}
                  title={c}
                  aria-label={`Apply colour ${c}`}
                  className="size-5 rounded-full border border-ink/15"
                  style={{ background: c }}
                />
              ))}
              <label
                className="grid place-items-center size-5 rounded-full border border-ink/15 cursor-pointer bg-white overflow-hidden"
                title="Custom colour"
              >
                <span className="text-[10px] text-ink/50">+</span>
                <input
                  type="color"
                  className="absolute opacity-0 size-0"
                  onChange={(e) => wrapColor(e.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={clearColor}
                title="Remove colour"
                aria-label="Remove colour"
                className="grid place-items-center size-5 rounded-full border border-ink/15 text-ink/50 hover:text-ink"
              >
                <X className="size-3" />
              </button>
            </div>
          )}
        </div>

        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          rows={rows}
          className="w-full bg-white px-3 py-2 text-sm font-sans outline-none resize-y"
        />
      </div>
      {value && (
        <div className="mt-1 text-xs text-ink/60">
          <span className="text-[10px] uppercase tracking-widest text-ink/40 mr-2">Preview:</span>
          {renderRichText(value)}
        </div>
      )}
      {help && <span className="mt-1 block text-[10px] text-ink/40">{help}</span>}
    </label>
  );
}

function ToolbarBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      aria-label={title}
      className="grid place-items-center size-7 rounded hover:bg-ink/5 text-ink/70 hover:text-ink"
    >
      {children}
    </button>
  );
}
