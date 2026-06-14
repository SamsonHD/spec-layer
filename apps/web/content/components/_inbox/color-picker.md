---
spec_version: "0.1"
component:
  name: Color Picker
  figma_key: 49fe7ff56fb10c0aa27264a9e34d07241c27822c
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7553:305983
content_hash: 89e35930e4321a3904586500c503428c83140737aa3dca018d489b1f49ca1431
extracted_at: 2026-06-14T10:03:26.190Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Field Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Shows Hint | boolean | true / false | false |
| Shows Label | boolean | true / false | true |
| Required | boolean | true / false | false |
| Optional | boolean | true / false | false |
| Hint | text | — | Help text goes here. |
| Label | text | — | Label |
| Error Message | text | — | Error message here. |

## Variants

- **Appearance**: Standalone (default) · Popover
- **Stack**: Vertical (default) · Horizontal
- **Modifiers**: Danger / Error · Disabled

## States

- Default

## Tokens used

### Color

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Appearance=Standalone, Disabled=false | `Text Color/Body/Primary` |
| fill | Appearance=Standalone, Disabled=true | `Text Color/Body/Secondary` |

#### Picker

| Property | Standalone | Popover |
|---|---|---|
| fill | `Background/Surface/Primary` | — |
| border | `Border Color/Input Field/Input Field` | — |

**When Danger / Error = true**

| Property | Standalone | Popover |
|---|---|---|
| fill | `Background/Surface/Primary` | — |
| border | `Border Color/Input Field/Input Field Danger` | — |

**When Disabled = true**

| Property | Standalone | Popover |
|---|---|---|
| fill | `Background/Surface/Secondary` | — |
| border | `Border Color/Input Field/Input Field Disabled` | — |

#### Content Wrapper

| Property | Condition | Token |
|---|---|---|
| fill | Appearance=Popover | `Background/Surface/Primary` |
| border | Appearance=Popover | `Border Color/Input Field/Input Field` |

#### Popover Pointer

| Property | Condition | Token |
|---|---|---|
| fill | Appearance=Popover | `Background/Surface/Primary` |

#### Subtract

| Property | Condition | Token |
|---|---|---|
| fill | Appearance=Popover | `Border Color/Input Field/Input Field` |

#### Popover Pointer (Stroke)

| Property | Condition | Token |
|---|---|---|
| fill | Appearance=Popover | `Border Color/Input Field/Input Field` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Appearance=Standalone, Danger / Error=true, Disabled=false | `Text Color/Semantic/Error` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Color Swatch | fill | `Accent/accent-1` |
| Color Swatch | fill | `Accent/accent-15` |
| Color Swatch | fill | `Accent/accent-16` |
| Color Swatch | fill | `Accent/accent-17` |
| Color Swatch | fill | `Accent/accent-4` |
| Color Swatch | fill | `Accent/accent-5` |
| Color Swatch | fill | `Accent/accent-7` |
| Color Swatch | fill | `Accent/accent-9` |
| Color Swatch | border | `Border Color/Action/Secondary Button (Disabled)` |
| Color Swatch | border | `Border Color/Chip/Disabled` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Appearance=Standalone | `Label/S` |
| Error Message | typography | Appearance=Standalone, Danger / Error=true, Disabled=false | `[ARCHIVE]/Footnote1/Short` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Color Swatch | border-radius | — | `rounded-8` |
| Popover | effects | Appearance=Popover | `Shadows/Popover` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/0/color` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/0/offsetX` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/0/offsetY` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/0/radius` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/0/spread` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/1/color` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/1/offsetX` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/1/offsetY` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/1/radius` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/1/spread` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/2/color` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/2/offsetX` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/2/offsetY` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/2/radius` |
| Popover | effects | Appearance=Popover | `Shadows/Popover/2/spread` |
| Content Wrapper | effects | Appearance=Popover | `light/Shadow/Popover` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **Picker**: hardcoded itemSpacing (8px)
- **Picker**: hardcoded cornerRadius (8px)
- **Picker**: hardcoded padding
- **Swatches**: hardcoded itemSpacing (8px)
- **Primary**: hardcoded itemSpacing (8px)
- **Secondary**: hardcoded itemSpacing (8px)
- **Tertiary**: hardcoded itemSpacing (8px)
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
