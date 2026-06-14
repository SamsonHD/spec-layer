---
spec_version: "0.1"
component:
  name: Radio Group
  figma_key: 8921aad418a61bc615b0321bc88a70de209f1f41
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7867:321477
content_hash: ba0f004ee9a579ba0442c6bdbc7794b36787a9ee91bf608888ea2ec0f3803451
extracted_at: 2026-06-14T10:04:05.556Z
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
| Radio Control | fill | `Background/Surface/Primary` |
| Radio Control | border | `Border Color/Input Field/Input Field` |

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
- **Radio**: hardcoded itemSpacing (8px)
- **Radio Control**: hardcoded itemSpacing (10px)
- **Radio Control**: hardcoded cornerRadius (9999px)
- **Label**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Error Wrapper**: hardcoded itemSpacing (10px)
- **Error Wrapper**: hardcoded padding
