---
spec_version: "0.1"
component:
  name: People / Employee Navigation Item
  figma_key: a8c9fb42f9d456bb2d84240accd5cda94e2051b7
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24889:3929
content_hash: 362b92f67bbba5fde97f551f8fe05a52091b282dc0f6169926bbb4dbd91e0973
extracted_at: 2026-06-14T10:03:58.018Z
---

## Definition

_To be written._

## Anatomy

1. iconWrapper (component)
2. Text

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Left Icon | boolean | true / false | true |
| Right Icon | boolean | true / false | false |
| Counter | boolean | true / false | false |
| Show Alert | boolean | true / false | false |

## Variants

- **Modifiers**: Selected · Hover · Disabled

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| fill | Selected=False, Hover=False | `Background/Surface/Primary` |
| fill | Selected=True | `Background/Sidebar/Secondary Sidebar Item Selected` |
| fill | Hover=True | `Background/Action/Action Tertiary (Hover)` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Selected=False, Disabled=False | `Text Color/Body/Primary` |
| fill | Selected=True | `Text Color/Action/Link Secondary` |
| fill | Disabled=True | `Text Color/Semantic/Disabled` |

#### Overview

| Property | Condition | Token |
|---|---|---|
| fill | Selected=False, Disabled=False | `Text Color/Body/Primary` |
| fill | Selected=True | `Text Color/Action/Link Secondary` |
| fill | Disabled=True | `Text Color/Semantic/Disabled` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Overview | typography | — | `New/Subtitle/S4 : 14px SemiBold` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-4` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (12px)
- **Container**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Text**: hardcoded itemSpacing (8px)
- **Badge Alert**: hardcoded cornerRadius (7999.20068359375px)
