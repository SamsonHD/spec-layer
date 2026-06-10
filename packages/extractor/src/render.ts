import type { IntermediateSpec } from './extract';
import { contentHash } from './hash';
import { serializeFrontmatter, type SpecFrontmatter } from '@spec-layer/format';

export interface ProseDrafts {
  definition: string;
  accessibility: string;
  dos: string[];
  donts: string[];
}

const DRAFT = `> ⚠️ Draft — AI-suggested, not yet approved.\n`;

export function renderSpec(
  spec: IntermediateSpec,
  opts: { prose: ProseDrafts | null; extractedAt: string },
): string {
  const fm: SpecFrontmatter = {
    spec_version: '0.1',
    status: 'draft',
    component: { name: spec.name, figma_key: spec.figmaKey, figma_file: spec.figmaFile, figma_node: spec.figmaNode },
    content_hash: contentHash(spec),
    extracted_at: opts.extractedAt,
  };
  const p = opts.prose;
  const lines: string[] = [
    `# ${spec.name}`,
    '',
    '## Definition', '', DRAFT, p?.definition ?? '_To be written._', '',
    '## Anatomy', '',
    ...spec.anatomy.map((a) => `- **${a.name}** (${a.type.toLowerCase()})${a.nested ? ' — nested component' : ''}`), '',
    '## Configuration', '',
    '| Name | Kind | Options | Default |', '|---|---|---|---|',
    ...spec.props.map((pr) => `| ${pr.name} | ${pr.kind} | ${pr.options?.join(', ') ?? '—'} | ${pr.default ?? '—'} |`), '',
    '## Variants', '',
    ...spec.variants.map((v) => `- **${v.prop}**: ${v.values.join(' · ')}`), '',
    '## States', '', ...spec.states.map((s) => `- ${s}`), '',
    '## Tokens used', '',
    '| Part | Property | Token |', '|---|---|---|',
    ...spec.tokens.map((t) => `| ${t.part} | ${t.property} | \`${t.token}\` |`), '',
    '## Code', '', DRAFT, '_Import path, prop mapping, and usage example to be filled in._', '',
    '## Accessibility', '', DRAFT, p?.accessibility ?? '_To be written._', '',
    "## Do's & Don'ts", '', DRAFT,
    ...(p ? [...p.dos.map((d) => `- ✅ ${d}`), ...p.donts.map((d) => `- ❌ ${d}`)] : ['_To be written._']), '',
    '## Related atoms', '',
    ...(spec.related.length ? spec.related.map((r) => `- ${r}`) : ['_None._']), '',
  ];
  if (spec.gaps.length) {
    lines.push('## Extraction gaps', '', ...spec.gaps.map((g) => `- **${g.part}**: ${g.issue}`), '');
  }
  return serializeFrontmatter(fm, lines.join('\n'));
}
