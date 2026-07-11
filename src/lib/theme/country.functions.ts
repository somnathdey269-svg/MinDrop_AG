import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

/**
 * Resolve the caller's ISO-3166-1 alpha-2 country code from their IP.
 * Silent, best-effort — always returns something (defaults to "IN").
 */
export const resolveCountry = createServerFn({ method: "GET" }).handler(async () => {
  let ip: string | undefined;
  try {
    ip = getRequestIP({ xForwardedFor: true }) ?? undefined;
  } catch {
    ip = undefined;
  }

  // Try a couple of free, no-auth IP-geo endpoints. If both fail, fall back.
  const attempts: Array<() => Promise<string | null>> = [
    async () => {
      const url = ip ? `https://ipapi.co/${ip}/country/` : `https://ipapi.co/country/`;
      const res = await fetch(url, { headers: { "user-agent": "mindrop/1.0" } });
      if (!res.ok) return null;
      const text = (await res.text()).trim();
      return /^[A-Z]{2}$/.test(text) ? text : null;
    },
    async () => {
      const url = ip ? `https://ipwho.is/${ip}` : `https://ipwho.is/`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = (await res.json()) as { country_code?: string; success?: boolean };
      if (!json.success) return null;
      const cc = json.country_code?.toUpperCase();
      return cc && /^[A-Z]{2}$/.test(cc) ? cc : null;
    },
  ];

  for (const attempt of attempts) {
    try {
      const cc = await attempt();
      if (cc) return { code: cc };
    } catch {
      // keep trying
    }
  }

  return { code: "IN" };
});
