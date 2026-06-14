---
spec_version: "0.1"
component:
  name: Date Range Picker
  figma_key: c1a9bf70b5c17ee4179d4e86e3b50a55c9ba9baf
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26206:23221
content_hash: c45e1218ed12c55d5b4bf3c286d7b7c92deca8f703cd4514cd69f55b95e1b447
extracted_at: 2026-06-14T10:03:56.767Z
---

## Definition

_To be written._

## Anatomy

1. Start Date Input
2. Divider
3. End Date Input

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Hint | text | — | Help text goes here. |
| Show Label | boolean | true / false | false |
| Optional | boolean | true / false | false |
| Label | text | — | Label |
| Show Hint | boolean | true / false | false |
| Required | boolean | true / false | false |
| End Date Value | text | — | 03/24/2026 |
| Start Date Value | text | — | 02/24/2026 |
| Error | text | — | Error message here. |
| Show Icon | boolean | true / false | true |
| Start Date | text | — | Start Date |
| End Date | text | — | End date |

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

| Property | Condition | Token |
|---|---|---|
| fill | — | `Text Color/Body/Secondary` |
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
| Start Date Placeholder | typography | Size=Large · Medium | `Value/M` |
| Start Date Placeholder | typography | Size=Small | `Value/S` |
| End Date Placeholder | typography | Size=Large · Medium, Stack=Vertical, Disabled=false, Focus on Min=False | `Value/M` |
| End Date Placeholder | typography | Size=Large · Medium, Disabled=false, Focus on Min=True | `Value/M` |
| End Date Placeholder | typography | Size=Large · Medium, Disabled=true, Focus on Min=False | `Value/M` |
| End Date Placeholder | typography | Size=Large · Medium, Disabled=true, Focus on Min=True | `Value/M` |
| End Date Placeholder | typography | Size=Small, Disabled=false, Focus on Min=True | `Value/S` |
| End Date Placeholder | typography | Size=Small, Disabled=true, Focus on Min=False | `Value/S` |
| End Date Placeholder | typography | Size=Small, Disabled=true, Focus on Min=True | `Value/S` |
| End Date Placeholder | typography | Size=Small, Stack=Vertical, Disabled=false, Focus on Min=False | `Value/S` |
| End Date Placeholder | typography | State=Active, Stack=Mobile, Disabled=false, Focus on Min=False | `Value/M` |
| End Date Placeholder | typography | Size=Large · Medium, State=Default · Hover · Focus, Stack=Mobile, Disabled=false, Focus on Min=False | `Value/M` |
| End Date Placeholder | typography | Size=Small, State=Default · Hover · Focus, Stack=Mobile, Disabled=false, Focus on Min=False | `Value/S` |
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
