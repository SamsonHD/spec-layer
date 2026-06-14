---
spec_version: "0.1"
component:
  name: Signature Capture (Typed)
  figma_key: f9aa61876d09f5a00674156a078146fdebdc1105
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 12747:90239
content_hash: acc8b8f79aaf4fd5493a43533538d98da51eb40a5f66a9b03b18ac08a7174579
extracted_at: 2026-06-14T10:04:11.596Z
---

## Definition

_To be written._

## Anatomy

1. Input and font selection
2. Signature Capture (Typed)/Signature Preview (component)

## Configuration

_None._

## Variants

- **Modifiers**: Error · Signed · Mobile

## States

- Default

## Tokens used

### Color

#### Input

| Property | Condition | Token |
|---|---|---|
| fill | — | `Background/Surface/Primary` |
| border | Error=False | `Border Color/Input Field/Input Field` |
| border | Error=True | `Border Color/Input Field/Input Field Danger` |

#### Text Content

| Property | Condition | Token |
|---|---|---|
| fill | Signed=False | `Text Color/Input/Input Placeholder` |
| fill | Signed=True | `Text Color/Body/Primary` |

#### Joseph Michael Straczynski

| Property | Condition | Token |
|---|---|---|
| fill | Signed=True | `Text Color/Body/Primary` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Error=True | `Text Color/Semantic/Error` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Label | fill | `Text Color/Action/On Secondary` |
| Label | fill | `Text Color/Body/Primary` |
| Button | fill | `Background/Action/Action Secondary` |
| Button | border | `Border Color/Action/Action` |
| Signature Preview: | fill | `Text Color/Body/Primary` |
| Preview Area | fill | `Background/Surface/Secondary` |
| Preview Area | border | `Border Color/Divider/Divider` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Action/M` |
| Label | typography | — | `Label/S` |
| Text Content | typography | — | `Value/S` |
| Signature Preview: | typography | — | `Label/M` |
| Error Message | font-size | Error=True | `font-size/fs-150` |
| Error Message | font-family | Error=True | `font-family/font-family` |
| Error Message | line-height | Error=True | `line-height/lh-250` |
| Error Message | font-weight | Error=True | `font-weight/fw-400` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Signature Capture (Typed)/Signature Preview](./signature-capture-typed-signature-preview.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (24px)
- **Input and font selection**: hardcoded itemSpacing (24px)
- **Input Field**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Change Typeface**: hardcoded itemSpacing (10px)
- **Button**: hardcoded itemSpacing (8px)
- **Button**: hardcoded padding
- **Signature Capture (Typed)/Signature Preview**: hardcoded itemSpacing (8px)
- **Label Wrapper**: hardcoded itemSpacing (10px)
- **Preview Area**: hardcoded cornerRadius (8px)
- **Preview Area**: hardcoded padding
- **Joseph Michael Straczynski**: hardcoded color (no variable or style)
- **Joseph Michael Straczynski**: no text style or typography variable
