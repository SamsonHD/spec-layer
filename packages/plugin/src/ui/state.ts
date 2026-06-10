import { parseFrontmatter, serializeFrontmatter } from '@spec-layer/format';

// ---------------------------------------------------------------------------
// Phase machine types
// ---------------------------------------------------------------------------

export type UiPhase = 'idle' | 'extracting' | 'drafting' | 'review' | 'approved';
export type UiEvent = 'selected' | 'rendered' | 'prose-done' | 'prose-failed' | 'approved';

// ---------------------------------------------------------------------------
// nextStatus — pure transition function
// ---------------------------------------------------------------------------

export function nextStatus(phase: UiPhase, event: UiEvent): UiPhase {
  if (phase === 'idle' && event === 'selected') return 'extracting';
  if (phase === 'extracting' && event === 'rendered') return 'drafting';
  if (phase === 'drafting' && (event === 'prose-done' || event === 'prose-failed')) return 'review';
  if (phase === 'review' && event === 'approved') return 'approved';
  return phase;
}

// ---------------------------------------------------------------------------
// The exact draft-marker line emitted by renderSpec in @spec-layer/extractor
// ---------------------------------------------------------------------------

const DRAFT_MARKER = '> ⚠️ Draft — AI-suggested, not yet approved.';

// ---------------------------------------------------------------------------
// approveSpec — flips frontmatter status, stamps approver, strips draft markers
// ---------------------------------------------------------------------------

export function approveSpec(md: string, approver: string): string {
  const { frontmatter, body } = parseFrontmatter(md);

  // Flip status + stamp approver
  frontmatter.status = 'approved';
  frontmatter.approved_by = approver;

  // Remove all lines that are exactly the draft marker
  const cleanedBody = body
    .split('\n')
    .filter((line) => line !== DRAFT_MARKER)
    .join('\n');

  return serializeFrontmatter(frontmatter, cleanedBody);
}
