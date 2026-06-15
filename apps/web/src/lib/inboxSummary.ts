import type { ComponentDoc } from "./content";

export interface InboxSummaryItem {
  name: string;
  slug: string[];
  issueCount: number;
  missingRequiredCount: number;
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

export function summarizeInbox(docs: ComponentDoc[]): InboxSummary {
  return {
    total: docs.length,
    withIssues: docs.filter((doc) => doc.issues.length > 0).length,
    missingRequired: docs.filter((doc) => doc.missingRequired.length > 0).length,
    items: docs
      .map((doc) => ({
        name: doc.frontmatter.name,
        slug: doc.slug,
        issueCount: doc.issues.length,
        missingRequiredCount: doc.missingRequired.length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}
