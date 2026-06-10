# Spec Layer Format v0.1

> **The approved contract between design and code.**

Spec Layer is an open standard for versioned, human-approved, machine-parseable component specifications. Each spec captures everything needed to build against a design-system component: its anatomy, configuration, tokens, code mapping, accessibility notes, and usage rules — extracted deterministically where possible, drafted by AI where judgment is needed, and approved by a human before it becomes a contract.

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
| `status` | enum: `draft` \| `approved` \| `deprecated` | Yes | Lifecycle state. Starts as `draft`; becomes `approved` when a human approves all judgment sections; `deprecated` when the component is removed or superseded. |
| `component.name` | string | Yes | Human-readable component name (e.g. `Button`). |
| `component.figma_key` | string | Yes | Stable Figma component key (survives renames and file moves). |
| `component.figma_file` | string | Yes | Figma file key (the `XXXX` segment of `figma.com/file/XXXX`). |
| `component.figma_node` | string | Yes | Figma node id of the component or component set. |
| `content_hash` | string | Yes | SHA-256 hex digest of the canonical JSON of the deterministic extraction (all object keys recursively sorted, no extra whitespace). Used as the drift-detection and LLM-cache key. |
| `extracted_at` | string | Yes | ISO 8601 timestamp of the last extraction run (e.g. `2026-06-10T14:32:00Z`). |
| `approved_by` | string | No | Name or identifier of the approver. Set when `status` transitions to `approved`; omitted until then. |

### Complete frontmatter example

```yaml
---
spec_version: "0.1"
status: draft
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

## 3. Draft-Marker Rule

Four sections contain judgment content: **Definition**, **Code**, **Accessibility**, and **Do's & Don'ts**. Any time one of these sections has not yet been approved by a human, it MUST begin with the following exact marker line (including the `>` blockquote syntax):

```
> ⚠️ Draft — AI-suggested, not yet approved.
```

This marker line is the signal to renderers, tools, and readers that the content is a draft and has not been validated. It must be the first line of the section body (immediately after the `## Heading` line, before any other content).

**Approval flow:**

1. A human reviews each judgment section, edits as needed, and approves.
2. On approval, all four draft markers are removed from the file.
3. `status` in the frontmatter is set to `approved`.
4. `approved_by` in the frontmatter is set to the approver's name or identifier.

Deterministic sections (Anatomy, Configuration, Variants, States, Tokens used, Related atoms) never carry the draft marker.

---

## 4. Section Definitions

The body contains exactly 10 sections, in this order, with these exact headings.

---

### `## Definition`

**Kind:** Judgment (human/AI authored)

One paragraph describing the component's purpose, when to use it, and any primary usage constraints. Drafted by the extractor's LLM prose pass; must be approved by a human before the spec is treated as a contract.

Carries the draft marker until approved.

**Example:**

```markdown
## Definition

> ⚠️ Draft — AI-suggested, not yet approved.

A Button triggers an action or navigation when activated. Use the primary variant
for the single most important action on a surface; secondary and tertiary variants
for supporting actions. Avoid placing more than one primary button in the same
visible area.
```

---

### `## Anatomy`

**Kind:** Deterministic (derived from the Figma node tree)

A bulleted list of the named layers or parts that make up the component. Each item names the part. Nested components (instances of another component) are flagged with `(component)`.

**Shape:**

```markdown
## Anatomy

- Container
- Label
- Leading icon (component)
- Trailing icon (component)
- State layer
```

---

### `## Configuration`

**Kind:** Deterministic (derived from component properties in the Figma node)

A table of all component properties. Columns:

| Column | Description |
|---|---|
| Name | The property name exactly as it appears in Figma. |
| Kind | One of: `variant`, `boolean`, `text`, `instanceSwap`. |
| Options | For `variant`: the list of allowed values. For `boolean`: `true / false`. For `text` and `instanceSwap`: `—`. |
| Default | The default value as set in Figma. |

**Shape:**

```markdown
## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Type | variant | Filled · Outlined · Text · Elevated · Tonal | Filled |
| Size | variant | Small · Medium · Large | Medium |
| Disabled | boolean | true / false | false |
| Label | text | — | Button |
| Icon | instanceSwap | — | — |
```

---

### `## Variants`

**Kind:** Deterministic (derived from the Figma component set's variant axes)

A bulleted list, one item per variant axis. Each item uses the format:

```
**AxisName**: Value · Value · …
```

**Shape:**

```markdown
## Variants

- **Type**: Filled · Outlined · Text · Elevated · Tonal
- **Size**: Small · Medium · Large
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

A table of design token bindings. Columns:

| Column | Description |
|---|---|
| Part | The anatomy part the binding applies to (use `*` for the whole component). |
| Property | The CSS/design property (e.g. `background`, `color`, `border-radius`, `gap`). |
| Token | The fully-qualified token name as it appears in the Figma variable or style library. |

**Shape:**

```markdown
## Tokens used

| Part | Property | Token |
|---|---|---|
| Container | background | md.sys.color.primary |
| Container | border-radius | md.sys.shape.corner.full |
| Label | color | md.sys.color.on-primary |
| Label | typography | md.sys.typescale.label-large |
| State layer | opacity (hovered) | md.sys.state.hover.state-layer-opacity |
```

---

### `## Code`

**Kind:** Judgment (human/AI authored)

Contains three elements, in order:

1. An `import` statement (fenced code block, language `tsx` or appropriate for the stack).
2. A prop-mapping table (columns: `Figma prop`, `Code prop`) showing how Figma component properties map to the code component's props.
3. A fenced usage example demonstrating a minimal but representative use of the component.

Carries the draft marker until approved.

**Shape:**

```markdown
## Code

> ⚠️ Draft — AI-suggested, not yet approved.

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

Carries the draft marker until approved.

**Shape:**

```markdown
## Accessibility

> ⚠️ Draft — AI-suggested, not yet approved.

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

Carries the draft marker until approved.

**Shape:**

```markdown
## Do's & Don'ts

> ⚠️ Draft — AI-suggested, not yet approved.

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
- Has `status` set to one of `draft`, `approved`, or `deprecated`.
- Contains exactly the 10 canonical sections in the order defined in §4, with verbatim headings.
- Has the draft marker as the first body line of every judgment section that has not yet been approved.
- Does **not** have a draft marker in any deterministic section.
- Does **not** have a draft marker in any judgment section that has been approved (i.e. `status: approved`).
- Uses `content_hash: "0000...0000"` (64 zeros) only when the spec was hand-authored without an extractor run.
