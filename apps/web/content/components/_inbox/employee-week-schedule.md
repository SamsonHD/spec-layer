---
spec_version: "0.1"
component:
  name: Employee / Week Schedule
  figma_key: df9139f964f6bd0e70c2c147364c5bfcf52b9243
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26540:352947
content_hash: 10cebe0460d2e70e1ae8eec4b45a9f98adbd522738bfade35d8afadad9890a3e
extracted_at: 2026-06-14T10:04:36.339Z
---

## Definition

_To be written._

## Anatomy

1. Schedule Header (component)
2. Row

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
| Chip | fill | `Background/Semantic/Status → Warning` |
| Label | fill | `Text Color/Action/On Secondary` |
| Label | fill | `Text Color/Semantic/Warning` |
| Schedule Row | border | `Border Color/Divider/Table Divider` |
| Schedule Row | fill | `Background/Surface/Primary` |
| Open Shifts | fill | `Text Color/Body/Primary` |
| 3 open | fill | `Text Color/Body/Secondary` |
| Button | fill | `Background/Action/Action Secondary` |
| Button | border | `Border Color/Action/Secondary Button (Default)` |
| Schedule Grid Cell | border | `Border Color/Divider/Table Divider` |
| Schedule Grid Cell | fill | `Background/Surface/Primary` |
| Schedule Grid Cell | fill | `Background/Surface/Tertiary` |
| Shift Tile / Employee | border | `Border Color/Input Field/Input Field Disabled` |
| Shift Tile / Employee | border | `Text Color/Body/White` |
| Shift Tile / Employee | fill | `color/blue/50` |
| Shift name | fill | `Text Color/Body/White` |
| Shift name | fill | `Text Color/Semantic/Disabled` |
| Time | fill | `Text Color/Body/White` |
| Time | fill | `Text Color/Semantic/Disabled` |
| Time | fill | `color/blue/600` |
| Location | fill | `Text Color/Body/White` |
| Location | fill | `Text Color/Semantic/Disabled` |
| Name | fill | `Text Color/Body/Primary` |
| 40h · $750 | fill | `Text Color/Body/Secondary` |
| ChipShift | fill | `Background/Semantic/Status → Success` |
| ChipShift | fill | `Background/Semantic/Status → Warning` |
| Approved | fill | `Text Color/Semantic/Success` |
| +5 more | fill | `Text Color/Body/Secondary` |
| Pending | fill | `Text Color/Semantic/Warning` |
| Initials | fill | `Background/Surface/Tertiary` |
| AA | fill | `Text Color/Body/Secondary` |

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
| Label | typography | — | `Action/XS` |
| Label | typography | — | `Caption/XS - Strong` |
| Open Shifts | typography | — | `Caption/S - Strong` |
| 3 open | typography | — | `Caption/S` |
| Shift name | typography | — | `Caption/S - Extra Strong` |
| Time | typography | — | `Caption/XS` |
| Time | typography | — | `Caption/XS - Strong` |
| Location | typography | — | `Caption/XS` |
| Name | typography | — | `Caption/S - Strong` |
| 40h · $750 | typography | — | `Caption/S` |
| Approved | typography | — | `Caption/XS - Strong` |
| +5 more | typography | — | `Caption/S` |
| Pending | typography | — | `Caption/XS - Strong` |
| AA | typography | — | `Caption/XS - Strong` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | — | `rounded-8` |
| Temperature | border-radius | — | `rounded-8` |
| Icon BG | border-radius | — | `rounded-8` |
| Chip | border-radius | — | `rounded-8` |
| Button | border-radius | — | `rounded-8` |
| Button | padding-x | — | `size-12` |
| Button | padding-y | — | `size-4` |
| Shift Tile / Employee | border-radius | — | `rounded-4` |
| Shift Tile / Employee | border-top-left-radius | — | `rounded-4` |
| Shift Tile / Employee | border-bottom-left-radius | — | `rounded-4` |
| Shift Tile / Employee | border-top-right-radius | — | `rounded-4` |
| Shift Tile / Employee | border-bottom-right-radius | — | `rounded-4` |
| ChipShift | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Schedule Header](./schedule-header.md)

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
- **Status Stripe**: hardcoded color (no variable or style)
- **Shift name**: hardcoded color (no variable or style)
- **Time**: hardcoded color (no variable or style)
- **Location**: hardcoded color (no variable or style)
- **Avatar**: hardcoded itemSpacing (4px)
- **Avatar**: hardcoded cornerRadius (9999px)
- **Photo**: hardcoded itemSpacing (8px)
- **Photo**: hardcoded cornerRadius (9999px)
- **Status Badge**: hardcoded cornerRadius (100px)
- **Schedule Grid Cell**: hardcoded color (no variable or style)
- **Title**: hardcoded itemSpacing (4px)
- **Shift icon**: hardcoded itemSpacing (8px)
- **icon**: hardcoded color (no variable or style)
- **Initials**: hardcoded cornerRadius (9999px)
- **Initials**: hardcoded padding
- **Frame 1801288666**: hardcoded cornerRadius (4px)
