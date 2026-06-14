---
spec_version: "0.1"
component:
  name: Color Swatch
  figma_key: 0369205c833fc5e9c0e9b5bc2da9f2d2371c9561
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7553:300168
content_hash: c1f06fea116722f42fc5d9afcf0241170323f5d96415b7e41bba3434cc0c2c45
extracted_at: 2026-06-14T10:03:26.191Z
---

## Definition

_To be written._

## Anatomy


## Configuration

_None._

## Variants

- **Brightness**: Light (default)
- **Modifiers**: Mobile · Selected

## States

- Default
- Hover
- Focus

## Tokens used

### Color

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus | `Border Color/Action/Action` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Selected=true | `Text Color/Body/White` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| Container | border | `Border Color/Action/Secondary Button (Disabled)` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.
