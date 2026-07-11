export type ErrorKind =
  | "invalid_key"
  | "insufficient_credit"
  | "rate_limit"
  | "model_forbidden"
  | "cors_blocked"
  | "offline"
  | "timeout"
  | "bad_json"
  | "empty_input"
  | "storage_full"
  | "pdf_failed"
  | "unknown";

export interface FriendlyError {
  kind: ErrorKind;
  title: string;
  cause: string;
  fixSteps: string[];
  action?: { label: string; href?: string };
  raw?: string;
  retryAfterSec?: number;
}

export function classify(err: unknown, ctx: { provider?: string; model?: string } = {}): FriendlyError {
  const msg = (err as Error)?.message ?? String(err);
  const status = (err as { status?: number })?.status;

  if (!navigator.onLine) {
    return {
      kind: "offline", title: "You're offline",
      cause: "This device has no internet connection.",
      fixSteps: ["Reconnect Wi-Fi or mobile data.", "Nothing was sent — try again when back online."],
      raw: msg,
    };
  }
  if (status === 401 || /invalid[_\s]?api[_\s]?key|unauthor/i.test(msg)) {
    return {
      kind: "invalid_key", title: "Key not recognised",
      cause: `${ctx.provider ?? "The provider"} rejected your API key.`,
      fixSteps: [
        "Re-copy the key without spaces or quotes.",
        "Confirm it matches the selected provider.",
        "If new, wait ~30s for the provider to activate it.",
      ],
      action: { label: "Re-enter key" }, raw: msg,
    };
  }
  if (status === 402 || /insufficient|quota|credit|billing/i.test(msg)) {
    const links: Record<string, string> = {
      openai: "https://platform.openai.com/settings/organization/billing/overview",
      anthropic: "https://console.anthropic.com/settings/billing",
      gemini: "https://aistudio.google.com/apikey",
    };
    return {
      kind: "insufficient_credit", title: "Provider needs credits",
      cause: `Your ${ctx.provider ?? "provider"} account has no credit for this call.`,
      fixSteps: ["Open your provider billing page.", "Add credit or a payment method.", "Come back and tap Retry."],
      action: { label: "Open billing", href: links[ctx.provider ?? ""] }, raw: msg,
    };
  }
  if (status === 429 || /rate[_\s]?limit|too many requests/i.test(msg)) {
    const m = /retry after (\d+)/i.exec(msg);
    return {
      kind: "rate_limit", title: "Provider is rate-limiting",
      cause: "You've hit the provider's per-minute rate limit.",
      fixSteps: ["Wait a moment.", "Consider switching to a cheaper/faster model."],
      retryAfterSec: m ? Number(m[1]) : 30, raw: msg,
    };
  }
  if (status === 403 || /model.*(not|does not).*(exist|allowed|access)|permission/i.test(msg)) {
    return {
      kind: "model_forbidden", title: `This key can't use ${ctx.model ?? "that model"}`,
      cause: "The provider blocked access to that specific model.",
      fixSteps: ["Switch to a supported model.", "Or enable it in your provider dashboard."],
      action: { label: "Use suggested model" }, raw: msg,
    };
  }
  if (/cors|blocked by cors policy|browser access/i.test(msg)) {
    return {
      kind: "cors_blocked", title: "Browser blocked the request",
      cause: "Your network or an extension blocked the call.",
      fixSteps: ["Disable ad-blockers/VPN briefly.", "Try a different provider."],
      raw: msg,
    };
  }
  if (/timeout|aborted/i.test(msg)) {
    return {
      kind: "timeout", title: "Provider is slow",
      cause: "The provider took too long to reply.",
      fixSteps: ["Try again.", "Switch to a faster model."],
      raw: msg,
    };
  }
  if (/json|parse|unexpected token/i.test(msg)) {
    return {
      kind: "bad_json", title: "Model returned unusable output",
      cause: "The model's reply wasn't valid JSON.",
      fixSteps: ["Retry — usually a one-off.", "If it persists, switch model."],
      raw: msg,
    };
  }
  if (/quota|storage/i.test(msg) && /full|exceeded/i.test(msg)) {
    return {
      kind: "storage_full", title: "Device storage full",
      cause: "There's no room to store this report.",
      fixSteps: ["Prune old reports below.", "Free some device space."],
      raw: msg,
    };
  }
  return {
    kind: "unknown", title: "Something went wrong",
    cause: "Unexpected error from the provider.",
    fixSteps: ["Try again.", "Switch provider or model if it repeats."],
    raw: msg,
  };
}
