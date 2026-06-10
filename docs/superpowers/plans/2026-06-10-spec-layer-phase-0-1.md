# Spec Layer — Phase 0 & 1 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the open Spec Layer format v0.1 (Phase 0) and a Figma plugin that extracts a selected component into a reviewable, locally-exportable Markdown spec (Phase 1).

**Architecture:** A TypeScript monorepo with three packages: `format` (frontmatter schema, parse/serialize, validation), `extractor` (pure functions: serialized node tree → intermediate JSON → Markdown, plus the LLM prose layer), and `plugin` (Figma plugin: serializes the live selection at the boundary, everything else stays pure and fixture-testable). LLM calls happen only in the prose layer, from the plugin UI iframe, with a user-supplied Anthropic API key and a cache keyed on content hash.

**Tech Stack:** TypeScript 5, npm workspaces, Vitest, `yaml` (frontmatter), `js-sha256` (content hash, works in plugin sandbox), esbuild (plugin bundling), `@figma/plugin-typings`, Claude API (`claude-haiku-4-5` for prose drafts).

**Decisions locked in (from spec review advisories):**
1. **API key:** user-supplied Anthropic key stored in `figma.clientStorage`, calls made from the UI iframe. No backend, no shipped key. No key → prose sections render as empty templates (degraded mode already specified in the design).
2. **Reference design system:** **Material 3 Design Kit** (Figma Community) — well-structured component sets with published variables; reference specs and test fixtures derive from it.
3. **Phase 1 scope:** single-component extraction from the current selection (the free-tier wedge). Full-library extraction is Phase 2.

**Design spec:** `docs/superpowers/specs/2026-06-10-spec-layer-design.md`

---

## Phase 0 — Format (zero product code)

### Task 1: Repo scaffolding

**Files:**
- Create: `package.json`, `tsconfig.base.json`, `vitest.config.ts`, `.gitignore`, `README.md`

- [ ] **Step 1: Create workspace root**

`package.json`:
```json
{
  "name": "spec-layer",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

`tsconfig.base.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "esModuleInterop": true
  }
}
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['packages/**/test/**/*.test.ts'] } });
```

`.gitignore`:
```
node_modules/
dist/
.env
```

`README.md`: one paragraph — what Spec Layer is (the positioning sentence from the design spec), link to `spec/SPEC.md` (created in Task 2).

- [ ] **Step 2: Install and verify**

Run: `npm install && npx vitest run`
Expected: "No test files found" (exit 0 with passWithNoTests not set is exit 1 — add `passWithNoTests: true` to vitest config to make a clean baseline)

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: scaffold spec-layer monorepo"
```

### Task 2: Write the format definition (SPEC.md)

**Files:**
- Create: `spec/SPEC.md`

- [ ] **Step 1: Write SPEC.md**

Author the open format definition v0.1. It must contain, in this order:

1. **Title + positioning** — "Spec Layer format: the approved contract between design and code." State that it is an open standard, MIT-style licensed.
2. **File shape** — one component per `.md` file, YAML frontmatter + fixed section order.
3. **Frontmatter schema** — copy exactly from the design spec §4 (spec_version, status enum `draft|approved|deprecated`, component {name, figma_key, figma_file, figma_node}, content_hash, extracted_at, approved_by). Document each field in a table: name, type, required, purpose. State that `content_hash` is SHA-256 of the canonical JSON of the deterministic extraction (sorted keys), and is the cache/drift key. State explicitly that hand-authored specs (not produced by an extractor) may use the placeholder hash `"0000…"` (64 zeros).
4. **Section definitions** — for each of the 10 sections, with canonical headings fixed verbatim here (`## Definition`, `## Anatomy`, `## Configuration`, `## Variants`, `## States`, `## Tokens used`, `## Code`, `## Accessibility`, `## Do's & Don'ts`, `## Related atoms` — the renderer and golden file in Task 10 must match these exactly): heading level, whether deterministic or judgment, and the exact content shape (e.g., Configuration is a table with columns Name / Kind / Options / Default; Code contains an `import` line, a prop-mapping table Figma prop → code prop, and one fenced usage example).
5. **The draft-marker rule** — judgment sections (Definition, Code, Accessibility, Do's & Don'ts) MUST carry the marker line `> ⚠️ Draft — AI-suggested, not yet approved.` until a human approves; approval removes markers and sets `status: approved` + `approved_by`.
6. **Versioning** — `spec_version` semver; v0.x may break.

- [ ] **Step 2: Commit**

```bash
git add spec/SPEC.md && git commit -m "docs: spec layer format v0.1"
```

### Task 3: Three reference specs against Material 3

**Files:**
- Create: `spec/examples/button.md`, `spec/examples/text-field.md`, `spec/examples/dialog.md`

- [ ] **Step 1: Hand-write the three reference specs**

Open the Material 3 Design Kit in Figma (Community file). For **Button**, **Text field**, and **Dialog**, hand-write a complete spec following SPEC.md exactly: real variant axes from the kit (e.g., Button: Style = Filled/Outlined/Text/Elevated/Tonal; State = Enabled/Hovered/Focused/Pressed/Disabled), real token names where the kit exposes them (e.g., `md.sys.color.primary`), a filled-in Code section mapping to a plausible React API (these are reference examples — the code mapping demonstrates the format, noted as illustrative). Mark every judgment section `approved`-style (no draft markers) since a human wrote them; set frontmatter `status: approved`, `content_hash: "0000…"` placeholder explicitly documented in SPEC.md as allowed for hand-authored specs.

