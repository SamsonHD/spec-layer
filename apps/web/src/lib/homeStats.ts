import type { ComponentDoc, Status } from "@/lib/content";

export interface StatusCount {
  status: Status;
  count: number;
}

export interface HomeStats {
  /** Documented components, excluding anything still sitting in the inbox. */
  total: number;
  /** Counts per status, ordered, only for statuses that actually appear. */
  byStatus: StatusCount[];
  /** Components missing one or more required sections. */
  needsAttention: number;
  /** Components still pending in the inbox. */
  inbox: number;
}

// Display order for status chips; statuses with a zero count are dropped.
const STATUS_ORDER: Status[] = ["approved", "stable", "beta", "draft", "deprecated"];

/**
 * Derives the homepage metric-card numbers from the full doc set. Inbox docs
 * (slug[0] === "_inbox") are counted separately and excluded from every other
 * metric, matching how the rest of the app treats the inbox.
 */
export function getHomeStats(docs: ComponentDoc[]): HomeStats {
  const live = docs.filter((doc) => doc.slug[0] !== "_inbox");

  const counts = new Map<Status, number>();
  let needsAttention = 0;
  for (const doc of live) {
    const status = doc.frontmatter.status;
    if (status) counts.set(status, (counts.get(status) ?? 0) + 1);
    if (doc.missingRequired.length > 0) needsAttention += 1;
  }

  const byStatus = STATUS_ORDER.filter((s) => counts.has(s)).map((status) => ({
    status,
    count: counts.get(status) as number,
  }));

  return {
    total: live.length,
    byStatus,
    needsAttention,
    inbox: docs.filter((doc) => doc.slug[0] === "_inbox").length,
  };
}
