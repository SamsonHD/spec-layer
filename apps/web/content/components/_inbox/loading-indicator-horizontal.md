---
spec_version: "0.1"
component:
  name: Loading Indicator Horizontal
  figma_key: 8167fe693aafcfb7ed72c29ef50422bb6b2630bb
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25256:2114
content_hash: e569a6c09e17fbd6b781a76237f5cc9f4bc552787e4423d3843e0141c5e2bd0b
extracted_at: 2026-06-14T10:03:57.999Z
---

## Definition

_To be written._

## Anatomy

1. .loading-indicator-shapes (component)
2. Text Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Text | boolean | true / false | true |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Background | fill | `Background/Loading/Loading Track` |
| Progress Indicator | fill | `Background/Loading/Loading Progress` |
| { status-msg } | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| { status-msg } | typography | — | `Value/S` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.loading-indicator-shapes](./loading-indicator-shapes.md)

## Extraction gaps

- **Loading Indicator Horizontal**: hardcoded itemSpacing (16px)
- **.loading-indicator-shapes**: hardcoded itemSpacing (10px)
- **Background**: hardcoded cornerRadius (9999px)
- **Progress Indicator**: hardcoded cornerRadius (9999px)
- **Text Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded itemSpacing (12px)