- [ ] **Step 2: Self-check against SPEC.md**

Read each example next to SPEC.md and verify section order, heading levels, table shapes, and frontmatter fields match exactly. These files become golden fixtures for the parser tests in Task 4 — divergence here costs debugging later.

- [ ] **Step 3: Commit**

```bash
git add spec/examples && git commit -m "docs: reference specs for Button, Text field, Dialog (Material 3)"
```

**Phase 0 exit criterion:** repo is public-ready (format + examples readable standalone). Publishing to GitHub is a user action — flag it, don't block on it.

---

## Phase 1 — Extractor

### Task 4: `format` package — types and frontmatter round-trip

**Files:**
- Create: `packages/format/package.json`, `packages/format/tsconfig.json`
- Create: `packages/format/src/types.ts`, `packages/format/src/frontmatter.ts`, `packages/format/src/index.ts`
- Test: `packages/format/test/frontmatter.test.ts`

- [ ] **Step 1: Package scaffolding**

`packages/format/package.json`:
```json
{
  "name": "@spec-layer/format",
  "version": "0.1.0",
  "type": "module",
  "main": "src/index.ts",
  "dependencies": { "yaml": "^2.5.0" }
}
```

`packages/format/tsconfig.json`: `{ "extends": "../../tsconfig.base.json", "include": ["src", "test"] }`

- [ ] **Step 2: Write types**

`packages/format/src/types.ts`:
```ts
export type SpecStatus = 'draft' | 'approved' | 'deprecated';

export interface SpecFrontmatter {
  spec_version: '0.1';
  status: SpecStatus;
  component: {
    name: string;
    figma_key: string;
    figma_file: string;
    figma_node: string;
  };
  content_hash: string;
  extracted_at: string; // ISO 8601
  approved_by?: string;
}
```

- [ ] **Step 3: Write the failing test**

`packages/format/test/frontmatter.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { parseFrontmatter, serializeFrontmatter } from '../src/frontmatter';
import type { SpecFrontmatter } from '../src/types';

const fm: SpecFrontmatter = {
  spec_version: '0.1',
  status: 'draft',
  component: { name: 'Button', figma_key: 'abc123', figma_file: 'FILE1', figma_node: '1:23' },
  content_hash: 'deadbeef',
  extracted_at: '2026-06-10T00:00:00.000Z',
};

describe('frontmatter', () => {
  it('round-trips frontmatter and body', () => {
    const md = serializeFrontmatter(fm, '## Definition\n\nA button.\n');
    const parsed = parseFrontmatter(md);
    expect(parsed.frontmatter).toEqual(fm);
    expect(parsed.body).toBe('## Definition\n\nA button.\n');
  });

  it('rejects a document without frontmatter', () => {
    expect(() => parseFrontmatter('no frontmatter here')).toThrow(/frontmatter/i);
  });

  it('rejects an invalid status', () => {
    const md = serializeFrontmatter({ ...fm, status: 'bogus' as never }, '');
    expect(() => parseFrontmatter(md)).toThrow(/status/i);
  });

  it('parses every reference example without error', async () => {
    const fs = await import('node:fs');
    for (const f of ['button.md', 'text-field.md', 'dialog.md']) {
      const raw = fs.readFileSync(new URL(`../../../spec/examples/${f}`, import.meta.url), 'utf8');
      expect(() => parseFrontmatter(raw)).not.toThrow();
    }
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run packages/format`
Expected: FAIL — cannot resolve `../src/frontmatter`

- [ ] **Step 5: Implement**

`packages/format/src/frontmatter.ts`:
```ts
import YAML from 'yaml';
import type { SpecFrontmatter, SpecStatus } from './types';

const STATUSES: SpecStatus[] = ['draft', 'approved', 'deprecated'];

export function serializeFrontmatter(fm: SpecFrontmatter, body: string): string {
  return `---\n${YAML.stringify(fm)}---\n\n${body}`;
}

export function parseFrontmatter(md: string): { frontmatter: SpecFrontmatter; body: string } {
  const m = md.match(/^---\n([\s\S]*?)\n---\n*/);
  if (!m) throw new Error('Missing YAML frontmatter');
  const fm = YAML.parse(m[1]) as SpecFrontmatter;
  if (!STATUSES.includes(fm.status)) throw new Error(`Invalid status: ${fm.status}`);
  if (!fm.component?.name || !fm.component?.figma_key) throw new Error('Missing component identity');
  if (!fm.content_hash) throw new Error('Missing content_hash');
  return { frontmatter: fm, body: md.slice(m[0].length) };
}
```

