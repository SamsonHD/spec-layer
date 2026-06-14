---
spec_version: "0.1"
component:
  name: Marketing Header
  figma_key: 62bca8be1eb8d24af4a7ed9291bdd79cd0581274
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 12823:234358
content_hash: e6301ca54f362b399bc28a5dfd0df8c81522eb3f9ffcc2cbd3a16a3906f57c82
extracted_at: 2026-06-14T10:07:47.254Z
---

## Definition

_To be written._

## Anatomy

1. Logo (component)
2. Buttons

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Link 3 | boolean | true / false | false |
| Link 4 | boolean | true / false | false |
| Link 5 | boolean | true / false | false |
| Link 6 | boolean | true / false | false |

## Variants

- **Device**: Desktop (default) · Tablet · Mobile
- **Link Alignment**: Right (default) · Center · Left
- **Modifiers**: Color Inverted · Background

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| fill | Background=True | `Background/Surface/Primary` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Device=Desktop | `Text Color/Body/Primary` |
| fill | Device=Desktop, Color Inverted=True | `Text Color/Body/Inverted → Primary` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | — | `Text Color/Body/Primary` |
| fill | Device=Mobile, Color Inverted=False | `Background/Surface/Brand` |
| fill | Device=Mobile, Color Inverted=True | `Background/Surface/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Style | fill | `Background/Surface/Primary` |
| Style | border | `Border Color/Chip/Disabled` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Device=Desktop | `[ARCHIVE]/*Tablet Portrait/Button Label` |
| Label | typography | Device=Desktop | `[ARCHIVE]/*Tablet Portrait/Button Label Small` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Logo](./logo.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (72px)
- **Container**: hardcoded padding
- **Vector**: hardcoded color (no variable or style)
- **Buttons**: hardcoded itemSpacing (24px)
- **Header Links**: hardcoded itemSpacing (24px)
- **Style**: hardcoded itemSpacing (4px)
- **Style**: hardcoded padding
- **Icon + Label**: hardcoded itemSpacing (8px)
- **Menu Arrow**: hardcoded itemSpacing (10px)
- **Menu Arrow**: hardcoded padding
- **Chevron Down**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
- **Header Buttons**: hardcoded itemSpacing (24px)
- **Style**: hardcoded cornerRadius (9999px)
- **Arrow Right To Arc**: hardcoded color (no variable or style)
- **Shopping Cart**: hardcoded color (no variable or style)
