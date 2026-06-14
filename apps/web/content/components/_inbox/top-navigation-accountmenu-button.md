---
spec_version: "0.1"
component:
  name: Top Navigation / accountMenu Button
  figma_key: 4916a8fffcd21393986d9eb20090fbf89d8691e6
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24503:2145
content_hash: 89805e821fa49bdb79c08b26101a29ed6c47ceb72e1b52c215ba2de7f2b87312
extracted_at: 2026-06-14T10:04:05.498Z
---

## Definition

_To be written._

## Anatomy

1. Container
2. iconWrapper (component)

## Configuration

_None._

## Variants

- **Modifiers**: Selected · Hover

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| fill | — | `Background/Surface/Quaternary` |
| border | Selected=False | `Border Color/Action/Link (Hover)` |
| border | Selected=True | `Border Color/Action/Link (Pressed)` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| John Doe | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| John Doe | typography | — | `Action/XS` |

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

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded padding
- **Avatar**: hardcoded itemSpacing (4px)
- **Avatar**: hardcoded cornerRadius (9999px)
- **Photo**: hardcoded itemSpacing (8px)
- **Photo**: hardcoded cornerRadius (9999px)
- **Status Badge**: hardcoded cornerRadius (100px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
