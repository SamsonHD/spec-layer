import { describe, expect, it } from 'vitest';
import { exportDoneMessage } from '../src/ui/render';

describe('exportDoneMessage', () => {
  it('reports atom components skipped by the default export', () => {
    expect(exportDoneMessage(12, 'design-system', 0, 4)).toBe(
      'Exported 12 components, skipped 4 atom components → design-system.zip',
    );
  });

  it('omits the atom note when atoms were included', () => {
    expect(exportDoneMessage(16, 'design-system', 0, 0)).toBe(
      'Exported 16 components → design-system.zip',
    );
  });

  it('explains how to export when every eligible component is an atom', () => {
    expect(exportDoneMessage(0, '', 0, 3)).toBe(
      'No standard components found. Skipped 3 atom components; enable Include atom components to export them.',
    );
  });
});
