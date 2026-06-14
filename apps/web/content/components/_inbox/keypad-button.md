---
spec_version: "0.1"
component:
  name: Keypad Button
  figma_key: d28efddaf7386fc062b74ce5f43d80e1bb9cf110
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 11101:344742
content_hash: 735f57c5445a7a5587134c5f2679df94bab4ed3a1594dd2a15e22e43f16eb3ee
extracted_at: 2026-06-14T10:07:43.774Z
---

## Definition

_To be written._

## Anatomy

1. { label }

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label | text | — | { label } |

## Variants

- **Type**: Text (default) · Icon + Text · Text + Icon · Icon
- **Size**: Default (default) · Small

## States

- Default
- Press
- Focus
- Disabled

## Tokens used

### Color

#### Container

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Press | `Background/Action/Keypad Button (Pressed)` |
| fill | Focus | `Background/Surface/Primary` |
| fill | Disabled | `Background/Surface/Primary` |
| border | Default | `Border Color/Input Field/Input Field` |
| border | Press | `Border Color/Input Field/Input Field` |
| border | Focus | `Border Color/Input Field/Input Field` |
| border | Disabled | `Border Color/Input Field/Input Field Disabled` |

#### { label }

| Property | Condition | Token |
|---|---|---|
| fill | Type=Text · Icon + Text · Text + Icon, State=Default · Press · Focus | `Text Color/Body/Primary` |
| fill | Type=Text · Icon + Text · Text + Icon, State=Disabled | `Text Color/Semantic/Disabled` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | State=Focus | `Border Color/Action/Action` |

#### Ellipse 1

| Property | Condition | Token |
|---|---|---|
| border | Type=Icon + Text · Text + Icon · Icon, State=Default · Press · Focus | `Text Color/Body/Primary` |
| border | Type=Icon + Text · Text + Icon · Icon, State=Disabled | `Background/Surface/Disabled` |

#### Ellipse 2

| Property | Condition | Token |
|---|---|---|
| fill | Type=Icon + Text · Text + Icon · Icon, State=Default · Press · Focus | `Text Color/Body/Primary` |
| fill | Type=Icon + Text · Text + Icon · Icon, State=Disabled | `Background/Surface/Disabled` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| { label } | typography | Type=Text · Icon + Text · Text + Icon, Size=Default | `[ARCHIVE]/*Mobile/Keypad Label Large` |
| { label } | typography | Type=Text · Icon + Text · Text + Icon, Size=Small | `[ARCHIVE]/*Mobile/Keypad Label` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded cornerRadius (8px)
- **Container**: hardcoded padding
