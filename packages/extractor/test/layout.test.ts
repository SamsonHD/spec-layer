import { describe, it, expect } from 'vitest';
import { extractLayout } from '../src/layout';
import button from './fixtures/button.json';
import type { SerializedNode } from '../src/tree';

describe('extractLayout', () => {
  it('summarizes layout values per part from the default variant', () => {
    expect(extractLayout(button as SerializedNode)).toEqual([
      { part: 'container', summary: 'horizontal, padding 10/24/10/24, gap 8' },
    ]);
  });

  it('returns an empty list when no layout data exists', () => {
    const bare: SerializedNode = { id: '1', name: 'X', type: 'COMPONENT', visible: true };
    expect(extractLayout(bare)).toEqual([]);
  });
});
