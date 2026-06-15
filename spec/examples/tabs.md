---
spec_version: "0.1"
status: approved
component:
  name: Tabs
  figma_key: spectrum-tabs
  figma_file: SPECTRUM
  figma_node: 5:100
content_hash: "0000000000000000000000000000000000000000000000000000000000000000"
extracted_at: "2026-06-10T00:00:00.000Z"
approved_by: "Spec Layer reference"
---

## Definition

Tabs organise related content into separate views within the same context, where only one view is visible at a time. Use tabs to let the user switch between peer sections of a single page or panel — not to navigate to different pages, and not to walk through a sequence of steps (use a stepper for that). Keep the set small and stable: tabs work best when every option is visible at once and the labels do not change as the user moves between them. Place the most important or default view first, since it is the one shown when the component loads.

## Anatomy

1. Tab list
2. Tab item
3. Label
4. Icon (component)
5. Selection indicator
6. Tab panel

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show icon | boolean | true / false | false |

## Variants

- **Orientation**: Horizontal (default) · Vertical
- **Density**: Regular (default) · Compact
- **Modifiers**: Quiet

## States

- Default
- Hover
- Down
- Focused
- Selected
- Disabled

## Tokens used

### Color

#### Tab item

| Property | Condition | Token |
|---|---|---|
| color | — | `--spectrum-neutral-content-color-default` |
| color | Hover | `--spectrum-neutral-content-color-hover` |
| color | Selected | `--spectrum-neutral-content-color-selected` |
| color | Disabled | `--spectrum-disabled-content-color` |

#### Selection indicator

| Property | Condition | Token |
|---|---|---|
| background | — | `--spectrum-accent-color-default` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Focused | color | `--spectrum-focus-indicator-color` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `--spectrum-font-size-100` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Selection indicator | height | — | `--spectrum-tab-item-divider-size` |
| Tab item | gap | — | `--spectrum-spacing-300` |

## Code

```tsx
import { Tabs, TabList, TabPanels, Item } from '@adobe/react-spectrum';
```

| Figma prop | Code prop |
|---|---|
| Orientation | `orientation` |
| Density | `density` |
| Quiet | `isQuiet` |
| Show icon | child of `<Item>` (include an icon element) |

```tsx
// Illustrative reference API
<Tabs aria-label="Account settings">
  <TabList>
    <Item key="profile">Profile</Item>
    <Item key="billing">Billing</Item>
  </TabList>
  <TabPanels>
    <Item key="profile">Profile content</Item>
    <Item key="billing">Billing content</Item>
  </TabPanels>
</Tabs>
```

## Accessibility

- The tab list has `role="tablist"`, each tab has `role="tab"`, and each panel has `role="tabpanel"`. The selected tab carries `aria-selected="true"`; each tab references its panel with `aria-controls`, and each panel references its tab with `aria-labelledby`.
- Use a roving tabindex: only the selected tab is in the page tab order (`tabindex="0"`); the others are `tabindex="-1"` and reached with the arrow keys. Home and End jump to the first and last tab.
- Whether selection follows focus (automatic activation, on arrow) or requires Enter/Space (manual activation) is a behaviour choice the design file cannot encode. Prefer automatic activation for cheap-to-render panels and manual activation when switching is expensive.
- For the Vertical orientation, set `aria-orientation="vertical"` so the expected arrow keys (Up/Down) are announced correctly.
- Give the tab list an accessible name (`aria-label` or `aria-labelledby`) when its purpose is not clear from surrounding content.

## Do's & Don'ts

- ✅ Use tabs for peer views of the same content where only one is shown at a time.
- ✅ Keep labels short, parallel in phrasing, and stable as the user switches tabs.
- ✅ Order tabs by importance or expected frequency, with the default view first.
- ✅ Make sure every tab is visible at once; if they would scroll or wrap, reconsider the pattern.
- ❌ Don't use tabs for page-level navigation that changes the URL to a different destination; use links or a nav.
- ❌ Don't use tabs for sequential steps that must be completed in order; use a stepper or wizard.
- ❌ Don't hide critical or time-sensitive information inside a non-default tab.
- ❌ Don't disable a tab without making the reason discoverable elsewhere.

## Related atoms

- [Icon](../Icon.md)
