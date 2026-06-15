/**
 * File-level orchestration for AI-filling a spec's guideline sections.
 *
 * Resolves the stored extraction + (optionally) the component's Figma image,
 * drafts prose with Haiku, merges it into the empty/targeted guideline sections,
 * and writes the file back leaving frontmatter untouched. Dependencies (API key,
 * fetcher, cache, image resolver) are injected so the orchestration is testable
 * without network access; the route wires the real implementations.
 */

import fs from "node:fs";
import path from "node:path";
import {
  draftProse,
  type CacheStore,
  type IntermediateSpec,
} from "@spec-layer/extractor";
import { getContentDir } from "./config";
import { readStoredSpec } from "./specWriter";
import { splitFrontmatter } from "./sectionEditFile";
import { fillGuidelines } from "./guidelineFill";

/** No `.spec-data` sidecar for this slug — the spec can't be enriched. */
export class NoStoredSpecError extends Error {
  constructor() {
    super("No stored extraction for this spec; re-import from the plugin to enable AI fill.");
    this.name = "NoStoredSpecError";
  }
}

/** No Anthropic API key configured. */
export class NoApiKeyError extends Error {
  constructor() {
    super("No Anthropic API key configured; add one in Settings to use AI fill.");
    this.name = "NoApiKeyError";
  }
}

/** The markdown changed while the provider request was in flight. */
export class StaleSpecError extends Error {
  constructor() {
    super("Spec changed since AI generation started; refresh and try again.");
    this.name = "StaleSpecError";
  }
}

export interface EnrichDeps {
  apiKey: string | null;
  fetcher: typeof fetch;
  cacheStore: CacheStore;
  /** Resolve a rendered image URL for the spec, or null for a text-only draft. */
  resolveImageUrl: (spec: IntermediateSpec) => Promise<string | null>;
  /** Build a shared resolver after fetching images for several specs in batches. */
  resolveImageUrls?: (
    specs: IntermediateSpec[],
  ) => Promise<(spec: IntermediateSpec) => Promise<string | null>>;
}

export interface EnrichOptions {
  /** `"empty"` (default) fills placeholders; a heading regenerates that section. */
  target?: "empty" | string;
}

export interface EnrichResult {
  /** Guideline headings whose content was (re)written. */
  filled: string[];
  /** Whether a Figma image was attached to the model request. */
  usedVisual: boolean;
}

export async function enrichSpecFile(
  slug: string[],
  opts: EnrichOptions,
  deps: EnrichDeps,
): Promise<EnrichResult> {
  const filePath = path.join(getContentDir(), ...slug) + ".md";
  if (!fs.existsSync(filePath)) throw new Error("Component not found");
  const raw = fs.readFileSync(filePath, "utf-8");
  const { frontmatter, body } = splitFrontmatter(raw);

  const spec = readStoredSpec(slug);
  if (!spec) throw new NoStoredSpecError();

  if (!deps.apiKey) throw new NoApiKeyError();

  // Image is best-effort context: any failure (no token, Figma error, network)
  // degrades to a text-only draft rather than failing the whole enrichment.
  let imageUrl: string | null = null;
  try {
    imageUrl = await deps.resolveImageUrl(spec);
  } catch {
    imageUrl = null;
  }

  const prose = await draftProse(spec, {
    apiKey: deps.apiKey,
    fetcher: deps.fetcher,
    cacheStore: deps.cacheStore,
    imageUrl,
    bypassCache: opts.target !== undefined && opts.target !== "empty",
  });
  // draftProse only returns null when the key is missing, which we guarded above.
  if (!prose) throw new NoApiKeyError();

  const { body: newBody, filled } = fillGuidelines(body, prose, { target: opts.target });

  if (filled.length > 0) {
    if (fs.readFileSync(filePath, "utf-8") !== raw) throw new StaleSpecError();
    const next = frontmatter ? `${frontmatter}\n\n${newBody}\n` : `${newBody}\n`;
    fs.writeFileSync(filePath, next, "utf-8");
  }

  return { filled, usedVisual: imageUrl !== null };
}
