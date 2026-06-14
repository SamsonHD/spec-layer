---
spec_version: "0.1"
component:
  name: WidgetBanner
  figma_key: 30be0d0df354dac2295d68ce4403b2d786ec39d7
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25858:27353
content_hash: 7adc5d8c1bbb8d34fde144ced99c7176aa49c5ce8bade928c5608a070f1a44d9
extracted_at: 2026-06-14T10:04:19.071Z
---

## Definition

_To be written._

## Anatomy

1. WidgetIcon (component)
2. title + description
3. Affordances

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Affordances | undefined | — | — |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| WidgetBanner | fill | `Background/Surface/Primary` |
| WidgetIcon | fill | `Background/Surface/Quaternary` |
| icon | fill | `Text Color/Body/Primary` |
| title | fill | `Text Color/Body/Primary` |
| copy | fill | `Text Color/Body/Secondary` |
| Button | fill | `Background/Action/Action` |
| Button | fill | `Background/Action/Action Secondary` |
| Button | border | `Border Color/Action/Secondary Button (Default)` |
| Label | fill | `Text Color/Action/On Action` |
| Label | fill | `Text Color/Action/On Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| title | typography | — | `New/Subtitle/S1 : 18px Bold` |
| copy | typography | — | `Body/M` |
| Label | typography | — | `Action/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| WidgetBanner | border-radius | — | `rounded-8` |
| WidgetBanner | effects | — | `light/Shadow/Card` |
| WidgetIcon | border-radius | — | `rounded-8` |
| Button | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [WidgetIcon](./widgeticon.md)

## Extraction gaps

- **WidgetBanner**: hardcoded itemSpacing (16px)
- **WidgetBanner**: hardcoded padding
- **WidgetIcon**: hardcoded itemSpacing (7.02439022064209px)
- **WidgetIcon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **title + description**: hardcoded itemSpacing (4px)
- **Affordances**: hardcoded itemSpacing (8px)
- **Button**: hardcoded itemSpacing (8px)
- **Button**: hardcoded padding
