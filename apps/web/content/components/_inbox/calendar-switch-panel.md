---
spec_version: "0.1"
component:
  name: Calendar Switch Panel
  figma_key: ebb63e6df2c8dc1f49be24361080fc014df5681d
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 14762:16596
content_hash: 967f9e20ba48421a09ed7f712e5f16b479c1ed19d467ce7ff8a2347c405884fe
extracted_at: 2026-06-14T10:05:04.441Z
---

## Definition

_To be written._

## Anatomy

1. Date
2. Segment Control (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| 👁️ More Action Btn | boolean | true / false | false |
| 👁️ CTA on Right | boolean | true / false | false |
| 👁️ CTA on Left | boolean | true / false | false |
| 👁️ Left Slot | boolean | true / false | false |
| 👁️ Right Slot | boolean | true / false | false |
| Right Slot Instance | instanceSwap | — | 5507:362804 |
| Left Slot Instance | instanceSwap | — | 5507:362804 |

## Variants

- **Type**: Day (default) · Week · Month
- **Size**: Large (default) · Medium · Small

## States

- Default

## Tokens used

### Color

#### Button

| Property | Condition | Token |
|---|---|---|
| fill | Size=Large · Medium | `Background/Action/Action Secondary` |
| border | Size=Large · Medium | `Border Color/Action/Secondary Button (Default)` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | — | `Text Color/Body/Primary` |
| fill | Size=Medium | `Text Color/Body/Secondary` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | — | `Text Color/Action/On Secondary` |
| fill | Size=Large | `Text Color/Body/Primary` |
| fill | Size=Small | `Text Color/Action/Default` |

#### Button Icon

| Property | Condition | Token |
|---|---|---|
| border | Size=Large · Medium | `Border Color/Action/Secondary Button (Default)` |

#### 9 November - 15 November, 2023

| Property | Condition | Token |
|---|---|---|
| fill | Type=Week | `Text Color/Body/Primary` |

#### Segment Control

| Property | Condition | Token |
|---|---|---|
| fill | Size=Large | `Background/Segment Control/Segment Control` |

#### .segmentedControlLabel Wrapper new

| Property | Condition | Token |
|---|---|---|
| fill | Size=Large | `Background/Surface/Primary` |
| border | Size=Large | `Border Color/Chip/Default` |

#### Select

| Property | Condition | Token |
|---|---|---|
| fill | Size=Medium | `Background/Surface/Primary` |
| border | Size=Medium | `Border Color/Input Field/Input Field` |

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Size=Medium | `Text Color/Body/Primary` |

#### 10 November, 2023

| Property | Condition | Token |
|---|---|---|
| fill | Type=Day | `Text Color/Body/Primary` |

#### November, 2023

| Property | Condition | Token |
|---|---|---|
| fill | Type=Month, Size=Large · Medium | `Text Color/Body/Primary` |

#### Button Group

| Property | Condition | Token |
|---|---|---|
| border | Size=Small | `Border Color/Action/Secondary Button (Default)` |

#### Action 1

| Property | Condition | Token |
|---|---|---|
| fill | Size=Small | `Background/Action/Action Secondary` |
| border | Size=Small | `Border Color/Action/Secondary Button (Default)` |

#### Action 2

| Property | Condition | Token |
|---|---|---|
| fill | Size=Small | `Background/Action/Action Secondary` |
| border | Size=Small | `Border Color/Action/Secondary Button (Default)` |

#### Action 3

| Property | Condition | Token |
|---|---|---|
| fill | Size=Small | `Background/Action/Action Secondary` |
| border | Size=Small | `Border Color/Action/Secondary Button (Default)` |

#### Button (Link)

| Property | Condition | Token |
|---|---|---|
| fill | Size=Small | `Background/Transparent` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | border | `Border Color/Divider/Divider` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Size=Large | `Value/S` |
| Label | typography | Size=Large · Medium | `Action/S` |
| Label | typography | Type=Week · Month, Size=Large | `[ARCHIVE]/*Mobile/Field Label Small` |
| Label | typography | Size=Small | `Action/M` |
| Label | typography | Size=Small | `Action/S` |
| 9 November - 15 November, 2023 | typography | Type=Week | `[ARCHIVE]/*Mobile/Field Label` |
| Placeholder | typography | Size=Medium | `Value/S` |
| 10 November, 2023 | typography | Type=Day | `[ARCHIVE]/*Mobile/Field Label` |
| November, 2023 | typography | Type=Month, Size=Large · Medium | `[ARCHIVE]/*Mobile/Field Label` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | Size=Large · Medium | `rounded-8` |
| Button | padding-x | Size=Large · Medium | `size-16` |
| Button Icon | border-radius | Size=Large · Medium | `rounded-8` |
| Segment Control | border-radius | Size=Large | `rounded-8` |
| .segmentedControlLabel Wrapper new | effects | Size=Large | `Segmented Control` |
| Button Group | border-radius | Size=Small | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Segment Control](./segment-control.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (16px)
- **Container**: hardcoded padding
- **Button**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Left Slot/Replace Me**: hardcoded color (no variable or style)
- **Left Slot/Replace Me**: hardcoded padding
- **Replace Me**: hardcoded color (no variable or style)
- **Date**: hardcoded itemSpacing (8px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **Period**: hardcoded padding
- **Segment Control**: hardcoded itemSpacing (4px)
- **Segment Control**: hardcoded padding
- **.segmentedControlLabel Wrapper new**: hardcoded itemSpacing (8px)
- **.segmentedControlLabel Wrapper new**: hardcoded cornerRadius (6px)
- **.segmentedControlLabel Wrapper new**: hardcoded padding
- **Right Slot/Replace Me**: hardcoded color (no variable or style)
- **Right Slot/Replace Me**: hardcoded padding
