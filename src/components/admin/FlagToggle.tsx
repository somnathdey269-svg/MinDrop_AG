import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { listFeatureFlags, setFeatureFlag } from "@/lib/admin/flags.functions";
import { FEATURES, ENVS, type FeatureEnv, type FeatureSlug } from "@/lib/features";
import { useAdmin } from "@/lib/memoryos/store";
import { featureFlagsQueryKey } from "@/hooks/useFeatureFlag";

type Row = { slug: FeatureSlug; env: FeatureEnv; enabled: boolean };

export const adminFlagsQueryKey = ["admin", "feature-flags"] as const;

function useFlagMatrix() {
  return useQuery({
    queryKey: adminFlagsQueryKey,
    queryFn: () => listFeatureFlags(),
    staleTime: 30_000,
  });
}

function useFlagMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: Row) => setFeatureFlag({ data: v }),
    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: adminFlagsQueryKey });
      const prev = qc.getQueryData<Row[]>(adminFlagsQueryKey);
      qc.setQueryData<Row[]>(adminFlagsQueryKey, (old) =>
        (old ?? []).map((r) =>
          r.slug === v.slug && r.env === v.env ? { ...r, enabled: v.enabled } : r,
        ),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(adminFlagsQueryKey, ctx.prev);
    },
    onSuccess: (_r, v) => {
      qc.invalidateQueries({ queryKey: featureFlagsQueryKey(v.env) });
    },
  });
}

function Switch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors ${
        checked ? "bg-brand" : "bg-ink/15"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 size-4 bg-canvas rounded-full shadow transition-all ${
          checked ? "right-0.5" : "left-0.5"
        }`}
      />
    </button>
  );
}

/** Inline toggle for a single feature — shows the switch for the active workspace env. */
export function FlagToggle({ slug }: { slug: FeatureSlug }) {
  const { state } = useAdmin();
  const env = state.workspace as FeatureEnv;
  const { data, isLoading } = useFlagMatrix();
  const mutation = useFlagMutation();
  const [saved, setSaved] = useState(false);

  const row = data?.find((r) => r.slug === slug && r.env === env);
  const enabled = !!row?.enabled;

  const onChange = (v: boolean) => {
    mutation.mutate(
      { slug, env, enabled: v },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-white border border-ink/10 rounded-2xl p-4 mb-6">
      <div className="min-w-0">
        <p className="t-eyebrow text-ink/50">Feature flag · {env}</p>
        <p className="text-sm mt-1">
          {enabled ? "Live for users in this environment" : "Hidden — users see Coming Soon"}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {mutation.isPending && <Loader2 className="size-3.5 text-ink/40 animate-spin" />}
        {saved && !mutation.isPending && (
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-brand">
            <Check className="size-3" /> saved
          </span>
        )}
        <Switch
          checked={enabled}
          onChange={onChange}
          disabled={isLoading || mutation.isPending}
          label={`Toggle ${slug} for ${env}`}
        />
      </div>
    </div>
  );
}

/** Full matrix — every feature across every env. */
export function FlagMatrix() {
  const { data, isLoading } = useFlagMatrix();
  const mutation = useFlagMutation();

  const get = (slug: FeatureSlug, env: FeatureEnv) =>
    !!data?.find((r) => r.slug === slug && r.env === env)?.enabled;

  return (
    <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-canvas text-[10px] uppercase tracking-widest text-ink/50">
            <tr>
              <th className="text-left p-4">Feature</th>
              {ENVS.map((e) => (
                <th key={e} className="text-center p-4 w-24">
                  {e}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <tr key={f.slug} className="border-t border-ink/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Icon className="size-4 text-ink/60 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium">{f.label}</p>
                        <p className="text-xs text-ink/50 truncate">
                          {f.consumerRoute ?? "Admin-only / cross-cutting"}
                        </p>
                      </div>
                    </div>
                  </td>
                  {ENVS.map((e) => (
                    <td key={e} className="p-4 text-center">
                      <div className="inline-flex">
                        <Switch
                          checked={get(f.slug, e)}
                          onChange={(v) =>
                            mutation.mutate({ slug: f.slug, env: e, enabled: v })
                          }
                          disabled={isLoading || mutation.isPending}
                          label={`Toggle ${f.slug} for ${e}`}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
