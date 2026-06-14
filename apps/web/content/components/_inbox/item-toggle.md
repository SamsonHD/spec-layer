---
spec_version: "0.1"
component:
  name: Item Toggle
  figma_key: 62a83c1897f0edc4b3965155dfd90983dd59cd7e
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 2150:163797
content_hash: ef07cff09e1323ed28b7b6320c7221e227fdca8ace2ab93e5111efb9bdb6bde1
extracted_at: 2026-06-14T10:07:43.779Z
---

## Definition

_To be written._

## Anatomy

1. .itemToggle Wrapper (component)

## Configuration

_None._

## Variants

- **Type**: Add (default) · Added · Remove · Removed
- **Status**: Default (default) · Hover · Press · Focus

## States

- Default

## Tokens used

### Color

#### Add

| Property | Add | Added | Remove | Removed |
|---|---|---|---|---|
| fill | — | `Text Color/Semantic/Success` | — | `Text Color/Semantic/Success` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Type=Add, Status=Default · Focus | `Text Color/Action/Link` |
| fill | Type=Add, Status=Hover | `Text Color/Action/Link (Hover)` |
| fill | Type=Add, Status=Press | `Text Color/Action/Link (Pressed)` |
| fill | Type=Remove, Status=Default | `Text Color/Semantic/Danger Link` |
| fill | Type=Remove, Status=Hover | `Text Color/Semantic/Danger Link (Hover)` |
| fill | Type=Remove, Status=Press | `Text Color/Semantic/Danger Link (Pressed)` |
| fill | Type=Remove, Status=Focus | `Background/Action/Danger (Pressed)` |

#### Button Icon

| Property | Add | Added | Remove | Removed |
|---|---|---|---|---|
| border | — | `Border Color/Banner/Banner Success` | — | `Border Color/Banner/Banner Success` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| border | Type=Add, Status=Default | `Border Color/Action/Link` |
| border | Type=Add, Status=Hover | `Border Color/Action/Link (Hover)` |
| border | Type=Add, Status=Press · Focus | `Border Color/Action/Link (Pressed)` |
| border | Type=Remove, Status=Default | `Border Color/Semantic/Danger` |
| border | Type=Remove, Status=Hover | `Border Color/Semantic/Danger (Hover)` |
| border | Type=Remove, Status=Press · Focus | `Border Color/Semantic/Danger (Pressed)` |
| fill | Status=Focus | `Background/Action/Action Secondary` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | Status=Focus | `Border Color/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| icon | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Add | typography | — | `[ARCHIVE]/*Mobile/Field Label` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.itemToggle Wrapper](./itemtoggle-wrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **.itemToggle Wrapper**: hardcoded itemSpacing (8px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
