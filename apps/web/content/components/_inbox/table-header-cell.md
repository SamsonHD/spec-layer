---
spec_version: "0.1"
component:
  name: Table / Header Cell
  figma_key: ca93ac246beb8770b91f2cb979e37f217659c281
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 2181:203123
content_hash: 8e51f2988f5de467ce1386d365f0d7c488086dfda6768a9fe5803eef0600b4e9
extracted_at: 2026-06-14T10:07:47.221Z
---

## Definition

_To be written._

## Anatomy

1. Empty-Placeholder

## Configuration

_None._

## Variants

- **Header Type**: Checkbox · Empty · Icon + Text · Icon · Text + Icon · Text (default)
- **Sort Order**: None (default) · Ascending · Descending

## States

- Default

## Tokens used

### Color

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Header Type=Icon + Text · Text + Icon · Text | `Text Color/Body/Primary` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Header Type=Checkbox | `Text Color/Body/Inverted → Primary` |
| fill | Header Type=Icon + Text · Text + Icon · Text | `Text Color/Body/Primary` |

#### Check Wrapper

| Property | Condition | Token |
|---|---|---|
| fill | Header Type=Checkbox | `Background/Surface/Primary` |
| border | Header Type=Checkbox | `Border Color/Input Field/Input Field` |

#### Ellipse 1

| Property | Condition | Token |
|---|---|---|
| border | Header Type=Icon + Text · Icon · Text + Icon | `Text Color/Body/Primary` |

#### Ellipse 2

| Property | Condition | Token |
|---|---|---|
| fill | Header Type=Icon + Text · Icon · Text + Icon | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Header Type=Icon + Text · Text + Icon · Text | `[ARCHIVE]/*Mobile/Field Label Small (Emphasized)` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded padding
- **Empty-Placeholder**: hardcoded color (no variable or style)
