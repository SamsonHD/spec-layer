---
spec_version: "0.1"
component:
  name: Input Range
  figma_key: 71ad296f6af5a551e64ce8a7793aba1a32c9f6a6
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7940:332445
content_hash: 48cd6358fa22cea13654af01259778c2cd3d82ed4527bb088c475272a88cb7cb
extracted_at: 2026-06-14T10:03:56.490Z
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
| Optional | boolean | true / false | false |
| Label | text | — | Label |
| Show Hint | boolean | true / false | false |
| Required | boolean | true / false | false |
| Max Value | text | — | 100.00 |
| Min Value | text | — | 12.00 |
| Error | text | — | Error message here. |
| Show Icon | boolean | true / false | true |
| Min Placeholder | text | — | Minimum |
| Max Placeholder | text | — | Maximum |

## Variants

- **Size**: Large (default) · Medium · Small
- **Stack**: Vertical (default) · Mobile
- **Modifiers**: Fill Min Value · Fill Max Value · Danger/Error · Disabled · Focus on Min · Focus on Max

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

| Property | State | Vertical | Mobile |
|---|---|---|---|
| fill | Default | `Background/Surface/Primary` | — |
| fill | Hover | `Background/Surface/Primary` | — |
| fill | Focus | `Background/Surface/Primary` | — |
| fill | Active | `Background/Surface/Primary` | — |
| border | Default | `Border Color/Input Field/Input Field` | — |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` | — |
| border | Focus | `Border Color/Input Field/Input Field` | — |
| border | Active | `Border Color/Input Field/Input Field` | — |

**When Danger/Error = true**

| Property | State | Vertical | Mobile |
|---|---|---|---|
| fill | Default | `Background/Surface/Primary` | — |
| fill | Hover | `Background/Surface/Primary` | — |
| fill | Focus | `Background/Surface/Primary` | — |
| fill | Active | `Background/Surface/Primary` | — |
| border | Default | `Border Color/Input Field/Input Field Danger` | — |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` | — |
| border | Focus | `Border Color/Input Field/Input Field Danger` | — |
| border | Active | `Border Color/Input Field/Input Field Danger` | — |

**When Disabled = true**

| Property | Vertical | Mobile |
|---|---|---|
| fill | `Background/Surface/Secondary` | — |
| border | `Border Color/Input Field/Input Field Disabled` | — |

#### Start Date Input

| Property | Vertical | Mobile |
|---|---|---|
| fill | `Background/Surface/Primary` | `Background/Transparent` |

**When Danger/Error = true**

| Property | Vertical | Mobile |
|---|---|---|
| fill | `Background/Surface/Primary` | `Background/Transparent` |

**When Disabled = true**

| Property | Vertical | Mobile |
|---|---|---|
| fill | `Background/Surface/Secondary` | `Background/Transparent` |

**When Focus on Min = True**

| Property | Vertical | Mobile |
|---|---|---|
| fill | `Background/Surface/Primary` | `Background/Transparent` |
| border | `Border Color/Input Field/Input Field (Focus)` | `Border Color/Input Field/Input Field (Focus)` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| border | Danger/Error=true, Focus on Min=True | `Border Color/Input Field/Input Field Danger (Focus)` |

#### icon

| Property | Token |
|---|---|
| fill | `Text Color/Body/Primary` |

**When Fill Max Value = true**

