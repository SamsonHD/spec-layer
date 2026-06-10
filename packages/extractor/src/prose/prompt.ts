import type { IntermediateSpec } from '../extract';

export interface ProseDrafts {
  definition: string;
  accessibility: string;
  dos: string[];
  donts: string[];
}

/**
 * Build a compact human-readable summary of the spec for the LLM prompt.
 * Never embeds raw serialized-node JSON — only parsed, derived fields.
 */
export function buildProsePrompt(spec: IntermediateSpec): string {
  const lines: string[] = [];

  lines.push(`Component: ${spec.name}`);
  lines.push('');

  // Anatomy
  if (spec.anatomy.length) {
    const parts = spec.anatomy.map((a) => (a.nested ? `${a.name} (component)` : a.name)).join(', ');
    lines.push(`Anatomy: ${parts}`);
  }

  // Props (non-variant)
  const nonVariantProps = spec.props.filter((p) => p.kind !== 'variant');
  if (nonVariantProps.length) {
    lines.push('');
    lines.push('Props:');
    for (const p of nonVariantProps) {
      const def = p.default !== undefined ? ` (default: ${p.default})` : '';
      lines.push(`  ${p.name} [${p.kind}]${def}`);
    }
  }

  // Variant axes — format EXACTLY as "Style: Filled · Outlined"
  if (spec.variants.length) {
    lines.push('');
    lines.push('Variants:');
    for (const v of spec.variants) {
      lines.push(`  ${v.prop}: ${v.values.join(' · ')}`);
    }
  }

  // States
  if (spec.states.length) {
    lines.push('');
    lines.push(`States: ${spec.states.join(', ')}`);
  }

  // Tokens
  if (spec.tokens.length) {
    lines.push('');
    lines.push('Design tokens:');
    for (const t of spec.tokens) {
      lines.push(`  ${t.part}.${t.property} → ${t.token}`);
    }
  }

  // Related
  if (spec.related.length) {
    lines.push('');
    lines.push(`Related: ${spec.related.join(', ')}`);
  }

  // Instruction
  lines.push('');
  lines.push(
    'Return ONLY a JSON object with keys: ' +
      'definition (one paragraph, specific to this component\'s actual props and variants — no generic filler), ' +
      'accessibility (notes for this component pattern, flagging what cannot be known from the design file), ' +
      'dos (string[], 3–5 items), ' +
      'donts (string[], 3–5 items). ' +
      'Do not include any prose outside the JSON.',
  );

  return lines.join('\n');
}

/**
 * Strip optional ```json … ``` fences, trim, parse, and validate the shape.
 */
export function parseProseResponse(text: string): ProseDrafts {
  // Strip code fences
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned
      .replace(/^```(?:json)?\n?/, '')
      .replace(/\n?```$/, '')
      .trim();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse prose response as JSON: ${(err as Error).message}`);
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Prose response must be a JSON object');
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.definition !== 'string') {
    throw new Error('Prose response missing or invalid field: definition');
  }
  if (typeof obj.accessibility !== 'string') {
    throw new Error('Prose response missing or invalid field: accessibility');
  }
  if (!Array.isArray(obj.dos)) {
    throw new Error('Prose response missing or invalid field: dos');
  }
  if (!Array.isArray(obj.donts)) {
    throw new Error('Prose response missing or invalid field: donts');
  }

  return {
    definition: obj.definition,
    accessibility: obj.accessibility,
    dos: obj.dos as string[],
    donts: obj.donts as string[],
  };
}
