---
spec_version: "0.1"
component:
  name: SidepanelFooter
  figma_key: 94ccc7369bbd219e1f518ef36cdad950bb00e736
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25272:13751
content_hash: 950d5987f2d087caa28505db0d2030a3db53e5c449ffbcc37b48c36e01f494b8
extracted_at: 2026-06-14T10:04:11.591Z
---

## Definition

_To be written._

## Anatomy

1. Slot Wrapper
2. Button (component)

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
| SidepanelFooter | fill | `Background/Surface/Primary` |
| SidepanelFooter | border | `Border Color/Divider/Divider Secondary` |
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

- [Button](./button.md)

## Extraction gaps

- **SidepanelFooter**: hardcoded itemSpacing (12px)
- **SidepanelFooter**: hardcoded padding
- **Button**: hardcoded itemSpacing (8px)
- **Button**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
