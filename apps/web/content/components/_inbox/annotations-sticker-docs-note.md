---
spec_version: "0.1"
component:
  name: -annotations/Sticker Docs/Note
  figma_key: 5b8d2ddddbbe95f1ac805a93d8201b09eb3ef30c
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 1097:75946
content_hash: e70455ac33765deef2673983af0b3cdaf371b10f8469f241b2e93866c3b6021c
extracted_at: 2026-06-14T10:04:47.374Z
---

## Definition

_To be written._

## Anatomy

1. -annotations/Sticker Docs/Base Note (component)

## Configuration

_None._

## Variants

- **Modifiers**: Description · Tag · Card

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| fill | Card=true | `Background/Surface/Primary` |

#### -annotations/Sticker Docs/Tag

| Property | Condition | Token |
|---|---|---|
| fill | Tag=true | `Background/Accent1 → Tertiary` |

#### Tag

| Property | Condition | Token |
|---|---|---|
| fill | Tag=true | `Text Color/Body/Primary` |

#### Description

| Property | Condition | Token |
|---|---|---|
| fill | Description=true | `Text Color/Body/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Title | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | Tag=false | `[ARCHIVE]/*Mobile/Heading4` |
| Title | typography | Tag=true | `[ARCHIVE]/*Mobile/Heading5` |
| Tag | typography | Tag=true | `[ARCHIVE]/*Mobile/Field Label Extra Small (Emphasized)` |
| Description | typography | Description=true, Tag=false | `[ARCHIVE]/*Tablet Portrait/Paragraph1/Short` |
| Description | typography | Description=true, Tag=true | `[ARCHIVE]/Paragraph2/Short` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | effects | Card=true | `light/Shadow/Card` |
| -annotations/Sticker Docs/Tag | effects | Tag=true | `light/Shadow/Form Field` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [-annotations/Sticker Docs/Base Note](./annotations-sticker-docs-base-note.md)

## Extraction gaps

- **Container**: hardcoded color (no variable or style)
- **-annotations/Sticker Docs/Base Note**: hardcoded itemSpacing (12px)
- **-annotations/Sticker Docs/Tag**: hardcoded itemSpacing (8px)
- **-annotations/Sticker Docs/Tag**: hardcoded cornerRadius (4px)
- **-annotations/Sticker Docs/Tag**: hardcoded padding
- **Icon**: hardcoded color (no variable or style)
- **Content Wrapper**: hardcoded itemSpacing (12px)