`packages/format/src/index.ts`: re-export `types` and `frontmatter`.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run packages/format`
Expected: PASS (4 tests). If the reference-examples test fails, fix the *examples* to conform — SPEC.md is the authority.

- [ ] **Step 7: Commit**

```bash
git add packages/format spec/examples && git commit -m "feat(format): frontmatter types, parse/serialize, validation"
```

### Task 5: `extractor` package — serialized tree types and fixtures

**Files:**
- Create: `packages/extractor/package.json`, `packages/extractor/tsconfig.json`
- Create: `packages/extractor/src/tree.ts`
- Create: `packages/extractor/test/fixtures/button.json`

- [ ] **Step 1: Package scaffolding**

`packages/extractor/package.json`:
```json
{
  "name": "@spec-layer/extractor",
  "version": "0.1.0",
  "type": "module",
  "main": "src/index.ts",
  "dependencies": {
    "@spec-layer/format": "*",
    "js-sha256": "^0.11.0"
  }
}
```

- [ ] **Step 2: Define the serialized tree contract**

This is the boundary between the live Figma API and all pure logic. **Variable/style IDs are resolved to names at serialization time** (the plugin main thread does async lookups); the extractor never sees Figma object references.

`packages/extractor/src/tree.ts`:
```ts
/** A Figma node serialized by the plugin main thread. Pure JSON. */
export interface SerializedNode {
  id: string;
  name: string;
  type: string; // COMPONENT_SET | COMPONENT | INSTANCE | FRAME | TEXT | ...
  visible: boolean;
  children?: SerializedNode[];
  /** Present on COMPONENT_SET (or standalone COMPONENT). */
  propertyDefinitions?: Record<string, PropertyDefinition>;
  /** Variable bindings, resolved to token names: e.g. { property: "fills", token: "md.sys.color.primary" } */
  bindings?: TokenRef[];
  /** True when a paint is hardcoded (no variable/style) — feeds the gaps report. */
  hasUnboundPaint?: boolean;
  /** For INSTANCE nodes: the main component's name and key. */
  mainComponent?: { name: string; key: string };
  /** Stable component key (COMPONENT/COMPONENT_SET only). */
  key?: string;
}

export interface PropertyDefinition {
  type: 'VARIANT' | 'BOOLEAN' | 'TEXT' | 'INSTANCE_SWAP';
  defaultValue?: string | boolean;
  variantOptions?: string[];
}

export interface TokenRef {
  property: string; // fills | strokes | itemSpacing | cornerRadius | ...
  token: string;    // resolved variable or style name
}
```

- [ ] **Step 3: Build the button fixture**

`packages/extractor/test/fixtures/button.json` — hand-write a `SerializedNode` for a Material-3-shaped Button component set: 2 variant axes (`Style`: Filled/Outlined, `State`: Enabled/Hovered/Disabled), one boolean prop (`Show icon`), one text prop (`Label`); the **first variant child** contains layers `container` (bindings: fills → `md.sys.color.primary`, cornerRadius → `md.sys.shape.corner.full`), `label` (TEXT, bindings: fills → `md.sys.color.on-primary`), an `icon` INSTANCE (mainComponent: `Icon`), **and** a fourth child `debug-overlay` with `visible: false` and `hasUnboundPaint: true` — it must sit inside the first variant child so the anatomy test (Task 6) excludes it as invisible while the gaps walk (Task 8) still finds it. Keep it ~80 lines. This single fixture drives Tasks 6–11.

- [ ] **Step 4: Commit**

```bash
git add packages/extractor && git commit -m "feat(extractor): serialized tree contract + button fixture"
```

### Task 6: Extract anatomy + related atoms

**Files:**
- Create: `packages/extractor/src/anatomy.ts`
- Test: `packages/extractor/test/anatomy.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { extractAnatomy } from '../src/anatomy';
import button from './fixtures/button.json';
import type { SerializedNode } from '../src/tree';

