import fs from "node:fs";
import path from "node:path";
import { getContentDir } from "./config";
import {
  deleteSection,
  insertSection,
  reorderSection,
  replaceSection,
  splitSections,
  type Section,
} from "./sectionEdit";

/** Raised when the section at `index` no longer matches the heading the client loaded. */
export class StaleSectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StaleSectionError";
  }
}

/**
 * A single inline-section edit applied to a component's markdown BODY.
 *
 * Indexing scheme: `index` (and `to`) reference the section position within the
 * FULL file body's section list as produced by `splitSections` — the exact same
 * split the client uses to render `<EditableSection>`s. The client and server
 * therefore agree on indices and edits always target the right section. The
 * preamble (content before the first heading) is index 0 when present.
 */
export type SectionEdit =
  | { action: "replace"; index: number; content: string; expectedHeading?: string }
  | { action: "insert"; index: number; heading: string; content: string; level?: number }
  | { action: "delete"; index: number; expectedHeading?: string }
  | { action: "reorder"; index: number; to: number; expectedHeading?: string };

/**
 * Split a raw file into its (byte-for-byte) frontmatter block and the body.
 *
 * This is a hand-rolled regex rather than `@spec-layer/format`'s
 * `parseFrontmatter` on purpose: that parser validates and reserializes the YAML,
 * which would rewrite the frontmatter bytes (key order, quoting, spacing) and
 * defeat the byte-for-byte preservation this writer guarantees. We only need the
 * raw split here, so we keep the frontmatter block verbatim and never touch it.
 */
export function splitFrontmatter(raw: string): { frontmatter: string; body: string } {
  const m = /^(---\r?\n[\s\S]*?\r?\n---)(\r?\n)?([\s\S]*)$/.exec(raw);
  if (!m) return { frontmatter: "", body: raw };
  return { frontmatter: m[1], body: m[3] };
}

function applyEdit(body: string, edit: SectionEdit): string {
  switch (edit.action) {
    case "replace":
      return replaceSection(body, edit.index, edit.content);
    case "insert": {
      const section: Section = {
        heading: edit.heading,
        level: edit.level ?? 2,
        content: edit.content ?? "",
      };
      return insertSection(body, edit.index, section);
    }
    case "delete":
      return deleteSection(body, edit.index);
    case "reorder":
      return reorderSection(body, edit.index, edit.to);
  }
}

/**
 * Resolve a component file by slug (same slug->path logic as content.ts /
 * specWriter.ts), apply a section edit to the BODY only, and write back leaving
 * the frontmatter block untouched.
 */
export function applySectionEdit(slug: string[], edit: SectionEdit): void {
  const dir = getContentDir();
  const filePath = path.join(dir, ...slug) + ".md";
  if (!fs.existsSync(filePath)) throw new Error("Component not found");

  const raw = fs.readFileSync(filePath, "utf-8");
  const { frontmatter, body } = splitFrontmatter(raw);

  // Stale-index guard: if the client told us which heading it believes lives at
  // `index`, verify it still matches before mutating. This catches the case where
  // the file changed since the page loaded (a section was added/removed/reordered
  // elsewhere) so an edit never silently lands on the wrong section. `insert`
  // targets a gap between sections, so there is no heading to check.
  if (edit.action !== "insert" && edit.expectedHeading !== undefined) {
    const sections = splitSections(body);
    const actual = sections[edit.index]?.heading;
    if (actual !== edit.expectedHeading) {
      throw new StaleSectionError("section changed since load, refresh and retry");
    }
  }

  const newBody = applyEdit(body, edit);

  const next = frontmatter ? `${frontmatter}\n\n${newBody}\n` : `${newBody}\n`;
  fs.writeFileSync(filePath, next, "utf-8");
}
