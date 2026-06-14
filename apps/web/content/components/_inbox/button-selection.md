---
spec_version: "0.1"
component:
  name: Button Selection
  figma_key: 831122b4a0732db0c8468f677835404aa0eea157
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26926:13877
content_hash: 177d030beab227235d47b2978750c82286acac469ef0f5bab32d2302651e7983
extracted_at: 2026-06-14T10:03:15.003Z
---

## Definition

_To be written._

## Anatomy

1. .fs-icon (component)
2. iconWrapper (component)
3. Label
4. Counter Badge (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label | text | — | Label |
| Show Leading Icon | boolean | true / false | true |
| Show Trailing Icon | boolean | true / false | true |
| Show Indicator | boolean | true / false | true |

## Variants

- **Size**: Small (default) · XSmall
- **Modifiers**: Disabled · Selected

## States

- Default
- Hover
- Press
- Focus

## Tokens used

### Color

#### Container

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Action/Action Secondary` |
| fill | Hover | `Background/Action/Action Secondary (Hover)` |
| fill | Press | `Background/Action/Action Secondary (Pressed)` |
| fill | Focus | `Background/Action/Action Secondary` |
| border | Default | `Border Color/Action/Secondary Button (Default)` |
| border | Hover | `Border Color/Action/Secondary Button (Hover)` |
| border | Press | `Border Color/Action/Secondary Button (Pressed)` |
| border | Focus | `Border Color/Action/Secondary Button (Default)` |

**When Disabled = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Action/Action Secondary` |
| fill | Hover | `Background/Action/Action Secondary (Hover)` |
| fill | Press | `Background/Action/Action Secondary (Pressed)` |
| fill | Focus | `Background/Action/Action Secondary` |
| border | Default | `Border Color/Action/Secondary Button (Disabled)` |
| border | Hover | `Border Color/Action/Secondary Button (Hover)` · `Border Color/Action/Secondary Button (Disabled)` |
| border | Press | `Border Color/Action/Secondary Button (Pressed)` · `Border Color/Action/Secondary Button (Disabled)` |
| border | Focus | `Border Color/Action/Secondary Button (Disabled)` |

**When Selected = True**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Action/Action Secondary (Selected)` |
| fill | Hover | `Background/Action/Action Secondary (Hover)` · `Background/Action/Action Secondary (Selected)` |
| fill | Press | `Background/Action/Action Secondary (Pressed)` · `Background/Action/Action Secondary (Selected)` |
| fill | Focus | `Background/Action/Action Secondary (Selected)` |
| border | Default | `Border Color/Action/Action` |
| border | Hover | `Border Color/Action/Secondary Button (Hover)` · `Border Color/Action/Action` |
| border | Press | `Border Color/Action/Secondary Button (Pressed)` · `Border Color/Action/Action` |
| border | Focus | `Border Color/Action/Action` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | — | `Text Color/Semantic/Warning` |
| fill | Disabled=false | `Text Color/Body/Primary` |
| fill | Disabled=true | `Text Color/Semantic/Disabled` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=false | `Text Color/Action/On Secondary` |
| fill | Disabled=true | `Text Color/Semantic/Disabled` |

#### Counter Badge

| Property | Condition | Token |
|---|---|---|
| fill | Selected=False | `Background/Surface/Secondary` |
| fill | Selected=True | `Background/Surface/Primary` |

#### Count Label

| Property | Condition | Token |
|---|---|---|
| fill | Selected=False | `Text Color/Semantic/Disabled` |
| fill | Selected=True | `Text Color/Body/Primary` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Size=Small | `Action/S` |
| Label | typography | Size=XSmall | `Action/XS` |
| Count Label | typography | Size=Small | `Caption/S - Strong` |
| Count Label | typography | Size=XSmall | `Caption/XS - Strong` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Container | padding-x | Size=Small | `size-12` |
| Container | padding-y | Size=Small | `size-8` |
| Container | padding | Size=XSmall | `size-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.fs-icon](./fs-icon.md)
- [iconWrapper](./iconwrapper.md)
- [Counter Badge](./counter-badge.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
