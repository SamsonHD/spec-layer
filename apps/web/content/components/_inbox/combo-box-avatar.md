---
spec_version: "0.1"
component:
  name: Combo Box Avatar
  figma_key: 1bf8f944eb2c785cc3ea4affba97750bc6294be3
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26616:23485
content_hash: 9e742272be75376670aa55330dd0006e49975bbe9a4b671ef607bf37578404a9
extracted_at: 2026-06-14T10:03:26.244Z
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
| Box Content | undefined | — | — |

## Variants

- **Size**: Large (default) · Medium · Small
- **Stack**: Vertical (default) · Horizontal
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

#### Box Content

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

#### Chip Avatar

| Property | Condition | Token |
|---|---|---|
| fill | Empty=false | `Background/Сhip/Chip` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Empty=false | `Text Color/Body/Secondary` |

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
| Label | typography | Empty=false | `Chip/XS` |
| Placeholder | typography | Size=Medium · Small | `Value/S` |
| Placeholder | typography | Size=Large | `Value/M` |
| Error Message | typography | Size=Medium · Small, Danger/Error=true | `Caption/S` |
| Error Message | font-size | Size=Large, Danger/Error=true | `font-size/fs-150` |
| Error Message | font-family | Size=Large, Danger/Error=true | `font-family/font-family` |
| Error Message | line-height | Size=Large, Danger/Error=true | `line-height/lh-250` |
| Error Message | font-weight | Size=Large, Danger/Error=true | `font-weight/fw-400` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Chip Avatar | border-radius | Empty=false | `rounded-8` |

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
- **Box Content**: hardcoded itemSpacing (8px)
- **Box Content**: hardcoded cornerRadius (8px)
- **Box Content**: hardcoded padding
- **Chip Avatar**: hardcoded itemSpacing (8px)
- **Chip Avatar**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **Avatar**: hardcoded itemSpacing (4.444444179534912px)
- **Avatar**: hardcoded cornerRadius (11109.9990234375px)
- **Photo**: hardcoded itemSpacing (8.888888359069824px)
- **Photo**: hardcoded cornerRadius (11109.9990234375px)
- **Status Badge**: hardcoded cornerRadius (100px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
