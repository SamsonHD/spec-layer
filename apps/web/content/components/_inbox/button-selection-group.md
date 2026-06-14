---
spec_version: "0.1"
component:
  name: Button Selection Group
  figma_key: 73201496acc90370c06ea15fcbdc504328af5ba2
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26926:26060
content_hash: e0abda6f0092d580d4cf1114e40c8b6338052d8587cc38df67f4333122cbf113
extracted_at: 2026-06-14T10:03:15.007Z
---

## Definition

_To be written._

## Anatomy

1. Button Selection (component)
2. Rectangle 2
3. Row

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show separator | boolean | true / false | true |

## Variants

- **Size**: M · S (default)

## States

- Default

## Tokens used

### Color

#### Count Label

| Property | Condition | Token |
|---|---|---|
| fill | — | `Text Color/Body/Primary` |
| fill | — | `Text Color/Semantic/Disabled` |
| fill | Size=M | `Text Color/Action/Link Secondary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Button Selection | fill | `Background/Action/Action Secondary` |
| Button Selection | fill | `Background/Action/Action Secondary (Selected)` |
| Button Selection | border | `Border Color/Action/Action` |
| Button Selection | border | `Border Color/Action/Secondary Button (Default)` |
| Label | fill | `Text Color/Action/On Secondary` |
| Counter Badge | fill | `Background/Surface/Primary` |
| Counter Badge | fill | `Background/Surface/Secondary` |
| Rectangle 2 | border | `Border Color/Divider/Divider Secondary` |
| icon | fill | `Text Color/Semantic/Error` |
| icon | fill | `Text Color/Semantic/Success` |
| icon | fill | `Text Color/Semantic/Warning` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Size=M | `Action/S` |
| Label | typography | Size=S | `Action/XS` |
| Count Label | typography | Size=M | `Caption/S - Strong` |
| Count Label | typography | Size=S | `Caption/XS - Strong` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Selection | border-radius | — | `rounded-8` |
| Button Selection | padding-x | Size=M | `size-12` |
| Button Selection | padding-y | Size=M | `size-8` |
| Button Selection | padding | Size=S | `size-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Button Selection](./button-selection.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (16px)
- **Button Selection**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
- **Row**: hardcoded itemSpacing (12px)
