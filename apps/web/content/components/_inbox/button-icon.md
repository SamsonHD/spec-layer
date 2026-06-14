---
spec_version: "0.1"
component:
  name: Button Icon
  figma_key: cca248fc8066e7e472455d2f1a9b8c2b3ad3c79d
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 176:2605
content_hash: eb63eed5f7614fce4243f1d97a76a75965c8f74606db05b52b5732c1c95c2ab5
extracted_at: 2026-06-14T10:03:23.746Z
---

## Definition

_To be written._

## Anatomy

1. iconWrapper (component)

## Configuration

_None._

## Variants

- **Size**: Medium · XSmall (default) · Large · Small
- **Variant**: Primary (default) · Secondary · Icon Only
- **Disabled**: false (default) · true · False · True
- **Modifiers**: Danger

## States

- Default
- Hover
- Press
- Focus

## Tokens used

### Color

#### Container

**When Danger = true**

| Property | State | Primary | Secondary | Icon Only |
|---|---|---|---|---|
| fill | Default | `Background/Action/Danger` | `Background/Action/Action Secondary` | `Background/Action/Danger Tertiary` |
| fill | Hover | `Background/Action/Danger (Hover)` | `Background/Action/Danger Tertiary (Hover)` | `Background/Action/Danger Tertiary (Hover)` |
| fill | Press | `Background/Action/Danger (Pressed)` | `Background/Action/Danger Tertiary (Pressed)` | `Background/Action/Danger Tertiary (Pressed)` |
| fill | Focus | `Background/Action/Danger` | `Background/Action/Action Secondary` | `Background/Action/Danger Tertiary` |
| border | Default | — | `Border Color/Semantic/Danger` | — |
| border | Hover | — | `Border Color/Semantic/Danger (Hover)` | — |
| border | Press | — | `Border Color/Semantic/Danger (Pressed)` | — |
| border | Focus | — | `Border Color/Semantic/Danger` | — |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Variant=Primary, State=Default · Focus, Danger=false, Disabled=false · False | `Background/Action/Action` |
| fill | Variant=Primary, Disabled=true · True | `Background/Surface/Disabled` |
| fill | Variant=Secondary, Disabled=true · True | `Background/Action/Action Secondary` |
| fill | Variant=Icon Only, Disabled=true · True | `Background/Action/Action Tertiary` |
| fill | Variant=Primary, State=Hover, Danger=false, Disabled=false · False | `Background/Action/Action (Hover)` |
| fill | Variant=Primary, State=Press, Danger=false, Disabled=false · False | `Background/Action/Action (Pressed)` |
| fill | Variant=Secondary, State=Hover, Danger=false, Disabled=false · False | `Background/Action/Action Secondary (Hover)` |
| fill | Variant=Secondary, State=Press, Danger=false, Disabled=false · False | `Background/Action/Action Secondary (Pressed)` |
| fill | Variant=Secondary, State=Focus, Danger=false, Disabled=false · False | `Background/Action/Action Secondary` |
| fill | Variant=Icon Only, State=Default · Focus, Danger=false, Disabled=false · False | `Background/Action/Action Tertiary` |
| fill | Variant=Icon Only, State=Hover, Danger=false, Disabled=false · False | `Background/Action/Action Tertiary (Hover)` |
| fill | Variant=Icon Only, State=Press, Danger=false, Disabled=false · False | `Background/Action/Action Tertiary (Pressed)` |
| border | Variant=Secondary, Disabled=true · True | `Border Color/Action/Secondary Button (Disabled)` |
| border | Variant=Secondary, State=Default · Press, Danger=false, Disabled=false · False | `Border Color/Action/Secondary Button (Default)` |
| border | Variant=Secondary, State=Hover, Danger=false, Disabled=false · False | `Border Color/Action/Secondary Button (Hover)` |
| border | Variant=Secondary, State=Focus, Danger=false, Disabled=false · False | `Border Color/Action/Action` |

#### icon

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Variant=Primary, Disabled=false | `Text Color/Body/White` |
| fill | Variant=Primary, Disabled=true | `Text Color/Body/White` |
| fill | Variant=Primary, Disabled=False | `Text Color/Body/White` |
| fill | Variant=Primary, Disabled=True | `Text Color/Body/White` |
| fill | Variant=Secondary · Icon Only, Disabled=true | `Text Color/Semantic/Disabled` |
| fill | Variant=Secondary · Icon Only, Disabled=True | `Text Color/Semantic/Disabled` |
| fill | Variant=Secondary · Icon Only, Danger=false, Disabled=false | `Text Color/Body/Primary` |
| fill | Variant=Secondary · Icon Only, Danger=false, Disabled=False | `Text Color/Body/Primary` |
| fill | Size=Medium · Large, Variant=Icon Only, State=Press, Danger=true | `Text Color/Semantic/Danger Link (Pressed)` |
| fill | Size=XSmall, Variant=Icon Only, State=Press, Danger=true | `Text Color/Body/Primary` |
| fill | Variant=Secondary · Icon Only, State=Default · Focus, Danger=true, Disabled=false | `Text Color/Semantic/Danger Link` |
| fill | Variant=Secondary · Icon Only, State=Default · Focus, Danger=true, Disabled=False | `Text Color/Semantic/Danger Link` |
| fill | Variant=Secondary · Icon Only, State=Hover, Danger=true, Disabled=false | `Text Color/Semantic/Danger Link (Hover)` |
| fill | Variant=Secondary · Icon Only, State=Hover, Danger=true, Disabled=False | `Text Color/Semantic/Danger Link (Hover)` |
| fill | Variant=Secondary, State=Press, Danger=true, Disabled=false | `Text Color/Semantic/Danger Link (Pressed)` |
| fill | Variant=Secondary, State=Press, Danger=true, Disabled=False | `Text Color/Semantic/Danger Link (Pressed)` |
| fill | Variant=Icon Only, State=Press, Danger=true, Disabled=False | `Text Color/Body/Primary` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus, Danger=true | `Border Color/Semantic/Danger` |
| border | State=Focus, Danger=false, Disabled=false · False | `Border Color/Action/Action` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Focus Rect | border-radius | State=Focus, Disabled=False | `rounded-4` |
| Focus Rect | border-radius | Size=XSmall, State=Focus, Disabled=false | `rounded-4` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (10px)
- **Container**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
