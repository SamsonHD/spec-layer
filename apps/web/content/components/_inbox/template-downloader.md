---
spec_version: "0.1"
component:
  name: Template downloader
  figma_key: 619fd9baca22ad900ee64b5f70d21b131500ef40
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 27061:2042
content_hash: abf50f82832aa19eb5d903fcbb43b9a0f7a4ad39c69c74009077e348e3f18a2f
extracted_at: 2026-06-14T10:03:56.188Z
---

## Definition

_To be written._

## Anatomy

1. wrapper
2. Frame 1

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Date range selector | boolean | true / false | true |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Template downloader | fill | `Background/Surface/Page` |
| title | fill | `Primary/Midnight Blue` |
| copy | fill | `Primary/Midnight Blue` |
| Picker | fill | `Background/Surface/Primary` |
| Picker | border | `Border Color/Input Field/Input Field` |
| Start Date Input | fill | `Background/Surface/Primary` |
| icon | fill | `Text Color/Body/Secondary` |
| Start Date Placeholder | fill | `Text Color/Input/Input Placeholder` |
| Divider | fill | `Background/Divider/Divider` |
| End Date Input | fill | `Background/Surface/Primary` |
| End Date Placeholder | fill | `Text Color/Input/Input Placeholder` |
| Button | fill | `Background/Action/Action Secondary` |
| Button | border | `Border Color/Action/Secondary Button (Disabled)` |
| Label | fill | `Text Color/Semantic/Disabled` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| title | typography | — | `Subtitle/S` |
| copy | typography | — | `Caption/S` |
| Start Date Placeholder | typography | — | `Value/S` |
| End Date Placeholder | typography | — | `Value/S` |
| Label | typography | — | `Action/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Template downloader | border-radius | — | `rounded-8` |
| Button | border-radius | — | `rounded-8` |
| Button | padding-x | — | `size-16` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Template downloader**: hardcoded itemSpacing (20px)
- **Template downloader**: hardcoded padding
- **wrapper**: hardcoded itemSpacing (8px)
- **Frame 1**: hardcoded itemSpacing (20px)
- **Date Range Picker**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **Picker**: hardcoded cornerRadius (8px)
- **Start Date Input**: hardcoded itemSpacing (8px)
- **Start Date Input**: hardcoded cornerRadius (8px)
- **Start Date Input**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Divider**: hardcoded cornerRadius (2px)
- **End Date Input**: hardcoded itemSpacing (8px)
- **End Date Input**: hardcoded cornerRadius (8px)
- **End Date Input**: hardcoded padding
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Button**: hardcoded itemSpacing (8px)
