# Extraction Depth Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the deterministic Figma extraction capture per-variant token diffs, typography/effect styles, and layout values, so specs document what changes between states and the AI prose pass gets dramatically richer context at zero added API cost.

**Architecture:** The pipeline is `plugin/serialize.ts` (Figma node → `SerializedNode` JSON) → `extractor` (pure functions over `SerializedNode` → `IntermediateSpec`) → `render.ts` (markdown) + `prose/prompt.ts` (LLM prompt). We extend each stage: the serializer captures more raw signal, the extractor walks ALL variants (not just the default) and diffs them, gaps detection covers typography/spacing/radius, and the prompt includes the new context. The spec format (10 fixed sections) does NOT change — variant diffs use the property-qualifier pattern already blessed by SPEC.md's example (`opacity (hovered)`), and layout data feeds only the prose prompt and the gaps section.

**Tech Stack:** TypeScript, vitest (run from repo root with `npx vitest run`), npm workspaces. No new dependencies.

**Repo:** `/Users/sandrolek/Documents/Projects/Design System Docs`, branch `feat/extraction-depth`. Run all commands from the repo root. `npm test` runs the full suite; `npm run typecheck` type-checks all three packages.

**Key invariants to preserve:**
- The spec format's 10 sections and their table schemas are frozen (see `spec/SPEC.md` §4). The `Tokens used` table stays `| Part | Property | Token |` — variant context goes into the Property cell as a parenthetical qualifier, e.g. `fills (State=Hovered)`.
- `IntermediateSpec` feeds `contentHash` (the drift-detection/LLM-cache key), so adding fields changes hashes. The golden file's `content_hash` will change — that is expected; regenerate via the `UPDATE_GOLDEN` mechanism added in Task 1.
- The default variant is `children[0]` of a COMPONENT_SET (`defaultVariant` in `packages/extractor/src/anatomy.ts`). Unqualified token rows and all gap/layout extraction refer to the default variant; other variants contribute only qualified diff rows.

---

### Task 1: Per-variant token extraction with variant diff

The biggest correctness gap: `extractTokens` only walks the default variant, so hover/disabled/etc. token changes are silently dropped. Walk every variant child, diff its bindings against the default, and emit qualified rows for what differs.

**Files:**
- Modify: `packages/extractor/src/tokens.ts`
- Modify: `packages/extractor/test/fixtures/button.json`
- Modify: `packages/extractor/test/tokens.test.ts`
- Modify: `packages/extractor/test/render.test.ts` (add UPDATE_GOLDEN mechanism)
- Regenerate: `packages/extractor/test/fixtures/button.golden.md`

- [ ] **Step 1: Extend the fixture with a Hovered variant**

In `packages/extractor/test/fixtures/button.json`, append a third entry to the top-level `children` array (after the `Style=Outlined, State=Enabled` object):

