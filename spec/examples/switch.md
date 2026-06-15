---
spec_version: "0.1"
status: approved
component:
  name: Switch
  figma_key: fluent-switch
  figma_file: FLUENT2
  figma_node: 3:100
content_hash: "0000000000000000000000000000000000000000000000000000000000000000"
extracted_at: "2026-06-10T00:00:00.000Z"
approved_by: "Spec Layer reference"
---

## Definition

A Switch toggles a single option between two opposite states — on and off — and applies the change immediately, without a separate submit step. Use it for binary settings whose effect the user can see or feel right away, such as enabling notifications or turning on a feature. Each switch is independent; it is not a way to choose between two alternatives (use radio buttons for that) and it is not for selecting items from a list (use checkboxes). Because the action takes effect instantly, never use a Switch for a choice that should be confirmed or that has a destructive, hard-to-reverse outcome.

## Anatomy

1. Track
2. Thumb
3. Label
4. Focus indicator

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Checked | boolean | true / false | false |
| Label | text | — | Switch |

## Variants

- **Label position**: After (default) · Before · Above

## States

- Rest
- Hover
- Pressed
- Focused
- Disabled

## Tokens used

### Color

#### Track

| Property | Condition | Token |
|---|---|---|
| border | Checked=false | `tokens.colorNeutralStrokeAccessible` |
| background | Checked=true | `tokens.colorCompoundBrandBackground` |
| background | Checked=true · Hover | `tokens.colorCompoundBrandBackgroundHover` |

#### Thumb

| Property | Condition | Token |
|---|---|---|
| background | Checked=false | `tokens.colorNeutralForeground3` |
| background | Checked=true | `tokens.colorNeutralForegroundInverted` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Label | color | `tokens.colorNeutralForeground1` |
| Focus indicator | color | `tokens.colorStrokeFocus2` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `tokens.fontSizeBase300` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Track | width | — | `40px` |
| Track | height | — | `20px` |
| Track | border-radius | — | `tokens.borderRadiusCircular` |
| Thumb | size | — | `14px` |

## Code

```tsx
import { Switch } from '@fluentui/react-components';
```

| Figma prop | Code prop |
|---|---|
| Checked | `checked` / `defaultChecked` |
| Label | `label` |
| Label position | `labelPosition` |

```tsx
// Illustrative reference API
<Switch
  label="Enable notifications"
  labelPosition="after"
  onChange={(_, data) => setEnabled(data.checked)}
/>
```

## Accessibility

- The underlying control is a native checkbox input exposed with `role="switch"`; its on/off value is communicated through `aria-checked`, not `aria-pressed`.
- Provide a programmatic label via the `label` prop (associated `<label for>`) or `aria-label`. The label should name the setting, not the action (e.g. "Wi-Fi", not "Turn on Wi-Fi").
- The Space key toggles the switch when it has focus; Enter does not. Ensure the control is reachable in the tab order.
- A switch applies its change immediately. Whether the change is truly instant or is deferred to a save action is a product decision that the design file cannot encode — confirm it matches the switch's instant-effect semantics in implementation.
- Do not rely on the thumb position or track colour alone to convey state; the accessible name plus `aria-checked` must carry it for screen-reader and colour-blind users.

## Do's & Don'ts

- ✅ Use a Switch for a binary setting that takes effect the moment it is toggled.
- ✅ Label the setting itself so the on/off meaning is obvious without reading the action.
- ✅ Keep the on state visually distinct using the brand fill plus the thumb position, not colour alone.
- ❌ Don't use a Switch inside a form that requires a separate submit; use a Checkbox so the value is committed on save.
- ❌ Don't use a Switch to pick between two labelled alternatives; use radio buttons.
- ❌ Don't use a Switch for destructive or irreversible actions that should be confirmed first.
- ❌ Don't pair a Switch with a redundant "On"/"Off" text label that repeats the state already shown by the control.

## Related atoms

None.
