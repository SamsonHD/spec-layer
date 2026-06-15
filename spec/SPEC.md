# Spec Layer Format v0.1

> **A portable contract between design and code.**

Spec Layer is an open standard for versioned, machine-parseable component specifications. Each spec captures the anatomy, configuration, tokens, code mapping, accessibility notes, and usage rules needed to build against a design-system component. Structural data is extracted deterministically; judgment content can be written by a human or generated with an optional AI-assisted pass.

**License:** MIT. The format, this document, and the reference examples are free to use, fork, and implement.

---

## 1. File Shape

Each component gets exactly one `.md` file. The file is structured as:

1. YAML frontmatter (between `---` fences) — identity and lifecycle metadata.
2. Body — exactly 10 Markdown sections in the canonical order defined in §4, using the verbatim headings listed there.

Renderers and parsers rely on the canonical headings and the fixed section order. Do not rename sections, reorder them, or add sections between them. An extractor may append a non-required `## Extraction gaps` section after the 10th section (see §4).

Filename convention (recommended, not enforced by the format): `<ComponentName>.md`, e.g. `Button.md`.

---

## 2. Frontmatter Schema

The YAML frontmatter encodes component identity and spec lifecycle. Every field below is part of the format; parsers MUST read all required fields and SHOULD surface optional fields when present.

| Field | Type | Required | Purpose |
|---|---|---|---|
| `spec_version` | string literal `"0.1"` | Yes | Format version (semver; v0.x may introduce breaking changes between minor versions). |
| `status` | enum: `draft` \| `approved` \| `deprecated` | No | Optional lifecycle label. Omit it entirely if you don't track lifecycle state; when present it renders as a badge. There is no enforced approval workflow. |
| `component.name` | string | Yes | Human-readable component name (e.g. `Button`). |
| `component.figma_key` | string | Yes | Stable Figma component key (survives renames and file moves). |
| `component.figma_file` | string | Yes | Figma file key (the `XXXX` segment of `figma.com/file/XXXX`). |
| `component.figma_node` | string | Yes | Figma node id of the component or component set. |
| `content_hash` | string | Yes | SHA-256 hex digest of the canonical JSON of the deterministic extraction (all object keys recursively sorted, no extra whitespace). Used as the drift-detection and LLM-cache key. |
| `extracted_at` | string | Yes | ISO 8601 timestamp of the last extraction run (e.g. `2026-06-10T14:32:00Z`). |
| `approved_by` | string | No | Optional, legacy. Name or identifier of an approver. No longer written by the tooling; retained only for backward compatibility with older files. |

### Complete frontmatter example

```yaml
---
spec_version: "0.1"
component:
  name: Button
  figma_key: abc123def456abc123def456abc123de
  figma_file: XYZFileKeyHere
  figma_node: 12:34
content_hash: a3f1c2e4b5d6a7f8e9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2
extracted_at: "2026-06-10T14:32:00Z"
---
```

### Hand-authored hash allowance

Hand-authored specs — those written or edited directly by a human, without going through an extractor — MAY use the following placeholder value for `content_hash`:

```
0000000000000000000000000000000000000000000000000000000000000000
```

(64 zero characters.) This signals that no deterministic extraction was run and drift detection is not applicable for this spec. Renderers and parsers MUST accept this value without error.

---

## 3. Authoring & Status

There is no mandatory draft-marker or approval workflow. Specs do not carry draft-marker blockquotes, and `status` is optional (see §2).

Four sections carry judgment content — **Definition**, **Code**, **Accessibility**, and **Do's & Don'ts** — and may be hand-written or, opt-in, drafted with AI. AI authoring is never forced: importing a component writes the structural spec only unless AI enrichment is explicitly requested. Drafted prose is written directly into these sections with no marker; authors edit it like any other content.

Deterministic sections (Anatomy, Configuration, Variants, States, Tokens used, Related atoms) are generated from the extraction.

---

## 4. Section Definitions

The body contains exactly 10 sections, in this order, with these exact headings.

---

### `## Definition`

**Kind:** Judgment (human/AI authored)

One paragraph describing the component's purpose, when to use it, and any primary usage constraints. It may be written by a human or by the optional prose pass and then edited like normal Markdown.

**Example:**

```markdown
## Definition

A Button triggers an action or navigation when activated. Use the primary variant
for the single most important action on a surface; secondary and tertiary variants
for supporting actions. Avoid placing more than one primary button in the same
visible area.
```

---

### `## Anatomy`

**Kind:** Deterministic (derived from the Figma node tree)

A numbered list of the named layers or parts that make up the component, in document order. Each item names the part. Nested components (instances of another component) are flagged with `(component)`. The numbering exists so prose, diagrams, or callouts elsewhere in the spec can reference parts by index ("see anatomy item 3").

