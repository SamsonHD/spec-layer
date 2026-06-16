import { describe, expect, it } from 'vitest';
import { extract, contentHash } from '@spec-layer/extractor';
import type { SerializedNode } from '@spec-layer/extractor';
import {
  fingerprintNode,
  formatSyncSummaryLines,
  checkedSpecCount,
  type SyncCheckSummary,
} from '../src/ui/actions';
import button from '../../extractor/test/fixtures/button.json';

const buttonNode = button as unknown as SerializedNode;

describe('fingerprintNode', () => {
  it('returns the figma fields and a hash matching extract(node).contentHash', () => {
    const fileKey = 'FILEKEY123';
    const fp = fingerprintNode(buttonNode, fileKey);
    expect(fp).not.toBeNull();

    const spec = extract(buttonNode, { figmaFile: fileKey });
    expect(fp).toEqual({
      figmaKey: spec.figmaKey,
      figmaNode: spec.figmaNode,
      name: spec.name,
      contentHash: contentHash(spec),
    });
    expect(fp!.contentHash).toBe(contentHash(extract(buttonNode, { figmaFile: fileKey })));
  });

  it('returns null for a node with no stable key', () => {
    const keyless: SerializedNode = {
      id: '1:1',
      name: 'No Key',
      type: 'COMPONENT',
      visible: true,
      children: [],
    };
    expect(fingerprintNode(keyless, 'FILEKEY')).toBeNull();
  });

  it('returns null for a node with an empty-string key', () => {
    const emptyKey: SerializedNode = {
      id: '1:2',
      name: 'Empty Key',
      type: 'COMPONENT',
      visible: true,
      key: '',
      children: [],
    };
    expect(fingerprintNode(emptyKey, 'FILEKEY')).toBeNull();
  });
});

describe('formatSyncSummaryLines', () => {
  it('orders by urgency, omits zero counts, and appends the checked-against line', () => {
    const summary: SyncCheckSummary = { inSync: 9, drifted: 3, missingInFigma: 1, newInFigma: 5 };
    expect(formatSyncSummaryLines(summary)).toEqual([
      '⚠ 3 out of date',
      '⊘ 1 not found in Figma',
      '✓ 9 in sync',
      '＋ 5 in Figma aren\'t documented',
      'Checked against 13 saved specs.',
    ]);
  });

  it('drops every zero-count line but keeps the trailing total', () => {
    const summary: SyncCheckSummary = { inSync: 4, drifted: 0, missingInFigma: 0, newInFigma: 0 };
    expect(formatSyncSummaryLines(summary)).toEqual([
      '✓ 4 in sync',
      'Checked against 4 saved specs.',
    ]);
  });
});

describe('checkedSpecCount', () => {
  it('sums in-sync, drifted, and missing (not new-in-figma)', () => {
    expect(checkedSpecCount({ inSync: 9, drifted: 3, missingInFigma: 1, newInFigma: 5 })).toBe(13);
  });
});
