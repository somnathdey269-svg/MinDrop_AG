import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertSuperadmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "superadmin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
}

async function fetchAllAuthUsers() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const all: any[] = [];
  let page = 1;
  const perPage = 1000;
  for (let i = 0; i < 20; i++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) break;
    const users = data?.users ?? [];
    all.push(...users);
    if (users.length < perPage) break;
    page++;
  }
  return all;
}

/**
 * Superadmin-only real analytics for the dashboard.
 */
export const getAdminAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertSuperadmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const users = await fetchAllAuthUsers();
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const dayAgo = now - 24 * 60 * 60 * 1000;

    let last7 = 0;
    const hourBuckets = new Array(24).fill(0);
    const recent: { id: string; email: string | null; created_at: string }[] = [];
    for (const u of users) {
      const created = u.created_at ? new Date(u.created_at).getTime() : 0;
      if (created >= weekAgo) last7++;
      if (created >= dayAgo) {
        const hoursAgo = Math.floor((now - created) / (60 * 60 * 1000));
        const idx = 23 - Math.min(23, Math.max(0, hoursAgo));
        hourBuckets[idx]++;
      }
    }

    const sorted = [...users].sort((a, b) => {
      const at = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bt = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bt - at;
    });
    for (const u of sorted.slice(0, 8)) {
      recent.push({ id: u.id, email: u.email ?? null, created_at: u.created_at });
    }

    const { count: roleCount } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "superadmin");

    return {
      totalUsers: users.length,
      newLast7Days: last7,
      superadmins: roleCount ?? 0,
      signupsPerHour24h: hourBuckets,
      recentSignups: recent,
      generatedAt: new Date().toISOString(),
    };
  });

/**
 * Real list of platform users for the Users page.
 */
export const listPlatformUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertSuperadmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const users = await fetchAllAuthUsers();
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const roleMap = new Map<string, string[]>();
    for (const r of roles ?? []) {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    }

    return users
      .sort((a, b) => {
        const at = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bt = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bt - at;
      })
      .map((u) => ({
        id: u.id,
        email: u.email ?? null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        roles: roleMap.get(u.id) ?? [],
      }));
  });
