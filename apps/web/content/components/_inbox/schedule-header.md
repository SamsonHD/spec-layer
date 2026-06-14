---
spec_version: "0.1"
component:
  name: Schedule Header
  figma_key: 746ada7539be49c030b75c9d582bd50808dc40ac
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26533:338068
content_hash: dda08050a82d1403c644839f75e5c0393187afa350756b436f6982577290c306
extracted_at: 2026-06-14T10:04:36.300Z
---

## Definition

_To be written._

## Anatomy

1. Schedule Header Cell (component)

## Configuration

_None._

## Variants

- **View**: Week (default) · Day · Month
- **Totals**: False (default)

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| fill | View=Week | `Background/Surface/Primary` |
| fill | View=Day · Month | `Background/Surface/Secondary` |
| border | View=Day · Month | `Border Color/Divider/Divider Secondary` |

#### Schedule Header Cell

| Property | Condition | Token |
|---|---|---|
| fill | View=Week | `Background/Surface/Primary` |
| fill | View=Day · Month | `Background/Surface/Secondary` |
| border | — | `Border Color/Divider/Table Divider` |

#### Input

| Property | Condition | Token |
|---|---|---|
| fill | View=Week · Day | `Background/Surface/Primary` |
| border | View=Week · Day | `Border Color/Input Field/Input Field` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | View=Week · Day | `Text Color/Body/Primary` |
| fill | View=Week · Day | `Text Color/Body/Secondary` |

#### Text Content

| Property | Condition | Token |
|---|---|---|
| fill | View=Week · Day | `Text Color/Input/Input Placeholder` |

#### Button Icon

| Property | Condition | Token |
|---|---|---|
| fill | View=Week · Day | `Background/Action/Action Tertiary` |

#### Mon

| Property | Condition | Token |
|---|---|---|
| fill | View=Week | `Text Color/Body/Primary` |
| fill | View=Month | `Text Color/Semantic/Disabled` |

#### Apr 20

| Property | Condition | Token |
|---|---|---|
| fill | View=Week | `Text Color/Body/Secondary` |

#### 40h

| Property | Condition | Token |
|---|---|---|
| fill | View=Week | `Text Color/Body/Secondary` |

#### ·

| Property | Condition | Token |
|---|---|---|
| fill | View=Week | `Text Color/Body/Secondary` |

#### $812

| Property | Condition | Token |
|---|---|---|
| fill | View=Week | `Text Color/Body/Secondary` |

#### 12 AM

| Property | Condition | Token |
|---|---|---|
| fill | View=Day | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Text Content | typography | View=Week · Day | `Value/S` |
| Mon | font-size | View=Week | `font-size/fs-200` |
| Mon | font-family | View=Week | `font-family/font-family` |
| Mon | line-height | View=Week | `line-height/lh-300` |
| Mon | font-weight | View=Week | `font-weight/fw-600` |
| Mon | typography | View=Month | `Caption/S - Strong` |
| Apr 20 | line-height | View=Week | `line-height/lh-150` |
| Apr 20 | font-family | View=Week | `font-family/font-family` |
| Apr 20 | font-size | View=Week | `font-size/fs-100` |
| 40h | typography | View=Week | `Caption/XS - Strong` |
| · | typography | View=Week | `Caption/S` |
| $812 | typography | View=Week | `Caption/XS - Strong` |
| 12 AM | typography | View=Day | `Caption/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | View=Week · Day | `rounded-8` |
| Temperature | border-radius | View=Week | `rounded-8` |
| Icon BG | border-radius | View=Week | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Schedule Header Cell](./schedule-header-cell.md)

## Extraction gaps

- **Schedule Header Cell**: hardcoded itemSpacing (4px)
- **Schedule Header Cell**: hardcoded padding
- **Input Field**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Schedule Header Cell**: hardcoded itemSpacing (8px)
- **Row**: hardcoded itemSpacing (128px)
- **Container**: hardcoded itemSpacing (6px)
- **Day**: hardcoded itemSpacing (8px)
- **Left side**: hardcoded itemSpacing (8px)
- **Right side**: hardcoded itemSpacing (8px)
- **Temperature**: hardcoded itemSpacing (4px)
- **Icon BG**: hardcoded itemSpacing (8px)
- **Icon BG**: hardcoded padding
- **Row**: hardcoded itemSpacing (2px)
- **Totals**: hardcoded itemSpacing (4px)
- **Contents**: hardcoded itemSpacing (4px)
- **Chip**: hardcoded itemSpacing (8px)
- **Chip**: hardcoded padding
