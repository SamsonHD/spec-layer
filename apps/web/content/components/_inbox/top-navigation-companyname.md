---
spec_version: "0.1"
component:
  name: Top Navigation / companyName
  figma_key: 119a7d523a09b8bb0c97c8ca396ec16bd9a7e79c
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24483:3251
content_hash: 5f4677853c26bff2027eb7859e9ece0c5c2172cf08412daeeafabb54bd1fc313
extracted_at: 2026-06-14T10:04:05.494Z
---

## Definition

_To be written._

## Anatomy

1. companyName/companyLogo (component)
2. Container
3. iconWrapper (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Company Logo | boolean | true / false | true |

## Variants

- **Modifiers**: Hover · Selected · Disabled

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| fill | — | `Background/Surface/Quaternary` |
| border | Hover=False, Disabled=False | `Border Color/Action/Link (Pressed)` |
| border | Hover=True | `Border Color/Action/Link (Hover)` |

#### iconWrapper

| Property | Condition | Token |
|---|---|---|
| fill | Hover=False, Disabled=False | `Background/Transparent` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=False | `Text Color/Body/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Label | fill | `Text Color/Body/Primary` |
| Admin View | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Action/XS` |
| Admin View | typography | — | `Caption/XS` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| companyName/companyLogo | border-radius | — | `rounded-4` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [companyName/companyLogo](./companyname-companylogo.md)
- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded cornerRadius (8px)
- **Container**: hardcoded padding
- **companyName/companyLogo**: hardcoded color (no variable or style)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
