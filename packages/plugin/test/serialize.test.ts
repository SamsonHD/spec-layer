import { describe, it, expect } from 'vitest';
import { serializeNode } from '../src/serialize';

const resolver = {
  variableName: async (id: string) => (({ 'VariableID:1': 'md.sys.color.primary' } as Record<string,string>)[id] ?? null),
  styleName: async (_id: string) => null,
  mainComponent: async (_node: unknown) => null,
};

const mockRect = {
  id: '2:1', name: 'container', type: 'RECTANGLE', visible: true,
  fills: [{ type: 'SOLID' }],
  fillStyleId: '',
  boundVariables: { fills: [{ id: 'VariableID:1' }] },
  children: undefined,
};

describe('serializeNode', () => {
  it('resolves variable bindings to token names', async () => {
    const out = await serializeNode(mockRect as never, resolver);
    expect(out.bindings).toContainEqual({ property: 'fills', token: 'md.sys.color.primary' });
    expect(out.hasUnboundPaint).toBeFalsy();
  });

  it('flags unbound paints', async () => {
    const unbound = { ...mockRect, boundVariables: {} };
    const out = await serializeNode(unbound as never, resolver);
    expect(out.hasUnboundPaint).toBe(true);
  });

  it('recurses into children', async () => {
    const parent = { id: '1:1', name: 'frame', type: 'FRAME', visible: true, children: [mockRect] };
    const out = await serializeNode(parent as never, resolver);
    expect(out.children?.[0].name).toBe('container');
  });

  it('resolves fillStyleId to a binding', async () => {
    const styledResolver = {
      ...resolver,
      styleName: async (_id: string) => 'color/primary',
    };
    const styled = { ...mockRect, boundVariables: {}, fillStyleId: 'S:abc,1:1' };
    const out = await serializeNode(styled as never, styledResolver);
    expect(out.bindings).toContainEqual({ property: 'fills', token: 'color/primary' });
    expect(out.hasUnboundPaint).toBeFalsy();
  });
});
