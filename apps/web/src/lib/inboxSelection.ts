import type { InboxSummaryItem } from "./inboxSummary";

/** Stable identity for an inbox row, used as the selection key. */
export function itemKey(item: { slug: string[] }): string {
  return item.slug.join("/");
}

export type SelectAllState = "none" | "some" | "all";

/**
 * Header-checkbox state for the currently visible rows: `all` when every row is
 * selected, `some` for a partial (indeterminate) selection, `none` otherwise.
 */
export function getSelectAllState(
  items: InboxSummaryItem[],
  selected: ReadonlySet<string>,
): SelectAllState {
  if (items.length === 0) return "none";
  const count = items.reduce(
    (total, item) => (selected.has(itemKey(item)) ? total + 1 : total),
    0,
  );
  if (count === 0) return "none";
  return count === items.length ? "all" : "some";
}

/** Toggle a single key, returning a new set (never mutates the input). */
export function toggleKey(selected: ReadonlySet<string>, key: string): Set<string> {
  const next = new Set(selected);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

/** Add or remove every given row from the selection, returning a new set. */
export function setAll(
  selected: ReadonlySet<string>,
  items: InboxSummaryItem[],
  shouldSelect: boolean,
): Set<string> {
  const next = new Set(selected);
  for (const item of items) {
    const key = itemKey(item);
    if (shouldSelect) next.add(key);
    else next.delete(key);
  }
  return next;
}

/** Slugs for the selected rows, preserving the order of `items`. */
export function selectedSlugs(
  items: InboxSummaryItem[],
  selected: ReadonlySet<string>,
): string[][] {
  return items
    .filter((item) => selected.has(itemKey(item)))
    .map((item) => item.slug);
}
