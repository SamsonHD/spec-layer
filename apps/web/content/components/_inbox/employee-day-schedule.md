---
spec_version: "0.1"
component:
  name: Employee / Day Schedule
  figma_key: 680d1a4e0cafe7013baa9ade2a375ace4625b90e
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26540:352946
content_hash: e711ee30d2c899bc19d8c9a3ec61cc1927c9fd7aa6235fd37c08fe2d9f031d8f
extracted_at: 2026-06-14T10:04:46.990Z
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
| Schedule Header | fill | `Background/Surface/Secondary` |
| Schedule Header | border | `Border Color/Divider/Divider Secondary` |
| Schedule Header Cell | fill | `Background/Surface/Secondary` |
| Schedule Header Cell | border | `Border Color/Divider/Table Divider` |
| Input | fill | `Background/Surface/Primary` |
| Input | border | `Border Color/Input Field/Input Field` |
| icon | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Secondary` |
| icon | fill | `Text Color/Body/White` |
| icon | fill | `Text Color/Semantic/Disabled` |
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
| Shift Tile / Employee | border | `Border Color/Input Field/Input Field Disabled` |
| Shift Tile / Employee | border | `Text Color/Body/White` |
| Shift name | fill | `Text Color/Body/White` |
| Shift name | fill | `Text Color/Semantic/Disabled` |
| Time | fill | `Text Color/Body/White` |
| Time | fill | `Text Color/Semantic/Disabled` |
| ChipShift | fill | `Background/Semantic/Status → Warning` |
| Name | fill | `Text Color/Body/Primary` |
| 40h · $750 | fill | `Text Color/Body/Secondary` |
| Pending | fill | `Text Color/Semantic/Warning` |
| Initials | fill | `Background/Surface/Tertiary` |
| AA | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Text Content | typography | — | `Value/S` |
| 12 AM | typography | — | `Caption/S` |
| Open Shifts | typography | — | `Caption/S - Strong` |
| 3 open | typography | — | `Caption/S` |
| Label | typography | — | `Action/XS` |
| Label | typography | — | `Caption/XS - Strong` |
| Shift name | typography | — | `Caption/S - Extra Strong` |
| Time | typography | — | `Caption/XS - Strong` |
| Name | typography | — | `Caption/S - Strong` |
| 40h · $750 | typography | — | `Caption/S` |
| Pending | typography | — | `Caption/XS - Strong` |
| AA | typography | — | `Caption/XS - Strong` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | — | `rounded-8` |
| Button | border-radius | — | `rounded-8` |
| Button | padding-x | — | `size-12` |
| Button | padding-y | — | `size-4` |
| Shift Tile / Employee | border-radius | — | `rounded-4` |
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
- **Schedule Row**: hardcoded color (no variable or style)
- **Schedule Row**: hardcoded itemSpacing (12px)
- **Schedule Row**: hardcoded padding
- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded padding
- **Open Shift**: hardcoded color (no variable or style)
- **Open Shift**: hardcoded cornerRadius (9999px)
- **Text Container**: hardcoded itemSpacing (2px)
- **Button**: hardcoded itemSpacing (4px)
- **Schedule Grid Cell**: hardcoded color (no variable or style)
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
- **Status Stripe**: hardcoded color (no variable or style)
- **Content**: hardcoded itemSpacing (4px)
- **ChipShift**: hardcoded color (no variable or style)
- **ChipShift**: hardcoded itemSpacing (8px)
- **ChipShift**: hardcoded padding
- **Alert**: hardcoded itemSpacing (8px)
- **Avatar**: hardcoded itemSpacing (4px)
- **Avatar**: hardcoded cornerRadius (9999px)
- **Photo**: hardcoded itemSpacing (8px)
- **Photo**: hardcoded cornerRadius (9999px)
- **Status Badge**: hardcoded cornerRadius (100px)
- **Avatar**: hardcoded itemSpacing (4.444444179534912px)
- **Avatar**: hardcoded cornerRadius (11109.9990234375px)
- **Photo**: hardcoded itemSpacing (8.888888359069824px)
- **Photo**: hardcoded cornerRadius (11109.9990234375px)
- **Shift icon**: hardcoded itemSpacing (8px)
- **Title**: hardcoded itemSpacing (4px)
- **Initials**: hardcoded cornerRadius (9999px)
- **Initials**: hardcoded padding
- **icon**: hardcoded color (no variable or style)
