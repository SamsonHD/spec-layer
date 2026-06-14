---
spec_version: "0.1"
component:
  name: Schedule / Y Axis
  figma_key: 6c6724734f3c682ac678601277e0d79caf50964e
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26533:338498
content_hash: c14bebe8e75653d5e01c2f0c5b603a6a94a3568d89ec244075d60063cb66d277
extracted_at: 2026-06-14T10:04:36.305Z
---

## Definition

_To be written._

## Anatomy

1. Schedule Header Cell (component)
2. Schedule Totals Cell (component)
3. Schedule Row (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Shift Container | undefined | — | — |

## Variants

- **View**: Shift (default) · Job
- **Month**: False (default)
- **Modifiers**: Day · Week

## States

- Default

## Tokens used

### Color

#### Schedule Header Cell

| Property | Condition | Token |
|---|---|---|
| fill | Day=False | `Background/Surface/Primary` |
| fill | Day=True | `Background/Surface/Secondary` |
| border | — | `Border Color/Divider/Table Divider` |

#### Schedule Totals Cell

| Property | Condition | Token |
|---|---|---|
| border | Week=True | `Border Color/Divider/Table Divider` |

#### Daily totals

| Property | Condition | Token |
|---|---|---|
| fill | Week=True | `Text Color/Body/Secondary` |

#### Shift Chip

| Property | Condition | Token |
|---|---|---|
| fill | View=Shift | `color/green/500` |
| fill | View=Shift | `color/red/600` |
| fill | View=Shift | `color/teal-green/500` |

#### Morning Shift

| Property | Condition | Token |
|---|---|---|
| fill | View=Shift | `Text Color/Body/Primary` |

#### 08:00 – 16:00

| Property | Condition | Token |
|---|---|---|
| fill | View=Shift | `Text Color/Body/Secondary` |

#### Server

| Property | Condition | Token |
|---|---|---|
| fill | View=Job | `Text Color/Body/Primary` |

#### 12 employees

| Property | Condition | Token |
|---|---|---|
| fill | View=Job, Week=True | `Text Color/Body/Secondary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | border | `Border Color/Divider/Table Divider` |
| Input | fill | `Background/Surface/Primary` |
| Input | border | `Border Color/Input Field/Input Field` |
| icon | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Secondary` |
| Text Content | fill | `Text Color/Input/Input Placeholder` |
| Button Icon | fill | `Background/Action/Action Tertiary` |
| Schedule Row | fill | `Background/Surface/Primary` |
| Schedule Row | border | `Border Color/Divider/Table Divider` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Text Content | typography | — | `Value/S` |
| Daily totals | typography | Week=True | `Caption/XS` |
| Morning Shift | typography | View=Shift | `Caption/S - Strong` |
| 08:00 – 16:00 | typography | View=Shift | `Caption/S` |
| 08:00 – 16:00 | typography | View=Shift, Day=False | `Caption/XS` |
| Server | typography | View=Job | `Caption/S - Strong` |
| 12 employees | typography | View=Job, Week=True | `Caption/S` |

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

- [Schedule Header Cell](./schedule-header-cell.md)
- [Schedule Totals Cell](./schedule-totals-cell.md)
- [Schedule Row](./schedule-row.md)

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
- **Schedule Totals Cell**: hardcoded itemSpacing (24px)
- **Schedule Totals Cell**: hardcoded padding
- **Schedule Row**: hardcoded itemSpacing (12px)
- **Schedule Row**: hardcoded padding
- **Row**: hardcoded itemSpacing (8px)
- **Shift Chip**: hardcoded cornerRadius (4px)
- **Text Container**: hardcoded itemSpacing (2px)
- **Shift Chip**: hardcoded color (no variable or style)
