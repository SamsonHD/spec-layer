---
spec_version: "0.1"
component:
  name: _typography Font Type Options
  figma_key: 5888ec613b48e84de0f2860b93882dee503ebb44
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 205:3059
content_hash: e36c1abb3b5ce6fa00d4cf06e22b7e1c7536725b7d3d1221614919ca09b93a6f
extracted_at: 2026-06-14T10:04:47.157Z
---

## Definition

_To be written._

## Anatomy

1. Label

## Configuration

_None._

## Variants

- **type**: sans-serif (default) · serif · monospace · cursive · fantasy

## States

- Default

## Tokens used

### Color

#### Container

| Property | sans-serif | serif | monospace | cursive | fantasy |
|---|---|---|---|---|---|
| fill | `Accent/accent-1` | `Accent/accent-5` | `Accent/accent-9` | `Accent/accent-8` | `Accent/accent-15` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | type=sans-serif · serif · monospace | `Text Color/Body/Primary` |
| fill | type=cursive · fantasy | `Text Color/Body/Inverted → Primary` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded cornerRadius (4px)
- **Container**: hardcoded padding
- **Label**: no text style or typography variable
