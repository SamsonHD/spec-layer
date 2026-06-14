---
spec_version: "0.1"
component:
  name: Calendar Edit Event Modal
  figma_key: 5589b870a8cba205f5a13e0d0cb9ef4c175077de
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 16681:31147
content_hash: 6aa862724902fbe13cc434b5b5957e26b3e13295ad6e700a56b1d293ae71a2eb
extracted_at: 2026-06-14T10:05:04.418Z
---

## Definition

_To be written._

## Anatomy

1. Header + Content
2. Footer Wrapper

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

- **Modifiers**: All Day Event · Custom Recurrence

## States

- Default

## Tokens used

### Color

#### Label

| Property | Token |
|---|---|
| fill | `Text Color/Action/On Action` · `Text Color/Action/On Secondary` · `Text Color/Body/Primary` · `Text Color/Semantic/Danger Link` |

**When Custom Recurrence = True**

| Property | Token |
|---|---|
| fill | `Text Color/Action/Default` |

#### Optional

| Property | Condition | Token |
|---|---|---|
| fill | All Day Event=False | `Text Color/Body/Secondary` |

#### Required*

| Property | Condition | Token |
|---|---|---|
| fill | All Day Event=False | `Text Color/Semantic/Error` |

#### Hint

| Property | Condition | Token |
|---|---|---|
| fill | All Day Event=False | `Text Color/Body/Secondary` |

#### Check Wrapper

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |
| border | `Border Color/Input Field/Input Field` |

**When All Day Event = True**

| Property | Token |
|---|---|
| fill | `Background/Action/Action` |
| border | `Border Color/Action/Action` |

#### Recurrence Edit

| Property | Condition | Token |
|---|---|---|
| fill | Custom Recurrence=True | `Background/Surface/Quaternary` |

#### Repeat every 2 weeks on Tuesday, Wednesday, Friday

| Property | Condition | Token |
|---|---|---|
| fill | Custom Recurrence=True | `Text Color/Body/Primary` |

#### Button (Link)

