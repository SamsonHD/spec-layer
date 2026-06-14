---
spec_version: "0.1"
component:
  name: ChipAction
  figma_key: ec50ab506ddb86ae964c3d6c609ce1411b64f947
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7993:326457
content_hash: ce05e8126d566c3db71e2ae24699fca31a8d5117ac6228b5ff42bfc875c6b13e
extracted_at: 2026-06-14T10:03:26.143Z
---

## Definition

_To be written._

## Anatomy

1. iconWrapper (component)
2. Label

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label | text | — | Label |
| Show Left Icon | boolean | true / false | true |
| Show Right Icon | boolean | true / false | true |
| Show Close Btn | boolean | true / false | false |

## Variants

- **Style**: Default (default) · Color Background · Status
- **Size**: Small · Extra Small (default) · Medium · Large
- **Modifiers**: Outline

## States

- Default
- Hover
- Focus
- Press

## Tokens used

### Color

#### Container

| Property | State | Default | Color Background | Status |
|---|---|---|---|---|
| fill | Default | `Background/Сhip/Chip` | `Background/Action/Action Inverse` | `Background/Surface/Primary` |
| fill | Hover | `Background/Сhip/Chip (Hover)` | `Background/Action/Action Inverse` | `Background/Сhip/Chip (Hover)` |
| fill | Focus | `Background/Сhip/Chip` | `Background/Action/Action Inverse` | `Background/Surface/Primary` |
| fill | Press | `Background/Сhip/Chip (Pressed)` | `Background/Action/Action Inverse` | `Background/Сhip/Chip (Pressed)` |

**When Outline = true**

| Property | State | Default | Color Background | Status |
|---|---|---|---|---|
| fill | Default | `Background/Surface/Primary` | `Background/Surface/Primary` | `Background/Surface/Primary` |
| fill | Hover | `Background/Сhip/Chip (Hover)` | `Background/Action/Action Inverse` | `Background/Сhip/Chip (Hover)` |
| fill | Focus | `Background/Surface/Primary` | `Background/Surface/Primary` | `Background/Surface/Primary` |
| fill | Press | `Background/Сhip/Chip (Pressed)` | `Background/Action/Action Inverse` | `Background/Сhip/Chip (Pressed)` |
| border | Default | `Border Color/Chip/Disabled` | `Border Color/Chip/Disabled` | `Border Color/Chip/Disabled` |
| border | Hover | `Border Color/Chip/Disabled` | `Border Color/Chip/Disabled` | `Border Color/Chip/Disabled` |
| border | Focus | `Border Color/Chip/Disabled` | `Border Color/Chip/Disabled` | `Border Color/Chip/Disabled` |
| border | Press | `Border Color/Chip/Disabled` | `Border Color/Chip/Disabled` | `Border Color/Chip/Disabled` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Style=Default · Color Background | `Text Color/Body/Primary` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | Style=Default · Status, States=Focus | `Border Color/Action/Action` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Style=Status | `Background/Semantic/Status → Error` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Label | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Size=Extra Small | `Chip/XS` |
| Label | typography | Size=Small | `Chip/S` |
| Label | typography | Size=Medium | `Chip/M` |
| Label | typography | Size=Large | `Chip/L` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded cornerRadius (9999px)
- **Container**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
