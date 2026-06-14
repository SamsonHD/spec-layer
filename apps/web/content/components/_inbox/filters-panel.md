---
spec_version: "0.1"
component:
  name: Filters Panel
  figma_key: 9f85491921c8328e5ab4cc03e1db1829d50eb187
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25964:20192
content_hash: 1d78f249b914ec4432d310798638871cb09d8661bdbb513a3e58e621809b3701
extracted_at: 2026-06-14T10:03:12.524Z
---

## Definition

_To be written._

## Anatomy

1. WrapperInput
2. WrapperAffordances

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Overflow Menu | boolean | true / false | true |
| Expand | boolean | true / false | true |
| Column Control | boolean | true / false | true |
| Actions | boolean | true / false | false |
| Filters | boolean | true / false | true |
| Add/remove filters | undefined | — | — |
| Reset filter | boolean | true / false | false |

## Variants

- **Search**: Default (default) · Active · Expanded
- **Type**: Table Based (default) · List Based

## States

- Default
- Selected

## Tokens used

### Color

#### Button Icon

| Property | Condition | Token |
|---|---|---|
| fill | Type=Table Based | `Background/Surface/Primary` |
| border | Type=Table Based | `Border Color/Action/Secondary Button (Default)` |

#### icon

| Property | State | Table Based | List Based |
|---|---|---|---|
| fill | Default | `Text Color/Body/Secondary` | `Text Color/Body/Secondary` |
| fill | Selected | `Text Color/Body/Primary` | `Text Color/Body/White` |

#### Field Wrapper

| Property | Condition | Token |
|---|---|---|
| fill | State=Default, Type=Table Based | `Background/Surface/Primary` |
| border | State=Default, Type=Table Based | `Border Color/Input Field/Input Field` |

#### Button

| Property | State | Default | Active | Expanded |
|---|---|---|---|---|
| fill | Default | `Background/Action/Action Secondary` | `Background/Action/Action Secondary` | `Background/Action/Action Secondary` |
| fill | Selected | `Background/Action/Action` · `Background/Action/Action Secondary` | — | — |
| border | Default | `Border Color/Action/Secondary Button (Default)` | `Border Color/Action/Secondary Button (Default)` | `Border Color/Action/Secondary Button (Default)` |
| border | Selected | `Border Color/Semantic/Danger` | — | — |

#### Label

| Property | State | Table Based | List Based |
|---|---|---|---|
| fill | Default | `Text Color/Action/On Secondary` | `Text Color/Body/Primary` |
| fill | Selected | `Text Color/Action/Default` | `Text Color/Action/On Action` · `Text Color/Semantic/Danger Link` |

#### Input

| Property | Condition | Token |
|---|---|---|
| fill | State=Default | `Background/Surface/Primary` |
| border | Search=Default · Expanded, State=Default | `Border Color/Input Field/Input Field` |
| border | Search=Active, State=Default | `Border Color/Input Field/Input Field (Focus)` |

#### Text Content

| Property | Condition | Token |
|---|---|---|
| fill | Search=Default · Expanded, State=Default | `Text Color/Input/Input Placeholder` |

#### Cursor

| Property | Condition | Token |
|---|---|---|
| fill | Search=Active, State=Default | `Text Color/Body/Black` |

#### Data

| Property | Condition | Token |
|---|---|---|
| fill | State=Selected, Type=Table Based | `Text Color/Body/Primary` |

#### Check Wrapper

| Property | State | Table Based | List Based |
|---|---|---|---|
| fill | Default | — | `Background/Surface/Primary` |
| fill | Selected | — | `Background/Action/Action` |
| border | Default | — | `Border Color/Input Field/Input Field` |
| border | Selected | — | `Border Color/Action/Action` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Type=List Based | `Text Color/Body/Inverted → Primary` |

#### Select

| Property | Condition | Token |
|---|---|---|
| fill | Type=List Based | `Background/Surface/Primary` |
| border | Type=List Based | `Border Color/Input Field/Input Field` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| Placeholder | fill | `Text Color/Input/Input Placeholder` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Placeholder | typography | Type=Table Based | `New/Field/Value Small` |
| Placeholder | typography | Type=List Based | `Value/S` |
| Label | typography | Type=Table Based | `Action/S` |
| Label | typography | Type=List Based | `Value/S` |
| Label | typography | State=Selected, Type=List Based | `Action/S` |
| Text Content | typography | Search=Default · Expanded, State=Default | `Value/S` |
| Data | typography | State=Selected, Type=Table Based | `Action/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | Type=Table Based | `rounded-8` |
| Button | border-radius | — | `rounded-8` |
| Button | padding-x | — | `size-16` |
| Input | effects | Search=Active, State=Default | `light/Ring/Input - Active` |

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
- **Container**: hardcoded padding
- **Filter + Affordances**: hardcoded itemSpacing (197px)
- **WrapperInput**: hardcoded itemSpacing (12px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Add/remove filters**: hardcoded itemSpacing (12px)
- **Filter Input**: hardcoded color (no variable or style)
- **Field Wrapper**: hardcoded itemSpacing (8px)
- **Field Wrapper**: hardcoded cornerRadius (8px)
- **Field Wrapper**: hardcoded padding
- **Select**: hardcoded itemSpacing (8px)
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
- **Button**: hardcoded itemSpacing (8px)
- **WrapperAffordances**: hardcoded itemSpacing (12px)
- **Actions**: hardcoded itemSpacing (8px)
- **PrimaryButton**: hardcoded itemSpacing (8px)
- **SecondaryButton**: hardcoded itemSpacing (8px)
- **FilterApplied**: hardcoded itemSpacing (8px)
- **WrapperChips**: hardcoded itemSpacing (8px)
- **ChipAction**: hardcoded itemSpacing (8px)
- **ChipAction**: hardcoded cornerRadius (9999px)
- **ChipAction**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
