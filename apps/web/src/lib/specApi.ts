import type { NextRequest } from "next/server";

/**
 * Shared CORS + input-validation helpers for the /api/specs/* mutating routes.
 *
 * These routes write files to disk, so we must not reflect an arbitrary Origin
 * (that would let any site the user is browsing POST to disk while the dev
 * server runs). We only echo an allow-listed origin. The Figma plugin iframe
 * sends `Origin: null`; localhost is allowed for dev; deploy hosts can be added
 * via SPEC_IMPORT_ALLOWED_ORIGINS (comma-separated).
 */
const DEFAULT_ALLOWED_ORIGINS = [
  "null",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function allowedOrigins(): string[] {
  const extra =
    process.env.SPEC_IMPORT_ALLOWED_ORIGINS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  return [...DEFAULT_ALLOWED_ORIGINS, ...extra];
}

export function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin");
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
  if (origin && allowedOrigins().includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
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
