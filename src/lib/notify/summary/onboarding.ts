import type { ProviderId } from "./types";

export interface ProviderGuide {
  id: ProviderId;
  label: string;
  bestFor: string;
  freeTier: string | null;
  signupUrl: string;
  billingUrl: string;
  keyPrefix: string;
  steps: string[];
  recommendedModel: string;
  gotchas: string[];
}

export const GUIDES: Record<ProviderId, ProviderGuide> = {
  gemini: {
    id: "gemini", label: "Google Gemini",
    bestFor: "Cheapest — great default.",
    freeTier: "Free tier available for personal use.",
    signupUrl: "https://aistudio.google.com/apikey",
    billingUrl: "https://aistudio.google.com/apikey",
    keyPrefix: "AIza…",
    recommendedModel: "gemini-2.5-flash",
    steps: [
      "Open aistudio.google.com/apikey",
      "Sign in with your Google account",
      "Click 'Create API key' → pick a project (or 'Create new')",
      "Copy the key (starts with AIza…) — paste it back here",
    ],
    gotchas: [
      "Don't include quotes when pasting.",
      "If a project asks for billing, the free tier still applies to Flash models.",
    ],
  },
  openai: {
    id: "openai", label: "OpenAI",
    bestFor: "Most reliable JSON output.",
    freeTier: null,
    signupUrl: "https://platform.openai.com/api-keys",
    billingUrl: "https://platform.openai.com/settings/organization/billing/overview",
    keyPrefix: "sk-…",
    recommendedModel: "gpt-5-mini",
    steps: [
      "Open platform.openai.com/api-keys",
      "Add a payment method under Billing (required — no free tier)",
      "Click '+ Create new secret key' → give it a name → Create",
      "Copy the key (starts with sk-…) immediately — it won't show again",
    ],
    gotchas: [
      "No free tier — add at least $5 credit to test.",
      "Never share this key — it can spend your account balance.",
    ],
  },
  anthropic: {
    id: "anthropic", label: "Anthropic (Claude)",
    bestFor: "Highest writing quality.",
    freeTier: null,
    signupUrl: "https://console.anthropic.com/settings/keys",
    billingUrl: "https://console.anthropic.com/settings/billing",
    keyPrefix: "sk-ant-…",
    recommendedModel: "claude-haiku-4-5",
    steps: [
      "Open console.anthropic.com/settings/keys",
      "Under Billing → add credits (min $5)",
      "Click 'Create Key' → name it → Create",
      "Copy the key (starts with sk-ant-…) and paste here",
    ],
    gotchas: [
      "Browser calls need a special header — we set it automatically.",
      "If a corporate network blocks anthropic.com, the call will fail.",
    ],
  },
};

export const FAQ = [
  {
    q: "Why do I need my own key?",
    a: "So your notifications stay private. We never see your key, never store it, never proxy your data.",
  },
  {
    q: "How much will it cost me?",
    a: "About ₹0.15–₹0.40 per daily report on cheap models. Gemini's free tier covers most personal use.",
  },
  {
    q: "Is my data safe?",
    a: "Notifications, keys, reports and profile all stay on this device. The only outbound call is direct browser → your chosen provider.",
  },
  {
    q: "Can I switch providers?",
    a: "Yes — your keys are stored per-provider, so switching keeps prior keys ready.",
  },
];
