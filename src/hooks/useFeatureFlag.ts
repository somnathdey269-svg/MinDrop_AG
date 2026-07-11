import { useQuery } from "@tanstack/react-query";
import { getPublicFeatureFlags } from "@/lib/admin/flags.functions";
import { FEATURES, currentEnv, type FeatureSlug } from "@/lib/features";

export const featureFlagsQueryKey = (env: string) => ["feature-flags", env] as const;

function fallbackMap(env: ReturnType<typeof currentEnv>): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const f of FEATURES) out[f.slug] = f.defaults[env];
  return out;
}

export function useFeatureFlags() {
  const env = currentEnv();
  const query = useQuery({
    queryKey: featureFlagsQueryKey(env),
    queryFn: () => getPublicFeatureFlags({ data: { env } }),
    staleTime: 60_000,
    placeholderData: fallbackMap(env),
  });
  return {
    env,
    flags: query.data ?? fallbackMap(env),
    isLoading: query.isLoading,
  };
}

export function useFeatureFlag(slug: FeatureSlug): boolean {
  const { flags } = useFeatureFlags();
  return !!flags[slug];
}
