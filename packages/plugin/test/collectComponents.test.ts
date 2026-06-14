import { describe, it, expect } from 'vitest';
import { collectExportPlan, collectExportTargets, isAtomComponentName } from '../src/collectComponents';

type InputNode = { id: string; name: string; type: string; parentType: string | null };

describe('collectExportTargets', () => {
  it('returns empty array for empty input', () => {
    expect(collectExportTargets([])).toEqual([]);
  });

  it('returns a COMPONENT_SET and excludes its COMPONENT variant children', () => {
    const nodes: InputNode[] = [
      { id: '1:1', name: 'Button', type: 'COMPONENT_SET', parentType: 'PAGE' },
      { id: '1:2', name: 'Button/Size=Small', type: 'COMPONENT', parentType: 'COMPONENT_SET' },
      { id: '1:3', name: 'Button/Size=Medium', type: 'COMPONENT', parentType: 'COMPONENT_SET' },
      { id: '1:4', name: 'Button/Size=Large', type: 'COMPONENT', parentType: 'COMPONENT_SET' },
    ];
    const result = collectExportTargets(nodes);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: '1:1', name: 'Button', type: 'COMPONENT_SET' });
  });

  it('returns a standalone COMPONENT whose parentType is FRAME', () => {
    const nodes: InputNode[] = [
      { id: '2:1', name: 'Icon', type: 'COMPONENT', parentType: 'FRAME' },
    ];
    const result = collectExportTargets(nodes);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: '2:1', name: 'Icon', type: 'COMPONENT' });
  });

  it('returns a standalone COMPONENT whose parentType is PAGE', () => {
    const nodes: InputNode[] = [
      { id: '3:1', name: 'Badge', type: 'COMPONENT', parentType: 'PAGE' },
    ];
    const result = collectExportTargets(nodes);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: '3:1', name: 'Badge', type: 'COMPONENT' });
  });

  it('returns a COMPONENT nested inside a FRAME (not a variant)', () => {
    const nodes: InputNode[] = [
      { id: '4:1', name: 'Chip', type: 'COMPONENT', parentType: 'FRAME' },
    ];
    const result = collectExportTargets(nodes);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: '4:1', name: 'Chip', type: 'COMPONENT' });
  });

  it('ignores non-COMPONENT and non-COMPONENT_SET types', () => {
    const nodes: InputNode[] = [
      { id: '5:1', name: 'Frame', type: 'FRAME', parentType: 'PAGE' },
      { id: '5:2', name: 'Text', type: 'TEXT', parentType: 'FRAME' },
      { id: '5:3', name: 'Group', type: 'GROUP', parentType: 'PAGE' },
    ];
    expect(collectExportTargets(nodes)).toEqual([]);
  });

  it('handles mixed input: sets + standalone components + variants + unrelated types', () => {
    const nodes: InputNode[] = [
      // COMPONENT_SET → included
      { id: '6:1', name: 'Button', type: 'COMPONENT_SET', parentType: 'PAGE' },
      // Variants of the set → excluded
      { id: '6:2', name: 'Button/Primary', type: 'COMPONENT', parentType: 'COMPONENT_SET' },
      { id: '6:3', name: 'Button/Secondary', type: 'COMPONENT', parentType: 'COMPONENT_SET' },
      // Standalone component → included
      { id: '6:4', name: 'Divider', type: 'COMPONENT', parentType: 'FRAME' },
      // Another standalone on a page → included
      { id: '6:5', name: 'Spinner', type: 'COMPONENT', parentType: 'PAGE' },
      // Another COMPONENT_SET → included
      { id: '6:6', name: 'Input', type: 'COMPONENT_SET', parentType: 'SECTION' },
      // Variant of the second set → excluded
      { id: '6:7', name: 'Input/Default', type: 'COMPONENT', parentType: 'COMPONENT_SET' },
      // Unrelated types → excluded
      { id: '6:8', name: 'SomeFrame', type: 'FRAME', parentType: 'PAGE' },
    ];
    const result = collectExportTargets(nodes);
    expect(result).toHaveLength(4);
    const ids = result.map(n => n.id);
    expect(ids).toContain('6:1'); // Button set
    expect(ids).toContain('6:4'); // Divider standalone
    expect(ids).toContain('6:5'); // Spinner standalone
    expect(ids).toContain('6:6'); // Input set
    // Variants must NOT appear
    expect(ids).not.toContain('6:2');
    expect(ids).not.toContain('6:3');
    expect(ids).not.toContain('6:7');
    // Unrelated type must NOT appear
    expect(ids).not.toContain('6:8');
  });

  it('returns only the id, name, and type fields (no parentType)', () => {
    const nodes: InputNode[] = [
      { id: '7:1', name: 'Card', type: 'COMPONENT', parentType: 'PAGE' },
    ];
    const result = collectExportTargets(nodes);
    expect(result[0]).not.toHaveProperty('parentType');
    expect(Object.keys(result[0]).sort()).toEqual(['id', 'name', 'type']);
  });
});

describe('atom components', () => {
  const nodes: InputNode[] = [
    { id: '8:1', name: 'Button', type: 'COMPONENT_SET', parentType: 'PAGE' },
    { id: '8:2', name: '.button-base', type: 'COMPONENT', parentType: 'FRAME' },
    { id: '8:3', name: '.icon-parts', type: 'COMPONENT_SET', parentType: 'SECTION' },
    { id: '8:4', name: '.variant-child', type: 'COMPONENT', parentType: 'COMPONENT_SET' },
    { id: '8:5', name: 'Button/.label', type: 'COMPONENT', parentType: 'FRAME' },
  ];

  it('recognizes names that begin with a period as atom components', () => {
    expect(isAtomComponentName('.button-base')).toBe(true);
    expect(isAtomComponentName('Button/.label')).toBe(false);
    expect(isAtomComponentName('Button')).toBe(false);
  });

  it('excludes atom components by default and reports how many were skipped', () => {
    expect(collectExportPlan(nodes)).toEqual({
      targets: [
        { id: '8:1', name: 'Button', type: 'COMPONENT_SET' },
        { id: '8:5', name: 'Button/.label', type: 'COMPONENT' },
      ],
      skippedAtoms: 2,
    });
  });

  it('includes atom components when explicitly requested', () => {
    expect(collectExportPlan(nodes, { includeAtoms: true })).toEqual({
      targets: [
        { id: '8:1', name: 'Button', type: 'COMPONENT_SET' },
        { id: '8:2', name: '.button-base', type: 'COMPONENT' },
        { id: '8:3', name: '.icon-parts', type: 'COMPONENT_SET' },
        { id: '8:5', name: 'Button/.label', type: 'COMPONENT' },
      ],
      skippedAtoms: 0,
    });
  });
});
