import { describe, it, expect } from 'vitest';
import { serializeNode, type NodeResolver } from '../src/serialize';
import { extract, renderSpec } from '@spec-layer/extractor';
import { parseFrontmatter } from '@spec-layer/format';
import { approveSpec } from '../src/ui/state';

// A mock Figma COMPONENT_SET node (button) with one variant child containing
// a container (bound fill), a label, and an instance (nested component).
const mockButtonSet = {
  id: '1:100', name: 'Button', type: 'COMPONENT_SET', visible: true, key: 'm3-button',
  componentPropertyDefinitions: {
    Style: { type: 'VARIANT', defaultValue: 'Filled', variantOptions: ['Filled', 'Outlined'] },
    State: { type: 'VARIANT', defaultValue: 'Enabled', variantOptions: ['Enabled', 'Hovered', 'Disabled'] },
  },
  children: [
    {
      id: '1:101', name: 'Style=Filled, State=Enabled', type: 'COMPONENT', visible: true,
      children: [
        { id: '1:102', name: 'container', type: 'FRAME', visible: true,
          fills: [{ type: 'SOLID' }], fillStyleId: '',
          boundVariables: { fills: [{ id: 'VAR:1' }] } },
        { id: '1:103', name: 'label', type: 'TEXT', visible: true,
          fills: [{ type: 'SOLID' }], fillStyleId: '',
          boundVariables: { fills: [{ id: 'VAR:2' }] } },
        { id: '1:104', name: 'icon', type: 'INSTANCE', visible: true },
      ],
    },
  ],
};

const resolver: NodeResolver = {
  variableName: async (id) => (({ 'VAR:1': 'md.sys.color.primary', 'VAR:2': 'md.sys.color.on-primary' } as Record<string,string>)[id] ?? null),
  styleName: async () => null,
  mainComponent: async () => ({ name: 'Icon', key: 'm3-icon' }),
};

describe('full pipeline: serialize → extract → render → approve → parse', () => {
  it('produces a draft spec, then an approved spec that round-trips', async () => {
    const node = await serializeNode(mockButtonSet as never, resolver);

    // serialize resolved bindings to token names
    expect(node.type).toBe('COMPONENT_SET');
    expect(node.propertyDefinitions?.Style?.variantOptions).toEqual(['Filled', 'Outlined']);

    const spec = extract(node, { figmaFile: 'FILEKEY' });
    expect(spec.props.length).toBe(2);
    expect(spec.states).toEqual(['Enabled', 'Hovered', 'Disabled']);
    expect(spec.related).toEqual(['Icon']);

    const draftMd = renderSpec(spec, { prose: null, extractedAt: '2026-06-10T00:00:00.000Z' });
    const draftParsed = parseFrontmatter(draftMd);
    expect(draftParsed.frontmatter.status).toBe('draft');
    expect(draftMd).toContain('> ⚠️ Draft — AI-suggested, not yet approved.');
    expect(draftMd).toContain('| container | fills | `md.sys.color.primary` |');

    const approvedMd = approveSpec(draftMd, 'Alex');
    const approvedParsed = parseFrontmatter(approvedMd);
    expect(approvedParsed.frontmatter.status).toBe('approved');
    expect(approvedParsed.frontmatter.approved_by).toBe('Alex');
    expect(approvedMd).not.toContain('⚠️ Draft');
    // structural content survives approval
    expect(approvedMd).toContain('| container | fills | `md.sys.color.primary` |');
    expect(approvedMd).toContain('## Related atoms');
  });

  it('degraded mode (no prose) still yields an exportable, parseable spec', async () => {
    const node = await serializeNode(mockButtonSet as never, resolver);
    const spec = extract(node, { figmaFile: 'F' });
    const md = renderSpec(spec, { prose: null, extractedAt: '2026-06-10T00:00:00.000Z' });
    expect(() => parseFrontmatter(md)).not.toThrow();
  });
});
