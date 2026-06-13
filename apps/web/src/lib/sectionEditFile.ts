import fs from "node:fs";
import path from "node:path";
import { getContentDir } from "./config";
import {
  deleteSection,
  insertSection,
  reorderSection,
  replaceSection,
  type Section,
} from "./sectionEdit";

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
  | { action: "replace"; index: number; content: string }
  | { action: "insert"; index: number; heading: string; content: string; level?: number }
  | { action: "delete"; index: number }
  | { action: "reorder"; index: number; to: number };

/** Split a raw file into its (byte-for-byte) frontmatter block and the body. */
function splitFrontmatter(raw: string): { frontmatter: string; body: string } {
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
  const newBody = applyEdit(body, edit);

  const next = frontmatter ? `${frontmatter}\n\n${newBody}\n` : `${newBody}\n`;
  fs.writeFileSync(filePath, next, "utf-8");
}
