import type { SerializedNode } from './tree';
import { defaultVariant } from './anatomy';

export interface TokenBinding { part: string; property: string; token: string }
export interface Gap { part: string; issue: string }

function walk(node: SerializedNode, visit: (n: SerializedNode) => void): void {
  visit(node);
  node.children?.forEach((c) => walk(c, visit));
}

export function extractTokens(root: SerializedNode): TokenBinding[] {
  const out: TokenBinding[] = [];
  const seen = new Set<string>();
  walk(defaultVariant(root), (n) => {
    for (const b of n.bindings ?? []) {
      const key = `${n.name}\0${b.property}\0${b.token}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ part: n.name, property: b.property, token: b.token });
      }
    }
  });
  return out;
}

export function extractGaps(root: SerializedNode): Gap[] {
  const out: Gap[] = [];
  walk(defaultVariant(root), (n) => {
    if (n.hasUnboundPaint) out.push({ part: n.name, issue: 'hardcoded paint (no variable or style)' });
  });
  return out;
}
