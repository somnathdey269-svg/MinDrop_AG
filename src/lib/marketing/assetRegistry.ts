/**
 * Fixed registry mapping asset keys stored in the CMS to bundled image URLs.
 * The admin picks from these keys via the image picker; the consumer scene
 * resolves the key at render time.
 *
 * Add new entries here whenever you drop a new file into src/assets/marketing.
 */

// Chapter hero backgrounds
import ch1HeroChaos from "@/assets/marketing/chaos.png";
import ch2HeroShelf from "@/assets/marketing/shelf.png";
import ch3HeroClockbirds from "@/assets/marketing/clockbirds.png";
import ch4HeroPlacewalk from "@/assets/marketing/placewalk.png";
import ch5HeroRecall from "@/assets/marketing/recall.png";
import ch6HeroCompare from "@/assets/marketing/compare-hero.png";
import ch7HeroPacks from "@/assets/marketing/packs.png";
import ch8HeroKeeper from "@/assets/marketing/keeper.png";
import keeper from "@/assets/marketing/keeper.png";
import drop from "@/assets/marketing/drop.png";

// Beat images
import ch1A from "@/assets/marketing/beats/ch1-a-overwhelm.png";
import ch1B from "@/assets/marketing/beats/ch1-b-meet.png";
import ch1C from "@/assets/marketing/beats/ch1-c-offer.png";
import ch2A from "@/assets/marketing/beats/ch2-a-hold.png";
import ch2B from "@/assets/marketing/beats/ch2-b-place.png";
import ch2C from "@/assets/marketing/beats/ch2-c-shelf.png";
import ch3A from "@/assets/marketing/beats/ch3-a-cluttered.png";
import ch3B from "@/assets/marketing/beats/ch3-b-rule.png";
import ch3C from "@/assets/marketing/beats/ch3-c-nudge.png";
import ch4A from "@/assets/marketing/beats/ch4-a-walking.png";
import ch4B from "@/assets/marketing/beats/ch4-b-glow.png";
import ch4C from "@/assets/marketing/beats/ch4-c-enter.png";
import ch5A from "@/assets/marketing/beats/ch5-a-forgotten.png";
import ch5B from "@/assets/marketing/beats/ch5-b-float.png";
import ch5C from "@/assets/marketing/beats/ch5-c-catch.png";
import ch6A from "@/assets/marketing/beats/ch6-a-wall.png";
import ch6B from "@/assets/marketing/beats/ch6-b-same.png";
import ch6C from "@/assets/marketing/beats/ch6-c-different.png";
import ch7A from "@/assets/marketing/beats/ch7-a-free.png";
import ch7B from "@/assets/marketing/beats/ch7-b-premium.png";
import ch7C from "@/assets/marketing/beats/ch7-c-promise.png";
import ch8A from "@/assets/marketing/beats/ch8-a-rest.png";
import ch8B from "@/assets/marketing/beats/ch8-b-take.png";

// Backdrops
import backdropScatter from "@/assets/marketing/backdrop-scatter.jpg";
import backdropQuiet from "@/assets/marketing/backdrop-quiet.jpg";
import backdropRooms from "@/assets/marketing/backdrop-rooms.jpg";

export interface AssetOption {
  key: string;
  label: string;
  url: string;
  kind: "hero" | "backdrop" | "beat" | "prop";
}

