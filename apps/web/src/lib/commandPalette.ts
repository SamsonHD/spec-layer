/**
 * Pure helpers for the ⌘K command palette.
 *
 * Kept free of React/DOM so the matching/ranking logic can be unit-tested in
 * isolation. The palette UI (CommandPalette.tsx) is a thin shell over these.
 */

export interface CommandItem {
  /** Slug segments, e.g. ["forms", "button"] → /components/forms/button */
  slug: string[];
  /** Display name (frontmatter name). */
  name: string;
  /** Human path shown under the name, e.g. "forms / button". */
  path: string;
}

/**
 * Filter + rank components against a query.
 *
 * - Empty/whitespace query returns all items in their original order.
 * - Matching is case-insensitive against both name and path.
 * - Ranking, best first: name starts-with > name contains > path contains.
 *   Ties keep the input order (stable).
 */
export function filterCommandItems<T extends CommandItem>(items: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items.slice();

  const scored: { item: T; rank: number; index: number }[] = [];
  items.forEach((item, index) => {
    const name = item.name.toLowerCase();
    const path = item.path.toLowerCase();
    let rank = -1;
    if (name.startsWith(q)) rank = 0;
    else if (name.includes(q)) rank = 1;
    else if (path.includes(q)) rank = 2;
    if (rank >= 0) scored.push({ item, rank, index });
  });

  scored.sort((a, b) => (a.rank - b.rank) || (a.index - b.index));
  return scored.map((s) => s.item);
}
