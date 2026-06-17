import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter, parseMarkdown, serializeFrontmatter } from "@spec-layer/format";
import { getContentDir } from "./config";
import { upsertFrontmatterField } from "./content";
import { JUDGMENT_KEYS, splitSections } from "./markdownSections";
import { isSafeSlug } from "./specApi";
import { readSyncReport, writeSyncReport } from "./sync";

/**
 * Resolve a drifted library spec by merging a freshly re-extracted inbox draft
 * into it WITHOUT losing human-authored prose.
 *
 * The re-extraction (inbox source) supplies the refreshed deterministic
 * sections and identity frontmatter (content_hash, extracted_at, component.*).
 * The existing library file keeps its four judgment sections — Definition,
 * Code, Accessibility, Do's & Don'ts — plus its human lifecycle fields
 * (status, approved_by) and any top-level `name:` rename. The inbox draft (and
 * its sidecar) are then removed and the sidecar is moved onto the target,
 * matching the path-mirroring rule in spec/SIDECAR.md.
 */

export class SpecUpdateError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 404 | 500,
  ) {
    super(message);
    this.name = "SpecUpdateError";
  }
}

/**
 * Merge bodies: take the NEW body's sections in order, but for each judgment
 * section also present in the OLD body, keep the OLD block (human prose).
 */
export function mergePreservingJudgment(newBody: string, oldBody: string): string {
  const oldByKey = new Map(splitSections(oldBody).map((s) => [s.key, s.block]));
  const merged = splitSections(newBody).map((s) =>
    JUDGMENT_KEYS.has(s.key) && oldByKey.has(s.key) ? oldByKey.get(s.key)! : s.block,
  );
  return merged.join("\n\n").trim() + "\n";
}

function requireInboxSource(value: unknown): string[] {
  if (!isSafeSlug(value) || value.length !== 2 || value[0] !== "_inbox") {
    throw new SpecUpdateError("Source must be a component directly inside _inbox", 400);
  }
  return value;
}

function requireLibraryTarget(value: unknown): string[] {
  if (!isSafeSlug(value) || value[0] === "_inbox") {
    throw new SpecUpdateError("Target must be a library component outside _inbox", 400);
  }
  return value;
}

/** Reject any symlink along a path under the content dir (defense in depth). */
function assertNoSymlinks(contentDir: string, target: string): void {
  const relative = path.relative(contentDir, target);
  if (relative.startsWith("..")) {
    throw new SpecUpdateError("Path escapes the content directory", 400);
  }
  const segments = relative ? relative.split(path.sep) : [];
  let current = contentDir;
  for (const segment of ["", ...segments]) {
    if (segment) current = path.join(current, segment);
    try {
      if (fs.lstatSync(current).isSymbolicLink()) {
        throw new SpecUpdateError("Path must not contain symbolic links", 400);
      }
    } catch (error) {
      if (error instanceof SpecUpdateError) throw error;
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
      throw new SpecUpdateError("Failed to validate spec paths", 500);
    }
  }
}

const mdPath = (dir: string, slug: string[]) => path.join(dir, ...slug) + ".md";
const sidecarPath = (dir: string, slug: string[]) =>
  path.join(dir, ".spec-data", ...slug) + ".json";

/** Flip a resolved spec's sync-report entry to in-sync (best-effort nicety). */
function markInSync(slug: string[], hash: string): void {
  try {
    const report = readSyncReport();
    const key = slug.join("/");
    const entry = report?.specs[key];
    if (!report || !entry) return;
    report.specs[key] = {
      ...entry,
      status: "in-sync",
      savedHash: hash,
      currentHash: hash,
      checkedAt: new Date().toISOString(),
    };
    writeSyncReport(report);
  } catch {
    // Report is advisory; a stale entry is harmless and corrected on next check.
  }
}

export function updateLibrarySpecFromInbox(
  rawSource: unknown,
  rawTarget: unknown,
): { slug: string[] } {
  const source = requireInboxSource(rawSource);
  const target = requireLibraryTarget(rawTarget);
  const contentDir = getContentDir();

  const sourceMd = mdPath(contentDir, source);
  const targetMd = mdPath(contentDir, target);
  for (const p of [sourceMd, targetMd]) assertNoSymlinks(contentDir, p);

  if (!fs.existsSync(sourceMd)) {
    throw new SpecUpdateError("Inbox draft not found", 404);
  }
  if (!fs.existsSync(targetMd)) {
    throw new SpecUpdateError("Target component not found", 404);
  }

  let newFrontmatter;
  let newBody: string;
  try {
    const parsed = parseFrontmatter(fs.readFileSync(sourceMd, "utf-8"));
    newFrontmatter = parsed.frontmatter;
    newBody = parsed.body;
  } catch (e) {
    throw new SpecUpdateError(
      `Inbox draft is not a valid spec: ${e instanceof Error ? e.message : String(e)}`,
      400,
    );
  }

  // Old file parsed leniently so a legacy/edited library file still yields its
  // judgment prose and lifecycle fields.
  const oldRaw = fs.readFileSync(targetMd, "utf-8");
  const { data: oldData, content: oldBody } = parseMarkdown(oldRaw);

  const mergedBody = mergePreservingJudgment(newBody, oldBody);

  // Frontmatter: identity from the re-extraction; preserve human fields.
  let mergedDoc = serializeFrontmatter(newFrontmatter, mergedBody);
  for (const field of ["status", "approved_by", "name"] as const) {
    const value = oldData[field];
    if (typeof value === "string" && value.trim()) {
      mergedDoc = upsertFrontmatterField(mergedDoc, field, value);
    }
  }

  // Write the merged library file, then move the sidecar onto the target.
  try {
    fs.writeFileSync(targetMd, mergedDoc, "utf-8");
  } catch {
    throw new SpecUpdateError("Failed to write updated spec", 500);
  }

  const sourceSidecar = sidecarPath(contentDir, source);
  const targetSidecar = sidecarPath(contentDir, target);
  assertNoSymlinks(contentDir, targetSidecar);
  if (fs.existsSync(sourceSidecar)) {
    try {
      fs.mkdirSync(path.dirname(targetSidecar), { recursive: true });
      fs.copyFileSync(sourceSidecar, targetSidecar);
    } catch {
      // Sidecar is advisory (SIDECAR.md §1); markdown is the source of truth.
    }
  }

  // Remove the inbox draft + its sidecar.
  try {
    fs.unlinkSync(sourceMd);
  } catch {
    throw new SpecUpdateError("Updated the spec but failed to remove the inbox draft", 500);
  }
  if (fs.existsSync(sourceSidecar)) {
    try {
      fs.unlinkSync(sourceSidecar);
    } catch {
      // A leftover inbox sidecar is harmless and recoverable via git.
    }
  }

  if (newFrontmatter.content_hash) markInSync(target, newFrontmatter.content_hash);

  return { slug: target };
}
