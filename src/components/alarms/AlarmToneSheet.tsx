/**
 * AlarmToneSheet — bottom-sheet picker for the 12 built-in alarm tones.
 * Tapping a row previews the tone for ~2s; a second tap confirms it. Uses
 * design tokens only (`.t-*` roles, `bg-canvas`, `border-ink/10`).
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Play, Square, X } from "lucide-react";
import { TONES, type ToneId, toneById } from "@/lib/alarms/tones";
import { AlarmsBridge } from "@/lib/alarms/bridge";

interface Props {
  open: boolean;
  selected: ToneId;
  onSelect: (id: ToneId) => void;
  onClose: () => void;
  title?: string;
}

export function AlarmToneSheet({ open, selected, onSelect, onClose, title = "Alarm tone" }: Props) {
  const [playingId, setPlayingId] = useState<ToneId | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) stopAll();
    return () => stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function stopAll() {
    if (stopTimerRef.current) { window.clearTimeout(stopTimerRef.current); stopTimerRef.current = null; }
    try { audioRef.current?.pause(); } catch {}
    audioRef.current = null;
    if (AlarmsBridge.isNative()) void AlarmsBridge.stopPreview();
    setPlayingId(null);
  }

  function preview(id: ToneId) {
    stopAll();
    const tone = toneById(id);
    if (tone.silentOnly) {
      try { navigator.vibrate?.([200, 100, 200]); } catch {}
      setPlayingId(id);
      stopTimerRef.current = window.setTimeout(stopAll, 800);
      return;
    }
    // Always preview via HTMLAudio (works in WebView + browser). We deliberately
    // do NOT invoke the native foreground service here — it crashed on some
    // devices when notification permission wasn't granted yet.
    try {
      const a = new Audio(tone.webUrl);
      a.loop = true;
      a.volume = 0.7;
      audioRef.current = a;
      void a.play().catch(() => {});
      setPlayingId(id);
      stopTimerRef.current = window.setTimeout(stopAll, 2500);
    } catch { setPlayingId(null); }
  }

  function pick(id: ToneId) {
    onSelect(id);
    stopAll();
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/50 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => { stopAll(); onClose(); }}
          role="dialog" aria-modal="true" aria-label={title}
        >
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full max-w-md bg-canvas rounded-t-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <p className="t-eyebrow text-ink/60">{title}</p>
              <button
                onClick={() => { stopAll(); onClose(); }}
                aria-label="Close tone picker"
                className="size-8 grid place-items-center rounded-full hover:bg-ink/5"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mx-5 mb-2 h-px bg-ink/10" />
            <ul className="max-h-[65vh] overflow-y-auto pb-4">
              {TONES.map((t) => {
                const isSel = t.id === selected;
                const isPlaying = t.id === playingId;
                return (
                  <li key={t.id}>
                    <div className="flex items-center gap-3 px-4 py-2.5">
                      <button
                        onClick={() => (isPlaying ? stopAll() : preview(t.id))}
                        aria-label={isPlaying ? `Stop preview of ${t.label}` : `Preview ${t.label}`}
                        className="size-10 shrink-0 rounded-full border border-ink/10 grid place-items-center active:bg-ink/[0.04]"
                      >
                        {isPlaying ? <Square className="size-4" /> : <Play className="size-4 ml-0.5" />}
                      </button>
                      <button
                        onClick={() => pick(t.id)}
                        className="flex-1 min-w-0 text-left"
                        aria-label={`Choose ${t.label}`}
                      >
                        <p className="t-body text-ink truncate">{t.label}</p>
                        <p className="t-meta text-ink/55 truncate">{t.hint}</p>
                      </button>
                      {isSel && (
                        <span className="size-6 shrink-0 rounded-full bg-ink text-canvas grid place-items-center">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
