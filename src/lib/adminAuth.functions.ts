import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const FALLBACK_SUPABASE_URL = "https://zsyenugkffmcpzdyrkcm.supabase.co";
const FALLBACK_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzeWVudWdrZmZtY3B6ZHlya2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3Njk5NjAsImV4cCI6MjA5OTM0NTk2MH0.SZ93XpuNXm0iFURoECap0fMvzMh1yU5eQtWrVWAMpjo";

export const adminSignInFn = createServerFn({ method: "POST" })
  .validator((raw: unknown) =>
    z.object({ email: z.string().email(), password: z.string().min(1) }).parse(raw)
  )
  .handler(
    async ({
      data,
    }): Promise<{ success: boolean; session?: any; user?: any; error?: string }> => {
      try {
        const supabaseUrl =
          process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
        const supabaseKey =
          process.env.SUPABASE_PUBLISHABLE_KEY ||
          process.env.SUPABASE_ANON_KEY ||
          process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
          FALLBACK_SUPABASE_KEY;

        const client = createClient<Database>(supabaseUrl, supabaseKey, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });

        const { data: authData, error: authErr } = await client.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (authErr || !authData.session) {
          return {
            success: false,
            error: authErr?.message || "Invalid email or password",
          };
        }

        // Verify superadmin role in database
        const { data: roleRow, error: roleErr } = await (client as any)
          .from("user_roles")
          .select("role")
          .eq("user_id", authData.user.id)
          .eq("role", "superadmin")
          .maybeSingle();

        if (roleErr || !roleRow) {
          return {
            success: false,
            error: "Access denied: Account does not have Super Admin permissions",
          };
        }

        return {
          success: true,
          session: authData.session,
          user: authData.user,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || "Server authentication error",
        };
      }
    }
  );
