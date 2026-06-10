import { describe, it, expect } from 'vitest';
import { extractProps, extractVariants, extractStates } from '../src/props';
import button from './fixtures/button.json';
import chip from './fixtures/chip.json';
import type { SerializedNode } from '../src/tree';

const root = button as SerializedNode;

describe('props/variants/states', () => {
  it('extracts all property kinds', () => {
    const props = extractProps(root);
    expect(props).toContainEqual({ name: 'Style', kind: 'variant', options: ['Filled', 'Outlined'], default: 'Filled' });
    expect(props).toContainEqual({ name: 'Show icon', kind: 'boolean', options: undefined, default: false });
    expect(props.find((p) => p.name === 'Label')?.kind).toBe('text');
  });

  it('builds the variant matrix from variant props only', () => {
    expect(extractVariants(root)).toEqual([
      { prop: 'Style', values: ['Filled', 'Outlined'] },
      { prop: 'State', values: ['Enabled', 'Hovered', 'Disabled'] },
    ]);
  });

  it('derives states from a variant axis named State (case-insensitive)', () => {
    expect(extractStates(root)).toEqual(['Enabled', 'Hovered', 'Disabled']);
  });

  it('falls back to ["Default"] when no state axis exists', () => {
    const noState: SerializedNode = { ...root, propertyDefinitions: { Style: root.propertyDefinitions!['Style'] } };
    expect(extractStates(noState)).toEqual(['Default']);
  });

  it('recognises plural axis name "States" (bug 1)', () => {
    expect(extractStates(chip as SerializedNode)).toEqual(['Default', 'Hover', 'Focus', 'Press']);
  });
});
