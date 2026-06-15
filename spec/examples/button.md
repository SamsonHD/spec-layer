---
spec_version: "0.1"
status: approved
component:
  name: Button
  figma_key: m3-button
  figma_file: M3KIT
  figma_node: 1:100
content_hash: "0000000000000000000000000000000000000000000000000000000000000000"
extracted_at: "2026-06-10T00:00:00.000Z"
approved_by: "Spec Layer reference"
---

## Definition

A Button triggers an action or event when activated. Use the Filled variant for the single most important action on a surface; Tonal or Outlined for secondary actions; Text for the least-prominent tertiary actions; Elevated when a button must visually lift off a coloured surface. Never place more than one Filled button in the same visible area.

## Anatomy

1. Container
2. Label
3. Leading icon (component)
4. State layer

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show icon | boolean | true / false | false |
| Label | text | — | Button |

## Variants

- **Style**: Filled (default) · Outlined · Text · Elevated · Tonal

## States

- Enabled
- Hovered
- Focused
- Pressed
- Disabled

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| background | — | `md.sys.color.primary` |
| border | Style=Outlined | `md.sys.color.outline` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Label | color | `md.sys.color.on-primary` |
| State layer | color | `md.sys.color.on-primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `md.sys.typescale.label-large` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `md.sys.shape.corner.full` |
| Container | elevation | Style=Elevated | `md.sys.elevation.level1` |
| State layer | opacity | State=Hovered | `md.sys.state.hover.state-layer-opacity` |
| State layer | opacity | State=Pressed | `md.sys.state.pressed.state-layer-opacity` |

## Code

```tsx
import { Button } from '@material/react-button';
```

| Figma prop | Code prop |
|---|---|
| Style | `variant` |
| State | — (managed by interaction state) |
| Show icon | `icon` (pass an icon element to enable) |
| Label | `children` |

```tsx
// Illustrative reference API
<Button variant="filled" icon={<SaveIcon />}>
  Save changes
</Button>
```

## Accessibility

- Rendered as a `<button>` element; use `role="button"` only when a non-button element must behave as a button.
- The `Label` prop provides the accessible name. For icon-only configurations (where `Show icon` is true and label is hidden), supply `aria-label` with a descriptive string.
- The Disabled state must use the `disabled` HTML attribute so the element is removed from the tab order. Use `aria-disabled="true"` only when the button must remain focusable (e.g. it shows a tooltip explaining why it is unavailable); this choice cannot be determined from the design file.
- Focus ring colour must meet WCAG 2.1 SC 1.4.11 (Non-text Contrast ≥ 3:1 against adjacent colours). The design file does not encode focus ring contrast; verify in implementation.
- The state layer satisfies touch-target guidelines when the container is at least 48 × 48 dp; confirm minimum hit area in implementation.

## Do's & Don'ts

- ✅ Use the Filled variant for the single most important action in a view — its weight tells people where to go next.
- ✅ Keep labels to one to three words, verb-first ("Save", "Add item"), so people can scan the action without reading a sentence.
- ✅ Use the Tonal variant for important secondary actions that need more presence than Outlined but shouldn't compete with the primary action.
- ✅ Use the Text variant in dialogs and dense toolbars, where a filled or outlined button would add visual noise to an already busy area.
- ❌ Don't place more than one Filled button in the same view. Multiple primary actions compete for attention, so people can't tell which one matters most.
- ❌ Don't use a button for plain navigation with no side effect. Screen readers announce buttons and links differently, so people expect a link (`<a>`) to take them somewhere — use a link instead.
- ❌ Don't disable a button without explaining why it's unavailable. A disabled button gives no reason and is skipped by the tab order — use inline validation to show what's needed instead.
- ❌ Don't truncate label text; a clipped label hides the action. Shorten the label or widen the container.

## Related atoms

- [Icon](../Icon.md)
- [StateLayer](../StateLayer.md)
