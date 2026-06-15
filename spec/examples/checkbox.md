---
spec_version: "0.1"
status: approved
component:
  name: Checkbox
  figma_key: carbon-checkbox
  figma_file: CARBON
  figma_node: 2:100
content_hash: "0000000000000000000000000000000000000000000000000000000000000000"
extracted_at: "2026-06-10T00:00:00.000Z"
approved_by: "Spec Layer reference"
---

## Definition

A Checkbox lets the user select one or more independent options from a set, or toggle a single setting on or off. Use a group of checkboxes when choices are not mutually exclusive — each box is selected independently and any number can be checked at once. Use the indeterminate state only to represent a parent whose children are partially selected; it is a visual summary, never a value the user can set directly. For a single binary setting that takes effect immediately, prefer a Toggle; reserve the checkbox for selections that are committed by a later submit action.

## Anatomy

1. Checkbox (box)
2. Checkmark
3. Label
4. Helper text
5. Focus outline

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Checked | boolean | true / false | false |
| Indeterminate | boolean | true / false | false |
| Invalid | boolean | true / false | false |
| Label | text | — | Label |
| Helper text | text | — | — |

## Variants

_None._

## States

- Enabled
- Focused
- Disabled
- Read-only
- Invalid

## Tokens used

### Color

#### Checkbox (box)

| Property | Condition | Token |
|---|---|---|
| border | — | `$icon-primary` |
| background | Checked=true | `$icon-primary` |
| border | Invalid | `$support-error` |

#### Checkmark

| Property | Condition | Token |
|---|---|---|
| color | — | `$icon-inverse` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Label | color | `$text-primary` |
| Helper text | color | `$text-helper` |
| Focus outline | color | `$focus` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `$body-compact-01` |
| Helper text | typography | — | `$helper-text-01` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Checkbox (box) | size | — | `1rem` |
| Checkbox (box) | border-radius | — | `$spacing-01` |
| Label | gap | — | `$spacing-03` |

## Code

```tsx
import { Checkbox } from '@carbon/react';
```

| Figma prop | Code prop |
|---|---|
| Checked | `checked` / `defaultChecked` |
| Indeterminate | `indeterminate` |
| Invalid | `invalid` (pair with `invalidText`) |
| Label | `labelText` |
| Helper text | `helperText` |

```tsx
// Illustrative reference API
<Checkbox
  id="terms"
  labelText="I accept the terms and conditions"
  helperText="Required to continue"
/>
```

## Accessibility

- Render as a native `<input type="checkbox">`; do not rebuild it from a `<div>` with `role="checkbox"` unless the native control genuinely cannot be used.
- Every checkbox needs a programmatic label: associate a `<label for>` with the input's `id`, or supply `aria-label` when no visible label exists.
- The indeterminate state has no HTML attribute — it must be set via the element's `indeterminate` DOM property in code. The design file shows the visual only; the parent/child selection logic that drives it cannot be derived from the design.
- Group related checkboxes in a `<fieldset>` with a `<legend>` so assistive technology announces the group's purpose before the individual options.
- For the Invalid state, set `aria-invalid="true"` and reference the error message with `aria-describedby`. Colour alone must not signal the error.
- Disabled vs. Read-only is a semantic choice not encoded in the design file: `disabled` removes the control from the tab order, while read-only keeps it focusable and announced. Confirm the intended behaviour in implementation.

## Do's & Don'ts

- ✅ Use checkboxes when the user can select zero, one, or several options from a list.
- ✅ Write each label as a positive statement so a checked box has an unambiguous meaning (e.g. "Send me updates", not "Don't send updates").
- ✅ Use the indeterminate state only on a parent control that summarises a partially-selected group of child checkboxes.
- ✅ Keep the full hit target — box plus label — clickable, not just the 16px box.
- ❌ Don't use a checkbox for a single setting that applies instantly; use a Toggle so the immediate effect is clear.
- ❌ Don't use checkboxes for mutually exclusive options; use radio buttons instead.
- ❌ Don't let the user set the indeterminate state directly — it is derived, not chosen.
- ❌ Don't rely on the checked colour alone to indicate selection; the checkmark must remain visible for colour-blind users.

## Related atoms

None.
