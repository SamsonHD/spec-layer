---
spec_version: "0.1"
component:
  name: WidgetTask
  figma_key: f2dd2910550ae8b6dfc24d6fa7d10149f461589d
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25929:3449
content_hash: 1234a3e698a4551d5013b5890c68ab87c73a9a2c228dc2c12d3ce37116f6d753
extracted_at: 2026-06-14T10:04:19.081Z
---

## Definition

_To be written._

## Anatomy

1. Content
2. Chip + Chevron

## Configuration

_None._

## Variants

- **Module**: Payroll (default) · TAA
- **Modifiers**: Default · Hover · Wire hold · Processing · Single Pay Group

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| fill | — | `Background/Surface/Primary` |
| border | Hover=False | `Border Color/Divider/Divider Secondary` |
| border | Hover=True | `Border Color/Divider/Divider` |

#### ChipStatus

| Property | Token |
|---|---|
| fill | `Background/Semantic/Status → Warning` · `Background/Сhip/Chip Neutral` |

**When Default = False**

| Property | Token |
|---|---|
| fill | `Background/Semantic/Status → Informational` |

**When Wire hold = True**

| Property | Token |
|---|---|
| fill | `Background/Semantic/Status → Warning` · `Background/Сhip/Chip Neutral` |

#### icon

| Property | Token |
|---|---|
| fill | `Text Color/Body/Primary` |

**When Default = False**

| Property | Token |
|---|---|
| fill | `Text Color/Body/Primary` · `Text Color/Action/Link Secondary` |

**When Wire hold = True**

| Property | Token |
|---|---|
| fill | `Text Color/Body/Primary` |

**When Single Pay Group = True**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Warning` |

#### Label

| Property | Token |
|---|---|
| fill | `Text Color/Body/Primary` · `Text Color/Semantic/Warning` |

**When Default = False**

| Property | Token |
|---|---|
| fill | `Text Color/Action/Link Secondary` |

**When Wire hold = True**

| Property | Token |
|---|---|
| fill | `Text Color/Body/Primary` · `Text Color/Semantic/Warning` |

**When Single Pay Group = True**

| Property | Token |
|---|---|
| fill | `Text Color/Action/On Action` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Wire hold=True, Single Pay Group=True | `Text Color/Action/On Action` |

#### Button

| Property | Condition | Token |
|---|---|---|
| fill | Single Pay Group=True | `Background/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Bi-weekly Salary | fill | `Text Color/Body/Primary` |
| Mar 14 - Mar 21, 2026 | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Bi-weekly Salary | typography | — | `Subtitle/M` |
| Label | typography | — | `Chip/S` |
| Label | typography | Single Pay Group=True | `Action/S` |
| Mar 14 - Mar 21, 2026 | typography | — | `Caption/S - Compact` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | Wire hold=False, Processing=False | `rounded-8` |
| Button Icon | border-radius | Single Pay Group=False | `rounded-8` |
| Button | border-radius | Single Pay Group=True | `rounded-8` |
| Button | padding-x | Single Pay Group=True | `size-16` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (24px)
- **Container**: hardcoded padding
- **Content**: hardcoded itemSpacing (4px)
- **Content**: hardcoded padding
- **WrapperTextChip**: hardcoded itemSpacing (8px)
- **ChipStatus**: hardcoded itemSpacing (8px)
- **ChipStatus**: hardcoded cornerRadius (9999px)
- **ChipStatus**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Circle**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Xmark Large**: hardcoded color (no variable or style)
- **Chip + Chevron**: hardcoded itemSpacing (8px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
