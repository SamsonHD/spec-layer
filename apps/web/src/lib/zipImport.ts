/**
 * Pure helper for filtering and normalising zip entries before writing to _inbox.
 *
 * `selectSpecArchiveEntries` is intentionally side-effect-free (no I/O) so it
 * can be unit-tested without a filesystem or a real zip file.
 */

import { parseMarkdown } from "@spec-layer/format";
import type { IntermediateSpec } from "@spec-layer/extractor";
import path from "node:path";
import { Unzip, UnzipInflate } from "fflate";

export class ZipLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZipLimitError";
  }
}

export interface ZipLimits {
  maxEntries: number;
  maxFileBytes: number;
  maxTotalBytes: number;
}

function joinChunks(chunks: Uint8Array[], size: number): Uint8Array {
  const output = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

export function unzipWithLimits(
  archive: Uint8Array,
  limits: ZipLimits,
): Record<string, Uint8Array> {
  const entries: Record<string, Uint8Array> = {};
  let entryCount = 0;
  let totalBytes = 0;

  const unzip = new Unzip((file) => {
    entryCount += 1;
    if (entryCount > limits.maxEntries) {
      throw new ZipLimitError(`Zip contains more than ${limits.maxEntries} entries`);
    }
    if (file.originalSize !== undefined && file.originalSize > limits.maxFileBytes) {
      throw new ZipLimitError(
        `Entry "${file.name}" exceeds ${limits.maxFileBytes} decompressed bytes`,
      );
    }

    const chunks: Uint8Array[] = [];
    let fileBytes = 0;
    file.ondata = (error, chunk, final) => {
      if (error) throw error;
      fileBytes += chunk.length;
      totalBytes += chunk.length;
      if (fileBytes > limits.maxFileBytes) {
        throw new ZipLimitError(
          `Entry "${file.name}" exceeds ${limits.maxFileBytes} decompressed bytes`,
        );
      }
      if (totalBytes > limits.maxTotalBytes) {
        throw new ZipLimitError(
          `Total decompressed size exceeds ${limits.maxTotalBytes} bytes`,
        );
      }
      chunks.push(chunk);
      if (final) entries[file.name] = joinChunks(chunks, fileBytes);
    };
    file.start();
  });
  unzip.register(UnzipInflate);
  unzip.push(archive, true);
  return entries;
}

export interface SelectedFile {
  /** Component name: from frontmatter `name` / `component.name`, else the filename stem. */
  name: string;
  /** Raw markdown string (UTF-8 decoded). */
  markdown: string;
  /** Paired generated extraction sidecar, when present and valid. */
  spec?: IntermediateSpec;
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

function normalizeArchivePath(entryName: string): string | null {
  const normalized = entryName
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/^\.\//, "");
  const parts = normalized.split("/");
  if (!normalized || parts.some((part) => part === "..")) return null;
  return normalized;
}

function markdownMirrorKey(entryName: string): string | null {
  const normalized = normalizeArchivePath(entryName);
  if (!normalized) return null;
  if (!/\.(md|markdown)$/i.test(normalized)) return null;
  return normalized.replace(/\.(md|markdown)$/i, "");
}

function sidecarMirrorKey(entryName: string): string | null {
  const normalized = normalizeArchivePath(entryName);
  if (!normalized) return null;
  if (!normalized.toLowerCase().startsWith(".spec-data/")) return null;
  if (!normalized.toLowerCase().endsWith(".json")) return null;
  return normalized.slice(".spec-data/".length).replace(/\.json$/i, "");
}

function isIntermediateSpec(value: unknown): value is IntermediateSpec {
  if (typeof value !== "object" || value === null) return false;
  const spec = value as Record<string, unknown>;
  return (
    typeof spec.name === "string" &&
    typeof spec.figmaKey === "string" &&
    typeof spec.figmaFile === "string" &&
    typeof spec.figmaNode === "string" &&
    Array.isArray(spec.anatomy) &&
    Array.isArray(spec.props) &&
    Array.isArray(spec.variants) &&
    Array.isArray(spec.variantInstances) &&
    Array.isArray(spec.states) &&
    Array.isArray(spec.tokens) &&
    Array.isArray(spec.related) &&
    Array.isArray(spec.gaps) &&
    Array.isArray(spec.layout)
  );
}

function parseSidecar(bytes: Uint8Array | string): IntermediateSpec | string {
  try {
    const parsed = JSON.parse(decode(bytes)) as unknown;
    if (!isIntermediateSpec(parsed)) {
      return "Sidecar JSON is not an IntermediateSpec";
    }
    return parsed;
  } catch (error) {
    return `Sidecar parse error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Select importable component entries from an unzipped archive.
 *
 * Keeps non-empty `.md`/`.markdown` files (with name + markdown) and pairs each
 * with its mirrored `.spec-data/<same-path>.json` sidecar when present and valid
 * (an `IntermediateSpec`). Returns kept files plus a list of skipped entries with
 * reasons. Directory entries (names ending in `/`) are silently ignored.
 *
 * @param entries  The output of fflate's `unzipSync`: Record<path, Uint8Array>.
 *                 Accepts `string` values too so tests can pass raw strings.
 */
export function selectSpecArchiveEntries(
  entries: Record<string, Uint8Array | string>,
): SelectResult {
  const sidecars = new Map<string, { name: string; value: IntermediateSpec | string }>();
  for (const [entryName, bytes] of Object.entries(entries)) {
    if (entryName.endsWith("/")) continue;
    const sidecarKey = sidecarMirrorKey(entryName);
    if (!sidecarKey) continue;
    sidecars.set(sidecarKey, { name: entryName, value: parseSidecar(bytes) });
  }

  const files: SelectedFile[] = [];
  const skipped: SkippedEntry[] = [];
  const matchedSidecars = new Set<string>();

  for (const [entryName, bytes] of Object.entries(entries)) {
    // 1. Silently ignore directory entries.
    if (entryName.endsWith("/")) continue;

    // 2. Sidecars are handled by mirror-key pairing, not as standalone files.
    if (sidecarMirrorKey(entryName)) continue;

    // 3. Only keep .md / .markdown files; skip everything else.
    const lowerEntry = entryName.toLowerCase();
    if (!lowerEntry.endsWith(".md") && !lowerEntry.endsWith(".markdown")) {
      skipped.push({ name: entryName, reason: "Not a .md or .markdown file" });
      continue;
    }

    // This entry is the markdown half of a potential pair. Account for its
    // mirrored sidecar now so that, even if the markdown is itself skipped
    // below (empty / bad frontmatter), the sidecar is not separately reported
    // as an orphan — one skip message per component, not two.
    const mirrorKey = markdownMirrorKey(entryName);
    if (mirrorKey) matchedSidecars.add(mirrorKey);

    // 4. Decode to string.
    const markdown = decode(bytes);

    // 5. Reject empty / whitespace-only content.
    if (!markdown.trim()) {
      skipped.push({ name: entryName, reason: "File is empty or contains only whitespace" });
      continue;
    }

    // 6. Validate parseable frontmatter.
    let parsed: ReturnType<typeof parseMarkdown>;
    try {
      parsed = parseMarkdown(markdown);
    } catch (e) {
      skipped.push({
        name: entryName,
        reason: `Frontmatter parse error: ${e instanceof Error ? e.message : String(e)}`,
      });
      continue;
    }

    // 7. Derive the component name.
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
    const selected: SelectedFile = { name, markdown };

    // `mirrorKey` was already marked matched above. Attach a valid sidecar, or
    // report an invalid one (it is still "matched", so not double-reported).
    const sidecar = mirrorKey ? sidecars.get(mirrorKey) : undefined;
    if (sidecar) {
      if (typeof sidecar.value === "string") {
        skipped.push({ name: sidecar.name, reason: sidecar.value });
      } else {
        selected.spec = sidecar.value;
      }
    }

    files.push(selected);
  }

  for (const [key, sidecar] of sidecars) {
    if (!matchedSidecars.has(key)) {
      skipped.push({ name: sidecar.name, reason: "No matching markdown file for sidecar" });
    }
  }

  return { files, skipped };
}
