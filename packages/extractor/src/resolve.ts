import type { TokenRule } from './tokens';

export interface ResolvedToken {
  part: string;
  property: string;
  token: string;
}

/**
 * Filter token rules down to those that apply to a single variant identified
 * by `values` (axis -> selected value).
 *
 * A rule matches when, for every axis it conditions on, the variant's value
 * for that axis is listed in the rule's accepted values. An unconditioned
 * rule (empty `conditions`) matches every variant.
 */
export function resolveTokensForVariant(
  tokens: TokenRule[],
  values: Record<string, string>,
): ResolvedToken[] {
  return tokens
    .filter((rule) => matches(rule.conditions, values))
    .map(({ part, property, token }) => ({ part, property, token }));
}

function matches(conditions: Record<string, string[]>, values: Record<string, string>): boolean {
  for (const [axis, allowed] of Object.entries(conditions)) {
    const v = values[axis];
    if (v === undefined) return false;
    if (!allowed.includes(v)) return false;
  }
  return true;
}
