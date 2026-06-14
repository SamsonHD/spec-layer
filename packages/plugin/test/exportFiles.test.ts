import { describe, it, expect } from 'vitest';
import { unzipSync, strFromU8 } from 'fflate';
import { buildExportFiles, zipFiles } from '../src/exportFiles';

// ---------------------------------------------------------------------------
// buildExportFiles
// ---------------------------------------------------------------------------

describe('buildExportFiles', () => {
  it('produces kebab-cased filenames with folder prefix', () => {
    const result = buildExportFiles(
      [{ name: 'Text Field', markdown: '# Text Field' }],
      'my-system',
    );
    expect(Object.keys(result)).toEqual(['my-system/text-field.md']);
    expect(result['my-system/text-field.md']).toBe('# Text Field');
  });

  it('omits folder prefix when folder is empty string', () => {
    const result = buildExportFiles(
      [{ name: 'Button', markdown: '# Button' }],
      '',
    );
    expect(Object.keys(result)).toEqual(['button.md']);
  });

  it('handles empty markdown (still produces an entry)', () => {
    const result = buildExportFiles(
      [{ name: 'Empty', markdown: '' }],
      'ds',
    );
    expect(result['ds/empty.md']).toBe('');
  });

  it('handles collision: two items with the same name get -2 suffix', () => {
    const result = buildExportFiles(
      [
        { name: 'Card', markdown: 'first' },
        { name: 'Card', markdown: 'second' },
      ],
      'ds',
    );
    expect(result['ds/card.md']).toBe('first');
    expect(result['ds/card-2.md']).toBe('second');
  });

  it('handles collision: three items with the same name get -3 suffix', () => {
    const result = buildExportFiles(
      [
        { name: 'Card', markdown: 'first' },
        { name: 'Card', markdown: 'second' },
        { name: 'Card', markdown: 'third' },
      ],
      'ds',
    );
    expect(result['ds/card.md']).toBe('first');
    expect(result['ds/card-2.md']).toBe('second');
    expect(result['ds/card-3.md']).toBe('third');
  });

  it('uses a sane fallback when the name kebabs to empty', () => {
    const result = buildExportFiles(
      [{ name: '---', markdown: 'content' }],
      'ds',
    );
    // Should produce some key ending in .md (either ds/component.md or similar)
    const keys = Object.keys(result);
    expect(keys.length).toBe(1);
    expect(keys[0]).toMatch(/\.md$/);
    expect(keys[0]).toMatch(/^ds\//);
  });

  it('handles multiple distinct names correctly', () => {
    const result = buildExportFiles(
      [
        { name: 'Button', markdown: 'btn' },
        { name: 'Text Field', markdown: 'tf' },
        { name: 'Dialog', markdown: 'dlg' },
      ],
      'design-system',
    );
    expect(result['design-system/button.md']).toBe('btn');
    expect(result['design-system/text-field.md']).toBe('tf');
    expect(result['design-system/dialog.md']).toBe('dlg');
  });

  it('handles figma hierarchy names with slashes', () => {
    const result = buildExportFiles(
      [{ name: 'Icon/Arrow Up', markdown: 'icon' }],
      'ds',
    );
    expect(result['ds/icon-arrow-up.md']).toBe('icon');
  });
});

// ---------------------------------------------------------------------------
// zipFiles — round-trip test
// ---------------------------------------------------------------------------

describe('zipFiles', () => {
  it('returns a Uint8Array', () => {
    const zip = zipFiles({ 'test.md': 'hello' });
    expect(zip).toBeInstanceOf(Uint8Array);
    expect(zip.length).toBeGreaterThan(0);
  });

  it('round-trips file contents through zip/unzip', () => {
    const files = {
      'ds/button.md': '# Button\n\nA button component.',
      'ds/text-field.md': '# Text Field\n\nA text field.',
    };
    const zipped = zipFiles(files);
    const unzipped = unzipSync(zipped);

    for (const [path, content] of Object.entries(files)) {
      expect(unzipped[path]).toBeDefined();
      expect(strFromU8(unzipped[path])).toBe(content);
    }
  });

  it('handles empty content in a file', () => {
    const zipped = zipFiles({ 'empty.md': '' });
    const unzipped = unzipSync(zipped);
    expect(strFromU8(unzipped['empty.md'])).toBe('');
  });
});