describe('extractAnatomy', () => {
  const result = extractAnatomy(button as SerializedNode);

  it('lists visible named parts of the default variant', () => {
    expect(result.parts.map((p) => p.name)).toEqual(['container', 'label', 'icon']);
  });

  it('marks instances as nested and surfaces them as related atoms', () => {
    expect(result.parts.find((p) => p.name === 'icon')?.nested).toBe(true);
    expect(result.related).toEqual(['Icon']);
  });

  it('excludes invisible layers', () => {
    expect(result.parts.find((p) => p.name === 'debug-overlay')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run packages/extractor/test/anatomy.test.ts`
Expected: FAIL — `extractAnatomy` not defined

- [ ] **Step 3: Implement**

`packages/extractor/src/anatomy.ts`:
```ts
import type { SerializedNode } from './tree';

export interface AnatomyPart { name: string; type: string; nested: boolean }
export interface AnatomyResult { parts: AnatomyPart[]; related: string[] }

/** Default variant = first child of a COMPONENT_SET; a bare COMPONENT is its own default. */
export function defaultVariant(root: SerializedNode): SerializedNode {
  return root.type === 'COMPONENT_SET' && root.children?.length ? root.children[0] : root;
}

export function extractAnatomy(root: SerializedNode): AnatomyResult {
  const parts: AnatomyPart[] = [];
  const related = new Set<string>();
  for (const child of defaultVariant(root).children ?? []) {
    if (!child.visible) continue;
    const nested = child.type === 'INSTANCE';
    parts.push({ name: child.name, type: child.type, nested });
    if (nested && child.mainComponent) related.add(child.mainComponent.name);
  }
  return { parts, related: [...related] };
}
```

- [ ] **Step 4: Run tests** — Expected: PASS

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(extractor): anatomy + related atoms"`

### Task 7: Extract props, variants, and states

**Files:**
- Create: `packages/extractor/src/props.ts`
- Test: `packages/extractor/test/props.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { extractProps, extractVariants, extractStates } from '../src/props';
import button from './fixtures/button.json';
import type { SerializedNode } from '../src/tree';

const root = button as SerializedNode;

describe('props/variants/states', () => {
  it('extracts all property kinds', () => {
    const props = extractProps(root);
    expect(props).toContainEqual({ name: 'Style', kind: 'variant', options: ['Filled', 'Outlined'], default: 'Filled' });
    expect(props).toContainEqual({ name: 'Show icon', kind: 'boolean', options: undefined, default: false });
    expect(props.find((p) => p.name === 'Label')?.kind).toBe('text');
  });

  it('builds the variant matrix from variant props only', () => {
    expect(extractVariants(root)).toEqual([
      { prop: 'Style', values: ['Filled', 'Outlined'] },
      { prop: 'State', values: ['Enabled', 'Hovered', 'Disabled'] },
    ]);
  });

  it('derives states from a variant axis named State (case-insensitive)', () => {
    expect(extractStates(root)).toEqual(['Enabled', 'Hovered', 'Disabled']);
  });

  it('falls back to ["Default"] when no state axis exists', () => {
    const noState: SerializedNode = { ...root, propertyDefinitions: { Style: root.propertyDefinitions!['Style'] } };
    expect(extractStates(noState)).toEqual(['Default']);
  });
});
```

- [ ] **Step 2: Run to verify FAIL**, then **Step 3: Implement**

`packages/extractor/src/props.ts`:
```ts
import type { SerializedNode } from './tree';

export type PropKind = 'variant' | 'boolean' | 'text' | 'instanceSwap';
export interface ComponentProp { name: string; kind: PropKind; options?: string[]; default?: string | boolean }
export interface VariantAxis { prop: string; values: string[] }

const KIND_MAP: Record<string, PropKind> = {
  VARIANT: 'variant', BOOLEAN: 'boolean', TEXT: 'text', INSTANCE_SWAP: 'instanceSwap',
};

/** Figma encodes non-variant prop names as "Name#nodeId:n" — strip the suffix. */
const cleanName = (raw: string) => raw.split('#')[0];

export function extractProps(root: SerializedNode): ComponentProp[] {
  return Object.entries(root.propertyDefinitions ?? {}).map(([raw, def]) => ({
    name: cleanName(raw),
    kind: KIND_MAP[def.type],
    options: def.variantOptions,
    default: def.defaultValue,
  }));
}

export function extractVariants(root: SerializedNode): VariantAxis[] {
  return extractProps(root)
    .filter((p) => p.kind === 'variant')
    .map((p) => ({ prop: p.name, values: p.options ?? [] }));
}

export function extractStates(root: SerializedNode): string[] {
  const axis = extractVariants(root).find((v) => v.prop.toLowerCase() === 'state');
  return axis?.values.length ? axis.values : ['Default'];
}
```

Note for the fixture: the `Show icon` and `Label` keys in `propertyDefinitions` must use the raw Figma form (e.g. `"Show icon#1:5"`) so `cleanName` is actually exercised — adjust the fixture and the test's expectations accordingly if you wrote bare names in Task 5.

- [ ] **Step 4: Run tests** — Expected: PASS
- [ ] **Step 5: Commit** — `git commit -am "feat(extractor): props, variant matrix, states heuristic"`

### Task 8: Extract token bindings + gaps

**Files:**
- Create: `packages/extractor/src/tokens.ts`
- Test: `packages/extractor/test/tokens.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { extractTokens, extractGaps } from '../src/tokens';
import button from './fixtures/button.json';
import type { SerializedNode } from '../src/tree';

const root = button as SerializedNode;

describe('tokens', () => {
  it('collects bindings per part across the default variant', () => {
    expect(extractTokens(root)).toContainEqual(
      { part: 'container', property: 'fills', token: 'md.sys.color.primary' },
    );
    expect(extractTokens(root)).toContainEqual(
      { part: 'label', property: 'fills', token: 'md.sys.color.on-primary' },
    );
  });

  it('reports unbound paints as gaps, including on invisible layers', () => {
    expect(extractGaps(root)).toContainEqual(
      { part: 'debug-overlay', issue: 'hardcoded paint (no variable or style)' },
    );
  });
});
```

- [ ] **Step 2: Run to verify FAIL**, then **Step 3: Implement**

`packages/extractor/src/tokens.ts`:
```ts
import type { SerializedNode } from './tree';
import { defaultVariant } from './anatomy';

export interface TokenBinding { part: string; property: string; token: string }
export interface Gap { part: string; issue: string }

function walk(node: SerializedNode, visit: (n: SerializedNode) => void): void {
  visit(node);
  node.children?.forEach((c) => walk(c, visit));
}

export function extractTokens(root: SerializedNode): TokenBinding[] {
  const out: TokenBinding[] = [];
  walk(defaultVariant(root), (n) => {
    for (const b of n.bindings ?? []) out.push({ part: n.name, property: b.property, token: b.token });
  });
  return out;
}

export function extractGaps(root: SerializedNode): Gap[] {
  const out: Gap[] = [];
  walk(defaultVariant(root), (n) => {
    if (n.hasUnboundPaint) out.push({ part: n.name, issue: 'hardcoded paint (no variable or style)' });
  });
  return out;
}
```

- [ ] **Step 4: Run tests** — Expected: PASS
- [ ] **Step 5: Commit** — `git commit -am "feat(extractor): token bindings + gaps report"`

### Task 9: Orchestrator + content hash

**Files:**
- Create: `packages/extractor/src/extract.ts`, `packages/extractor/src/hash.ts`, `packages/extractor/src/index.ts`
- Test: `packages/extractor/test/extract.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { extract } from '../src/extract';
import { contentHash } from '../src/hash';
import button from './fixtures/button.json';
import type { SerializedNode } from '../src/tree';

const root = button as SerializedNode;
const meta = { figmaFile: 'FILE1' };

describe('extract', () => {
  it('assembles the full intermediate spec', () => {
    const spec = extract(root, meta);
    expect(spec.name).toBe(root.name);
    expect(spec.anatomy.length).toBeGreaterThan(0);
    expect(spec.props.length).toBe(4);
    expect(spec.states).toEqual(['Enabled', 'Hovered', 'Disabled']);
    expect(spec.tokens.length).toBeGreaterThan(0);
    expect(spec.gaps.length).toBe(1);
  });

  it('hash is stable across key order and changes when content changes', () => {
    const a = extract(root, meta);
    expect(contentHash(a)).toBe(contentHash(JSON.parse(JSON.stringify(a))));
    const b = extract({ ...root, name: 'Button2' }, meta);
    expect(contentHash(a)).not.toBe(contentHash(b));
  });
});
```

- [ ] **Step 2: Run to verify FAIL**, then **Step 3: Implement**

`packages/extractor/src/hash.ts`:
```ts
import { sha256 } from 'js-sha256';

/** Canonical JSON: object keys sorted recursively, then SHA-256. */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`);
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value);
}

export const contentHash = (value: unknown): string => sha256(canonical(value));
```

`packages/extractor/src/extract.ts`:
```ts
import type { SerializedNode } from './tree';
import { extractAnatomy, type AnatomyPart } from './anatomy';
import { extractProps, extractVariants, extractStates, type ComponentProp, type VariantAxis } from './props';
import { extractTokens, extractGaps, type TokenBinding, type Gap } from './tokens';

export interface IntermediateSpec {
  name: string;
  figmaKey: string;
  figmaFile: string;
  figmaNode: string;
  anatomy: AnatomyPart[];
  props: ComponentProp[];
  variants: VariantAxis[];
  states: string[];
  tokens: TokenBinding[];
  related: string[];
  gaps: Gap[];
}

export function extract(root: SerializedNode, meta: { figmaFile: string }): IntermediateSpec {
  const { parts, related } = extractAnatomy(root);
  return {
    name: root.name,
    figmaKey: root.key ?? '',
    figmaFile: meta.figmaFile,
    figmaNode: root.id,
    anatomy: parts,
    props: extractProps(root),
    variants: extractVariants(root),
    states: extractStates(root),
    tokens: extractTokens(root),
    related,
    gaps: extractGaps(root),
  };
}
```

`packages/extractor/src/index.ts`: re-export everything public.

- [ ] **Step 4: Run all tests** — `npx vitest run` — Expected: PASS (all packages)
- [ ] **Step 5: Commit** — `git commit -am "feat(extractor): orchestrator + canonical content hash"`

### Task 10: Markdown renderer (golden-file test)

**Files:**
- Create: `packages/extractor/src/render.ts`
- Test: `packages/extractor/test/render.test.ts`, `packages/extractor/test/fixtures/button.golden.md`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { extract } from '../src/extract';
import { renderSpec } from '../src/render';
import { parseFrontmatter } from '@spec-layer/format';
import button from './fixtures/button.json';
import type { SerializedNode } from '../src/tree';

describe('renderSpec', () => {
  const md = renderSpec(extract(button as SerializedNode, { figmaFile: 'FILE1' }), {
    prose: null, // degraded mode: no LLM
    extractedAt: '2026-06-10T00:00:00.000Z',
  });

  it('matches the golden file', () => {
    const golden = fs.readFileSync(new URL('./fixtures/button.golden.md', import.meta.url), 'utf8');
    expect(md).toBe(golden);
  });

  it('round-trips through the format parser with status draft', () => {
    const { frontmatter } = parseFrontmatter(md);
    expect(frontmatter.status).toBe('draft');
    expect(frontmatter.content_hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('judgment sections carry the draft marker', () => {
    for (const section of ['## Definition', '## Code', '## Accessibility', "## Do's & Don'ts"]) {
      const idx = md.indexOf(section);
      expect(md.slice(idx, idx + 200)).toContain('> ⚠️ Draft — AI-suggested, not yet approved.');
    }
  });
});
```

- [ ] **Step 2: Implement `renderSpec`**

`packages/extractor/src/render.ts` renders the 10 sections in SPEC.md order from an `IntermediateSpec` plus an optional `prose` object:

```ts
import type { IntermediateSpec } from './extract';
import { contentHash } from './hash';
import { serializeFrontmatter, type SpecFrontmatter } from '@spec-layer/format';

export interface ProseDrafts {
  definition: string;
  accessibility: string;
  dos: string[];
  donts: string[];
}

const DRAFT = `> ⚠️ Draft — AI-suggested, not yet approved.\n`;

export function renderSpec(
  spec: IntermediateSpec,
  opts: { prose: ProseDrafts | null; extractedAt: string },
): string {
  const fm: SpecFrontmatter = {
    spec_version: '0.1',
    status: 'draft',
    component: { name: spec.name, figma_key: spec.figmaKey, figma_file: spec.figmaFile, figma_node: spec.figmaNode },
    content_hash: contentHash(spec),
    extracted_at: opts.extractedAt,
  };
  const p = opts.prose;
  const lines: string[] = [
    `# ${spec.name}`,
    '',
    '## Definition', '', DRAFT, p?.definition ?? '_To be written._', '',
    '## Anatomy', '',
    ...spec.anatomy.map((a) => `- **${a.name}** (${a.type.toLowerCase()})${a.nested ? ' — nested component' : ''}`), '',
    '## Configuration', '',
    '| Name | Kind | Options | Default |', '|---|---|---|---|',
    ...spec.props.map((pr) => `| ${pr.name} | ${pr.kind} | ${pr.options?.join(', ') ?? '—'} | ${pr.default ?? '—'} |`), '',
    '## Variants', '',
    ...spec.variants.map((v) => `- **${v.prop}**: ${v.values.join(' · ')}`), '',
    '## States', '', ...spec.states.map((s) => `- ${s}`), '',
    '## Tokens used', '',
    '| Part | Property | Token |', '|---|---|---|',
    ...spec.tokens.map((t) => `| ${t.part} | ${t.property} | \`${t.token}\` |`), '',
    '## Code', '', DRAFT, '_Import path, prop mapping, and usage example to be filled in._', '',
    '## Accessibility', '', DRAFT, p?.accessibility ?? '_To be written._', '',
    "## Do's & Don'ts", '', DRAFT,
    ...(p ? [...p.dos.map((d) => `- ✅ ${d}`), ...p.donts.map((d) => `- ❌ ${d}`)] : ['_To be written._']), '',
    '## Related atoms', '',
    ...(spec.related.length ? spec.related.map((r) => `- ${r}`) : ['_None._']), '',
  ];
  if (spec.gaps.length) {
    lines.push('## Extraction gaps', '', ...spec.gaps.map((g) => `- **${g.part}**: ${g.issue}`), '');
  }
  return serializeFrontmatter(fm, lines.join('\n'));
}
```

- [ ] **Step 3: Generate the golden file once, review it by hand**

Run a one-off script (`npx tsx -e "..."` — `tsx` is fetched ad hoc by npx, not a project dependency) that renders the fixture and writes `button.golden.md`. **Read the output carefully against SPEC.md before committing** — the golden file is the format conformance contract, and its headings must match SPEC.md's canonical headings verbatim.

- [ ] **Step 4: Run all tests** — Expected: PASS
- [ ] **Step 5: Commit** — `git commit -am "feat(extractor): markdown renderer with golden-file conformance test"`

### Task 11: Prose layer — prompt builder, response parsing, cache logic

**Files:**
- Create: `packages/extractor/src/prose/prompt.ts`, `packages/extractor/src/prose/client.ts`
- Test: `packages/extractor/test/prose.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, vi } from 'vitest';
import { buildProsePrompt, parseProseResponse } from '../src/prose/prompt';
import { draftProse } from '../src/prose/client';
import { extract } from '../src/extract';
import button from './fixtures/button.json';
import type { SerializedNode } from '../src/tree';

