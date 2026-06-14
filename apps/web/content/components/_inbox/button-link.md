---
spec_version: "0.1"
component:
  name: Button (Link)
  figma_key: bd1b684696ce4453e61962144bb900d952b22cfe
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 8042:327897
content_hash: 5704e59e2c27201fa631bb35b4926fb57f264860aeab15264e4cbc929bec2b3a
extracted_at: 2026-06-14T10:03:26.049Z
---

## Definition

_To be written._

## Anatomy

1. Button Icon (component)
2. Label

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label | text | — | Label |
| Show Left Icon | boolean | true / false | true |
| Show Right Icon | boolean | true / false | false |

## Variants

- **Size**: Default (default) · Small · Large
- **Modifiers**: Danger · Disabled · Show Left Btn · Show Right Btn

## States

- Default
- Hover
- Press
- Visited
- Focus

## Tokens used

### Color

#### Button Icon

| Property | State | Token |
|---|---|---|
| border | Default | `Border Color/Action/Link` |
| border | Hover | `Border Color/Action/Link (Hover)` |
| border | Press | `Border Color/Action/Link (Pressed)` |
| border | Visited | `Text Color/Action/Link (Visited)` |
| fill | Hover | `Background/Action/Action Secondary (Hover)` |
| fill | Press | `Background/Action/Action Secondary (Pressed)` |
| fill | Focus | `Background/Action/Action Tertiary` |

**When Danger = true**

| Property | State | Token |
|---|---|---|
| border | Default | `Border Color/Semantic/Danger` |
| border | Hover | `Border Color/Semantic/Danger (Hover)` |
| border | Press | `Border Color/Semantic/Danger (Pressed)` |
| border | Visited | `Border Color/Semantic/Danger` |
| fill | Default | `Background/Action/Action Secondary` |
| fill | Hover | `Background/Action/Danger Tertiary (Hover)` |
| fill | Press | `Background/Action/Danger Tertiary (Pressed)` |
| fill | Visited | `Background/Action/Action Secondary` |
| fill | Focus | `Background/Action/Action Tertiary` |

**When Disabled = true**

| Property | Token |
|---|---|
| border | `Border Color/Action/Secondary Button (Disabled)` |
| fill | `Background/Action/Action Secondary` |

#### icon

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Action/Default` |
| fill | Hover | `Text Color/Action/Link (Hover)` |
| fill | Press | `Text Color/Action/Link (Pressed)` |
| fill | Visited | `Text Color/Action/Link (Visited)` |
| fill | Focus | `Text Color/Action/Link (Focus)` |

**When Danger = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Semantic/Danger Link` |
| fill | Hover | `Text Color/Semantic/Danger Link (Hover)` |
| fill | Press | `Text Color/Semantic/Danger Link (Pressed)` |
| fill | Visited | `Text Color/Semantic/Danger Link (Visited)` |
| fill | Focus | `Text Color/Semantic/Danger Link` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Disabled` |

**When Show Left Btn = true**

| Property | State | Default | Small | Large |
|---|---|---|---|---|
| fill | Default | `Text Color/Action/Link` | `Text Color/Body/Primary` | `Text Color/Action/Link` |
| fill | Hover | `Text Color/Action/Link (Hover)` | `Text Color/Body/Primary` | `Text Color/Action/Link (Hover)` |
| fill | Press | `Text Color/Action/Link (Pressed)` | `Text Color/Body/Primary` | `Text Color/Action/Link (Pressed)` |
| fill | Visited | `Text Color/Action/Link (Visited)` | `Text Color/Body/Primary` | `Text Color/Action/Link (Visited)` |
| fill | Focus | `Text Color/Action/Link` | `Text Color/Action/Link` | `Text Color/Action/Link` |

**When Show Right Btn = true**

| Property | State | Default | Small | Large |
|---|---|---|---|---|
| fill | Default | `Text Color/Action/Link` | `Text Color/Body/Primary` | `Text Color/Action/Link` |
| fill | Hover | `Text Color/Action/Link (Hover)` | `Text Color/Body/Primary` | `Text Color/Action/Link (Hover)` |
| fill | Press | `Text Color/Action/Link (Pressed)` | `Text Color/Body/Primary` | `Text Color/Action/Link (Pressed)` |
| fill | Visited | `Text Color/Action/Link (Visited)` | `Text Color/Body/Primary` | `Text Color/Action/Link (Visited)` |
| fill | Focus | `Text Color/Action/Link` | `Text Color/Action/Link` | `Text Color/Action/Link` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=true, Show Right Btn=true | `Text Color/Semantic/Disabled` |
| fill | State=Default · Focus, Danger=true, Show Right Btn=true | `Text Color/Semantic/Danger Link` |
| fill | State=Hover, Danger=true, Show Right Btn=true | `Text Color/Semantic/Danger Link (Hover)` |
| fill | State=Press, Danger=true, Show Right Btn=true | `Text Color/Semantic/Danger Link (Pressed)` |
| fill | Size=Default · Small, State=Visited, Danger=true, Show Left Btn=true | `Text Color/Semantic/Danger Link` |
| fill | Size=Default · Small, State=Visited, Danger=true, Show Right Btn=true | `Text Color/Semantic/Danger Link` |
| fill | Size=Large, State=Visited, Danger=true, Show Left Btn=true | `Text Color/Semantic/Danger Link (Visited)` |
| fill | Size=Large, State=Visited, Danger=true, Show Right Btn=true | `Text Color/Semantic/Danger Link (Visited)` |

#### Label

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Action/Default` |
| fill | Hover | `Text Color/Action/Link (Hover)` |
| fill | Press | `Text Color/Action/Link (Pressed)` |
| fill | Visited | `Text Color/Action/Link (Visited)` |
| fill | Focus | `Text Color/Action/Link (Focus)` |

