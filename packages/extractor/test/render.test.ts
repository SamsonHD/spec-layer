import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { extract } from '../src/extract';
import { renderSpec } from '../src/render';
import { parseFrontmatter } from '@spec-layer/format';
import button from './fixtures/button.json';
import type { SerializedNode } from '../src/tree';
import type { ProseDrafts } from '../src/prose/prompt';
import type { IntermediateSpec } from '../src/extract';

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

  it('slug sanitizes special chars in related-atoms links (bug 3)', () => {
    const spec: IntermediateSpec = {
      name: 'Chip', figmaKey: 'k', figmaFile: 'F', figmaNode: 'n',
      anatomy: [], props: [], variants: [], states: ['Default'],
      tokens: [], related: ['Padding=Square, Scale=1x'], gaps: [],
    };
    const md = renderSpec(spec, { prose: null, extractedAt: '2026-06-10T00:00:00.000Z' });
    expect(md).toContain('- [Padding=Square, Scale=1x](./padding-square-scale-1x.md)');
  });

  // I-2: slug must strip leading/trailing hyphens produced by names starting/ending with = or ,
  it('slug strips leading/trailing hyphens from names starting or ending with = or , (I-2)', () => {
    const spec: IntermediateSpec = {
      name: 'Test', figmaKey: 'k', figmaFile: 'F', figmaNode: 'n',
      anatomy: [], props: [], variants: [], states: ['Default'],
      tokens: [], related: ['=Edge,'], gaps: [],
    };
    const md = renderSpec(spec, { prose: null, extractedAt: '2026-06-10T00:00:00.000Z' });
    expect(md).toContain('- [=Edge,](./edge.md)');
  });

  it('injects prose drafts into judgment sections (still marked draft)', () => {
    const prose: ProseDrafts = {
      definition: 'A button triggers an action.',
      accessibility: 'Ensure a 44px target.',
      dos: ['Use one primary button per view'],
      donts: ['Do not use for navigation'],
    };
    const mdWithProse = renderSpec(extract(button as SerializedNode, { figmaFile: 'FILE1' }), {
      prose,
      extractedAt: '2026-06-10T00:00:00.000Z',
    });
    expect(mdWithProse).toContain('A button triggers an action.');
    expect(mdWithProse).toContain('Ensure a 44px target.');
    expect(mdWithProse).toContain('- ✅ Use one primary button per view');
    expect(mdWithProse).toContain('- ❌ Do not use for navigation');
    // still a draft until approved
    expect(mdWithProse).toContain('> ⚠️ Draft — AI-suggested, not yet approved.');
  });
});
