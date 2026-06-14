---
spec_version: "0.1"
component:
  name: ChipStatus
  figma_key: 9d3612a3abe4be710cf74e45202f3f9f56a90654
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24864:11231
content_hash: 2749b4d04180a6651c172bdde3b445a66e0860cf4f199035086519a5d71cadb9
extracted_at: 2026-06-14T10:03:26.158Z
---

## Definition

_To be written._

## Anatomy

1. Label

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label | text | — | Label |
| Show Left Icon | boolean | true / false | false |
| Show Right Icon | boolean | true / false | false |
| Show Close Btn | boolean | true / false | false |
| Show Status Dot | boolean | true / false | false |

## Variants

- **Style**: Success · Warning · Error (default) · Infromation · Neutral · Disabled · Purple
- **Size**: Small · Extra Small (default) · Medium · Large

## States

- Default

## Tokens used

### Color

#### Container

| Property | Success | Warning | Error | Infromation | Neutral | Disabled | Purple |
|---|---|---|---|---|---|---|---|
| fill | `Background/Semantic/Status → Success` | `Background/Semantic/Status → Warning` | `Background/Semantic/Status → Error` | `Background/Semantic/Status → Informational` | `Background/Сhip/Chip Neutral` | `Background/Surface/Tertiary` | `Accent/accent-purple-light` |

#### Label

| Property | Success | Warning | Error | Infromation | Neutral | Disabled | Purple |
|---|---|---|---|---|---|---|---|
| fill | `Text Color/Semantic/Success` | `Text Color/Semantic/Warning` | `Text Color/Semantic/Error` | `Text Color/Action/Link Secondary` | `Text Color/Body/Primary` | `Text Color/Body/Secondary` | `Accent/accent-15` |

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

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded cornerRadius (9999px)
- **Container**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Circle**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Xmark Large**: hardcoded color (no variable or style)
