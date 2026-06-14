---
spec_version: "0.1"
component:
  name: Banner/Mobile/Info
  figma_key: 6b9ea6c2f6f676d610931f95a223c27ad124f8c6
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 14081:123130
content_hash: aa38b8e4fed981d5df1f3b899ebfc7cf9dd425b6c6ee2c144bc7e03bc884c8ea
extracted_at: 2026-06-14T10:03:14.953Z
---

## Definition

_To be written._

## Anatomy

1. Contents
2. CTA

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Close Button | boolean | true / false | true |
| Banner Title | boolean | true / false | true |
| Title | text | — | Title |
| Show Actions | boolean | true / false | true |
| Secondary Action | boolean | true / false | true |
| Content | text | — | This is the content of banner. |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Banner/Mobile/Info | fill | `Background/Surface/Primary` |
| Banner/Mobile/Info | border | `Border Color/Divider/Divider Secondary` |
| icon | fill | `Text Color/Body/Secondary` |
| icon | fill | `Text Color/Semantic/Info` |
| Title | fill | `Text Color/Body/Primary` |
| Text | fill | `Text Color/Body/Primary` |
| Label | fill | `Text Color/Action/On Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | — | `[ARCHIVE]/*Mobile/Heading6` |
| Text | typography | — | `Body/M` |
| Label | typography | — | `Action/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Banner/Mobile/Info | border-radius | — | `rounded-8` |
| Banner/Mobile/Info | effects | — | `light/Shadow/Popover` |
| Button | border-radius | — | `rounded-8` |
| Button | padding-x | — | `size-16` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Banner/Mobile/Info**: hardcoded itemSpacing (16px)
- **Banner/Mobile/Info**: hardcoded padding
- **Contents**: hardcoded itemSpacing (8px)
- **Type Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Text**: hardcoded padding
- **Close Button**: hardcoded padding
- **CTA**: hardcoded itemSpacing (16px)
- **Button**: hardcoded itemSpacing (8px)
