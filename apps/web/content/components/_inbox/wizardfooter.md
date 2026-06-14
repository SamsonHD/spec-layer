---
spec_version: "0.1"
component:
  name: wizardFooter
  figma_key: 28a80595a6a8caca75b2b7072a9b928aa691134e
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25362:77384
content_hash: a06791abc22f3f2cf3c13d2df83db66b72f0634ee3ff319a4630a6b963547d94
extracted_at: 2026-06-14T10:04:19.088Z
---

## Definition

_To be written._

## Anatomy

1. Button (component)
2. Frame 1

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Banner | boolean | true / false | false |
| Show Legal Copy | boolean | true / false | false |
| Secondary Button | boolean | true / false | false |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| wizardFooter | fill | `Background/Surface/Primary` |
| wizardFooter | border | `Border Color/Divider/Divider Secondary` |
| Button | fill | `Background/Action/Action` |
| Button | fill | `Background/Action/Action Secondary` |
| Button | border | `Border Color/Action/Secondary Button (Disabled)` |
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

- **wizardFooter**: hardcoded padding
- **Button**: hardcoded itemSpacing (8px)
- **Button**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Frame 1**: hardcoded itemSpacing (16px)
- **Button + Affordances**: hardcoded itemSpacing (16px)
- **Inline Banner**: hardcoded itemSpacing (16px)
- **Inline Banner**: hardcoded padding
- **Button group**: hardcoded itemSpacing (16px)
- **Button (Link)**: hardcoded itemSpacing (4px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
