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

- Container
- Label
- Leading icon (component)
- State layer

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Style | variant | Filled · Outlined · Text · Elevated · Tonal | Filled |
| State | variant | Enabled · Hovered · Focused · Pressed · Disabled | Enabled |
| Show icon | boolean | true / false | false |
| Label | text | — | Button |

## Variants

- **Style**: Filled · Outlined · Text · Elevated · Tonal
- **State**: Enabled · Hovered · Focused · Pressed · Disabled

## States

- Enabled
- Hovered
- Focused
- Pressed
- Disabled

## Tokens used

| Part | Property | Token |
|---|---|---|
| Container | background | md.sys.color.primary |
| Container | border-radius | md.sys.shape.corner.full |
| Container | elevation (Elevated variant) | md.sys.elevation.level1 |
| Container | border-color (Outlined variant) | md.sys.color.outline |
| Label | color | md.sys.color.on-primary |
| Label | typography | md.sys.typescale.label-large |
| State layer | opacity (hovered) | md.sys.state.hover.state-layer-opacity |
| State layer | opacity (pressed) | md.sys.state.pressed.state-layer-opacity |
| State layer | color | md.sys.color.on-primary |

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

- ✅ Use the Filled variant for the single most important action on a screen.
- ✅ Keep labels concise — one to three words, verb-first (e.g. "Save", "Add item").
- ✅ Use the Tonal variant for important but secondary actions that need more emphasis than Outlined.
- ✅ Use the Text variant inside dialogs or dense toolbars where visual weight should be minimal.
- ❌ Don't place more than one Filled button in the same visible viewport area.
- ❌ Don't use a button for navigation that has no side effects — use a link (`<a>`) instead.
- ❌ Don't disable a button without providing context about why it is unavailable.
- ❌ Don't truncate label text; resize the container or shorten the label.

## Related atoms

- [Icon](../Icon.md)
- [StateLayer](../StateLayer.md)