**When Danger = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Semantic/Danger Link` |
| fill | Hover | `Text Color/Semantic/Danger Link (Hover)` |
| fill | Press | `Text Color/Semantic/Danger Link (Pressed)` |
| fill | Visited | `Text Color/Semantic/Danger Link (Visited)` |
| fill | Focus | `Text Color/Semantic/Danger Link` |

**When Disabled = true**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Disabled` |

**When Show Left Btn = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Action/Link` |
| fill | Hover | `Text Color/Action/Link (Hover)` |
| fill | Press | `Text Color/Action/Link (Pressed)` |
| fill | Visited | `Text Color/Action/Link (Visited)` |
| fill | Focus | `Text Color/Action/Link` |

**When Show Right Btn = true**

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Action/Link` |
| fill | Hover | `Text Color/Action/Link (Hover)` |
| fill | Press | `Text Color/Action/Link (Pressed)` |
| fill | Visited | `Text Color/Action/Link (Visited)` |
| fill | Focus | `Text Color/Action/Link` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=true, Show Right Btn=true | `Text Color/Semantic/Disabled` |
| fill | State=Default · Focus, Danger=true, Show Right Btn=true | `Text Color/Semantic/Danger Link` |
| fill | State=Hover, Danger=true, Show Right Btn=true | `Text Color/Semantic/Danger Link (Hover)` |
| fill | State=Press, Danger=true, Show Right Btn=true | `Text Color/Semantic/Danger Link (Pressed)` |
| fill | State=Visited, Danger=true, Show Right Btn=true | `Text Color/Semantic/Danger Link (Visited)` |

#### Focus Rect

| Property | State | Default | Small | Large |
|---|---|---|---|---|
| border | Focus | `Border Color/Action/Link` | `Border Color/Action/Link` | `Border Color/Action/Action` |

**When Danger = true**

| Property | State | Token |
|---|---|---|
| border | Focus | `Border Color/Semantic/Danger` |

**When Show Left Btn = true**

| Property | State | Token |
|---|---|---|
| border | Focus | `Border Color/Action/Link` |

**When Show Right Btn = true**

| Property | State | Token |
|---|---|---|
| border | Focus | `Border Color/Action/Link` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Danger=true, Show Right Btn=true | `Border Color/Semantic/Danger` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Transparent` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Size=Small | `Action/S` |
| Label | typography | Size=Default | `Action/M` |
| Label | typography | Size=Large | `Action/L` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Button Icon](./button-icon.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded cornerRadius (9999px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
