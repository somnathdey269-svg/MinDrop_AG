import type { ModelInfo, ProviderId, SummaryJson } from "./types";
import { SUMMARY_JSON_SCHEMA, isValidSummaryJson } from "./prompt";

export interface TestResult { ok: boolean; error?: string }
export interface GenerateArgs {
  key: string;
  model: string;
  system: string;
  user: object;
  signal?: AbortSignal;
}

export interface Provider {
  id: ProviderId;
  label: string;
  models: ModelInfo[];
  testKey(key: string): Promise<TestResult>;
  generate(args: GenerateArgs): Promise<SummaryJson>;
}

class ProviderError extends Error {
  status?: number;
  constructor(msg: string, status?: number) { super(msg); this.status = status; }
}

async function jsonOrThrow(res: Response): Promise<unknown> {
  const text = await res.text();
  let body: unknown;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) {
    const msg = typeof body === "object" && body && "error" in body
      ? JSON.stringify((body as { error: unknown }).error)
      : (typeof body === "string" ? body : `HTTP ${res.status}`);
    throw new ProviderError(msg, res.status);
  }
  return body;
}

/* ─────────── OpenAI ─────────── */
export const openai: Provider = {
  id: "openai", label: "OpenAI",
  models: [
    { id: "gpt-5-mini", label: "GPT-5 mini (recommended)", inPerM: 0.25, outPerM: 2.0, recommended: true },
    { id: "gpt-5-nano", label: "GPT-5 nano", inPerM: 0.05, outPerM: 0.4 },
    { id: "gpt-5", label: "GPT-5", inPerM: 1.25, outPerM: 10 },
  ],
  async testKey(key) {
    try {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!res.ok) throw new ProviderError(await res.text(), res.status);
      return { ok: true };
    } catch (e) { return { ok: false, error: (e as Error).message }; }
  },
  async generate({ key, model, system, user, signal }) {
    const body = {
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: JSON.stringify(user) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "MindDropSummary", strict: true, schema: SUMMARY_JSON_SCHEMA },
      },
    };
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
      signal,
    });
    const j = (await jsonOrThrow(res)) as { choices: { message: { content: string } }[] };
    const content = j.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content);
    if (!isValidSummaryJson(parsed)) throw new ProviderError("Model returned schema-invalid JSON");
    return parsed;
  },
};

/* ─────────── Anthropic ─────────── */
export const anthropic: Provider = {
  id: "anthropic", label: "Anthropic (Claude)",
  models: [
    { id: "claude-haiku-4-5", label: "Claude Haiku 4.5 (recommended)", inPerM: 1, outPerM: 5, recommended: true },
    { id: "claude-sonnet-4-5", label: "Claude Sonnet 4.5", inPerM: 3, outPerM: 15 },
  ],
  async testKey(key) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 4,
          messages: [{ role: "user", content: "hi" }],
        }),
      });
      if (!res.ok) throw new ProviderError(await res.text(), res.status);
      return { ok: true };
    } catch (e) { return { ok: false, error: (e as Error).message }; }
  },
  async generate({ key, model, system, user, signal }) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        system,
        messages: [
          { role: "user", content: `${JSON.stringify(user)}\n\nReturn ONLY the JSON object described in the system prompt. No prose.` },
        ],
      }),
      signal,
    });
    const j = (await jsonOrThrow(res)) as { content: { type: string; text?: string }[] };
    const text = j.content?.find((c) => c.type === "text")?.text ?? "";
    // Strip potential ```json fences
    const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(clean);
    if (!isValidSummaryJson(parsed)) throw new ProviderError("Model returned schema-invalid JSON");
    return parsed;
  },
};

/* ─────────── Gemini ─────────── */
export const gemini: Provider = {
  id: "gemini", label: "Google Gemini",
  models: [
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash (recommended)", inPerM: 0.3, outPerM: 2.5, recommended: true },
    { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite", inPerM: 0.1, outPerM: 0.4 },
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", inPerM: 1.25, outPerM: 10 },
  ],
  async testKey(key) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`);
      if (!res.ok) throw new ProviderError(await res.text(), res.status);
      return { ok: true };
    } catch (e) { return { ok: false, error: (e as Error).message }; }
  },
  async generate({ key, model, system, user, signal }) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
    // Gemini doesn't support all JSON Schema features — send text prompt and request JSON mime.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: JSON.stringify(user) }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      }),
      signal,
    });
    const j = (await jsonOrThrow(res)) as {
      candidates: { content: { parts: { text: string }[] } }[];
    };
    const text = j.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(clean);
    if (!isValidSummaryJson(parsed)) throw new ProviderError("Model returned schema-invalid JSON");
    return parsed;
  },
};

export const PROVIDERS: Record<ProviderId, Provider> = { openai, anthropic, gemini };
export function getProvider(id: ProviderId): Provider { return PROVIDERS[id]; }
