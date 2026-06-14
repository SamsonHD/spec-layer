---
spec_version: "0.1"
component:
  name: Time Range Picker
  figma_key: a24b567a01bbe67c3693efa1ebeca448affe356b
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 6409:372382
content_hash: fdb7a0c75f122910ccabbdddf804e63cb4eb90a5264b57f1c630741a911fea33
extracted_at: 2026-06-14T10:04:18.925Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Field Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Hint | text | — | Help text goes here. |
| Show Label | boolean | true / false | true |
| Optional | boolean | true / false | true |
| Label | text | — | Label |
| Show Hint | boolean | true / false | true |
| Required | boolean | true / false | true |
| End Time | text | — | 13:30 |
| Start Time | text | — | 12:15 |
| Error | text | — | Error message here. |

## Variants

- **Size**: Large (default) · Medium · Small
- **Stack**: Vertical (default) · Mobile · Horizontal
- **Modifiers**: Fill Start Time · Fill End Time · Danger/Error · Disabled

## States

- Default
- Hover
- Focus on Start
- Focus on End

## Tokens used

### Color

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=false | `Text Color/Body/Primary` |
| fill | Disabled=true | `Text Color/Body/Secondary` |

#### Picker

| Property | State | Vertical | Mobile | Horizontal |
|---|---|---|---|---|
| fill | Default | `Background/Surface/Primary` | — | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` | — | `Background/Surface/Primary` |
| fill | Focus on Start | `Background/Surface/Primary` | — | `Background/Surface/Primary` |
| fill | Focus on End | `Background/Surface/Primary` | — | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field` | — | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` | — | `Border Color/Input Field/Input Field (Hover)` |
| border | Focus on Start | `Border Color/Input Field/Input Field` | — | `Border Color/Input Field/Input Field` |
| border | Focus on End | `Border Color/Input Field/Input Field` | — | `Border Color/Input Field/Input Field` |

**When Danger/Error = true**

| Property | State | Vertical | Mobile | Horizontal |
|---|---|---|---|---|
| fill | Default | `Background/Surface/Primary` | — | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` | — | `Background/Surface/Primary` |
| fill | Focus on Start | `Background/Surface/Primary` | — | `Background/Surface/Primary` |
| fill | Focus on End | `Background/Surface/Primary` | — | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field Danger` | — | `Border Color/Input Field/Input Field Danger` |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` | — | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Focus on Start | `Border Color/Input Field/Input Field Danger` | — | `Border Color/Input Field/Input Field Danger` |
| border | Focus on End | `Border Color/Input Field/Input Field Danger` | — | `Border Color/Input Field/Input Field Danger` |

**When Disabled = true**

