---
spec_version: "0.1"
component:
  name: Select (Dropdown) for Table
  figma_key: 686333370bbf9f2d62785f5935128c78b9fefca8
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 6206:347292
content_hash: 419bf2e33de17d38af37a87efc396a17090984602dbb3e7cf0ba9e595b7d1a54
extracted_at: 2026-06-14T10:03:56.870Z
---

## Definition

_To be written._

## Anatomy

1. Placeholder
2. iconWrapper (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Shows Icon | boolean | true / false | false |
| Text | text | — | Placeholder |
| Text Content | boolean | true / false | true |

## Variants

- **Modifiers**: Empty · Danger/Error · Disabled

## States

- Default
- Hover
- Focus
- Active

## Tokens used

### Color

#### Select

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| fill | Active | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field (Focus)` |
| border | Active | `Border Color/Input Field/Input Field (Focus)` |

**When Danger/Error = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| fill | Active | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field Danger` |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Focus | `Border Color/Input Field/Input Field Danger (Focus)` |
| border | Active | `Border Color/Input Field/Input Field Danger (Hover)` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Empty=true | `Text Color/Input/Input Placeholder` |
| fill | Empty=false, Disabled=false | `Text Color/Body/Primary` |
| fill | Empty=false, Disabled=true | `Text Color/Input/Input Disabled` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=false | `Text Color/Body/Secondary` |
| fill | Disabled=true | `Text Color/Semantic/Disabled` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Danger/Error=true | `Border Color/Semantic/Danger` |
| border | State=Focus, Danger/Error=false, Disabled=false | `Border Color/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Placeholder | typography | — | `Value/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Select | effects | State=Active, Danger/Error=true | `light/Ring/Input Danger - Active` |
| Select | effects | State=Active, Danger/Error=false, Disabled=false | `light/Ring/Input - Active` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Select**: hardcoded itemSpacing (8px)
- **Select**: hardcoded cornerRadius (4px)
- **Select**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
