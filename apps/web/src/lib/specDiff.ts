/**
 * Diff the *deterministic* content of two spec markdown bodies — what a Figma
 * re-extraction would actually change. Judgment sections (Definition, Code,
 * Accessibility, Do's & Don'ts) are excluded because the section-preserving
 * Update keeps them; showing them as "changed" would be misleading.
 */

import { JUDGMENT_KEYS, splitSections } from "./markdownSections";

export type DiffLineType = "context" | "add" | "del";

export interface DiffLine {
  type: DiffLineType;
  text: string;
}

export type SectionChange = "added" | "removed" | "changed";

export interface SectionDiff {
  heading: string;
  change: SectionChange;
  lines: DiffLine[];
}

export interface SpecDiff {
  /** Sections that differ (added / removed / changed), in document order. */
  sections: SectionDiff[];
  /** True when nothing deterministic changed. */
  unchanged: boolean;
}

/** Line-level diff via a longest-common-subsequence table (sections are small). */
function diffLines(oldLines: string[], newLines: string[]): DiffLine[] {
  const m = oldLines.length;
  const n = newLines.length;
  const lcs: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      lcs[i][j] =
        oldLines[i] === newLines[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (oldLines[i] === newLines[j]) {
      out.push({ type: "context", text: oldLines[i] });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      out.push({ type: "del", text: oldLines[i] });
      i++;
    } else {
      out.push({ type: "add", text: newLines[j] });
      j++;
    }
  }
  while (i < m) out.push({ type: "del", text: oldLines[i++] });
  while (j < n) out.push({ type: "add", text: newLines[j++] });
  return out;
}

/** Sections that carry deterministic (extracted) content. */
function deterministic(body: string) {
  return splitSections(body).filter((s) => !JUDGMENT_KEYS.has(s.key));
}

/**
 * Diff old → new. `oldBody` is the saved spec; `newBody` is the re-extraction.
 */
export function diffSpecBodies(oldBody: string, newBody: string): SpecDiff {
  const oldSections = deterministic(oldBody);
  const newSections = deterministic(newBody);
  const oldByKey = new Map(oldSections.map((s) => [s.key, s]));
  const newByKey = new Map(newSections.map((s) => [s.key, s]));

  const sections: SectionDiff[] = [];

  // Removed sections (present old, absent new) — keep document order of old.
  for (const s of oldSections) {
    if (!newByKey.has(s.key)) {
      sections.push({
        heading: s.heading,
        change: "removed",
        lines: s.block.split("\n").map((text) => ({ type: "del" as const, text })),
      });
    }
  }

  // Added + changed — walk the new order so the result reads top-to-bottom.
  for (const s of newSections) {
    const old = oldByKey.get(s.key);
    if (!old) {
      sections.push({
        heading: s.heading,
        change: "added",
        lines: s.block.split("\n").map((text) => ({ type: "add" as const, text })),
      });
    } else if (old.block !== s.block) {
      sections.push({
        heading: s.heading,
        change: "changed",
        lines: diffLines(old.block.split("\n"), s.block.split("\n")),
      });
    }
  }

  return { sections, unchanged: sections.length === 0 };
}
