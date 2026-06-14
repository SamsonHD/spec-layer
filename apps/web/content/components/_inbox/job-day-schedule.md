---
spec_version: "0.1"
component:
  name: Job / Day Schedule
  figma_key: b63149594d54295b4fe70b330282f49ce3702ccf
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26831:24690
content_hash: 292084d7513e5be08991e03b97979914a695601233b6db04c2408ee48e254494
extracted_at: 2026-06-14T10:04:47.098Z
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
| Job / Day Schedule | fill | `Background/Surface/Primary` |
| Schedule Header | fill | `Background/Surface/Secondary` |
| Schedule Header | border | `Border Color/Divider/Divider Secondary` |
| Schedule Header Cell | fill | `Background/Surface/Secondary` |
| Schedule Header Cell | border | `Border Color/Divider/Table Divider` |
| Input | fill | `Background/Surface/Primary` |
| Input | border | `Border Color/Input Field/Input Field` |
| icon | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Secondary` |
| icon | fill | `Text Color/Body/White` |
| Text Content | fill | `Text Color/Input/Input Placeholder` |
| Button Icon | fill | `Background/Action/Action Tertiary` |
| 12 AM | fill | `Text Color/Body/Secondary` |
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
| Employee | fill | `Text Color/Body/White` |
| Time | fill | `Text Color/Body/White` |
| Location | fill | `Text Color/Body/White` |
| Server | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Text Content | typography | — | `Value/S` |
| 12 AM | typography | — | `Caption/S` |
| Open Shifts | typography | — | `Caption/S - Strong` |
| 3 open | typography | — | `Caption/S` |
| Label | typography | — | `Action/XS` |
| Label | typography | — | `Caption/XS - Strong` |
| Employee | typography | — | `Caption/S - Extra Strong` |
| Time | typography | — | `Caption/XS - Strong` |
| Location | typography | — | `Caption/XS` |
| Server | typography | — | `Caption/S - Strong` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | — | `rounded-8` |
| Button | border-radius | — | `rounded-8` |
| Button | padding-x | — | `size-12` |
| Button | padding-y | — | `size-4` |
| Shift Tile / By Job | border-radius | — | `rounded-4` |
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
- **Schedule Header Cell**: hardcoded itemSpacing (85px)
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
- **Shift Container**: hardcoded itemSpacing (8px)
- **Shift Tile / Employee**: hardcoded color (no variable or style)
- **Icon**: hardcoded itemSpacing (8px)
- **Icon**: hardcoded padding
- **Content**: hardcoded itemSpacing (2px)
- **Content**: hardcoded padding
- **Row**: hardcoded itemSpacing (8px)
- **Title**: hardcoded itemSpacing (8px)
- **Shift name**: hardcoded color (no variable or style)
- **Chip**: hardcoded itemSpacing (8px)
- **Chip**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **Overnight badge**: hardcoded itemSpacing (8px)
- **Time**: hardcoded color (no variable or style)
- **Location container**: hardcoded itemSpacing (4px)
- **Location**: hardcoded color (no variable or style)
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Shift Tile / By Job**: hardcoded color (no variable or style)
- **Content**: hardcoded itemSpacing (4px)
- **Avatar Container**: hardcoded itemSpacing (8px)
- **Avatar**: hardcoded itemSpacing (4.444444179534912px)
- **Avatar**: hardcoded cornerRadius (11109.9990234375px)
- **Photo**: hardcoded itemSpacing (8.888888359069824px)
- **Photo**: hardcoded cornerRadius (11109.9990234375px)
- **Status Badge**: hardcoded cornerRadius (100px)
- **ChipShift**: hardcoded color (no variable or style)
- **ChipShift**: hardcoded itemSpacing (8px)
- **ChipShift**: hardcoded padding
- **Status Stripe**: hardcoded color (no variable or style)
- **Employee**: hardcoded color (no variable or style)
- **Job Badge**: hardcoded itemSpacing (4px)
- **Job Badge**: hardcoded cornerRadius (9999px)
- **Initials**: hardcoded cornerRadius (9999px)
- **Initials**: hardcoded padding
- **icon**: hardcoded color (no variable or style)
