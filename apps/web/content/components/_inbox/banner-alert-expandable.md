---
spec_version: "0.1"
component:
  name: Banner Alert / Expandable
  figma_key: ffc7b19c65a306922834c0569d1fe8728299e22a
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26013:21580
content_hash: b22cf064186289543f35c87c266881fe028dfb93ee4c7ef5ed8dde8b21aea15c
extracted_at: 2026-06-14T10:03:14.952Z
---

## Definition

_To be written._

## Anatomy

1. Inline Banner
2. Inline Banner expandable content (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Expand | boolean | true / false | true |

## Variants

- **Semantic**: Error · Success (default) · Info · Warning

## States

- Default

## Tokens used

### Color

#### Container

| Property | Error | Success | Info | Warning |
|---|---|---|---|---|
| fill | `Background/Semantic/Status → Error` | `Background/Semantic/Status → Success` | `Background/Semantic/Status → Informational` | `Background/Semantic/Status → Warning` |
| border | `Border Color/Banner/Banner Danger` | `Border Color/Banner/Banner Success` | `Border Color/Banner/Banner Info` | `Border Color/Banner/Banner Warning` |

#### Inline Banner

| Property | Error | Success | Info | Warning |
|---|---|---|---|---|
| fill | `Background/Semantic/Status → Error` | `Background/Semantic/Status → Success` | `Background/Semantic/Status → Informational` | `Background/Semantic/Status → Warning` |

#### icon

| Property | Error | Success | Info | Warning |
|---|---|---|---|---|
| fill | `Text Color/Semantic/Danger Link` | `Text Color/Semantic/Success` | `Text Color/Semantic/Info` | `Text Color/Semantic/Warning` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| copy | fill | `Text Color/Body/Primary` |
| copy | fill | `Text Color/Semantic/Info` |
| Button Icon | fill | `Background/Action/Action Tertiary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| copy | typography | — | `Body/L` |
| copy | typography | — | `Body/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Container | effects | — | `light/Shadow/Card` |
| Button Icon | border-radius | — | `rounded-8` |
| Inline Banner expandable content | border-bottom-left-radius | — | `rounded-8` |
| Inline Banner expandable content | border-bottom-right-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Inline Banner expandable content](./inline-banner-expandable-content.md)

## Extraction gaps

- **Inline Banner**: hardcoded itemSpacing (16px)
- **Inline Banner**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **icon+title**: hardcoded itemSpacing (4px)
- **Button (Link)**: hardcoded itemSpacing (4px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
- **Inline Banner expandable content**: hardcoded itemSpacing (16px)
- **Inline Banner expandable content**: hardcoded padding
- **container**: hardcoded itemSpacing (8px)
- **fieldname**: hardcoded itemSpacing (16px)
- **fieldname**: hardcoded padding
