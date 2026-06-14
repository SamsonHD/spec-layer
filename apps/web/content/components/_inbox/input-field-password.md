---
spec_version: "0.1"
component:
  name: Input Field - Password
  figma_key: 4c253b12908c45fc52bcf17dd16b3eab70ee1ff1
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 8609:365956
content_hash: 1087728ee2033fb7625c82324a49e243a2f4205ce65388ecb22cc7ac64daa388
extracted_at: 2026-06-14T10:03:56.420Z
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
| Label | text | — | Password |
| Required | boolean | true / false | true |
| Hint | text | — | Help text goes here. |
| Placeholder | text | — | Enter password |
| Error | text | — | Error message here. |
| Show Icon | boolean | true / false | true |
| Show Requirements | boolean | true / false | false |
| Show Tooltip Requirements | boolean | true / false | false |

## Variants

- **Size**: Large (default) · Medium · Small
- **Content**: Default (default) · Hide Pass · Show Pass
- **Modifiers**: Disabled · Danger/Error

## States

- Default
- Hover
- Focus
- Active

## Tokens used

### Color

#### Password

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

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | State=Default · Hover, Content=Default, Disabled=false | `Text Color/Input/Input Placeholder` |
| fill | Disabled=true | `Text Color/Input/Input Placeholder` |
| fill | State=Focus · Active, Content=Default, Disabled=false | `Text Color/Body/Secondary` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=false, Danger/Error=true | `Text Color/Semantic/Error` |

#### Cursor

| Property | Condition | Token |
|---|---|---|
| fill | State=Focus · Active, Disabled=false | `Text Color/Body/Black` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Disabled=false, Danger/Error=false | `Border Color/Action/Action` |
| border | State=Focus, Disabled=false, Danger/Error=true | `Border Color/Semantic/Danger` |

#### Text Content

| Property | Condition | Token |
|---|---|---|
| fill | Content=Hide Pass · Show Pass | `Text Color/Body/Primary` |

#### Show or Hide

| Property | Condition | Token |
|---|---|---|
| fill | Content=Hide Pass · Show Pass | `Text Color/Body/Secondary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Required* | fill | `Text Color/Semantic/Error` |
| icon | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Password | typography | — | `Label/S` |
| Required* | typography | — | `Label/S` |
| Placeholder | typography | Size=Large · Medium, Content=Default | `Value/M` |
| Placeholder | typography | Size=Small, Content=Default | `Value/S` |
| Error Message | font-size | Disabled=false, Danger/Error=true | `font-size/fs-150` |
| Error Message | font-family | Disabled=false, Danger/Error=true | `font-family/font-family` |
| Error Message | line-height | Disabled=false, Danger/Error=true | `line-height/lh-250` |
| Error Message | font-weight | Disabled=false, Danger/Error=true | `font-weight/fw-400` |
| Text Content | typography | Size=Large · Medium, Content=Hide Pass · Show Pass | `Value/M` |
| Text Content | typography | Size=Small, Content=Hide Pass · Show Pass | `Value/S` |
| Show or Hide | typography | Content=Hide Pass · Show Pass | `Value/M - Strong` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Input | effects | State=Active, Danger/Error=false | `light/Ring/Input - Active` |
| Input | effects | State=Active, Danger/Error=true | `light/Ring/Input Danger - Active` |

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
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Requirement Tooltip**: hardcoded itemSpacing (8px)
- **Requirement Tooltip**: hardcoded cornerRadius (4px)
- **.tooltip**: hardcoded cornerRadius (4px)
- **Arrow Up**: hardcoded padding
- **Label Wrapper**: hardcoded itemSpacing (8px)
- **Label Wrapper**: hardcoded cornerRadius (4px)
- **Requirement 1**: hardcoded itemSpacing (8px)
- **Default**: hardcoded padding
- **Requirement 2**: hardcoded itemSpacing (8px)
- **Requirement 3**: hardcoded itemSpacing (8px)
- **Requirement 4**: hardcoded itemSpacing (8px)
- **Requirement 5**: hardcoded itemSpacing (8px)
- **Requirement 6**: hardcoded itemSpacing (8px)
- **.inputRequirement**: hardcoded itemSpacing (8px)
- **Requirement List**: hardcoded itemSpacing (8px)
- **Requirement List**: hardcoded padding
