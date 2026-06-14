---
spec_version: "0.1"
component:
  name: Upload List Item
  figma_key: e4da760ce1de9d5164e5f57a61ea3cf331eb0cf4
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 17416:5423
content_hash: 513e920e5388d99a8ff3078da9b000f5ddaab3c26247799dc26dfac1c23a490b
extracted_at: 2026-06-14T10:03:56.220Z
---

## Definition

_To be written._

## Anatomy

1. Doc Name
2. Actions

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Doc Name | text | — | Document Name.doc |
| Error Msg | text | — | Error message here. |
| Previewable | boolean | true / false | true |

## Variants

- **Style**: Uploading (default) · Success · Failed
- **Modifiers**: Disabled · Hover

## States

- Default

## Tokens used

### Color

#### Container

| Property | Uploading | Success | Failed |
|---|---|---|---|
| fill | `Background/Action/Action Tertiary` | `Background/Surface/Secondary` | `Background/Semantic/Status → Error` |

**When Hover = True**

| Property | Uploading | Success | Failed |
|---|---|---|---|
| fill | `Background/Surface/Secondary` | `Background/Surface/Secondary` | `Background/Semantic/Status → Error` · `Background/Action/Action Tertiary (Hover)` |

#### Background

| Property | Condition | Token |
|---|---|---|
| fill | Style=Uploading | `Background/Loading/Loading Track` |

#### Progress Indicator

| Property | Condition | Token |
|---|---|---|
| fill | Style=Uploading | `Background/Loading/Loading Progress` |

#### Document Name.doc

| Property | Condition | Token |
|---|---|---|
| fill | Style=Uploading | `Text Color/Body/Secondary` |
| fill | Style=Success · Failed | `Text Color/Body/Primary` |

#### icon

| Property | Uploading | Success | Failed |
|---|---|---|---|
| fill | `Text Color/Body/Primary` | `Text Color/Body/Primary` · `Text Color/Semantic/Success` | `Text Color/Body/Primary` · `Text Color/Semantic/Error` |

**When Disabled = True**

| Property | Uploading | Success | Failed |
|---|---|---|---|
| fill | — | `Text Color/Semantic/Success` | `Text Color/Semantic/Error` |

**When Hover = True**

| Property | Uploading | Success | Failed |
|---|---|---|---|
| fill | `Text Color/Body/Primary` | `Text Color/Body/Primary` · `Text Color/Semantic/Success` | `Text Color/Body/Primary` · `Text Color/Semantic/Error` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=True, Hover=True | `Text Color/Semantic/Danger Link` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Style=Failed | `Text Color/Semantic/Error` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Button Icon | fill | `Background/Action/Action Tertiary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Document Name.doc | typography | — | `Value/S` |
| Error Message | typography | Style=Failed | `Caption/S` |

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

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded cornerRadius (8px)
- **Container**: hardcoded padding
- **Doc Name**: hardcoded itemSpacing (8px)
- **Indicator**: hardcoded itemSpacing (10px)
- **Loading Indicator - Xtra Small**: hardcoded itemSpacing (16px)
- **Indicator Wrapper**: hardcoded itemSpacing (10px)
- **.loading-indicator-xtra-small**: hardcoded itemSpacing (10px)
- **Ellipse 846**: hardcoded color (no variable or style)
- **Ellipse 847**: hardcoded color (no variable or style)
- **Progress Indicator**: hardcoded color (no variable or style)
- **Rectangle 7253**: hardcoded color (no variable or style)
- **Text Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded itemSpacing (12px)
- **Actions**: hardcoded itemSpacing (4px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
