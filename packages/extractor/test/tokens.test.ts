import { describe, it, expect } from 'vitest';
import { extractTokens, extractGaps, variantDelta } from '../src/tokens';
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

  it('emits qualified rows for bindings that differ from the default variant', () => {
    const tokens = extractTokens(root);
    // Hovered container fill differs from default → qualified row
    expect(tokens).toContainEqual(
      { part: 'container', property: 'fills (State=Hovered)', token: 'md.sys.color.primary-hover' },
    );
    // Outlined adds a stroke absent on the default → qualified row
    expect(tokens).toContainEqual(
      { part: 'container', property: 'strokes (Style=Outlined)', token: 'md.sys.color.outline' },
    );
    // Outlined label fill differs from default → qualified row
    expect(tokens).toContainEqual(
      { part: 'label', property: 'fills (Style=Outlined)', token: 'md.sys.color.primary' },
    );
  });

  it('skips variant bindings identical to the default (no noise rows)', () => {
    const tokens = extractTokens(root);
    // cornerRadius is the same token on every variant → only the unqualified row exists
    const radiusRows = tokens.filter((t) => t.property.startsWith('cornerRadius'));
    expect(radiusRows).toEqual([
      { part: 'container', property: 'cornerRadius', token: 'md.sys.shape.corner.full' },
    ]);
    // Hovered label fill matches the default → no "fills (State=Hovered)" row for label
    expect(tokens).not.toContainEqual(
      expect.objectContaining({ part: 'label', property: 'fills (State=Hovered)' }),
    );
  });

  it('variantDelta reports only the differing axes', () => {
    expect(variantDelta('Style=Filled, State=Enabled', 'Style=Filled, State=Hovered')).toBe('State=Hovered');
    expect(variantDelta('Style=Filled, State=Enabled', 'Style=Outlined, State=Hovered')).toBe('Style=Outlined, State=Hovered');
    // unparseable names fall back to the full variant name
    expect(variantDelta('Default', 'Fancy Variant')).toBe('Fancy Variant');
  });
});
