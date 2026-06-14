---
spec_version: "0.1"
component:
  name: Calendar Single Event Preview Popover
  figma_key: 26ccf604b0162f747a4baf315f0aec492855d4cf
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 14762:16964
content_hash: 76faf31d262b0adf93b616355504c7be66bb985a163e2dbad5be2ed55242dc2d
extracted_at: 2026-06-14T10:05:04.431Z
---

## Definition

_To be written._

## Anatomy

1. Content Wrapper
2. .Popover Pointer (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Item 1 | boolean | true / false | true |
| Item 2 | boolean | true / false | true |
| Item 3 | boolean | true / false | true |
| Item 4 | boolean | true / false | true |
| Item 5 | boolean | true / false | false |
| Item 6 | boolean | true / false | false |
| Item 7 | boolean | true / false | false |
| Item 8 | boolean | true / false | false |
| 👁️ Customized Items | boolean | true / false | true |
| 👁️ Delete Btn | boolean | true / false | true |
| 👁️ Edit Btn | boolean | true / false | true |
| 👁️ More Btn | boolean | true / false | true |
| 👁️ Recurrence | boolean | true / false | true |
| Title | text | — | Excepteur sint occaecat cupidatat non proident |
| Date | text | — | Thursday, Dec 27 2023 |
| Time | text | — | 10:30am - 11:30am |
| Recurrence | text | — | Repeat every 2 weeks on Thursday |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Content Wrapper | fill | `Background/Surface/Primary` |
| Content Wrapper | border | `Border Color/Input Field/Input Field` |
| Edit Btn | fill | `Background/Action/Action Tertiary` |
| icon | fill | `Text Color/Body/Primary` |
| Delete Btn | fill | `Background/Action/Action Tertiary` |
| More Btn | fill | `Background/Action/Action Tertiary` |
| Close Btn | fill | `Background/Action/Action Tertiary` |
| Change Color Here | fill | `Background/Accent6 → Primary` |
| Cover | fill | `Background/Surface/Primary` |
| Excepteur sint occaecat cupidatat non proident | fill | `Text Color/Body/Primary` |
| Vector | fill | `Text Color/Body/Secondary` |
| Thursday, Dec 27 2023 | fill | `Text Color/Body/Primary` |
| 10:30am - 11:30am | fill | `Text Color/Body/Primary` |
| Repeat every 2 weeks on Thursday | fill | `Text Color/Body/Primary` |
| Rectangle 7235 | fill | `Background/Divider/Divider` |
| Magna aliqua office | fill | `Text Color/Body/Primary` |
| More invitees | fill | `Background/Action/Action Quaternary` |
| 8+ | fill | `Text Color/Body/Primary` |
| Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. | fill | `Text Color/Body/Primary` |
| Popover Pointer | fill | `Background/Surface/Primary` |
| Subtract | fill | `Border Color/Input Field/Input Field` |
| Popover Pointer (Stroke) | fill | `Border Color/Input Field/Input Field` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Excepteur sint occaecat cupidatat non proident | typography | — | `[ARCHIVE]/*Mobile/Heading5` |
| Thursday, Dec 27 2023 | typography | — | `[ARCHIVE]/Footnote1/Long` |
| 10:30am - 11:30am | typography | — | `[ARCHIVE]/Footnote1/Long` |
| Repeat every 2 weeks on Thursday | typography | — | `[ARCHIVE]/Footnote1/Long` |
| Magna aliqua office | typography | — | `[ARCHIVE]/Footnote1/Long` |
| 8+ | typography | — | `[ARCHIVE]/*Tablet Portrait/Paragraph2/Short` |
| Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. | typography | — | `[ARCHIVE]/Footnote1/Long` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/0/color` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/0/offsetX` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/0/offsetY` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/0/radius` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/0/spread` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/1/color` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/1/offsetX` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/1/offsetY` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/1/radius` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/1/spread` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/2/color` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/2/offsetX` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/2/offsetY` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/2/radius` |
| Calendar Single Event Preview Popover | effects | — | `Shadows/Popover/2/spread` |
| Content Wrapper | effects | — | `light/Shadow/Popover` |
| Edit Btn | border-radius | — | `rounded-8` |
| Delete Btn | border-radius | — | `rounded-8` |
| More Btn | border-radius | — | `rounded-8` |
| Close Btn | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.Popover Pointer](./popover-pointer.md)

## Extraction gaps

- **Calendar Single Event Preview Popover**: hardcoded cornerRadius (8px)
- **Content Wrapper**: hardcoded cornerRadius (8px)
- **Actions**: hardcoded padding
- **Edit Btn**: hardcoded itemSpacing (10px)
- **Edit Btn**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Delete Btn**: hardcoded itemSpacing (10px)
- **Delete Btn**: hardcoded padding
- **More Btn**: hardcoded itemSpacing (10px)
- **More Btn**: hardcoded padding
- **Close Btn**: hardcoded itemSpacing (10px)
- **Close Btn**: hardcoded padding
- **Event Details**: hardcoded itemSpacing (16px)
- **Event Details**: hardcoded padding
- **Title**: hardcoded itemSpacing (12px)
- **Icon**: hardcoded itemSpacing (10px)
- **Icon**: hardcoded padding
- **.calendarEventIndicator**: hardcoded padding
- **Change Color Here**: hardcoded itemSpacing (10px)
- **Change Color Here**: hardcoded cornerRadius (9999px)
- **Time**: hardcoded itemSpacing (12px)
- **Clock Four**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Time**: hardcoded itemSpacing (4px)
- **Event time**: hardcoded itemSpacing (8px)
- **Repeat time**: hardcoded itemSpacing (20px)
- **Customized Items**: hardcoded itemSpacing (16px)
- **Item 1**: hardcoded itemSpacing (10px)
- **Divider**: hardcoded itemSpacing (10px)
- **Item 2**: hardcoded itemSpacing (12px)
- **Map Marker Alt**: hardcoded color (no variable or style)
- **Location**: hardcoded itemSpacing (4px)
- **Item 3**: hardcoded itemSpacing (12px)
- **Calendar Circle User**: hardcoded color (no variable or style)
- **Avatar**: hardcoded itemSpacing (4px)
- **Avatar**: hardcoded cornerRadius (9999px)
- **Photo**: hardcoded itemSpacing (8px)
- **Photo**: hardcoded cornerRadius (9999px)
- **Status Badge**: hardcoded cornerRadius (100px)
- **.avatarPhoto**: hardcoded itemSpacing (8px)
- **.avatarPhoto**: hardcoded cornerRadius (9999px)
- **More invitees**: hardcoded itemSpacing (10px)
- **More invitees**: hardcoded cornerRadius (9999px)
- **Item 4**: hardcoded itemSpacing (12px)
- **Message Lines**: hardcoded color (no variable or style)
- **Notes**: hardcoded itemSpacing (4px)
- **Item 5**: hardcoded itemSpacing (12px)
- **Slot/Replace Me**: hardcoded color (no variable or style)
- **Slot/Replace Me**: hardcoded padding
- **Replace Me**: hardcoded color (no variable or style)
- **Item 6**: hardcoded itemSpacing (12px)
- **Item 7**: hardcoded itemSpacing (12px)
- **Item 8**: hardcoded itemSpacing (12px)
- **Union**: hardcoded color (no variable or style)
- **Rectangle 7269**: hardcoded color (no variable or style)
- **Rectangle 7270**: hardcoded color (no variable or style)
- **Rectangle 7271**: hardcoded color (no variable or style)
- **Rectangle 7272**: hardcoded color (no variable or style)
