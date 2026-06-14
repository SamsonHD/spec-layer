---
spec_version: "0.1"
component:
  name: Signature Capture (Written)
  figma_key: 74100b6f04434e5186bdaedc34726a02086c54f0
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 12747:90124
content_hash: 5507736d50498e1a42539294781f5ba79fbe7b6a78b297504398f793a1147e4d
extracted_at: 2026-06-14T10:04:11.593Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Signature Pad
3. Persistent Footer

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Shows Label | boolean | true / false | true |
| Optional | boolean | true / false | false |
| Required | boolean | true / false | false |
| Label | text | — | Label |
| Error Msg | text | — | Error message here. |
| Signed | boolean | true / false | false |
| Show Clear Btn | boolean | true / false | true |
| Placeholder | text | — | Please sign here |
| Show Icon | boolean | true / false | true |

## Variants

- **Modifiers**: Error

## States

- Default
- Hover
- Focus
- Disabled

## Tokens used

### Color

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | State=Default · Hover · Focus | `Text Color/Body/Primary` |
| fill | State=Disabled | `Text Color/Body/Secondary` |

#### Signature Pad

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| fill | Disabled | `Background/Surface/Secondary` |
| border | Default | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field (Focus)` |
| border | Disabled | `Border Color/Input Field/Input Field Disabled` |

**When Error = True**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| fill | Disabled | `Background/Surface/Secondary` |
| border | Default | `Border Color/Input Field/Input Field Danger` |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field Danger (Focus)` |
| border | Disabled | `Border Color/Input Field/Input Field Disabled` |

#### Vector

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Body/Primary` |
| fill | Hover | `Text Color/Body/Secondary` |
| fill | Focus | `Text Color/Body/Secondary` |
| fill | Disabled | `Text Color/Input/Input Disabled` |

**When Error = True**

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Body/Secondary` |
| fill | Hover | `Text Color/Body/Secondary` |
| fill | Focus | `Text Color/Body/Secondary` |
| fill | Disabled | `Text Color/Input/Input Disabled` |

#### Please sign here

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Body/Primary` |
| fill | Hover | `Text Color/Body/Secondary` |
| fill | Focus | `Text Color/Body/Secondary` |
| fill | Disabled | `Text Color/Input/Input Disabled` |

**When Error = True**

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Body/Secondary` |
| fill | Hover | `Text Color/Body/Secondary` |
| fill | Focus | `Text Color/Body/Secondary` |
| fill | Disabled | `Text Color/Input/Input Disabled` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | State=Default · Hover · Focus, Error=True | `Text Color/Semantic/Error` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Error=True | `Border Color/Semantic/Danger` |
| border | State=Focus, Error=False | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/M` |
| Please sign here | typography | — | `Body/L` |
| Error Message | typography | State=Default · Hover · Focus, Error=True | `[ARCHIVE]/Footnote1/Short` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **Signature Pad**: hardcoded cornerRadius (8px)
- **Signature Pad**: hardcoded padding
- **Placeholder**: hardcoded itemSpacing (8px)
- **Signature**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Fake Signature**: hardcoded color (no variable or style)
- **Vector (Stroke)**: hardcoded color (no variable or style)
- **Persistent Footer**: hardcoded itemSpacing (12px)
- **Persistent Footer**: hardcoded padding
- **Clear Button**: hardcoded itemSpacing (10px)
- **Button (Link)**: hardcoded itemSpacing (4px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
