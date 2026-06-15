---
spec_version: "0.1"
status: approved
component:
  name: Tooltip
  figma_key: atlassian-tooltip
  figma_file: ATLASSIAN
  figma_node: 6:100
content_hash: "0000000000000000000000000000000000000000000000000000000000000000"
extracted_at: "2026-06-10T00:00:00.000Z"
approved_by: "Spec Layer reference"
---

## Definition

A Tooltip shows a brief, supplementary text label for an element when the user hovers over or focuses its trigger. Use it to clarify the purpose of an icon-only control or to expand a truncated label — short, non-essential context that helps but is never required to complete a task. Because a tooltip is transient and unavailable on touch, it must only ever supplement information that is already discoverable another way. Keep the content to a few words; anything longer, interactive, or essential belongs in a popover, inline help, or the visible UI.

## Anatomy

1. Trigger
2. Container
3. Label
4. Pointer

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Content | text | — | Tooltip |

## Variants

- **Position**: Top (default) · Right · Bottom · Left

## States

- Hidden
- Shown

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | background | `color.background.neutral.bold` |
| Label | color | `color.text.inverse` |
| Pointer | background | `color.background.neutral.bold` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `font.body.small` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `border.radius` |
| Container | padding | — | `space.050` |
| Container | elevation | — | `elevation.shadow.overlay` |

## Code

```tsx
import Tooltip from '@atlaskit/tooltip';
```

| Figma prop | Code prop |
|---|---|
| Content | `content` |
| Position | `position` |

```tsx
// Illustrative reference API
<Tooltip content="Archive" position="top">
  {(triggerProps) => (
    <IconButton {...triggerProps} icon={ArchiveIcon} label="Archive" />
  )}
</Tooltip>
```

## Accessibility

- The tooltip element has `role="tooltip"`, and the trigger references it with `aria-describedby` so its text is announced as a description of the control.
- The tooltip must appear on keyboard focus as well as pointer hover, and stay visible while the pointer or focus is on the trigger or the tooltip itself. A hover-only trigger excludes keyboard and touch users; this requirement cannot be seen in the design file.
- Pressing Escape must dismiss the tooltip without moving focus.
- Never place essential information or interactive elements inside a tooltip — it is transient, unreachable on touch, and not part of the tab order.
- For an icon-only control, the control still needs its own accessible name (`aria-label`); the tooltip describes, it does not replace the name.
- Tooltip text must meet text contrast against its container background per WCAG 2.1 SC 1.4.3; verify the inverse-on-bold pairing in implementation.

## Do's & Don'ts

- ✅ Use a tooltip to label an icon-only button or to reveal a truncated label.
- ✅ Keep the content to a short phrase — ideally a single noun or verb.
- ✅ Make sure the same information is available without the tooltip, since it is unavailable on touch.
- ❌ Don't put essential instructions, links, or buttons inside a tooltip.
- ❌ Don't use a tooltip as the only accessible name for a control; provide `aria-label` as well.
- ❌ Don't trigger a tooltip on click or make it persist; that behaviour belongs to a Popover.
- ❌ Don't show a tooltip that merely repeats a visible adjacent label.

## Related atoms

None.
