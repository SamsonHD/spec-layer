---
spec_version: "0.1"
component:
  name: WidgetActions/buttons
  figma_key: 2e1dbd0c24538882ac7fe8723a26efb35d1ea8e8
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25321:10167
content_hash: e340e3bf4940b97e85392e9c2827ef66b166bc0296f2e56cad29ef9255af2c28
extracted_at: 2026-06-14T10:04:19.070Z
---

## Definition

_To be written._

## Anatomy

1. Button (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Primary | boolean | true / false | true |
| Secondary | boolean | true / false | true |
| Tertiary | boolean | true / false | true |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Button | fill | `Background/Action/Action` |
| Button | fill | `Background/Action/Action Secondary` |
| Button | border | `Border Color/Action/Secondary Button (Default)` |
| Label | fill | `Text Color/Action/On Action` |
| Label | fill | `Text Color/Action/On Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Action/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | — | `rounded-8` |
| Button | padding-x | — | `size-16` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Button](./button.md)

## Extraction gaps

- **WidgetActions/buttons**: hardcoded itemSpacing (12px)
- **Button**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
