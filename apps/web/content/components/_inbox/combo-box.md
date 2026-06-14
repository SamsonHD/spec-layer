---
spec_version: "0.1"
component:
  name: Combo Box
  figma_key: 697a86fd5062b916d639929a35e20fbc87dbc87d
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 5770:394477
content_hash: 51d44bd8b6be91335e51fb952ce66d09ef388cb951c44c40b699227b1f5fd1a5
extracted_at: 2026-06-14T10:03:26.215Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Field Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Hint | boolean | true / false | false |
| Placeholder | text | — | Placeholder |
| Hint | text | — | Help text goes here. |
| Show Label | boolean | true / false | true |
| Required | boolean | true / false | false |
| Optional | boolean | true / false | false |
| Error | text | — | Error message here. |
| Label | text | — | Label |

## Variants

- **Size**: Large (default) · Medium
- **Modifiers**: Danger/Error · Disabled · Empty

## States

- Default
- Hover
- Focus

## Tokens used

### Color

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=false, Empty=true | `Text Color/Body/Primary` |
| fill | Disabled=true | `Text Color/Body/Secondary` |
| fill | Empty=false | `Text Color/Body/Primary` |

#### Input

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field (Focus)` |

**When Danger/Error = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field Danger` |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field Danger (Focus)` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Empty=true | `Text Color/Input/Input Placeholder` |
| fill | Empty=false | `Text Color/Body/Primary` |

#### ChipAction

| Property | Condition | Token |
|---|---|---|
| fill | Empty=false | `Background/Surface/Primary` |
| border | Empty=false | `Border Color/Chip/Disabled` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Empty=false | `Text Color/Body/Primary` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Danger/Error=true | `Text Color/Semantic/Error` |

#### Caret

| Property | Condition | Token |
|---|---|---|
| fill | States=Focus, Disabled=false | `Background/Action/Action` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | States=Focus, Danger/Error=true | `Border Color/Semantic/Danger` |
| border | States=Focus, Danger/Error=false, Disabled=false | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/S` |
| Label | typography | Empty=false | `Chip/S` |
| Placeholder | typography | Size=Medium | `Value/S` |
| Placeholder | typography | Size=Large | `Value/M` |
| Error Message | typography | Size=Medium, Danger/Error=true | `Caption/S` |
| Error Message | font-size | Size=Large, Danger/Error=true | `font-size/fs-150` |
| Error Message | font-family | Size=Large, Danger/Error=true | `font-family/font-family` |
| Error Message | line-height | Size=Large, Danger/Error=true | `line-height/lh-250` |
| Error Message | font-weight | Size=Large, Danger/Error=true | `font-weight/fw-400` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **ChipAction**: hardcoded itemSpacing (8px)
- **ChipAction**: hardcoded cornerRadius (9999px)
- **ChipAction**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
