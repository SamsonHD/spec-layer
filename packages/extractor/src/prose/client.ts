import type { IntermediateSpec } from '../extract';
import { contentHash } from '../hash';
import { buildProsePrompt, parseProseResponse, type ProseDrafts } from './prompt';

export interface CacheStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

export interface DraftOptions {
  apiKey: string | null;
  fetcher: typeof fetch;
  cacheStore: CacheStore;
}

export async function draftProse(spec: IntermediateSpec, opts: DraftOptions): Promise<ProseDrafts | null> {
  if (!opts.apiKey) return null;

  const key = `prose:${contentHash(spec)}`;
  const hit = await opts.cacheStore.get(key);
  if (hit) return JSON.parse(hit) as ProseDrafts;

  const res = await opts.fetcher('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': opts.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: buildProsePrompt(spec) }],
    }),
  });

  if (!res.ok) throw new Error(`Claude API error ${res.status}`);
  const data = await res.json();
  const prose = parseProseResponse(data.content[0].text);
  await opts.cacheStore.set(key, JSON.stringify(prose));
  return prose;
}
