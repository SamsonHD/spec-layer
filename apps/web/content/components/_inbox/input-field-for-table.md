---
spec_version: "0.1"
component:
  name: Input Field for Table
  figma_key: 94232cb5373c5d041c31ee52ef2ff72b302206b9
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 5528:363069
content_hash: e9ba0b3624111b597c1cb328ed9aa71de3a7b7e3bb103c8eac3d765651c799e7
extracted_at: 2026-06-14T10:03:56.348Z
---

## Definition

_To be written._

## Anatomy

1. Placeholder

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Close Btn | boolean | true / false | false |
| Shows Icon | boolean | true / false | false |
| Placeholder | text | — | Placeholder |
| Text | text | — | Hello |

## Variants

- **Modifiers**: Danger/Error · Empty · Disabled

## States

- Default
- Hover
- Focus

## Tokens used

### Color

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

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Empty=true | `Text Color/Input/Input Placeholder` |

#### Text Content

| Property | Condition | Token |
|---|---|---|
| fill | Empty=false, Disabled=false | `Text Color/Body/Primary` |
| fill | Empty=false, Disabled=true | `Text Color/Input/Input Disabled` |

#### Caret

| Property | Condition | Token |
|---|---|---|
| fill | State=Focus, Disabled=false | `Background/Action/Action` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Danger/Error=false, Disabled=false | `Border Color/Action/Action` |
| border | State=Focus, Danger/Error=true, Disabled=false | `Border Color/Semantic/Danger` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Placeholder | typography | Empty=true | `Value/S` |
| Text Content | typography | Empty=false | `Value/S` |

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
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (4px)
- **Input**: hardcoded padding
- **Xmark Large**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
