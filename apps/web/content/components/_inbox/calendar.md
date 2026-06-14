---
spec_version: "0.1"
component:
  name: Calendar
  figma_key: c3e255eb12b1eb30cef411c53d97e756c9e54b31
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 14762:15558
content_hash: 69587f61ee8bb1f649f2bded3ec1539f5ca9ea0b3680e540270bcb3b82a3342d
extracted_at: 2026-06-14T10:05:04.332Z
---

## Definition

_To be written._

## Anatomy

1. Switch Panel (component)
2. Month View

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Current Time Marker | boolean | true / false | true |
| 👁️ Scroll Bar | boolean | true / false | true |
| 👁️ All Day Event | boolean | true / false | true |
| Current Date | text | — | Wednesday, Nov 12, 2023 |
| 👁️ Weekends | boolean | true / false | true |
| 👁️ Switch Panel | boolean | true / false | true |

## Variants

- **View**: Day (default) · Week · Month
- **Breakpoints**: Large (default) · Medium · Small

## States

- Default

## Tokens used

### Color

#### Button

| Property | Condition | Token |
|---|---|---|
| fill | Breakpoints=Large · Medium | `Background/Action/Action Secondary` |
| border | Breakpoints=Large · Medium | `Border Color/Action/Secondary Button (Default)` |

#### icon

| Property | Large | Medium | Small |
|---|---|---|---|
| fill | `Text Color/Body/Primary` | `Text Color/Body/Primary` · `Text Color/Body/Secondary` | `Text Color/Body/White` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | View=Day · Week, Breakpoints=Small | `Text Color/Action/Default` |
| fill | View=Month, Breakpoints=Small | `Text Color/Body/Primary` |

#### Label

| Property | Large | Medium | Small |
|---|---|---|---|
| fill | `Text Color/Body/Primary` · `Text Color/Action/On Secondary` | `Text Color/Action/On Secondary` | `Text Color/Action/Default` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | View=Month, Breakpoints=Large · Medium | `Text Color/Action/Default` |
| fill | View=Month, Breakpoints=Small | `Text Color/Action/On Secondary` |

#### Button Icon

| Property | Condition | Token |
|---|---|---|
| border | Breakpoints=Large · Medium | `Border Color/Action/Secondary Button (Default)` |
| fill | Breakpoints=Small | `Background/Action/Action` |

#### November, 2023

| Property | Condition | Token |
|---|---|---|
| fill | View=Month, Breakpoints=Large · Medium | `Text Color/Body/Primary` |

#### Segment Control

| Property | Condition | Token |
|---|---|---|
| fill | Breakpoints=Large | `Background/Segment Control/Segment Control` |

#### .segmentedControlLabel Wrapper new

| Property | Condition | Token |
|---|---|---|
| fill | Breakpoints=Large | `Background/Surface/Primary` |
| border | Breakpoints=Large | `Border Color/Chip/Default` |

#### Mon

| Property | Condition | Token |
|---|---|---|
| fill | View=Week · Month, Breakpoints=Large · Medium | `Text Color/Body/Secondary` |
| fill | View=Day · Week, Breakpoints=Large · Medium | `Text Color/Action/Link` |
| fill | View=Month, Breakpoints=Small | `Text Color/Body/Primary` |

#### Rectangle 7235

| Property | Condition | Token |
|---|---|---|
| fill | — | `Background/Divider/Divider Secondary` |
| fill | View=Week, Breakpoints=Large · Medium | `Background/Divider/Divider` |

#### 14

| Property | Day | Week | Month |
|---|---|---|---|
| fill | `Text Color/Action/Link` | `Text Color/Action/Link` | `Text Color/Action/On Action` · `Text Color/Body/Secondary` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | View=Week · Month, Breakpoints=Large · Medium | `Text Color/Body/Primary` |
| fill | Breakpoints=Small | `Text Color/Body/Primary` |

#### Date

| Property | Condition | Token |
|---|---|---|
| fill | View=Month | `Background/Action/Action` |

#### Change Color Here

| Property | Condition | Token |
|---|---|---|
| fill | View=Month | `Background/Accent6 → Primary` |

#### Cover

| Property | Condition | Token |
|---|---|---|
| fill | View=Month | `Background/Surface/Primary` |

#### 10:00am Event Name - Random Name

| Property | Condition | Token |
|---|---|---|
| fill | View=Month, Breakpoints=Large · Medium | `Text Color/Body/Primary` |

#### Dec

| Property | Condition | Token |
|---|---|---|
| fill | View=Month | `Text Color/Body/Primary` |
| fill | View=Month | `Text Color/Body/Secondary` |

#### 9 November - 15 November, 2023

| Property | Condition | Token |
|---|---|---|
| fill | View=Week, Breakpoints=Large · Medium | `Text Color/Body/Primary` |

#### 24

| Property | Condition | Token |
|---|---|---|
| fill | View=Day · Week | `Text Color/Body/Primary` |

#### PM

