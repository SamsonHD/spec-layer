---
spec_version: "0.1"
component:
  name: Input Field - Phone Number
  figma_key: f05dcd8e15f5357d53286e8636fddc18518f74bc
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 15303:28765
content_hash: 2f63efe4a3cbea60d4acfbddd5e1e54d48af148c8a84aa30c1158dc680d4ebd3
extracted_at: 2026-06-14T10:03:56.830Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Field Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Optional | boolean | true / false | false |
| Required | boolean | true / false | false |
| Label | text | — | Phone number |
| Shows Label | boolean | true / false | true |
| Shows Hint | boolean | true / false | false |
| Hint Msg | text | — | Hint message |
| Error Msg | text | — | Error message here. |
| Show Country Code | boolean | true / false | true |

## Variants

- **Size**: Medium · Large (default) · Small
- **Modifiers**: Error · Empty · Disabled

## States

- Default

## Tokens used

### Color

#### Select

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |
| border | `Border Color/Input Field/Input Field` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=false | `Text Color/Body/Primary` |
| fill | Disabled=true | `Text Color/Input/Input Disabled` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=false | `Text Color/Body/Primary` |
| fill | Disabled=true | `Text Color/Input/Input Disabled` |

#### Input

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |
| border | `Border Color/Input Field/Input Field` |

**When Error = true**

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |
| border | `Border Color/Input Field/Input Field Danger` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

#### Text Content

| Property | Condition | Token |
|---|---|---|
| fill | Empty=true | `Text Color/Input/Input Placeholder` |
| fill | Empty=false, Disabled=false | `Text Color/Body/Primary` |
| fill | Empty=false, Disabled=true | `Text Color/Input/Input Disabled` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Error=true | `Text Color/Semantic/Error` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Phone number | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Phone number | typography | — | `Label/S` |
| Placeholder | typography | — | `Value/S` |
| Text Content | typography | — | `Value/S` |
| Error Message | typography | Error=true | `[ARCHIVE]/Footnote1/Short` |

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
- **Field Wrapper**: hardcoded itemSpacing (12px)
- **.Country Code Select (Dropdown)**: hardcoded color (no variable or style)
- **Select**: hardcoded itemSpacing (8px)
- **Select**: hardcoded cornerRadius (8px)
- **Select**: hardcoded padding
- **flag**: hardcoded itemSpacing (10px)
- **flag**: hardcoded cornerRadius (2px)
- **Country Flags**: hardcoded color (no variable or style)
- **Mask**: hardcoded color (no variable or style)
- **Rectangle 511**: hardcoded color (no variable or style)
- **Path**: hardcoded color (no variable or style)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Input Field**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (2px)
- **Label**: hardcoded color (no variable or style)
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