| Property | Condition | Token |
|---|---|---|
| fill | Custom Recurrence=True | `Background/Transparent` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| Header | fill | `Background/Surface/Primary` |
| Edit Event | fill | `Text Color/Body/Primary` |
| Vector | fill | `Text Color/Body/Inverted → Primary` |
| Vector | fill | `Text Color/Body/Secondary` |
| Input | fill | `Background/Surface/Primary` |
| Input | border | `Border Color/Input Field/Input Field` |
| icon | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Secondary` |
| icon | fill | `Text Color/Body/White` |
| icon | fill | `Text Color/Semantic/Danger Link` |
| Text Content | fill | `Text Color/Body/Primary` |
| Event Color | fill | `Background/Surface/Secondary` |
| Color Swatch | fill | `Background/Accent6 → Primary` |
| Color Swatch | border | `Border Color/Action/Secondary Button (Disabled)` |
| Picker | fill | `Background/Surface/Primary` |
| Picker | border | `Border Color/Input Field/Input Field` |
| Placeholder | fill | `Text Color/Body/Primary` |
| to | fill | `Text Color/Body/Primary` |
| Select | fill | `Background/Surface/Primary` |
| Select | border | `Border Color/Input Field/Input Field` |
| Button | fill | `Background/Action/Action Secondary` |
| Button | border | `Border Color/Semantic/Danger` |
| Secondary Button | fill | `Background/Action/Action Secondary` |
| Secondary Button | border | `Border Color/Action/Secondary Button (Default)` |
| Primary Button | fill | `Background/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Edit Event | typography | — | `[ARCHIVE]/*Desktop/Heading4` |
| Text Content | typography | — | `Value/S` |
| Label | typography | — | `Action/M` |
| Label | typography | — | `Label/S` |
| Label | typography | — | `Value/M` |
| Placeholder | typography | — | `Value/S` |
| Optional | typography | All Day Event=False | `Label/S` |
| Required* | typography | All Day Event=False | `Label/S` |
| Hint | font-size | All Day Event=False | `font-size/fs-150` |
| Hint | font-family | All Day Event=False | `font-family/font-family` |
| Hint | line-height | All Day Event=False | `line-height/lh-250` |
| Hint | font-weight | All Day Event=False | `font-weight/fw-400` |
| to | typography | — | `[ARCHIVE]/*Tablet Portrait/Paragraph2/Short` |
| Repeat every 2 weeks on Tuesday, Wednesday, Friday | typography | Custom Recurrence=True | `[ARCHIVE]/*Mobile/Field Label` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | effects | — | `Shadows/Modal` |
| Container | effects | — | `Shadows/Modal/0/color` |
| Container | effects | — | `Shadows/Modal/0/offsetX` |
| Container | effects | — | `Shadows/Modal/0/offsetY` |
| Container | effects | — | `Shadows/Modal/0/radius` |
| Container | effects | — | `Shadows/Modal/0/spread` |
| Container | effects | — | `Shadows/Modal/1/color` |
| Container | effects | — | `Shadows/Modal/1/offsetX` |
| Container | effects | — | `Shadows/Modal/1/offsetY` |
| Container | effects | — | `Shadows/Modal/1/radius` |
| Container | effects | — | `Shadows/Modal/1/spread` |
| Container | effects | — | `Shadows/Modal/2/color` |
| Container | effects | — | `Shadows/Modal/2/offsetX` |
| Container | effects | — | `Shadows/Modal/2/offsetY` |
| Container | effects | — | `Shadows/Modal/2/radius` |
| Container | effects | — | `Shadows/Modal/2/spread` |
| Color Swatch | border-radius | — | `rounded-8` |
| Button | border-radius | — | `rounded-8` |
| Secondary Button | border-radius | — | `rounded-8` |
| Primary Button | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded cornerRadius (12px)
- **Header**: hardcoded itemSpacing (16px)
- **Header**: hardcoded padding
- **Close Btn**: hardcoded itemSpacing (10px)
- **Close Btn**: hardcoded cornerRadius (9999px)
- **Close Btn**: hardcoded padding
- **Xmark Large**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **<spacer> size-32**: hardcoded color (no variable or style)
- **General Modual**: hardcoded itemSpacing (24px)
- **General Modual**: hardcoded padding
- **Title**: hardcoded itemSpacing (16px)
- **Input Field**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded padding
- **Label Wrapper**: hardcoded itemSpacing (2px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Event Color**: hardcoded itemSpacing (8px)
- **Event Color**: hardcoded cornerRadius (8px)
- **Date & Time**: hardcoded itemSpacing (16px)
- **Date Picker**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Picker**: hardcoded itemSpacing (8px)
- **Picker**: hardcoded cornerRadius (8px)
- **Picker**: hardcoded padding
- **Time Picker**: hardcoded color (no variable or style)
- **Repeat**: hardcoded itemSpacing (16px)
- **Checkbox**: hardcoded color (no variable or style)
- **Checkbox**: hardcoded itemSpacing (8px)
- **Check Wrapper**: hardcoded cornerRadius (4px)
- **Check**: hardcoded color (no variable or style)
- **Select (Dropdown)**: hardcoded color (no variable or style)
- **Select**: hardcoded itemSpacing (8px)
- **Select**: hardcoded cornerRadius (8px)
- **Select**: hardcoded padding
- **Repeat**: hardcoded itemSpacing (24px)
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
- **scroll bar**: hardcoded cornerRadius (9999px)
- **Footer**: hardcoded itemSpacing (24px)
- **Footer**: hardcoded padding
- **Button**: hardcoded itemSpacing (8px)
- **Button**: hardcoded padding
- **Buttons**: hardcoded itemSpacing (12px)
- **Secondary Button**: hardcoded itemSpacing (8px)
- **Secondary Button**: hardcoded padding
- **Primary Button**: hardcoded itemSpacing (8px)
- **Primary Button**: hardcoded padding
