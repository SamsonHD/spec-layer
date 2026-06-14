---
spec_version: "0.1"
component:
  name: Input Field
  figma_key: 7d256b0467e95c63600864ea5478af999ff6a1f5
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 5407:354560
content_hash: 4f2889d2e3a8c0b1f0807cf46c5039e63ad61723ca0a410ab59cf941f06731ab
extracted_at: 2026-06-14T10:03:56.269Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Field Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Shows Hint | boolean | true / false | false |
| Shows Label | boolean | true / false | true |
| Optional | boolean | true / false | false |
| Right Icon | boolean | true / false | true |
| Label | text | — | Label |
| Left Icon | boolean | true / false | true |
| Required | boolean | true / false | false |
| Hint | text | — | Help text goes here. |
| Text Content | text | — | Text |
| Error | text | — | Error message here. |
|  Left Icon | instanceSwap | — | 24437:168 |
|  Right Icon | instanceSwap | — | 24437:168 |
| Description | boolean | true / false | false |
|  Text Content | boolean | true / false | true |
| Show info icon | boolean | true / false | false |

## Variants

- **Size**: Large (default) · Medium · Small
- **Stack**: Vertical (default) · Horizontal
- **Modifiers**: Empty · Disabled · Danger/Error

## States

- Default
- Hover
- Focus
- Active

## Tokens used

### Color

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=false | `Text Color/Body/Primary` |
| fill | Disabled=true | `Text Color/Body/Secondary` |

#### Input

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| fill | Active | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field (Focus)` |
| border | Active | `Border Color/Input Field/Input Field (Focus)` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

**When Danger/Error = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| fill | Active | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field Danger` |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field Danger (Focus)` |
| border | Active | `Border Color/Input Field/Input Field Danger (Hover)` |

#### icon

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Body/Secondary` |
| fill | Hover | `Text Color/Body/Secondary` |
| fill | Focus | `Text Color/Body/Primary` |
| fill | Active | `Text Color/Body/Primary` |

**When Empty = false**

| Property | Token |
|---|---|
| fill | `Text Color/Body/Primary` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Disabled` |

#### Text Content

| Property | Condition | Token |
|---|---|---|
| fill | Empty=true | `Text Color/Input/Input Placeholder` |
| fill | Empty=false, Disabled=false | `Text Color/Body/Primary` |
| fill | Empty=false, Disabled=true | `Text Color/Input/Input Disabled` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Danger/Error=true | `Text Color/Semantic/Error` |

#### Cursor

| Property | Condition | Token |
|---|---|---|
| fill | State=Focus · Active | `Text Color/Body/Black` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Danger/Error=true | `Border Color/Semantic/Danger` |
| border | State=Focus, Disabled=false, Danger/Error=false | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/S` |
| Text Content | typography | — | `Value/S` |
| Error Message | font-size | Danger/Error=true | `font-size/fs-150` |
| Error Message | font-family | Danger/Error=true | `font-family/font-family` |
| Error Message | line-height | Danger/Error=true | `line-height/lh-250` |
| Error Message | font-weight | Danger/Error=true | `font-weight/fw-400` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Input | effects | State=Active, Danger/Error=true | `light/Ring/Input Danger - Active` |
| Input | effects | State=Active, Disabled=false, Danger/Error=false | `light/Ring/Input - Active` |

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
- **Label Wrapper**: hardcoded padding
- **Label Wrapper**: hardcoded itemSpacing (2px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
