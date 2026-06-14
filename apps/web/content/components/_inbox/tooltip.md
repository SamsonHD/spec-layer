---
spec_version: "0.1"
component:
  name: Tooltip
  figma_key: 939a1380a96687658b8289f274c4fe2877130eec
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 2630:190868
content_hash: d178ff56965cf40dfb00418320b83c63772dd7646aa416addb2fcef439fb8e4d
extracted_at: 2026-06-14T10:04:19.069Z
---

## Definition

_To be written._

## Anatomy

1. Tooltip Pointer
2. Label Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label | text | — | Label |

## Variants

- **Position**: Bottom (default) · Right · Left · Top
- **Placement**: Middle (default) · End · Start
- **Modifiers**: Fixed Width

## States

- Default

## Tokens used

### Color

#### Tooltip Pointer

| Property | Condition | Token |
|---|---|---|
| fill | Position=Bottom, Fixed Width=false, Placement=Middle | `Background/Surface/Inverted → Primary` |

#### arrow up

| Property | Condition | Token |
|---|---|---|
| fill | Position=Bottom | `Background/Surface/Inverted → Primary` |

#### arrow left

| Property | Condition | Token |
|---|---|---|
| fill | Position=Right | `Background/Surface/Inverted → Primary` |

#### arrow right

| Property | Condition | Token |
|---|---|---|
| fill | Position=Left | `Background/Surface/Inverted → Primary` |

#### arrow down

| Property | Condition | Token |
|---|---|---|
| fill | Position=Top | `Background/Surface/Inverted → Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Label Wrapper | fill | `Background/Surface/Inverted → Primary` |
| Label | fill | `Text Color/Body/Inverted → Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/S` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded cornerRadius (4px)
- **.tooltip**: hardcoded cornerRadius (4px)
- **Label Wrapper**: hardcoded itemSpacing (10px)
- **Label Wrapper**: hardcoded cornerRadius (4px)
- **Label Wrapper**: hardcoded padding
