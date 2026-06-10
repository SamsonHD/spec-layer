import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { extract } from '../src/extract';
import { renderSpec } from '../src/render';
import { parseFrontmatter } from '@spec-layer/format';
import button from './fixtures/button.json';
import type { SerializedNode } from '../src/tree';

describe('renderSpec', () => {
  const md = renderSpec(extract(button as SerializedNode, { figmaFile: 'FILE1' }), {
    prose: null, // degraded mode: no LLM
    extractedAt: '2026-06-10T00:00:00.000Z',
  });

  it('matches the golden file', () => {
    const golden = fs.readFileSync(new URL('./fixtures/button.golden.md', import.meta.url), 'utf8');
    expect(md).toBe(golden);
  });

  it('round-trips through the format parser with status draft', () => {
    const { frontmatter } = parseFrontmatter(md);
    expect(frontmatter.status).toBe('draft');
    expect(frontmatter.content_hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('judgment sections carry the draft marker', () => {
    for (const section of ['## Definition', '## Code', '## Accessibility', "## Do's & Don'ts"]) {
      const idx = md.indexOf(section);
      expect(md.slice(idx, idx + 200)).toContain('> ⚠️ Draft — AI-suggested, not yet approved.');
    }
  });
});
