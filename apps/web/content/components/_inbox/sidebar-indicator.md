---
spec_version: "0.1"
component:
  name: Sidebar / Indicator
  figma_key: 7ceebc5123c6b778fc07d059165ae57fb3e45651
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24554:2333
content_hash: f9e072dc83322cbc05ab67d577d52430afeee6504b1c27cbe6d1f5f05242ae22
extracted_at: 2026-06-14T10:03:58.013Z
---

## Definition

_To be written._

## Anatomy

1. Ellipse 1

## Configuration

_None._

## Variants

- **Type**: New (default) · Unpaid · Notification

## States

- Default

## Tokens used

### Color

#### Ellipse 1

| Property | Condition | Token |
|---|---|---|
| fill | Type=New | `Background/Surface/Avatar` |
| fill | Type=Notification | `Accent/accent-1` |

#### iconWrapper

| Property | Condition | Token |
|---|---|---|
| fill | Type=Unpaid | `Background/Transparent` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Type=Unpaid | `Background/Sidebar/Secondary Sidebar Item Selected` |

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
- **Container**: hardcoded padding