const spec = extract(button as SerializedNode, { figmaFile: 'FILE1' });

describe('prose', () => {
  it('prompt contains the parsed summary, never raw node JSON', () => {
    const prompt = buildProsePrompt(spec);
    expect(prompt).toContain('Style: Filled · Outlined');
    expect(prompt).not.toContain('"id"'); // no serialized-node internals
  });

  it('parses a valid JSON response', () => {
    const out = parseProseResponse('{"definition":"A button.","accessibility":"Use a real <button>.","dos":["x"],"donts":["y"]}');
    expect(out.definition).toBe('A button.');
  });

  it('throws on malformed responses', () => {
    expect(() => parseProseResponse('not json')).toThrow();
  });

  it('cache hit skips the API call', async () => {
    const fetcher = vi.fn();
    const cache = new Map([[spec ? 'k' : '', '']]);
    const cached = { definition: 'cached', accessibility: '', dos: [], donts: [] };
    const store = { get: vi.fn(async () => JSON.stringify(cached)), set: vi.fn() };
    const result = await draftProse(spec, { apiKey: 'sk-test', fetcher, cacheStore: store });
    expect(result).toEqual(cached);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('returns null (degraded mode) when no API key is set', async () => {
    const store = { get: vi.fn(async () => null), set: vi.fn() };
    const result = await draftProse(spec, { apiKey: null, fetcher: vi.fn(), cacheStore: store });
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 2: Implement**

`packages/extractor/src/prose/prompt.ts` — `buildProsePrompt(spec)` renders a compact human-readable summary (name, anatomy part names, prop table, variant axes as `Style: Filled · Outlined`, states, token names) and instructs: *"Return ONLY a JSON object: {definition, accessibility, dos: string[], donts: string[]}. definition: one paragraph, specific to this component's actual props and variants — no generic filler. accessibility: notes for this component pattern, flagging what cannot be known from the design file. dos/donts: 3–5 each, derived from the variant/state structure."* `parseProseResponse(text)` strips code fences if present, `JSON.parse`s, and validates the four fields.

`packages/extractor/src/prose/client.ts`:
```ts
import type { IntermediateSpec } from '../extract';
import { contentHash } from '../hash';
import { buildProsePrompt, parseProseResponse, type ProseDrafts } from './prompt';

export interface CacheStore { get(key: string): Promise<string | null>; set(key: string, value: string): Promise<void> }

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
      'anthropic-dangerous-direct-browser-access': 'true', // call originates in the plugin UI iframe
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
```

(`ProseDrafts` moves to `prompt.ts`; `render.ts` imports it from there.)

- [ ] **Step 3: Run all tests** — Expected: PASS
- [ ] **Step 4: Commit** — `git commit -am "feat(extractor): prose layer with hash-keyed cache and degraded mode"`

### Task 12: Plugin scaffold + node serializer

**Files:**
- Create: `packages/plugin/package.json`, `packages/plugin/manifest.json`, `packages/plugin/build.mjs`
- Create: `packages/plugin/src/main.ts`, `packages/plugin/src/serialize.ts`, `packages/plugin/src/messages.ts`
- Test: `packages/plugin/test/serialize.test.ts`

- [ ] **Step 1: Scaffold**

`packages/plugin/manifest.json`:
```json
{
  "name": "Spec Layer",
  "id": "spec-layer-dev",
  "api": "1.0.0",
  "main": "dist/main.js",
  "ui": "dist/ui.html",
  "editorType": ["figma"],
  "networkAccess": { "allowedDomains": ["https://api.anthropic.com"] }
}
```

`packages/plugin/package.json` deps: `@spec-layer/extractor`, `@spec-layer/format`; devDeps: `esbuild`, `@figma/plugin-typings`. `build.mjs`: two esbuild builds — `src/main.ts → dist/main.js` (iife, no DOM lib) and `src/ui/ui.ts` inlined into `dist/ui.html`. Note: `src/ui/ui.ts` is created in Task 13 — the build is first run there; don't run `build.mjs` during this task.

`src/messages.ts` — the typed protocol between main thread and UI:
```ts
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
```

- [ ] **Step 2: Write the serializer test (failing)**

The serializer is the one boundary piece worth testing: feed it a **mock Figma node object** (plain object mimicking the plugin API surface: `boundVariables` with variable IDs, async `getVariableByIdAsync` stub on a passed-in `resolver`) and assert it produces the `SerializedNode` contract — bindings resolved to names, `hasUnboundPaint` set when a solid paint has no `boundVariables.fills` and no `fillStyleId`.

`packages/plugin/test/serialize.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { serializeNode } from '../src/serialize';

const resolver = {
  variableName: async (id: string) => ({ 'VariableID:1': 'md.sys.color.primary' }[id] ?? null),
  styleName: async (_id: string) => null,
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
});
```

- [ ] **Step 3: Implement `serialize.ts`**

`serializeNode(node, resolver)` walks recursively (children via `node.children`), copies id/name/type/visible/key, reads `componentPropertyDefinitions` (in a try/catch — Figma throws on variant children), resolves `boundVariables` entries through `resolver.variableName(id)` and style IDs through `resolver.styleName(id)`, sets `hasUnboundPaint` when a visible SOLID fill has neither binding nor style, and maps INSTANCE main components via `mainComponent` (passed pre-resolved by `main.ts`, since `getMainComponentAsync` is async — resolver gets a third method `mainComponent(node)`). Keep it under ~80 lines; everything clever lives in the extractor.

`src/main.ts`: `figma.showUI(__html__, { width: 480, height: 640 })`; on selection change and on `requestSelection`, find the selected COMPONENT/COMPONENT_SET (walk up from selection; post `{ type: 'selection', node: null }` with a notify if none), serialize, post to UI with `figma.fileKey ?? 'unknown'`. Handle `setApiKey`/`cacheGet`/`cacheSet` against `figma.clientStorage`. No other logic in the main thread.

- [ ] **Step 4: Run tests** — `npx vitest run packages/plugin` — Expected: PASS
- [ ] **Step 5: Commit** — `git commit -am "feat(plugin): scaffold, message protocol, boundary serializer"`

### Task 13: Plugin UI — preview, review/edit, approve, export

**Files:**
- Create: `packages/plugin/src/ui/ui.ts`, `packages/plugin/src/ui/ui.html`, `packages/plugin/src/ui/state.ts`
- Test: `packages/plugin/test/state.test.ts`

The UI is vanilla TS (no framework — keep the bundle small and the surface thin). All decision logic lives in `state.ts` (pure, tested); `ui.ts` is DOM wiring only.

- [ ] **Step 1: Write the failing state test**

`state.ts` owns the screen state machine and the approve transition:

```ts
import { describe, it, expect } from 'vitest';
import { approveSpec } from '../src/ui/state';

describe('approveSpec', () => {
  const draft = `---\nspec_version: "0.1"\nstatus: draft\ncomponent:\n  name: Button\n  figma_key: k\n  figma_file: f\n  figma_node: "1:1"\ncontent_hash: abc\nextracted_at: "2026-06-10T00:00:00.000Z"\n---\n\n## Definition\n\n> ⚠️ Draft — AI-suggested, not yet approved.\nA button.\n`;

  it('flips status, stamps approver, strips draft markers', () => {
    const approved = approveSpec(draft, 'Alex');
    expect(approved).toContain('status: approved');
    expect(approved).toContain('approved_by: Alex');
    expect(approved).not.toContain('⚠️ Draft');
  });
});
```

- [ ] **Step 2: Implement `state.ts`**

`approveSpec(md, approver)`: `parseFrontmatter` → set `status: 'approved'`, `approved_by` → remove all draft-marker lines from the body → `serializeFrontmatter`. Also export a small reducer for UI state: `idle → extracting → drafting (LLM) → review → approved`, with `prose-failed` falling through to `review` (degraded mode).

- [ ] **Step 3: Build `ui.ts` + `ui.html`**

Flow: on load, request selection → render component name + "Extract" button → on extract: run `extract()` + `renderSpec()` immediately (structural sections appear instantly), then `draftProse()` (cache store backed by `cacheGet`/`cacheSet` messages; fetcher = window fetch) and re-render with prose → review screen shows the Markdown in a `<textarea>` (v1 review = direct editing; per-section UI is later polish) with the draft sections highlighted above it → "Approve" runs `approveSpec` → "Download .md" creates a Blob download named `<kebab-case-name>.md`. Settings row: API key input (posts `setApiKey`), note that no key = no AI drafts. Errors (LLM failure, no selection) render as a dismissible banner; export always works.

- [ ] **Step 4: Run tests + build**

Run: `npx vitest run && node packages/plugin/build.mjs`
Expected: tests PASS, `dist/main.js` + `dist/ui.html` produced.

- [ ] **Step 5: Commit** — `git commit -am "feat(plugin): review/approve/export UI"`

### Task 14: End-to-end manual verification against Material 3

**Files:**
- Create: `packages/plugin/TESTING.md`

- [ ] **Step 1: Write the manual test script**

`TESTING.md` checklist (Figma plugin e2e tooling is poor — this is the release gate):
1. Import plugin via Figma → Plugins → Development → Import from manifest.
2. Open a draft copy of the Material 3 Design Kit.
3. Select the **Button** component set → Extract → verify: anatomy parts match layers, props table matches the kit's properties panel, variant axes complete, tokens show `md.sys.*` names, no raw variable IDs anywhere.
4. With no API key: prose sections show empty templates with draft markers; export works.
5. Add API key → re-extract → prose drafts appear; re-extract again → instant (cache hit — verify no second API call via network panel).
6. Edit the definition, Approve → frontmatter flips, markers gone → Download → file parses (`npx vitest run packages/format` includes it manually or run a quick parse script).
7. Repeat extraction on **Text field** and **Dialog**; for each, note mismatches in TESTING.md under "Known gaps."
8. Select a plain frame (not a component) → friendly error, no crash.

- [ ] **Step 2: Execute the checklist, fix what it finds**

Fixes found here go through the normal loop: reproduce as a fixture test in the extractor if the bug is extraction logic; fix; re-run.

- [ ] **Step 3: Commit** — `git commit -am "test(plugin): manual verification script + fixes from Material 3 run"`

### Task 15: README + demo polish (Phase 1 exit)

- [ ] **Step 1:** Update root `README.md`: what it is, the positioning sentence, GIF placeholder, "try it" instructions (import manifest), link to SPEC.md and examples, roadmap (Phases 2–3), license (MIT).
- [ ] **Step 2:** Commit. **Phase 1 exit criterion met:** a designer with the plugin and zero accounts can extract, review, approve, and download a spec for a real component. This is the demo for build-in-public posts and the Week-6 decision point.

---

## Phases 2–3 — milestone level (planned in detail only if Week-6 signal is positive)

**Phase 2 — Library + Drift (Wk 7–10):**
- GitHub sync from the plugin: fine-grained PAT stored in clientStorage; commit specs to a configurable repo/path via the GitHub contents API; conflicts → new branch + PR, never force-push to main.
- Drift check: re-extract selection → recompute `IntermediateSpec` → structural diff against the stored spec's frontmatter `content_hash` and section content; classify **breaking** (prop removed/renamed, token changed, variant axis changed) vs **cosmetic** (layer rename with same bindings); render a drift report screen in the plugin. Diff operates on intermediate JSON, never on MD text.
- Code-section editing in the approve step (import path, prop-mapping table).
- New tests: fixture pairs (before/after trees) asserting severity classification.

**Phase 3 — AI Layer (Wk 11–14):**
- `packages/mcp`: OSS MCP server (npm, stdio) over a folder of spec files — `get_spec(name)`, `search_components(query)`, `list_tokens()`. Reuses `@spec-layer/format` parser. Integration-tested against `spec/examples/`. Open question carried from spec review: `list_tokens` aggregation semantics — resolve when building it.
- Hosted endpoint (Vercel) backed by a team's GitHub spec repo: same tool surface + auth. Team-tier anchor.

**Parallel from Wk 3:** build-in-public posts at each milestone (Task 10's golden spec, Task 14's demo, Phase 2 drift report). **Week-6 decision point:** real pull → Phase 2; silence → format + consulting positioning, nothing wasted.
