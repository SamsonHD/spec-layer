---
spec_version: "0.1"
component:
  name: Text Read Only Field / Grid
  figma_key: 969c0b4409fdccca3cb598b8df3a6d3675d04805
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26121:106153
content_hash: 80b6a22882f1d84b0969604c89da6b25537d4b613d307f12b5d3db2efe0b9162
extracted_at: 2026-06-14T10:04:11.661Z
---

## Definition

_To be written._

## Anatomy

1. Grid

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Grid | undefined | — | — |

## Variants

- **Layout**: 2 col (default) · 1 col
- **Size**: Default (default) · Small

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| Text Read Only Field / Item | border | `Border Color/Divider/Divider Secondary` |
| Title | fill | `Text Color/Body/Secondary` |
| Data | fill | `Text Color/Body/Primary` |
| Subline | fill | `Text Color/Body/Secondary` |
| ChipStatus | fill | `Background/Сhip/Chip Neutral` |
| icon | fill | `Text Color/Body/Primary` |
| Label | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | Size=Default | `Label/S - Strong` |
| Title | typography | Size=Small | `Caption/S` |
| Data | typography | Size=Default | `Value/M - Strong` |
| Data | typography | Size=Small | `Value/S - Strong` |
| Subline | font-size | Size=Default | `font-size/fs-150` |
| Subline | font-family | Size=Default | `font-family/font-family` |
| Subline | line-height | Size=Default | `line-height/lh-250` |
| Subline | font-weight | Size=Default | `font-weight/fw-400` |
| Subline | typography | Size=Small | `Caption/S - Strong` |
| Label | typography | — | `Chip/XS` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded padding
- **Grid**: hardcoded itemSpacing (24px)
- **Text Read Only Field / Item**: hardcoded itemSpacing (24px)
- **Text Read Only Field / Item**: hardcoded padding
- **Text**: hardcoded itemSpacing (7px)
- **Title**: hardcoded itemSpacing (8px)
- **Avatar**: hardcoded itemSpacing (4.444444179534912px)
- **Avatar**: hardcoded cornerRadius (11109.9990234375px)
- **Photo**: hardcoded itemSpacing (8.888888359069824px)
- **Photo**: hardcoded cornerRadius (11109.9990234375px)
- **Status Badge**: hardcoded cornerRadius (100px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **ChipStatus**: hardcoded itemSpacing (8px)
- **ChipStatus**: hardcoded cornerRadius (9999px)
- **ChipStatus**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **Circle**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Xmark Large**: hardcoded color (no variable or style)
- **Row**: hardcoded itemSpacing (12px)
- **Row**: hardcoded padding
- **Button**: hardcoded itemSpacing (8px)
