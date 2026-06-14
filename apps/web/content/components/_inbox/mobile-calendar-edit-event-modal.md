---
spec_version: "0.1"
component:
  name: Mobile Calendar Edit Event Modal
  figma_key: 14ca61bd912e3c65c264da3c939c0d1f8b20c4a3
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 16793:48306
content_hash: 945eefc975564cfb245755c5700d268670937f572fb5083e7f569b1cfbfc3006
extracted_at: 2026-06-14T10:05:04.403Z
---

## Definition

_To be written._

## Anatomy

1. .mobileCalendarPageHeader (component)
2. General Modual

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Item 7 | boolean | true / false | false |
| Item 8 | boolean | true / false | false |
| Item 5 | boolean | true / false | false |
| Item 6 | boolean | true / false | false |
| Item 3 | boolean | true / false | true |
| Item 2 | boolean | true / false | true |
| Item 4 | boolean | true / false | false |
| Item 1 | boolean | true / false | true |
| 👁️ Customized Fields | boolean | true / false | false |
| 👁️ Event Color | boolean | true / false | true |

## Variants

- **Page**: Edit Event (default) · Edit Recurrence
- **Modifiers**: All Day Event · Custom Recurrence

## States

- Default

## Tokens used

### Color

#### Button (Link)

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Event | `Background/Transparent` |

#### Label

| Property | Edit Event | Edit Recurrence |
|---|---|---|
| fill | `Text Color/Action/Default` · `Text Color/Body/Primary` · `Text Color/Semantic/Danger Link` | `Text Color/Body/Primary` |

**When Custom Recurrence = True**

| Property | Edit Event | Edit Recurrence |
|---|---|---|
| fill | `Text Color/Action/Default` · `Text Color/Body/Primary` · `Text Color/Semantic/Danger Link` · `Text Color/Action/On Action` | `Text Color/Action/On Action` · `Text Color/Body/Primary` |

#### icon

| Property | Edit Event | Edit Recurrence |
|---|---|---|
| fill | `Text Color/Body/Primary` · `Text Color/Body/Secondary` · `Text Color/Semantic/Danger Link` | `Text Color/Body/Primary` · `Text Color/Body/Secondary` |

**When Custom Recurrence = True**

| Property | Edit Event | Edit Recurrence |
|---|---|---|
| fill | `Text Color/Body/Primary` · `Text Color/Body/Secondary` · `Text Color/Semantic/Danger Link` · `Text Color/Body/White` | `Text Color/Body/White` · `Text Color/Body/Primary` · `Text Color/Body/Secondary` |

#### Event Color

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Event | `Background/Surface/Secondary` |

#### Color Swatch

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Event | `Background/Accent6 → Primary` |
| border | Page=Edit Event | `Border Color/Action/Secondary Button (Disabled)` |

#### Picker

| Property | Condition | Token |
|---|---|---|
| fill | All Day Event=False, Page=Edit Event | `Background/Surface/Primary` |
| border | All Day Event=False, Page=Edit Event | `Border Color/Input Field/Input Field` |

#### Optional

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Event | `Text Color/Body/Secondary` |

#### Required*

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Event | `Text Color/Semantic/Error` |

#### Date Range Picker

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Event | `Background/Surface/Primary` |
| border | Page=Edit Event | `Border Color/Input Field/Input Field` |

#### Start Date Input

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Event | `Background/Transparent` |

#### Start Date Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Event | `Text Color/Body/Primary` |

#### divider

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Event | `Background/Divider/Divider` |

#### End Date Input

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Event | `Background/Transparent` |

#### End Date Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Event | `Text Color/Body/Primary` |

#### Hint

| Property | Condition | Token |
|---|---|---|
| fill | All Day Event=False, Page=Edit Event | `Text Color/Body/Secondary` |

#### Check Wrapper

| Property | Edit Event | Edit Recurrence |
|---|---|---|
| fill | `Background/Surface/Primary` | — |
| border | `Border Color/Input Field/Input Field` | — |

**When All Day Event = True**

| Property | Token |
|---|---|
| fill | `Background/Action/Action` |
| border | `Border Color/Action/Action` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Event | `Text Color/Body/Inverted → Primary` |
| fill | All Day Event=True | `Text Color/Body/Secondary` |

