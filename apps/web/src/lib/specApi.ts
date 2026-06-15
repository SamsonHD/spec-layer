import { NextRequest, NextResponse } from "next/server";
import {
  allowedCorsOrigin,
  authorizeLocalRequest,
  localCorsHeaders,
} from "./localAccess";

/** Shared authorization and CORS helpers for APIs that access local data. */
export function corsHeaders(req: NextRequest): Record<string, string> {
  return localCorsHeaders(allowedCorsOrigin(req));
}

export function authorizeApiRequest(req: NextRequest): {
  headers: Record<string, string>;
  response: NextResponse | null;
} {
  const result = authorizeLocalRequest(req);
  const headers = localCorsHeaders(result.ok ? result.origin : allowedCorsOrigin(req));
  if (result.ok) return { headers, response: null };
  return {
    headers,
    response: NextResponse.json(
      { error: result.error },
      { status: result.status, headers },
    ),
  };
}

/**
 * A slug is safe iff every segment is a non-empty string with no path-traversal
 * characters. Guards `path.join(contentDir, ...slug)` against escaping the
 * content dir to read/overwrite arbitrary files.
 */
export function isSafeSlug(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (part) =>
        typeof part === "string" &&
        part.trim().length > 0 &&
        !part.includes("/") &&
        !part.includes("\\") &&
        !part.includes(".."),
    )
  );
}

/** True if a free-text field contains path-traversal characters. */
export function hasTraversal(raw: string): boolean {
  return raw.includes("/") || raw.includes("\\") || raw.includes("..");
}
