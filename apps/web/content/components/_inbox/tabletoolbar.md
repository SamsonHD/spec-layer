---
spec_version: "0.1"
component:
  name: tableToolbar
  figma_key: d1c23f57216836719fe2be4ff18284f1f950d758
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 15010:20924
content_hash: b80114f1d4a21c5a507cf85affe83702a6f0e94390071b34eb9864ac70c9759b
extracted_at: 2026-06-14T10:05:04.245Z
---

## Definition

_To be written._

## Anatomy

1. Button (component)
2. Left
3. Spacer
4. Right

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Left Group | boolean | true / false | true |
| Right Group | boolean | true / false | true |
| Left Button | boolean | true / false | true |
| Right Button | boolean | true / false | false |
| Overflow | boolean | true / false | false |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Button | fill | `Background/Action/Action` |
| icon | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/White` |
| Label | fill | `Text Color/Action/On Action` |
| Label | fill | `Text Color/Body/Primary` |
| Action 1 | border | `Background/Divider/Divider Secondary` |
| Action 2 | border | `Background/Divider/Divider Secondary` |
| Action 3 | border | `Background/Divider/Divider Secondary` |
| Action 4 | border | `Background/Divider/Divider Secondary` |
| Input | fill | `Background/Surface/Primary` |
| Input | border | `Border Color/Input Field/Input Field` |
| Vector | fill | `Text Color/Body/Secondary` |
| Placeholder | fill | `Text Color/Input/Input Placeholder` |
| Ellipse 1 | border | `Text Color/Body/Primary` |
| Ellipse 2 | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Action/S` |
| Label | typography | — | `[ARCHIVE]/*Mobile/Field Label Small` |
| Placeholder | typography | — | `Value/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | — | `rounded-8` |
| Button | padding-x | — | `size-16` |
| Button Group | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Button](./button.md)

## Extraction gaps

- **tableToolbar**: hardcoded itemSpacing (12px)
- **Toolbar Wrapper**: hardcoded itemSpacing (20px)
- **Button**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Left**: hardcoded itemSpacing (20px)
- **❖ Left Grouping**: hardcoded itemSpacing (20px)
- **❖ Left Grouping**: hardcoded padding
- **↳ Position 1**: hardcoded color (no variable or style)
- **Action 1**: hardcoded itemSpacing (8px)
- **Action 1**: hardcoded padding
- **Action 2**: hardcoded itemSpacing (8px)
- **Action 2**: hardcoded padding
- **Action 3**: hardcoded itemSpacing (8px)
- **Action 3**: hardcoded padding
- **Action 4**: hardcoded itemSpacing (8px)
- **Action 4**: hardcoded padding
- **Action 5**: hardcoded itemSpacing (8px)
- **Action 5**: hardcoded padding
- **Action 6**: hardcoded itemSpacing (8px)
- **Action 6**: hardcoded padding
- **.buttonGroupItem**: hardcoded itemSpacing (8px)
- **.buttonGroupItem**: hardcoded padding
- **↳ Position 2**: hardcoded color (no variable or style)
- **Input Field for Table**: hardcoded color (no variable or style)
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (4px)
- **Input**: hardcoded padding
- **Search**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Xmark Large**: hardcoded color (no variable or style)
- **↳ Position 3**: hardcoded itemSpacing (4px)
- **Right**: hardcoded itemSpacing (20px)
- **❖ Right Grouping**: hardcoded itemSpacing (20px)
- **❖ Right Grouping**: hardcoded padding
- **↳ Position 3**: hardcoded color (no variable or style)
