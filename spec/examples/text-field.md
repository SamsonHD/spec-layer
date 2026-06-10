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

A Text field lets users enter and edit short-form text. Use the Filled variant on surfaces where the input should feel embedded (e.g. search bars, forms on coloured backgrounds); use the Outlined variant when the input needs a clear boundary against a white or light surface. Always pair a text field with a visible label so users understand what input is expected; use supporting text to provide hints, character counts, or error messages.

## Anatomy

- Container
- Active indicator (Filled) / Outline (Outlined)
- Label text
- Input text
- Leading icon (component)
- Trailing icon (component)
- Supporting text
- State layer

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Style | variant | Filled · Outlined | Filled |
| State | variant | Enabled · Focused · Error · Disabled | Enabled |
| Show label | boolean | true / false | true |
| Show supporting text | boolean | true / false | false |
| Show leading icon | boolean | true / false | false |
| Show trailing icon | boolean | true / false | false |
| Label | text | — | Label |
| Value | text | — | — |
| Supporting text | text | — | Supporting text |

## Variants

- **Style**: Filled · Outlined
- **State**: Enabled · Focused · Error · Disabled

## States

- Enabled
- Focused
- Error
- Disabled

## Tokens used

| Part | Property | Token |
|---|---|---|
| Container | background (Filled) | md.sys.color.surface-container-highest |
| Container | border-radius (Filled) | md.sys.shape.corner.extra-small-top |
| Container | border-color (Outlined) | md.sys.color.outline |
| Container | border-radius (Outlined) | md.sys.shape.corner.extra-small |
| Active indicator / Outline | color (focused) | md.sys.color.primary |
| Active indicator / Outline | color (error) | md.sys.color.error |
| Label text | color (enabled) | md.sys.color.on-surface-variant |
| Label text | color (focused) | md.sys.color.primary |
| Label text | color (error) | md.sys.color.error |
| Label text | typography (resting) | md.sys.typescale.body-large |
| Label text | typography (floating) | md.sys.typescale.body-small |
| Input text | color | md.sys.color.on-surface |
| Input text | typography | md.sys.typescale.body-large |
| Supporting text | color (default) | md.sys.color.on-surface-variant |
| Supporting text | color (error) | md.sys.color.error |
| Supporting text | typography | md.sys.typescale.body-small |
| State layer | opacity (hovered) | md.sys.state.hover.state-layer-opacity |

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

- ✅ Always include a visible label — floating or persistent — so users know what the field expects.
- ✅ Use supporting text to provide format hints (e.g. "MM/DD/YYYY") before the user interacts, not only on error.
- ✅ Use the Error state with a descriptive supporting text message so users understand how to correct the input.
- ✅ Use Outlined style when the field appears on a white or very light surface to maintain visual distinction.
- ❌ Don't rely on placeholder text as a substitute for a label — it disappears when the user types.
- ❌ Don't use the Disabled state to show read-only data; use a read-only text element or a separate read-only input variant.
- ❌ Don't place two text fields of the same purpose side-by-side (e.g. two "Email" fields); use a single field and clarify scope in the label.
- ❌ Don't show an error state before the user has had a chance to interact with the field (avoid pre-validation on page load).

## Related atoms

- [Icon](../Icon.md)
- [StateLayer](../StateLayer.md)
