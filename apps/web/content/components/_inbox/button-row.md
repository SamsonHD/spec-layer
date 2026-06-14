---
spec_version: "0.1"
component:
  name: Button Row
  figma_key: 7e8787f493401595e3d26f79c860c8010bc08219
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25773:8342
content_hash: cdc087bd8ebd7d725a213dae0dc242aa445ac09b726eb2dc815e5fa2c9c4d402
extracted_at: 2026-06-14T10:03:23.723Z
---

## Definition

_To be written._

## Anatomy

1. iconWrapper (component)
2. Container

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Title | boolean | true / false | true |
| Title Value | text | — | Title |
| Show Trailing Icon | boolean | true / false | true |
| Show Leading Icon | boolean | true / false | true |
| Show description | boolean | true / false | false |

## Variants

- **Modifiers**: Hover · Pressed · Focus

## States

- Default

## Tokens used

### Color

#### Container

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |

**When Hover = True**

| Property | Token |
|---|---|
| fill | `Background/Action/Action Secondary (Hover)` |

**When Pressed = True**

| Property | Token |
|---|---|
| fill | `Background/Action/Action Secondary (Pressed)` |

**When Focus = True**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | Focus=True | `Border Color/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| icon | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Secondary` |
| Title | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | — | `Action/S` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (12px)
- **Container**: hardcoded cornerRadius (8px)
- **Container**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Container**: hardcoded itemSpacing (4px)
