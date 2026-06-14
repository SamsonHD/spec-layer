---
spec_version: "0.1"
component:
  name: Keypad
  figma_key: 6af3e5d961aa28794fc9d682a3aecd5e054fdcd3
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 11101:344847
content_hash: d165bb9c2edaa11aa09dcf5d5ae0c809a117c55b98d777b691178fa74d0e1dab
extracted_at: 2026-06-14T10:07:43.777Z
---

## Definition

_To be written._

## Anatomy

1. Row

## Configuration

_None._

## Variants

- **Type**: Numeric (default) · PIN Pad
- **Size**: Default (default) · Small

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Keypad Button | fill | `Background/Surface/Primary` |
| Keypad Button | border | `Border Color/Input Field/Input Field` |
| { label } | fill | `Text Color/Body/Primary` |
| Vector | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| { label } | typography | Size=Small | `[ARCHIVE]/*Mobile/Keypad Label` |
| { label } | typography | Size=Default | `[ARCHIVE]/*Mobile/Keypad Label Large` |

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
- **Row**: hardcoded itemSpacing (8px)
- **Keypad Button**: hardcoded cornerRadius (8px)
- **Keypad Button**: hardcoded padding
- **Keypad Button**: hardcoded itemSpacing (8px)
- **Icon Wrapper**: hardcoded itemSpacing (10px)
- **Icon Wrapper**: hardcoded padding
- **Delete Left**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
