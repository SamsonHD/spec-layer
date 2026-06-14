---
spec_version: "0.1"
component:
  name: Checkbox Group
  figma_key: 528194b8bb5b882b415512d5b28c0053e7874591
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7859:321735
content_hash: a7b9876ae40848d60c715dbc9ca16067f9c59430d95c6d709a10489cc488faab
extracted_at: 2026-06-14T10:03:26.131Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Checkbox Options

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Error | text | — | Error message here. |
| Hint | text | — | Help text goes here. |
| Show Hint | boolean | true / false | false |
| Label | text | — | Label |
| Optional | boolean | true / false | false |
| Required | boolean | true / false | false |
| Show Label | boolean | true / false | true |
| Show Error | boolean | true / false | false |
| Option 2 | boolean | true / false | true |
| Option 3 | boolean | true / false | false |
| Option 4 | boolean | true / false | false |
| Option 5 | boolean | true / false | false |
| Option 6 | boolean | true / false | false |
| Option 7 | boolean | true / false | false |

## Variants

- **Layout**: Vertical (default) · Horizontal

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Label | fill | `Text Color/Body/Primary` |
| Check Wrapper | fill | `Background/Surface/Primary` |
| Check Wrapper | border | `Border Color/Input Field/Input Field` |
| Vector | fill | `Text Color/Body/Inverted → Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Label/S` |
| Label | typography | — | `Value/M` |

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
- **Checkbox Options**: hardcoded itemSpacing (16px)
- **Checkbox**: hardcoded color (no variable or style)
- **Checkbox**: hardcoded itemSpacing (8px)
- **Check Wrapper**: hardcoded cornerRadius (4px)
- **Check**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Error Wrapper**: hardcoded itemSpacing (10px)
- **Error Wrapper**: hardcoded padding
