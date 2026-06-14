---
spec_version: "0.1"
component:
  name: RadioSelection
  figma_key: 7d42592bad5d97596c563b3485de36a04ecc80ac
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25371:2478
content_hash: 51cab9ce913b5d5d1fdd717effb0d7e341d0665ec2f116f308d99ee2f41ebab0
extracted_at: 2026-06-14T10:04:05.553Z
---

## Definition

_To be written._

## Anatomy

1. Radio (component)
2. label + copy

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Description | boolean | true / false | true |

## Variants

- **Size**: L (default) · M
- **Modifiers**: Default · Hover · Selected

## States

- Default

## Tokens used

### Color

#### Container

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |
| border | `Border Color/Divider/Divider Secondary` |

**When Default = false**

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |
| border | `Text Color/Action/Default` |

**When Hover = true**

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |
| border | `Border Color/Divider/Divider Secondary` · `Border Color/Input Field/Input Field (Hover)` |

**When Selected = true**

| Property | Token |
|---|---|
| border | `Border Color/Divider/Divider Secondary` |

#### Selected

| Property | Condition | Token |
|---|---|---|
| fill | Selected=true | `Background/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Radio Control | fill | `Background/Surface/Primary` |
| Radio Control | border | `Border Color/Input Field/Input Field` |
| label | fill | `Text Color/Body/Primary` |
| copy | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| label | typography | Size=L | `Subtitle/M - Strong` |
| label | typography | Size=M | `Subtitle/S` |
| copy | typography | Size=L | `Body/L` |
| copy | typography | Size=M | `Caption/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | Size=M | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Radio](./radio.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (16px)
- **Container**: hardcoded cornerRadius (12px)
- **Container**: hardcoded padding
- **Radio**: hardcoded itemSpacing (8px)
- **Radio Control**: hardcoded itemSpacing (10px)
- **Radio Control**: hardcoded cornerRadius (9999px)
- **Label**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **label + copy**: hardcoded itemSpacing (4px)
