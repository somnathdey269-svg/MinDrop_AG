import type { ReactNode } from "react";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FEATURE_BY_SLUG, type FeatureSlug } from "@/lib/features";
import { FeatureComingSoon } from "./FeatureComingSoon";

/** Renders children when the given feature flag is on; otherwise the Coming Soon screen. */
export function FeatureGate({
  slug,
  children,
}: {
  slug: FeatureSlug;
  children: ReactNode;
}) {
  const enabled = useFeatureFlag(slug);
  if (!enabled) return <FeatureComingSoon feature={FEATURE_BY_SLUG[slug]} />;
  return <>{children}</>;
}
