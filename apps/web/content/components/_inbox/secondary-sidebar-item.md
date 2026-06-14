---
spec_version: "0.1"
component:
  name: Secondary Sidebar Item
  figma_key: c7e843e72e6291442c0decdfd91d98db1e1f6ae4
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24576:2455
content_hash: 88e5a6491fa77023d114bdc9f0ad408b5cdb208b034c439df869709516b0d382
extracted_at: 2026-06-14T10:03:58.016Z
---

## Definition

_To be written._

## Anatomy

1. Overview

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Collapsible | boolean | true / false | false |
| Show icon left | boolean | true / false | false |

## Variants

- **Modifiers**: Selected · Hover

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| fill | Selected=True | `Background/Sidebar/Secondary Sidebar Item Selected` |
| fill | Selected=False | `Background/Action/Action Tertiary (Hover)` |

#### Overview

| Property | Condition | Token |
|---|---|---|
| fill | Selected=True | `Text Color/Action/Link Secondary` |
| fill | Selected=False | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Overview | typography | Selected=True | `New/Subtitle/S4 : 14px SemiBold` |
| Overview | typography | Selected=False | `Subtitle/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Container | padding-x | — | `size-8` |
| Container | padding-y | — | `size-4` |

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
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **.sidebar-item-label-wrapper**: hardcoded itemSpacing (10px)
