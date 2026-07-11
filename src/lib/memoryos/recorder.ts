/**
 * Runtime-aware voice recorder.
 *
 * - Inside a Capacitor native shell (APK / IPA) → uses capacitor-voice-recorder,
 *   which triggers the real OS microphone permission (Settings → App → Microphone).
 * - Inside a browser / Lovable preview → uses MediaRecorder + getUserMedia with
 *   hardening: proactive permission check, auto-retry NotReadableError, and
 *   aggressive stream release.
 *
 * Both paths return `{ audioUrl, mimeType, durationMs }` where `audioUrl` is
 * a data: URL that plugs straight into <audio src>.
 */

import { Capacitor } from "@capacitor/core";
import { VoiceRecorder } from "capacitor-voice-recorder";

export type RecordingResult = {
  audioUrl: string;
  mimeType: string;
  durationMs: number;
};

export type RecorderErrorCode =
  | "unsupported"
  | "insecure"
  | "denied"
  | "not_found"
  | "in_use"
  | "unknown";

export class RecorderError extends Error {
  code: RecorderErrorCode;
  constructor(code: RecorderErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

export const isNative = () =>
  typeof window !== "undefined" && Capacitor?.isNativePlatform?.() === true;

/* ─────────────────────────── Native (Android + iOS) ───────────────────────── */

async function ensureNativePermission(): Promise<void> {
  const has = await VoiceRecorder.hasAudioRecordingPermission();
  if (has.value) return;
  const req = await VoiceRecorder.requestAudioRecordingPermission();
  if (!req.value) {
    throw new RecorderError(
      "denied",
      "Microphone permission was denied. Open Settings → GetMinDrop → Microphone to enable it.",
    );
  }
}

export class NativeRecorder {
  private running = false;
  private paused = false;

  async start(): Promise<void> {
    await ensureNativePermission();
    const can = await VoiceRecorder.canDeviceVoiceRecord();
    if (!can.value) {
      throw new RecorderError("unsupported", "This device cannot record audio.");
    }
    try {
      await VoiceRecorder.startRecording();
      this.running = true;
      this.paused = false;
    } catch (e: any) {
      const msg = String(e?.message || e || "");
      if (/PERMISSION|denied/i.test(msg)) {
        throw new RecorderError("denied", "Microphone permission was denied.");
      }
      throw new RecorderError("unknown", msg || "Could not start recording.");
    }
  }

  async pause(): Promise<void> {
    if (!this.running || this.paused) return;
    try {
      await VoiceRecorder.pauseRecording();
      this.paused = true;
    } catch (e: any) {
      throw new RecorderError("unknown", e?.message || "Couldn't pause recording.");
    }
  }

  async resume(): Promise<void> {
    if (!this.running || !this.paused) return;
    try {
      await VoiceRecorder.resumeRecording();
      this.paused = false;
    } catch (e: any) {
      throw new RecorderError("unknown", e?.message || "Couldn't resume recording.");
    }
  }

  isPaused() { return this.paused; }

  async stop(): Promise<RecordingResult> {
    if (!this.running) throw new RecorderError("unknown", "Not recording.");
    const res = await VoiceRecorder.stopRecording();
    this.running = false;
    this.paused = false;
    const { recordDataBase64, mimeType, msDuration } = res.value;
    return {
      audioUrl: `data:${mimeType};base64,${recordDataBase64}`,
      mimeType,
      durationMs: msDuration,
    };
  }

  async cancel(): Promise<void> {
    if (!this.running) return;
    try {
      await VoiceRecorder.stopRecording();
    } catch {}
    this.running = false;
    this.paused = false;
  }
}

/* ─────────────────────────────── Web fallback ─────────────────────────────── */

async function queryWebMicState(): Promise<PermissionState | "unknown"> {
  try {
    if (!navigator.permissions?.query) return "unknown";
    const s = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    return s.state;
  } catch {
    return "unknown";
  }
}

async function acquireStream(): Promise<MediaStream> {
  const tryOnce = async (constraints: MediaStreamConstraints) =>
    navigator.mediaDevices.getUserMedia(constraints);

  // Try nicer constraints first, then bare fallback.
  const attempts: MediaStreamConstraints[] = [
    { audio: { echoCancellation: true, noiseSuppression: true } },
    { audio: true },
  ];

  let lastErr: any = null;
  for (const c of attempts) {
    // Auto-retry NotReadableError up to 3 times (600ms gap) — most transient
    // OS-level locks (Assistant hotword, just-closed call, Bluetooth switch)
    // release within a second.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await tryOnce(c);
      } catch (e: any) {
        lastErr = e;
        if (e?.name !== "NotReadableError") break; // don't retry other errors
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  }
  throw lastErr;
}

export class WebRecorder {
  private rec: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: BlobPart[] = [];
  private startedAt = 0;
  private pausedAccum = 0;
  private pausedAt = 0;

  async start(): Promise<void> {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      throw new RecorderError("unsupported", "Recording isn't supported in this browser.");
    }
    if (typeof window !== "undefined" && !window.isSecureContext) {
      throw new RecorderError("insecure", "Recording needs a secure (https) connection.");
    }
    const state = await queryWebMicState();
    if (state === "denied") {
      throw new RecorderError(
        "denied",
        "Microphone is blocked for this site. Tap the lock icon in the address bar → allow Microphone, then try again.",
      );
    }

    try {
      this.stream = await acquireStream();
    } catch (e: any) {
      const name = e?.name || "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        throw new RecorderError(
          "denied",
          "Microphone access was blocked. Allow it in the browser prompt or site settings, then retry.",
        );
      }
      if (name === "NotFoundError" || name === "OverconstrainedError") {
        throw new RecorderError("not_found", "No microphone was found on this device.");
      }
      if (name === "NotReadableError") {
        throw new RecorderError(
          "in_use",
          "Another app is using the microphone. Close it (or unpair Bluetooth headset) and try again.",
        );
      }
      throw new RecorderError("unknown", e?.message || "Couldn't start recording.");
    }

