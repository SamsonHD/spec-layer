---
spec_version: "0.1"
status: approved
component:
  name: Text field
  figma_key: m3-text-field
  figma_file: M3KIT
  figma_node: 1:200
content_hash: "0000000000000000000000000000000000000000000000000000000000000000"
extracted_at: "2026-06-10T00:00:00.000Z"
approved_by: "Spec Layer reference"
---

## Definition

A Text field lets people enter and edit short-form text. Use the Filled variant on surfaces where the input should feel embedded (e.g. search bars, forms on coloured backgrounds); use the Outlined variant when the input needs a clear boundary against a white or light surface. Always pair a text field with a visible label so people understand what input is expected; use supporting text to provide hints, character counts, or error messages.

## Anatomy

1. Container
2. Active indicator (Filled) / Outline (Outlined)
3. Label text
4. Input text
5. Leading icon (component)
6. Trailing icon (component)
7. Supporting text
8. State layer

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show label | boolean | true / false | true |
| Show supporting text | boolean | true / false | false |
| Show leading icon | boolean | true / false | false |
| Show trailing icon | boolean | true / false | false |
| Label | text | — | Label |
| Value | text | — | — |
| Supporting text | text | — | Supporting text |

## Variants

- **Style**: Filled (default) · Outlined

## States

- Enabled
- Focused
- Error
- Disabled

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| background | Style=Filled | `md.sys.color.surface-container-highest` |
| border-color | Style=Outlined | `md.sys.color.outline` |

#### Active indicator / Outline

| Property | Condition | Token |
|---|---|---|
| color | State=Focused | `md.sys.color.primary` |
| color | State=Error | `md.sys.color.error` |

#### Label text

| Property | Condition | Token |
|---|---|---|
| color | State=Enabled | `md.sys.color.on-surface-variant` |
| color | State=Focused | `md.sys.color.primary` |
| color | State=Error | `md.sys.color.error` |

#### Supporting text

| Property | Condition | Token |
|---|---|---|
| color | — | `md.sys.color.on-surface-variant` |
| color | State=Error | `md.sys.color.error` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Input text | color | `md.sys.color.on-surface` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label text | typography | resting | `md.sys.typescale.body-large` |
| Label text | typography | floating | `md.sys.typescale.body-small` |
| Input text | typography | — | `md.sys.typescale.body-large` |
| Supporting text | typography | — | `md.sys.typescale.body-small` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | Style=Filled | `md.sys.shape.corner.extra-small-top` |
| Container | border-radius | Style=Outlined | `md.sys.shape.corner.extra-small` |
| State layer | opacity | State=Hovered | `md.sys.state.hover.state-layer-opacity` |

## Code

```tsx
import { TextField } from '@material/react-text-field';
```

| Figma prop | Code prop |
|---|---|
| Style | `variant` |
| State | — (managed by interaction state and `error` prop) |
| Show label | `label` (omit prop to hide label) |
| Show supporting text | `supportingText` (omit prop to hide) |
| Show leading icon | `leadingIcon` (pass icon element to enable) |
| Show trailing icon | `trailingIcon` (pass icon element to enable) |
| Label | `label` |
| Value | `value` |
| Supporting text | `supportingText` |

```tsx
// Illustrative reference API
<TextField
  variant="filled"
  label="Email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  supportingText="We'll never share your email."
/>
```

## Accessibility

- Rendered as an `<input type="text">` (or `<textarea>` for multiline) paired with a `<label>` element. The `label` prop populates the `<label>`; do not rely solely on placeholder text as an accessible name.
- When `Show label` is false, provide `aria-label` or `aria-labelledby` explicitly; the design file does not encode this fallback.
- In the Error state, associate the supporting text with the input via `aria-describedby`; set `aria-invalid="true"` on the `<input>`. The design file communicates error visually only.
- Disabled state: use the `disabled` HTML attribute. Disabled inputs are excluded from the tab order; confirm this is the desired behaviour before using — an `aria-disabled` approach may be preferable for read-only review forms.
- Icon-only trailing icons used as action triggers (e.g. clear, visibility toggle) must have an `aria-label`; decorative icons must have `aria-hidden="true"`.
- Focus indicator contrast must meet WCAG 2.1 SC 1.4.11; verify the active indicator colour against the container background in implementation.

## Do's & Don'ts

- ✅ Always include a visible label, floating or persistent, so people know what the field expects without guessing from context.
- ✅ Put format hints (e.g. "MM/DD/YYYY") in supporting text before someone types, not only after an error — it's easier to get it right than to fix it.
- ✅ Pair the Error state with a specific supporting-text message that says how to fix the input; "Invalid" alone leaves people stuck.
- ✅ Use the Outlined style on white or very light surfaces, where a Filled field's subtle background would barely register as an input.
- ❌ Don't use placeholder text in place of a label — it vanishes as soon as someone types, leaving no reminder of what the field was for.
- ❌ Don't use the Disabled state to show read-only data. Disabled text is low-contrast and skipped by the tab order, so people can't reliably read or copy it — use a read-only element instead.
- ❌ Don't place two fields of the same purpose side by side (two "Email" fields); it's ambiguous which to fill — use one field and clarify scope in the label.
- ❌ Don't show an error before someone has interacted with the field. Pre-validation on load flags problems people haven't had a chance to cause, which reads as nagging.

## Related atoms

- [Icon](../Icon.md)
- [StateLayer](../StateLayer.md)
