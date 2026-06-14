---
spec_version: "0.1"
component:
  name: Pagination Mobile
  figma_key: 1f9ad00c583625ad44b845ed90eba12730c0cca2
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 18936:7216
content_hash: 3256fdea62d52859bc4b261c2d00e38e43ceae5c002d3129a47f759a98f526e4
extracted_at: 2026-06-14T10:04:05.513Z
---

## Definition

_To be written._

## Anatomy

1. Page Selector (component)
2. Current Page Label + Page size selector (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Current Page Label + Page Size Selector | boolean | true / false | true |

## Variants

- **Layout**: Horizontal (default) · Vertical
- **Modifiers**: Swapped

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Button Icon | fill | `Background/Action/Action Tertiary` |
| icon | fill | `Text Color/Body/Primary` |
| Input | fill | `Background/Surface/Primary` |
| Input | border | `Border Color/Input Field/Input Field` |
| Placeholder | fill | `Text Color/Body/Primary` |
| / | fill | `Text Color/Body/Primary` |
| 5 | fill | `Text Color/Body/Primary` |
| Viewing | fill | `Text Color/Body/Primary` |
| Button (Link) | fill | `Background/Transparent` |
| Label | fill | `Text Color/Action/Default` |
| of | fill | `Text Color/Body/Primary` |
| 50 | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Placeholder | typography | — | `Value/S` |
| / | typography | — | `[ARCHIVE]/*Mobile/Field Label` |
| 5 | typography | — | `[ARCHIVE]/*Mobile/Field Label` |
| Viewing | typography | — | `[ARCHIVE]/*Mobile/Field Label` |
| Label | typography | — | `Action/M` |
| of | typography | — | `[ARCHIVE]/*Mobile/Field Label` |
| 50 | typography | — | `[ARCHIVE]/*Mobile/Field Label` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.helperPageSelectorMobile](./helperpageselectormobile.md)
- [.helperCurrentPageLabel](./helpercurrentpagelabel.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (4px)
- **Page Selector**: hardcoded itemSpacing (8px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Input Field - Numeric**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **Content Wrapper**: hardcoded itemSpacing (2px)
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Current Page Label + Page size selector**: hardcoded itemSpacing (4px)
- **Button (Link)**: hardcoded itemSpacing (8px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
