export interface LocalRequestLike {
  headers: Headers;
  url: string;
}

export type LocalAccessResult =
  | { ok: true; origin: string | null }
  | { ok: false; status: 403; error: string };

function commaList(value: string | undefined): string[] {
  return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
}

function hostnameFromHost(host: string): string | null {
  try {
    return new URL(`http://${host}`).hostname;
  } catch {
    return null;
  }
}

function isAllowedHost(host: string): boolean {
  const hostname = hostnameFromHost(host);
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") {
    return true;
  }
  return commaList(process.env.SPEC_LAYER_ALLOWED_HOSTS).includes(host);
}

export function authorizeLocalRequest(req: LocalRequestLike): LocalAccessResult {
  const requestUrl = new URL(req.url);
  const host = req.headers.get("host") ?? requestUrl.host;
  if (!isAllowedHost(host)) {
    return { ok: false, status: 403, error: "Request host is not allowed" };
  }

  const origin = req.headers.get("origin");
  if (!origin) return { ok: true, origin: null };

  const sameOrigin = origin === `${requestUrl.protocol}//${host}`;
  if (sameOrigin) return { ok: true, origin };

  // This is a local-only tool. Cross-origin callers are allowed when their
  // origin is explicitly permitted — the Figma plugin's opaque "null" origin,
  // or a host listed in SPEC_LAYER_ALLOWED_ORIGINS. No bearer token is
  // required; same-origin enforcement plus the host allow-list above are the
  // protection for a tool that only ever runs on localhost.
  const allowedCrossOrigin =
    origin === "null" || commaList(process.env.SPEC_LAYER_ALLOWED_ORIGINS).includes(origin);
  if (!allowedCrossOrigin) {
    return { ok: false, status: 403, error: "Request origin is not allowed" };
  }

  return { ok: true, origin };
}

export function allowedCorsOrigin(req: LocalRequestLike): string | null {
  const requestUrl = new URL(req.url);
  const host = req.headers.get("host") ?? requestUrl.host;
  if (!isAllowedHost(host)) return null;
  const origin = req.headers.get("origin");
  if (!origin) return null;
  if (origin === `${requestUrl.protocol}//${host}`) return origin;
  if (origin === "null") return origin;
  return commaList(process.env.SPEC_LAYER_ALLOWED_ORIGINS).includes(origin) ? origin : null;
}

export function localCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}
