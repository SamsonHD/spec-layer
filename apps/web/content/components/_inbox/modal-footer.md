---
spec_version: "0.1"
component:
  name: Modal Footer
  figma_key: 89d703dcf410dff9369076f097804ab4b31efd76
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24776:134593
content_hash: 74a114237e9669621e9aa6671b98b2aceee295034175bd2f7b8a6db1f03fdac4
extracted_at: 2026-06-14T10:03:58.000Z
---

## Definition

_To be written._

## Anatomy

1. Slot Wrapper
2. Buttons

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Tertiary Button | boolean | true / false | false |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Modal Footer | fill | `Background/Surface/Primary` |
| Modal Footer | border | `Border Color/Divider/Divider Secondary` |
| Button | fill | `Background/Action/Action` |
| Button | fill | `Background/Action/Action Secondary` |
| Button | border | `Border Color/Action/Secondary Button (Default)` |
| Label | fill | `Text Color/Action/On Action` |
| Label | fill | `Text Color/Action/On Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Action/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Modal Footer**: hardcoded itemSpacing (16px)
- **Modal Footer**: hardcoded padding
- **Footer**: hardcoded itemSpacing (24px)
- **Button**: hardcoded itemSpacing (8px)
- **Button**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Slot/Replace Me**: hardcoded color (no variable or style)
- **Replace Me**: hardcoded color (no variable or style)
- **Buttons**: hardcoded itemSpacing (12px)