| Property | Vertical | Mobile |
|---|---|---|
| fill | `Text Color/Body/Secondary` | `Text Color/Body/Primary` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Disabled` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Stack=Vertical, Fill Max Value=true, Disabled=true | `Text Color/Input/Input Disabled` |

#### Start Date Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Fill Min Value=false, Disabled=false | `Text Color/Input/Input Placeholder` |
| fill | Disabled=true | `Text Color/Input/Input Disabled` |
| fill | Fill Min Value=true, Disabled=false | `Text Color/Body/Primary` |

#### Divider

| Property | Condition | Token |
|---|---|---|
| fill | Stack=Vertical, Disabled=false | `Background/Divider/Divider` |
| fill | Stack=Vertical, Disabled=true | `Border Color/Input Field/Input Field Disabled` |

#### End Date Input

| Property | Vertical | Mobile |
|---|---|---|
| fill | `Background/Surface/Primary` | `Background/Transparent` |

**When Danger/Error = true**

| Property | Vertical | Mobile |
|---|---|---|
| fill | `Background/Surface/Primary` | `Background/Transparent` |

**When Disabled = true**

| Property | Vertical | Mobile |
|---|---|---|
| fill | `Background/Surface/Secondary` | `Background/Transparent` |

**When Focus on Max = True**

| Property | Vertical | Mobile |
|---|---|---|
| fill | `Background/Surface/Primary` | `Background/Transparent` |
| border | `Border Color/Input Field/Input Field (Focus)` | `Border Color/Input Field/Input Field (Focus)` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| border | Danger/Error=true, Focus on Max=True | `Border Color/Input Field/Input Field Danger (Focus)` |

#### End Date Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Fill Max Value=false, Disabled=false | `Text Color/Input/Input Placeholder` |
| fill | Disabled=true | `Text Color/Input/Input Disabled` |
| fill | Fill Max Value=true, Disabled=false | `Text Color/Body/Primary` |

#### Date Range Picker

| Property | State | Vertical | Mobile |
|---|---|---|---|
| fill | Default | — | `Background/Surface/Primary` |
| fill | Hover | — | `Background/Surface/Primary` |
| fill | Focus | — | `Background/Surface/Primary` |
| fill | Active | — | `Background/Surface/Primary` |
| border | Default | — | `Border Color/Input Field/Input Field` |
| border | Hover | — | `Border Color/Input Field/Input Field (Hover)` |
| border | Focus | — | `Border Color/Input Field/Input Field (Hover)` |
| border | Active | — | `Border Color/Input Field/Input Field (Hover)` |

**When Danger/Error = true**

| Property | State | Vertical | Mobile |
|---|---|---|---|
| fill | Default | — | `Background/Surface/Primary` |
| fill | Hover | — | `Background/Surface/Primary` |
| fill | Focus | — | `Background/Surface/Primary` |
| fill | Active | — | `Background/Surface/Primary` |
| border | Default | — | `Border Color/Input Field/Input Field Danger` |
| border | Hover | — | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Focus | — | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Active | — | `Border Color/Input Field/Input Field Danger (Hover)` |

**When Disabled = true**

| Property | Vertical | Mobile |
|---|---|---|
| fill | — | `Background/Surface/Secondary` |
| border | — | `Border Color/Input Field/Input Field Disabled` |

#### divider

| Property | Condition | Token |
|---|---|---|
| fill | Stack=Mobile, Disabled=false | `Background/Divider/Divider` |
| fill | Stack=Mobile, Disabled=true | `Border Color/Input Field/Input Field Disabled` |

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
| border | State=Focus · Active, Danger/Error=true | `Border Color/Semantic/Danger` |
| border | State=Focus · Active, Danger/Error=false, Disabled=false | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/S` |
| Start Date Placeholder | typography | Disabled=false, Focus on Min=False | `Value/S` |
| Start Date Placeholder | typography | Disabled=true, Focus on Min=False | `Value/S` |
| Start Date Placeholder | typography | Disabled=true, Focus on Min=True | `Value/S` |
| Start Date Placeholder | typography | Stack=Vertical, Disabled=false, Focus on Min=True | `Value/S` |
| Start Date Placeholder | typography | State=Focus, Stack=Mobile, Fill Max Value=true, Disabled=false, Focus on Min=True | `Value/S` |
| Start Date Placeholder | typography | Size=Large · Medium, State=Active, Stack=Mobile, Fill Max Value=false, Danger/Error=true, Focus on Min=True | `Value/M` |
| Start Date Placeholder | typography | Size=Large · Medium, State=Active, Stack=Mobile, Danger/Error=false, Disabled=false, Focus on Min=True | `Value/M` |
| Start Date Placeholder | typography | Size=Small, State=Active, Stack=Mobile, Fill Max Value=false, Danger/Error=true, Focus on Min=True | `Value/S` |
| Start Date Placeholder | typography | Size=Small, State=Active, Stack=Mobile, Danger/Error=false, Disabled=false, Focus on Min=True | `Value/S` |
| Start Date Placeholder | typography | State=Focus, Stack=Mobile, Fill Min Value=true, Fill Max Value=false, Disabled=false, Focus on Min=True | `Value/S` |
| Start Date Placeholder | typography | Size=Large · Medium, State=Active, Stack=Mobile, Fill Min Value=false, Fill Max Value=true, Danger/Error=true, Focus on Min=True | `Value/M` |
| Start Date Placeholder | typography | Size=Large · Small, State=Active, Stack=Mobile, Fill Min Value=true, Fill Max Value=true, Danger/Error=true, Focus on Min=True | `Value/S` |
| Start Date Placeholder | typography | Size=Large, State=Focus, Stack=Mobile, Fill Min Value=false, Fill Max Value=false, Disabled=false, Focus on Min=True | `Value/M` |
| Start Date Placeholder | typography | Size=Medium · Small, State=Focus, Stack=Mobile, Fill Min Value=false, Fill Max Value=false, Disabled=false, Focus on Min=True | `Value/S` |
| Start Date Placeholder | typography | Size=Medium, State=Active, Stack=Mobile, Fill Min Value=true, Fill Max Value=true, Danger/Error=true, Focus on Min=True | `Value/M` |
| Start Date Placeholder | typography | Size=Small, State=Active, Stack=Mobile, Fill Min Value=false, Fill Max Value=true, Danger/Error=true, Focus on Min=True | `Value/S` |
| End Date Placeholder | typography | — | `Value/S` |
| Error Message | font-size | Danger/Error=true | `font-size/fs-150` |
| Error Message | font-family | Danger/Error=true | `font-family/font-family` |
| Error Message | line-height | Danger/Error=true | `line-height/lh-250` |
| Error Message | font-weight | Danger/Error=true | `font-weight/fw-400` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Start Date Input | effects | State=Active, Danger/Error=true, Focus on Max=False | `light/Ring/Input Danger - Active` |
| Start Date Input | effects | State=Active, Danger/Error=false, Disabled=false, Focus on Max=False | `light/Ring/Input - Active` |
| End Date Input | effects | State=Active, Danger/Error=true, Focus on Max=True | `light/Ring/Input Danger - Active` |
| End Date Input | effects | State=Active, Danger/Error=false, Disabled=false, Focus on Max=True | `light/Ring/Input - Active` |

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
