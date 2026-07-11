import type { SummaryJson } from "./types";

export const SUMMARY_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string" },
    highlights: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        properties: { title: { type: "string" }, detail: { type: "string" } },
        required: ["title", "detail"],
      },
    },
    byApp: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        properties: { app: { type: "string" }, insight: { type: "string" } },
        required: ["app", "insight"],
      },
    },
    attentionSignals: {
      type: "object", additionalProperties: false,
      properties: {
        peakHour: { type: "string" },
        quietWindow: { type: "string" },
        distractionScore: { type: "number" },
      },
      required: ["peakHour", "quietWindow", "distractionScore"],
    },
    actionItems: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        properties: {
          text: { type: "string" },
          priority: { type: "string", enum: ["low", "med", "high"] },
        },
        required: ["text", "priority"],
      },
    },
    moodNote: { type: "string" },
    conclusion: {
      type: "object", additionalProperties: false,
      properties: {
        reminderRecap: {
          type: "object", additionalProperties: false,
          properties: {
            activeTotal: { type: "number" },
            triggeredToday: { type: "number" },
            missedToday: { type: "number" },
            createdToday: { type: "number" },
            upcoming7d: { type: "number" },
            onTimeRate: { type: "number" },
          },
          required: ["activeTotal", "triggeredToday", "missedToday", "createdToday", "upcoming7d", "onTimeRate"],
        },
        wins: { type: "array", items: { type: "string" } },
        misses: { type: "array", items: { type: "string" } },
        suggestedReminders: {
          type: "array",
          items: {
            type: "object", additionalProperties: false,
            properties: {
              title: { type: "string" },
              when: { type: "string" },
              why: { type: "string" },
              kind: { type: "string", enum: ["time", "location", "rule"] },
            },
            required: ["title", "when", "why", "kind"],
          },
        },
        closingLine: { type: "string" },
      },
      required: ["reminderRecap", "wins", "misses", "suggestedReminders", "closingLine"],
    },
  },
  required: ["headline", "highlights", "byApp", "actionItems", "moodNote", "conclusion"],
} as const;

export function systemPrompt(): string {
  return `You are MindDrop's daily digest analyst. You receive:
- notifications: compact JSON of one day of the user's phone notifications (already de-duped, PII-scrubbed on-device)
- reminders: compact JSON of the user's MindDrop reminders/rules for the same window (set, triggered, upcoming, missed)
- userProfile: evolving preferences

Rules:
- Never invent items not present in input.
- Never guess scrubbed content (marked [phone], [otp], [email], [card], [upi], [aadhaar], [ifsc]).
- Respect userProfile.brevity ("terse" = <=1 sentence per section; "balanced" = default; "detailed" = up to 3 sentences).
- Respect userProfile.tone. If "coach", gently nudge. If "neutral", just report.
- Never moralize about screen time. Warm, non-judgmental voice.
- The "conclusion" section MUST reference the reminders payload: reproduce the counts exactly (do not recompute), and write up to 3 concrete suggestedReminders derived from notification patterns (e.g. "You get Slack pings after 22:00 — a 21:45 wind-down reminder?"). "kind" must be one of time|location|rule. "when" is a plain-language schedule ("Daily 21:45" / "When you reach Home" / "When Slack pings after 21:00").
- Output STRICT JSON matching the schema. No prose outside JSON. No markdown.`;
}

export function isValidSummaryJson(x: unknown): x is SummaryJson {
  if (!x || typeof x !== "object") return false;
  const o = x as SummaryJson;
  return typeof o.headline === "string"
    && Array.isArray(o.highlights)
    && Array.isArray(o.byApp)
    && Array.isArray(o.actionItems)
    && typeof o.moodNote === "string"
    && !!o.conclusion
    && !!o.conclusion.reminderRecap
    && Array.isArray(o.conclusion.suggestedReminders);
}
