---
spec_version: "0.1"
component:
  name: Chip Avatar
  figma_key: 851e3aee60a6d268ce6882d5f82fc3e55bf14452
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26616:15345
content_hash: 5ffa1ae7b3b0c369700a308000701b474d5fafce68fcfe8599c18b45ba038e14
extracted_at: 2026-06-14T10:03:26.148Z
---

## Definition

_To be written._

## Anatomy

1. Avatar (component)
2. Label
3. iconWrapper (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label | text | — | Label |
| Show Left Icon | boolean | true / false | true |
| Show Right Icon | boolean | true / false | true |

## Variants

- **Style**: Default (default)
- **Size**: Small (default) · Medium · Large
- **Outline**: false (default)

## States

- Default
- Hover
- Focus
- Press

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| fill | States=Default · Focus | `Background/Сhip/Chip` |
| fill | States=Hover | `Background/Сhip/Chip (Hover)` |
| fill | States=Press | `Background/Сhip/Chip (Pressed)` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | States=Focus | `Border Color/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Label | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Size=Small | `Chip/XS` |
| Label | typography | Size=Medium · Large | `Chip/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Focus Rect | border-radius | States=Focus | `rounded-4` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Avatar](./avatar.md)
- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **Avatar**: hardcoded itemSpacing (4.444444179534912px)
- **Avatar**: hardcoded cornerRadius (11109.9990234375px)
- **Photo**: hardcoded itemSpacing (8.888888359069824px)
- **Photo**: hardcoded cornerRadius (11109.9990234375px)
- **Status Badge**: hardcoded cornerRadius (100px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
