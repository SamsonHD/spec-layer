---
spec_version: "0.1"
component:
  name: Temperature
  figma_key: d8f41b962ff4ed126d49551e89db20c107121395
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26749:7461
content_hash: 803a997db535fe4110283a55cbdf9616f80d52d5cd1391f037f6821e9133c1d1
extracted_at: 2026-06-14T10:04:36.296Z
---

## Definition

_To be written._

## Anatomy

1. iconWrapper (component)

## Configuration

_None._

## Variants

- **Modifiers**: Hover · Pressed

## States

- Default

## Tokens used

### Color

#### Icon BG

| Property | Condition | Token |
|---|---|---|
| fill | Hover=False | `Background/Action/Action Tertiary (Pressed)` |
| fill | Hover=True | `Background/Action/Action Tertiary (Hover)` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| icon | fill | `Text Color/Body/Secondary` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Icon BG | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (4px)
- **Icon BG**: hardcoded itemSpacing (8px)
- **Icon BG**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
