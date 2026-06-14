---
spec_version: "0.1"
component:
  name: Skeleton
  figma_key: bdf722795f3601f2f2b5936dc996759db86e597d
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7358:295741
content_hash: 09fe638cc6080e8102c4a0f2cb98709c27517cb8f2c78e5976c23944fda99c13
extracted_at: 2026-06-14T10:04:11.597Z
---

## Definition

_To be written._

## Anatomy

1. Rectangle

## Configuration

_None._

## Variants

- **Type**: Text (default) · Paragraph · Full Width Paragraph · Ellipse · Image · Table

## States

- Default

## Tokens used

### Color

#### Rectangle

| Property | Condition | Token |
|---|---|---|
| fill | Type=Text · Paragraph · Full Width Paragraph · Image | `Background/Action/Action Quaternary` |

#### Ellipse

| Property | Condition | Token |
|---|---|---|
| fill | Type=Ellipse | `Background/Action/Action Quaternary` |

#### Header Cell

| Property | Condition | Token |
|---|---|---|
| fill | Type=Table | `Background/Table/Table Header` |

#### item

| Property | Condition | Token |
|---|---|---|
| fill | Type=Table | `Background/Action/Action Quaternary` |

#### Tabel Cell

| Property | Condition | Token |
|---|---|---|
| fill | Type=Table | `Background/Surface/Primary` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (16px)
- **Rectangle**: hardcoded cornerRadius (9999px)
