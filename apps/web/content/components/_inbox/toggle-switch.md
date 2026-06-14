---
spec_version: "0.1"
component:
  name: Toggle Switch
  figma_key: 807cdb43951b461b4d6a45e65b5ca7762d589c18
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 6305:348904
content_hash: 071255d50171ff1c5a87798e6f3460670b6f0d7f6055f757d7d00c6e6e972d61
extracted_at: 2026-06-14T10:04:19.067Z
---

## Definition

_To be written._

## Anatomy

1. Track
2. Frame 1

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Label | boolean | true / false | true |
| Label | text | — | Label |
| Show Icon | boolean | true / false | false |
| Info Icon | boolean | true / false | false |

## Variants

- **Size**: Medium (default) · Small · Xsmall
- **Modifiers**: On · Disabled

## States

- Default
- Hover
- Focus

## Tokens used

### Color

#### Track

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Toggle/Toggle Switch` |
| fill | Hover | `Background/Toggle/Toggle Switch (Hover)` |
| fill | Focus | `Background/Toggle/Toggle Switch` |

**When On = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Action/Action` |
| fill | Hover | `Background/Action/Action (Hover)` |
| fill | Focus | `Background/Action/Action` |

**When Disabled = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Disabled` |
| fill | Hover | `Background/Toggle/Toggle Switch (Hover)` · `Background/Surface/Disabled` |
| fill | Focus | `Background/Surface/Disabled` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | On=true, Disabled=true | `Background/Toggle/Toggle Switch (Selected) Disabled` |

#### Switch

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=false | `Background/Surface/Primary` |
| fill | Disabled=true | `Background/Surface/Tertiary` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=false | `Text Color/Body/Primary` |
| fill | Disabled=true | `Text Color/Semantic/Disabled` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | States=Focus | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Size=Medium | `Label/M` |
| Label | typography | Size=Small · Xsmall | `Label/S` |

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
- **Track**: hardcoded itemSpacing (10px)
- **Track**: hardcoded cornerRadius (9999px)
- **Track**: hardcoded padding
- **Switch**: hardcoded cornerRadius (9999px)
- **Switch**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Frame 1**: hardcoded itemSpacing (4px)
