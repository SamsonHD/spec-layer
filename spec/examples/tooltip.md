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

A Tooltip shows a brief, supplementary text label for an element when someone hovers over or focuses its trigger. Use it to clarify the purpose of an icon-only control or to expand a truncated label — short, non-essential context that helps but is never required to complete a task. Because a tooltip is transient and unavailable on touch, it must only ever supplement information that is already discoverable another way. Keep the content to a few words; anything longer, interactive, or essential belongs in a popover, inline help, or the visible UI.

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

- ✅ Use a tooltip to name an icon-only button or reveal a truncated label — a small clarification for something already on screen.
- ✅ Keep the content to a short phrase, ideally a single noun or verb, since a tooltip is read in a glance and then disappears.
- ✅ Make sure the same information is reachable without the tooltip; it's unavailable on touch and easy to miss, so it can never be the only path to something people need.
- ❌ Don't put essential instructions, links, or buttons in a tooltip. It's transient, not in the tab order, and absent on touch — people who need that content may never get it. Use helper text or inline UI instead.
- ❌ Don't use a tooltip as a control's only accessible name; screen readers may not announce it reliably — give the control its own `aria-label` as well.
- ❌ Don't open a tooltip on click or keep it pinned; that's a Popover's job, and overloading the tooltip blurs what each pattern means.
- ❌ Don't show a tooltip that just repeats a visible adjacent label; it adds hover noise without telling people anything new.

## Related atoms

None.
