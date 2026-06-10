import { describe, it, expect } from 'vitest';
import { extractAnatomy } from '../src/anatomy';
import button from './fixtures/button.json';
import chip from './fixtures/chip.json';
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

describe('extractAnatomy — single-wrapper descent (bug 2)', () => {
  const chipResult = extractAnatomy(chip as SerializedNode);

  it('does not list the sole wrapper frame as a part', () => {
    expect(chipResult.parts.map((p) => p.name)).not.toContain('Contents');
  });

  it('lists the parts inside the wrapper frame', () => {
    const names = chipResult.parts.map((p) => p.name);
    expect(names).toContain('icon');
    expect(names).toContain('Label');
  });

  it('collects related atoms from inside the wrapper', () => {
    expect(chipResult.related).toEqual(['Icon']);
  });
});
