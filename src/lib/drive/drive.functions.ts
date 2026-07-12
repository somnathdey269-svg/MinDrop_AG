import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  createDriveAuthUrl,
  getAccessToken,
  findOrCreateMinDropFolder,
  uploadBackup,
  listBackups,
  downloadBackup,
} from "./drive.server";

async function assertPremium(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (data?.plan !== "premium") {
    throw new Error("Google Drive backup is a Premium feature. Upgrade to enable it.");
  }
}

export const getDriveAuthUrl = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPremium(context.supabase, context.userId);
    const request = getRequest();
    const origin = request ? new URL(request.url).origin : "";
    if (!origin) throw new Error("Could not determine request origin");
    const url = await createDriveAuthUrl(context.supabase, context.userId, origin);
    return { url };
  });

export const disconnectDrive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase.from("user_drive_tokens").delete().eq("user_id", context.userId);
    await context.supabase.from("drive_oauth_states").delete().eq("user_id", context.userId);
    return { ok: true };
  });

export const getDriveStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_drive_tokens")
      .select("connected_at, updated_at")
      .eq("user_id", context.userId)
      .maybeSingle();
    return { connected: !!data, connectedAt: data?.connected_at ?? null, updatedAt: data?.updated_at ?? null };
  });

const backupInputSchema = z.object({
  payload: z.string().max(10_000_000),
  format: z.enum(["json", "csv"]).default("json"),
});

export const backupToDrive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => backupInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertPremium(supabase, userId);

    const { data: tokenRow } = await supabase
      .from("user_drive_tokens")
      .select("refresh_token, folder_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!tokenRow?.refresh_token) throw new Error("Google Drive is not connected");

    const accessToken = await getAccessToken(tokenRow.refresh_token);
    const folderId = tokenRow.folder_id ?? (await findOrCreateMinDropFolder(accessToken));

    if (!tokenRow.folder_id) {
      await supabase.from("user_drive_tokens").update({ folder_id: folderId, updated_at: new Date().toISOString() }).eq("user_id", userId);
    }

    const ext = data.format === "csv" ? "csv" : "json";
    const mimeType = data.format === "csv" ? "text/csv" : "application/json";
    const filename = `mindrop-backup-${new Date().toISOString().slice(0, 10)}.${ext}`;
    const { id } = await uploadBackup(accessToken, folderId, filename, data.payload, mimeType);

    await supabase.from("user_drive_tokens").update({ updated_at: new Date().toISOString() }).eq("user_id", userId);

    return { ok: true, fileId: id, filename };
  });

export const restoreFromDrive = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertPremium(supabase, userId);

    const { data: tokenRow } = await supabase
      .from("user_drive_tokens")
      .select("refresh_token, folder_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!tokenRow?.refresh_token) throw new Error("Google Drive is not connected");

    const accessToken = await getAccessToken(tokenRow.refresh_token);
    const folderId = tokenRow.folder_id ?? (await findOrCreateMinDropFolder(accessToken));

    if (!tokenRow.folder_id) {
      await supabase.from("user_drive_tokens").update({ folder_id: folderId }).eq("user_id", userId);
    }

    const files = await listBackups(accessToken, folderId);
    if (files.length === 0) throw new Error("No backups found in your MinDrop folder");

    const latest = files[0];
    const content = await downloadBackup(accessToken, latest.id);

    return {
      ok: true,
      fileId: latest.id,
      filename: latest.name,
      createdTime: latest.createdTime,
      content,
    };
  });
