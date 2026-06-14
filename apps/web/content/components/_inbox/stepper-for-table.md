---
spec_version: "0.1"
component:
  name: Stepper for Table
  figma_key: 65ecbfa5e2daac56738a9640b03fd8c5543de7aa
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 8700:358680
content_hash: 26b83aa35a159a3d55d58529813bdbb2ac67b7edeb19fe0d491be0821907169f
extracted_at: 2026-06-14T10:04:11.613Z
---

## Definition

_To be written._

## Anatomy

1. Button Icon (component)
2. Input

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Filled | boolean | true / false | true |
| Qty | text | — | 1 |

## Variants

- **Button Style**: Primary (default) · Secondary
- **Modifiers**: Danger · Disabled · Show InputField

## States

- Default
- Hover
- Focus

## Tokens used

### Color

#### Button Icon

| Property | Primary | Secondary |
|---|---|---|
| fill | `Background/Action/Action` | — |
| border | — | `Border Color/Action/Secondary Button (Default)` |

**When Disabled = True**

| Property | Primary | Secondary |
|---|---|---|
| fill | `Background/Surface/Disabled` | `Background/Action/Action Tertiary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Button Style=Primary | `Text Color/Body/White` |
| fill | Button Style=Secondary, Disabled=False | `Text Color/Body/Primary` |
| fill | Button Style=Secondary, Disabled=True | `Text Color/Semantic/Disabled` |

#### Input

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field (Focus)` |

**When Danger = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field Danger` |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field Danger (Focus)` |

**When Disabled = True**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

**When Show InputField = false**

| Property | State | Token |
|---|---|---|
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field (Focus)` |

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=False | `Text Color/Body/Primary` |
| fill | Disabled=True | `Text Color/Input/Input Disabled` |

#### Caret

| Property | Condition | Token |
|---|---|---|
| fill | State=Focus, Disabled=False | `Background/Action/Action` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Danger=true | `Border Color/Semantic/Danger` |
| border | State=Focus, Danger=false, Disabled=False | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Placeholder | typography | — | `Label/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Button Icon](./button-icon.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **input stepper**: hardcoded itemSpacing (4px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (4px)
- **Input**: hardcoded padding
