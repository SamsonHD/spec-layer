import path from "node:path";

/** Path to a doc's `.spec-data` JSON sidecar. */
export function docSidecar(contentDir: string, slug: string[]): string {
  return path.join(contentDir, ".spec-data", ...slug) + ".json";
}

/** Path to a folder's `.spec-data` subtree (holds its docs' sidecars). */
export function folderSidecar(contentDir: string, slug: string[]): string {
  return path.join(contentDir, ".spec-data", ...slug);
}

/**
 * Defense-in-depth beyond isSafeSlug: confirm a resolved path stays strictly
 * inside the content dir (never equal to it). Guards recursive folder deletes.
 */
export function isInsideContent(contentDir: string, target: string): boolean {
  const base = path.resolve(contentDir);
  const resolved = path.resolve(target);
  return resolved !== base && resolved.startsWith(base + path.sep);
}

/** Validate a parent slug that may be the root ([]). */
export function isSafeParent(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
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
