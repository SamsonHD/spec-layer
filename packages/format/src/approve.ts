import { parseFrontmatter, serializeFrontmatter } from './frontmatter';

export const DRAFT_MARKER = '> ⚠️ Draft — AI-suggested, not yet approved.';

const JUDGMENT_SECTION_HEADINGS = new Set([
  'Definition',
  'Code',
  'Accessibility',
  "Do's & Don'ts",
]);

const DRAFT_MARKER_PATTERN = /^>\s*(?:\p{Extended_Pictographic}\uFE0F?\s*)?Draft\s+—\s+AI-suggested,\s+not yet approved\.\s*$/u;

export function approveSpec(markdown: string, approver: string): string {
  const { frontmatter, body } = parseFrontmatter(markdown);
  frontmatter.status = 'approved';
  frontmatter.approved_by = approver;

  const cleanedLines: string[] = [];
  let inJudgmentSection = false;

  for (const line of body.split('\n')) {
    const heading = /^##\s+(.+?)\s*$/.exec(line)?.[1];
    if (heading) {
      inJudgmentSection = JUDGMENT_SECTION_HEADINGS.has(heading);
      cleanedLines.push(line);
      continue;
    }
    if (inJudgmentSection && DRAFT_MARKER_PATTERN.test(line.trim())) continue;
    cleanedLines.push(line);
  }

  // Removing marker lines leaves their surrounding blank lines behind;
  // collapse any run of 3+ newlines back to a single blank line.
  const cleanedBody = cleanedLines.join('\n').replace(/\n{3,}/g, '\n\n');
  return serializeFrontmatter(frontmatter, cleanedBody);
}
