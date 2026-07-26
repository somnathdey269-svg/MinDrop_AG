import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const FALLBACK_SUPABASE_URL = "https://zsyenugkffmcpzdyrkcm.supabase.co";
const FALLBACK_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzeWVudWdrZmZtY3B6ZHlya2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3Njk5NjAsImV4cCI6MjA5OTM0NTk2MH0.SZ93XpuNXm0iFURoECap0fMvzMh1yU5eQtWrVWAMpjo";

function createSupabaseClient() {
  const SUPABASE_URL =
    import.meta.env.VITE_SUPABASE_URL ||
    (typeof process !== "undefined" && process.env?.SUPABASE_URL) ||
    FALLBACK_SUPABASE_URL;

  const SUPABASE_PUBLISHABLE_KEY =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    (typeof process !== "undefined" &&
      (process.env?.SUPABASE_PUBLISHABLE_KEY || process.env?.SUPABASE_ANON_KEY)) ||
    FALLBACK_SUPABASE_KEY;

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
