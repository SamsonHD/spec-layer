---
spec_version: "0.1"
component:
  name: Job / Week Schedule
  figma_key: a1dbce166d6987b8fac0bcfb2b34b8e8d860db1b
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26831:24691
content_hash: 32202f5365ad53d9c47408e8e3a4f86a2496c366dff6539c5a893af7a485cff0
extracted_at: 2026-06-14T10:04:47.119Z
---

## Definition

_To be written._

## Anatomy

1. Schedule Header (component)
2. Schedule (component)

## Configuration

_None._

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Schedule Header | fill | `Background/Surface/Primary` |
| Schedule Header Cell | fill | `Background/Surface/Primary` |
| Schedule Header Cell | border | `Border Color/Divider/Table Divider` |
| Input | fill | `Background/Surface/Primary` |
| Input | border | `Border Color/Input Field/Input Field` |
| icon | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Secondary` |
| icon | fill | `Text Color/Body/White` |
| Text Content | fill | `Text Color/Input/Input Placeholder` |
| Button Icon | fill | `Background/Action/Action Tertiary` |
| Mon | fill | `Text Color/Action/Default` |
| Mon | fill | `Text Color/Body/Primary` |
| Apr 20 | fill | `Text Color/Body/Secondary` |
| 40h | fill | `Text Color/Body/Secondary` |
| · | fill | `Text Color/Body/Secondary` |
| $812 | fill | `Text Color/Body/Secondary` |
| Rectangle 4 | fill | `Background/Action/Action` |
| Schedule Row | border | `Border Color/Divider/Table Divider` |
| Schedule Row | fill | `Background/Surface/Primary` |
| Open Shifts | fill | `Text Color/Body/Primary` |
| 3 open | fill | `Text Color/Body/Secondary` |
| Button | fill | `Background/Action/Action Secondary` |
| Button | border | `Border Color/Action/Secondary Button (Default)` |
| Label | fill | `Text Color/Action/On Secondary` |
| Label | fill | `Text Color/Body/Primary` |
| Schedule Grid Cell | border | `Border Color/Divider/Table Divider` |
| Schedule Grid Cell | fill | `Background/Surface/Primary` |
| Schedule Grid Cell | fill | `Background/Surface/Tertiary` |
| Employee | fill | `Text Color/Body/White` |
| Time | fill | `Text Color/Body/White` |
| Server | fill | `Text Color/Body/Primary` |
| 12 employees | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Text Content | typography | — | `Value/S` |
| Mon | font-size | — | `font-size/fs-200` |
| Mon | font-family | — | `font-family/font-family` |
| Mon | line-height | — | `line-height/lh-300` |
| Mon | font-weight | — | `font-weight/fw-600` |
| Apr 20 | line-height | — | `line-height/lh-150` |
| Apr 20 | font-family | — | `font-family/font-family` |
| Apr 20 | font-size | — | `font-size/fs-100` |
| 40h | typography | — | `Caption/XS - Strong` |
| · | typography | — | `Caption/S` |
| $812 | typography | — | `Caption/XS - Strong` |
| Open Shifts | typography | — | `Caption/S - Strong` |
| 3 open | typography | — | `Caption/S` |
| Label | typography | — | `Action/XS` |
| Label | typography | — | `Caption/XS - Strong` |
| Employee | typography | — | `Caption/S - Extra Strong` |
| Time | typography | — | `Caption/XS - Strong` |
| Server | typography | — | `Caption/S - Strong` |
| 12 employees | typography | — | `Caption/S` |
| Location | typography | — | `Caption/XS` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | — | `rounded-8` |
| Temperature | border-radius | — | `rounded-8` |
| Icon BG | border-radius | — | `rounded-8` |
| Button | border-radius | — | `rounded-8` |
| Button | padding-x | — | `size-12` |
| Button | padding-y | — | `size-4` |
| Shift Tile / By Shift | border-radius | — | `rounded-4` |
| ChipShift | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Schedule Header](./schedule-header.md)
- [Schedule](./schedule.md)

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
- **Schedule Header Cell**: hardcoded color (no variable or style)
- **Schedule**: hardcoded color (no variable or style)
- **Schedule Row**: hardcoded itemSpacing (12px)
- **Schedule Row**: hardcoded padding
- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded padding
- **Open Shift**: hardcoded color (no variable or style)
- **Open Shift**: hardcoded cornerRadius (9999px)
- **Text Container**: hardcoded itemSpacing (2px)
- **Button**: hardcoded itemSpacing (4px)
- **Schedule Grid Cell**: hardcoded itemSpacing (4px)
- **Schedule Grid Cell**: hardcoded padding
- **Text**: hardcoded itemSpacing (4px)
- **Text**: hardcoded cornerRadius (11px)
- **Frame 1**: hardcoded itemSpacing (8px)
- **Frame 1**: hardcoded padding
- **Shift Container**: hardcoded itemSpacing (8px)
- **Text**: hardcoded padding
- **Shift Tile / By Shift**: hardcoded color (no variable or style)
- **Content**: hardcoded itemSpacing (4px)
- **Content**: hardcoded padding
- **Row**: hardcoded itemSpacing (8px)
- **Avatar Container**: hardcoded itemSpacing (8px)
- **Avatar**: hardcoded itemSpacing (4.444444179534912px)
- **Avatar**: hardcoded cornerRadius (11109.9990234375px)
- **Photo**: hardcoded itemSpacing (8.888888359069824px)
- **Photo**: hardcoded cornerRadius (11109.9990234375px)
- **Status Badge**: hardcoded cornerRadius (100px)
- **Title**: hardcoded itemSpacing (8px)
- **Overnight badge**: hardcoded itemSpacing (8px)
- **ChipShift**: hardcoded color (no variable or style)
- **ChipShift**: hardcoded itemSpacing (8px)
- **ChipShift**: hardcoded padding
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Status Stripe**: hardcoded color (no variable or style)
- **Employee**: hardcoded color (no variable or style)
- **Time**: hardcoded color (no variable or style)
- **Location**: hardcoded color (no variable or style)
- **Job Badge**: hardcoded itemSpacing (4px)
- **Job Badge**: hardcoded cornerRadius (9999px)
- **Initials**: hardcoded cornerRadius (9999px)
- **Initials**: hardcoded padding
- **Schedule Grid Cell**: hardcoded color (no variable or style)
- **Content**: hardcoded itemSpacing (8px)
- **Avatar Container**: hardcoded padding
- **Container**: hardcoded itemSpacing (2px)
- **Location container**: hardcoded itemSpacing (4px)
