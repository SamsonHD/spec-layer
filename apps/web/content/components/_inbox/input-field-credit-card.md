---
spec_version: "0.1"
component:
  name: Input Field - Credit Card
  figma_key: b869bb8a31bc085d110ea970f21871d261e94e2c
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 5939:387332
content_hash: 44dc24e5d96a800d331bf762489305a3fdc6b37e82fc93b65c0dc17fdfcb5093
extracted_at: 2026-06-14T10:03:56.236Z
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
| Label | text | — | Label |
| Clear Btn | boolean | true / false | true |
| Required | boolean | true / false | false |
| Hint | text | — | Help text goes here. |
| Placeholder | text | — | Placeholder |
| Error | text | — | Error message here. |

## Variants

- **Size**: Large (default) · Medium · Small
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

#### Credit Card Processors

| Property | Condition | Token |
|---|---|---|
| fill | Empty=true | `Background/Semantic/Status → Informational` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Empty=true | `Text Color/Body/Inverted → Primary` |

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Empty=true | `Text Color/Input/Input Placeholder` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=false | `Text Color/Body/Secondary` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Danger/Error=true | `Text Color/Semantic/Error` |

#### Cursor

| Property | Condition | Token |
|---|---|---|
| fill | State=Focus · Active, Disabled=false | `Text Color/Body/Black` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Danger/Error=true | `Border Color/Semantic/Danger` |
| border | State=Focus, Disabled=false, Danger/Error=false | `Border Color/Action/Action` |

#### Text Content

| Property | Condition | Token |
|---|---|---|
| fill | Empty=false, Disabled=false | `Text Color/Body/Primary` |
| fill | Empty=false, Disabled=true | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/S` |
| Placeholder | typography | Size=Large · Medium, Empty=true | `Value/M` |
| Placeholder | typography | Size=Small, Empty=true | `Value/S` |
| Error Message | font-size | Danger/Error=true | `font-size/fs-150` |
| Error Message | font-family | Danger/Error=true | `font-family/font-family` |
| Error Message | line-height | Danger/Error=true | `line-height/lh-250` |
| Error Message | font-weight | Danger/Error=true | `font-weight/fw-400` |
| Text Content | typography | Size=Large · Medium, Empty=false | `Value/M` |
| Text Content | typography | Size=Small, Empty=false | `Value/S` |

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
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **Credit Card Processors**: hardcoded cornerRadius (2px)
- **Credit Card Alt**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **.atom/FieldCursor**: hardcoded color (no variable or style)
- **Cursor**: hardcoded cornerRadius (3px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
