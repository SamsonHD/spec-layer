---
spec_version: "0.1"
component:
  name: Column Header
  figma_key: 56070626e415709eea00d3cd17e4a32944df597b
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24728:3970
content_hash: 9620f247d9d2bdba13eddc376a3eb5cf710889bc0adf45c1adeae7f05d873f8e
extracted_at: 2026-06-14T10:03:12.489Z
---

## Definition

_To be written._

## Anatomy

1. Left-Bias
2. iconWrapper (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Checkbox | boolean | true / false | false |
| IconLeft | boolean | true / false | false |
| IconRight | boolean | true / false | false |
| Text | boolean | true / false | true |
| -- Data | text | — | Header Label |
| Menu Control | boolean | true / false | true |
| Sorting | boolean | true / false | true |

## Variants

- **Right-Align**: Off (default) · On

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Table/Table Header` |
| Container | border | `Border Color/Divider/Table Divider` |
| Label | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Table/Header` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (16px)
- **Container**: hardcoded padding
- **Left-Bias**: hardcoded itemSpacing (8px)
- **Left-Bias**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Checkbox**: hardcoded color (no variable or style)
- **Checkbox**: hardcoded itemSpacing (8px)
- **Check Wrapper**: hardcoded cornerRadius (2px)
- **Check**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