| Property | Vertical | Mobile | Horizontal |
|---|---|---|---|
| fill | `Background/Surface/Secondary` | — | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` | — | `Border Color/Input Field/Input Field Disabled` |

#### Start Date Input

| Property | State | Vertical | Mobile | Horizontal |
|---|---|---|---|---|
| fill | Default | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| fill | Focus on Start | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| fill | Focus on End | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| border | Focus on Start | `Border Color/Input Field/Input Field (Focus)` | `Border Color/Input Field/Input Field (Focus)` | `Border Color/Input Field/Input Field (Focus)` |

**When Danger/Error = true**

| Property | State | Vertical | Mobile | Horizontal |
|---|---|---|---|---|
| fill | Default | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| fill | Focus on Start | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| fill | Focus on End | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| border | Focus on Start | `Border Color/Input Field/Input Field Danger (Focus)` | `Border Color/Input Field/Input Field Danger (Focus)` | `Border Color/Input Field/Input Field Danger (Focus)` |

**When Disabled = true**

| Property | Vertical | Mobile | Horizontal |
|---|---|---|---|
| fill | `Background/Surface/Secondary` | `Background/Transparent` | `Background/Surface/Secondary` |

#### icon

| Property | State | Large | Medium | Small |
|---|---|---|---|---|
| fill | Default | `Text Color/Body/Secondary` | `Text Color/Semantic/Disabled` | `Text Color/Body/Secondary` |
| fill | Hover | `Text Color/Body/Secondary` | `Text Color/Semantic/Disabled` | `Text Color/Body/Secondary` |
| fill | Focus on Start | — | `Text Color/Semantic/Disabled` | — |
| fill | Focus on End | — | `Text Color/Semantic/Disabled` | — |

**When Fill Start Time = true**

| Property | Token |
|---|---|
| fill | `Text Color/Body/Secondary` |

**When Fill End Time = true**

| Property | Token |
|---|---|
| fill | `Text Color/Body/Secondary` |

**When Danger/Error = true**

| Property | Large | Medium | Small |
|---|---|---|---|
| fill | — | `Text Color/Semantic/Disabled` | — |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Stack=Vertical · Horizontal, Disabled=true | `Text Color/Semantic/Disabled` |
| fill | Size=Large · Medium, Stack=Mobile, Disabled=true | `Text Color/Semantic/Disabled` |
| fill | Size=Small, Stack=Mobile, Disabled=true | `Text Color/Body/Secondary` |
| fill | Size=Medium · Small, Stack=Vertical · Horizontal, Fill End Time=true, Disabled=false | `Text Color/Body/Primary` |
| fill | Size=Medium, Stack=Mobile, Fill End Time=true, Disabled=false | `Text Color/Body/Primary` |
| fill | Size=Large · Small, Stack=Mobile, Fill Start Time=false, Fill End Time=false, Danger/Error=true | `Text Color/Body/Secondary` |
| fill | Size=Large, Stack=Vertical · Horizontal, Fill Start Time=false, Fill End Time=false, Danger/Error=true | `Text Color/Body/Secondary` |
| fill | Size=Medium · Small, Stack=Vertical · Horizontal, Fill Start Time=true, Fill End Time=false, Disabled=false | `Text Color/Body/Primary` |
| fill | Size=Medium, Stack=Mobile, Fill Start Time=true, Fill End Time=false, Disabled=false | `Text Color/Body/Primary` |
| fill | Size=Small, Stack=Vertical · Horizontal, Fill Start Time=false, Fill End Time=false, Danger/Error=true | `Text Color/Body/Primary` |
| fill | Size=Large · Small, Stack=Mobile, State=Focus on Start · Focus on End, Fill Start Time=false, Fill End Time=false, Danger/Error=false, Disabled=false | `Text Color/Body/Secondary` |
| fill | Size=Large, Stack=Vertical · Horizontal, State=Focus on Start · Focus on End, Fill Start Time=false, Fill End Time=false, Danger/Error=false, Disabled=false | `Text Color/Body/Secondary` |
| fill | Size=Small, Stack=Vertical · Horizontal, State=Focus on Start · Focus on End, Fill Start Time=false, Fill End Time=false, Danger/Error=false, Disabled=false | `Text Color/Body/Primary` |

#### Start Date Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Fill Start Time=false | `Text Color/Input/Input Placeholder` |
| fill | Fill Start Time=true, Disabled=false | `Text Color/Body/Primary` |
| fill | Fill Start Time=true, Disabled=true | `Text Color/Input/Input Disabled` |

#### Divider

| Property | Condition | Token |
|---|---|---|
| fill | Stack=Vertical · Horizontal, Disabled=false | `Background/Divider/Divider` |
| fill | Stack=Vertical · Horizontal, Disabled=true | `Border Color/Input Field/Input Field Disabled` |

#### End Date Input

| Property | State | Vertical | Mobile | Horizontal |
|---|---|---|---|---|
| fill | Default | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| fill | Focus on Start | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| fill | Focus on End | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| border | Focus on End | `Border Color/Input Field/Input Field (Focus)` | `Border Color/Input Field/Input Field (Focus)` | `Border Color/Input Field/Input Field (Focus)` |

**When Danger/Error = true**

| Property | State | Vertical | Mobile | Horizontal |
|---|---|---|---|---|
| fill | Default | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| fill | Focus on Start | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| fill | Focus on End | `Background/Surface/Primary` | `Background/Transparent` | `Background/Surface/Primary` |
| border | Focus on End | `Border Color/Input Field/Input Field Danger (Focus)` | `Border Color/Input Field/Input Field Danger (Focus)` | `Border Color/Input Field/Input Field Danger (Focus)` |

**When Disabled = true**

| Property | Vertical | Mobile | Horizontal |
|---|---|---|---|
| fill | `Background/Surface/Secondary` | `Background/Transparent` | `Background/Surface/Secondary` |

#### End Date Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Fill End Time=false | `Text Color/Input/Input Placeholder` |
| fill | Fill End Time=true, Disabled=false | `Text Color/Body/Primary` |
| fill | Fill End Time=true, Disabled=true | `Text Color/Input/Input Disabled` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Danger/Error=true | `Text Color/Semantic/Error` |

#### Date Range Picker

| Property | State | Vertical | Mobile | Horizontal |
|---|---|---|---|---|
| fill | Default | — | `Background/Surface/Primary` | — |
| fill | Hover | — | `Background/Surface/Primary` | — |
| fill | Focus on Start | — | `Background/Surface/Primary` | — |
| fill | Focus on End | — | `Background/Surface/Primary` | — |
| border | Default | — | `Border Color/Input Field/Input Field` | — |
| border | Hover | — | `Border Color/Input Field/Input Field (Hover)` | — |
| border | Focus on Start | — | `Border Color/Input Field/Input Field (Hover)` | — |
| border | Focus on End | — | `Border Color/Input Field/Input Field (Hover)` | — |

**When Danger/Error = true**

| Property | State | Vertical | Mobile | Horizontal |
|---|---|---|---|---|
| fill | Default | — | `Background/Surface/Primary` | — |
| fill | Hover | — | `Background/Surface/Primary` | — |
| fill | Focus on Start | — | `Background/Surface/Primary` | — |
| fill | Focus on End | — | `Background/Surface/Primary` | — |
| border | Default | — | `Border Color/Input Field/Input Field Danger` | — |
| border | Hover | — | `Border Color/Input Field/Input Field Danger (Hover)` | — |
| border | Focus on Start | — | `Border Color/Input Field/Input Field Danger (Hover)` | — |
| border | Focus on End | — | `Border Color/Input Field/Input Field Danger (Hover)` | — |

**When Disabled = true**

| Property | Vertical | Mobile | Horizontal |
|---|---|---|---|
| fill | — | `Background/Surface/Secondary` | — |
| border | — | `Border Color/Input Field/Input Field Disabled` | — |

#### divider

| Property | Condition | Token |
|---|---|---|
| fill | Stack=Mobile, Disabled=false | `Background/Divider/Divider` |
| fill | Stack=Mobile, Disabled=true | `Border Color/Input Field/Input Field Disabled` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus on Start · Focus on End, Danger/Error=true | `Border Color/Semantic/Danger` |
| border | State=Focus on Start · Focus on End, Danger/Error=false, Disabled=false | `Border Color/Action/Action` |

#### Caret

| Property | Condition | Token |
|---|---|---|
| fill | Stack=Vertical · Horizontal, State=Focus on Start · Focus on End, Disabled=false | `Background/Action/Action` |

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
| Start Date Placeholder | typography | Size=Large · Medium, Stack=Vertical · Horizontal, State=Default · Hover | `Value/M` |
| Start Date Placeholder | typography | Size=Small | `Value/S` |
| Start Date Placeholder | typography | Size=Large, Stack=Mobile | `Value/M` |
| Start Date Placeholder | typography | Size=Medium, Stack=Mobile | `[ARCHIVE]/*Mobile/Input Field Value` |
| Start Date Placeholder | typography | Size=Large · Medium, Stack=Vertical · Horizontal, State=Focus on Start · Focus on End | `[ARCHIVE]/*Mobile/Input Field Value` |
| End Date Placeholder | typography | Size=Large · Medium, Stack=Vertical · Horizontal, State=Default · Hover · Focus on Start | `Value/M` |
| End Date Placeholder | typography | Size=Small | `Value/S` |
| End Date Placeholder | typography | Size=Large, Stack=Mobile | `Value/M` |
| End Date Placeholder | typography | Size=Medium, Stack=Mobile | `[ARCHIVE]/*Mobile/Input Field Value` |
| End Date Placeholder | typography | Size=Large · Medium, Stack=Vertical · Horizontal, State=Focus on End | `[ARCHIVE]/*Mobile/Input Field Value` |
| Hint | font-size | — | `font-size/fs-150` |
| Hint | font-family | — | `font-family/font-family` |
| Hint | line-height | — | `line-height/lh-250` |
| Hint | font-weight | — | `font-weight/fw-400` |
| Error Message | font-size | Danger/Error=true | `font-size/fs-150` |
| Error Message | font-family | Danger/Error=true | `font-family/font-family` |
| Error Message | line-height | Danger/Error=true | `line-height/lh-250` |
| Error Message | font-weight | Danger/Error=true | `font-weight/fw-400` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Picker | border-radius | Size=Small, Stack=Vertical · Horizontal | `rounded-8` |
| Start Date Input | border-radius | Size=Small, Stack=Mobile | `rounded-8` |
| End Date Input | border-radius | Size=Small, Stack=Mobile | `rounded-8` |

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
- **Picker**: hardcoded cornerRadius (8px)
- **Start Date Input**: hardcoded itemSpacing (8px)
- **Start Date Input**: hardcoded cornerRadius (8px)
- **Start Date Input**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Divider**: hardcoded cornerRadius (2px)
- **End Date Input**: hardcoded itemSpacing (8px)
- **End Date Input**: hardcoded cornerRadius (8px)
- **End Date Input**: hardcoded padding
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
