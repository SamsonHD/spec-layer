---
spec_version: "0.1"
component:
  name: Search
  figma_key: 092257a8a47c5f07221041d4a983eb6561c6272c
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24580:2548
content_hash: e051c9ab7221da38f85abf7b9e274839a972ef64b373b220a80a9299e4d1e2f7
extracted_at: 2026-06-14T10:04:05.508Z
---

## Definition

_To be written._

## Anatomy

1. magnifying-glass
2. Label

## Configuration

_None._

## Variants

_None._

## States

- Default
- Active

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| fill | State=Default | `Background/Surface/Quaternary` |
| fill | State=Active | `Background/Action/Action Quaternary (Pressed)` |
| border | State=Active | `Accent/accent-3` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | State=Default | `Text Color/Body/Secondary` |
| fill | State=Active | `Text Color/Body/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Primary | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Tablet Portrait/Button Label Small` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (4px)
- **Container**: hardcoded cornerRadius (8px)
- **Container**: hardcoded padding
- **Icon + Label**: hardcoded itemSpacing (8px)
