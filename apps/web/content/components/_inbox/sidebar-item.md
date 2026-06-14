---
spec_version: "0.1"
component:
  name: Sidebar / Item
  figma_key: ae4ec979afc8d5caeb0fab81d19f1ad7beb1d2bf
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24439:12900
content_hash: 97aa1dff28e9c710371c8157fd8904f1ba1148d65e4e0ded5db0bc7c6db9d4aa
extracted_at: 2026-06-14T10:03:58.006Z
---

## Definition

_To be written._

## Anatomy

1. iconWrapper (component)
2. .sidebar-new-item-label-wrapper (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Chip | boolean | true / false | false |
| Indicator | boolean | true / false | false |

## Variants

- **Modifiers**: Selected · Collapsed · isGroup · Expanded · SubItemSelected

## States

- Default
- Hover
- Focus

## Tokens used

### Color

#### Container

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Transparent` |
| fill | Hover | `Background/Sidebar/Sidebar Item (Hover)` |
| fill | Focus | `Background/Transparent` |
| border | Focus | `Border Color/Sidebar/Sidebar Item (Focus)` |

**When Selected = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Sidebar/Sidebar Icon (Selected)` |
| fill | Hover | `Background/Sidebar/Sidebar Icon (Selected)` |
| fill | Focus | `Background/Sidebar/Sidebar Icon (Selected)` |
| border | Focus | `Border Color/Sidebar/Sidebar Item (Focus)` |

**When Collapsed = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Transparent` |
| fill | Hover | `Background/Sidebar/Sidebar Item (Hover)` |
| fill | Focus | `Background/Transparent` |
| border | Focus | `Border Color/Sidebar/Sidebar Item (Focus)` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Selected=true, Collapsed=true | `Background/Sidebar/Sidebar Sub-Item Selected` |

#### iconWrapper

| Property | Condition | Token |
|---|---|---|
| fill | State=Default · Focus, Selected=false | `Background/Transparent` |
| fill | State=Hover | `Background/Sidebar/Sidebar Item (Hover)` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Collapsed=false | `Text Color/Body/Inverted → Primary` |
| fill | Expanded=true, SubItemSelected=true | `Text Color/Body/Primary` |

#### ChipAction

| Property | Condition | Token |
|---|---|---|
| fill | Expanded=true, SubItemSelected=true | `Background/Action/Action Inverse` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| icon | fill | `Text Color/Body/Inverted → Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Collapsed=false | `Subtitle/S` |
| Label | typography | Expanded=true, SubItemSelected=true | `Chip/XS` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Container | gap | Collapsed=false | `size-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)
- [.sidebar-new-item-label-wrapper](./sidebar-new-item-label-wrapper.md)

## Extraction gaps

- **Container**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **.sidebar-new-item-label-wrapper**: hardcoded itemSpacing (10px)
- **Sidebar / Indicator**: hardcoded itemSpacing (8px)
- **ChipAction**: hardcoded itemSpacing (8px)
- **ChipAction**: hardcoded cornerRadius (9999px)
- **ChipAction**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
