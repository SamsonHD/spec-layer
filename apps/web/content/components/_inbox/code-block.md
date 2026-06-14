---
spec_version: "0.1"
component:
  name: Code Block
  figma_key: 2df7a231e06b2ddefe6409d224c6268ccc435f79
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 19500:5186
content_hash: 9e2569bbc21b4afa899758362b4ec82b1cce9ebbdb259dc8569ceb9523616bd8
extracted_at: 2026-06-14T10:07:43.788Z
---

## Definition

_To be written._

## Anatomy

1. toolbar
2. code-wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| show line-count | boolean | true / false | true |
| enable copy | boolean | true / false | true |
| focus | boolean | true / false | false |

## Variants

- **variant**: input-default (default) · input-filled · read-only
- **Modifiers**: disabled

## States

- Default

## Tokens used

### Color

#### Select (Dropdown) for Table

| Property | Condition | Token |
|---|---|---|
| fill | variant=input-default · input-filled | `Background/Surface/Primary` |

#### Select

| Property | input-default | input-filled | read-only |
|---|---|---|---|
| fill | `Background/Surface/Primary` | `Background/Surface/Primary` | — |
| border | `Border Color/Input Field/Input Field` | `Border Color/Input Field/Input Field` | — |

**When disabled = true**

| Property | input-default | input-filled | read-only |
|---|---|---|---|
| fill | `Background/Surface/Secondary` | `Background/Surface/Secondary` | — |
| border | `Border Color/Input Field/Input Field Disabled` | `Border Color/Input Field/Input Field Disabled` | — |

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | variant=input-default · input-filled | `Text Color/Input/Input Placeholder` |

#### icon

| Property | input-default | input-filled | read-only |
|---|---|---|---|
| fill | `Text Color/Body/Secondary` | `Text Color/Body/Secondary` | `Text Color/Body/Primary` |

**When disabled = true**

| Property | input-default | input-filled | read-only |
|---|---|---|---|
| fill | `Text Color/Semantic/Disabled` | `Text Color/Semantic/Disabled` | `Text Color/Body/Primary` |

#### Rectangle 7235

| Property | Condition | Token |
|---|---|---|
| fill | variant=input-default · input-filled | `Background/Divider/Divider Secondary` |

#### line-count

| Property | Condition | Token |
|---|---|---|
| fill | disabled=false | `Text Color/Body/Secondary` |
| fill | variant=input-default · input-filled, disabled=true | `Text Color/Input/Input Disabled` |
| fill | variant=read-only, disabled=true | `Text Color/Semantic/Disabled` |

#### code-block

| Property | Condition | Token |
|---|---|---|
| fill | variant=input-default · input-filled, disabled=false | `Text Color/Body/Primary` |
| fill | variant=input-default, disabled=true | `Text Color/Body/Primary` |
| fill | variant=input-filled, disabled=true | `Text Color/Input/Input Disabled` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Secondary` |
| Button Icon | fill | `Background/Action/Action Tertiary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Placeholder | typography | variant=input-default · input-filled | `Value/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | — | `rounded-8` |
| code-block | textRangeFills | variant=read-only | `Background/Accent10 → Primary` |
| code-block | textRangeFills | variant=read-only | `Background/Accent2 → Primary` |
| code-block | textRangeFills | variant=read-only | `Background/Accent7 → Primary` |
| code-block | textRangeFills | variant=read-only | `Text Color/Body/Primary` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (12px)
- **Container**: hardcoded cornerRadius (2px)
- **Container**: hardcoded padding
- **Focus Rect**: hardcoded cornerRadius (2px)
- **toolbar**: hardcoded itemSpacing (12px)
- **actions**: hardcoded itemSpacing (12px)
- **Select**: hardcoded itemSpacing (8px)
- **Select**: hardcoded cornerRadius (4px)
- **Select**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Divider**: hardcoded itemSpacing (10px)
- **code-wrapper**: hardcoded itemSpacing (12px)
- **line-count**: no text style or typography variable
- **code-block**: no text style or typography variable
