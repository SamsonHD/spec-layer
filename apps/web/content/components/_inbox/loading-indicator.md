---
spec_version: "0.1"
component:
  name: Loading Indicator
  figma_key: 93f5fcf1364a5516f17e85987888ae7329515e2d
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 6280:349410
content_hash: 291ca7e1fa45b85ddc7090306451bfe48015c0261f51486c82c29ceea1f2770b
extracted_at: 2026-06-14T10:03:57.999Z
---

## Definition

_To be written._

## Anatomy

1. Indicator Wrapper
2. Text Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Text | boolean | true / false | true |
| Show Note | boolean | true / false | true |
| Status Msg | text | — | { status-msg } |
| Note | text | — | { note } |
| Data | text | — | { % or size } |
| Show Data | boolean | true / false | false |
| Show Label | boolean | true / false | true |

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
| { note } | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| { status-msg } | typography | — | `Subtitle/L - Strong` |
| { note } | typography | — | `Value/S` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Loading Indicator**: hardcoded itemSpacing (16px)
- **Indicator Wrapper**: hardcoded itemSpacing (10px)
- **.loading-indicator-shapes**: hardcoded itemSpacing (10px)
- **Background**: hardcoded cornerRadius (9999px)
- **Progress Indicator**: hardcoded cornerRadius (9999px)
- **Text Wrapper**: hardcoded itemSpacing (8px)
- **Label Wrapper**: hardcoded itemSpacing (12px)
