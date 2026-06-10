import { describe, it, expect, vi } from 'vitest';
import { buildProsePrompt, parseProseResponse } from '../src/prose/prompt';
import { draftProse } from '../src/prose/client';
import { extract } from '../src/extract';
import button from './fixtures/button.json';
import type { SerializedNode } from '../src/tree';

const spec = extract(button as SerializedNode, { figmaFile: 'FILE1' });

describe('prose', () => {
  it('prompt contains the parsed summary, never raw node JSON', () => {
    const prompt = buildProsePrompt(spec);
    expect(prompt).toContain('Style: Filled · Outlined');
    expect(prompt).not.toContain('"id"'); // no serialized-node internals
  });

  it('parses a valid JSON response', () => {
    const out = parseProseResponse('{"definition":"A button.","accessibility":"Use a real <button>.","dos":["x"],"donts":["y"]}');
    expect(out.definition).toBe('A button.');
  });

  it('strips code fences before parsing', () => {
    const out = parseProseResponse('```json\n{"definition":"D","accessibility":"A","dos":[],"donts":[]}\n```');
    expect(out.definition).toBe('D');
  });

  it('throws on malformed responses', () => {
    expect(() => parseProseResponse('not json')).toThrow();
  });

  it('cache hit skips the API call', async () => {
    const fetcher = vi.fn();
    const cached = { definition: 'cached', accessibility: '', dos: [], donts: [] };
    const store = { get: vi.fn(async () => JSON.stringify(cached)), set: vi.fn() };
    const result = await draftProse(spec, { apiKey: 'sk-test', fetcher: fetcher as unknown as typeof fetch, cacheStore: store });
    expect(result).toEqual(cached);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('returns null (degraded mode) when no API key is set', async () => {
    const store = { get: vi.fn(async () => null), set: vi.fn() };
    const result = await draftProse(spec, { apiKey: null, fetcher: vi.fn() as unknown as typeof fetch, cacheStore: store });
    expect(result).toBeNull();
  });

  it('on a cache miss, calls the API, parses, and stores', async () => {
    const apiText = '{"definition":"Fresh.","accessibility":"A11y.","dos":["do"],"donts":["dont"]}';
    const fetcher = vi.fn(async () => ({
      ok: true,
      json: async () => ({ content: [{ text: apiText }] }),
    })) as unknown as typeof fetch;
    const store = { get: vi.fn(async () => null), set: vi.fn(async () => {}) };
    const result = await draftProse(spec, { apiKey: 'sk-test', fetcher, cacheStore: store });
    expect(result?.definition).toBe('Fresh.');
    expect(store.set).toHaveBeenCalledOnce();
  });
});
