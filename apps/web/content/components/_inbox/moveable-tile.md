---
spec_version: "0.1"
component:
  name: Moveable Tile
  figma_key: ff4947816578174daae1f3b9102b8e112d088052
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 12747:118204
content_hash: c5d42d7d474587824f22182fec85cf1adabec95969eab922bf95abb05926fd14
extracted_at: 2026-06-14T10:07:43.763Z
---

## Definition

_To be written._

## Anatomy

1. Button Icon (component)
2. Label

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label | text | — | Label |
| Show Close Btn | boolean | true / false | true |

## Variants

_None._

## States

- Default
- Hover
- Focus
- Moving

## Tokens used

### Color

#### Container

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Tile/Tile` |
| fill | Hover | `Background/Tile/Tile (Hover)` |
| fill | Focus | `Background/Tile/Tile` |
| fill | Moving | `Background/Tile/Tile - Selected` |
| border | Default | `Border Color/Tile/Tile` |
| border | Hover | `Border Color/Tile/Tile (Hover)` |
| border | Focus | `Border Color/Tile/Tile` |
| border | Moving | `Border Color/Tile/Tile - Selected (Focus)` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus | `Border Color/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Button Icon | fill | `Background/Action/Action Tertiary` |
| icon | fill | `Text Color/Body/Primary` |
| Label | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `[ARCHIVE]/*Mobile/Input Field Value` |

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

- [Button Icon](./button-icon.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (24px)
- **Container**: hardcoded cornerRadius (8px)
- **Container**: hardcoded padding
- **Content**: hardcoded itemSpacing (8px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Label**: hardcoded padding
