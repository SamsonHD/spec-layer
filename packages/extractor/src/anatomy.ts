import type { SerializedNode } from './tree';

export interface AnatomyPart { name: string; type: string; nested: boolean }
export interface AnatomyResult { parts: AnatomyPart[]; related: string[] }

/** Default variant = first child of a COMPONENT_SET; a bare COMPONENT is its own default. */
export function defaultVariant(root: SerializedNode): SerializedNode {
  return root.type === 'COMPONENT_SET' && root.children?.length ? root.children[0] : root;
}

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
