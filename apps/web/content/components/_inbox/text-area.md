---
spec_version: "0.1"
component:
  name: Text Area
  figma_key: d28f516d5ab89a88d81bf489cac6c62c40370bd3
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 5874:399173
content_hash: 3bb9167b9944c1a6e3da99d21ab6d7b02010083da0cc9017aa4ac6382bac5ad9
extracted_at: 2026-06-14T10:04:11.635Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Field Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Optional | boolean | true / false | false |
| Required | boolean | true / false | false |
| Show Label | boolean | true / false | true |
| Show Counter | boolean | true / false | true |
| Placeholder | text | — | Placeholder |
| Show Hint | boolean | true / false | false |
| Max Character | text | — | 200 |
| Inputed Characters | text | — | 0 |
| Error | text | — | Error message here. |
| Label | text | — | Label |
| Hint | text | — | Help text goes here. |

## Variants

- **Stack**: Vertical (default) · Horizontal
- **Size**: Medium (default) · Small
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

#### Input

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

#### text

| Property | Condition | Token |
|---|---|---|
| fill | Empty=true | `Text Color/Input/Input Placeholder` |
| fill | Empty=false, Disabled=false | `Text Color/Body/Primary` |
| fill | Empty=false, Disabled=true | `Text Color/Input/Input Disabled` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Danger/Error=true, Disabled=false | `Text Color/Semantic/Error` |

#### Caret

| Property | Condition | Token |
|---|---|---|
| fill | State=Focus, Disabled=false | `Background/Action/Action` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Danger/Error=false, Disabled=false | `Border Color/Action/Action` |
| border | State=Focus, Danger/Error=true, Disabled=false | `Border Color/Semantic/Danger` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| character counter | fill | `Background/Surface/Tertiary` |
| Actual Input # of Words | fill | `Text Color/Body/Secondary` |
| / | fill | `Text Color/Body/Secondary` |
| Max Input # of Words | fill | `Text Color/Body/Secondary` |
| line | fill | `Background/Divider/Divider` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/S` |
| text | typography | — | `Value/S` |
| Actual Input # of Words | typography | — | `[ARCHIVE]/Footnote2/Short` |
| / | typography | — | `[ARCHIVE]/Footnote2/Short` |
| Max Input # of Words | typography | — | `[ARCHIVE]/Footnote2/Short` |
| Error Message | font-size | Danger/Error=true, Disabled=false | `font-size/fs-150` |
| Error Message | font-family | Danger/Error=true, Disabled=false | `font-family/font-family` |
| Error Message | line-height | Danger/Error=true, Disabled=false | `line-height/lh-250` |
| Error Message | font-weight | Danger/Error=true, Disabled=false | `font-weight/fw-400` |

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
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **Character Counter**: hardcoded padding
- **character counter**: hardcoded cornerRadius (4px)
- **character counter**: hardcoded padding
- **container**: hardcoded color (no variable or style)
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
