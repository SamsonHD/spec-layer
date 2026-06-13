---
spec_version: "0.1"
status: draft
component:
  name: Button
  figma_key: af07bb4ae9f6103f3611eef3a98a974395d2b79a
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7909:319930
content_hash: 8c22654bff2ef1716b63de4e00ba50bba054f08496b45d22ee506745b80cf9c6
extracted_at: 2026-06-13T08:10:23.714Z
name: "Button"
---

## Definition

> ⚠️ Draft — AI-suggested, not yet approved.

_To be written._

## Anatomy

1. iconWrapper (component)
2. Label

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label | text | — | Label |
| Show Leading Icon | boolean | true / false | true |
| Show Trailing Icon | boolean | true / false | true |

## Variants

- **Size**: Default · Small · Large (default) · XSmall
- **Type**: Primary (default) · Secondary · Tertiary
- **Modifiers**: Danger · Disabled

## States

- Default
- Hover
- Press
- Focus

## Tokens used

### Color

#### Container

| Property | State | Primary | Secondary | Tertiary |
|---|---|---|---|---|
| fill | Default | `Background/Action/Action` | `Background/Action/Action Secondary` | — |
| fill | Hover | `Background/Action/Action (Hover)` | `Background/Action/Action Secondary (Hover)` | `Background/Action/Action Secondary (Hover)` |
| fill | Press | `Background/Action/Action (Pressed)` | `Background/Action/Action Secondary (Pressed)` | `Background/Action/Action Secondary (Pressed)` |
| fill | Focus | `Background/Action/Action` | `Background/Action/Action Secondary` | `Background/Action/Action Secondary` |
| border | Default | — | `Border Color/Action/Secondary Button (Default)` | — |
| border | Hover | — | `Border Color/Action/Secondary Button (Hover)` | — |
| border | Press | — | `Border Color/Action/Secondary Button (Pressed)` | — |
| border | Focus | — | `Border Color/Action/Secondary Button (Default)` | — |

**When Danger = true**

| Property | State | Primary | Secondary | Tertiary |
|---|---|---|---|---|
| fill | Default | `Background/Action/Danger` | `Background/Action/Action Secondary` | `Background/Action/Action Secondary` |
| fill | Hover | `Background/Action/Danger (Hover)` | `Background/Action/Danger Tertiary (Hover)` | `Background/Action/Danger Tertiary (Hover)` |
| fill | Press | `Background/Action/Danger (Pressed)` | `Background/Action/Danger Tertiary (Pressed)` | `Background/Action/Danger Tertiary (Pressed)` |
| fill | Focus | `Background/Action/Danger` | `Background/Action/Action Secondary` | `Background/Action/Action Secondary` |
| border | Default | — | `Border Color/Semantic/Danger` | — |
| border | Hover | — | `Border Color/Semantic/Danger (Hover)` | — |
| border | Press | — | `Border Color/Semantic/Danger (Pressed)` | — |
| border | Focus | — | `Border Color/Semantic/Danger` | — |

**When Disabled = true**

| Property | State | Primary | Secondary | Tertiary |
|---|---|---|---|---|
| fill | Default | `Background/Surface/Disabled` | `Background/Action/Action Secondary` | — |
| fill | Hover | `Background/Surface/Disabled` | `Background/Action/Action Secondary` | `Background/Action/Action Secondary` |
| fill | Press | `Background/Surface/Disabled` | `Background/Action/Action Secondary` | `Background/Action/Action Secondary` |
| fill | Focus | `Background/Surface/Disabled` | `Background/Action/Action Secondary` | `Background/Action/Action Secondary` |
| border | Default | — | `Border Color/Action/Secondary Button (Disabled)` | — |
| border | Hover | — | `Border Color/Action/Secondary Button (Disabled)` | — |
| border | Press | — | `Border Color/Action/Secondary Button (Disabled)` | — |
| border | Focus | — | `Border Color/Action/Secondary Button (Disabled)` | — |

#### icon

| Property | Primary | Secondary | Tertiary |
|---|---|---|---|
| fill | `Text Color/Body/White` | `Text Color/Body/Primary` | `Text Color/Body/Primary` |

**When Danger = true**

| Property | State | Primary | Secondary | Tertiary |
|---|---|---|---|---|
| fill | Default | `Text Color/Body/White` | `Text Color/Semantic/Danger Link` | `Text Color/Semantic/Danger Link` |
| fill | Hover | `Text Color/Body/White` | `Text Color/Semantic/Danger Link (Hover)` | `Text Color/Semantic/Danger Link (Hover)` |
| fill | Press | `Text Color/Body/White` | `Text Color/Semantic/Danger Link (Pressed)` | `Text Color/Semantic/Danger Link (Pressed)` |
| fill | Focus | `Text Color/Body/White` | `Text Color/Semantic/Danger Link` | `Text Color/Semantic/Danger Link` |

**When Disabled = true**

| Property | Primary | Secondary | Tertiary |
|---|---|---|---|
| fill | `Text Color/Body/White` | `Text Color/Semantic/Disabled` | `Text Color/Semantic/Disabled` |

#### Label

| Property | Primary | Secondary | Tertiary |
|---|---|---|---|
| fill | `Text Color/Action/On Action` | `Text Color/Action/On Secondary` | `Text Color/Action/On Secondary` |

**When Danger = true**

| Property | State | Primary | Secondary | Tertiary |
|---|---|---|---|---|
| fill | Default | `Text Color/Action/On Action` | `Text Color/Semantic/Danger Link` | `Text Color/Semantic/Danger Link` |
| fill | Hover | `Text Color/Action/On Action` | `Text Color/Semantic/Danger Link (Hover)` | `Text Color/Semantic/Danger Link (Hover)` |
| fill | Press | `Text Color/Action/On Action` | `Text Color/Semantic/Danger Link (Pressed)` | `Text Color/Semantic/Danger Link (Pressed)` |
| fill | Focus | `Text Color/Action/On Action` | `Text Color/Semantic/Danger Link` | `Text Color/Semantic/Danger Link` |

**When Disabled = true**

| Property | Primary | Secondary | Tertiary |
|---|---|---|---|
| fill | `Text Color/Action/On Disabled` | `Text Color/Semantic/Disabled` | `Text Color/Semantic/Disabled` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Size=Default · Small · XSmall, Type=Secondary · Tertiary, State=Focus, Danger=true | `Text Color/Semantic/Danger Link (Focus)` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Danger=true | `Border Color/Semantic/Danger` |
| border | State=Focus, Danger=false, Disabled=false | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Size=Default | `Action/M` |
| Label | typography | Size=Small | `Action/S` |
| Label | typography | Size=Large | `Action/L` |
| Label | typography | Size=XSmall | `Action/XS` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Container | padding-x | Size=Small | `size-16` |
| Container | padding-x | Size=XSmall | `size-12` |
| Container | padding-y | Size=XSmall | `size-4` |

## Code

> ⚠️ Draft — AI-suggested, not yet approved.

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

> ⚠️ Draft — AI-suggested, not yet approved.

_To be written._

## Do's & Don'ts

> ⚠️ Draft — AI-suggested, not yet approved.

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
