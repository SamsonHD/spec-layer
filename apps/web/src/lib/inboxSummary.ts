import type { ComponentDoc } from "./content";

export interface InboxUpdateTarget {
  /** Existing library spec this draft would update (matched by figma_key). */
  targetSlug: string[];
  targetName: string;
}

export interface InboxSummaryItem {
  name: string;
  slug: string[];
  issueCount: number;
  missingRequiredCount: number;
  /** Present when this draft re-extracts a component already in the library. */
  update?: InboxUpdateTarget;
}

export interface InboxSummary {
  total: number;
  withIssues: number;
  missingRequired: number;
  items: InboxSummaryItem[];
}

export function formatComponentCount(count: number): string {
  return `${count} ${count === 1 ? "component" : "components"}`;
}

/**
 * Build the inbox summary. When `libraryDocs` is supplied, an inbox draft whose
 * `figma_key` matches an existing (non-inbox) library spec is annotated with
 * that target so the UI can offer a section-preserving Update instead of a Save
 * that would collide.
 */
export function summarizeInbox(
  docs: ComponentDoc[],
  libraryDocs: ComponentDoc[] = [],
): InboxSummary {
  const targetByKey = new Map<string, ComponentDoc>();
  for (const doc of libraryDocs) {
    if (doc.slug[0] === "_inbox") continue;
    const key = doc.frontmatter.figmaKey;
    if (key && !targetByKey.has(key)) targetByKey.set(key, doc);
  }

  return {
    total: docs.length,
    withIssues: docs.filter((doc) => doc.issues.length > 0).length,
    missingRequired: docs.filter((doc) => doc.missingRequired.length > 0).length,
    items: docs
      .map((doc) => {
        const key = doc.frontmatter.figmaKey;
        const target = key ? targetByKey.get(key) : undefined;
        const item: InboxSummaryItem = {
          name: doc.frontmatter.name,
          slug: doc.slug,
          issueCount: doc.issues.length,
          missingRequiredCount: doc.missingRequired.length,
        };
        if (target) {
          item.update = { targetSlug: target.slug, targetName: target.frontmatter.name };
        }
        return item;
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}
