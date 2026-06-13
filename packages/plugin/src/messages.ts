import type { SerializedNode } from '@spec-layer/extractor';

export type MainToUi =
  | { type: 'selection'; node: SerializedNode | null; fileKey: string }
  | { type: 'docsEndpoint'; value: string | null }
  // `value` is the stored override (for the settings input); `effectiveFileKey`
  // is the key computed by the main thread (figma.fileKey, falling back to the
  // override) — the UI displays/uses it and never re-derives precedence.
  | { type: 'fileKeyOverride'; value: string | null; effectiveFileKey: string };

export type UiToMain =
  | { type: 'requestSelection' }
  | { type: 'setDocsEndpoint'; value: string }
  | { type: 'setFileKeyOverride'; value: string | null }
  | { type: 'notify'; message: string }
  | { type: 'openBrowser'; url: string };
