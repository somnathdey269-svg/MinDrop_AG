import type { ModelInfo } from "./types";

const USD_TO_INR = 84;

// Cheap fallback estimator — 1 token ≈ 4 chars is close enough for English/tech text.
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function estimateCostINR(model: ModelInfo, inTok: number, outTok: number): number {
  const usd = (inTok / 1_000_000) * model.inPerM + (outTok / 1_000_000) * model.outPerM;
  return usd * USD_TO_INR;
}

export function formatINR(v: number): string {
  if (v < 0.01) return "<₹0.01";
  if (v < 1) return `₹${v.toFixed(2)}`;
  return `₹${v.toFixed(2)}`;
}
