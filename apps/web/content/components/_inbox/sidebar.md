---
spec_version: "0.1"
component:
  name: Sidebar
  figma_key: e56260e972bdd66248e0132977e22c88b484d244
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24439:13519
content_hash: 009d592f06d8951ca0ce85e58fcb9d493b7217f6501e58587d42b8677e8d4f4e
extracted_at: 2026-06-14T10:03:58.013Z
---

## Definition

_To be written._

## Anatomy

1. container

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Scroller | boolean | true / false | false |

## Variants

- **Modifiers**: Collapsed

## States

- Default

## Tokens used

### Color

#### Sidebar / Item

| Property | Condition | Token |
|---|---|---|
| fill | — | `Background/Transparent` |
| fill | Collapsed=True | `Background/Sidebar/Sidebar Sub-Item Selected` |
| fill | Collapsed=False | `Background/Sidebar/Sidebar Icon (Selected)` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Collapsed=False | `Text Color/Body/Inverted → Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Sidebar/Sidebar` |
| iconWrapper | fill | `Background/Transparent` |
| icon | fill | `Text Color/Body/Inverted → Primary` |
| divider | border | `Background/App Header/Navigation Button Border` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Collapsed=False | `Subtitle/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Sidebar / Item | border-radius | — | `rounded-8` |
| Sidebar / Item | gap | Collapsed=False | `size-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (4px)
- **Container**: hardcoded padding
- **container**: hardcoded itemSpacing (8px)
- **container**: hardcoded padding
- **Sidebar / Item**: hardcoded itemSpacing (10px)
- **Sidebar / Item**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Sidebar / Indicator**: hardcoded itemSpacing (8px)
- **Sidebar / Indicator**: hardcoded padding
- **Scroller**: hardcoded itemSpacing (8px)
- **Scroller**: hardcoded padding
- **Rectangle 21**: hardcoded cornerRadius (16px)
