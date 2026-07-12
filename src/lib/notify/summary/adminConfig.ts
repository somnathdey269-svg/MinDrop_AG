import type { ModelInfo, ProviderId } from "./types";
import { getProvider } from "./providers";

const STORAGE_KEY = "mindrop.admin.enabled_models.v1";

export function readEnabledModels(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function writeEnabledModels(states: Record<string, boolean>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  } catch {}
}

export function isModelEnabled(modelId: string): boolean {
  const states = readEnabledModels();
  // Default to true if not explicitly set to false
  return states[modelId] !== false;
}

export function getEnabledModelsForProvider(providerId: ProviderId): ModelInfo[] {
  const provider = getProvider(providerId);
  if (!provider) return [];
  const enabled = provider.models.filter((m) => isModelEnabled(m.id));
  // Failsafe: if all models are disabled, return all provider models so selection is not empty
  if (enabled.length === 0) {
    return provider.models;
  }
  return enabled;
}
