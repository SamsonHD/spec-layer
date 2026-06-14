---
spec_version: "0.1"
component:
  name: Widget
  figma_key: 27d2eea5859b8b633f69fdea95aae614ae890834
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25347:646
content_hash: 1ba2466bc033a2075a87c9459ac34b8a36f6eab87c73d9b28db54e12e1a600b3
extracted_at: 2026-06-14T10:04:19.071Z
---

## Definition

_To be written._

## Anatomy

1. WidgetHeader (component)
2. WidgetBody

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| WidgetBody | undefined | — | — |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Widget | fill | `Background/Surface/Primary` |
| WidgetHeader | fill | `Background/Surface/Primary` |
| Title | fill | `Text Color/Body/Primary` |
| Description | fill | `Text Color/Body/Secondary` |
| Button Icon | border | `Border Color/Action/Secondary Button (Default)` |
| Button Icon | fill | `Background/Action/Action Tertiary` |
| icon | fill | `Text Color/Body/Primary` |
| WidgetBody | fill | `Background/Surface/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | — | `Subtitle/L - Strong` |
| Description | typography | — | `Body/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Widget | border-radius | — | `rounded-8` |
| Widget | effects | — | `light/Shadow/Card` |
| Button Icon | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [WidgetHeader](./widgetheader.md)

## Extraction gaps

- **WidgetHeader**: hardcoded itemSpacing (24px)
- **WidgetHeader**: hardcoded padding
- **Title**: hardcoded itemSpacing (4px)
- **Add affordances**: hardcoded itemSpacing (12px)
- **WidgetActions/table**: hardcoded itemSpacing (8px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **WidgetBody**: hardcoded itemSpacing (24px)
- **WidgetBody**: hardcoded padding
- **[ADD CONTENT HERE]**: hardcoded color (no variable or style)
