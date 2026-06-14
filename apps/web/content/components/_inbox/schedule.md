---
spec_version: "0.1"
component:
  name: Schedule
  figma_key: 61a3e52e75394a57e846491eaf361b16e7e64c21
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26533:339853
content_hash: 6021008f371b0a36e1cfc95fbd78c7f153c06bb078b43acf714c1ab25e7bb3f9
extracted_at: 2026-06-14T10:04:36.311Z
---

## Definition

_To be written._

## Anatomy

1. Schedule Row (component)
2. Schedule Grid Cell (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Shift Container | undefined | — | — |

## Variants

- **View**: Week (default) · Day · Month

## States

- Default

## Tokens used

### Color

#### Schedule Row

| Property | Condition | Token |
|---|---|---|
| fill | View=Week · Day | `Background/Surface/Primary` |
| border | View=Week · Day | `Border Color/Divider/Table Divider` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | View=Week · Day | `Text Color/Body/White` |

#### Open Shifts

| Property | Condition | Token |
|---|---|---|
| fill | View=Week · Day | `Text Color/Body/Primary` |

#### 3 open

| Property | Condition | Token |
|---|---|---|
| fill | View=Week · Day | `Text Color/Body/Secondary` |

#### Button

| Property | Condition | Token |
|---|---|---|
| fill | View=Week | `Background/Action/Action Secondary` |
| border | View=Week | `Border Color/Action/Secondary Button (Default)` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | View=Week | `Text Color/Action/On Secondary` |

#### Schedule Grid Cell

| Property | Condition | Token |
|---|---|---|
| fill | — | `Background/Surface/Primary` |
| fill | View=Month | `Background/Surface/Tertiary` |
| border | — | `Border Color/Divider/Table Divider` |

#### Location

| Property | Condition | Token |
|---|---|---|
| fill | View=Week | `Text Color/Body/White` |

#### 15

| Property | Condition | Token |
|---|---|---|
| fill | View=Month | `Text Color/Body/Secondary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Shift name | fill | `Text Color/Body/White` |
| Time | fill | `Text Color/Body/White` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Open Shifts | typography | View=Week · Day | `Caption/S - Strong` |
| 3 open | typography | View=Week · Day | `Caption/S` |
| Label | typography | View=Week | `Action/XS` |
| Shift name | typography | — | `Caption/S - Extra Strong` |
| Time | typography | — | `Caption/XS - Strong` |
| Location | typography | View=Week | `Caption/XS` |
| 15 | typography | View=Month | `Caption/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | View=Week | `rounded-8` |
| Button | padding-x | View=Week | `size-12` |
| Button | padding-y | View=Week | `size-4` |
| Shift Tile / Employee | border-radius | — | `rounded-4` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Schedule Row](./schedule-row.md)
- [Schedule Grid Cell](./schedule-grid-cell.md)

## Extraction gaps

- **Schedule Row**: hardcoded itemSpacing (12px)
- **Schedule Row**: hardcoded padding
- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded padding
- **Open Shift**: hardcoded color (no variable or style)
- **Open Shift**: hardcoded cornerRadius (9999px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Text Container**: hardcoded itemSpacing (2px)
- **Button**: hardcoded itemSpacing (4px)
- **Schedule Grid Cell**: hardcoded itemSpacing (4px)
- **Schedule Grid Cell**: hardcoded padding
- **Text**: hardcoded itemSpacing (4px)
- **Text**: hardcoded cornerRadius (11px)
- **Chip**: hardcoded itemSpacing (8px)
- **Chip**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **Frame 1**: hardcoded itemSpacing (8px)
- **Frame 1**: hardcoded padding
- **Shift Container**: hardcoded itemSpacing (8px)
- **Shift Tile / Employee**: hardcoded color (no variable or style)
- **Content**: hardcoded itemSpacing (2px)
- **Content**: hardcoded padding
- **Row**: hardcoded itemSpacing (8px)
- **Title**: hardcoded itemSpacing (8px)
- **Overnight badge**: hardcoded itemSpacing (8px)
- **ChipShift**: hardcoded color (no variable or style)
- **ChipShift**: hardcoded itemSpacing (8px)
- **ChipShift**: hardcoded padding
- **Location container**: hardcoded itemSpacing (4px)
- **Alert**: hardcoded itemSpacing (8px)
- **Text**: hardcoded padding
- **Schedule Grid Cell**: hardcoded color (no variable or style)
