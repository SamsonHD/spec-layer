/**
 * Convert a free-text label into a filesystem/URL-safe kebab segment.
 * Shared by the nav mutation routes (rename / create / move).
 */
export function toKebab(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[/\\\s,=]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}
