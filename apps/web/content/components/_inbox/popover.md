---
spec_version: "0.1"
component:
  name: Popover
  figma_key: ec29121b65dba5be20bedf27030121cad389edb4
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 6313:349667
content_hash: 49b51d66c942496e0cefceee36aa6aeda7e3bbd1cd372119d152edf2afaa0a33
extracted_at: 2026-06-14T10:04:05.519Z
---

## Definition

_To be written._

## Anatomy

1. Content Wrapper
2. .Popover Pointer (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Content Slot | instanceSwap | — | 5507:362804 |
| Text | text | — | Text content  |
| Shows Arrow | boolean | true / false | true |

## Variants

- **Variant**: Slot (default) · Text
- **Arrow on**: Top (default) · Bottom · Left · Right
- **Arrow Placement**: Center (default) · End · Start
- **Modifiers**: Fixed Width

## States

- Default

## Tokens used

### Color

#### Text content

| Property | Condition | Token |
|---|---|---|
| fill | Variant=Text | `Text Color/Body/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Content Wrapper | fill | `Background/Surface/Primary` |
| Content Wrapper | border | `Background/Divider/Divider Secondary` |
| Popover Pointer | fill | `Background/Surface/Primary` |
| Subtract | fill | `Background/Divider/Divider Secondary` |
| Subtract | fill | `Border Color/Input Field/Input Field` |
| Popover Pointer (Stroke) | fill | `Border Color/Input Field/Input Field` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Replace Me | typography | Variant=Slot | `[ARCHIVE]/*Mobile/Field Label` |
| Text content | typography | Variant=Text | `Body/L` |

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
- **Content Wrapper**: hardcoded padding
- **Slot/Replace Me**: hardcoded color (no variable or style)
- **Slot/Replace Me**: hardcoded padding
- **Replace Me**: hardcoded color (no variable or style)
- **Union**: hardcoded color (no variable or style)
- **Rectangle 7269**: hardcoded color (no variable or style)
- **Rectangle 7270**: hardcoded color (no variable or style)
- **Rectangle 7271**: hardcoded color (no variable or style)
- **Rectangle 7272**: hardcoded color (no variable or style)
