---
spec_version: "0.1"
component:
  name: Date Picker
  figma_key: bfba0a4dcb131e25e3617953162cb2778a4d7b51
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 5885:402978
content_hash: 3df510e080607e486491c3f34d5a30b4b2243d2d27a64543c0c86e529b5d3676
extracted_at: 2026-06-14T10:03:56.668Z
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
| Required | boolean | true / false | false |
| Optional | boolean | true / false | false |
| Show Label | boolean | true / false | true |
| Label | text | — | Label |
| Placeholder | text | — | MM/DD/YYYY |
| Error | text | — | Error message here. |
| Hint | text | — | Help text goes here. |
| Text | text | — | 12/10/2022 |

## Variants

- **Size**: Medium · Large (default) · Small · XtrSmall
- **Stack**: Vertical (default) · Horizontal
- **Modifiers**: Empty · Danger/Error · Disabled

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

#### Picker

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

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

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
| fill | `Text Color/Body/Primary` · `Text Color/Body/Secondary` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Disabled` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Size=Medium · Small · XtrSmall, Empty=false, Disabled=true | `Text Color/Body/Secondary` |

#### Placeholder

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
| border | State=Focus, Danger/Error=false, Disabled=false | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/S` |
| Placeholder | typography | — | `Value/S` |
| Error Message | font-size | Danger/Error=true | `font-size/fs-150` |
| Error Message | font-family | Danger/Error=true | `font-family/font-family` |
| Error Message | line-height | Danger/Error=true | `line-height/lh-250` |
| Error Message | font-weight | Danger/Error=true | `font-weight/fw-400` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Picker | effects | State=Active, Danger/Error=true | `light/Ring/Input Danger - Active` |
| Picker | effects | State=Active, Danger/Error=false, Disabled=false | `light/Ring/Input - Active` |

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
- **Picker**: hardcoded itemSpacing (8px)
- **Picker**: hardcoded cornerRadius (8px)
- **Picker**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Hint Wrapper**: hardcoded padding
