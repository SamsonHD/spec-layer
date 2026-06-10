import type { SerializedNode } from '@spec-layer/extractor';

export type MainToUi =
  | { type: 'selection'; node: SerializedNode | null; fileKey: string }
  | { type: 'apiKey'; value: string | null }
  | { type: 'cacheValue'; key: string; value: string | null };

export type UiToMain =
  | { type: 'requestSelection' }
  | { type: 'setApiKey'; value: string }
  | { type: 'cacheGet'; key: string }
  | { type: 'cacheSet'; key: string; value: string }
  | { type: 'notify'; message: string };
