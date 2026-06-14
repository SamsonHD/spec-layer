---
spec_version: "0.1"
component:
  name: File Uploader
  figma_key: 49c483f0b7a39d5911288b3a1631fcd7a01057c0
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 17424:7935
content_hash: 276449cb3516725f81014e5891d2161211cf9f68a6615c1fc4768eec10d8fa32
extracted_at: 2026-06-14T10:03:56.211Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Upload Container
3. Hint Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Hint | boolean | true / false | true |
| Show Label | boolean | true / false | true |
| Show List | boolean | true / false | false |
| Label | text | — | Label |
| Show Required | boolean | true / false | false |
| Show Optional | boolean | true / false | false |
| Doc 4 | boolean | true / false | false |
| Doc 5 | boolean | true / false | false |
| Doc 3 | boolean | true / false | true |
| Doc 2 | boolean | true / false | true |
| Hint | text | — | Maximum file size is 10MB |
| Error | text | — | Error message here. |
| Drop Area | boolean | true / false | true |

## Variants

- **Style**: Upload Area (default) · Upload Button
- **Modifiers**: Disabled · Danger

## States

- Default
- Hover
- Press
- Focus

## Tokens used

### Color

#### Label

| Property | State | Upload Area | Upload Button |
|---|---|---|---|
| fill | Default | `Text Color/Action/Link` | `Text Color/Action/On Secondary` |
| fill | Hover | `Text Color/Action/Link (Hover)` | `Text Color/Action/On Secondary` |
| fill | Press | `Text Color/Action/Link (Pressed)` | `Text Color/Action/On Secondary` |
| fill | Focus | `Text Color/Action/Default` | `Text Color/Action/On Secondary` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Text Color/Body/Secondary` · `Text Color/Semantic/Disabled` |

**When Danger = true**

| Property | State | Upload Area | Upload Button |
|---|---|---|---|
| fill | Default | `Text Color/Action/Default` | `Text Color/Semantic/Danger Link` |
| fill | Hover | `Text Color/Action/Link (Hover)` | `Text Color/Semantic/Danger Link (Hover)` |
| fill | Press | `Text Color/Action/Link (Pressed)` | `Text Color/Semantic/Danger Link (Pressed)` |
| fill | Focus | `Text Color/Action/Default` | `Text Color/Semantic/Danger Link` · `Text Color/Semantic/Danger Link (Focus)` |

#### Upload Container

| Property | State | Upload Area | Upload Button |
|---|---|---|---|
| fill | Default | `Background/Surface/Tertiary` | — |
| fill | Hover | `Background/Surface/Secondary` | — |
| fill | Press | `Background/Surface/Secondary` | — |
| fill | Focus | `Background/Surface/Tertiary` | — |
| border | Default | `Border Color/Input Field/Input Field` | — |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` | — |
| border | Press | `Border Color/Action/Action (Pressed)` | — |
| border | Focus | `Border Color/Input Field/Input Field` | — |

**When Disabled = true**

| Property | Upload Area | Upload Button |
|---|---|---|
| fill | `Background/Surface/Tertiary` | — |
| border | `Border Color/Input Field/Input Field Disabled` | — |

**When Danger = true**

| Property | State | Upload Area | Upload Button |
|---|---|---|---|
| fill | Default | `Background/Surface/Tertiary` | — |
| fill | Hover | `Background/Surface/Secondary` | — |
| fill | Press | `Background/Surface/Secondary` | — |
| fill | Focus | `Background/Surface/Tertiary` | — |
| border | Default | `Border Color/Input Field/Input Field Danger` | — |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` | — |
| border | Press | `Border Color/Input Field/Input Field Danger (Hover)` | — |
| border | Focus | `Border Color/Input Field/Input Field Danger` | — |

#### icon

| Property | State | Upload Area | Upload Button |
|---|---|---|---|
| fill | Default | `Text Color/Action/Default` | `Text Color/Body/Primary` |
| fill | Hover | `Text Color/Action/Default` | `Text Color/Body/Primary` |
| fill | Press | `Text Color/Action/Link (Pressed)` | `Text Color/Body/Primary` |
| fill | Focus | `Text Color/Action/Default` | `Text Color/Body/Primary` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Disabled` |

**When Danger = true**