```json
{
  "id": "1:110",
  "name": "Style=Filled, State=Hovered",
  "type": "COMPONENT",
  "visible": true,
  "children": [
    {
      "id": "1:111",
      "name": "container",
      "type": "FRAME",
      "visible": true,
      "bindings": [
        { "property": "fills", "token": "md.sys.color.primary-hover" },
        { "property": "cornerRadius", "token": "md.sys.shape.corner.full" }
      ]
    },
    {
      "id": "1:112",
      "name": "label",
      "type": "TEXT",
      "visible": true,
      "bindings": [
        { "property": "fills", "token": "md.sys.color.on-primary" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Write the failing tests**

In `packages/extractor/test/tokens.test.ts`, add inside the existing `describe('tokens', ...)` block (and add `variantDelta` to the import from `../src/tokens`):

```ts
  it('emits qualified rows for bindings that differ from the default variant', () => {
    const tokens = extractTokens(root);
    // Hovered container fill differs from default → qualified row
    expect(tokens).toContainEqual(
      { part: 'container', property: 'fills (State=Hovered)', token: 'md.sys.color.primary-hover' },
    );
    // Outlined adds a stroke absent on the default → qualified row
    expect(tokens).toContainEqual(
      { part: 'container', property: 'strokes (Style=Outlined)', token: 'md.sys.color.outline' },
    );
    // Outlined label fill differs from default → qualified row
    expect(tokens).toContainEqual(
      { part: 'label', property: 'fills (Style=Outlined)', token: 'md.sys.color.primary' },
    );
  });

  it('skips variant bindings identical to the default (no noise rows)', () => {
    const tokens = extractTokens(root);
    // cornerRadius is the same token on every variant → only the unqualified row exists
    const radiusRows = tokens.filter((t) => t.property.startsWith('cornerRadius'));
    expect(radiusRows).toEqual([
      { part: 'container', property: 'cornerRadius', token: 'md.sys.shape.corner.full' },
    ]);
    // Hovered label fill matches the default → no "fills (State=Hovered)" row for label
    expect(tokens).not.toContainEqual(
      expect.objectContaining({ part: 'label', property: 'fills (State=Hovered)' }),
    );
  });

  it('variantDelta reports only the differing axes', () => {
    expect(variantDelta('Style=Filled, State=Enabled', 'Style=Filled, State=Hovered')).toBe('State=Hovered');
    expect(variantDelta('Style=Filled, State=Enabled', 'Style=Outlined, State=Hovered')).toBe('Style=Outlined, State=Hovered');
    // unparseable names fall back to the full variant name
    expect(variantDelta('Default', 'Fancy Variant')).toBe('Fancy Variant');
  });
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run packages/extractor/test/tokens.test.ts`
Expected: FAIL — `variantDelta` is not exported; qualified rows missing.

- [ ] **Step 4: Implement per-variant extraction**

Replace `extractTokens` in `packages/extractor/src/tokens.ts` and add the helpers (keep `walk`, `extractGaps`, and the interfaces as they are):

```ts
/** Parse "Style=Filled, State=Enabled" into { Style: 'Filled', State: 'Enabled' }; null if any segment is not Axis=Value. */
function parseVariantName(name: string): Record<string, string> | null {
  const out: Record<string, string> = {};
  for (const segment of name.split(',')) {
    const [axis, ...rest] = segment.split('=');
    if (!rest.length) return null;
    out[axis.trim()] = rest.join('=').trim();
  }
  return out;
}

/**
 * Human-readable delta between a variant and the default variant: only the
 * axes whose value differs, e.g. "State=Hovered". Falls back to the full
 * variant name when either name is not Axis=Value shaped.
 */
export function variantDelta(defaultName: string, variantName: string): string {
  const def = parseVariantName(defaultName);
  const cur = parseVariantName(variantName);
  if (!def || !cur) return variantName;
  const diffs = Object.entries(cur)
    .filter(([axis, value]) => def[axis] !== value)
    .map(([axis, value]) => `${axis}=${value}`);
  return diffs.length ? diffs.join(', ') : variantName;
}

