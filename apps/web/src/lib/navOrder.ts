import fs from "node:fs";
import path from "node:path";

/**
 * Persisted sidebar ordering.
 *
 * The content folder has no inherent order, so drag-to-reorder is recorded in a
 * single git-trackable manifest at the content root (`.ds-nav.json`). It maps a
 * parent key (slug segments joined by "/", root = "") to the ordered list of its
 * child segment names. Children not listed fall back to the default order
 * (folders first, then alphabetical) after the listed ones.
 *
 * The mutation helpers below are pure (they take and return the manifest object)
 * so they can be unit-tested without the filesystem; the routes read → mutate →
 * write.
 */
export type NavOrder = Record<string, string[]>;

const MANIFEST = ".ds-nav.json";

export function navOrderPath(contentDir: string): string {
  return path.join(contentDir, MANIFEST);
}

export function readNavOrder(contentDir: string): NavOrder {
  try {
    const raw = fs.readFileSync(navOrderPath(contentDir), "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const out: NavOrder = {};
      for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
        if (Array.isArray(v)) out[k] = v.filter((s): s is string => typeof s === "string");
      }
      return out;
    }
  } catch {
    /* missing or malformed manifest → no explicit order */
  }
  return {};
}

export function writeNavOrder(contentDir: string, order: NavOrder): void {
  fs.writeFileSync(navOrderPath(contentDir), JSON.stringify(order, null, 2) + "\n");
}

export function orderKey(slug: string[]): string {
  return slug.join("/");
}

function lastSeg(slug: string[]): string {
  return slug[slug.length - 1];
}

/** Replace a parent's full ordered child list (used by within-parent reorder). */
export function reorderParent(order: NavOrder, parentSlug: string[], segs: string[]): NavOrder {
  order[orderKey(parentSlug)] = segs;
  return order;
}

/** Drop a child from its parent's order list. */
export function removeChild(order: NavOrder, parentSlug: string[], seg: string): NavOrder {
  const k = orderKey(parentSlug);
  if (order[k]) order[k] = order[k].filter((s) => s !== seg);
  return order;
}

/**
 * Insert a child into its parent's order list. No-op when the parent isn't
 * pinned yet (so the new item simply takes its default-sorted position).
 */
export function addChild(order: NavOrder, parentSlug: string[], seg: string, index?: number): NavOrder {
  const k = orderKey(parentSlug);
  if (!order[k]) return order;
  const arr = order[k].filter((s) => s !== seg);
  const i = index == null ? arr.length : Math.max(0, Math.min(index, arr.length));
  arr.splice(i, 0, seg);
  order[k] = arr;
  return order;
}

/** Rename a child segment in its parent's order list (label/slug rename). */
export function renameChild(order: NavOrder, parentSlug: string[], oldSeg: string, newSeg: string): NavOrder {
  const k = orderKey(parentSlug);
  if (order[k]) order[k] = order[k].map((s) => (s === oldSeg ? newSeg : s));
  return order;
}

/**
 * Move every manifest entry under `fromSlug` to live under `toSlug` (folder
 * rename or move). Keys equal to or prefixed by the old slug are re-keyed.
 */
export function rekeyPrefix(order: NavOrder, fromSlug: string[], toSlug: string[]): NavOrder {
  const from = orderKey(fromSlug);
  const to = orderKey(toSlug);
  if (from === to) return order;
  for (const key of Object.keys(order)) {
    if (key === from) {
      order[to] = order[key];
      delete order[key];
    } else if (key.startsWith(from + "/")) {
      order[to + key.slice(from.length)] = order[key];
      delete order[key];
    }
  }
  return order;
}

/** Delete a node's own order entry and all of its descendant entries. */
export function deletePrefix(order: NavOrder, slug: string[]): NavOrder {
  const k = orderKey(slug);
  for (const key of Object.keys(order)) {
    if (key === k || key.startsWith(k + "/")) delete order[key];
  }
  return order;
}

/**
 * Sort sibling segments by the manifest, appending any not listed (in the order
 * given by `fallback`, typically the default folder-first/alphabetical sort).
 * Pure: returns a new array.
 */
export function applyOrder(order: NavOrder, parentSlug: string[], segs: string[], fallback: string[]): string[] {
  const want = order[orderKey(parentSlug)];
  if (!want || want.length === 0) return fallback.slice();
  const rank = (seg: string) => {
    const i = want.indexOf(seg);
    return i === -1 ? Infinity : i;
  };
  return segs.slice().sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    return fallback.indexOf(a) - fallback.indexOf(b);
  });
}

export { lastSeg };
