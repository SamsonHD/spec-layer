import fs from "node:fs";
import path from "node:path";
import type { ComponentDoc } from "./content";
import { getContentDir } from "./config";

export const SYNC_REPORT_VERSION = 1 as const;

/** Hand-authored sentinel (SPEC.md §2): drift detection is not applicable. */
const ZERO_HASH = "0".repeat(64);

export type SyncStatus = "in-sync" | "drifted" | "missing-in-figma";

/** A current component fingerprint reported by the plugin for one file scan. */
export interface SyncComponentFingerprint {
  figmaKey: string;
  figmaNode: string;
  name: string;
  contentHash: string;
}

export interface SyncSpecEntry {
  status: SyncStatus;
  figmaKey: string;
  figmaFile: string;
  savedHash: string;
  /** Omitted for `missing-in-figma` (no live component to hash). */
  currentHash?: string;
  checkedAt: string;
}

export interface SyncFileEntry {
  checkedAt: string;
  scannedCount: number;
  newInFigma: Array<{ figmaKey: string; name: string }>;
}

export interface SyncReport {
  version: typeof SYNC_REPORT_VERSION;
  files: Record<string, SyncFileEntry>;
  /** Keyed by doc slug joined with "/". */
  specs: Record<string, SyncSpecEntry>;
}

/** Result of a per-component lookup for the plugin's selection chip. */
export type SyncLookupResult =
  | { status: "in-sync" | "drifted"; slug: string[] }
  | { status: "absent" };

function reportPath(): string {
  return path.join(getContentDir(), ".spec-sync.json");
}

/** A saved doc is eligible for drift detection when it has a real extraction. */
function isEligible(doc: ComponentDoc): {
  ok: boolean;
  figmaKey?: string;
  figmaFile?: string;
  savedHash?: string;
} {
  if (doc.slug[0] === "_inbox") return { ok: false };
  const { figmaKey, contentHash } = doc.frontmatter;
  const figmaFile = doc.frontmatter.figmaRef?.fileKey;
  if (!figmaKey || !figmaFile || !contentHash || contentHash === ZERO_HASH) {
    return { ok: false };
  }
  return { ok: true, figmaKey, figmaFile, savedHash: contentHash };
}

export function readSyncReport(): SyncReport | null {
  try {
    const raw = fs.readFileSync(reportPath(), "utf-8");
    const parsed = JSON.parse(raw) as SyncReport;
    if (!parsed || parsed.version !== SYNC_REPORT_VERSION) return null;
    if (typeof parsed.files !== "object" || typeof parsed.specs !== "object") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeSyncReport(report: SyncReport): void {
  const file = reportPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // Temp-file + atomic rename, matching the content-root write conventions.
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(report, null, 2), "utf-8");
  fs.renameSync(tmp, file);
}

/**
 * Compute the per-file drift result and merge it into a prior report. A check
 * for `fileKey` replaces that file's per-file record and all per-spec entries
 * whose `figmaFile === fileKey`, leaving entries for other files untouched.
 */
export function computeFileSync(
  fileKey: string,
  components: SyncComponentFingerprint[],
  docs: ComponentDoc[],
  prior: SyncReport | null = readSyncReport(),
  now: string = new Date().toISOString(),
): SyncReport {
  const byKey = new Map(
    components.filter((c) => c.figmaKey).map((c) => [c.figmaKey, c]),
  );

  // Start from prior, dropping this file's stale per-spec entries.
  const specs: Record<string, SyncSpecEntry> = {};
  for (const [slug, entry] of Object.entries(prior?.specs ?? {})) {
    if (entry.figmaFile !== fileKey) specs[slug] = entry;
  }

  // Keys claimed by ANY saved spec, so new-in-figma excludes specs of other files.
  const allKnownKeys = new Set<string>();

  for (const doc of docs) {
    const eligible = isEligible(doc);
    if (eligible.ok && eligible.figmaKey) allKnownKeys.add(eligible.figmaKey);

    if (!eligible.ok || eligible.figmaFile !== fileKey) continue;

    const slug = doc.slug.join("/");
    const current = byKey.get(eligible.figmaKey!);
    if (!current) {
      specs[slug] = {
        status: "missing-in-figma",
        figmaKey: eligible.figmaKey!,
        figmaFile: fileKey,
        savedHash: eligible.savedHash!,
        checkedAt: now,
      };
      continue;
    }
    specs[slug] = {
      status: current.contentHash === eligible.savedHash ? "in-sync" : "drifted",
      figmaKey: eligible.figmaKey!,
      figmaFile: fileKey,
      savedHash: eligible.savedHash!,
      currentHash: current.contentHash,
      checkedAt: now,
    };
  }

  const files = { ...(prior?.files ?? {}) };
  files[fileKey] = {
    checkedAt: now,
    scannedCount: components.length,
    newInFigma: components
      .filter((c) => c.figmaKey && !allKnownKeys.has(c.figmaKey))
      .map((c) => ({ figmaKey: c.figmaKey, name: c.name })),
  };

  return { version: SYNC_REPORT_VERSION, files, specs };
}

/** Read-only per-component status for the plugin's selection chip. */
export function lookupSpecByFigmaKey(
  figmaKey: string,
  contentHash: string,
  docs: ComponentDoc[],
): SyncLookupResult {
  for (const doc of docs) {
    const eligible = isEligible(doc);
    if (!eligible.ok || eligible.figmaKey !== figmaKey) continue;
    return {
      status: contentHash === eligible.savedHash ? "in-sync" : "drifted",
      slug: doc.slug,
    };
  }
  return { status: "absent" };
}

export function getSpecSyncStatus(slug: string[]): SyncSpecEntry | null {
  return readSyncReport()?.specs[slug.join("/")] ?? null;
}
