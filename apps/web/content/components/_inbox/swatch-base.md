---
spec_version: "0.1"
component:
  name: Swatch base
  figma_key: 19cfc86f7c3d66e24779ff2fe88e2657d490bb0f
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24344:68855
content_hash: d7e397da05cccc8da41475be44592c00a038daca0a3fe6ee04d32dc27ca0b617
extracted_at: 2026-06-14T10:04:47.380Z
---

## Definition

_To be written._

## Anatomy

1. Swatch
2. Text and supporting text

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Brand | boolean | true / false | true |
| Values | boolean | true / false | true |
| Name | text | — | Black |
| HEX | text | — | F5FAFF |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Swatch base | fill | `White` |
| Swatch | fill | `Black` |
| WCAG contrast | fill | `color/text/on-surface/default` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Hex | typography | — | `Body/Body S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Swatch base | effects | — | `Tile Shadow` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Swatch base**: hardcoded cornerRadius (8px)
- **WCAG contrast**: no text style or typography variable
- **Text and supporting text**: hardcoded color (no variable or style)
- **Text and supporting text**: hardcoded padding
- **Number**: hardcoded color (no variable or style)
- **Number**: no text style or typography variable
- **Hex**: hardcoded color (no variable or style)
- ****: hardcoded color (no variable or style)
- ****: no text style or typography variable
