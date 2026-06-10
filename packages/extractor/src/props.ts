import type { SerializedNode } from './tree';

export type PropKind = 'variant' | 'boolean' | 'text' | 'instanceSwap';

export interface ComponentProp {
  name: string;
  kind: PropKind;
  options?: string[];
  default?: string | boolean;
}

export interface VariantAxis {
  prop: string;
  values: string[];
}

const KIND_MAP: Record<string, PropKind> = {
  VARIANT: 'variant',
  BOOLEAN: 'boolean',
  TEXT: 'text',
  INSTANCE_SWAP: 'instanceSwap',
};

/** Figma encodes non-variant prop names as "Name#nodeId:n" — strip the suffix. */
const cleanName = (raw: string) => raw.split('#')[0];

export function extractProps(root: SerializedNode): ComponentProp[] {
  return Object.entries(root.propertyDefinitions ?? {}).map(([raw, def]) => ({
    name: cleanName(raw),
    kind: KIND_MAP[def.type],
    options: def.variantOptions,
    default: def.defaultValue,
  }));
}

export function extractVariants(root: SerializedNode): VariantAxis[] {
  return extractProps(root)
    .filter((p) => p.kind === 'variant')
    .map((p) => ({ prop: p.name, values: p.options ?? [] }));
}

export function extractStates(root: SerializedNode): string[] {
  const axis = extractVariants(root).find((v) => v.prop.toLowerCase() === 'state');
  return axis?.values.length ? axis.values : ['Default'];
}