**Shape:**

```markdown
## Anatomy

1. Container
2. Label
3. Leading icon (component)
4. Trailing icon (component)
5. State layer
```

---

### `## Configuration`

**Kind:** Deterministic (derived from component properties in the Figma node)

A table of the component's non-variant properties — its `boolean`, `text`, and `instanceSwap` options. Variant axes are documented in `## Variants` and `## States` instead, so they are not repeated here. When the component has no non-variant properties, the section body is the single value `_None._`. Columns:

| Column | Description |
|---|---|
| Name | The property name exactly as it appears in Figma. |
| Kind | One of: `boolean`, `text`, `instanceSwap`. |
| Options | For `boolean`: `true / false`. For `text` and `instanceSwap`: `—`. |
| Default | The default value as set in Figma. |

**Shape:**

```markdown
## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Disabled | boolean | true / false | false |
| Label | text | — | Button |
| Icon | instanceSwap | — | — |
```

---

### `## Variants`

**Kind:** Deterministic (derived from the Figma component set's variant axes)

A bulleted list of the component's style variant axes — every variant axis except the State axis (owned by `## States`). Each non-boolean axis is one bullet with its default value marked:

```
**AxisName**: Value (default) · Value · …
```

Boolean variant axes (values exactly `{true, false}`, e.g. `Danger`, `Disabled`, `Outline`) are toggles rather than style scales, so they are collected into a single `Modifiers` bullet listing their names. When there are no style axes or modifiers, the section body is `_None._`.

**Shape:**

```markdown
## Variants

- **Type**: Filled (default) · Outlined · Text · Elevated · Tonal
- **Size**: Small · Medium (default) · Large
- **Modifiers**: Danger · Disabled
```

---

### `## States`

**Kind:** Deterministic (derived from a variant axis named `State`; falls back to `Default` if no such axis exists)

A bulleted list of state names.

**Shape (with a State axis):**

```markdown
## States

- Default
- Hovered
- Focused
- Pressed
- Disabled
```

**Shape (fallback — no State axis found):**

```markdown
## States

- Default
```

---

### `## Tokens used`

**Kind:** Deterministic (derived from variable and style bindings on the node tree)

Token bindings are grouped into three `###` sub-sections by property kind, so that color decisions, typography, and geometry can be read independently:

| Sub-section | Properties it covers |
|---|---|
| `### Color` | `fill`, `border`, `background`, `color`, `outline` |
| `### Typography` | `typography`, `font-size`, `font-family`, `font-weight`, `font-style`, `line-height`, `letter-spacing` |
| `### Measurements` | everything else (e.g. `border-radius`, `padding`, `padding-x`, `padding-y`, `gap`) |

Empty sub-sections are omitted. When the component has no token bindings at all, the section body is the single value `_None._`.

**Color sub-section.** One `####` sub-table per part, in the order parts are first encountered during extraction (document order). Parts here are layer names from the full node tree — not limited to the `## Anatomy` list — and include synthetic parts such as `Container` (the variant root itself). Rows are `(property, state)`; columns are the values of the part's **column axis** — the non-State, non-boolean variant axis referenced by the most rules (typically `Type` or `Style`). The layout adapts to the part's bindings:

- The State column is dropped when no rule conditions on the State axis; the column axis collapses to a single `Token` column when no column axis applies.
- Boolean variant axes (values exactly `{true, false}`, e.g. `Danger`, `Disabled`, `Outline`) are split into bold `**When <Axis> = <value>**` sub-tables for each non-default value, so the base table stays focused on the default configuration.
- Cells with no binding render as `—`. When two equally-specific rules disagree on a cell, every claimed token is shown, joined with ` · ` (more-specific rules — those conditioning on more axes — otherwise win).
- Rules that condition on an axis outside the part's pivot (e.g. a second style axis like `Size`) are collected into a trailing `**Exceptions**` flat table (`Property | Condition | Token`) so the pivot stays clean while remaining lossless.
- Parts with three or fewer rules render as a single compact `Property | Condition | Token` table instead of a pivot.
- Parts whose bindings are all unconditioned are merged into one shared `#### Fixed` table at the end of `### Color`, with columns `Part | Property | Token`.

A part falls back to a flat whole-part `Property | Condition | Token` table only for degenerate inputs (a rule referencing an axis absent from the component's variant set).

**Typography and Measurements sub-sections.** Flat global tables with columns `Part | Property | Condition | Token`. An empty condition renders as `—`.

**Shape:**

```markdown
## Tokens used

### Color

#### Container

| Property | State | Primary | Secondary |
|---|---|---|---|
| fill | Default | `Background/Action/Action` | `Background/Action/Action Secondary` |
| fill | Hover | `Background/Action/Action (Hover)` | `Background/Action/Action Secondary (Hover)` |

**When Disabled = true**

| Property | Primary | Secondary |
|---|---|---|
| fill | `Background/Surface/Disabled` | `Background/Action/Action Secondary` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus | `Border Color/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| icon-primary | fill | `Gravy/FA6 Navy` |
| icon-secondary | fill | `Gravy/FA6 Navy` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Size=Default | `Action/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Container | padding-x | Size=Small | `size-16` |
```

---

### `## Code`

**Kind:** Judgment (human/AI authored)

Contains three elements, in order:

1. An `import` statement (fenced code block, language `tsx` or appropriate for the stack).
2. A prop-mapping table (columns: `Figma prop`, `Code prop`) showing how Figma component properties map to the code component's props.
3. A fenced usage example demonstrating a minimal but representative use of the component.

**Shape:**

```markdown
## Code

```tsx
import { Button } from '@acme/ui';
```

| Figma prop | Code prop |
|---|---|
| Type | `variant` |
| Size | `size` |
| Disabled | `disabled` |
| Label | `children` |
| Icon | `leadingIcon` |

```tsx
<Button variant="filled" size="medium">
  Save changes
</Button>
```
```

---

### `## Accessibility`

**Kind:** Judgment (human/AI authored)

Prose notes for accessibility implementation of this component pattern. Because Figma carries no accessibility semantics, these notes are authored from knowledge of the component pattern, not extracted from the design file. Flag explicitly what cannot be known from the design file (e.g. focus order, live region behaviour).

**Shape:**

```markdown
## Accessibility

- Rendered as a `<button>` element (or role="button" on non-button elements).
- Label text must be provided; if the button is icon-only, supply `aria-label`.
- Disabled state: use the `disabled` HTML attribute, not `aria-disabled`, unless
  the button must remain focusable. The design file does not encode this choice.
- Focus ring visibility cannot be verified from the design file; confirm contrast
  meets WCAG 2.1 SC 1.4.11 in implementation.
```

---

### `## Do's & Don'ts`

**Kind:** Judgment (human/AI authored)

Bulleted list of usage rules. Each item is prefixed with ✅ (do) or ❌ (don't).

**Shape:**

```markdown
## Do's & Don'ts

- ✅ Use the primary (Filled) variant for the single most important action on a surface.
- ✅ Keep button labels concise — one to three words, verb-first.
- ❌ Don't place more than one primary button in the same visible viewport area.
- ❌ Don't use a button where a link is semantically correct (navigation to another page
  with no side effects).
```

---

### `## Related atoms`

**Kind:** Deterministic (derived from component instances found in the node tree)

Links to the specs of nested components (atoms). Each item is a Markdown link to the spec file for the nested component.

If no nested components are found, this section body is the single word `None.`

**Shape (with nested components):**

```markdown
## Related atoms

- [Icon](../Icon.md)
- [StateLayer](../StateLayer.md)
```

**Shape (no nested components):**

```markdown
## Related atoms

None.
```

---

### `## Extraction gaps` (non-required, extractor-only)

When an extractor cannot resolve some data — for example, a paint is a hardcoded hex value with no variable binding, or a layer name is ambiguous — it MAY append an `## Extraction gaps` section after `## Related atoms`. This section is informational only and is not part of the required 10 sections. Renderers SHOULD display it with a distinct visual treatment (e.g. a warning callout). Parsers MUST NOT fail if this section is absent.

**Shape:**

```markdown
## Extraction gaps

- `Container › background`: hardcoded paint `#6750A4` — no variable binding found.
- `Label › letter-spacing`: raw value `0.1px` — not mapped to a token.
```

---

## 5. Versioning

`spec_version` follows [Semantic Versioning](https://semver.org). During the v0.x series, minor-version increments may introduce breaking changes to the format (section shapes, frontmatter fields, canonical headings). A breaking change will increment the minor version (e.g. `0.1` → `0.2`). The format will stabilise at v1.0 once the extractor, renderer, and parser implementations are mature.

Tools MUST reject spec files whose `spec_version` major version they do not recognise, and SHOULD warn when processing a minor version newer than they were built against.

---

## 6. Conformance Summary

A conformant Spec Layer file:

- Has valid YAML frontmatter with all required fields present and correctly typed.
- Uses `spec_version: "0.1"`.
- If `status` is present, it is one of `draft`, `approved`, or `deprecated`; `status` may be omitted entirely.
- Contains exactly the 10 canonical sections in the order defined in §4, with verbatim headings.
- Uses `content_hash: "0000...0000"` (64 zeros) only when the spec was hand-authored without an extractor run.