| Property | Condition | Token |
|---|---|---|
| fill | View=Day · Week | `Text Color/Body/Primary` |

#### .calendarHourBlock

| Property | Condition | Token |
|---|---|---|
| fill | View=Day · Week | `Background/Transparent` |

#### bg shadow

| Property | Condition | Token |
|---|---|---|
| fill | View=Day · Week, Breakpoints=Large · Medium | `Background/Surface/Primary` |

#### itemWrapper

| Property | Condition | Token |
|---|---|---|
| fill | View=Day · Week, Breakpoints=Large · Medium | `Background/Accent6 → Primary` |

#### Color Bar

| Property | Condition | Token |
|---|---|---|
| fill | View=Day · Week, Breakpoints=Large · Medium | `Background/Surface/Primary` |

#### Shade Cover

| Property | Condition | Token |
|---|---|---|
| fill | View=Day · Week, Breakpoints=Large · Medium | `Background/Surface/Primary` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | View=Day · Week, Breakpoints=Large · Medium | `Text Color/Body/Primary` |

#### 4:00pm - 4:15pm

| Property | Condition | Token |
|---|---|---|
| fill | View=Day · Week, Breakpoints=Large · Medium | `Text Color/Body/Primary` |

#### line

| Property | Condition | Token |
|---|---|---|
| fill | View=Week, Breakpoints=Large · Medium | `Background/Semantic/Status → Error` |

#### pointer

| Property | Condition | Token |
|---|---|---|
| fill | View=Week, Breakpoints=Large · Medium | `Background/Semantic/Status → Error` |

#### 10 November, 2023

| Property | Condition | Token |
|---|---|---|
| fill | View=Day, Breakpoints=Large · Medium | `Text Color/Body/Primary` |

#### Ellipse 1528

| Property | Condition | Token |
|---|---|---|
| fill | View=Day, Breakpoints=Large · Medium | `Background/Semantic/Status → Error` |

#### Rectangle 7328

| Property | Condition | Token |
|---|---|---|
| fill | View=Day, Breakpoints=Large · Medium | `Background/Semantic/Status → Error` |

#### Select

| Property | Condition | Token |
|---|---|---|
| fill | Breakpoints=Medium | `Background/Surface/Primary` |
| border | Breakpoints=Medium | `Border Color/Input Field/Input Field` |

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Breakpoints=Medium | `Text Color/Body/Primary` |

#### M

| Property | Condition | Token |
|---|---|---|
| fill | View=Day · Week, Breakpoints=Small | `Text Color/Action/Link` |
| fill | View=Day · Week, Breakpoints=Small | `Text Color/Body/Secondary` |

#### selected bg

| Property | Condition | Token |
|---|---|---|
| fill | View=Day · Week, Breakpoints=Small | `Background/Semantic/Status → Informational` |

#### Wednesday, Nov 12, 2023

| Property | Condition | Token |
|---|---|---|
| fill | View=Day · Week, Breakpoints=Small | `Text Color/Body/Primary` |

#### Button Group

| Property | Condition | Token |
|---|---|---|
| border | View=Month, Breakpoints=Small | `Border Color/Action/Secondary Button (Default)` |

#### Action 1

| Property | Condition | Token |
|---|---|---|
| fill | View=Month, Breakpoints=Small | `Background/Action/Action Secondary` |
| border | View=Month, Breakpoints=Small | `Border Color/Action/Secondary Button (Default)` |

#### Action 2

| Property | Condition | Token |
|---|---|---|
| fill | View=Month, Breakpoints=Small | `Background/Action/Action Secondary` |
| border | View=Month, Breakpoints=Small | `Border Color/Action/Secondary Button (Default)` |

#### Action 3

