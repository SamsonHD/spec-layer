---
spec_version: "0.1"
component:
  name: Shift Tile / Employee
  figma_key: c837dc619211a6ffcdd304b042284e095c26d9a2
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26531:335806
content_hash: fa9787dac67b09200fb4bb1388da60ff6f4f4dfaa069f4e25bdeded09742f2a4
extracted_at: 2026-06-14T10:04:36.171Z
---

## Definition

_To be written._

## Anatomy

1. Avatar (component)
2. Title
3. Time

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show avatar | boolean | true / false | true |
| Time | text | — | 9:00 AM – 5:00 PM |
| Shift Name | text | — | Breakfast Shift |
| Location | text | — | Front Desk |
| Overnight shift | boolean | true / false | false |
| Show alert | boolean | true / false | false |
| Open tag | boolean | true / false | false |

## Variants

- **Density**: Compact (default) · Default · Expanded
- **Color**: Blue · Green · Gray · Purple · Red · Orange (default) · Teal · Pink · Indigo · Cyan · Lime · Magenta · Brown
- **Type**: Shift (default) · Time Off
- **Drag**: False (default)
- **Modifiers**: Published · Hover · Selected · Time Off · Unavailable

## States

- Default

## Tokens used

### Color

#### Container

| Property | Blue | Green | Gray | Purple | Red | Orange | Teal | Pink | Indigo | Cyan | Lime | Magenta | Brown |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| border | — | — | `Border Color/Input Field/Input Field Disabled` | — | — | — | `Text Color/Body/White` | — | — | — | — | — | — |

**When Published = False**

| Property | Blue | Green | Gray | Purple | Red | Orange | Teal | Pink | Indigo | Cyan | Lime | Magenta | Brown |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| border | — | — | `color/grey/500` | — | — | — | — | — | — | — | — | — | — |

**When Selected = True**

| Property | Token |
|---|---|
| border | `Background/App Header/Navigation Button Border` |

#### Shift name

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

#### Button Icon

| Property | Condition | Token |
|---|---|---|
| fill | Hover=True | `Background/Surface/Inverted → Secondary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Hover=True | `Text Color/Body/White` |
| fill | Density=Compact, Unavailable=True | `Text Color/Semantic/Disabled` |

#### Location

| Property | Condition | Token |
|---|---|---|
| fill | Density=Default · Expanded, Published=False | `color/grey/500` |
| fill | Density=Default · Expanded, Unavailable=True | `Text Color/Semantic/Disabled` |
| fill | Density=Default · Expanded, Published=True, Time Off=False, Unavailable=False | `Text Color/Body/White` |

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
| Shift name | typography | — | `Caption/S - Extra Strong` |
| Time | typography | — | `Caption/XS - Strong` |
| Location | typography | Density=Default · Expanded | `Caption/XS` |
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

- [Avatar](./avatar.md)

## Extraction gaps

- **Container**: hardcoded color (no variable or style)
- **Content**: hardcoded itemSpacing (4px)
- **Content**: hardcoded padding
- **Row**: hardcoded itemSpacing (8px)
- **Avatar**: hardcoded itemSpacing (4.444444179534912px)
- **Avatar**: hardcoded cornerRadius (11109.9990234375px)
- **Photo**: hardcoded itemSpacing (8.888888359069824px)
- **Photo**: hardcoded cornerRadius (11109.9990234375px)
- **Status Badge**: hardcoded cornerRadius (100px)
- **Title**: hardcoded itemSpacing (8px)
- **Overnight badge**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **ChipShift**: hardcoded color (no variable or style)
- **ChipShift**: hardcoded itemSpacing (8px)
- **ChipShift**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **Alert**: hardcoded itemSpacing (8px)
