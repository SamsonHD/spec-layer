---
spec_version: "0.1"
component:
  name: Select (Dropdown)
  figma_key: 5aee1f0e1a3b227b1d6658eb977cb196f9ef63af
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 5860:399075
content_hash: 9edac95b0845a27c2983970b1079376e3e12c17458d131515179f3e21b10f42c
extracted_at: 2026-06-14T10:03:56.859Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Field Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Shows Icon | boolean | true / false | false |
| Shows Hint | boolean | true / false | false |
| Optional | boolean | true / false | false |
| Shows Label | boolean | true / false | true |
| Required | boolean | true / false | false |
| Label | text | — | Label |
| Text Content | text | — | Text |
| Hint | text | — | Help text goes here. |
| Error | text | — | Error message here. |
| Shows info icon | boolean | true / false | false |

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
| fill | Disabled=False | `Text Color/Body/Primary` |
| fill | Disabled=True | `Text Color/Body/Secondary` |

#### Select

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

**When Disabled = True**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

**When Danger/Error = True**

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

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Input/Input Placeholder` |
| fill | Hover | `Text Color/Input/Input Placeholder` |
| fill | Focus | `Text Color/Input/Input Placeholder` |
| fill | Active | `Text Color/Body/Secondary` |

**When Empty = False**

| Property | Token |
|---|---|
| fill | `Text Color/Body/Primary` |

**When Disabled = True**

| Property | Token |
|---|---|
| fill | `Text Color/Input/Input Placeholder` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Empty=False, Disabled=True | `Text Color/Body/Secondary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=False | `Text Color/Body/Secondary` |
| fill | Disabled=True | `Text Color/Semantic/Disabled` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Danger/Error=True | `Text Color/Semantic/Error` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Danger/Error=True | `Border Color/Semantic/Danger` |
| border | State=Focus, Disabled=False, Danger/Error=False | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/S` |
| Placeholder | typography | — | `Value/S` |
| Error Message | font-size | Danger/Error=True | `font-size/fs-150` |
| Error Message | font-family | Danger/Error=True | `font-family/font-family` |
| Error Message | line-height | Danger/Error=True | `line-height/lh-250` |
| Error Message | font-weight | Danger/Error=True | `font-weight/fw-400` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Select | effects | State=Active, Danger/Error=True | `light/Ring/Input Danger - Active` |
| Select | effects | State=Active, Disabled=False, Danger/Error=False | `light/Ring/Input - Active` |

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
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Select**: hardcoded itemSpacing (8px)
- **Select**: hardcoded cornerRadius (8px)
- **Select**: hardcoded padding
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
