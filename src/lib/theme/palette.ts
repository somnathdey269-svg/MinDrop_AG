/**
 * Country-flag palette helpers.
 *
 * The dashboard uses exactly THREE accents (accent1/accent2/accent3), one per
 * "room" (Do it Later, Notify, Location). Country flags may have 1, 2, or
 * many colors — this module pads a raw color list to exactly three per the
 * rules the user specified.
 */

export const INDIA_SAFFRON = "#FF671F";
export const INDIA_GREEN = "#046A38";
export const INDIA_BLUE = "#06038D";

export const INDIA_PALETTE: [string, string, string] = [
  INDIA_SAFFRON,
  INDIA_GREEN,
  INDIA_BLUE,
];

export type CountryTheme = {
  code: string;
  name: string;
  colors: string[]; // raw flag colors, length 1..3
  updatedAt?: string;
};

export type ResolvedPalette = {
  accent1: string;
  accent2: string;
  accent3: string;
};

const HEX = /^#([0-9a-fA-F]{6})$/;

export function isHex(v: unknown): v is string {
  return typeof v === "string" && HEX.test(v);
}

export function normalizeColors(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input) {
    if (!isHex(raw)) continue;
    const up = raw.toUpperCase();
    if (seen.has(up)) continue;
    seen.add(up);
    out.push(up);
    if (out.length === 3) break;
  }
  return out;
}

/**
 * Pad a country's raw flag colors to exactly 3 accents.
 *
 * Rules (as specified by the user):
 *  - 3+ colors → take first 3.
 *  - Exactly 2 colors → append India blue.
 *  - Exactly 1 color → append India saffron, then India blue.
 *  - Zero colors (invalid) → full India fallback.
 */
export function padPalette(rawColors: string[]): ResolvedPalette {
  const cleaned = normalizeColors(rawColors);
  if (cleaned.length >= 3) {
    return { accent1: cleaned[0], accent2: cleaned[1], accent3: cleaned[2] };
  }
  if (cleaned.length === 2) {
    return { accent1: cleaned[0], accent2: cleaned[1], accent3: INDIA_BLUE };
  }
  if (cleaned.length === 1) {
    return { accent1: cleaned[0], accent2: INDIA_SAFFRON, accent3: INDIA_BLUE };
  }
  return { accent1: INDIA_SAFFRON, accent2: INDIA_GREEN, accent3: INDIA_BLUE };
}

export const INDIA_RESOLVED: ResolvedPalette = padPalette(INDIA_PALETTE);

/** ISO alpha-2 → flag emoji. */
export function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return "🏳️";
  const A = 0x1f1e6;
  const first = code.toUpperCase().charCodeAt(0) - 65 + A;
  const second = code.toUpperCase().charCodeAt(1) - 65 + A;
  try {
    return String.fromCodePoint(first, second);
  } catch {
    return "🏳️";
  }
}

// localStorage key for the resolved country code (client-cached)
export const COUNTRY_STORAGE_KEY = "mindrop.theme.country.v1";
// localStorage key for a user manual override (wins over auto-detected)
export const COUNTRY_OVERRIDE_KEY = "mindrop.theme.country.override.v1";
