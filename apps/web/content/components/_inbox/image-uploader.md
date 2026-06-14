---
spec_version: "0.1"
component:
  name: Image Uploader
  figma_key: 291046ca257b1b8e4497a9f08a849d327ff81f7c
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 6912:290426
content_hash: 7b03552edf43936817a643f1c92ea6d9bd5582c7cfb1f2457a070478cca79ae0
extracted_at: 2026-06-14T10:03:57.980Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Image Uploader
3. Hint Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Image Slot | instanceSwap | — | 5507:362804 |
| Preview Btn | boolean | true / false | true |
| Shows Label | boolean | true / false | true |
| Shows Hint | boolean | true / false | true |
| Optional | boolean | true / false | true |
| Required | boolean | true / false | true |
| Hint | text | — | Help text goes here. |
| Error | text | — | Error message here. |
| Label | text | — | Label |
| Secondary text | text | — | {Secondary text} |
| Show Secondary text | boolean | true / false | true |
| Replace Btn | boolean | true / false | true |
| Image Container | undefined | — | — |

## Variants

- **Style**: Default (default) · Uploading · Upload Complete · Upload Complete (Slot)
- **Modifiers**: Danger · Disabled

## States

- Default
- Hover
- Focus

## Tokens used

### Color

#### Label

| Property | State | Default | Uploading | Upload Complete | Upload Complete (Slot) |
|---|---|---|---|---|---|
| fill | Default | `Text Color/Action/Link` | `Text Color/Body/Primary` | `Text Color/Body/Primary` | `Text Color/Body/Primary` |
| fill | Hover | `Text Color/Action/Link` · `Text Color/Body/Primary` | `Text Color/Action/Link` · `Text Color/Body/Primary` | `Text Color/Body/Primary` | `Text Color/Body/Primary` |
| fill | Focus | `Text Color/Action/Link` | `Text Color/Body/Primary` | `Text Color/Body/Primary` | `Text Color/Body/Primary` |

**When Danger = True**

| Property | State | Default | Uploading | Upload Complete | Upload Complete (Slot) |
|---|---|---|---|---|---|
| fill | Default | `Text Color/Action/Link` · `Text Color/Body/Primary` | `Text Color/Body/Secondary` | `Text Color/Action/Link` · `Text Color/Body/Primary` | `Text Color/Action/Link` · `Text Color/Body/Primary` |
| fill | Hover | `Text Color/Action/Link` · `Text Color/Body/Primary` | `Text Color/Action/Link` · `Text Color/Body/Primary` | `Text Color/Action/Link` · `Text Color/Body/Primary` | `Text Color/Action/Link` · `Text Color/Body/Primary` |
| fill | Focus | `Text Color/Action/Link` · `Text Color/Body/Primary` | `Text Color/Body/Secondary` | `Text Color/Action/Link` · `Text Color/Body/Primary` | `Text Color/Action/Link` · `Text Color/Body/Primary` |

**When Disabled = true**

| Property | State | Default | Uploading | Upload Complete | Upload Complete (Slot) |
|---|---|---|---|---|---|
| fill | Default | `Text Color/Body/Secondary` · `Text Color/Semantic/Disabled` | `Text Color/Body/Secondary` | `Text Color/Body/Primary` | — |
| fill | Hover | `Text Color/Action/Link` | `Text Color/Action/Link` | `Text Color/Body/Primary` | — |
| fill | Focus | `Text Color/Body/Secondary` · `Text Color/Semantic/Disabled` | `Text Color/Body/Secondary` | `Text Color/Body/Primary` | — |

#### Image Uploader

| Property | Condition | Token |
|---|---|---|
| border | Style=Upload Complete · Upload Complete (Slot), States=Default, Danger=False | `Border Color/Input Field/Input Field` |
| border | Style=Upload Complete, States=Focus, Danger=False | `Border Color/Input Field/Input Field` |

#### Image Container

| Property | State | Default | Uploading | Upload Complete | Upload Complete (Slot) |
|---|---|---|---|---|---|
| border | Default | `Border Color/Input Field/Input Field` | `Border Color/Input Field/Input Field` | `Border Color/Input Field/Input Field` | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` | `Border Color/Input Field/Input Field (Hover)` | `Border Color/Input Field/Input Field` | — |
| border | Focus | `Border Color/Input Field/Input Field` | `Border Color/Input Field/Input Field` | `Border Color/Input Field/Input Field` | `Border Color/Input Field/Input Field` |
| fill | Default | `Background/Surface/Tertiary` | `Background/Surface/Primary` | `Background/Surface/Tertiary` | — |
| fill | Hover | `Background/Surface/Secondary` | `Background/Surface/Secondary` | — | — |
| fill | Focus | `Background/Surface/Tertiary` | `Background/Surface/Primary` | — | — |

**When Danger = True**

| Property | State | Default | Uploading | Upload Complete | Upload Complete (Slot) |
|---|---|---|---|---|---|
| border | Default | `Border Color/Input Field/Input Field Danger` | `Border Color/Input Field/Input Field Danger` | `Border Color/Input Field/Input Field Danger` | `Border Color/Input Field/Input Field Danger` |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` | — | `Border Color/Input Field/Input Field Danger` | — |
| border | Focus | `Border Color/Input Field/Input Field Danger` | `Border Color/Input Field/Input Field Danger` | `Border Color/Input Field/Input Field Danger` | `Border Color/Input Field/Input Field Danger` |
| fill | Default | `Background/Surface/Tertiary` | `Background/Surface/Primary` | `Background/Surface/Primary` | — |
| fill | Hover | `Background/Surface/Secondary` | `Background/Surface/Secondary` | `Background/Surface/Secondary` | `Background/Surface/Secondary` |
| fill | Focus | `Background/Surface/Tertiary` | `Background/Surface/Primary` | `Background/Surface/Primary` | — |

