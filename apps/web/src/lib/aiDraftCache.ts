/**
 * Read the AI prose draft(s) cached for a spec by `draftProse`.
 *
 * draftProse caches its result under `proseCacheKey(spec)` (text-only) and
 * `proseCacheKey(spec, { image: true })` (vision) — a versioned key shared with
 * the writer so a prompt change never serves a stale draft. We read both so the detail page
 * can tell whether a guideline section still holds the pristine AI draft (and so
 * decide whether to offer "Regenerate"). Missing or malformed entries are
 * skipped — this is a best-effort UI hint, never load-bearing.
 */

import {
  parseProseResponse,
  proseCacheKey,
  type IntermediateSpec,
  type ProseDrafts,
} from "@spec-layer/extractor";
import { createSpecCache } from "./specCache";

export async function readCachedDrafts(spec: IntermediateSpec): Promise<ProseDrafts[]> {
  const cache = createSpecCache();
  const drafts: ProseDrafts[] = [];

  for (const key of [proseCacheKey(spec), proseCacheKey(spec, { image: true })]) {
    const hit = await cache.get(key);
    if (!hit) continue;
    try {
      drafts.push(parseProseResponse(hit));
    } catch {
      // ignore malformed cache entries
    }
  }

  return drafts;
}
