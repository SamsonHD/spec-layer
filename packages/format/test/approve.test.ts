import { describe, expect, it } from 'vitest';
import { approveSpec, DRAFT_MARKER } from '../src/approve';
import { parseFrontmatter, serializeFrontmatter } from '../src/frontmatter';
import type { SpecFrontmatter } from '../src/types';

const baseFrontmatter: SpecFrontmatter = {
  spec_version: '0.1',
  status: 'draft',
  component: {
    name: 'Button',
    figma_key: 'abc123',
    figma_file: 'FILE1',
    figma_node: '1:23',
  },
  content_hash: 'deadbeef',
  extracted_at: '2026-06-10T00:00:00.000Z',
};

describe('approveSpec', () => {
  it('approves frontmatter and strips judgment draft markers', () => {
    const body = [
      '## Definition',
      '',
      DRAFT_MARKER,
      '',
      'Definition text.',
      '',
      '## Anatomy',
      '',
      '- Container',
      '',
      '## Code',
      '',
      '> 🚧 Draft — AI-suggested, not yet approved.',
      '',
      '```tsx',
      "import { Button } from '@acme/ui';",
      '```',
      '',
      '## Accessibility',
      '',
      DRAFT_MARKER,
      '',
      '- Uses button semantics.',
      '',
      "## Do's & Don'ts",
      '',
      DRAFT_MARKER,
      '',
      '- ✅ Keep labels short.',
      '',
      '## Related atoms',
      '',
      'None.',
      '',
    ].join('\n');
    const markdown = serializeFrontmatter(baseFrontmatter, body);

    const approved = approveSpec(markdown, 'Reviewer');
    const parsed = parseFrontmatter(approved);

    expect(parsed.frontmatter.status).toBe('approved');
    expect(parsed.frontmatter.approved_by).toBe('Reviewer');
    expect(parsed.body).not.toContain('Draft — AI-suggested, not yet approved.');
    expect(parsed.body).toContain('## Anatomy\n\n- Container');
    expect(parsed.body).toContain('## Code');
    expect(parsed.body).toContain("import { Button } from '@acme/ui';");
  });

  it('collapses the blank lines left behind by stripped markers', () => {
    const body = [
      '## Definition',
      '',
      DRAFT_MARKER,
      '',
      'Definition text.',
      '',
    ].join('\n');
    const markdown = serializeFrontmatter(baseFrontmatter, body);

    const approved = approveSpec(markdown, 'Reviewer');
    const parsed = parseFrontmatter(approved);

    expect(approved).not.toContain('\n\n\n');
    expect(parsed.body).toContain('## Definition\n\nDefinition text.');
  });

  it('preserves draft-marker-like lines in non-judgment sections', () => {
    const body = [
      '## Definition',
      '',
      DRAFT_MARKER,
      '',
      'Definition text.',
      '',
      '## Anatomy',
      '',
      DRAFT_MARKER,
      '',
      '- Container',
      '',
    ].join('\n');
    const markdown = serializeFrontmatter(baseFrontmatter, body);

    const approved = approveSpec(markdown, 'Reviewer');
    const parsed = parseFrontmatter(approved);

    // Judgment section (Definition) is stripped…
    expect(parsed.body).toContain('## Definition\n\nDefinition text.');
    // …but the same line in a non-judgment section (Anatomy) survives.
    expect(parsed.body).toContain(`## Anatomy\n\n${DRAFT_MARKER}\n\n- Container`);
    expect(approved).not.toContain('\n\n\n');
  });
});