**When Disabled = true**

| Property | State | Default | Uploading | Upload Complete | Upload Complete (Slot) |
|---|---|---|---|---|---|
| border | Default | `Border Color/Input Field/Input Field Disabled` | — | `Border Color/Input Field/Input Field` | — |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` | `Border Color/Input Field/Input Field (Hover)` | `Border Color/Input Field/Input Field (Hover)` | `Border Color/Input Field/Input Field (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field Disabled` · `Border Color/Input Field/Input Field` | `Border Color/Input Field/Input Field` | `Border Color/Input Field/Input Field` | `Border Color/Input Field/Input Field` |
| fill | Default | `Background/Surface/Tertiary` | `Background/Surface/Primary` | `Background/Surface/Tertiary` | — |
| fill | Hover | `Background/Surface/Secondary` | `Background/Surface/Secondary` | — | — |
| fill | Focus | `Background/Surface/Tertiary` | `Background/Surface/Primary` | — | — |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | States=Focus, Danger=False | `Border Color/Action/Action` |
| border | States=Focus, Danger=True | `Border Color/Semantic/Danger` |

#### Button Icon

| Property | Condition | Token |
|---|---|---|
| fill | Style=Upload Complete, States=Hover · Focus, Danger=False | `Background/Action/Action Tertiary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Style=Default · Upload Complete, Danger=False | `Text Color/Body/Primary` |
| fill | Style=Default, Danger=True | `Text Color/Body/Primary` |
| fill | Style=Upload Complete, Danger=True | `Text Color/Semantic/Error` |

#### Button (Link)

| Property | Condition | Token |
|---|---|---|
| fill | Style=Default · Uploading · Upload Complete | `Background/Transparent` |

#### {Secondary text}

| Property | Condition | Token |
|---|---|---|
| fill | Style=Default · Uploading · Upload Complete | `Text Color/Body/Primary` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Danger=True | `Text Color/Semantic/Error` |

#### Background

| Property | Condition | Token |
|---|---|---|
| fill | Style=Uploading | `Background/Loading/Loading Track` |

#### Progress Indicator

| Property | Condition | Token |
|---|---|---|
| fill | Style=Uploading | `Background/Loading/Loading Progress` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Optional | fill | `Text Color/Body/Secondary` |
| Required* | fill | `Text Color/Semantic/Error` |
| Hint | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Danger=False | `Label/S` |
| Label | typography | Danger=True | `Action/S` |
| Label | typography | Danger=True | `Label/S` |
| Label | typography | Style=Default · Uploading, Danger=False | `Action/S` |
| Optional | typography | — | `Label/S` |
| Required* | typography | — | `Label/S` |
| Hint | font-size | — | `font-size/fs-150` |
| Hint | font-family | — | `font-family/font-family` |
| Hint | line-height | — | `line-height/lh-250` |
| Hint | font-weight | — | `font-weight/fw-400` |
| Replace Me | typography | States=Hover, Disabled=true | `[ARCHIVE]/*Mobile/Field Label` |
| {Secondary text} | font-size | Style=Default · Uploading · Upload Complete | `font-size/fs-150` |
| {Secondary text} | font-family | Style=Default · Uploading · Upload Complete | `font-family/font-family` |
| {Secondary text} | line-height | Style=Default · Uploading · Upload Complete | `line-height/lh-250` |
| {Secondary text} | font-weight | Style=Default · Uploading · Upload Complete | `font-weight/fw-400` |
| Error Message | font-size | Danger=True | `font-size/fs-150` |
| Error Message | font-family | Danger=True | `font-family/font-family` |
| Error Message | line-height | Danger=True | `line-height/lh-250` |
| Error Message | font-weight | Danger=True | `font-weight/fw-400` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | Style=Upload Complete, States=Hover · Focus, Danger=False | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded cornerRadius (8px)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **Image Uploader**: hardcoded color (no variable or style)
- **Image Uploader**: hardcoded cornerRadius (8px)
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
