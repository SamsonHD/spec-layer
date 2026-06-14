---
spec_version: "0.1"
component:
  name: StatCardProgress
  figma_key: b2ee86f87ce18de4224c4b74f17f16583d01a4c0
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25159:1715
content_hash: 3e1cdd9e96c534e3b41ee63f928dd56832beedd2d13768750db8d78b542013c4
extracted_at: 2026-06-14T10:04:19.086Z
---

## Definition

_To be written._

## Anatomy

1. label + icon
2. Title + Loader

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Info Icon | boolean | true / false | false |
| Legend | boolean | true / false | false |
| Value Info Icon | boolean | true / false | false |

## Variants

- **Subline**: Default (default)
- **Modifiers**: Warning · Error

## States

- Default

## Tokens used

### Color

#### Container

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |

**When Warning = true**

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` · `Background/Semantic/Status → Warning` |

**When Error = true**

| Property | Token |
|---|---|
| fill | `Background/Semantic/Status → Error` · `Background/Surface/Primary` |

#### warning-line

| Property | Condition | Token |
|---|---|---|
| border | Warning=false | `Border Color/Semantic/Danger` |
| border | Warning=true | `Text Color/Semantic/Warning` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Title | fill | `Text Color/Body/Secondary` |
| Body | fill | `Text Color/Action/On Secondary` |
| Background | fill | `Background/Loading/Loading Track` |
| Progress Indicator | fill | `Background/Loading/Loading Progress` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | — | `Subtitle/S` |
| Body | typography | — | `Heading/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Container | effects | — | `light/Shadow/Card` |

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
- **Container**: hardcoded padding
- **label + icon**: hardcoded itemSpacing (4px)
- **Frame 1**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Title + Loader**: hardcoded itemSpacing (12px)
- **Frame 2**: hardcoded itemSpacing (8px)
- **Loading Indicator**: hardcoded itemSpacing (16px)
- **Indicator Wrapper**: hardcoded itemSpacing (10px)
- **.loading-indicator-shapes**: hardcoded itemSpacing (10px)
- **Background**: hardcoded cornerRadius (9999px)
- **Progress Indicator**: hardcoded cornerRadius (9999px)
- **Text Wrapper**: hardcoded itemSpacing (8px)
- **Label Wrapper**: hardcoded itemSpacing (12px)
