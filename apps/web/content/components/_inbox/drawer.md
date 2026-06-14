---
spec_version: "0.1"
component:
  name: Drawer
  figma_key: 7d39d5ce35a004bbb9005b6990347ff1693d330b
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 11504:355795
content_hash: 7b815496432c21d344acffa6eb676c3ca9ef110021dd18c764e705b7442f69af
extracted_at: 2026-06-14T10:07:43.784Z
---

## Definition

_To be written._

## Anatomy

1. Drawer
2. Handle Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Header | boolean | true / false | true |
| Show Title | boolean | true / false | true |
| Title | text | — | Title |
| Left Action | boolean | true / false | true |
| Right Action | boolean | true / false | true |
| Content Slot | instanceSwap | — | 5507:362804 |

## Variants

- **Modifiers**: Open · Scrolls

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| fill | Open=True | `Background/Backdrop/Backdrop → Popover` |

#### scroll bar

| Property | Condition | Token |
|---|---|---|
| fill | Scrolls=True | `Background/Semantic/Status → Informational` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Drawer | fill | `Background/Surface/Primary` |
| Button (Link) | fill | `Background/Transparent` |
| Label | fill | `Text Color/Action/Default` |
| Title | fill | `Text Color/Body/Primary` |
| Handle Bar | fill | `Background/Divider/Divider Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Action/M` |
| Title | typography | — | `[ARCHIVE]/*Mobile/Heading6` |
| Replace Me | typography | — | `[ARCHIVE]/*Mobile/Field Label` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Drawer | effects | — | `light/Shadow/Popover` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Drawer Wrapper**: hardcoded padding
- **Drawer**: hardcoded padding
- **Header**: hardcoded padding
- **Left Action**: hardcoded itemSpacing (10px)
- **Button (Link)**: hardcoded itemSpacing (8px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Right Action**: hardcoded itemSpacing (10px)
- **Content**: hardcoded itemSpacing (10px)
- **Slot/Replace Me**: hardcoded color (no variable or style)
- **Slot/Replace Me**: hardcoded padding
- **Replace Me**: hardcoded color (no variable or style)
- **scroll bar**: hardcoded cornerRadius (9999px)
- **Handle Wrapper**: hardcoded padding
- **Handle Bar**: hardcoded cornerRadius (9999px)
