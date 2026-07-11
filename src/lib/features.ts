import {
  BookOpen,
  HelpCircle,
  Package,
  Sparkles,
  ScrollText,
  Brain,
  FlaskConical,
  Tag,
  Globe,
  Palette,
  type LucideIcon,
} from "lucide-react";

export type FeatureSlug =
  | "story"
  | "quiz"
  | "packs"
  | "recall"
  | "rules"
  | "personality"
  | "experiments"
  | "categories"
  | "greetings"
  | "country-themes";

export type FeatureEnv = "dev" | "staging" | "prod";
export const ENVS: FeatureEnv[] = ["dev", "staging", "prod"];

export type FeatureDef = {
  slug: FeatureSlug;
  label: string;
  icon: LucideIcon;
  /** Consumer route this flag gates (undefined = admin-only / cross-cutting). */
  consumerRoute?: string;
  /** Human-friendly blurb for the "coming soon" screen. */
  tagline: string;
  /** Default per-env state used to seed platform_settings. */
  defaults: Record<FeatureEnv, boolean>;
};

export const FEATURES: FeatureDef[] = [
  {
    slug: "story",
    label: "Story",
    icon: BookOpen,
    tagline: "The MinDrop story walk-through is being polished.",
    defaults: { dev: true, staging: true, prod: true },
  },
  {
    slug: "quiz",
    label: "Onboarding Quiz",
    icon: HelpCircle,
    consumerRoute: "/quiz",
    tagline: "The personality quiz that shapes your MinDrop is almost ready.",
    defaults: { dev: true, staging: true, prod: false },
  },
  {
    slug: "packs",
    label: "Memory Packs",
    icon: Package,
    consumerRoute: "/packs",
    tagline: "Curated packs land here soon — Parenting, Travel, Work and more.",
    defaults: { dev: true, staging: true, prod: true },
  },
  {
    slug: "recall",
    label: "Recall Drills",
    icon: Sparkles,
    consumerRoute: "/recall",
    tagline: "Daily recall drills are being tuned. Check back shortly.",
    defaults: { dev: true, staging: true, prod: true },
  },
  {
    slug: "rules",
    label: "Rules",
    icon: ScrollText,
    consumerRoute: "/rules",
    tagline: "The rules engine viewer is on its way.",
    defaults: { dev: true, staging: true, prod: false },
  },
  {
    slug: "personality",
    label: "Personality Engine",
    icon: Brain,
    tagline: "Personality-driven prompts arrive soon.",
    defaults: { dev: true, staging: true, prod: false },
  },
  {
    slug: "experiments",
    label: "Experiments",
    icon: FlaskConical,
    tagline: "A/B experiments will surface here.",
    defaults: { dev: true, staging: false, prod: false },
  },
  {
    slug: "categories",
    label: "Categories",
    icon: Tag,
    tagline: "Category taxonomy is being finalized.",
    defaults: { dev: true, staging: true, prod: true },
  },
  {
    slug: "greetings",
    label: "World Greetings",
    icon: Globe,
    tagline: "Localized greetings are on the way.",
    defaults: { dev: true, staging: true, prod: true },
  },
  {
    slug: "country-themes",
    label: "Country Themes",
    icon: Palette,
    tagline: "Country-tuned themes are being finalized.",
    defaults: { dev: true, staging: true, prod: true },
  },
];

export const FEATURE_BY_SLUG: Record<FeatureSlug, FeatureDef> = Object.fromEntries(
  FEATURES.map((f) => [f.slug, f]),
) as Record<FeatureSlug, FeatureDef>;

export const flagKey = (slug: FeatureSlug, env: FeatureEnv) => `feature.${slug}.${env}`;

/** Current consumer runtime environment. Override with ?env=staging for QA. */
export function currentEnv(): FeatureEnv {
  if (typeof window !== "undefined") {
    try {
      const q = new URLSearchParams(window.location.search).get("env");
      if (q === "dev" || q === "staging" || q === "prod") return q;
    } catch {}
  }
  return import.meta.env.PROD ? "prod" : "dev";
}
