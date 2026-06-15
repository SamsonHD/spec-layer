import crypto from "node:crypto";

export interface LocalRequestLike {
  headers: Headers;
  url: string;
}

export type LocalAccessResult =
  | { ok: true; origin: string | null }
  | { ok: false; status: 401 | 403; error: string };

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

function bearerToken(headers: Headers): string | null {
  const value = headers.get("authorization");
  const match = /^Bearer ([^\s]+)$/.exec(value ?? "");
  return match?.[1] ?? null;
}

function tokenMatches(actual: string | null): boolean {
  const expected = process.env.SPEC_LAYER_TOKEN?.trim();
  if (!expected || !actual) return false;
  const expectedBytes = Buffer.from(expected);
  const actualBytes = Buffer.from(actual);
  return (
    expectedBytes.length === actualBytes.length &&
    crypto.timingSafeEqual(expectedBytes, actualBytes)
  );
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

  const allowedCrossOrigin =
    origin === "null" || commaList(process.env.SPEC_LAYER_ALLOWED_ORIGINS).includes(origin);
  if (!allowedCrossOrigin) {
    return { ok: false, status: 403, error: "Request origin is not allowed" };
  }

  if (!tokenMatches(bearerToken(req.headers))) {
    return { ok: false, status: 401, error: "Valid local bearer token required" };
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
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    Vary: "Origin",
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}