export const ASSETS: AssetOption[] = [
  // Chapter heroes
  { key: "ch1-hero-chaos", label: "Ch1 hero — Chaos", url: ch1HeroChaos, kind: "hero" },
  { key: "ch2-hero-shelf", label: "Ch2 hero — Shelf", url: ch2HeroShelf, kind: "hero" },
  { key: "ch3-hero-clockbirds", label: "Ch3 hero — Clockbirds", url: ch3HeroClockbirds, kind: "hero" },
  { key: "ch4-hero-placewalk", label: "Ch4 hero — Placewalk", url: ch4HeroPlacewalk, kind: "hero" },
  { key: "ch5-hero-recall", label: "Ch5 hero — Recall", url: ch5HeroRecall, kind: "hero" },
  { key: "ch6-hero-compare", label: "Ch6 hero — Compare", url: ch6HeroCompare, kind: "hero" },
  { key: "ch7-hero-packs", label: "Ch7 hero — Packs", url: ch7HeroPacks, kind: "hero" },
  { key: "ch8-hero-keeper", label: "Ch8 hero — Keeper", url: ch8HeroKeeper, kind: "hero" },
  { key: "keeper", label: "Keeper", url: keeper, kind: "prop" },
  { key: "drop", label: "Drop", url: drop, kind: "prop" },

  // Beat images
  { key: "ch1-a-overwhelm", label: "Ch1 A · Overwhelm", url: ch1A, kind: "beat" },
  { key: "ch1-b-meet", label: "Ch1 B · Meet the Keeper", url: ch1B, kind: "beat" },
  { key: "ch1-c-offer", label: "Ch1 C · Offer the drop", url: ch1C, kind: "beat" },
  { key: "ch2-a-hold", label: "Ch2 A · Hold", url: ch2A, kind: "beat" },
  { key: "ch2-b-place", label: "Ch2 B · Place", url: ch2B, kind: "beat" },
  { key: "ch2-c-shelf", label: "Ch2 C · Shelf", url: ch2C, kind: "beat" },
  { key: "ch3-a-cluttered", label: "Ch3 A · Cluttered", url: ch3A, kind: "beat" },
  { key: "ch3-b-rule", label: "Ch3 B · Rule", url: ch3B, kind: "beat" },
  { key: "ch3-c-nudge", label: "Ch3 C · Nudge", url: ch3C, kind: "beat" },
  { key: "ch4-a-walking", label: "Ch4 A · Walking", url: ch4A, kind: "beat" },
  { key: "ch4-b-glow", label: "Ch4 B · Glow", url: ch4B, kind: "beat" },
  { key: "ch4-c-enter", label: "Ch4 C · Enter", url: ch4C, kind: "beat" },
  { key: "ch5-a-forgotten", label: "Ch5 A · Palette", url: ch5A, kind: "beat" },
  { key: "ch5-b-float", label: "Ch5 B · Type", url: ch5B, kind: "beat" },
  { key: "ch5-c-catch", label: "Ch5 C · Dials", url: ch5C, kind: "beat" },
  { key: "ch6-a-wall", label: "Ch6 A · Wall", url: ch6A, kind: "beat" },
  { key: "ch6-b-same", label: "Ch6 B · Same", url: ch6B, kind: "beat" },
  { key: "ch6-c-different", label: "Ch6 C · Different", url: ch6C, kind: "beat" },
  { key: "ch7-a-free", label: "Ch7 A · Free", url: ch7A, kind: "beat" },
  { key: "ch7-b-premium", label: "Ch7 B · Premium", url: ch7B, kind: "beat" },
  { key: "ch7-c-promise", label: "Ch7 C · Promise", url: ch7C, kind: "beat" },
  { key: "ch8-a-rest", label: "Ch8 A · Rest", url: ch8A, kind: "beat" },
  { key: "ch8-b-take", label: "Ch8 B · Take", url: ch8B, kind: "beat" },

  // Backdrops
  { key: "backdrop-scatter", label: "Backdrop — Scatter", url: backdropScatter, kind: "backdrop" },
  { key: "backdrop-quiet", label: "Backdrop — Quiet", url: backdropQuiet, kind: "backdrop" },
  { key: "backdrop-rooms", label: "Backdrop — Rooms", url: backdropRooms, kind: "backdrop" },
];

const BY_KEY = new Map(ASSETS.map((a) => [a.key, a] as const));

/** Resolve an asset key to its URL. Returns null if the key is unknown or empty. */
export function assetUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  return BY_KEY.get(key)?.url ?? null;
}

export function assetsByKind(kind: AssetOption["kind"]): AssetOption[] {
  return ASSETS.filter((a) => a.kind === kind);
}
