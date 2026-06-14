---
spec_version: "0.1"
component:
  name: Add Shift
  figma_key: fd1a8cc773697af336e967544e375b45a258c1b1
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26890:11650
content_hash: bf88eaa8c24f400a664fa63992bee828a3221f6303db7c3b2c12e4cc10b705df
extracted_at: 2026-06-14T10:04:36.296Z
---

## Definition

_To be written._

## Anatomy

1. iconWrapper (component)
2. Add

## Configuration

_None._

## Variants

- **Size**: Full size (default) · Collapsed

## States

- Default

## Tokens used

### Color

#### Add

| Property | Condition | Token |
|---|---|---|
| fill | Size=Full size | `Text Color/Action/Default` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Quaternary` |
| icon | fill | `Text Color/Action/Default` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Add | typography | Size=Full size | `Action/XS` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-4` |
| Container | effects | — | `light/Shadow/Card` |

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
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
