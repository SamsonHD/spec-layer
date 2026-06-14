---
spec_version: "0.1"
component:
  name: Employee / Month Schedule
  figma_key: 530abf6adc3ee326da440f88ff7662db508c0b1c
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26573:3473
content_hash: 25084c0b1c36262e833d35873d67e8e679727e72e07d6777d01f47724c510438
extracted_at: 2026-06-14T10:04:36.372Z
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
| Mon | fill | `Text Color/Semantic/Disabled` |
| Schedule Grid Cell | fill | `Background/Surface/Primary` |
| Schedule Grid Cell | fill | `Background/Surface/Tertiary` |
| Schedule Grid Cell | border | `Border Color/Divider/Table Divider` |
| 15 | fill | `Text Color/Action/Default` |
| 15 | fill | `Text Color/Body/Secondary` |
| Chip | fill | `Background/Semantic/Status → Warning` |
| Chip | fill | `Background/Сhip/Chip` |
| Label | fill | `Text Color/Body/Primary` |
| Label | fill | `Text Color/Body/Secondary` |
| Label | fill | `Text Color/Semantic/Warning` |
| Shift Tile / Employee | border | `Text Color/Body/White` |
| Shift name | fill | `Text Color/Body/White` |
| Time | fill | `Text Color/Body/White` |
| icon | fill | `Text Color/Body/White` |
| +5 more | fill | `Text Color/Body/Secondary` |
| Ellipse 1 | fill | `Background/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Mon | typography | — | `Caption/S - Strong` |
| 15 | typography | — | `Caption/S` |
| 15 | typography | — | `Caption/S - Strong` |
| Label | typography | — | `Caption/XS - Strong` |
| Shift name | typography | — | `Caption/S - Extra Strong` |
| Time | typography | — | `Caption/XS - Strong` |
| +5 more | typography | — | `Caption/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Chip | border-radius | — | `rounded-8` |
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

- **Schedule Header Cell**: hardcoded itemSpacing (24px)
- **Schedule Header Cell**: hardcoded padding
- **Schedule Grid Cell**: hardcoded itemSpacing (4px)
- **Schedule Grid Cell**: hardcoded padding
- **Text**: hardcoded itemSpacing (4px)
- **Text**: hardcoded cornerRadius (11px)
- **Chip**: hardcoded itemSpacing (8px)
- **Chip**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Frame 1**: hardcoded itemSpacing (8px)
- **Frame 1**: hardcoded padding
- **Shift Container**: hardcoded itemSpacing (8px)
- **Text**: hardcoded padding
- **Shift Tile / Employee**: hardcoded color (no variable or style)
- **Content**: hardcoded itemSpacing (4px)
- **Content**: hardcoded padding
- **Row**: hardcoded itemSpacing (8px)
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
- **Alert**: hardcoded itemSpacing (8px)
- **Open Shift**: hardcoded color (no variable or style)
- **Open Shift**: hardcoded cornerRadius (9999px)
- **Status Stripe**: hardcoded color (no variable or style)
- **Shift name**: hardcoded color (no variable or style)
- **Time**: hardcoded color (no variable or style)
