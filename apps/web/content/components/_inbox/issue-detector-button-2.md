---
spec_version: "0.1"
component:
  name: Issue Detector Button
  figma_key: 412c2cb378119d2e1c74c0421dea54d5223da850
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26926:14478
content_hash: f64fe2cfe85d991b1a2a9bf134601a4a1e37913069998c62beea25c425cba834
extracted_at: 2026-06-14T10:03:15.005Z
---

## Definition

_To be written._

## Anatomy

1. Button (component)

## Configuration

_None._

## Variants

- **Type**: No Issues · Issues Detected (default) · Critical Issues Detected

## States

- Default
- Hover

## Tokens used

### Color

#### Button

| Property | State | No Issues | Issues Detected | Critical Issues Detected |
|---|---|---|---|---|
| fill | Default | `Background/Semantic/Status → Success` | `Background/Semantic/Status → Warning` | `Background/Semantic/Status → Error` |
| fill | Hover | `Background/Semantic/Status → Success -> Hover` | `Background/Semantic/Status → Warning -> Hover` | `Background/Semantic/Status → Error -> Hover` |
| border | Default | `Border Color/Banner/Banner Success` | `Border Color/Banner/Banner Warning` | `Border Color/Banner/Banner Danger` |
| border | Hover | `Border Color/Banner/Banner Success` | `Border Color/Banner/Banner Warning` | `Border Color/Banner/Banner Danger` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Type=No Issues | `Text Color/Semantic/Success` |
| fill | Type=Issues Detected | `Text Color/Semantic/Warning` |
| fill | Type=Critical Issues Detected | `Text Color/Semantic/Error` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Type=No Issues | `Text Color/Semantic/Success` |
| fill | Type=Issues Detected | `Text Color/Semantic/Warning` |
| fill | Type=Critical Issues Detected | `Text Color/Semantic/Error` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Action/M` |

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

- [Button](./button.md)

## Extraction gaps

- **Container**: hardcoded color (no variable or style)
- **Button**: hardcoded itemSpacing (8px)
- **Button**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
