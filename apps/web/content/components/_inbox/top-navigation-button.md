---
spec_version: "0.1"
component:
  name: Top Navigation / Button
  figma_key: 6953ed3bfbbaf9d5f32f1dcb85ac0bedacff1426
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24594:2677
content_hash: 6715400b5ef4375b75d25f9c406bc2d4218bd3be058aea569b626287a2405c9d
extracted_at: 2026-06-14T10:04:05.499Z
---

## Definition

_To be written._

## Anatomy

1. iconWrapper (component)

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
| fill | — | `Background/Action/Action Quaternary` |
| border | Selected=False | `Border Color/Action/Link (Hover)` |
| border | Selected=True | `Border Color/Action/Link (Pressed)` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| icon | fill | `Text Color/Body/Primary` |

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

- **Container**: hardcoded itemSpacing (10px)
- **Container**: hardcoded padding
- **iconWrapper**: hardcoded cornerRadius (4px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
