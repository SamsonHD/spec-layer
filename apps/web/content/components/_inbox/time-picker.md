---
spec_version: "0.1"
component:
  name: Time Picker
  figma_key: 3202ae805e35efa92904e0735a0d077996cd93bb
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 6268:347713
content_hash: 186303c6c1e6f66806195239f99483234eb4f94253f2c7fb4bbb491894b64633
extracted_at: 2026-06-14T10:04:11.669Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Field Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Hint | boolean | true / false | true |
| Required | boolean | true / false | true |
| Optional | boolean | true / false | true |
| Show Label | boolean | true / false | true |
| Label | text | — | Label |
| Placeholder | text | — | HH:MM |
| Error | text | — | Error message here. |
| Hint | text | — | Help text goes here. |
| Text | text | — | 13:00 |

## Variants

- **Size**: Medium (default) · Small · Xtra Small
- **Stack**: Vertical (default)
- **Modifiers**: Empty · Danger/Error · Disabled

## States

- Default
- Hover
- Focus

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

#### icon

| Property | State | Medium | Small | Xtra Small |
|---|---|---|---|---|
| fill | Default | `Text Color/Body/Secondary` | `Text Color/Body/Primary` | `Text Color/Body/Secondary` |
| fill | Hover | `Text Color/Body/Secondary` | `Text Color/Body/Primary` | `Text Color/Body/Secondary` |
| fill | Focus | `Text Color/Body/Primary` | `Text Color/Body/Primary` | `Text Color/Body/Primary` |

**When Empty = false**

| Property | Token |
|---|---|
| fill | `Text Color/Body/Primary` |

**When Danger/Error = true**

| Property | State | Medium | Small | Xtra Small |
|---|---|---|---|---|
| fill | Default | `Text Color/Body/Secondary` | `Text Color/Body/Primary` | `Text Color/Body/Secondary` |
| fill | Hover | `Text Color/Body/Secondary` | `Text Color/Body/Primary` | `Text Color/Body/Secondary` |
| fill | Focus | `Text Color/Body/Primary` | `Text Color/Body/Primary` | `Text Color/Body/Primary` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Disabled` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | State=Default · Hover, Empty=false, Danger/Error=true | `Text Color/Body/Primary` |
| fill | Size=Medium · Small, State=Focus, Empty=false, Danger/Error=true | `Text Color/Body/Primary` |

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

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Danger/Error=true | `Border Color/Semantic/Danger` |
| border | State=Focus, Danger/Error=false, Disabled=false | `Border Color/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Optional | fill | `Text Color/Body/Secondary` |
| Required* | fill | `Text Color/Semantic/Error` |
| Hint | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/S` |
| Optional | typography | — | `Label/S` |
| Required* | typography | — | `Label/S` |
| Placeholder | typography | — | `Value/S` |
| Hint | font-size | — | `font-size/fs-150` |
| Hint | font-family | — | `font-family/font-family` |
| Hint | line-height | — | `line-height/lh-250` |
| Hint | font-weight | — | `font-weight/fw-400` |
| Error Message | font-size | Danger/Error=true | `font-size/fs-150` |
| Error Message | font-family | Danger/Error=true | `font-family/font-family` |
| Error Message | line-height | Danger/Error=true | `line-height/lh-250` |
| Error Message | font-weight | Danger/Error=true | `font-weight/fw-400` |

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
