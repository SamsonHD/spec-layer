---
spec_version: "0.1"
component:
  name: Date Picker Calendar
  figma_key: 6b519563b226b3132f5e8647058624fd359e73cc
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 13334:242246
content_hash: da60cf79055e143c92d733bcde3f4fb76887cdb2c2f7b20778785af8cbca0db6
extracted_at: 2026-06-14T10:03:56.641Z
---

## Definition

_To be written._

## Anatomy

1. calendar
2. Buttons at bottom

## Configuration

_None._

## Variants

- **Type**: One-month (default) · One-month (show dates of prev&Next month) · Two-months
- **Selection**: None (default) · Single · Range

## States

- Default

## Tokens used

### Color

#### left

| Property | Condition | Token |
|---|---|---|
| fill | — | `Background/Transparent` |
| fill | Selection=Range | `Background/Date Picker/Date Picker Range` |

#### right

| Property | Condition | Token |
|---|---|---|
| fill | — | `Background/Transparent` |
| fill | Selection=Range | `Background/Date Picker/Date Picker Range` |

#### Date

| Property | One-month | One-month (show dates of prev&Next month) | Two-months |
|---|---|---|---|
| fill | `Text Color/Action/Link` · `Text Color/Body/Primary` | `Text Color/Body/Secondary` | `Text Color/Action/Link` · `Text Color/Body/Primary` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Selection=Single · Range | `Text Color/Action/On Action` |

#### Rounded

| Property | Condition | Token |
|---|---|---|
| fill | Selection=Single · Range | `Background/Action/Action` |

#### .calendarDateWrapper

| Property | Condition | Token |
|---|---|---|
| fill | Selection=Range | `Background/Date Picker/Date Picker Range` |

#### Divider

| Property | Condition | Token |
|---|---|---|
| fill | Type=Two-months | `Background/Divider/Divider` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Type=One-month · One-month (show dates of prev&Next month) | `Text Color/Body/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| Container | border | `Border Color/Input Field/Input Field` |
| Button Icon | fill | `Background/Action/Action Tertiary` |
| icon | fill | `Text Color/Body/Primary` |
| Month Label | fill | `Text Color/Body/Primary` |
| Day | fill | `Text Color/Body/Primary` |
| ⚠️ [Deprecated] Button (Link) | fill | `Background/Transparent` |
| Label | fill | `Text Color/Action/Link` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Month Label | typography | — | `[ARCHIVE]/*Mobile/Field Label (Emphasized)` |
| Day | typography | — | `Value/S` |
| Date | typography | — | `Value/S` |
| Label | typography | — | `[ARCHIVE]/*Tablet Portrait/Button Label` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | effects | — | `light/Shadow/Dropdown Menu` |
| Button Icon | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (16px)
- **Container**: hardcoded cornerRadius (12px)
- **Container**: hardcoded padding
- **calendar**: hardcoded itemSpacing (48px)
- **Feburary**: hardcoded itemSpacing (32px)
- **month/year**: hardcoded itemSpacing (16px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **month**: hardcoded itemSpacing (8px)
- **.calendarDay**: hardcoded itemSpacing (10px)
- **.calendarDay**: hardcoded padding
- **.Date Picker Calendar Date**: hardcoded color (no variable or style)
- **.calendarDateWrapper**: hardcoded itemSpacing (10px)
- **.calendarDateWrapper**: hardcoded padding
- **Rounded**: hardcoded itemSpacing (10px)
- **Rounded**: hardcoded cornerRadius (9999px)
- **Rounded**: hardcoded padding
- **March**: hardcoded itemSpacing (32px)
- **⚠️ [Deprecated] Button (Link)**: hardcoded itemSpacing (10px)
- **⚠️ [Deprecated] Button (Link)**: hardcoded cornerRadius (9999px)
