---
spec_version: "0.1"
component:
  name: Rich Text Editor
  figma_key: c5e8725cd6cb9795489d933807c858c636e412aa
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 6825:286669
content_hash: 38ad2307b068469f66e684daf81ceb0f7596ac0b2cabf37aae52b3ac0d7adc75
extracted_at: 2026-06-14T10:07:43.768Z
---

## Definition

_To be written._

## Anatomy

1. Header Wrapper
2. Editor Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Help Text | text | — | Help text goes here. |
| Required | boolean | true / false | false |
| Optional | boolean | true / false | false |
| Label | text | — | Label |
| Show Help Text | boolean | true / false | true |
| Show Label | boolean | true / false | true |
| Desktop | boolean | true / false | true |

## Variants

- **Stack**: Vertical (default) · Horizontal

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Label | fill | `Text Color/Body/Primary` |
| Hint | fill | `Text Color/Body/Secondary` |
| .ribbon-button | fill | `Background/Surface/Primary` |
| .ribbon-button | border | `Border Color/Input Field/Input Field` |
| Vector | fill | `Text Color/Body/Primary` |
| Vector | fill | `Text Color/Body/Secondary` |
| Rectangle 7235 | fill | `Background/Divider/Divider` |
| Color Swatch | fill | `Text Color/Body/Primary` |
| Color Swatch | border | `Border Color/Action/Secondary Button (Disabled)` |
| Input | fill | `Background/Surface/Primary` |
| Input | border | `Border Color/Input Field/Input Field` |
| text | fill | `Text Color/Input/Input Placeholder` |
| character counter | fill | `Background/Textarea Count` |
| Actual Input # of Words | fill | `Text Color/Body/Inverted → Primary` |
| / | fill | `Text Color/Body/Inverted → Primary` |
| Max Input # of Words | fill | `Text Color/Body/Inverted → Primary` |
| line | fill | `Background/Divider/Divider` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `[ARCHIVE]/*Mobile/Field Label` |
| Hint | typography | — | `[ARCHIVE]/Footnote1/Short` |
| text | typography | — | `Value/M` |
| Actual Input # of Words | typography | — | `[ARCHIVE]/Footnote1/Short` |
| / | typography | — | `[ARCHIVE]/Footnote1/Short` |
| Max Input # of Words | typography | — | `[ARCHIVE]/Footnote1/Short` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Color Swatch | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (16px)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Editor Wrapper**: hardcoded itemSpacing (12px)
- **.rich-text-ribbon**: hardcoded itemSpacing (8px)
- **Source Editor**: hardcoded itemSpacing (8px)
- **.ribbon-button**: hardcoded itemSpacing (8px)
- **.ribbon-button**: hardcoded cornerRadius (4px)
- **.ribbon-button**: hardcoded padding
- **Display Code**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Chevron Down**: hardcoded color (no variable or style)
- **Divider**: hardcoded itemSpacing (10px)
- **Text Size**: hardcoded color (no variable or style)
- **Bold**: hardcoded color (no variable or style)
- **Italic**: hardcoded color (no variable or style)
- **Underline**: hardcoded color (no variable or style)
- **Strikethrough**: hardcoded color (no variable or style)
- **Code Simple**: hardcoded color (no variable or style)
- **Text**: hardcoded color (no variable or style)
- **Align Left**: hardcoded color (no variable or style)
- **List Ul**: hardcoded color (no variable or style)
- **Indent**: hardcoded color (no variable or style)
- **Outdent**: hardcoded color (no variable or style)
- **Link**: hardcoded color (no variable or style)
- **Rectangle Code**: hardcoded color (no variable or style)
- **Image**: hardcoded color (no variable or style)
- **Text Slash**: hardcoded color (no variable or style)
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **Character Counter**: hardcoded padding
- **character counter**: hardcoded cornerRadius (4px)
- **character counter**: hardcoded padding
- **container**: hardcoded color (no variable or style)
