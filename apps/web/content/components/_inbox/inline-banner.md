---
spec_version: "0.1"
component:
  name: Inline Banner
  figma_key: 4bbb0aba83ee7133700ab56f88ef52decc1650c1
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24919:926
content_hash: a37b2d750270b67080fb5656dab9033f6666f55edf7d0502ab3e0e46c8836ea4
extracted_at: 2026-06-14T10:03:14.965Z
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
| Close button | boolean | true / false | false |
| Button Group | boolean | true / false | false |

## Variants

- **Type**: Success (default) · Information · Error · Warning
- **Size**: Default (default) · Small

## States

- Default

## Tokens used

### Color

#### Container

| Property | Default | Small |
|---|---|---|
| border | — | `Border Color/Divider/Divider` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Type=Success, Size=Default | `Background/Semantic/Status → Success` |
| fill | Type=Information, Size=Default | `Background/Semantic/Status → Informational` |
| fill | Type=Error, Size=Default | `Background/Semantic/Status → Error` |
| fill | Type=Warning, Size=Default | `Background/Semantic/Status → Warning` |
| border | Type=Success, Size=Default | `Border Color/Banner/Banner Success` |
| border | Type=Information, Size=Default | `Border Color/Banner/Banner Info` |
| border | Type=Error, Size=Default | `Border Color/Banner/Banner Danger` |
| border | Type=Warning, Size=Default | `Border Color/Banner/Banner Warning` |

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
- **Button group**: hardcoded itemSpacing (16px)
- **Button**: hardcoded itemSpacing (8px)
- **Button (Link)**: hardcoded itemSpacing (4px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
