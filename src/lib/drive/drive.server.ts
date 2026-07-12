import type { SupabaseClient } from "@supabase/supabase-js";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const DRIVE_API = "https://www.googleapis.com/drive/v3";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";

function getClientId(): string {
  const id = process.env.GOOGLE_DRIVE_CLIENT_ID;
  if (!id) throw new Error("GOOGLE_DRIVE_CLIENT_ID is not configured");
  return id;
}

function getClientSecret(): string {
  const secret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  if (!secret) throw new Error("GOOGLE_DRIVE_CLIENT_SECRET is not configured");
  return secret;
}

export function getDriveCallbackPath(): string {
  return "/api/auth/drive/callback";
}

export function buildRedirectUri(origin: string): string {
  return origin + getDriveCallbackPath();
}

export async function createDriveAuthUrl(
  supabase: SupabaseClient,
  userId: string,
  origin: string,
): Promise<string> {
  const state = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await supabase.from("drive_oauth_states").upsert(
    { user_id: userId, state, expires_at: expiresAt },
    { onConflict: "user_id" },
  );

  const params = new URLSearchParams({
    client_id: getClientId(),
    redirect_uri: buildRedirectUri(origin),
    response_type: "code",
    scope: DRIVE_SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string,
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    code,
    client_id: getClientId(),
    client_secret: getClientSecret(),
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${res.status} ${text}`);
  }

  try {
    return JSON.parse(text) as TokenResponse;
  } catch {
    throw new Error(`Unexpected Google token response: ${text}`);
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: getClientId(),
    client_secret: getClientSecret(),
    grant_type: "refresh_token",
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Google refresh token failed: ${res.status} ${text}`);
  }

  try {
    return JSON.parse(text) as TokenResponse;
  } catch {
    throw new Error(`Unexpected Google refresh response: ${text}`);
  }
}

export async function getAccessToken(refreshToken: string): Promise<string> {
  const { access_token } = await refreshAccessToken(refreshToken);
  return access_token;
}

export async function findOrCreateMinDropFolder(accessToken: string): Promise<string> {
  const q = encodeURIComponent(
    "mimeType='application/vnd.google-apps.folder' and name='MinDrop' and trashed=false",
  );
  const res = await fetch(`${DRIVE_API}/files?q=${q}&spaces=drive&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Drive folder search failed: ${res.status} ${text}`);

  const data = JSON.parse(text) as { files?: { id: string; name: string }[] };
  if (data.files && data.files.length > 0) return data.files[0].id;

  const createRes = await fetch(`${DRIVE_API}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "MinDrop",
      mimeType: "application/vnd.google-apps.folder",
    }),
  });

  const createText = await createRes.text();
  if (!createRes.ok) throw new Error(`Drive folder creation failed: ${createRes.status} ${createText}`);

  const created = JSON.parse(createText) as { id: string };
  return created.id;
}

export async function uploadBackup(
  accessToken: string,
  folderId: string,
  filename: string,
  content: string,
  mimeType: string = "application/json",
): Promise<{ id: string }> {
  const metadata = {
    name: filename,
    parents: [folderId],
    mimeType,
  };

  const boundary = "-----------mindrop_drive_upload";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const body =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    content +
    closeDelim;

  const res = await fetch(`${UPLOAD_API}?uploadType=multipart`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      [`Content-Type`]: `multipart/related; boundary="${boundary}"`,
    },
    body,
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Drive upload failed: ${res.status} ${text}`);

  const uploaded = JSON.parse(text) as { id: string };
  return { id: uploaded.id };
}

export interface DriveBackupFile {
  id: string;
  name: string;
  createdTime: string;
  size?: string;
}

export async function listBackups(
  accessToken: string,
  folderId: string,
): Promise<DriveBackupFile[]> {
  const q = encodeURIComponent(
    `'${folderId}' in parents and trashed=false and name contains 'mindrop-backup'`,
  );
  const res = await fetch(
    `${DRIVE_API}/files?q=${q}&orderBy=createdTime desc&fields=files(id,name,createdTime,size)`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  const text = await res.text();
  if (!res.ok) throw new Error(`Drive list failed: ${res.status} ${text}`);

  const data = JSON.parse(text) as { files?: DriveBackupFile[] };
  return data.files ?? [];
}

export async function downloadBackup(accessToken: string, fileId: string): Promise<string> {
  const res = await fetch(`${DRIVE_API}/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Drive download failed: ${res.status} ${text}`);
  return text;
}

export async function deleteBackup(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(`${DRIVE_API}/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Drive delete failed: ${res.status} ${text}`);
  }
}
