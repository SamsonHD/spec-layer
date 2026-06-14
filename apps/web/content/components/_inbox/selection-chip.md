---
spec_version: "0.1"
component:
  name: Selection Chip
  figma_key: 177b7edb34a1e062fba980e393173dae7b8348ce
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 11181:350179
content_hash: 7b2799cbc76199b6206e296d47fa05f16e44ea1718ffff0103f0b6b702bdb40e
extracted_at: 2026-06-14T10:03:26.164Z
---

## Definition

_To be written._

## Anatomy

1. Swatch (component)
2. Label

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label | text | — | Label |

## Variants

- **Style**: Swatch (default) · Text
- **Size**: Extra Small (default) · Small · Medium · Large
- **Modifiers**: Selected · Disabled · Error

## States

- Default
- Hover
- Focus

## Tokens used

### Color

#### Container

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Tile/Tile` |
| fill | Hover | `Background/Tile/Tile (Hover)` |
| fill | Focus | `Background/Tile/Tile` |
| border | Default | `Border Color/Tile/Tile` |
| border | Hover | `Border Color/Tile/Tile (Hover)` |
| border | Focus | `Border Color/Tile/Tile (Focus)` |

**When Selected = True**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Tile/Tile - Selected` |
| fill | Hover | `Background/Tile/Tile - Selected (Hover)` |
| fill | Focus | `Background/Tile/Tile - Selected` |
| border | Default | `Border Color/Tile/Tile Selected` |
| border | Hover | `Border Color/Tile/Tile Selected (Hover)` |
| border | Focus | `Border Color/Tile/Tile - Selected (Focus)` |

**When Disabled = True**

| Property | Token |
|---|---|
| fill | `Background/Tile/Tile` |
| border | `Border Color/Input Field/Input Field Disabled` |

**When Error = True**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Tile/Tile` |
| fill | Hover | `Background/Tile/Tile (Hover)` |
| fill | Focus | `Background/Tile/Tile` |
| border | Default | `Border Color/Input Field/Input Field Danger` |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field Danger (Focus)` |

#### Swatch

| Property | Condition | Token |
|---|---|---|
| fill | Style=Swatch | `Background/Semantic/Status → Informational` |
| border | Style=Swatch | `Background/Surface/Primary` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=False | `Text Color/Body/Primary` |
| fill | Disabled=True | `Text Color/Semantic/Disabled` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | States=Focus, Error=True | `Border Color/Semantic/Danger` |
| border | States=Focus, Disabled=False, Error=False | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Size=Extra Small | `Chip/XS` |
| Label | typography | Size=Small | `Chip/S` |
| Label | typography | Size=Medium | `Chip/M` |
| Label | typography | Size=Large, States=Hover · Focus | `Chip/L` |
| Label | typography | Style=Swatch, Size=Large, States=Default | `Chip/L` |
| Label | typography | Style=Text, Size=Large, States=Default | `[ARCHIVE]/*Mobile/Field Label Large` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Swatch](./swatch.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded cornerRadius (9999px)
- **Container**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **Swatch**: hardcoded cornerRadius (9999px)
