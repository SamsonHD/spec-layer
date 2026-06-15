import type { InboxSummaryItem } from "./inboxSummary";

export type InboxItemState = "ready" | "attention";

export function getInboxItemState(item: InboxSummaryItem): InboxItemState {
  return item.issueCount > 0 || item.missingRequiredCount > 0 ? "attention" : "ready";
}

export function filterInboxItems(
  items: InboxSummaryItem[],
  query: string,
): InboxSummaryItem[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return items.filter((item) => {
    if (!normalizedQuery) return true;

    const searchable = `${item.name} ${item.slug.slice(1).join("/")}`.toLocaleLowerCase();
    return searchable.includes(normalizedQuery);
  });
}
