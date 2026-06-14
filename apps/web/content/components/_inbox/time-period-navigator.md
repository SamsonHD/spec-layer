---
spec_version: "0.1"
component:
  name: Time Period Navigator
  figma_key: 14d5972aa6293d91c4d0a4a3a31fe846976a3cab
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 27001:937
content_hash: 5e0f3aa14a0aa7a72746c37fdff1fae071e9e07bec3c0b73bb57a8d7f1fd2265
extracted_at: 2026-06-14T10:03:14.920Z
---

## Definition

_To be written._

## Anatomy

1. Button Icon (component)
2. Input Field (component)

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
| border | State=Default | `Border Color/Divider/Divider Secondary` |
| border | State=Active | `Border Color/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Button Icon | fill | `Background/Action/Action Tertiary` |
| icon | fill | `Text Color/Body/Primary` |
| Input | fill | `Background/Surface/Primary` |
| Input | border | `Border Color/Input Field/Input Field` |
| Text Content | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Text Content | typography | — | `Value/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Container | effects | State=Active | `light/Ring/Input - Active` |
| Button Icon | border-top-left-radius | — | `rounded-8` |
| Button Icon | border-bottom-left-radius | — | `rounded-8` |
| Button Icon | border-top-right-radius | — | `rounded-8` |
| Button Icon | border-bottom-right-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Button Icon](./button-icon.md)
- [Input Field](./input-field.md)

## Extraction gaps

- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Input Field**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded padding
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
