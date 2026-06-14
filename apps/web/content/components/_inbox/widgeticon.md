---
spec_version: "0.1"
component:
  name: WidgetIcon
  figma_key: f3c6e5421bc7bb6e79eb52ed3e7d646eef75496e
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25858:28251
content_hash: 2cfa0874d8f3c7afa6ce8485636cf635fc0d3023d97f0291b7db6e80613675c4
extracted_at: 2026-06-14T10:04:19.074Z
---

## Definition

_To be written._

## Anatomy

1. iconWrapper (component)

## Configuration

_None._

## Variants

- **Type**: Neutral (default) · Warning · Error · Info · Success

## States

- Default

## Tokens used

### Color

#### Container

| Property | Neutral | Warning | Error | Info | Success |
|---|---|---|---|---|---|
| fill | `Background/Surface/Quaternary` | `Background/Semantic/Status → Warning` | `Background/Semantic/Status → Error` | `Background/Semantic/Status → Informational` | `Background/Semantic/Status → Success` |

#### icon

| Property | Neutral | Warning | Error | Info | Success |
|---|---|---|---|---|---|
| fill | `Text Color/Body/Primary` | `Text Color/Semantic/Warning` | `Text Color/Semantic/Error` | `Text Color/Semantic/Info` | `Text Color/Semantic/Success` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (7.02439022064209px)
- **Container**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
