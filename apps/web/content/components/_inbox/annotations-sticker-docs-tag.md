---
spec_version: "0.1"
component:
  name: -annotations/Sticker Docs/Tag
  figma_key: a2fc5d9dca395527a58b014247037f98095ab061
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 1097:75879
content_hash: 2c5e912956300eea1fc5c33ed3bd74bb5e30164151fd9b91aebf071f327ad528
extracted_at: 2026-06-14T10:04:47.372Z
---

## Definition

_To be written._

## Anatomy

1. Icon
2. Tag

## Configuration

_None._

## Variants

- **Type**: Default (default) · Developer Note · Designer Note

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| fill | Type=Default | `Background/Accent1 → Tertiary` |
| fill | Type=Developer Note | `Background/Accent2 → Primary` |
| fill | Type=Designer Note | `Background/Accent6 → Primary` |

#### Tag

| Property | Condition | Token |
|---|---|---|
| fill | Type=Default | `Text Color/Body/Primary` |

#### Union

| Property | Condition | Token |
|---|---|---|
| fill | Type=Developer Note | `Background/Sidebar/Sidebar Item (Hover)` |

#### Developer Note

| Property | Condition | Token |
|---|---|---|
| fill | Type=Developer Note | `Text Color/Sidebar Link Selected` |

#### Designer Note

| Property | Condition | Token |
|---|---|---|
| fill | Type=Designer Note | `Text Color/Sidebar Link Selected` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Tag | typography | Type=Default | `[ARCHIVE]/*Mobile/Field Label Extra Small (Emphasized)` |
| Developer Note | typography | Type=Developer Note | `[ARCHIVE]/*Mobile/Field Label Extra Small (Emphasized)` |
| Designer Note | typography | Type=Designer Note | `[ARCHIVE]/*Mobile/Field Label Extra Small (Emphasized)` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | effects | — | `light/Shadow/Form Field` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded cornerRadius (4px)
- **Container**: hardcoded padding
- **Icon**: hardcoded color (no variable or style)
