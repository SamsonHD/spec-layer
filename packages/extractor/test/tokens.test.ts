import { describe, it, expect } from 'vitest';
import { extractTokens, extractGaps } from '../src/tokens';
import button from './fixtures/button.json';
import chip from './fixtures/chip.json';
import type { SerializedNode } from '../src/tree';

const root = button as SerializedNode;

describe('tokens', () => {
  it('collects bindings per part across the default variant', () => {
    expect(extractTokens(root)).toContainEqual(
      { part: 'container', property: 'fills', token: 'md.sys.color.primary' },
    );
    expect(extractTokens(root)).toContainEqual(
      { part: 'label', property: 'fills', token: 'md.sys.color.on-primary' },
    );
  });

  it('reports unbound paints as gaps, including on invisible layers', () => {
    expect(extractGaps(root)).toContainEqual(
      { part: 'debug-overlay', issue: 'hardcoded paint (no variable or style)' },
    );
  });

  it('deduplicates identical (part, property, token) tuples (bug 4)', () => {
    const tokens = extractTokens(chip as SerializedNode);
    const iconFills = tokens.filter((t) => t.part === 'icon' && t.property === 'fills');
    expect(iconFills).toHaveLength(1);
  });
});
