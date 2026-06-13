import { describe, it, expect } from 'vitest';
import { parseFigmaFileKey } from '../src/ui/fileKey';
import { effectiveFileKey } from '../src/fileKey';

describe('parseFigmaFileKey', () => {
  it('extracts the key from figma.com URLs', () => {
    expect(parseFigmaFileKey('https://www.figma.com/design/AbC123xyz789/My-File?node-id=1-2'))
      .toBe('AbC123xyz789');
    expect(parseFigmaFileKey('https://www.figma.com/file/AbC123xyz789/My-File'))
      .toBe('AbC123xyz789');
    expect(parseFigmaFileKey('https://www.figma.com/proto/AbC123xyz789/My-File'))
      .toBe('AbC123xyz789');
  });

  it('accepts a bare file key', () => {
    expect(parseFigmaFileKey('AbC123xyz789')).toBe('AbC123xyz789');
    expect(parseFigmaFileKey('  AbC123xyz789  ')).toBe('AbC123xyz789');
  });

  it('returns null for garbage', () => {
    expect(parseFigmaFileKey('')).toBeNull();
    expect(parseFigmaFileKey('   ')).toBeNull();
    expect(parseFigmaFileKey('not a key')).toBeNull();
    expect(parseFigmaFileKey('short')).toBeNull();
    expect(parseFigmaFileKey('https://example.com/design/AbC123xyz789')).toBeNull();
  });
});

describe('effectiveFileKey', () => {
  it('prefers the real figma.fileKey over the override', () => {
    expect(effectiveFileKey('REALKEY', 'OVERRIDE')).toBe('REALKEY');
    expect(effectiveFileKey('REALKEY', null)).toBe('REALKEY');
  });

  it('falls back to the override only when figma.fileKey is missing', () => {
    expect(effectiveFileKey(undefined, 'OVERRIDE')).toBe('OVERRIDE');
    expect(effectiveFileKey(null, 'OVERRIDE')).toBe('OVERRIDE');
    expect(effectiveFileKey('', 'OVERRIDE')).toBe('OVERRIDE');
  });

  it('returns "unknown" when neither is set', () => {
    expect(effectiveFileKey(undefined, null)).toBe('unknown');
    expect(effectiveFileKey('', null)).toBe('unknown');
  });
});
