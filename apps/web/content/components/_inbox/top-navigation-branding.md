---
spec_version: "0.1"
component:
  name: Top Navigation / Branding
  figma_key: 961c97d13d0ee744177ffc0bddf8e3d40fa4e91f
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24439:13011
content_hash: 3913b37dd5c2fda234a0b9057162138802241d3694933a666d631b795d1de211
extracted_at: 2026-06-14T10:04:05.494Z
---

## Definition

_To be written._

## Anatomy

1. logo
2. Top Navigation / companyName (component)
3. Button

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| View a Client | boolean | true / false | true |

## Variants

- **Type**: Default (default) · White Label
- **Modifiers**: Collapsed

## States

- Default

## Tokens used

### Color

#### Top Navigation / companyName

| Property | Condition | Token |
|---|---|---|
| fill | Type=Default | `Background/Surface/Quaternary` |

#### Button

| Property | Condition | Token |
|---|---|---|
| fill | Type=Default | `Background/App Header/Navigation Button` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Label | fill | `Text Color/Body/Inverted → Primary` |
| Label | fill | `Text Color/Body/Primary` |
| Admin View | fill | `Text Color/Body/Secondary` |
| iconWrapper | fill | `Background/Transparent` |
| icon | fill | `Text Color/Body/Inverted → Primary` |
| icon | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Action/S` |
| Label | typography | — | `Action/XS` |
| Admin View | typography | — | `Caption/XS` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| companyName/companyLogo | border-radius | Type=Default | `rounded-4` |
| Button | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Top Navigation / companyName](./top-navigation-companyname.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (16px)
- **Container**: hardcoded padding
- **logo**: hardcoded itemSpacing (10px)
- **logo**: hardcoded padding
- **Vector**: hardcoded color (no variable or style)
- **Top Navigation / companyName**: hardcoded itemSpacing (8px)
- **Top Navigation / companyName**: hardcoded cornerRadius (8px)
- **Top Navigation / companyName**: hardcoded padding
- **companyName/companyLogo**: hardcoded color (no variable or style)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Button**: hardcoded itemSpacing (8px)
- **Button**: hardcoded padding
