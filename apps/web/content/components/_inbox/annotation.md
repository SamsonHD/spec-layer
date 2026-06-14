---
spec_version: "0.1"
component:
  name: annotation
  figma_key: f98ca06325d1e1e72ad1556d0685f40f3de96e7d
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24385:77907
content_hash: 91bab29c36bc16ab11c8b7da5214df49d9b49110b91b6f7c61f45ec3b79ba6b0
extracted_at: 2026-06-14T10:05:04.209Z
---

## Definition

_To be written._

## Anatomy

1. annotation-tag (component)
2. Lorem Ipsum

## Configuration

_None._

## Variants

- **Property 1**: Deviation (default) · Phase 2 · Note

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| border | Property 1=Note | `annotation` |

#### annotation-tag

| Property | Condition | Token |
|---|---|---|
| fill | Property 1=Note | `annotation` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Lorem Ipsum | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Lorem Ipsum | font-family | — | `font-family/font-family` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [annotation-tag](./annotation-tag.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (19px)
- **Container**: hardcoded cornerRadius (28px)
- **Container**: hardcoded padding
- **annotation-tag**: hardcoded color (no variable or style)
- **annotation-tag**: hardcoded itemSpacing (10px)
- **annotation-tag**: hardcoded cornerRadius (8px)
- **annotation-tag**: hardcoded padding
- **Deviation from Vega**: hardcoded color (no variable or style)
- **Deviation from Vega**: no text style or typography variable
