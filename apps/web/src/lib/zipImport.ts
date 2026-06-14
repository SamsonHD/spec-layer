/**
 * Pure helper for filtering and normalising zip entries before writing to _inbox.
 *
 * `selectMarkdownEntries` is intentionally side-effect-free (no I/O) so it can
 * be unit-tested without a filesystem or a real zip file.
 */

import matter from "gray-matter";
import path from "node:path";

export interface SelectedFile {
  /** Component name: from frontmatter `name` / `component.name`, else the filename stem. */
  name: string;
  /** Raw markdown string (UTF-8 decoded). */
  markdown: string;
}

export interface SkippedEntry {
  /** The original zip entry name. */
  name: string;
  /** Human-readable reason for skipping. */
  reason: string;
}

export interface SelectResult {
  files: SelectedFile[];
  skipped: SkippedEntry[];
}

/**
 * Decode a Uint8Array to a UTF-8 string without fflate (pure Node.js).
 * The route uses fflate's `strFromU8` for efficiency; here we keep the helper
 * independent so it can run in tests without any native binding.
 */
function decode(bytes: Uint8Array | string): string {
  if (typeof bytes === "string") return bytes;
  return new TextDecoder("utf-8").decode(bytes);
}

/**
 * Extract the basename from a zip entry path, handling both forward-slash
 * and backslash separators, and stripping any leading `../` traversal
 * sequences. Returning only the basename means zip-slip is impossible — a
 * derived path can never escape the target directory.
 */
function safeBasename(entryName: string): string {
  // Normalise backslashes (some zip tools use Windows paths).
  const normalised = entryName.replace(/\\/g, "/");
  // `path.posix.basename` returns the last segment, dropping all directory
  // components including `..` — so `../../evil.md` → `evil.md`.
  return path.posix.basename(normalised);
}

/**
 * Filter a map of unzipped entries to only those that are non-empty `.md` files.
 * Returns kept files (with name + markdown) and a list of skipped entries with
 * reasons. Directory entries (names ending in `/`) are silently ignored.
 *
 * @param entries  The output of fflate's `unzipSync`: Record<path, Uint8Array>.
 *                 Accepts `string` values too so tests can pass raw strings.
 */
export function selectMarkdownEntries(
  entries: Record<string, Uint8Array | string>,
): SelectResult {
  const files: SelectedFile[] = [];
  const skipped: SkippedEntry[] = [];

  for (const [entryName, bytes] of Object.entries(entries)) {
    // 1. Silently ignore directory entries.
    if (entryName.endsWith("/")) continue;

    // 2. Only keep .md / .markdown files; skip everything else.
    const lowerEntry = entryName.toLowerCase();
    if (!lowerEntry.endsWith(".md") && !lowerEntry.endsWith(".markdown")) {
      skipped.push({ name: entryName, reason: "Not a .md or .markdown file" });
      continue;
    }

    // 3. Decode to string.
    const markdown = decode(bytes);

    // 4. Reject empty / whitespace-only content.
    if (!markdown.trim()) {
      skipped.push({ name: entryName, reason: "File is empty or contains only whitespace" });
      continue;
    }

    // 5. Validate parseable with gray-matter.
    let parsed: ReturnType<typeof matter>;
    try {
      parsed = matter(markdown);
    } catch (e) {
      skipped.push({
        name: entryName,
        reason: `Frontmatter parse error: ${e instanceof Error ? e.message : String(e)}`,
      });
      continue;
    }

    // 6. Derive the component name.
    //    Priority: frontmatter `name` → `component.name` → filename stem.
    const fm = parsed.data as Record<string, unknown>;
    const nameFromFm =
      typeof fm.name === "string" && fm.name.trim()
        ? fm.name.trim()
        : typeof fm.component === "object" &&
            fm.component !== null &&
            typeof (fm.component as Record<string, unknown>).name === "string"
          ? ((fm.component as Record<string, unknown>).name as string).trim()
          : null;

    // Basename-only for the filename stem (zip-slip prevention via basename extraction).
    const base = safeBasename(entryName);
    const stem = base.replace(/\.(md|markdown)$/i, "");
    const name = nameFromFm ?? stem;

    files.push({ name, markdown });
  }

  return { files, skipped };
}
