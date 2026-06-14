---
spec_version: "0.1"
component:
  name: Dropdown Menu Option
  figma_key: ade72fa7a4f64f19d78078cedd7f4813105a6ab0
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 6682:283272
content_hash: 939a29abe122e9a5b896c6cd5796eb1b2cc5662bef406dd2c36a1a788de0f054
extracted_at: 2026-06-14T10:03:12.484Z
---

## Definition

_To be written._

## Anatomy

1. Label

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Counter Badge | boolean | true / false | false |
| Show Icon Left | boolean | true / false | false |
| Text | text | — | Label |
| Has Submenu | boolean | true / false | false |
| Secondary Text | boolean | true / false | false |
| Show Link | boolean | true / false | false |
| Show Icon Right | boolean | true / false | false |
| Show Chip Status | boolean | true / false | false |
| Slot | undefined | — | — |

## Variants

- **Type**: Multi-Select · Danger · Title · Separator · Slot · Default (default)
- **Modifiers**: Disabled · Hover · Focused · Selected

## States

- Default

## Tokens used

### Color

#### Label

| Property | Multi-Select | Danger | Title | Separator | Slot | Default |
|---|---|---|---|---|---|---|
| fill | `Text Color/Body/Primary` | `Text Color/Semantic/Danger Link` | `Text Color/Body/Secondary` | — | — | `Text Color/Body/Primary` |

**When Disabled = True**

| Property | Multi-Select | Danger | Title | Separator | Slot | Default |
|---|---|---|---|---|---|---|
| fill | `Text Color/Semantic/Disabled` | `Text Color/Semantic/Disabled` | `Text Color/Semantic/Disabled` | — | — | `Text Color/Semantic/Disabled` |

**When Selected = True**

| Property | Multi-Select | Danger | Title | Separator | Slot | Default |
|---|---|---|---|---|---|---|
| fill | `Text Color/Body/Primary` | `Text Color/Semantic/Danger Link` · `Text Color/Body/Primary` | `Text Color/Body/Secondary` · `Text Color/Body/Primary` | `Text Color/Body/Primary` | `Text Color/Body/Primary` | `Text Color/Body/Primary` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=True, Selected=True | `Text Color/Input/Input Disabled` |

#### optionWrapper

| Property | Condition | Token |
|---|---|---|
| fill | Type=Multi-Select · Danger · Default, Hover=True | `Background/Surface/Quaternary` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | Focused=True | `Border Color/Action/Action` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=False, Selected=True | `Text Color/Action/Default` |
| fill | Disabled=True, Selected=True | `Text Color/Semantic/Disabled` |

#### Check Wrapper

| Property | Multi-Select | Danger | Title | Separator | Slot | Default |
|---|---|---|---|---|---|---|
| fill | `Background/Action/Action` | — | — | — | — | — |
| border | `Border Color/Action/Action` | — | — | — | — | — |

**When Disabled = True**

| Property | Multi-Select | Danger | Title | Separator | Slot | Default |
|---|---|---|---|---|---|---|
| fill | `Background/Surface/Disabled` | — | — | — | — | — |
| border | `Border Color/Input Field/Input Field Disabled` | — | — | — | — | — |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Type=Multi-Select | `Text Color/Body/Inverted → Primary` |

#### divider

| Property | Condition | Token |
|---|---|---|
| border | Type=Separator | `Border Color/Divider/Divider Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Type=Multi-Select · Danger · Default | `Value/S` |
| Label | typography | Type=Title | `Caption/S - Strong` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded color (no variable or style)
- **Container**: hardcoded padding
- **optionWrapper**: hardcoded itemSpacing (8px)
- **optionWrapper**: hardcoded cornerRadius (4px)
- **optionWrapper**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
- **ChipStatus**: hardcoded itemSpacing (8px)
- **ChipStatus**: hardcoded cornerRadius (9999px)
- **ChipStatus**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **Circle**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Xmark Large**: hardcoded color (no variable or style)
