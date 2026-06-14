---
spec_version: "0.1"
component:
  name: Sortable List - Items
  figma_key: 425daf89ac36e164b417b755903cb69f2c3ef6bb
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 12747:118163
content_hash: 406b38cb7fca2b412aeb872fdb6308b0b0668a66c7c204a565f0bb87e734278c
extracted_at: 2026-06-14T10:07:43.761Z
---

## Definition

_To be written._

## Anatomy

1. Title & Search
2. Actions
3. List

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| 👁 Scroll Bar | boolean | true / false | true |
| Show Title | boolean | true / false | true |
| Show Description | boolean | true / false | true |
| Title | text | — | Title |
| Description | text | — | Secondary information related to this section |
| Show Header | boolean | true / false | true |

## Variants

- **Style**: Drawer · Popover (default)

## States

- Default

## Tokens used

### Color

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | — | `Text Color/Body/Secondary` |
| fill | Style=Drawer | `Text Color/Action/Default` |

#### Button (Link)

| Property | Condition | Token |
|---|---|---|
| fill | Style=Drawer | `Background/Transparent` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Style=Drawer | `Text Color/Action/Default` |
| fill | Style=Popover | `Text Color/Body/Primary` |

#### Selection Tile

| Property | Condition | Token |
|---|---|---|
| fill | Style=Drawer | `Background/Tile/Tile` |
| border | Style=Drawer | `Border Color/Input Field/Input Field` |

#### Title of selection tile

| Property | Condition | Token |
|---|---|---|
| fill | Style=Drawer | `Text Color/Body/Primary` |

#### Check

| Property | Condition | Token |
|---|---|---|
| fill | Style=Drawer | `Background/Surface/Primary` |
| border | Style=Drawer | `Border Color/Input Field/Input Field` |

#### Wrapper

| Property | Condition | Token |
|---|---|---|
| fill | Style=Popover | `Background/Transparent` |

#### Check Wrapper

| Property | Condition | Token |
|---|---|---|
| fill | Style=Popover | `Background/Surface/Primary` |
| border | Style=Popover | `Border Color/Input Field/Input Field` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Style=Popover | `Text Color/Body/Inverted → Primary` |

#### Rectangle 7235

| Property | Condition | Token |
|---|---|---|
| fill | Style=Popover | `Background/Divider/Divider` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Title | fill | `Text Color/Body/Primary` |
| Description | fill | `Text Color/Body/Secondary` |
| Input | fill | `Background/Surface/Primary` |
| Input | border | `Border Color/Input Field/Input Field` |
| Text Content | fill | `Text Color/Input/Input Placeholder` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | — | `[ARCHIVE]/*Mobile/Heading6` |
| Description | typography | — | `[ARCHIVE]/*Tablet Portrait/Paragraph2/Short` |
| Text Content | typography | — | `Value/S` |
| Label | typography | Style=Drawer | `Action/S` |
| Label | typography | Style=Popover | `Value/M` |
| Label | typography | Style=Popover | `Value/S` |
| Title of selection tile | typography | Style=Drawer | `Subtitle/M` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (24px)
- **Title & Search**: hardcoded itemSpacing (12px)
- **Section Title**: hardcoded itemSpacing (4px)
- **Input Field**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Actions**: hardcoded itemSpacing (12px)
- **Button (Link)**: hardcoded itemSpacing (4px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
- **List**: hardcoded itemSpacing (8px)
- **Selection Tile**: hardcoded itemSpacing (24px)
- **Selection Tile**: hardcoded cornerRadius (8px)
- **Selection Tile**: hardcoded padding
- **Content Wrapper**: hardcoded itemSpacing (12px)
- **Title + Select Wrapper**: hardcoded itemSpacing (16px)
- **Selection Wrapper**: hardcoded itemSpacing (10px)
- **Selection Wrapper**: hardcoded padding
- **⚠️ [Deprecated] Checkbox**: hardcoded color (no variable or style)
- **.checkbox Wrapper**: hardcoded itemSpacing (8px)
- **Check Wrapper**: hardcoded itemSpacing (10px)
- **Check**: hardcoded cornerRadius (2px)
- **Checkmark**: hardcoded color (no variable or style)
- **Optional note**: hardcoded itemSpacing (16px)
