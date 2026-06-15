/**
 * Bulk AI-fill of every imported component in the inbox. Mirrors the shape of
 * `saveAllInboxSpecs`: validates the items list, then enriches it with bounded
 * concurrency, isolating per-item failures so a single bad spec (e.g. one
 * without a stored extraction) never aborts the whole batch.
 */

import { isSafeSlug } from "./specApi";
import { enrichSpecFile, type EnrichDeps } from "./guidelineFillFile";
import { readStoredSpec } from "./specWriter";

export interface InboxEnrichResult {
  enriched: Array<{ slug: string[]; filled: string[]; usedVisual: boolean }>;
  failures: Array<{ source: string[]; error: string }>;
}

/** An item must be a safe slug of exactly `["_inbox", "<name>"]`. */
function isInboxSlug(value: unknown): value is string[] {
  return isSafeSlug(value) && value.length === 2 && value[0] === "_inbox";
}

export async function enrichInboxSpecs(
  items: unknown,
  deps: EnrichDeps,
): Promise<InboxEnrichResult> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Items must be a non-empty array");
  }
  const itemList: unknown[] = items;

  let itemDeps = deps;
  if (deps.resolveImageUrls) {
    const specs = itemList
      .filter(isInboxSlug)
      .map((item) => readStoredSpec(item))
      .filter((spec) => spec !== null);
    if (specs.length > 0) {
      try {
        const resolveImageUrl = await deps.resolveImageUrls(specs);
        itemDeps = { ...deps, resolveImageUrl };
      } catch {
        // Keep the per-item resolver as a best-effort fallback.
      }
    }
  }

  type Outcome =
    | { kind: "enriched"; value: InboxEnrichResult["enriched"][number] }
    | { kind: "failure"; value: InboxEnrichResult["failures"][number] };
  const outcomes = new Array<Outcome>(itemList.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < itemList.length) {
      const index = nextIndex++;
      const item = itemList[index];
      const source = Array.isArray(item)
        ? item.filter((part): part is string => typeof part === "string")
        : [];
      if (!isInboxSlug(item)) {
        outcomes[index] = {
          kind: "failure",
          value: { source, error: "Item must be a component directly inside _inbox" },
        };
        continue;
      }
      try {
        const { filled, usedVisual } = await enrichSpecFile(
          item,
          { target: "empty" },
          itemDeps,
        );
        outcomes[index] = {
          kind: "enriched",
          value: { slug: item, filled, usedVisual },
        };
      } catch (error) {
        outcomes[index] = {
          kind: "failure",
          value: {
            source: item,
            error: error instanceof Error ? error.message : "Failed to enrich spec",
          },
        };
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(4, itemList.length) }, () => worker()),
  );

  const enriched: InboxEnrichResult["enriched"] = [];
  const failures: InboxEnrichResult["failures"] = [];
  for (const outcome of outcomes) {
    if (outcome.kind === "enriched") enriched.push(outcome.value);
    else failures.push(outcome.value);
  }

  return { enriched, failures };
}
