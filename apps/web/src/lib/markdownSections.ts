/**
 * Shared, fence-aware splitter for canonical `## Section` blocks. Used by the
 * spec-update merge and the spec diff so they agree on section boundaries.
 */

export interface MarkdownSection {
  /** Normalized heading text (lowercased, quote- and space-normalized). */
  key: string;
  /** Original heading text without the leading `## `. */
  heading: string;
  /** Heading line + body, with trailing whitespace trimmed. */
  block: string;
}

export function normalizeHeading(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[‘’‛`]/g, "'")
    .replace(/\s+/g, " ");
}

export function splitSections(body: string): MarkdownSection[] {
  const lines = body.split("\n");
  const out: MarkdownSection[] = [];
  let current: MarkdownSection | null = null;
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    const m = !inFence ? /^##\s+(.+?)\s*$/.exec(line) : null;
    if (m) {
      if (current) out.push(current);
      current = { key: normalizeHeading(m[1]), heading: m[1].trim(), block: line };
    } else if (current) {
      current.block += "\n" + line;
    }
  }
  if (current) out.push(current);
  return out.map((s) => ({ ...s, block: s.block.trimEnd() }));
}

/** Judgment sections — kept from the human-authored file across re-extractions. */
export const JUDGMENT_KEYS = new Set([
  "definition",
  "code",
  "accessibility",
  "do's & don'ts",
  "dos & don'ts",
  "dos and don'ts",
  "do's and don'ts",
]);
