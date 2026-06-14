---
spec_version: "0.1"
component:
  name: Chip
  figma_key: 017fe8215a3fcb1d10a76e156f109d0ade61fa1d
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26740:14363
content_hash: 1fb2a00cba4d844b69f8daf8c15369b61ec91c6aa2af1a9db48f12bce72ffcad
extracted_at: 2026-06-14T10:03:26.151Z
---

## Definition

_To be written._

## Anatomy

1. iconWrapper (component)
2. Label

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label | text | — | Label |
| Show Left Icon | boolean | true / false | true |
| Show Right Icon | boolean | true / false | true |

## Variants

- **Style**: Default (default)
- **Size**: Small · Medium · Large · Xsmall (default)
- **Outline**: false (default)
- **Color**: Gray (default) · Blue

## States

- Default
- Hover
- Focus
- Press

## Tokens used

### Color

#### Container

| Property | State | Gray | Blue |
|---|---|---|---|
| fill | Default | `Background/Сhip/Chip` | `Background/Semantic/Status → Informational` |
| fill | Hover | `Background/Сhip/Chip (Hover)` | `Background/Semantic/Status → Informational` |
| fill | Focus | `Background/Сhip/Chip` | `Background/Semantic/Status → Informational` |
| fill | Press | `Background/Сhip/Chip (Pressed)` | `Background/Semantic/Status → Informational` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | States=Focus | `Border Color/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| icon | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Secondary` |
| Label | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Size=Small | `Chip/XS` |
| Label | typography | Size=Medium · Large | `Chip/S` |
| Label | typography | Size=Xsmall | `Caption/XS - Strong` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Focus Rect | border-radius | States=Focus | `rounded-4` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
