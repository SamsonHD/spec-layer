/**
 * Pure helpers for inline section editing of a markdown BODY string.
 *
 * A "section" is a `## Heading` (or any `#`-level heading) plus everything up to
 * the next heading of the same-or-shallower scanning rule. We split on any
 * heading line (level >= 1) that is not inside a fenced code block, mirroring the
 * fence-aware detection used in `lib/sections.ts` / `lib/content.ts`.
 *
 * Content before the first heading (preamble) is represented as a leading
 * section with an empty heading and level 0, so nothing is ever lost.
 *
 * Round-trip contract: `joinSections(splitSections(body))` returns `body`
 * normalized to a single trailing newline stripped (i.e. trailing whitespace
 * trimmed). The transform is idempotent.
 */

export interface Section {
  /** Heading text without the leading `#`s. Empty string for the preamble. */
  heading: string;
  /** Heading level (number of `#`). 0 for the preamble. */
  level: number;
  /** Body content under the heading, excluding the heading line itself. */
  content: string;
}

/**
 * Match a top-level `## Heading` line, capturing its level and text.
 *
 * We deliberately split on level-2 headings only (matching `partitionBody`'s
 * `parseSections`): deeper `###`/`####` subheadings stay inside their parent
 * section's content. This keeps a multi-table section like "Tokens used"
 * (which uses `### Color`, `#### Container`, …) as ONE section so it routes to
 * the read-only Specs tab as a unit instead of fragmenting into many editable
 * prose blocks in the Guidelines tab.
 */
const HEADING_RE = /^(##)\s+(.+?)\s*$/;

interface RawSection {
  heading: string;
  level: number;
  /** Lines of the body content (excluding the heading line). */
  contentLines: string[];
}

function parse(body: string): RawSection[] {
  const lines = body.split("\n");
  const out: RawSection[] = [];
  let current: RawSection | null = null;
  let inFence = false;

  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    const m = !inFence ? HEADING_RE.exec(line) : null;
    if (m) {
      if (current) out.push(current);
      current = { heading: m[2].trim(), level: m[1].length, contentLines: [] };
    } else if (current) {
      current.contentLines.push(line);
    } else {
      // Preamble: content before any heading.
      current = { heading: "", level: 0, contentLines: [line] };
    }
  }
  if (current) out.push(current);

  // Drop a preamble that is only whitespace (no real content before the first
  // heading) so a body that starts with a heading yields no empty leading block.
  return out.filter((s, i) => {
    if (i === 0 && s.level === 0) {
      return s.contentLines.join("\n").trim().length > 0;
    }
    return true;
  });
}

export function splitSections(body: string): Section[] {
  // Normalize CRLF -> LF up front (intentional): editing a CRLF-saved file would
  // otherwise re-emit LF-only joins and leave the file with mixed line endings.
  // Standardizing on LF here keeps the whole edit pipeline single-line-ending.
  const normalized = body.replace(/\r\n/g, "\n");
  return parse(normalized).map((s) => ({
    heading: s.heading,
    level: s.level,
    content: s.contentLines.join("\n").trim(),
  }));
}

/** Render a single section back to markdown (heading line + content). */
function renderSection(section: Section): string {
  const content = section.content.trim();
  if (section.level === 0 || section.heading === "") {
    return content;
  }
  const hashes = "#".repeat(section.level || 2);
  const headingLine = `${hashes} ${section.heading}`;
  return content ? `${headingLine}\n\n${content}` : headingLine;
}

export function joinSections(sections: Section[]): string {
  return sections.map(renderSection).join("\n\n").trim();
}

function assertIndex(sections: Section[], index: number, allowEnd = false): void {
  const max = allowEnd ? sections.length : sections.length - 1;
  if (!Number.isInteger(index) || index < 0 || index > max) {
    throw new Error(`Section index out of range: ${index} (have ${sections.length})`);
  }
}

export function replaceSection(body: string, index: number, newContent: string): string {
  const sections = splitSections(body);
  assertIndex(sections, index);
  sections[index] = { ...sections[index], content: newContent.trim() };
  return joinSections(sections);
}

export function insertSection(body: string, index: number, section: Section): string {
  const sections = splitSections(body);
  assertIndex(sections, index, /* allowEnd */ true);
  const level = section.level && section.level >= 1 ? section.level : 2;
  sections.splice(index, 0, { ...section, level });
  return joinSections(sections);
}

export function deleteSection(body: string, index: number): string {
  const sections = splitSections(body);
  assertIndex(sections, index);
  sections.splice(index, 1);
  return joinSections(sections);
}

export function reorderSection(body: string, from: number, to: number): string {
  const sections = splitSections(body);
  assertIndex(sections, from);
  assertIndex(sections, to);
  if (from === to) return joinSections(sections);
  const [moved] = sections.splice(from, 1);
  sections.splice(to, 0, moved);
  return joinSections(sections);
}
