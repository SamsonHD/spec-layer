import type { SerializedNode } from './tree';
import { defaultVariant } from './anatomy';

export interface TokenBinding { part: string; property: string; token: string }
export interface Gap { part: string; issue: string }

function walk(node: SerializedNode, visit: (n: SerializedNode) => void): void {
  visit(node);
  node.children?.forEach((c) => walk(c, visit));
}

/** Parse "Style=Filled, State=Enabled" into { Style: 'Filled', State: 'Enabled' }; null if any segment is not Axis=Value. */
function parseVariantName(name: string): Record<string, string> | null {
  const out: Record<string, string> = {};
  for (const segment of name.split(',')) {
    const [axis, ...rest] = segment.split('=');
    if (!rest.length) return null;
    out[axis.trim()] = rest.join('=').trim();
  }
  return out;
}

/**
 * Human-readable delta between a variant and the default variant: only the
 * axes whose value differs, e.g. "State=Hovered". Falls back to the full
 * variant name when either name is not Axis=Value shaped.
 */
export function variantDelta(defaultName: string, variantName: string): string {
  const def = parseVariantName(defaultName);
  const cur = parseVariantName(variantName);
  if (!def || !cur) return variantName;
  const diffs = Object.entries(cur)
    .filter(([axis, value]) => def[axis] !== value)
    .map(([axis, value]) => `${axis}=${value}`);
  return diffs.length ? diffs.join(', ') : variantName;
}

export function extractTokens(root: SerializedNode): TokenBinding[] {
  const out: TokenBinding[] = [];
  const seen = new Set<string>();
  const push = (part: string, property: string, token: string) => {
    const key = `${part}\0${property}\0${token}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({ part, property, token });
    }
  };

  // Default variant: unqualified rows, and the baseline for diffing.
  const def = defaultVariant(root);
  const baseline = new Map<string, Set<string>>(); // "part\0property" -> tokens
  walk(def, (n) => {
    for (const b of n.bindings ?? []) {
      const key = `${n.name}\0${b.property}`;
      let tokens = baseline.get(key);
      if (!tokens) {
        tokens = new Set();
        baseline.set(key, tokens);
      }
      tokens.add(b.token);
      push(n.name, b.property, b.token);
    }
  });

  // Other variants: only bindings that differ from the baseline, qualified
  // with the axes that distinguish the variant, e.g. "fills (State=Hovered)".
  if (root.type !== 'COMPONENT_SET') return out;
  for (const variant of (root.children ?? []).slice(1)) {
    const delta = variantDelta(def.name, variant.name);
    walk(variant, (n) => {
      for (const b of n.bindings ?? []) {
        if (baseline.get(`${n.name}\0${b.property}`)?.has(b.token)) continue;
        push(n.name, `${b.property} (${delta})`, b.token);
      }
    });
  }
  return out;
}

/** Properties that indicate a TEXT node's typography is governed by a style or variable. */
const TYPOGRAPHY_PROPS = ['typography', 'fontSize', 'fontFamily', 'fontStyle', 'fontWeight', 'lineHeight', 'letterSpacing'];
/** Bound-variable property names that cover padding. */
const PADDING_PROPS = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'verticalPadding', 'horizontalPadding'];

export function extractGaps(root: SerializedNode): Gap[] {
  const out: Gap[] = [];
  walk(defaultVariant(root), (n) => {
    const bound = new Set((n.bindings ?? []).map((b) => b.property));
    if (n.hasUnboundPaint) {
      out.push({ part: n.name, issue: 'hardcoded color (no variable or style)' });
    }
    if (n.type === 'TEXT' && !TYPOGRAPHY_PROPS.some((p) => bound.has(p))) {
      out.push({ part: n.name, issue: 'no text style or typography variable' });
    }
    const l = n.layout;
    if (!l) return;
    if (l.itemSpacing !== undefined && !bound.has('itemSpacing')) {
      out.push({ part: n.name, issue: `hardcoded itemSpacing (${l.itemSpacing}px)` });
    }
    if (l.cornerRadius !== undefined && !bound.has('cornerRadius') && !bound.has('topLeftRadius')) {
      out.push({ part: n.name, issue: `hardcoded cornerRadius (${l.cornerRadius}px)` });
    }
    const pads = [l.paddingTop, l.paddingRight, l.paddingBottom, l.paddingLeft];
    if (pads.some((p) => p !== undefined) && !PADDING_PROPS.some((p) => bound.has(p))) {
      out.push({ part: n.name, issue: 'hardcoded padding' });
    }
  });
  return out;
}