#### Button

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Event | `Background/Action/Action Secondary` |
| fill | Custom Recurrence=True | `Background/Action/Action` |
| border | Page=Edit Event | `Border Color/Semantic/Danger` |

#### Back Btn

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Recurrence | `Background/Action/Action Tertiary` |

#### Repeat every

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Recurrence | `Text Color/Body/Primary` |

#### On

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Recurrence | `Text Color/Body/Primary` |

#### Selection Chip

| Property | Edit Event | Edit Recurrence |
|---|---|---|
| fill | — | `Background/Tile/Tile` · `Background/Tile/Tile - Selected` |
| border | — | `Border Color/Tile/Tile` · `Border Color/Tile/Tile Selected` |

#### Ends

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Recurrence | `Text Color/Body/Primary` |

#### occurrences

| Property | Condition | Token |
|---|---|---|
| fill | Page=Edit Recurrence | `Text Color/Body/Primary` |

#### Recurrence Summary

| Property | Condition | Token |
|---|---|---|
| fill | Custom Recurrence=True | `Background/Surface/Quaternary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| New Event | fill | `Text Color/Body/Primary` |
| Input | fill | `Background/Surface/Primary` |
| Input | border | `Border Color/Input Field/Input Field` |
| Text Content | fill | `Text Color/Body/Primary` |
| Placeholder | fill | `Text Color/Body/Primary` |
| Select | fill | `Background/Surface/Primary` |
| Select | border | `Border Color/Input Field/Input Field` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Page=Edit Event | `Action/M` |
| Label | typography | Page=Edit Event | `Label/S` |
| Label | typography | Page=Edit Event | `Value/M` |
| Label | typography | All Day Event=True | `Label/M` |
| Label | typography | Custom Recurrence=True | `Action/S` |
| Label | typography | Page=Edit Recurrence | `Chip/M` |
| Label | typography | Page=Edit Recurrence | `Label/S` |
| New Event | typography | — | `[ARCHIVE]/*Mobile/Heading6` |
| Text Content | typography | — | `Value/S` |
| Placeholder | typography | — | `Value/S` |
| Placeholder | typography | Custom Recurrence=True | `[ARCHIVE]/*Mobile/Field Label` |
| Optional | typography | All Day Event=False, Page=Edit Event | `Label/S` |
| Optional | typography | All Day Event=True | `[ARCHIVE]/*Mobile/Field Label` |
| Required* | typography | All Day Event=False, Page=Edit Event | `Label/S` |
| Required* | typography | All Day Event=True | `[ARCHIVE]/*Mobile/Field Label` |
| Start Date Placeholder | typography | All Day Event=False, Page=Edit Event | `Value/M` |
| Start Date Placeholder | typography | All Day Event=True | `[ARCHIVE]/*Mobile/Input Field Value` |
| End Date Placeholder | typography | All Day Event=False, Page=Edit Event | `Value/M` |
| End Date Placeholder | typography | All Day Event=True | `[ARCHIVE]/*Mobile/Input Field Value` |
| Hint | font-size | All Day Event=False, Page=Edit Event | `font-size/fs-150` |
| Hint | font-family | All Day Event=False, Page=Edit Event | `font-family/font-family` |
| Hint | line-height | All Day Event=False, Page=Edit Event | `line-height/lh-250` |
| Hint | font-weight | All Day Event=False, Page=Edit Event | `font-weight/fw-400` |
| Repeat every | typography | Page=Edit Recurrence | `[ARCHIVE]/*Mobile/Field Label` |
| On | typography | Page=Edit Recurrence | `[ARCHIVE]/*Mobile/Field Label` |
| Ends | typography | Page=Edit Recurrence | `[ARCHIVE]/*Mobile/Field Label` |
| occurrences | typography | Page=Edit Recurrence | `[ARCHIVE]/*Tablet Portrait/Paragraph2/Short` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Color Swatch | border-radius | Page=Edit Event | `rounded-8` |
| Button | border-radius | Page=Edit Event | `rounded-8` |
| Button | padding-x | Custom Recurrence=True | `size-16` |
| Back Btn | border-radius | Page=Edit Recurrence | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.mobileCalendarPageHeader](./mobilecalendarpageheader.md)

## Extraction gaps

- **Left Link Btn**: hardcoded itemSpacing (10px)
- **Left Link Btn**: hardcoded padding
- **Button (Link)**: hardcoded itemSpacing (8px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Back Btn**: hardcoded itemSpacing (10px)
- **Back Btn**: hardcoded padding
- **More Btn**: hardcoded itemSpacing (10px)
- **More Btn**: hardcoded padding
- **Label**: hardcoded itemSpacing (8px)
- **Caret Down**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Right Link Btn**: hardcoded itemSpacing (10px)
- **Right Link Btn**: hardcoded padding
- **General Modual**: hardcoded itemSpacing (24px)
- **General Modual**: hardcoded padding
- **Title**: hardcoded itemSpacing (16px)
- **Input Field**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded padding
- **Label Wrapper**: hardcoded itemSpacing (2px)
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Event Color**: hardcoded itemSpacing (8px)
- **Event Color**: hardcoded cornerRadius (8px)
- **Date Picker**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Picker**: hardcoded itemSpacing (8px)
- **Picker**: hardcoded cornerRadius (8px)
- **Picker**: hardcoded padding
- **Time Range Picker**: hardcoded color (no variable or style)
- **Date Range Picker**: hardcoded cornerRadius (8px)
- **Start Date Input**: hardcoded itemSpacing (8px)
- **Start Date Input**: hardcoded cornerRadius (8px)
- **Start Date Input**: hardcoded padding
- **End Date Input**: hardcoded itemSpacing (8px)
- **End Date Input**: hardcoded cornerRadius (8px)
- **End Date Input**: hardcoded padding
- **Checkbox**: hardcoded color (no variable or style)
- **Checkbox**: hardcoded itemSpacing (8px)
- **Check Wrapper**: hardcoded cornerRadius (4px)
- **Check**: hardcoded color (no variable or style)
- **Recurrence**: hardcoded itemSpacing (12px)
- **Select (Dropdown)**: hardcoded color (no variable or style)
- **Select**: hardcoded itemSpacing (8px)
- **Select**: hardcoded cornerRadius (8px)
- **Select**: hardcoded padding
- **Customized Fields**: hardcoded itemSpacing (24px)
- **Item 1**: hardcoded itemSpacing (16px)
- **Icon**: hardcoded itemSpacing (10px)
- **Icon**: hardcoded padding
- **Calendar Circle User**: hardcoded color (no variable or style)
- **ChipAction**: hardcoded itemSpacing (8px)
- **ChipAction**: hardcoded cornerRadius (9999px)
- **ChipAction**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **Item 2**: hardcoded itemSpacing (16px)
- **Map Marker Alt**: hardcoded color (no variable or style)
- **Location**: hardcoded itemSpacing (12px)
- **Toggle Switch**: hardcoded itemSpacing (8px)
- **Track**: hardcoded itemSpacing (10px)
- **Track**: hardcoded cornerRadius (9999px)
- **Track**: hardcoded padding
- **Switch**: hardcoded cornerRadius (9999px)
- **Switch**: hardcoded padding
- **Frame 1**: hardcoded itemSpacing (4px)
- **Item 3**: hardcoded itemSpacing (16px)
- **Message Lines**: hardcoded color (no variable or style)
- **Character Counter**: hardcoded padding
- **character counter**: hardcoded cornerRadius (4px)
- **character counter**: hardcoded padding
- **container**: hardcoded color (no variable or style)
- **Item 4**: hardcoded itemSpacing (16px)
- **Slot/Replace Me**: hardcoded color (no variable or style)
- **Slot/Replace Me**: hardcoded padding
- **Replace Me**: hardcoded color (no variable or style)
- **Item 5**: hardcoded itemSpacing (16px)
- **Item 6**: hardcoded itemSpacing (16px)
- **Item 7**: hardcoded itemSpacing (16px)
- **Item 8**: hardcoded itemSpacing (16px)
- **Button**: hardcoded itemSpacing (8px)
- **Button**: hardcoded padding
