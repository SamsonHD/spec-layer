---
spec_version: "0.1"
component:
  name: Schedule Header Cell
  figma_key: 9d44ba9ccd2ef2e29c6493c3e54fc61314e78944
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26533:337622
content_hash: 54c935f4867ba3a3c5ff5fba0cd57eccf158ea7c3bee71f98834204c49cfdcaa
extracted_at: 2026-06-14T10:04:36.294Z
---

## Definition

_To be written._

## Anatomy

1. Day
2. Row

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Holiday | boolean | true / false | false |

## Variants

- **Type**: Day · Month (default) · Week
- **Modifiers**: Current Time · Empty · Hover · Selected

## States

- Default

## Tokens used

### Color

#### Container

| Property | Day | Month | Week |
|---|---|---|---|
| fill | `Background/Surface/Secondary` | `Background/Surface/Secondary` | `Background/Surface/Primary` |
| border | `Border Color/Divider/Table Divider` | `Border Color/Divider/Table Divider` | `Border Color/Divider/Table Divider` |

**When Current Time = True**

| Property | Day | Month | Week |
|---|---|---|---|
| fill | `Background/Surface/Secondary` | `Background/Surface/Secondary` | — |
| border | `Border Color/Divider/Table Divider` | `Border Color/Divider/Table Divider` | `Border Color/Divider/Table Divider` |

**When Hover = True**

| Property | Day | Month | Week |
|---|---|---|---|
| fill | `Background/Surface/Secondary` · `Background/Action/Action Tertiary (Hover)` | `Background/Surface/Secondary` · `Background/Action/Action Tertiary (Hover)` | `Background/Action/Action Tertiary (Hover)` |
| border | `Border Color/Divider/Table Divider` | `Border Color/Divider/Table Divider` | `Border Color/Divider/Table Divider` |

**When Selected = True**

| Property | Day | Month | Week |
|---|---|---|---|
| fill | `Background/Surface/Secondary` | `Background/Surface/Secondary` | `Background/Surface/Primary` |
| border | `Text Color/Action/Default` | `Text Color/Action/Default` | `Text Color/Action/Default` |

#### Mon

| Property | Condition | Token |
|---|---|---|
| fill | Current Time=False, Empty=False, Type=Week | `Text Color/Body/Primary` |
| fill | Current Time=True | `Text Color/Action/Default` |
| fill | Empty=False, Type=Month | `Text Color/Semantic/Disabled` |

#### Apr 20

| Property | Condition | Token |
|---|---|---|
| fill | Empty=False, Type=Week | `Text Color/Body/Secondary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Type=Week | `Text Color/Body/Secondary` |
| fill | Empty=True, Type=Day | `Text Color/Body/Secondary` |
| fill | Empty=True, Type=Day · Week | `Text Color/Body/Primary` |

#### 40h

| Property | Condition | Token |
|---|---|---|
| fill | Empty=False, Type=Week | `Text Color/Body/Secondary` |

#### ·

| Property | Condition | Token |
|---|---|---|
| fill | Empty=False, Type=Week | `Text Color/Body/Secondary` |

#### $812

| Property | Condition | Token |
|---|---|---|
| fill | Empty=False, Type=Week | `Text Color/Body/Secondary` |

#### Input

| Property | Condition | Token |
|---|---|---|
| fill | Empty=True, Type=Day · Week | `Background/Surface/Primary` |
| border | Empty=True, Type=Day · Week | `Border Color/Input Field/Input Field` |

#### Text Content

| Property | Condition | Token |
|---|---|---|
| fill | Empty=True, Type=Day · Week | `Text Color/Input/Input Placeholder` |

#### Button Icon

| Property | Condition | Token |
|---|---|---|
| fill | Empty=True, Type=Day · Week | `Background/Action/Action Tertiary` |

#### 12 AM

| Property | Condition | Token |
|---|---|---|
| fill | Empty=False, Type=Day | `Text Color/Body/Secondary` |

#### Rectangle 4

| Property | Condition | Token |
|---|---|---|
| fill | Current Time=True | `Background/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Mon | font-size | Empty=False, Type=Week | `font-size/fs-200` |
| Mon | font-family | Empty=False, Type=Week | `font-family/font-family` |
| Mon | line-height | Empty=False, Type=Week | `line-height/lh-300` |
| Mon | font-weight | Empty=False, Type=Week | `font-weight/fw-600` |
| Mon | typography | Empty=False, Type=Month | `Subtitle/S` |
| Apr 20 | line-height | Empty=False, Type=Week | `line-height/lh-150` |
| Apr 20 | font-family | Empty=False, Type=Week | `font-family/font-family` |
| Apr 20 | font-size | Empty=False, Type=Week | `font-size/fs-100` |
| 40h | typography | Empty=False, Type=Week | `Caption/XS - Strong` |
| · | typography | Empty=False, Type=Week | `Caption/S` |
| $812 | typography | Empty=False, Type=Week | `Caption/XS - Strong` |
| Text Content | typography | Empty=True, Type=Day · Week | `Value/S` |
| 12 AM | typography | Empty=False, Type=Day | `Caption/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Temperature | border-radius | Empty=False, Type=Week | `rounded-8` |
| Icon BG | border-radius | Empty=False, Type=Week | `rounded-8` |
| Button Icon | border-radius | Empty=True, Type=Day · Week | `rounded-8` |

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
- **Container**: hardcoded padding
- **Row**: hardcoded itemSpacing (128px)
- **Container**: hardcoded itemSpacing (6px)
- **Day**: hardcoded itemSpacing (8px)
- **Left side**: hardcoded itemSpacing (8px)
- **Right side**: hardcoded itemSpacing (8px)
- **Temperature**: hardcoded itemSpacing (4px)
- **Icon BG**: hardcoded itemSpacing (8px)
- **Icon BG**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Row**: hardcoded itemSpacing (2px)
- **Totals**: hardcoded itemSpacing (4px)
- **Contents**: hardcoded itemSpacing (4px)
- **Chip**: hardcoded itemSpacing (8px)
- **Chip**: hardcoded padding
