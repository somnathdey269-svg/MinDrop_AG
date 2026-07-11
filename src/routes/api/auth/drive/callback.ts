import { createFileRoute, redirect } from "@tanstack/react-router";
import { exchangeCodeForTokens, buildRedirectUri } from "@/lib/drive/drive.server";

export const Route = createFileRoute("/api/auth/drive/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const error = url.searchParams.get("error");

        if (error) {
          throw redirect({
            to: "/settings",
            search: { drive: "error", message: error },
          });
        }

        if (!code || !state) {
          throw redirect({
            to: "/settings",
            search: { drive: "error", message: "Missing OAuth parameters" },
          });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: stateRow, error: stateErr } = await (supabaseAdmin as any)
          .from("drive_oauth_states")
          .select("user_id, expires_at")
          .eq("state", state)
          .maybeSingle();

        if (stateErr || !stateRow) {
          throw redirect({
            to: "/settings",
            search: { drive: "error", message: "Invalid or expired OAuth state" },
          });
        }

        if (new Date(stateRow.expires_at) < new Date()) {
          await (supabaseAdmin as any).from("drive_oauth_states").delete().eq("state", state);
          throw redirect({
            to: "/settings",
            search: { drive: "error", message: "OAuth state expired" },
          });
        }

        try {
          const tokens = await exchangeCodeForTokens(code, buildRedirectUri(url.origin));
          if (!tokens.refresh_token) {
            throw new Error("Google did not return a refresh token");
          }

          await (supabaseAdmin as any).from("user_drive_tokens").upsert(
            {
              user_id: stateRow.user_id,
              refresh_token: tokens.refresh_token,
              connected_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );

          await (supabaseAdmin as any).from("drive_oauth_states").delete().eq("state", state);

          throw redirect({
            to: "/settings",
            search: { drive: "connected" },
          });
        } catch (err) {
          console.error("[drive/callback] OAuth exchange failed:", err);
          throw redirect({
            to: "/settings",
            search: { drive: "error", message: err instanceof Error ? err.message : "Drive connection failed" },
          });
        }
      },
    },
  },
});
