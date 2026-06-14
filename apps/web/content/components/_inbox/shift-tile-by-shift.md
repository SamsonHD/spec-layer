---
spec_version: "0.1"
component:
  name: Shift Tile / By Shift
  figma_key: e998cda3575c100e2a84a9ee880a2d519264acd6
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26823:13131
content_hash: 3ed2a30943a2d5855c41c79ec7e3cead4885050b33b83c107a1f8e39489ca483
extracted_at: 2026-06-14T10:04:36.235Z
---

## Definition

_To be written._

## Anatomy

1. Avatar Container
2. Title
3. Time
4. Location

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show avatar | boolean | true / false | true |
| Time | text | — | 9:00 AM – 5:00 PM |
| Overnight shift | boolean | true / false | false |
| Show alert | boolean | true / false | false |
| Open tag | boolean | true / false | false |
| Employee | text | — | Alice Johnson |
| Value | text | — | $750 |
| Open Shift | boolean | true / false | false |
| Show Value | boolean | true / false | true |

## Variants

- **Density**: Compact (default) · Default
- **Color**: Blue · Green · Gray · Purple · Red · Orange (default) · Teal · Pink · Indigo · Cyan · Lime · Magenta · Brown
- **Type**: Shift (default) · Time Off
- **Selected**: False (default)
- **Drag**: False (default)
- **Modifiers**: Published · Hover · Time Off · Unavailable

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| border | Color=Gray, Published=True | `Border Color/Input Field/Input Field Disabled` |
| border | Color=Gray, Published=False | `color/grey/500` |
| border | Color=Teal, Published=True | `Text Color/Body/White` |

#### Employee

| Property | Condition | Token |
|---|---|---|
| fill | Published=True, Time Off=False, Unavailable=False | `Text Color/Body/White` |
| fill | Published=False | `color/grey/700` |
| fill | Unavailable=True | `Text Color/Semantic/Disabled` |

#### Time

| Property | Condition | Token |
|---|---|---|
| fill | Published=True, Time Off=False, Unavailable=False | `Text Color/Body/White` |
| fill | Published=False | `color/grey/700` |
| fill | Unavailable=True | `Text Color/Semantic/Disabled` |

#### Location

| Property | Token |
|---|---|
| fill | `Text Color/Body/White` |

**When Published = False**

| Property | Compact | Default |
|---|---|---|
| fill | `color/grey/700` | `color/grey/500` |

**When Unavailable = True**

| Property | Compact | Default |
|---|---|---|
| fill | — | `Text Color/Semantic/Disabled` |

#### Button Icon

| Property | Condition | Token |
|---|---|---|
| fill | Hover=True | `Background/Surface/Inverted → Secondary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Hover=True | `Text Color/Body/White` |
| fill | Density=Compact, Unavailable=True | `Text Color/Semantic/Disabled` |

#### Status Stripe

| Property | Condition | Token |
|---|---|---|
| fill | Published=False, Type=Time Off | `color/grey/500` |

#### ChipShift

| Property | Condition | Token |
|---|---|---|
| fill | Published=True, Type=Time Off | `Background/Semantic/Status → Warning` |

#### Pending

| Property | Condition | Token |
|---|---|---|
| fill | Published=True, Type=Time Off | `Text Color/Semantic/Warning` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Employee | typography | — | `Caption/S - Extra Strong` |
| Time | typography | — | `Caption/XS - Strong` |
| Location | typography | — | `Caption/XS` |
| Pending | typography | Published=True, Type=Time Off | `Caption/XS - Strong` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-4` |
| Button Icon | border-radius | Hover=True | `rounded-8` |
| ChipShift | border-radius | Published=True, Type=Time Off | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded color (no variable or style)
- **Content**: hardcoded itemSpacing (4px)
- **Content**: hardcoded padding
- **Row**: hardcoded itemSpacing (8px)
- **Avatar Container**: hardcoded itemSpacing (8px)
- **Avatar**: hardcoded itemSpacing (4.444444179534912px)
- **Avatar**: hardcoded cornerRadius (11109.9990234375px)
- **Photo**: hardcoded itemSpacing (8.888888359069824px)
- **Photo**: hardcoded cornerRadius (11109.9990234375px)
- **Status Badge**: hardcoded cornerRadius (100px)
- **Open Shift**: hardcoded color (no variable or style)
- **Open Shift**: hardcoded cornerRadius (9999px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Title**: hardcoded itemSpacing (8px)
- **Overnight badge**: hardcoded itemSpacing (8px)
- **ChipShift**: hardcoded color (no variable or style)
- **ChipShift**: hardcoded itemSpacing (8px)
- **ChipShift**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **Counter Badge**: hardcoded cornerRadius (9999px)
