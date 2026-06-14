---
spec_version: "0.1"
component:
  name: Inline Issue
  figma_key: 3218150e4653c224bc74bef47b495b96b75e8878
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26093:48596
content_hash: 69624b84ca63d7f6ae26d14230804fed964105beb109a99e1189e8bb0f183564
extracted_at: 2026-06-14T10:03:14.972Z
---

## Definition

_To be written._

## Anatomy

1. Inline Banner (component)
2. Frame 1

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Issue content | undefined | — | — |
| Expanded | boolean | true / false | false |
| Actions | boolean | true / false | true |
| Button Icon | boolean | true / false | true |

## Variants

- **Modifiers**: Warning · Error · Emphasized

## States

- Default

## Tokens used

### Color

#### Container

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |
| border | `Border Color/Divider/Divider Secondary` |

**When Warning = False**

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |
| border | `Border Color/Divider/Divider Secondary` |

**When Emphasized = True**

| Property | Token |
|---|---|
| fill | `Background/Semantic/Status → Warning` |
| border | `Border Color/Divider/Divider Secondary` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Warning=False, Emphasized=True | `Background/Semantic/Status → Error` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | — | `Text Color/Body/Primary` |
| fill | Warning=True | `Text Color/Semantic/Warning` |
| fill | Warning=False | `Text Color/Semantic/Danger Link` |

#### Button Icon

| Property | Condition | Token |
|---|---|---|
| border | Emphasized=False | `Border Color/Action/Secondary Button (Default)` |
| fill | Emphasized=True | `Background/Action/Action Tertiary` |

#### warning-line

| Property | Condition | Token |
|---|---|---|
| border | Warning=False, Emphasized=True | `Border Color/Semantic/Danger` |
| border | Warning=True, Emphasized=True | `Text Color/Semantic/Warning` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Inline Banner | border | `Border Color/Divider/Divider` |
| copy | fill | `Text Color/Body/Primary` |
| Button | fill | `Background/Action/Action Secondary` |
| Button | border | `Border Color/Action/Secondary Button (Default)` |
| Label | fill | `Text Color/Action/On Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| copy | typography | Emphasized=False | `Body/L` |
| copy | typography | Emphasized=True | `Subtitle/M` |
| Label | typography | — | `Action/XS` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Inline Banner | border-radius | — | `rounded-8` |
| Button | border-radius | — | `rounded-8` |
| Button | padding-x | — | `size-12` |
| Button | padding-y | — | `size-4` |
| Button Icon | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Inline Banner](./inline-banner.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded padding
- **Inline Banner**: hardcoded itemSpacing (16px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Button group**: hardcoded itemSpacing (16px)
- **Button**: hardcoded itemSpacing (8px)
- **Button (Link)**: hardcoded itemSpacing (4px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
- **Frame 1**: hardcoded itemSpacing (16px)
- **Actions**: hardcoded itemSpacing (12px)
- **Button**: hardcoded itemSpacing (4px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
