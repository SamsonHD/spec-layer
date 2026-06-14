---
spec_version: "0.1"
component:
  name: SwitchSelection
  figma_key: 1f55a67b1d99ecee2e0e6d6faa904ae95ea240a3
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25371:2838
content_hash: 61237b3b2943d262a49ac76076ace8cf9e7ca58917b79831a5f0d189030ab294
extracted_at: 2026-06-14T10:04:19.061Z
---

## Definition

_To be written._

## Anatomy

1. Toggle Switch (component)
2. label + copy

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Description | boolean | true / false | true |

## Variants

- **Modifiers**: Hover · Disabled

## States

- Default

## Tokens used

### Color

#### Container

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Divider/Divider Secondary` |

**When Hover = True**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field (Hover)` |

**When Disabled = True**

| Property | Token |
|---|---|
| fill | `Background/Surface/Tertiary` |
| border | `Border Color/Input Field/Input Field Disabled` |

#### Track

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=False | `Background/Toggle/Toggle Switch` |
| fill | Disabled=True | `Background/Surface/Disabled` |

#### Switch

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=False | `Background/Surface/Primary` |
| fill | Disabled=True | `Background/Surface/Tertiary` |

#### label

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=False | `Text Color/Body/Primary` |
| fill | Disabled=True | `Text Color/Semantic/Disabled` |

#### copy

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=False | `Text Color/Body/Primary` |
| fill | Disabled=True | `Text Color/Semantic/Disabled` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| label | typography | — | `Subtitle/M - Strong` |
| copy | font-size | — | `font-size/fs-150` |
| copy | font-family | — | `font-family/font-family` |
| copy | line-height | — | `line-height/lh-250` |
| copy | font-weight | — | `font-weight/fw-400` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Toggle Switch](./toggle-switch.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (16px)
- **Container**: hardcoded cornerRadius (12px)
- **Container**: hardcoded padding
- **Toggle Switch**: hardcoded itemSpacing (8px)
- **Track**: hardcoded itemSpacing (10px)
- **Track**: hardcoded cornerRadius (9999px)
- **Track**: hardcoded padding
- **Switch**: hardcoded cornerRadius (9999px)
- **Switch**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Frame 1**: hardcoded itemSpacing (4px)
- **label + copy**: hardcoded itemSpacing (4px)
