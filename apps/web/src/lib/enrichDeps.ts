/**
 * Wires the real (network-backed) dependencies for `enrichSpecFile`: the
 * Anthropic key, fetch, the filesystem prose cache, and a Figma image resolver.
 * Kept out of `guidelineFillFile.ts` so that module stays unit-testable with
 * injected fakes and never imports network code.
 */

import type { IntermediateSpec } from "@spec-layer/extractor";
import { getAnthropicKey } from "./settings";
import { createSpecCache } from "./specCache";
import { getFigmaImages, previewFromRef } from "./figma";
import type { EnrichDeps } from "./guidelineFillFile";

/** Sentinel the plugin emits when figma.fileKey is unavailable — never call the API for it. */
const UNKNOWN_FILE_KEY = "unknown";

function imageKey(spec: IntermediateSpec): string | null {
  if (!spec.figmaFile || spec.figmaFile === UNKNOWN_FILE_KEY || !spec.figmaNode) {
    return null;
  }
  return JSON.stringify([spec.figmaFile, spec.figmaNode]);
}

async function resolveImageUrl(spec: IntermediateSpec): Promise<string | null> {
  if (!spec.figmaFile || spec.figmaFile === UNKNOWN_FILE_KEY || !spec.figmaNode) {
    return null;
  }
  const preview = await previewFromRef({ fileKey: spec.figmaFile, nodeId: spec.figmaNode });
  return preview.status === "ok" && preview.imageUrl ? preview.imageUrl : null;
}

export async function createBatchImageResolver(
  specs: IntermediateSpec[],
  fetchImages: typeof getFigmaImages = getFigmaImages,
): Promise<(spec: IntermediateSpec) => Promise<string | null>> {
  const nodesByFile = new Map<string, Set<string>>();
  for (const spec of specs) {
    if (!imageKey(spec)) continue;
    const nodes = nodesByFile.get(spec.figmaFile) ?? new Set<string>();
    nodes.add(spec.figmaNode);
    nodesByFile.set(spec.figmaFile, nodes);
  }

  const images = new Map<string, string>();
  await Promise.all(
    [...nodesByFile.entries()].map(async ([fileKey, nodeSet]) => {
      const nodeIds = [...nodeSet];
      try {
        const result = await fetchImages(fileKey, nodeIds);
        if (result.status !== "ok" || !result.images) return;
        for (const nodeId of nodeIds) {
          const imageUrl = result.images[nodeId];
          if (imageUrl) images.set(JSON.stringify([fileKey, nodeId]), imageUrl);
        }
      } catch {
        // A failed file batch degrades those components to text-only enrichment.
      }
    }),
  );

  return async (spec) => {
    const key = imageKey(spec);
    return key ? images.get(key) ?? null : null;
  };
}

export function createEnrichDeps(): EnrichDeps {
  return {
    apiKey: getAnthropicKey() ?? null,
    fetcher: fetch,
    cacheStore: createSpecCache(),
    resolveImageUrl,
    resolveImageUrls: createBatchImageResolver,
  };
}
