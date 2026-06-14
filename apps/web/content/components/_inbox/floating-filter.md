---
spec_version: "0.1"
component:
  name: Floating Filter
  figma_key: d8ce526d571be50dcf4977ea732c6a6062fb0d6b
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24728:3999
content_hash: 7e2454bdba153eff8c5d2ac9e139f70dac4390391d33c43a050995395591eee6
extracted_at: 2026-06-14T10:03:12.490Z
---

## Definition

_To be written._

## Anatomy

1. Search (component)
2. iconWrapper (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Filter | boolean | true / false | true |
| Input | boolean | true / false | true |

## Variants

- **Modifiers**: Right-Align

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Table/Table Header` |
| Container | border | `Border Color/Divider/Table Divider` |
| Search | fill | `Background/Surface/Quaternary` |
| Primary | fill | `Text Color/Body/Primary` |
| Label | fill | `Text Color/Body/Secondary` |
| icon | fill | `Text Color/Body/Black` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Tablet Portrait/Button Label Small` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Search](./search.md)
- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (16px)
- **Left-Bias**: hardcoded itemSpacing (16px)
- **Left-Bias**: hardcoded padding
- **Search**: hardcoded itemSpacing (4px)
- **Search**: hardcoded cornerRadius (8px)
- **Search**: hardcoded padding
- **Icon + Label**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
