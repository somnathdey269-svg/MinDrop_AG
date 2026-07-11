import { useEffect, useRef, useState } from "react";
import { Play, Pause, Mic } from "lucide-react";
import { useCountryTheme } from "@/lib/theme/useCountryTheme";

function fmt(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

interface Props {
  src: string;
  knownDuration?: number; // seconds
  className?: string;
}

function normaliseKnownDuration(value?: number): number {
  if (!value || !isFinite(value) || value <= 0) return 0;
  // Older saved voice notes may have stored milliseconds instead of seconds.
  const seconds = value > 1000 ? value / 1000 : value;
  return seconds > 0 && seconds < 90 ? seconds : 0;
}

/**
 * Compact voice player. Fixes the MediaRecorder "duration = Infinity" bug
 * by forcing the browser to seek so it computes real duration.
 */
export function VoicePlayer({ src, knownDuration, className = "mt-2" }: Props) {
  const { accent1 } = useCountryTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const initialDuration = normaliseKnownDuration(knownDuration);
  const [duration, setDuration] = useState<number>(initialDuration);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    let cancelled = false;
    const trustedKnownDuration = normaliseKnownDuration(knownDuration);
    if (trustedKnownDuration) setDuration(trustedKnownDuration);

    const decodePreciseDuration = async () => {
      if (trustedKnownDuration || typeof window === "undefined") return;
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const buffer = await fetch(src).then((r) => r.arrayBuffer());
        const ctx = new AudioCtx();
        const decoded = await ctx.decodeAudioData(buffer.slice(0));
        const exact = decoded.duration;
        await ctx.close().catch(() => {});
        if (!cancelled && exact > 0 && exact < 90) setDuration(exact);
      } catch {
        /* browser could not decode this container */
      }
    };
    decodePreciseDuration();

    const onLoaded = () => {
      if (trustedKnownDuration) {
        setDuration(trustedKnownDuration);
        return;
      }
      if (isFinite(a.duration) && a.duration > 0 && a.duration < 90) {
        setDuration(a.duration);
        return;
      }
      // Force browser to compute duration for MediaRecorder blobs
      const fix = () => {
        a.currentTime = 0;
        a.removeEventListener("timeupdate", fix);
        if (isFinite(a.duration) && a.duration > 0 && a.duration < 90) setDuration(a.duration);
      };
      a.addEventListener("timeupdate", fix);
      try {
        a.currentTime = 1e101;
      } catch {
        /* noop */
      }
    };
    const onTime = () => setCurrent(a.currentTime);
    const onEnd = () => {
      setPlaying(false);
      setCurrent(0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("durationchange", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      cancelled = true;
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("durationchange", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, [src, knownDuration]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause();
    else await a.play().catch(() => {});
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    a.currentTime = pct * duration;
    setCurrent(a.currentTime);
  };

  const pct = duration ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div className={`${className} flex items-center gap-2 rounded-2xl bg-canvas/80 border border-ink/10 p-2 shadow-inner`}>
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause voice note" : "Play voice note"}
        className="shrink-0 size-9 grid place-items-center rounded-full bg-ink text-canvas shadow-sm hover:opacity-90 active:scale-95 transition"
      >
        {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5 translate-x-[1px]" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="t-eyebrow inline-flex items-center gap-1 text-ink/55">
            <Mic className="size-3" aria-hidden="true" /> Voice
          </span>
          <span className="t-meta shrink-0 tabular-nums text-ink/65">
            {fmt(playing || current > 0 ? current : duration)}
          </span>
        </div>
        <div
          role="slider"
          aria-label="Seek voice note"
          aria-valuemin={0}
          aria-valuemax={Math.max(1, Math.round(duration))}
          aria-valuenow={Math.round(current)}
          onClick={seek}
          className="h-1.5 rounded-full bg-ink/10 relative cursor-pointer overflow-hidden"
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-100"
            style={{ width: `${pct}%`, background: accent1 }}
          />
        </div>
      </div>
    </div>
  );
}
