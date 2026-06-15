import { describe, expect, it } from 'vitest';
import { createState, refreshRenderedSpecFileKey } from '../src/ui/actions';
import type { SerializedNode } from '@spec-layer/extractor';

const node: SerializedNode = {
  id: '12:34',
  name: 'Button',
  type: 'COMPONENT',
  visible: true,
  key: 'component-key',
  children: [],
};

describe('refreshRenderedSpecFileKey', () => {
  it('regenerates an existing extracted spec with the new file key', () => {
    const state = createState();
    state.currentNode = node;
    state.currentFileKey = 'unknown';
    state.currentSpec = {
      name: 'Button',
      figmaKey: 'component-key',
      figmaFile: 'unknown',
      figmaNode: '12:34',
      anatomy: [],
      props: [],
      variants: [],
      variantInstances: [],
      states: [],
      tokens: [],
      related: [],
      gaps: [],
      layout: [],
    };
    state.renderedMd = 'stale markdown';

    refreshRenderedSpecFileKey(state, 'REALKEY');

    expect(state.currentFileKey).toBe('REALKEY');
    expect(state.currentSpec?.figmaFile).toBe('REALKEY');
    expect(state.renderedMd).toContain('figma_file: REALKEY');
  });

  it('only updates connection state before a spec has been extracted', () => {
    const state = createState();
    state.currentNode = node;

    refreshRenderedSpecFileKey(state, 'REALKEY');

    expect(state.currentFileKey).toBe('REALKEY');
    expect(state.currentSpec).toBeNull();
    expect(state.renderedMd).toBe('');
  });
});
