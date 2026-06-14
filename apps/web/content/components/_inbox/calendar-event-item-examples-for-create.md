---
spec_version: "0.1"
component:
  name: Calendar Event Item Examples for Create
  figma_key: 53afac81113ca133e2289c17a772623d716a7de6
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 14762:16797
content_hash: fa48e5fa2d5a39a6384a3f020e00e815d27e34c20b2b16677add3c5e8a225971
extracted_at: 2026-06-14T10:05:04.354Z
---

## Definition

_To be written._

## Anatomy

1. Combo Box (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| 👁️ Online Meeting | boolean | true / false | true |
| Instance | instanceSwap | — | 5507:362804 |
| Show lcon | boolean | true / false | false |

## Variants

- **Example**: Guest (default) · Location · Text Area · Slot · Divider

## States

- Default

## Tokens used

### Color

#### Input

| Property | Condition | Token |
|---|---|---|
| fill | Example=Guest · Location · Text Area | `Background/Surface/Primary` |
| border | Example=Guest · Location · Text Area | `Border Color/Input Field/Input Field` |

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Example=Guest | `Text Color/Input/Input Placeholder` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Example=Location | `Text Color/Body/Secondary` |

#### Text Content

| Property | Condition | Token |
|---|---|---|
| fill | Example=Location | `Text Color/Input/Input Placeholder` |

#### Track

| Property | Condition | Token |
|---|---|---|
| fill | Example=Location | `Background/Toggle/Toggle Switch` |

#### Switch

| Property | Condition | Token |
|---|---|---|
| fill | Example=Location | `Background/Surface/Primary` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Example=Location | `Text Color/Body/Primary` |

#### text

| Property | Condition | Token |
|---|---|---|
| fill | Example=Text Area | `Text Color/Input/Input Placeholder` |

#### line

| Property | Condition | Token |
|---|---|---|
| fill | Example=Text Area | `Background/Divider/Divider` |

#### Rectangle 7235

| Property | Condition | Token |
|---|---|---|
| fill | Example=Divider | `Background/Divider/Divider` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Placeholder | typography | Example=Guest | `Value/M` |
| Text Content | typography | Example=Location | `Value/S` |
| Label | typography | Example=Location | `Label/M` |
| text | typography | Example=Text Area | `Value/S` |
| Replace Me | typography | Example=Slot | `[ARCHIVE]/*Mobile/Field Label` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Combo Box](./combo-box.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (16px)
- **Icon**: hardcoded itemSpacing (10px)
- **Icon**: hardcoded padding
- **Calendar Circle User**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Vector**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **ChipAction**: hardcoded itemSpacing (8px)
- **ChipAction**: hardcoded cornerRadius (9999px)
- **ChipAction**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
