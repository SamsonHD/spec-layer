---
spec_version: "0.1"
component:
  name: Input Field - Code
  figma_key: 873f7442ef3c0adea82c864ff96b70c8d60b88d5
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 11856:358507
content_hash: e3fbc8923e9dea0bba6f505c183ce75de923a41601ffceecf4e13760a16cd46d
extracted_at: 2026-06-14T10:03:56.224Z
---

## Definition

_To be written._

## Anatomy

1. Text Content

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Text | text | — | 9 |
| Filled | boolean | true / false | true |

## Variants

- **Modifiers**: Danger

## States

- Default
- Hover
- Focus

## Tokens used

### Color

#### Container

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field (Focus)` |

**When Danger = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field Danger` |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field (Focus)` |

#### Caret

| Property | Condition | Token |
|---|---|---|
| fill | States=Focus | `Background/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Text Content | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Text Content | typography | — | `Heading/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | effects | States=Focus | `light/Ring/Input - Active` |

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
