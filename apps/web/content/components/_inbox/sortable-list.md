---
spec_version: "0.1"
component:
  name: Sortable List
  figma_key: fb17107cce30606e9783b8c48808d449115d5a0e
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 12747:118230
content_hash: b73ac22cc3f5e99a96024fe1568fae46d1046b9b4784b772e3c945b067904a21
extracted_at: 2026-06-14T10:07:43.752Z
---

## Definition

_To be written._

## Anatomy

1. Section Title (component)
2. Actions
3. Empty State

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Title | boolean | true / false | true |
| Error Message | text | — | Error message here. |
| Empty Message | text | — | Selected fields will appear here, where you can customize the order before exporting to your reports. |
| Show Popover | boolean | true / false | false |

## Variants

- **Modifiers**: Empty · Error

## States

- Default

## Tokens used

### Color

#### Button Icon

| Property | Token |
|---|---|
| border | `Border Color/Action/Link` |

**When Empty = False**

| Property | Token |
|---|---|
| border | `Border Color/Action/Link` |
| fill | `Background/Action/Action Tertiary` |

**When Error = True**

| Property | Token |
|---|---|
| border | `Border Color/Semantic/Danger` |
| fill | `Background/Action/Action Secondary` |

#### icon

| Property | Token |
|---|---|
| fill | `Text Color/Action/Link` |

**When Empty = False**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Danger Link` |

**When Error = True**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Danger Link` |

#### Label

| Property | Token |
|---|---|
| fill | `Text Color/Action/Link` |

**When Empty = False**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Danger Link` |

**When Error = True**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Danger Link` |

#### Empty State

| Property | Condition | Token |
|---|---|---|
| border | Empty=True, Error=False | `Border Color/Input Field/Input Field` |
| border | Empty=True, Error=True | `Border Color/Input Field/Input Field Danger` |

#### Message

| Property | Condition | Token |
|---|---|---|
| fill | Empty=True | `Text Color/Body/Primary` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Error=True | `Text Color/Semantic/Error` |

#### Ordering List

| Property | Condition | Token |
|---|---|---|
| fill | Empty=False | `Background/Transparent` |

#### Moveable Tile

| Property | Condition | Token |
|---|---|---|
| fill | Empty=False | `Background/Tile/Tile` |
| border | Empty=False | `Border Color/Tile/Tile` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Title | fill | `Text Color/Body/Primary` |
| Description | fill | `Text Color/Body/Secondary` |
| Button (Link) | fill | `Background/Transparent` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | — | `[ARCHIVE]/*Mobile/Heading5` |
| Description | typography | — | `[ARCHIVE]/*Tablet Portrait/Paragraph2/Short` |
| Label | typography | — | `Action/M` |
| Label | typography | Empty=False | `[ARCHIVE]/*Mobile/Input Field Value` |
| Message | typography | Empty=True | `[ARCHIVE]/*Mobile/Field Label Small` |
| Error Message | typography | Error=True | `[ARCHIVE]/Footnote1/Short` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Section Title](./section-title.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (24px)
- **Section Title**: hardcoded itemSpacing (4px)
- **Title**: hardcoded itemSpacing (8px)
- **Left Icon**: hardcoded padding
- **Right Icon**: hardcoded padding
- **Description Wrapper**: hardcoded itemSpacing (8px)
- **<spacer>**: hardcoded color (no variable or style)
- **Actions**: hardcoded itemSpacing (16px)
- **Button (Link)**: hardcoded itemSpacing (8px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Spacer**: hardcoded itemSpacing (10px)
- **Spacer**: hardcoded padding
- **Popover**: hardcoded cornerRadius (8px)
- **Content Wrapper**: hardcoded cornerRadius (8px)
- **Content Wrapper**: hardcoded padding
- **Sortable List - Items**: hardcoded itemSpacing (24px)
- **Title & Search**: hardcoded itemSpacing (12px)
- **Input Field**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Wrapper**: hardcoded itemSpacing (8px)
- **Wrapper**: hardcoded cornerRadius (4px)
- **Actions**: hardcoded itemSpacing (12px)
- **Actions**: hardcoded padding
- **Checkbox**: hardcoded color (no variable or style)
- **Checkbox**: hardcoded itemSpacing (8px)
- **Check Wrapper**: hardcoded cornerRadius (2px)
- **Check**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Divider**: hardcoded itemSpacing (10px)
- **Divider**: hardcoded padding
- **List**: hardcoded itemSpacing (16px)
- **List**: hardcoded padding
- **Check Wrapper**: hardcoded cornerRadius (4px)
- **Union**: hardcoded color (no variable or style)
- **Rectangle 7269**: hardcoded color (no variable or style)
- **Rectangle 7270**: hardcoded color (no variable or style)
- **Rectangle 7271**: hardcoded color (no variable or style)
- **Rectangle 7272**: hardcoded color (no variable or style)
- **Empty State**: hardcoded itemSpacing (10px)
- **Empty State**: hardcoded cornerRadius (8px)
- **Empty State**: hardcoded padding
