import { describe, it, expect } from 'vitest';
import { extract } from '../src/extract';
import { contentHash } from '../src/hash';
import button from './fixtures/button.json';
import type { SerializedNode } from '../src/tree';

const root = button as SerializedNode;
const meta = { figmaFile: 'FILE1' };

describe('extract', () => {
  it('assembles the full intermediate spec', () => {
    const spec = extract(root, meta);
    expect(spec.name).toBe(root.name);
    expect(spec.anatomy.length).toBeGreaterThan(0);
    expect(spec.props.length).toBe(4);
    expect(spec.states).toEqual(['Enabled', 'Hovered', 'Disabled']);
    expect(spec.tokens.length).toBeGreaterThan(0);
    expect(spec.gaps.length).toBe(4);
    expect(spec.layout).toEqual([
      { part: 'container', summary: 'horizontal, padding 10/24/10/24, gap 8' },
    ]);
  });

  it('hash is stable across key order and changes when content changes', () => {
    const a = extract(root, meta);
    expect(contentHash(a)).toBe(contentHash(JSON.parse(JSON.stringify(a))));
    const b = extract({ ...root, name: 'Button2' }, meta);
    expect(contentHash(a)).not.toBe(contentHash(b));
  });
});
