/**
 * Split a markdown body into named `## Section` blocks. Used to route
 * specific sections to either the Guidelines tab (prose) or the Specs tab
 * (data) without losing any other content.
 *
 * Section names are matched case-insensitively against an alias list that
 * tolerates curly quotes in "Do's & Don'ts".
 */

export type SectionMap = Record<string, string>;

interface ParsedSection {
  /** Lowercased heading text without the leading `## `. */
  key: string;
  /** Original heading text (preserved for rendering when we put it back). */
  heading: string;
  /** Heading line + everything until the next `## ` (or EOF), trimmed. */
  body: string;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[\u2018\u2019\u201B`]/g, "'")
    .replace(/\s+/g, " ");
}

function parseSections(body: string): ParsedSection[] {
  const lines = body.split("\n");
  const out: ParsedSection[] = [];
  let current: ParsedSection | null = null;
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    const m = !inFence ? /^##\s+(.+?)\s*$/.exec(line) : null;
    if (m) {
      if (current) out.push(current);
      current = { key: normalize(m[1]), heading: m[1].trim(), body: line };
    } else if (current) {
      current.body += "\n" + line;
    }
  }
  if (current) out.push(current);
  return out.map((s) => ({ ...s, body: s.body.trimEnd() }));
}

/** Heading aliases per logical section. Lowercased and quote-normalized. */
const SECTION_ALIASES: Record<string, string[]> = {
  definition: ["definition", "overview", "description"],
  anatomy: ["anatomy"],
  configuration: ["configuration", "props", "properties", "api"],
  variants: ["variants"],
  states: ["states"],
  tokens: ["tokens used", "tokens"],
  code: ["code", "usage", "implementation"],
  accessibility: ["accessibility", "a11y"],
  dosDonts: ["do's & don'ts", "dos & don'ts", "dos and don'ts", "do's and don'ts"],
  related: ["related atoms", "related", "see also"],
  gaps: ["extraction gaps"],
};

/** Group sections into Guidelines (prose) and Specs (data) buckets. */
export const GUIDELINES_SECTION_KEYS = [
  "definition",
  "code",
  "accessibility",
  "dosDonts",
  "related",
] as const;

export const SPECS_SECTION_KEYS = [
  "anatomy",
  "configuration",
  "variants",
  "states",
  "tokens",
] as const;

/**
 * Classify a single heading into a logical bucket ("guidelines" | "specs" |
 * "gaps" | "other") using the same alias table as `partitionBody`. Exposed so
 * the inline-section editor can decide which full-body sections are editable
 * prose (Guidelines + other) versus the read-only structured Specs tables.
 */
export function classifyHeading(heading: string): "guidelines" | "specs" | "gaps" | "other" {
  const key = normalize(heading);
  for (const [logical, names] of Object.entries(SECTION_ALIASES)) {
    if (names.some((name) => normalize(name) === key)) {
      if (logical === "gaps") return "gaps";
      if ((GUIDELINES_SECTION_KEYS as readonly string[]).includes(logical)) return "guidelines";
      if ((SPECS_SECTION_KEYS as readonly string[]).includes(logical)) return "specs";
      return "other";
    }
  }
  return "other";
}

export interface BodyPartition {
  guidelinesMarkdown: string;
  specsMarkdown: string;
  gapsMarkdown: string | null;
  /** Sections we couldn't classify — appended to Guidelines so nothing is lost. */
  otherMarkdown: string;
}

/**
 * Partition the markdown body into Guidelines + Specs + Gaps. Unknown
 * sections fall into `otherMarkdown` and are surfaced in the Guidelines tab.
 */
export function partitionBody(body: string): BodyPartition {
  const sections = parseSections(body);
  const buckets: Record<string, string[]> = {
    guidelines: [],
    specs: [],
    gaps: [],
    other: [],
  };

  const aliasIndex = new Map<string, string>();
  for (const [logical, names] of Object.entries(SECTION_ALIASES)) {
    for (const name of names) aliasIndex.set(normalize(name), logical);
  }

  for (const section of sections) {
    const logical = aliasIndex.get(section.key);
    if (!logical) {
      buckets.other.push(section.body);
      continue;
    }
    if (logical === "gaps") buckets.gaps.push(section.body);
    else if ((GUIDELINES_SECTION_KEYS as readonly string[]).includes(logical)) {
      buckets.guidelines.push(section.body);
    } else if ((SPECS_SECTION_KEYS as readonly string[]).includes(logical)) {
      buckets.specs.push(section.body);
    } else {
      buckets.other.push(section.body);
    }
  }

  return {
    guidelinesMarkdown: buckets.guidelines.join("\n\n").trim(),
    specsMarkdown: buckets.specs.join("\n\n").trim(),
    gapsMarkdown: buckets.gaps.length ? buckets.gaps.join("\n\n").trim() : null,
    otherMarkdown: buckets.other.join("\n\n").trim(),
  };
}
