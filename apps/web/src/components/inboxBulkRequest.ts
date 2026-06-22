interface InboxItem {
  name: string;
  slug: string[];
}

export interface InboxBulkFailure {
  source: string[];
  error: string;
}

export interface MoveAllResponse {
  ok?: boolean;
  saved?: string[][];
  failures?: InboxBulkFailure[];
  error?: string;
}

export interface EnrichedEntry {
  slug: string[];
  filled: string[];
  usedVisual: boolean;
}

export interface EnrichAllResponse {
  ok?: boolean;
  enriched?: EnrichedEntry[];
  failures?: InboxBulkFailure[];
  error?: string;
}

/** Map server failures back to component display names for a readable summary. */
export function formatBulkFailures(
  failures: InboxBulkFailure[],
  items: InboxItem[],
): string[] {
  const names = new Map(items.map((item) => [item.slug.join("/"), item.name]));
  return failures.map((failure) => {
    const fallback = failure.source.at(-1) ?? "Component";
    return `${names.get(failure.source.join("/")) ?? fallback}: ${failure.error}`;
  });
}

/** Best-effort bulk save of the given inbox slugs into a destination folder. */
export async function moveInboxItems(
  slugs: string[][],
  folder: string,
): Promise<{ httpOk: boolean; data: MoveAllResponse }> {
  const response = await fetch("/api/specs/move-all", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, items: slugs }),
  });
  return { httpOk: response.ok, data: (await response.json()) as MoveAllResponse };
}

/** Best-effort bulk AI guideline fill for the given inbox slugs. */
export async function enrichInboxItems(
  slugs: string[][],
): Promise<{ httpOk: boolean; data: EnrichAllResponse }> {
  const response = await fetch("/api/specs/enrich-all", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: slugs }),
  });
  return { httpOk: response.ok, data: (await response.json()) as EnrichAllResponse };
}
