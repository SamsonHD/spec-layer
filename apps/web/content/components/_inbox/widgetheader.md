---
spec_version: "0.1"
component:
  name: WidgetHeader
  figma_key: 1c3632a1824549705d902219af04e3301d927128
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25321:10176
content_hash: 8d773d9afbe2c1ac8e3f9c4bf9ed9c91a46e37e3971f57eeb52e50c39be3f151
extracted_at: 2026-06-14T10:04:19.071Z
---

## Definition

_To be written._

## Anatomy

1. Title
2. Add affordances

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show expand | boolean | true / false | true |
| Show affordances | boolean | true / false | true |
| Swap affordances | instanceSwap | — | 25321:10171 |
| Add affordances | undefined | — | — |

## Variants

- **Modifiers**: description

## States

- Default

## Tokens used

### Color

#### Description

| Property | Condition | Token |
|---|---|---|
| fill | description=True | `Text Color/Body/Secondary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| Title | fill | `Text Color/Body/Primary` |
| Button Icon | border | `Border Color/Action/Secondary Button (Default)` |
| Button Icon | fill | `Background/Action/Action Tertiary` |
| icon | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | — | `Subtitle/L - Strong` |
| Description | typography | description=True | `Body/M` |

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

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (24px)
- **Container**: hardcoded padding
- **Title**: hardcoded itemSpacing (4px)
- **Add affordances**: hardcoded itemSpacing (12px)
- **WidgetActions/table**: hardcoded itemSpacing (8px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
