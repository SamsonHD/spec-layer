/**
 * Merge AI-drafted prose into the guideline sections of a spec BODY.
 *
 * Only three sections are ever AI-filled: Definition, Accessibility, and
 * Do's & Don'ts. The Code section is intentionally excluded — import paths and
 * prop mappings would be hallucinated; those belong to Code Connect / humans.
 *
 * "Fill" is non-destructive by default: with `target: "empty"` only sections
 * still holding the `_To be written._` placeholder are replaced, so human edits
 * survive. A specific heading as `target` performs an intentional regenerate of
 * just that one section, overwriting whatever is there.
 */

import type { ProseDrafts } from "@spec-layer/extractor";
import { splitSections, replaceSection } from "./sectionEdit";

/** The guideline headings we AI-fill, in canonical document order. */
export const FILLABLE_GUIDELINES = ["Definition", "Accessibility", "Do's & Don'ts"] as const;

export type GuidelineHeading = (typeof FILLABLE_GUIDELINES)[number];

export function isFillableGuideline(heading: string): heading is GuidelineHeading {
  return (FILLABLE_GUIDELINES as readonly string[]).includes(heading);
}

/**
 * A guideline section counts as "empty" when its content is an italic
 * placeholder like `_To be written._` (or `_None._`) — i.e. nothing a human
 * has written. Matches a string that is entirely a single `_…_` italic run.
 */
export function isEmptyGuideline(content: string): boolean {
  const trimmed = content.trim();
  return /^_[^_]*_$/.test(trimmed);
}

/** Render the Do's & Don'ts body from drafts: dos (✅) first, then donts (❌). */
export function renderDosDonts(prose: ProseDrafts): string {
  return [
    ...prose.dos.map((d) => `- ✅ ${d}`),
    ...prose.donts.map((d) => `- ❌ ${d}`),
  ].join("\n");
}

/** Produce the markdown content for a given guideline heading from the drafts. */
export function guidelineContent(heading: GuidelineHeading, prose: ProseDrafts): string {
  switch (heading) {
    case "Definition":
      return prose.definition.trim();
    case "Accessibility":
      return prose.accessibility.trim();
    case "Do's & Don'ts":
      return renderDosDonts(prose);
  }
}

export interface FillOptions {
  /**
   * `"empty"` (default): fill only guideline sections still holding a
   * placeholder. A specific heading: regenerate just that guideline section,
   * overwriting any existing content.
   */
  target?: "empty" | string;
}

export interface FillResult {
  body: string;
  /** Headings whose content was written, in document order. */
  filled: string[];
}

/**
 * Merge `prose` into the guideline sections of `body` per `opts.target`.
 * Non-guideline sections are never touched.
 */
export function fillGuidelines(
  body: string,
  prose: ProseDrafts,
  opts: FillOptions = {},
): FillResult {
  const target = opts.target ?? "empty";

  // A specific, non-guideline target is a no-op (e.g. someone asks to regen
  // "Anatomy"): there is nothing AI-fillable to write.
  if (target !== "empty" && !isFillableGuideline(target)) {
    return { body, filled: [] };
  }

  let current = body;
  const filled: string[] = [];

  // Re-split after each write: replaceSection re-emits the body, so indices stay
  // valid only against a fresh split. Guideline headings are unique per spec.
  for (const heading of FILLABLE_GUIDELINES) {
    if (target !== "empty" && target !== heading) continue;

    const sections = splitSections(current);
    const index = sections.findIndex((s) => s.heading === heading);
    if (index === -1) continue;

    const shouldWrite =
      target === heading || isEmptyGuideline(sections[index].content);
    if (!shouldWrite) continue;

    current = replaceSection(current, index, guidelineContent(heading, prose));
    filled.push(heading);
  }

  return { body: current, filled };
}

/**
 * Return the guideline headings whose current section content still exactly
 * matches one of the candidate AI drafts — i.e. a pristine, un-edited AI draft.
 *
 * Used to decide whether to offer "Regenerate": a pristine draft would just
 * regenerate to the same cached text, so the control is hidden until a human
 * edits the section away from the draft. Multiple candidates cover the case
 * where the text-only and vision drafts both exist in cache.
 */
export function findPristineGuidelines(
  body: string,
  candidates: ProseDrafts[],
): string[] {
  if (candidates.length === 0) return [];

  const sections = splitSections(body);
  const pristine: string[] = [];

  for (const heading of FILLABLE_GUIDELINES) {
    const section = sections.find((s) => s.heading === heading);
    if (!section) continue;
    const content = section.content.trim();
    if (isEmptyGuideline(content)) continue;
    if (candidates.some((draft) => guidelineContent(heading, draft) === content)) {
      pristine.push(heading);
    }
  }

  return pristine;
}
