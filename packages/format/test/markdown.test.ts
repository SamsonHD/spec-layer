import { describe, expect, it } from 'vitest';
import { parseMarkdown } from '../src/markdown';

describe('parseMarkdown', () => {
  it('parses frontmatter into data and returns the body as content', () => {
    const { data, content } = parseMarkdown('---\nname: Button\nstatus: draft\n---\n# Heading\n\nBody.');
    expect(data).toEqual({ name: 'Button', status: 'draft' });
    expect(content).toBe('# Heading\n\nBody.');
  });

  it('returns empty data and the full input when there is no frontmatter', () => {
    const raw = '# Just a heading\n\nNo frontmatter here.';
    expect(parseMarkdown(raw)).toEqual({ data: {}, content: raw });
  });

  it('treats an empty fence as empty data', () => {
    const { data, content } = parseMarkdown('---\n---\n# Body');
    expect(data).toEqual({});
    expect(content).toBe('# Body');
  });

  it('parses nested objects and arrays', () => {
    const { data } = parseMarkdown(
      '---\ncomponent:\n  name: Button\n  figma_node: "1:2"\ntags:\n  - ui\n  - form\n---\nbody',
    );
    expect(data).toEqual({
      component: { name: 'Button', figma_node: '1:2' },
      tags: ['ui', 'form'],
    });
  });

  it('handles CRLF line endings', () => {
    const { data, content } = parseMarkdown('---\r\nname: Button\r\n---\r\n# Body');
    expect(data).toEqual({ name: 'Button' });
    expect(content).toBe('# Body');
  });

  it('strips a leading UTF-8 BOM before the fence', () => {
    const { data, content } = parseMarkdown('﻿---\nname: Button\n---\nbody');
    expect(data).toEqual({ name: 'Button' });
    expect(content).toBe('body');
  });

  it('coerces non-object frontmatter (a bare scalar) to an empty object', () => {
    const { data } = parseMarkdown('---\njust a string\n---\nbody');
    expect(data).toEqual({});
  });

  it('throws on malformed YAML so callers can reject bad uploads', () => {
    // Unbalanced flow collection is a hard YAML error.
    expect(() => parseMarkdown('---\nfoo: [unterminated\n---\nbody')).toThrow();
  });

  it('only consumes the first closing fence', () => {
    const { data, content } = parseMarkdown('---\nname: A\n---\nbody with --- inside\nmore');
    expect(data).toEqual({ name: 'A' });
    expect(content).toBe('body with --- inside\nmore');
  });
});
