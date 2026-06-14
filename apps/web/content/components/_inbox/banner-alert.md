---
spec_version: "0.1"
component:
  name: Banner Alert
  figma_key: 79d11fbd673b18401e846df5ec5077a1282f5705
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26013:21514
content_hash: 22e9599192c3906e4a197f1b86b880fdf361118bfb106a4c4484e848e3fde2b8
extracted_at: 2026-06-14T10:03:14.949Z
---

## Definition

_To be written._

## Anatomy

1. iconWrapper (component)
2. copy

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Action | boolean | true / false | false |
| Close button | boolean | true / false | true |

## Variants

- **Type**: Success (default) · Information · Error · Warning
- **Size**: Default (default)

## States

- Default

## Tokens used

### Color

#### Container

| Property | Success | Information | Error | Warning |
|---|---|---|---|---|
| fill | `Background/Semantic/Status → Success` | `Background/Semantic/Status → Informational` | `Background/Semantic/Status → Error` | `Background/Semantic/Status → Warning` |
| border | `Border Color/Banner/Banner Success` | `Border Color/Banner/Banner Info` | `Border Color/Banner/Banner Danger` | `Border Color/Banner/Banner Warning` |

#### icon

| Property | Success | Information | Error | Warning |
|---|---|---|---|---|
| fill | `Text Color/Semantic/Success` | `Text Color/Semantic/Info` | `Text Color/Semantic/Danger Link` | `Text Color/Semantic/Warning` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| copy | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| copy | typography | — | `Body/L` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Container | effects | — | `light/Shadow/Card` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (16px)
- **Container**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Button (Link)**: hardcoded itemSpacing (4px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
