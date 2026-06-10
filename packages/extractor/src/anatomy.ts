import type { SerializedNode } from './tree';

export interface AnatomyPart { name: string; type: string; nested: boolean }
export interface AnatomyResult { parts: AnatomyPart[]; related: string[] }

/** Default variant = first child of a COMPONENT_SET; a bare COMPONENT is its own default. */
export function defaultVariant(root: SerializedNode): SerializedNode {
  return root.type === 'COMPONENT_SET' && root.children?.length ? root.children[0] : root;
}

/**
 * Anatomy is intentionally a SHALLOW walk: it lists the component's primary
 * named parts (the direct, visible children of the default variant), matching
 * how design systems document anatomy. This differs by design from token/gap
 * extraction (tokens.ts), which walks the full tree because bindings live on
 * nested layers. The two depths are not meant to align.
 */
export function extractAnatomy(root: SerializedNode): AnatomyResult {
  const parts: AnatomyPart[] = [];
  const related = new Set<string>();
  for (const child of defaultVariant(root).children ?? []) {
    if (!child.visible) continue;
    const nested = child.type === 'INSTANCE';
    parts.push({ name: child.name, type: child.type, nested });
    if (nested && child.mainComponent) related.add(child.mainComponent.name);
  }
  return { parts, related: [...related] };
}
