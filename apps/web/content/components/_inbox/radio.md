---
spec_version: "0.1"
component:
  name: Radio
  figma_key: 2f36c74bfd25af6acf4a4229a3f67eacd4b9555f
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7845:317606
content_hash: 8db79ab23cbc5618eb7f07a5b0d2b806f93ef8e2bb5b132156cd140048b723f3
extracted_at: 2026-06-14T10:04:05.565Z
---

## Definition

_To be written._

## Anatomy

1. Radio Control
2. Label Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Label | boolean | true / false | true |
| Show Icon | boolean | true / false | false |
| Text | text | — | Label |
| Show Hint | boolean | true / false | false |
| Error | text | — | Error message here. |
| Hint | text | — | Help text goes here. |

## Variants

- **Size**: Medium (default) · Small
- **Modifiers**: Checked · Fixed Width · Disabled · Danger/Error

## States

- Default
- Hover
- Press
- Focus

## Tokens used

### Color

#### Radio Control

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Press | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Press | `Border Color/Input Field/Input Field (Focus)` |
| border | Focus | `Border Color/Input Field/Input Field` |

**When Checked = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Press | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Press | `Border Color/Action/Action (Pressed)` |
| border | Focus | `Border Color/Input Field/Input Field` |

**When Fixed Width = false**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Press | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field` |
| border | Hover | `Border Color/Input Field/Input Field (Hover)` |
| border | Press | `Border Color/Input Field/Input Field (Focus)` |
| border | Focus | `Border Color/Input Field/Input Field` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

**When Danger/Error = true**

| Property | State | Medium | Small |
|---|---|---|---|
| fill | Default | `Background/Surface/Primary` | `Background/Surface/Primary` |
| fill | Hover | `Background/Surface/Primary` | `Background/Surface/Primary` |
| fill | Press | `Background/Surface/Primary` | `Background/Surface/Primary` |
| fill | Focus | `Background/Surface/Primary` | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field Danger` | `Border Color/Input Field/Input Field Danger` |
| border | Hover | `Border Color/Input Field/Input Field Danger (Hover)` | `Border Color/Input Field/Input Field Danger (Hover)` |
| border | Press | `Border Color/Input Field/Input Field Danger (Focus)` | `Border Color/Input Field/Input Field Danger (Focus)` |
| border | Focus | `Border Color/Input Field/Input Field Danger (Focus)` | `Border Color/Input Field/Input Field Danger` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| border | Fixed Width=false, States=Focus, Danger/Error=true | `Border Color/Input Field/Input Field Danger` |
| border | Checked=true, Fixed Width=true, States=Focus, Danger/Error=true | `Border Color/Input Field/Input Field Danger` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=false | `Text Color/Body/Primary` |
| fill | Disabled=true | `Text Color/Semantic/Disabled` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | States=Focus, Danger/Error=true | `Border Color/Semantic/Danger` |
| border | States=Focus, Disabled=false, Danger/Error=false | `Border Color/Action/Action` |

#### Selected

**When Checked = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Action/Action` |
| fill | Hover | `Background/Action/Action (Hover)` |
| fill | Press | `Background/Action/Action (Pressed)` |
| fill | Focus | `Background/Action/Action` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Checked=true, Disabled=true | `Background/Surface/Disabled` |
| fill | Checked=true, States=Default · Focus, Danger/Error=true | `Background/Action/Danger` |
| fill | Checked=true, States=Hover, Danger/Error=true | `Background/Action/Danger (Hover)` |
| fill | Checked=true, States=Press, Danger/Error=true | `Background/Action/Danger (Pressed)` |

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

- **Container**: hardcoded itemSpacing (8px)
- **Radio Control**: hardcoded itemSpacing (10px)
- **Radio Control**: hardcoded cornerRadius (9999px)
- **Label**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
