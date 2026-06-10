import type { SerializedNode } from './tree';
import { extractAnatomy, type AnatomyPart } from './anatomy';
import { extractProps, extractVariants, extractStates, type ComponentProp, type VariantAxis } from './props';
import { extractTokens, extractGaps, type TokenBinding, type Gap } from './tokens';
import { extractLayout, type LayoutSummary } from './layout';

export interface IntermediateSpec {
  name: string;
  figmaKey: string;
  figmaFile: string;
  figmaNode: string;
  anatomy: AnatomyPart[];
  props: ComponentProp[];
  variants: VariantAxis[];
  states: string[];
  tokens: TokenBinding[];
  related: string[];
  gaps: Gap[];
  layout: LayoutSummary[];
}

export function extract(root: SerializedNode, meta: { figmaFile: string }): IntermediateSpec {
  const { parts, related } = extractAnatomy(root);
  return {
    name: root.name,
    figmaKey: root.key ?? '',
    figmaFile: meta.figmaFile,
    figmaNode: root.id,
    anatomy: parts,
    props: extractProps(root),
    variants: extractVariants(root),
    states: extractStates(root),
    tokens: extractTokens(root),
    related,
    gaps: extractGaps(root),
    layout: extractLayout(root),
  };
}
