---
spec_version: "0.1"
component:
  name: Checkbox
  figma_key: 73c9723950f405bc3a1357b6fe032f4e57ee4d98
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7841:319235
content_hash: 2059e8f4ffcec7d2d96f5d43f5ce85f395d1a36e248be9116f2c194cb9af55ca
extracted_at: 2026-06-14T10:03:26.097Z
---

## Definition

_To be written._

## Anatomy

1. Check Wrapper
2. Label

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Text | text | — | Label |
| Show Label | boolean | true / false | true |
| Show Hint | boolean | true / false | false |
| Hint | text | — | Help text goes here. |
| Error | text | — | Error message here. |

## Variants

- **Size**: Medium (default) · Small
- **Modifiers**: Checked · Indeterminate · Fixed Width · Disabled · Danger/Error

## States

- Default
- Hover
- Press
- Focus

## Tokens used

### Color

#### Check Wrapper

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Press | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Press | `Border Color/Action/Action` |
| border | Focus | `Border Color/Input Field/Input Field` |

**When Checked = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Action/Action` |
| fill | Hover | `Background/Action/Action (Hover)` |
| fill | Press | `Background/Action/Action (Pressed)` |
| fill | Focus | `Background/Action/Action` |
| border | Default | `Border Color/Action/Action` |
| border | Hover | `Border Color/Action/Action` |
| border | Press | `Border Color/Action/Action` |
| border | Focus | `Border Color/Action/Action` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

**When Danger/Error = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Press | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field Danger` |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Press | `Border Color/Input Field/Input Field Danger (Focus)` |
| border | Focus | `Border Color/Input Field/Input Field Danger` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Checked=true, Disabled=true | `Background/Surface/Disabled` |
| fill | Checked=true, State=Default · Focus, Danger/Error=true | `Background/Action/Danger` |
| fill | Checked=true, State=Hover, Danger/Error=true | `Background/Action/Danger (Hover)` |
| fill | Checked=true, State=Press, Danger/Error=true | `Background/Action/Danger (Pressed)` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=false | `Text Color/Body/Primary` |
| fill | Disabled=true | `Text Color/Semantic/Disabled` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Danger/Error=true | `Border Color/Semantic/Danger` |
| border | State=Focus, Disabled=false, Danger/Error=false | `Border Color/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Vector | fill | `Text Color/Body/Inverted → Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Size=Medium | `Value/M` |
| Label | typography | Size=Small | `Value/S` |

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
- **Container**: hardcoded itemSpacing (8px)
- **Check Wrapper**: hardcoded cornerRadius (4px)
- **Check**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
