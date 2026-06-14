---
spec_version: "0.1"
component:
  name: Selection Tile Group
  figma_key: ae85574e8f2b5c242d47014ca10dac2429b59aaa
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 5549:365398
content_hash: d86f41ca9520eb2a10e3a5484ccad2542f00b624c92e8f9f4151aac30b5d188d
extracted_at: 2026-06-14T10:04:11.556Z
---

## Definition

_To be written._

## Anatomy

1. Header Wrapper
2. Tile Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Hint | boolean | true / false | false |
| Required | boolean | true / false | false |
| Optional | boolean | true / false | false |
| Show Label | boolean | true / false | true |

## Variants

- **Select Method**: Checkbox (default) · Radio
- **Type**: Text + Icon · Text + Slot · Text Only (default) · Slot Only
- **Layout**: Vertical (default) · Horizontal
- **Modifiers**: Error · Disabled

## States

- Default

## Tokens used

### Color

#### Label

| Property | Token |
|---|---|
| fill | `Text Color/Body/Primary` |

**When Disabled = True**

| Property | Vertical | Horizontal |
|---|---|---|
| fill | — | `Text Color/Body/Secondary` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Type=Text + Slot · Slot Only, Layout=Vertical, Disabled=True | `Text Color/Body/Secondary` |
| fill | Select Method=Checkbox, Type=Text + Icon · Text Only, Layout=Vertical, Disabled=True | `Text Color/Input/Input Placeholder` |
| fill | Select Method=Radio, Type=Text + Icon · Text Only, Layout=Vertical, Disabled=True | `Text Color/Body/Secondary` |

#### Selection Tile

| Property | Token |
|---|---|
| fill | `Background/Tile/Tile` |
| border | `Border Color/Input Field/Input Field` |

**When Error = True**

| Property | Token |
|---|---|
| fill | `Background/Tile/Tile` |
| border | `Border Color/Input Field/Input Field Danger` |

**When Disabled = True**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Select Method=Radio, Type=Slot Only, Layout=Horizontal, Disabled=True | `Background/Tile/Tile` |
| border | Select Method=Radio, Type=Slot Only, Layout=Horizontal, Disabled=True | `Border Color/Input Field/Input Field` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Type=Text + Icon | `Text Color/Body/Secondary` |

#### Title of selection tile

| Property | Condition | Token |
|---|---|---|
| fill | Type=Text + Icon · Text + Slot · Text Only, Disabled=True | `Text Color/Input/Input Disabled` |
| fill | Type=Text + Icon · Text + Slot · Text Only, Disabled=False | `Text Color/Body/Primary` |

#### radio control

| Property | Checkbox | Radio |
|---|---|---|
| fill | — | `Background/Surface/Primary` |
| border | — | `Border Color/Input Field/Input Field` |

**When Error = True**

| Property | Checkbox | Radio |
|---|---|---|
| fill | — | `Background/Surface/Primary` |
| border | — | `Border Color/Input Field/Input Field Danger` |

**When Disabled = True**

| Property | Checkbox | Radio |
|---|---|---|
| fill | — | `Background/Surface/Secondary` |
| border | — | `Border Color/Input Field/Input Field Disabled` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Select Method=Radio, Type=Slot Only, Layout=Horizontal, Disabled=True | `Background/Surface/Primary` |
| border | Select Method=Radio, Type=Slot Only, Layout=Horizontal, Disabled=True | `Border Color/Input Field/Input Field` |

#### Optional note

| Property | Condition | Token |
|---|---|---|
| fill | Type=Text + Icon · Text + Slot · Text Only, Disabled=True | `Text Color/Input/Input Disabled` |
| fill | Type=Text + Icon · Text + Slot · Text Only, Disabled=False | `Text Color/Body/Secondary` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Error=True | `Text Color/Semantic/Error` |

#### Check

| Property | Checkbox | Radio |
|---|---|---|
| fill | `Background/Surface/Primary` | — |
| border | `Border Color/Input Field/Input Field` | — |

**When Error = True**

| Property | Checkbox | Radio |
|---|---|---|
| fill | `Background/Surface/Primary` | — |
| border | `Border Color/Input Field/Input Field Danger` | — |

**When Disabled = True**

| Property | Checkbox | Radio |
|---|---|---|
| fill | `Background/Surface/Secondary` | — |
| border | `Border Color/Input Field/Input Field Disabled` | — |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `[ARCHIVE]/*Mobile/Field Label` |
| Title of selection tile | typography | Type=Text + Icon · Text + Slot · Text Only | `Subtitle/M` |
| Optional note | font-size | Type=Text + Icon · Text + Slot · Text Only | `font-size/fs-150` |
| Optional note | font-family | Type=Text + Icon · Text + Slot · Text Only | `font-family/font-family` |
| Optional note | line-height | Type=Text + Icon · Text + Slot · Text Only | `line-height/lh-250` |
| Optional note | font-weight | Type=Text + Icon · Text + Slot · Text Only | `font-weight/fw-400` |
| Replace Me | typography | Type=Text + Slot · Slot Only | `[ARCHIVE]/*Mobile/Field Label` |
| Error Message | typography | Error=True | `[ARCHIVE]/Footnote1/Short` |

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
- **Header Wrapper**: hardcoded padding
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Tile Wrapper**: hardcoded itemSpacing (12px)
- **Row 01**: hardcoded itemSpacing (12px)
- **Selection Tile**: hardcoded itemSpacing (24px)
- **Selection Tile**: hardcoded cornerRadius (8px)
- **Selection Tile**: hardcoded padding
- **Content Wrapper**: hardcoded itemSpacing (12px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Title + Select Wrapper**: hardcoded itemSpacing (16px)
- **Selection Wrapper**: hardcoded itemSpacing (10px)
- **Selection Wrapper**: hardcoded padding
- **⚠️ [Deprecated] Radio**: hardcoded itemSpacing (12px)
- **.radio Wrapper**: hardcoded itemSpacing (8px)
- **radio control**: hardcoded itemSpacing (10px)
- **radio control**: hardcoded cornerRadius (9999px)
- **Label**: hardcoded itemSpacing (4px)
- **icon Wrapper**: hardcoded padding
- **Optional note**: hardcoded itemSpacing (16px)
- **Row 02**: hardcoded itemSpacing (12px)
- **Error Wrapper**: hardcoded itemSpacing (10px)
- **Error Wrapper**: hardcoded padding
