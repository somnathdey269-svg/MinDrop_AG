// Server-only helper: mint a Google OAuth2 access token from the FCM service
// account JSON and send a push message via the FCM HTTP v1 API.
import { SignJWT, importPKCS8 } from "jose";

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
  project_id: string;
};

let cachedToken: { value: string; exp: number } | null = null;

function loadServiceAccount(): ServiceAccount {
  const raw = process.env.FCM_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FCM_SERVICE_ACCOUNT_JSON is not set");
  const parsed = JSON.parse(raw) as ServiceAccount;
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("FCM_SERVICE_ACCOUNT_JSON is missing client_email or private_key");
  }
  return parsed;
}

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.value;

  const sa = loadServiceAccount();
  const tokenUri = sa.token_uri || "https://oauth2.googleapis.com/token";

  const privateKey = await importPKCS8(sa.private_key.replace(/\\n/g, "\n"), "RS256");
  const assertion = await new SignJWT({
    scope: "https://www.googleapis.com/auth/firebase.messaging",
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(sa.client_email)
    .setSubject(sa.client_email)
    .setAudience(tokenUri)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);

  const res = await fetch(tokenUri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) throw new Error(`OAuth token request failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: json.access_token, exp: now + json.expires_in };
  return json.access_token;
}

export type FcmMessage = {
  token: string;
  title: string;
  body: string;
  url?: string;
  data?: Record<string, string>;
};

export type FcmSendResult = { token: string; ok: boolean; error?: string };

export async function sendFcm(message: FcmMessage): Promise<FcmSendResult> {
  const projectId = process.env.FCM_PROJECT_ID || loadServiceAccount().project_id;
  const accessToken = await getAccessToken();

  const payload = {
    message: {
      token: message.token,
      notification: { title: message.title, body: message.body },
      webpush: {
        fcm_options: { link: message.url || "/" },
        notification: { icon: "/favicon.ico" },
      },
      data: { ...(message.data || {}), url: message.url || "/" },
    },
  };

  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    return { token: message.token, ok: false, error: `${res.status}: ${text}` };
  }
  return { token: message.token, ok: true };
}