| Property | State | Upload Area | Upload Button |
|---|---|---|---|
| fill | Default | `Text Color/Action/Default` | `Text Color/Semantic/Danger Link` |
| fill | Hover | `Text Color/Action/Default` | `Text Color/Semantic/Danger Link (Hover)` |
| fill | Press | `Text Color/Action/Link (Pressed)` | `Text Color/Semantic/Danger Link (Pressed)` |
| fill | Focus | `Text Color/Action/Default` | `Text Color/Semantic/Danger Link` |

#### Button (Link)

| Property | Condition | Token |
|---|---|---|
| fill | Style=Upload Area | `Background/Transparent` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Danger=true | `Text Color/Semantic/Error` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Danger=true | `Border Color/Semantic/Danger` |
| border | State=Focus, Disabled=false, Danger=false | `Border Color/Action/Action` |

#### Button

| Property | State | Upload Area | Upload Button |
|---|---|---|---|
| fill | Default | — | `Background/Action/Action Secondary` |
| fill | Hover | — | `Background/Action/Action Secondary (Hover)` |
| fill | Press | — | `Background/Action/Action Secondary (Pressed)` |
| fill | Focus | — | `Background/Action/Action Secondary` |
| border | Default | — | `Border Color/Action/Secondary Button (Default)` |
| border | Hover | — | `Border Color/Action/Secondary Button (Hover)` |
| border | Press | — | `Border Color/Action/Secondary Button (Pressed)` |
| border | Focus | — | `Border Color/Action/Secondary Button (Default)` |

**When Disabled = true**

| Property | Upload Area | Upload Button |
|---|---|---|
| fill | — | `Background/Action/Action Secondary` |
| border | — | `Border Color/Action/Secondary Button (Disabled)` |

**When Danger = true**

| Property | State | Upload Area | Upload Button |
|---|---|---|---|
| fill | Default | — | `Background/Action/Action Secondary` |
| fill | Hover | — | `Background/Action/Danger Tertiary (Hover)` |
| fill | Press | — | `Background/Action/Danger Tertiary (Pressed)` |
| fill | Focus | — | `Background/Action/Action Secondary` |
| border | Default | — | `Border Color/Semantic/Danger` |
| border | Hover | — | `Border Color/Semantic/Danger (Hover)` |
| border | Press | — | `Border Color/Semantic/Danger (Pressed)` |
| border | Focus | — | `Border Color/Semantic/Danger` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Hint | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/S` |
| Label | typography | Style=Upload Area | `Subtitle/M` |
| Label | typography | Style=Upload Button | `Action/S` |
| Hint | font-size | — | `font-size/fs-150` |
| Hint | font-family | — | `font-family/font-family` |
| Hint | line-height | — | `line-height/lh-250` |
| Hint | font-weight | — | `font-weight/fw-400` |
| Error Message | font-size | Danger=true | `font-size/fs-150` |
| Error Message | font-family | Danger=true | `font-family/font-family` |
| Error Message | line-height | Danger=true | `line-height/lh-250` |
| Error Message | font-weight | Danger=true | `font-weight/fw-400` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | Style=Upload Button | `rounded-8` |
| Button | padding-x | Style=Upload Button | `size-16` |

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
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **Upload Container**: hardcoded cornerRadius (8px)
- **Upload Container**: hardcoded padding
- **Button Label**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Upload List**: hardcoded itemSpacing (4px)
- **Upload List Item**: hardcoded itemSpacing (8px)
- **Upload List Item**: hardcoded cornerRadius (8px)
- **Upload List Item**: hardcoded padding
- **Doc Name**: hardcoded itemSpacing (8px)
- **Indicator**: hardcoded itemSpacing (10px)
- **Loading Indicator - Xtra Small**: hardcoded itemSpacing (16px)
- **Indicator Wrapper**: hardcoded itemSpacing (10px)
- **.loading-indicator-xtra-small**: hardcoded itemSpacing (10px)
- **Ellipse 846**: hardcoded color (no variable or style)
- **Ellipse 847**: hardcoded color (no variable or style)
- **Progress Indicator**: hardcoded color (no variable or style)
- **Rectangle 7253**: hardcoded color (no variable or style)
- **Text Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded itemSpacing (12px)
- **Actions**: hardcoded itemSpacing (4px)
- **Error Wrapper**: hardcoded itemSpacing (10px)
