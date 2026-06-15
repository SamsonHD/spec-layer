/**
 * Read the AI prose draft(s) cached for a spec by `draftProse`.
 *
 * draftProse caches its result keyed by `prose:<content_hash>` (text-only) and
 * `prose:<content_hash>:img` (vision). We read both variants so the detail page
 * can tell whether a guideline section still holds the pristine AI draft (and so
 * decide whether to offer "Regenerate"). Missing or malformed entries are
 * skipped — this is a best-effort UI hint, never load-bearing.
 */

import {
  contentHash,
  parseProseResponse,
  type IntermediateSpec,
  type ProseDrafts,
} from "@spec-layer/extractor";
import { createSpecCache } from "./specCache";

export async function readCachedDrafts(spec: IntermediateSpec): Promise<ProseDrafts[]> {
  const cache = createSpecCache();
  const base = `prose:${contentHash(spec)}`;
  const drafts: ProseDrafts[] = [];

  for (const key of [base, `${base}:img`]) {
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
