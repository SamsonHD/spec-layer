---
spec_version: "0.1"
component:
  name: wizardHeader
  figma_key: 9b6d3d6d1a3a27f0262a16ef22139ec6e709b632
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25701:11095
content_hash: 5d0bf366ad9553160482763adb09aad1d7c89cce428d9e5e9835b0d652a0a34f
extracted_at: 2026-06-14T10:04:36.086Z
---

## Definition

_To be written._

## Anatomy

1. success-bar
2. content

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| ProgressMenu | boolean | true / false | true |
| Back | boolean | true / false | false |
| Person name | boolean | true / false | true |
| Person Name | text | — | Person Name |

## Variants

- **Modifiers**: Multiple steps

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| border | Multiple steps=True | `Border Color/Divider/Divider Secondary` |

#### bar

| Property | Condition | Token |
|---|---|---|
| fill | Multiple steps=True | `Background/Action/Action` |

#### 80px (fixed)

| Property | Condition | Token |
|---|---|---|
| fill | Multiple steps=True | `Background/Surface/Primary` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Multiple steps=True | `Text Color/Action/Link` |
| fill | Multiple steps=True | `Text Color/Body/Primary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | — | `Text Color/Body/Primary` |
| fill | Multiple steps=True | `Text Color/Action/Link` |
| fill | Multiple steps=True | `Text Color/Site Footer/Site Footer Link` |

#### Dropdown Menu Wizard

| Property | Condition | Token |
|---|---|---|
| fill | Multiple steps=True | `Background/Surface/Primary` |
| border | Multiple steps=True | `Border Color/Divider/Divider Secondary` |

#### iconWrapper

| Property | Condition | Token |
|---|---|---|
| fill | Multiple steps=True | `Background/Surface/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| wizardContent | fill | `Background/Surface/Primary` |
| wizardContent | border | `Border Color/Divider/Divider Secondary` |
| Title | fill | `Text Color/Body/Primary` |
| Title | fill | `Text Color/Body/Secondary` |
| divider | border | `Border Color/Divider/Divider` |
| Button Icon | fill | `Background/Action/Action Tertiary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | — | `Subtitle/L - Strong` |
| Title | typography | — | `Subtitle/M` |
| Label | typography | Multiple steps=True | `Action/S` |
| Label | typography | Multiple steps=True | `Value/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | Multiple steps=True | `rounded-8` |
| Button | padding-x | Multiple steps=True | `size-16` |
| Dropdown Menu Wizard | effects | Multiple steps=True | `Shadows/Dropdown Menu` |
| Dropdown Menu Wizard | effects | Multiple steps=True | `Shadows/Dropdown Menu/0/color` |
| Dropdown Menu Wizard | effects | Multiple steps=True | `Shadows/Dropdown Menu/0/offsetX` |
| Dropdown Menu Wizard | effects | Multiple steps=True | `Shadows/Dropdown Menu/0/offsetY` |
| Dropdown Menu Wizard | effects | Multiple steps=True | `Shadows/Dropdown Menu/0/radius` |
| Dropdown Menu Wizard | effects | Multiple steps=True | `Shadows/Dropdown Menu/0/spread` |
| Dropdown Menu Wizard | effects | Multiple steps=True | `Shadows/Dropdown Menu/1/color` |
| Dropdown Menu Wizard | effects | Multiple steps=True | `Shadows/Dropdown Menu/1/offsetX` |
| Dropdown Menu Wizard | effects | Multiple steps=True | `Shadows/Dropdown Menu/1/offsetY` |
| Dropdown Menu Wizard | effects | Multiple steps=True | `Shadows/Dropdown Menu/1/radius` |
| Dropdown Menu Wizard | effects | Multiple steps=True | `Shadows/Dropdown Menu/1/spread` |
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

- **wizardContent**: hardcoded itemSpacing (850px)
- **wizardContent**: hardcoded padding
- **success-bar**: hardcoded itemSpacing (10px)
- **success-bar**: hardcoded padding
- **bar**: hardcoded itemSpacing (10px)
- **80px (fixed)**: hardcoded itemSpacing (10px)
- **title + stepper**: hardcoded itemSpacing (16px)
- **title + stepper**: hardcoded padding
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **secondary-info**: hardcoded itemSpacing (12px)
- **progressIndicator**: hardcoded itemSpacing (10px)
- **Button**: hardcoded itemSpacing (8px)
- **Dropdown Menu Wizard**: hardcoded cornerRadius (8px)
- **Dropdown Menu Wizard**: hardcoded padding
- **Dropdown Menu Wizard**: hardcoded color (no variable or style)
- **optionWrapper**: hardcoded itemSpacing (8px)
- **optionWrapper**: hardcoded cornerRadius (4px)
- **optionWrapper**: hardcoded padding
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
- **scroll bar**: hardcoded cornerRadius (9999px)