    this.chunks = [];
    const rec = new MediaRecorder(this.stream);
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    rec.start();
    this.rec = rec;
    this.startedAt = Date.now();
    this.pausedAccum = 0;
    this.pausedAt = 0;
  }

  async stop(): Promise<RecordingResult> {
    const rec = this.rec;
    if (!rec) throw new RecorderError("unknown", "Not recording.");
    if (rec.state === "paused") this.pausedAccum += Date.now() - this.pausedAt;
    const durationMs = Date.now() - this.startedAt - this.pausedAccum;
    const blob: Blob = await new Promise((resolve) => {
      rec.onstop = () => {
        resolve(new Blob(this.chunks, { type: rec.mimeType || "audio/webm" }));
      };
      rec.stop();
    });
    this.release();
    const audioUrl = await new Promise<string>((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ""));
      r.readAsDataURL(blob);
    });
    return { audioUrl, mimeType: blob.type, durationMs };
  }

  cancel() {
    if (this.rec && this.rec.state !== "inactive") {
      try {
        this.rec.stop();
      } catch {}
    }
    this.release();
  }

  pause() {
    if (this.rec && this.rec.state === "recording") {
      try { this.rec.pause(); this.pausedAt = Date.now(); } catch {}
    }
  }

  resume() {
    if (this.rec && this.rec.state === "paused") {
      try {
        this.rec.resume();
        this.pausedAccum += Date.now() - this.pausedAt;
        this.pausedAt = 0;
      } catch {}
    }
  }

  isPaused() {
    return this.rec?.state === "paused";
  }

  private release() {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {}
      });
      this.stream = null;
    }
    this.rec = null;
  }
}

/* ─────────────────────────── Factory ─────────────────────────── */

export type Recorder = {
  start(): Promise<void>;
  stop(): Promise<RecordingResult>;
  cancel(): void | Promise<void>;
  pause(): void | Promise<void>;
  resume(): void | Promise<void>;
  isPaused(): boolean;
};

export function createRecorder(): Recorder {
  return isNative() ? new NativeRecorder() : new WebRecorder();
}
