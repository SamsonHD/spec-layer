---
spec_version: "0.1"
component:
  name: Selection Tile
  figma_key: ad449d10ade856b9d3239ec48d5da7d727ef2f10
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 5431:358206
content_hash: 11925c6786f83d7b9f3271a5b10148d051b83cc9de4c96fde28f4c96831bada3
extracted_at: 2026-06-14T10:04:11.582Z
---

## Definition

_To be written._

## Anatomy

1. iconWrapper (component)
2. Text Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Note | text | — | Optional note goes here |
| Title | text | — | Title of selection tile |
| Show note | boolean | true / false | true |
| Content Slot | instanceSwap | — | 5507:362804 |
| Image Slot | instanceSwap | — | 5507:362804 |

## Variants

- **Select Method**: Checkbox (default) · Radio
- **Type**: Text + Icon (default) · Text + Slot · Text Only · Slot Only
- **Modifiers**: Selected · Error · Disabled

## States

- Default
- Hover
- Focus

## Tokens used

### Color

#### Container

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Tile/Tile` |
| fill | Hover | `Background/Tile/Tile (Hover)` |
| fill | Focus | `Background/Tile/Tile` |
| border | Default | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field (Focus)` |

**When Selected = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Tile/Tile - Selected` |
| fill | Hover | `Background/Tile/Tile - Selected (Hover)` |
| fill | Focus | `Background/Tile/Tile - Selected` |
| border | Default | `Border Color/Tile/Tile Selected` |
| border | Hover | `Border Color/Tile/Tile Selected (Hover)` |
| border | Focus | `Border Color/Tile/Tile Selected` |

**When Error = True**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Tile/Tile` |
| fill | Hover | `Background/Tile/Tile (Hover)` |
| fill | Focus | `Background/Tile/Tile` |
| border | Default | `Border Color/Input Field/Input Field Danger` |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field Danger (Focus)` |

**When Disabled = True**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Type=Text + Icon | `Text Color/Body/Secondary` |

#### Title of selection tile

| Property | Condition | Token |
|---|---|---|
| fill | Type=Text + Icon · Text + Slot · Text Only, Disabled=False | `Text Color/Body/Primary` |
| fill | Type=Text + Icon · Text + Slot · Text Only, Disabled=True | `Text Color/Input/Input Disabled` |

#### Check

| Property | Checkbox | Radio |
|---|---|---|
| fill | `Background/Surface/Primary` | — |
| border | `Border Color/Input Field/Input Field` | — |

**When Selected = true**

| Property | Checkbox | Radio |
|---|---|---|
| fill | `Background/Action/Action` | — |
| border | `Border Color/Input Field/Input Field` | — |

**When Error = True**

| Property | State | Checkbox | Radio |
|---|---|---|---|
| fill | Default | `Background/Surface/Primary` | — |
| fill | Hover | `Background/Surface/Primary` | — |
| fill | Focus | `Background/Surface/Primary` | — |
| border | Default | `Border Color/Input Field/Input Field Danger` | — |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` | — |
| border | Focus | `Border Color/Input Field/Input Field Danger` | — |

**When Disabled = True**

| Property | Checkbox | Radio |
|---|---|---|
| fill | `Background/Surface/Secondary` | — |
| border | `Border Color/Input Field/Input Field Disabled` | — |

#### Optional note

| Property | Condition | Token |
|---|---|---|
| fill | Type=Text + Icon · Text + Slot · Text Only, Disabled=False | `Text Color/Body/Secondary` |
| fill | Type=Text + Icon · Text + Slot · Text Only, Disabled=True | `Text Color/Input/Input Disabled` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Error=True | `Border Color/Semantic/Danger` |
| border | State=Focus, Error=False, Disabled=False | `Border Color/Action/Action` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Select Method=Checkbox, Selected=true | `Text Color/Body/Inverted → Primary` |

#### radio control

| Property | Checkbox | Radio |
|---|---|---|
| fill | — | `Background/Surface/Primary` |
| border | — | `Border Color/Input Field/Input Field` |

**When Error = True**

| Property | State | Checkbox | Radio |
|---|---|---|---|
| fill | Default | — | `Background/Surface/Primary` |
| fill | Hover | — | `Background/Surface/Primary` |
| fill | Focus | — | `Background/Surface/Primary` |
| border | Default | — | `Border Color/Input Field/Input Field Danger` |
| border | Hover | — | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Focus | — | `Border Color/Input Field/Input Field Danger` |

**When Disabled = True**

| Property | Checkbox | Radio |
|---|---|---|
| fill | — | `Background/Surface/Secondary` |
| border | — | `Border Color/Input Field/Input Field Disabled` |

#### Ellipse 220

| Property | Condition | Token |
|---|---|---|
| fill | Select Method=Radio, Selected=true | `Background/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title of selection tile | typography | Type=Text + Icon · Text + Slot · Text Only | `Subtitle/M` |
| Optional note | font-size | Type=Text + Icon · Text + Slot · Text Only | `font-size/fs-150` |
| Optional note | font-family | Type=Text + Icon · Text + Slot · Text Only | `font-family/font-family` |
| Optional note | line-height | Type=Text + Icon · Text + Slot · Text Only | `line-height/lh-250` |
| Optional note | font-weight | Type=Text + Icon · Text + Slot · Text Only | `font-weight/fw-400` |
| Replace Me | typography | Type=Text + Slot · Slot Only | `[ARCHIVE]/*Mobile/Field Label` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (24px)
- **Container**: hardcoded cornerRadius (8px)
- **Container**: hardcoded padding
- **Content Wrapper**: hardcoded itemSpacing (12px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Title + Select Wrapper**: hardcoded itemSpacing (16px)
- **Selection Wrapper**: hardcoded itemSpacing (10px)
- **Selection Wrapper**: hardcoded padding
- **⚠️ [Deprecated] Checkbox**: hardcoded color (no variable or style)
- **.checkbox Wrapper**: hardcoded itemSpacing (8px)
- **Check Wrapper**: hardcoded itemSpacing (10px)
- **Check**: hardcoded cornerRadius (2px)
- **Checkmark**: hardcoded color (no variable or style)
- **Hint Wrapper**: hardcoded padding
- **Optional note**: hardcoded itemSpacing (16px)
