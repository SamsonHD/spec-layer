---
spec_version: "0.1"
component:
  name: Calendar Group Event Preview Popover
  figma_key: 292959a4fc74fecfc7411b61a0e73113cd440ded
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 14762:16903
content_hash: 6257d6652d0bb74f90de4f4f38d7de517efd53a4fe4d160c21dcd89d3dad1dac
extracted_at: 2026-06-14T10:05:04.427Z
---

## Definition

_To be written._

## Anatomy

1. Content Wrapper
2. .Popover Pointer (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| 👁️ Event 6 | boolean | true / false | true |
| 👁️ Event 5 | boolean | true / false | true |
| 👁️ Event 4 | boolean | true / false | true |
| 👁️ Event 3 | boolean | true / false | true |
| 👁️ Event 2 | boolean | true / false | true |
| Group Date | text | — | 10 Nov 2023 |
| 👁️ Event 1 | boolean | true / false | true |
| 👁️ Customized Items | boolean | true / false | true |
| Item 1 | boolean | true / false | true |
| Item 2 | boolean | true / false | true |
| Item 3 | boolean | true / false | true |
| Item 4 | boolean | true / false | true |
| Item 5 | boolean | true / false | false |
| Item 6 | boolean | true / false | false |
| Item 7 | boolean | true / false | false |
| Item 8 | boolean | true / false | false |
| Title | text | — | Design Sync Up |
| Event Date | text | — | Tuesday, 10 Nov 2023 |
| Time | text | — | 6:30pm - 7:30pm |
| Recurrence | text | — | Repeat every 2 weeks on Thursday |
| 👁️  All Day Event | boolean | true / false | false |
| 👁️ Recurrence | boolean | true / false | true |

## Variants

- **Type**: Group Event (default)
- **Modifiers**: Expanded

## States

- Default

## Tokens used

### Color

#### Change Color Here

| Property | Condition | Token |
|---|---|---|
| fill | — | `Accent/accent-15` |
| fill | Expanded=True | `Background/Accent6 → Primary` |

#### Event 4

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Background/Surface/Primary` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | Expanded=True | `Border Color/Action/Action` |

#### Rectangle 7235

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Background/Divider/Divider` |

#### Edit Btn

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Background/Action/Action Tertiary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Text Color/Body/Primary` |

#### Delete Btn

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Background/Action/Action Tertiary` |

#### More Btn

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Background/Action/Action Tertiary` |

#### Design Sync Up

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Text Color/Body/Primary` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Text Color/Body/Secondary` |

#### Tuesday, 10 Nov 2023

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Text Color/Body/Primary` |

#### 6:30pm - 7:30pm

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Text Color/Body/Primary` |

#### Repeat every 2 weeks on Thursday

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Text Color/Body/Primary` |

#### Magna aliqua office

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Text Color/Body/Primary` |

#### More invitees

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Background/Action/Action Quaternary` |

#### 8+

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Text Color/Body/Primary` |

#### Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=True | `Text Color/Body/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Content Wrapper | fill | `Background/Surface/Primary` |
| Content Wrapper | border | `Border Color/Input Field/Input Field` |
| 10 Nov 2023 | fill | `Text Color/Body/Primary` |
| Cover | fill | `Background/Surface/Primary` |
| 10:00am Event Name - Random Name | fill | `Text Color/Body/Primary` |
| Union | fill | `Background/Surface/Primary` |
| shape | fill | `Background/Surface/Primary` |
| Popover Pointer | fill | `Background/Surface/Primary` |
| Subtract | fill | `Border Color/Input Field/Input Field` |
| Popover Pointer (Stroke) | fill | `Border Color/Input Field/Input Field` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| 10 Nov 2023 | typography | — | `[ARCHIVE]/*Mobile/Field Label` |
| 10:00am Event Name - Random Name | typography | — | `[ARCHIVE]/*Mobile/Field Label Extra Small` |
| Design Sync Up | typography | Expanded=True | `[ARCHIVE]/*Mobile/Heading5` |
| Tuesday, 10 Nov 2023 | typography | Expanded=True | `[ARCHIVE]/Footnote1/Long` |
| 6:30pm - 7:30pm | typography | Expanded=True | `[ARCHIVE]/Footnote1/Long` |
| Repeat every 2 weeks on Thursday | typography | Expanded=True | `[ARCHIVE]/Footnote1/Long` |
| Magna aliqua office | typography | Expanded=True | `[ARCHIVE]/Footnote1/Long` |
| 8+ | typography | Expanded=True | `[ARCHIVE]/*Tablet Portrait/Paragraph2/Short` |
| Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. | typography | Expanded=True | `[ARCHIVE]/Footnote1/Long` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | effects | — | `Shadows/Popover` |
| Container | effects | — | `Shadows/Popover/0/color` |
| Container | effects | — | `Shadows/Popover/0/offsetX` |
| Container | effects | — | `Shadows/Popover/0/offsetY` |
| Container | effects | — | `Shadows/Popover/0/radius` |
| Container | effects | — | `Shadows/Popover/0/spread` |
| Container | effects | — | `Shadows/Popover/1/color` |
| Container | effects | — | `Shadows/Popover/1/offsetX` |
| Container | effects | — | `Shadows/Popover/1/offsetY` |
| Container | effects | — | `Shadows/Popover/1/radius` |
| Container | effects | — | `Shadows/Popover/1/spread` |
| Container | effects | — | `Shadows/Popover/2/color` |
| Container | effects | — | `Shadows/Popover/2/offsetX` |
| Container | effects | — | `Shadows/Popover/2/offsetY` |
| Container | effects | — | `Shadows/Popover/2/radius` |
| Container | effects | — | `Shadows/Popover/2/spread` |
| Content Wrapper | effects | — | `light/Shadow/Popover` |
| Edit Btn | border-radius | Expanded=True | `rounded-8` |
| Delete Btn | border-radius | Expanded=True | `rounded-8` |
| More Btn | border-radius | Expanded=True | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.Popover Pointer](./popover-pointer.md)

## Extraction gaps

- **Container**: hardcoded cornerRadius (8px)
- **Content Wrapper**: hardcoded cornerRadius (8px)
- **Events Goup**: hardcoded itemSpacing (8px)
- **Events Goup**: hardcoded padding
- **Title**: hardcoded itemSpacing (8px)
- **Title**: hardcoded padding
- **.calendarAllDayEvent**: hardcoded itemSpacing (10px)
- **All Day Event**: hardcoded cornerRadius (2px)
- **All Day Event**: hardcoded padding
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
- **Event 5**: hardcoded itemSpacing (2px)
- **Event 5**: hardcoded cornerRadius (4px)
- **Event 5**: hardcoded padding
- **Event 6**: hardcoded itemSpacing (2px)
- **Event 6**: hardcoded cornerRadius (4px)
- **Event 6**: hardcoded padding
- **Union**: hardcoded color (no variable or style)
- **Rectangle 7269**: hardcoded color (no variable or style)
- **Rectangle 7270**: hardcoded color (no variable or style)
- **Rectangle 7271**: hardcoded color (no variable or style)
- **Rectangle 7272**: hardcoded color (no variable or style)
