---
spec_version: "0.1"
component:
  name: Signature Capture (Typed)/Signature Preview
  figma_key: 92af6e367e467c058573eebc7d4ee0c9ca169476
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 12747:90234
content_hash: 3d196d65234c203e734c06681bbc3b760ebfa666b433a3795aa5126d27195e2b
extracted_at: 2026-06-14T10:04:11.596Z
---

## Definition

_To be written._

## Anatomy

1. Label Wrapper
2. Preview Area

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Shows Label | boolean | true / false | true |
| Label | text | — | Signature Preview: |
| Show Signature | boolean | true / false | false |
| Name | text | — | Joseph Michael Straczynski |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Signature Preview: | fill | `Text Color/Body/Primary` |
| Preview Area | fill | `Background/Surface/Secondary` |
| Preview Area | border | `Border Color/Divider/Divider` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Signature Preview: | typography | — | `Label/M` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Signature Capture (Typed)/Signature Preview**: hardcoded itemSpacing (8px)
- **Label Wrapper**: hardcoded itemSpacing (10px)
- **Preview Area**: hardcoded cornerRadius (8px)
- **Preview Area**: hardcoded padding
- **Joseph Michael Straczynski**: hardcoded color (no variable or style)
- **Joseph Michael Straczynski**: no text style or typography variable
