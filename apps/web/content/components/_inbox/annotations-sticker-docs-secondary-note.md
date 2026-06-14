---
spec_version: "0.1"
component:
  name: -annotations/Sticker Docs/Secondary Note
  figma_key: 364534584c7617d97c4f84b7f9d66f878e554a17
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 2830:189351
content_hash: b789f4b62f23539b4d7462157984ed7187ebdac838606985d32d93de6639264d
extracted_at: 2026-06-14T10:04:47.376Z
---

## Definition

_To be written._

## Anatomy

1. Title
2. Usage notes

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Title | text | — | Title |
| Description | text | — | Usage notes |

## Variants

- **Description**: On (default) · Off

## States

- Default

## Tokens used

### Color

#### Usage notes

| Property | Condition | Token |
|---|---|---|
| fill | Description=On | `Text Color/Body/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Title | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | — | `[ARCHIVE]/*Mobile/Heading6` |
| Usage notes | typography | Description=On | `[ARCHIVE]/*Tablet Portrait/Paragraph2/Long` |

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
