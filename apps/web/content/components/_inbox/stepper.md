---
spec_version: "0.1"
component:
  name: Stepper
  figma_key: 3d28f07a0de99f0a49a3e1ccb48c068c918e6a60
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7911:323188
content_hash: a77d3e9536e759eff5b2448d123d6b34467f5458c8351233f2f5ca7186abe6b7
extracted_at: 2026-06-14T10:04:11.606Z
---

## Definition

_To be written._

## Anatomy

1. Label
2. input stepper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Label | boolean | true / false | true |
| Label Txt | text | — | Quantity |
| Filled | boolean | true / false | true |
| Qty | text | — | 1 |

## Variants

- **Stack**: Vertical (default) · Horizontal
- **Button Style**: Primary (default) · Secondary
- **Modifiers**: Danger · Disabled · Show InputField

## States

- Default
- Hover
- Activated/Focus

## Tokens used

### Color

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=False | `Text Color/Body/Primary` |
| fill | Disabled=True | `Text Color/Body/Secondary` |

#### Button Icon

| Property | Primary | Secondary |
|---|---|---|
| fill | `Background/Action/Action` | — |
| border | — | `Border Color/Action/Secondary Button (Default)` |

**When Disabled = True**

| Property | Primary | Secondary |
|---|---|---|
| fill | `Background/Surface/Disabled` | `Background/Action/Action Secondary` |
| border | — | `Border Color/Action/Secondary Button (Disabled)` |

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
| fill | Activated/Focus | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Activated/Focus | `Border Color/Input Field/Input Field (Focus)` |

**When Danger = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Activated/Focus | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field Danger` |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Activated/Focus | `Border Color/Input Field/Input Field Danger (Focus)` |

**When Disabled = True**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

**When Show InputField = false**

| Property | State | Token |
|---|---|---|
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Activated/Focus | `Border Color/Input Field/Input Field (Focus)` |

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=False | `Text Color/Body/Primary` |
| fill | Disabled=True | `Text Color/Input/Input Disabled` |

#### Caret

| Property | Condition | Token |
|---|---|---|
| fill | State=Activated/Focus, Disabled=False | `Background/Action/Action` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Activated/Focus, Danger=true | `Border Color/Semantic/Danger` |
| border | State=Activated/Focus, Danger=false, Disabled=False | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/M` |
| Placeholder | typography | — | `Value/M` |

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

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **input stepper**: hardcoded itemSpacing (8px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
