import { describe, it, expect } from 'vitest';
import { extractAnatomy } from '../src/anatomy';
import button from './fixtures/button.json';
import type { SerializedNode } from '../src/tree';

describe('extractAnatomy', () => {
  const result = extractAnatomy(button as SerializedNode);

  it('lists visible named parts of the default variant', () => {
    expect(result.parts.map((p) => p.name)).toEqual(['container', 'label', 'icon']);
  });

  it('marks instances as nested and surfaces them as related atoms', () => {
    expect(result.parts.find((p) => p.name === 'icon')?.nested).toBe(true);
    expect(result.related).toEqual(['Icon']);
  });

  it('excludes invisible layers', () => {
    expect(result.parts.find((p) => p.name === 'debug-overlay')).toBeUndefined();
  });
});
