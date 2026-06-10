import { describe, it, expect } from 'vitest';
import { approveSpec, nextStatus, type UiPhase } from '../src/ui/state';

const draft = `---
spec_version: "0.1"
status: draft
component:
  name: Button
  figma_key: k
  figma_file: f
  figma_node: "1:1"
content_hash: abc
extracted_at: "2026-06-10T00:00:00.000Z"
---

## Definition

> ⚠️ Draft — AI-suggested, not yet approved.

A button.
`;

describe('approveSpec', () => {
  it('flips status, stamps approver, strips draft markers', () => {
    const approved = approveSpec(draft, 'Alex');
    expect(approved).toContain('status: approved');
    expect(approved).toContain('approved_by: Alex');
    expect(approved).not.toContain('⚠️ Draft');
  });

  it('leaves body content intact apart from the marker line', () => {
    const approved = approveSpec(draft, 'Alex');
    expect(approved).toContain('## Definition');
    expect(approved).toContain('A button.');
  });
});

describe('nextStatus', () => {
  it('advances the phase machine', () => {
    expect(nextStatus('idle', 'selected')).toBe('extracting');
    expect(nextStatus('extracting', 'rendered')).toBe('drafting');
    expect(nextStatus('drafting', 'prose-done')).toBe('review');
    expect(nextStatus('drafting', 'prose-failed')).toBe('review'); // degraded still reviewable
    expect(nextStatus('review', 'approved')).toBe('approved');
  });
});