| Property | Condition | Token |
|---|---|---|
| fill | View=Month, Breakpoints=Small | `Background/Action/Action Secondary` |
| border | View=Month, Breakpoints=Small | `Border Color/Action/Secondary Button (Default)` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| Switch Panel | border | `Border Color/Divider/Divider` |
| All Day Event | fill | `Background/Accent2 → Tertiary` |
| Holiday | fill | `Text Color/Body/Black` |
| Button (Link) | fill | `Background/Transparent` |
| Event Name - Random Name | fill | `Text Color/Body/Primary` |
| Scroll Bar | fill | `Background/Surface/Brand` |
| Scroll Bar | border | `Border Color/Chip/Disabled` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | View=Month | `[ARCHIVE]/*Mobile/Field Label Extra Small (Emphasized)` |
| Label | typography | Breakpoints=Large | `Value/S` |
| Label | typography | Breakpoints=Large · Medium | `Action/S` |
| Label | typography | View=Week · Month, Breakpoints=Large | `[ARCHIVE]/*Mobile/Field Label Small` |
| Label | typography | Breakpoints=Small | `Action/M` |
| Label | typography | View=Month, Breakpoints=Small | `Action/S` |
| November, 2023 | typography | View=Month, Breakpoints=Large · Medium | `[ARCHIVE]/*Mobile/Field Label` |
| Mon | typography | Breakpoints=Large · Medium | `[ARCHIVE]/*Mobile/Field Label Small (Emphasized)` |
| Mon | typography | Breakpoints=Small | `[ARCHIVE]/*Mobile/Field Label Extra Small` |
| 14 | typography | View=Month | `[ARCHIVE]/*Mobile/Field Label Extra Small (Emphasized)` |
| 14 | typography | View=Month, Breakpoints=Large · Medium | `[ARCHIVE]/*Mobile/Field Label Small` |
| 14 | typography | View=Day · Week, Breakpoints=Large · Medium | `[ARCHIVE]/*Mobile/Field Label Large` |
| 14 | typography | View=Day · Week, Breakpoints=Small | `[ARCHIVE]/*Mobile/Field Label` |
| 14 | typography | View=Month, Breakpoints=Small | `[ARCHIVE]/*Mobile/Field Label Extra Small` |
| Holiday | typography | — | `[ARCHIVE]/*Mobile/Field Label Extra Small (Emphasized)` |
| 10:00am Event Name - Random Name | typography | View=Month, Breakpoints=Large · Medium | `[ARCHIVE]/*Mobile/Field Label Extra Small` |
| Dec | typography | View=Month, Breakpoints=Large · Medium | `[ARCHIVE]/*Mobile/Field Label Small` |
| Dec | typography | View=Month, Breakpoints=Small | `[ARCHIVE]/*Mobile/Field Label Extra Small` |
| 9 November - 15 November, 2023 | typography | View=Week, Breakpoints=Large · Medium | `[ARCHIVE]/*Mobile/Field Label` |
| 24 | typography | View=Day · Week | `[ARCHIVE]/*Mobile/Field Label Small` |
| PM | typography | View=Day · Week | `[ARCHIVE]/*Mobile/Field Label Small` |
| Event Name - Random Name | typography | — | `[ARCHIVE]/*Mobile/Field Label Extra Small (Emphasized)` |
| 4:00pm - 4:15pm | typography | View=Day · Week, Breakpoints=Large · Medium | `[ARCHIVE]/*Mobile/Field Label Extra Small` |
| 10 November, 2023 | typography | View=Day, Breakpoints=Large · Medium | `[ARCHIVE]/*Mobile/Field Label` |
| Placeholder | typography | Breakpoints=Medium | `Value/S` |
| M | typography | View=Day · Week, Breakpoints=Small | `[ARCHIVE]/*Mobile/Field Label Extra Small` |
| Wednesday, Nov 12, 2023 | typography | View=Day · Week, Breakpoints=Small | `[ARCHIVE]/*Mobile/Field Label` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | Breakpoints=Large · Medium | `rounded-8` |
| Button | padding-x | Breakpoints=Large · Medium | `size-16` |
| Button Icon | border-radius | — | `rounded-8` |
| Segment Control | border-radius | Breakpoints=Large | `rounded-8` |
| .segmentedControlLabel Wrapper new | effects | Breakpoints=Large | `Segmented Control` |
| Button Group | border-radius | View=Month, Breakpoints=Small | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Calendar Switch Panel](./calendar-switch-panel.md)

## Extraction gaps

- **Switch Panel**: hardcoded itemSpacing (16px)
- **Switch Panel**: hardcoded padding
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
- **Month View**: hardcoded cornerRadius (12px)
- **.calendarColTitle**: hardcoded itemSpacing (8px)
- **.calendarColTitle**: hardcoded padding
- **Date**: hardcoded itemSpacing (2px)
- **Date**: hardcoded padding
- **.calendarMonthDate**: hardcoded itemSpacing (10px)
- **Date**: hardcoded cornerRadius (9999px)
- **Month Events**: hardcoded itemSpacing (2px)
- **Month Events**: hardcoded padding
- **.calendarAllDayEvent**: hardcoded itemSpacing (10px)
- **All Day Event**: hardcoded cornerRadius (2px)
- **All Day Event**: hardcoded padding
- **Events**: hardcoded itemSpacing (2px)
- **Event 1**: hardcoded itemSpacing (2px)
- **Event 1**: hardcoded cornerRadius (4px)
- **Event 1**: hardcoded padding
- **Event Type**: hardcoded padding
- **Change Color Here**: hardcoded itemSpacing (10px)
- **Change Color Here**: hardcoded cornerRadius (9999px)
- **Repeat**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Event 2**: hardcoded itemSpacing (2px)
- **Event 2**: hardcoded cornerRadius (4px)
- **Event 2**: hardcoded padding
- **Event 3**: hardcoded itemSpacing (2px)
- **Event 3**: hardcoded cornerRadius (4px)
- **Event 3**: hardcoded padding
- **Event 4**: hardcoded itemSpacing (2px)
- **Event 4**: hardcoded cornerRadius (4px)
- **Event 4**: hardcoded padding
- **View More**: hardcoded padding
- **Button (Link)**: hardcoded itemSpacing (4px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
- **Divider**: hardcoded padding
