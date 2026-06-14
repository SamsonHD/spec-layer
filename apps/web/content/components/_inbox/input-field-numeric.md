---
spec_version: "0.1"
component:
  name: Input Field - Numeric
  figma_key: 00932107e54d85bf13f4f2a4d482ea4c467013b4
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 17685:12383
content_hash: 2a025fe252bcd56a56af2cd5b98a997254b67b99f61506cdd252f84466a38302
extracted_at: 2026-06-14T10:03:56.362Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Field Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Shows Hint | boolean | true / false | true |
| Shows Label | boolean | true / false | true |
| Optional | boolean | true / false | false |
| Shows Icon | boolean | true / false | false |
| Label | text | — | Label |
| Clear Btn | boolean | true / false | false |
| Required | boolean | true / false | false |
| Hint | text | — | Help text goes here. |
| Error | text | — | Error message here. |
| Show Prefix | boolean | true / false | false |
| Show Suffix | boolean | true / false | false |
| Prefix | text | — | $ |
| Suffix | text | — | lbs |
| Text content | boolean | true / false | true |
| Text Content | text | — | 0 |

## Variants

- **Size**: Large (default) · Medium · Small
- **Modifiers**: Disabled · Danger/Error · Empty

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

#### Placeholder

| Property | State | Large | Medium | Small |
|---|---|---|---|---|
| fill | Default | `Text Color/Input/Input Placeholder` | `Text Color/Input/Input Placeholder` | `Text Color/Input/Input Placeholder` |
| fill | Hover | `Text Color/Input/Input Placeholder` | `Text Color/Input/Input Placeholder` | `Text Color/Input/Input Placeholder` |
| fill | Focus | `Text Color/Input/Input Placeholder` | `Text Color/Input/Input Placeholder` | `Text Color/Input/Input Placeholder` |
| fill | Active | `Text Color/Body/Secondary` | `Text Color/Body/Secondary` | `Text Color/Body/Primary` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Text Color/Input/Input Disabled` |

**When Empty = False**

| Property | Token |
|---|---|
| fill | `Text Color/Body/Primary` |

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

#### Fixed

| Part | Property | Token |
|---|---|---|
| Hint | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/S` |
| Placeholder | typography | — | `Value/S` |
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
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Content Wrapper**: hardcoded itemSpacing (2px)
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
