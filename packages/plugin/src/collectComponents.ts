/**
 * Describes a node that can be an export target (as returned by findAllWithCriteria).
 * The `parentType` field is used only for filtering and is NOT included in the output.
 */
export interface ComponentCandidate {
  id: string;
  name: string;
  type: string;
  parentType: string | null;
}

/**
 * An export target — the parentType has been stripped; callers use id to
 * re-resolve the actual Figma node via figma.getNodeByIdAsync(id).
 */
export interface ExportTarget {
  id: string;
  name: string;
  type: string;
}

export interface ExportPlan {
  targets: ExportTarget[];
  skippedAtoms: number;
}

export function isAtomComponentName(name: string): boolean {
  return name.startsWith('.');
}

/**
 * From a flat list of COMPONENT / COMPONENT_SET candidates (e.g. the result
 * of figma.root.findAllWithCriteria), return the minimal set of export targets:
 *
 * - All COMPONENT_SET nodes (each set represents all its variants).
 * - All COMPONENT nodes whose parentType is NOT 'COMPONENT_SET' (standalone
 *   components — not variants). A COMPONENT is a variant when it is a direct
 *   child of a COMPONENT_SET; the one-level parentType check is sufficient
 *   because Figma guarantees variants are always direct children of their set.
 *
 * All other types are ignored.
 */
export function collectExportTargets(nodes: ComponentCandidate[]): ExportTarget[] {
  const targets: ExportTarget[] = [];
  for (const node of nodes) {
    if (node.type === 'COMPONENT_SET') {
      targets.push({ id: node.id, name: node.name, type: node.type });
    } else if (node.type === 'COMPONENT' && node.parentType !== 'COMPONENT_SET') {
      targets.push({ id: node.id, name: node.name, type: node.type });
    }
  }
  return targets;
}

/** Build the bulk-export list, excluding dot-prefixed atom components by default. */
export function collectExportPlan(
  nodes: ComponentCandidate[],
  options: { includeAtoms?: boolean } = {},
): ExportPlan {
  const eligible = collectExportTargets(nodes);
  if (options.includeAtoms) return { targets: eligible, skippedAtoms: 0 };

  const targets = eligible.filter((node) => !isAtomComponentName(node.name));
  return { targets, skippedAtoms: eligible.length - targets.length };
}