export function extractTokens(root: SerializedNode): TokenBinding[] {
  const out: TokenBinding[] = [];
  const seen = new Set<string>();
  const push = (part: string, property: string, token: string) => {
    const key = `${part}\0${property}\0${token}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({ part, property, token });
    }
  };

  // Default variant: unqualified rows, and the baseline for diffing.
  const def = defaultVariant(root);
  const baseline = new Map<string, string>(); // "part\0property" -> token
  walk(def, (n) => {
    for (const b of n.bindings ?? []) {
      baseline.set(`${n.name}\0${b.property}`, b.token);
      push(n.name, b.property, b.token);
    }
  });

  // Other variants: only bindings that differ from the baseline, qualified
  // with the axes that distinguish the variant, e.g. "fills (State=Hovered)".
  if (root.type !== 'COMPONENT_SET') return out;
  for (const variant of (root.children ?? []).slice(1)) {
    const delta = variantDelta(def.name, variant.name);
    walk(variant, (n) => {
      for (const b of n.bindings ?? []) {
        if (baseline.get(`${n.name}\0${b.property}`) === b.token) continue;
        push(n.name, `${b.property} (${delta})`, b.token);
      }
    });
  }
  return out;
}
```

- [ ] **Step 5: Run the tokens tests to verify they pass**

Run: `npx vitest run packages/extractor/test/tokens.test.ts`
Expected: PASS (all tests, including the existing three).

- [ ] **Step 6: Add the UPDATE_GOLDEN mechanism and regenerate the golden file**

In `packages/extractor/test/render.test.ts`, replace the `matches the golden file` test with:

```ts
  it('matches the golden file', () => {
    const goldenUrl = new URL('./fixtures/button.golden.md', import.meta.url);
    if (process.env.UPDATE_GOLDEN) fs.writeFileSync(goldenUrl, md);
    const golden = fs.readFileSync(goldenUrl, 'utf8');
    expect(md).toBe(golden);
  });
```

Then regenerate: `UPDATE_GOLDEN=1 npx vitest run packages/extractor/test/render.test.ts`

Inspect the diff with `git diff packages/extractor/test/fixtures/button.golden.md` and verify the Tokens used table gained EXACTLY these three rows (after the existing three) and the `content_hash` changed:

```
| container | strokes (Style=Outlined) | `md.sys.color.outline` |
| label | fills (Style=Outlined) | `md.sys.color.primary` |
| container | fills (State=Hovered) | `md.sys.color.primary-hover` |
```

- [ ] **Step 7: Run the full suite**

Run: `npm test`
Expected: PASS. (If `extract.test.ts` or `prose.test.ts` fail, the failure must be understood — they should NOT be affected by this task.)

- [ ] **Step 8: Commit**

```bash
git add packages/extractor/src/tokens.ts packages/extractor/test/tokens.test.ts packages/extractor/test/render.test.ts packages/extractor/test/fixtures/button.json packages/extractor/test/fixtures/button.golden.md
git commit -m "feat(extractor): per-variant token extraction with variant diff"
```

---

### Task 2: Layout capture types, extractLayout, and extended gap detection

Add a `layout` field to `SerializedNode`, summarize it for the prose prompt, and extend gap detection beyond paints to typography, spacing, radius, and padding.

**Files:**
- Modify: `packages/extractor/src/tree.ts`
- Create: `packages/extractor/src/layout.ts`
- Modify: `packages/extractor/src/tokens.ts` (extractGaps)
- Modify: `packages/extractor/src/extract.ts`
- Modify: `packages/extractor/src/index.ts`
- Modify: `packages/extractor/test/fixtures/button.json`
- Modify: `packages/extractor/test/tokens.test.ts`, `packages/extractor/test/extract.test.ts`
- Create: `packages/extractor/test/layout.test.ts`
- Regenerate: `packages/extractor/test/fixtures/button.golden.md`

- [ ] **Step 1: Add the LayoutInfo type**

In `packages/extractor/src/tree.ts`, add after the `TokenRef` interface:

```ts
/** Auto-layout and shape values captured from the Figma node (only values > 0 are present). */
export interface LayoutInfo {
  mode?: 'HORIZONTAL' | 'VERTICAL';
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  itemSpacing?: number;
  cornerRadius?: number;
}
```

and add to `SerializedNode`:

```ts
  /** Auto-layout/shape values for this node, when present. */
  layout?: LayoutInfo;
```

- [ ] **Step 2: Add layout data to the fixture**

In `packages/extractor/test/fixtures/button.json`, add to the DEFAULT variant's `container` node (id `1:102`), as a sibling of `bindings`:

```json
"layout": { "mode": "HORIZONTAL", "paddingTop": 10, "paddingRight": 24, "paddingBottom": 10, "paddingLeft": 24, "itemSpacing": 8 }
```

- [ ] **Step 3: Write the failing tests**

Create `packages/extractor/test/layout.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { extractLayout } from '../src/layout';
import button from './fixtures/button.json';
import type { SerializedNode } from '../src/tree';

describe('extractLayout', () => {
  it('summarizes layout values per part from the default variant', () => {
    expect(extractLayout(button as SerializedNode)).toEqual([
      { part: 'container', summary: 'horizontal, padding 10/24/10/24, gap 8' },
    ]);
  });

  it('returns an empty list when no layout data exists', () => {
    const bare: SerializedNode = { id: '1', name: 'X', type: 'COMPONENT', visible: true };
    expect(extractLayout(bare)).toEqual([]);
  });
});
```

In `packages/extractor/test/tokens.test.ts`, add:

```ts
  it('flags TEXT parts with no text style or typography variable', () => {
    expect(extractGaps(root)).toContainEqual(
      { part: 'label', issue: 'no text style or typography variable' },
    );
  });

  it('flags hardcoded layout values not bound to variables', () => {
    const gaps = extractGaps(root);
    expect(gaps).toContainEqual({ part: 'container', issue: 'hardcoded itemSpacing (8px)' });
    expect(gaps).toContainEqual({ part: 'container', issue: 'hardcoded padding' });
    // cornerRadius IS bound on container → must NOT be flagged
    expect(gaps).not.toContainEqual(expect.objectContaining({ issue: expect.stringContaining('cornerRadius') }));
  });
```

In `packages/extractor/test/extract.test.ts`, update the gap-count assertion in `assembles the full intermediate spec` from `expect(spec.gaps.length).toBe(1)` to:

```ts
    expect(spec.gaps.length).toBe(4);
    expect(spec.layout).toEqual([
      { part: 'container', summary: 'horizontal, padding 10/24/10/24, gap 8' },
    ]);
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `npx vitest run packages/extractor/test/layout.test.ts packages/extractor/test/tokens.test.ts packages/extractor/test/extract.test.ts`
Expected: FAIL — `../src/layout` does not exist; gaps missing; `spec.layout` undefined.

- [ ] **Step 5: Implement layout.ts**

Create `packages/extractor/src/layout.ts`:

```ts
import type { SerializedNode, LayoutInfo } from './tree';
import { defaultVariant } from './anatomy';

export interface LayoutSummary { part: string; summary: string }

function fmt(l: LayoutInfo): string {
  const bits: string[] = [];
  if (l.mode) bits.push(l.mode.toLowerCase());
  const pads = [l.paddingTop ?? 0, l.paddingRight ?? 0, l.paddingBottom ?? 0, l.paddingLeft ?? 0];
  if (pads.some((p) => p > 0)) bits.push(`padding ${pads.join('/')}`);
  if (l.itemSpacing !== undefined) bits.push(`gap ${l.itemSpacing}`);
  if (l.cornerRadius !== undefined) bits.push(`radius ${l.cornerRadius}`);
  return bits.join(', ');
}

/** Layout summaries for the default variant's parts — feeds the prose prompt, not the rendered spec. */
export function extractLayout(root: SerializedNode): LayoutSummary[] {
  const out: LayoutSummary[] = [];
  const walk = (n: SerializedNode): void => {
    if (n.layout) {
      const summary = fmt(n.layout);
      if (summary) out.push({ part: n.name, summary });
    }
    n.children?.forEach(walk);
  };
  walk(defaultVariant(root));
  return out;
}
```

- [ ] **Step 6: Extend extractGaps**

In `packages/extractor/src/tokens.ts`, replace `extractGaps` with (add the two consts above it):

```ts
/** Properties that indicate a TEXT node's typography is governed by a style or variable. */
const TYPOGRAPHY_PROPS = ['typography', 'fontSize', 'fontFamily', 'fontStyle', 'fontWeight', 'lineHeight', 'letterSpacing'];
/** Bound-variable property names that cover padding. */
const PADDING_PROPS = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'verticalPadding', 'horizontalPadding'];

export function extractGaps(root: SerializedNode): Gap[] {
  const out: Gap[] = [];
  walk(defaultVariant(root), (n) => {
    const bound = new Set((n.bindings ?? []).map((b) => b.property));
    if (n.hasUnboundPaint) {
      out.push({ part: n.name, issue: 'hardcoded paint (no variable or style)' });
    }
    if (n.type === 'TEXT' && !TYPOGRAPHY_PROPS.some((p) => bound.has(p))) {
      out.push({ part: n.name, issue: 'no text style or typography variable' });
    }
    const l = n.layout;
    if (!l) return;
    if (l.itemSpacing !== undefined && !bound.has('itemSpacing')) {
      out.push({ part: n.name, issue: `hardcoded itemSpacing (${l.itemSpacing}px)` });
    }
    if (l.cornerRadius !== undefined && !bound.has('cornerRadius') && !bound.has('topLeftRadius')) {
      out.push({ part: n.name, issue: `hardcoded cornerRadius (${l.cornerRadius}px)` });
    }
    const pads = [l.paddingTop, l.paddingRight, l.paddingBottom, l.paddingLeft];
    if (pads.some((p) => p !== undefined) && !PADDING_PROPS.some((p) => bound.has(p))) {
      out.push({ part: n.name, issue: 'hardcoded padding' });
    }
  });
  return out;
}
```

- [ ] **Step 7: Wire into extract.ts and index.ts**

In `packages/extractor/src/extract.ts`: import `extractLayout, type LayoutSummary` from `./layout`, add `layout: LayoutSummary[];` to `IntermediateSpec`, and `layout: extractLayout(root),` to the returned object.

In `packages/extractor/src/index.ts`: add `export * from './layout';`

In `packages/extractor/test/render.test.ts`: the two hand-built `IntermediateSpec` literals (`Chip` and `Test`) each need `layout: [],` added to satisfy the type.

- [ ] **Step 8: Run tests, regenerate golden, verify diff**

Run: `npx vitest run packages/extractor` — expect only the golden test failing (hash + gaps changed).
Regenerate: `UPDATE_GOLDEN=1 npx vitest run packages/extractor/test/render.test.ts`
Verify with `git diff`: the Extraction gaps section must now read exactly:

```
- **container**: hardcoded itemSpacing (8px)
- **container**: hardcoded padding
- **label**: no text style or typography variable
- **debug-overlay**: hardcoded paint (no variable or style)
```

- [ ] **Step 9: Run full suite + typecheck**

Run: `npm test && npm run typecheck`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add packages/extractor
git commit -m "feat(extractor): layout capture, layout summaries, and extended gap detection"
```

---

### Task 3: Serializer enrichment (plugin)

The plugin serializer currently drops typography, effects, layout values, and all-but-the-first entry of array bindings. Capture them.

**Files:**
- Modify: `packages/plugin/src/serialize.ts`
- Modify: `packages/plugin/test/serialize.test.ts`

- [ ] **Step 1: Write the failing tests**

Add to `packages/plugin/test/serialize.test.ts` inside `describe('serializeNode', ...)`:

```ts
  it('resolves textStyleId to a typography binding', async () => {
    const r = { ...resolver, styleName: async () => 'md.sys.typescale.label-large' };
    const text = { id: '3:1', name: 'label', type: 'TEXT', visible: true, textStyleId: 'S:txt,1:1' };
    const out = await serializeNode(text as never, r);
    expect(out.bindings).toContainEqual({ property: 'typography', token: 'md.sys.typescale.label-large' });
  });

  it('resolves effectStyleId to an effects binding', async () => {
    const r = { ...resolver, styleName: async () => 'md.sys.elevation.level1' };
    const card = { id: '3:2', name: 'card', type: 'FRAME', visible: true, effectStyleId: 'S:fx,1:1' };
    const out = await serializeNode(card as never, r);
    expect(out.bindings).toContainEqual({ property: 'effects', token: 'md.sys.elevation.level1' });
  });

  it('resolves ALL entries of array-valued bound variables', async () => {
    const r = {
      ...resolver,
      variableName: async (id: string) =>
        (({ 'V:1': 'color/overlay', 'V:2': 'color/base' } as Record<string, string>)[id] ?? null),
    };
    const multi = { ...mockRect, boundVariables: { fills: [{ id: 'V:1' }, { id: 'V:2' }] } };
    const out = await serializeNode(multi as never, r);
    expect(out.bindings).toContainEqual({ property: 'fills', token: 'color/overlay' });
    expect(out.bindings).toContainEqual({ property: 'fills', token: 'color/base' });
  });

  it('captures auto-layout and corner radius values', async () => {
    const frame = {
      id: '3:3', name: 'container', type: 'FRAME', visible: true,
      layoutMode: 'HORIZONTAL', paddingTop: 10, paddingRight: 24, paddingBottom: 10, paddingLeft: 24,
      itemSpacing: 8, cornerRadius: 20,
    };
    const out = await serializeNode(frame as never, resolver);
    expect(out.layout).toEqual({
      mode: 'HORIZONTAL', paddingTop: 10, paddingRight: 24, paddingBottom: 10, paddingLeft: 24,
      itemSpacing: 8, cornerRadius: 20,
    });
  });

  it('omits layout entirely for non-auto-layout nodes with no radius', async () => {
    const out = await serializeNode(mockRect as never, resolver);
    expect(out.layout).toBeUndefined();
  });

  it('skips zero-valued layout fields and mixed (symbol) cornerRadius', async () => {
    const frame = {
      id: '3:4', name: 'row', type: 'FRAME', visible: true,
      layoutMode: 'VERTICAL', paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
      itemSpacing: 12, cornerRadius: Symbol('figma.mixed'),
    };
    const out = await serializeNode(frame as never, resolver);
    expect(out.layout).toEqual({ mode: 'VERTICAL', itemSpacing: 12 });
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run packages/plugin/test/serialize.test.ts`
Expected: FAIL — typography/effects bindings missing, second array entry missing, `out.layout` undefined.

- [ ] **Step 3: Implement serializer changes**

In `packages/plugin/src/serialize.ts`:

(a) Import `LayoutInfo`: change the type import to `import type { SerializedNode, PropertyDefinition, TokenRef, LayoutInfo } from '@spec-layer/extractor';`

(b) Extend `RawNode`:

```ts
  textStyleId?: string | symbol;
  effectStyleId?: string;
  layoutMode?: string;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  itemSpacing?: number;
  cornerRadius?: number | symbol; // figma.mixed when corners differ
```

(c) Replace the boundVariables loop to resolve ALL entries:

```ts
  for (const [property, value] of Object.entries(bv)) {
    const entries: RawBoundVar[] = Array.isArray(value) ? value : [value];
    for (const entry of entries) {
      if (!entry?.id) continue;
      const token = await resolver.variableName(entry.id);
      if (token && !bindings.some((b) => b.property === property && b.token === token)) {
        bindings.push({ property, token });
      }
    }
  }
```

(d) After the existing fill/stroke style-id resolution, add:

```ts
  if (typeof node.textStyleId === 'string' && node.textStyleId) {
    const token = await resolver.styleName(node.textStyleId);
    if (token) bindings.push({ property: 'typography', token });
  }
  if (node.effectStyleId) {
    const token = await resolver.styleName(node.effectStyleId);
    if (token) bindings.push({ property: 'effects', token });
  }
```

(e) Before the `--- Recurse children ---` block, add layout capture:

```ts
  // --- layout (auto-layout values + corner radius; only positive numbers) ---
  let layout: LayoutInfo | undefined;
  if (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL') {
    layout = { mode: node.layoutMode };
    const fields = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'itemSpacing'] as const;
    for (const k of fields) {
      const v = node[k];
      if (typeof v === 'number' && v > 0) layout[k] = v;
    }
  }
  if (typeof node.cornerRadius === 'number' && node.cornerRadius > 0) {
    layout = { ...(layout ?? {}), cornerRadius: node.cornerRadius };
  }
```

(f) Add to the result object spread: `...(layout ? { layout } : {}),`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run packages/plugin`
Expected: PASS (serialize, state, and integration tests).

- [ ] **Step 5: Full suite + typecheck, then commit**

Run: `npm test && npm run typecheck`
Expected: PASS.

```bash
git add packages/plugin/src/serialize.ts packages/plugin/test/serialize.test.ts
git commit -m "feat(plugin): serialize typography/effect styles, layout values, and all bound-variable entries"
```

---

### Task 4: Prose prompt enrichment

Feed the new signal to the LLM: layout summaries and an explanation of qualified token rows. No API changes — same model, same cache.

**Files:**
- Modify: `packages/extractor/src/prose/prompt.ts`
- Modify: `packages/extractor/test/prose.test.ts`

- [ ] **Step 1: Write the failing tests**

Add to `packages/extractor/test/prose.test.ts` inside `describe('prose', ...)`:

```ts
  it('prompt includes layout summaries for the default variant', () => {
    const prompt = buildProsePrompt(spec);
    expect(prompt).toContain('Layout (default variant):');
    expect(prompt).toContain('container: horizontal, padding 10/24/10/24, gap 8');
  });

  it('prompt explains qualified variant-diff tokens when present', () => {
    const prompt = buildProsePrompt(spec);
    expect(prompt).toContain('fills (State=Hovered)');
    expect(prompt).toContain('show what changes in that variant relative to the default');
  });

  it('prompt omits the layout block when there is no layout data', () => {
    const prompt = buildProsePrompt({ ...spec, layout: [], tokens: [] });
    expect(prompt).not.toContain('Layout (default variant):');
    expect(prompt).not.toContain('relative to the default');
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run packages/extractor/test/prose.test.ts`
Expected: FAIL — layout block and qualifier note missing.

- [ ] **Step 3: Implement prompt additions**

In `packages/extractor/src/prose/prompt.ts`, inside the Tokens block of `buildProsePrompt`, after the `for` loop that prints token lines, add:

```ts
    if (spec.tokens.some((t) => t.property.includes('('))) {
      lines.push(
        '  Note: properties qualified like "fills (State=Hovered)" show what changes in that variant relative to the default.',
      );
    }
```

After the Tokens block (before the Related block), add:

```ts
  // Layout
  if (spec.layout.length) {
    lines.push('');
    lines.push('Layout (default variant):');
    for (const l of spec.layout) {
      lines.push(`  ${l.part}: ${l.summary}`);
    }
  }
```

- [ ] **Step 4: Run tests to verify they pass, then full suite, then commit**

Run: `npx vitest run packages/extractor/test/prose.test.ts && npm test`
Expected: PASS.

```bash
git add packages/extractor/src/prose/prompt.ts packages/extractor/test/prose.test.ts
git commit -m "feat(extractor): include layout and variant-diff context in the prose prompt"
```

---

### Task 5: End-to-end integration verification

Prove the new signal flows through the whole pipeline: a Figma-shaped mock with a text style and auto-layout produces a spec whose Tokens table has a typography row and whose gaps flag hardcoded spacing.

**Files:**
- Modify: `packages/plugin/test/integration.test.ts`

- [ ] **Step 1: Write the failing test**

In `packages/plugin/test/integration.test.ts`:

(a) In `mockButtonSet`, extend the `label` node (id `1:103`) with `textStyleId: 'S:type,1:1'` and the `container` node (id `1:102`) with `layoutMode: 'HORIZONTAL', itemSpacing: 8`.

(b) Change the resolver's `styleName` to: `styleName: async (id) => (id === 'S:type,1:1' ? 'md.sys.typescale.label-large' : null),`

(c) Add a new test inside the describe block:

```ts
  it('typography styles and layout flow through serialize → extract → render', async () => {
    const node = await serializeNode(mockButtonSet as never, resolver);
    const spec = extract(node, { figmaFile: 'FILEKEY' });
    const md = renderSpec(spec, { prose: null, extractedAt: '2026-06-10T00:00:00.000Z' });

    // typography binding lands in the Tokens used table
    expect(md).toContain('| label | typography | `md.sys.typescale.label-large` |');
    // hardcoded itemSpacing is reported as a gap
    expect(md).toContain('- **container**: hardcoded itemSpacing (8px)');
    // layout summary is available to the prose pass
    expect(spec.layout).toContainEqual({ part: 'container', summary: 'horizontal, gap 8' });
  });
```

- [ ] **Step 2: Run to verify current state**

Run: `npx vitest run packages/plugin/test/integration.test.ts`
Expected: the new test PASSES already if Tasks 1–4 are correct (this is a verification task; if it fails, the failure is a real integration bug — debug it, do not weaken the test). The pre-existing tests must still pass — note the existing first test also asserts gap-free behavior implicitly; if adding `textStyleId`/layout breaks an existing assertion, update ONLY assertions that are genuinely affected by intended new behavior (e.g. a new gaps line appearing in output).

- [ ] **Step 3: Full suite + typecheck**

Run: `npm test && npm run typecheck`
Expected: PASS, all packages.

- [ ] **Step 4: Commit**

```bash
git add packages/plugin/test/integration.test.ts
git commit -m "test(plugin): end-to-end coverage for typography, layout, and variant-diff flow"
```
