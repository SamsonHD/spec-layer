import YAML from 'yaml';
import type { SpecFrontmatter, SpecStatus } from './types';

const STATUSES: SpecStatus[] = ['draft', 'approved', 'deprecated'];

export function serializeFrontmatter(fm: SpecFrontmatter, body: string): string {
  return `---\n${YAML.stringify(fm)}---\n\n${body}`;
}

export function parseFrontmatter(md: string): { frontmatter: SpecFrontmatter; body: string } {
  const m = md.match(/^---\n([\s\S]*?)\n---\n*/);
  if (!m) throw new Error('Missing YAML frontmatter');
  const fm = YAML.parse(m[1]) as SpecFrontmatter;
  if (!STATUSES.includes(fm.status)) throw new Error(`Invalid status: ${fm.status}`);
  if (!fm.component?.name || !fm.component?.figma_key) throw new Error('Missing component identity');
  if (!fm.content_hash) throw new Error('Missing content_hash');
  return { frontmatter: fm, body: md.slice(m[0].length) };
}
