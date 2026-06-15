---
spec_version: "0.1"
status: approved
component:
  name: Select
  figma_key: ant-select
  figma_file: ANTD
  figma_node: 7:100
content_hash: "0000000000000000000000000000000000000000000000000000000000000000"
extracted_at: "2026-06-10T00:00:00.000Z"
approved_by: "Spec Layer reference"
---

## Definition

A Select lets people choose one or more values from a list that opens in a dropdown. Use it when the option set is too long to show inline as radio buttons or checkboxes (roughly seven or more items) but is still well-defined and finite. Enable search when the list is long enough that scanning becomes slow, and use the multiple variant when people may pick several values at once. For a small set of mutually exclusive options that benefit from being visible at all times, prefer radio buttons; for a binary on/off setting, use a Switch.

## Anatomy

1. Selector
2. Value / Placeholder
3. Search input
4. Suffix icon (component — Icon)
5. Dropdown
6. Option
7. Option checkmark

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Placeholder | text | — | Select |
| Show search | boolean | true / false | false |
| Allow clear | boolean | true / false | false |

## Variants

- **Size**: Small · Middle (default) · Large
- **Style**: Outlined (default) · Filled · Borderless
- **Status**: Default (default) · Error · Warning
- **Modifiers**: Multiple · Disabled

## States

- Default
- Hover
- Focused
- Disabled

## Tokens used

### Color

#### Selector

| Property | Condition | Token |
|---|---|---|
| background | — | `colorBgContainer` |
| border | — | `colorBorder` |
| border | Hover | `colorPrimaryHover` |
| border | Focused | `colorPrimary` |
| border | Status=Error | `colorError` |
| border | Status=Warning | `colorWarning` |

#### Option

| Property | Condition | Token |
|---|---|---|
| background | Hover | `controlItemBgHover` |
| background | Selected | `controlItemBgActive` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Dropdown | background | `colorBgElevated` |
| Value / Placeholder | color | `colorText` |
| Suffix icon | color | `colorTextQuaternary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Value / Placeholder | typography | — | `fontSize` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Selector | height | — | `controlHeight` |
| Selector | border-radius | — | `borderRadius` |
| Selector | padding | — | `paddingSM` |
| Dropdown | elevation | — | `boxShadowSecondary` |

## Code

```tsx
import { Select } from 'antd';
```

| Figma prop | Code prop |
|---|---|
| Size | `size` |
| Style | `variant` |
| Status | `status` |
| Multiple | `mode="multiple"` |
| Show search | `showSearch` |
| Allow clear | `allowClear` |
| Placeholder | `placeholder` |

```tsx
// Illustrative reference API
<Select
  showSearch
  placeholder="Select a country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'jp', label: 'Japan' },
  ]}
  onChange={setCountry}
/>
```

## Accessibility

- The Select follows the ARIA combobox pattern: the trigger input has `role="combobox"`, `aria-expanded` reflecting the open state, and `aria-controls` pointing to the listbox.
- The dropdown has `role="listbox"`, each option has `role="option"` with `aria-selected`, and keyboard focus stays in the input while `aria-activedescendant` points to the highlighted option.
- Provide a label via an associated `<label>` or `aria-label`; a placeholder is not a label.
- Keyboard support: Down/Up open the list and move the highlight, Enter selects the highlighted option, Escape closes the list, and typing filters when search is enabled. Verify these in implementation — the design file shows visuals only.
- When search filters the list, announce the result count to assistive technology via an `aria-live` region; this dynamic behaviour cannot be derived from the design.
- In the Multiple variant, each selected value renders as a removable token; every remove control needs an accessible name, and selection changes should be announced.
- For Error and Warning status, set `aria-invalid` appropriately and link the message with `aria-describedby`; status colour alone must not carry the meaning.

## Do's & Don'ts

- ✅ Use a Select when the option list is long enough that radios or checkboxes would crowd the layout — the dropdown keeps the choices tucked away until they're needed.
- ✅ Enable search once the list passes roughly a dozen options, so people can type to narrow it instead of scrolling a long menu.
- ✅ Give the field a clear, persistent label above it, not just a placeholder, so its purpose stays visible after a value is chosen.
- ✅ Order options predictably — alphabetical, by frequency, or grouped — so people can find a value where they expect it to be.
- ❌ Don't use a Select for a small set of mutually exclusive options. Hiding three choices behind a click costs a step for no gain — show them as radio buttons.
- ❌ Don't use a Select for a binary choice; opening a menu to pick between two values is overkill — use a Switch or two radio buttons.
- ❌ Don't truncate option labels until they're ambiguous; people can't choose what they can't read — widen the dropdown or shorten the source text.
- ❌ Don't lean on the placeholder as the field's label — it disappears once someone selects a value, leaving no reminder of what the field controls.

## Related atoms

- [Icon](../Icon.md)
