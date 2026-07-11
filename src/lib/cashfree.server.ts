// Server-only Cashfree helpers. Never import from client code.
// Cashfree PG v3 (2023-08-01) API: https://docs.cashfree.com/reference/pg-new-apis-endpoint
import { createHmac, timingSafeEqual } from "crypto";

const API_VERSION = "2023-08-01";

function base() {
  const env = (process.env.CASHFREE_ENV || "TEST").toUpperCase();
  return env === "PROD" || env === "PRODUCTION"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

function requireCreds() {
  const appId = process.env.CASHFREE_APP_ID;
  const secret = process.env.CASHFREE_SECRET_KEY;
  if (!appId || !secret) {
    throw new Error("Cashfree credentials not configured");
  }
  return { appId, secret };
}

export async function cashfreeFetch<T = unknown>(
  path: string,
  init: { method: "GET" | "POST"; body?: unknown } = { method: "GET" },
): Promise<T> {
  const { appId, secret } = requireCreds();
  const res = await fetch(`${base()}${path}`, {
    method: init.method,
    headers: {
      "x-client-id": appId,
      "x-client-secret": secret,
      "x-api-version": API_VERSION,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const text = await res.text();
  const parsed: unknown = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const err =
      (parsed as { message?: string; error_description?: string })?.message ||
      (parsed as { error_description?: string })?.error_description ||
      `Cashfree ${res.status}`;
    throw new Error(`Cashfree ${res.status}: ${err}`);
  }
  return parsed as T;
}

/**
 * Verifies Cashfree webhook signature.
 * Cashfree signs: base64(HMAC_SHA256(secret, timestamp + rawBody))
 */
export function verifyCashfreeSignature(
  rawBody: string,
  timestamp: string | null,
  signature: string | null,
): boolean {
  if (!timestamp || !signature) return false;
  const { secret } = requireCreds();
  const expected = createHmac("sha256", secret)
    .update(timestamp + rawBody)
    .digest("base64");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
