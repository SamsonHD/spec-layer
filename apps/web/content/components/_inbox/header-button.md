---
spec_version: "0.1"
component:
  name: Header Button
  figma_key: ec39ffc3da40e98a0b94b4f74179a8ff4a9be990
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 13518:98667
content_hash: 647491330abc4b7f2c46bf1b8c21deef11038145e4019005789571969d2ac650
extracted_at: 2026-06-14T10:07:43.782Z
---

## Definition

_To be written._

## Anatomy

1. Style (component)

## Configuration

_None._

## Variants

- **Style**: Button (default) · Link

## States

- Default

## Tokens used

### Color

#### Style

| Property | Condition | Token |
|---|---|---|
| fill | Style=Button | `Background/Surface/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Ellipse 1 | border | `Text Color/Body/Primary` |
| Ellipse 2 | fill | `Text Color/Body/Primary` |
| Label | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Style=Button | `[ARCHIVE]/*Tablet Portrait/Button Label Small` |
| Label | typography | Style=Link | `[ARCHIVE]/*Tablet Portrait/Button Label` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.Header Button-Button Style](./header-button-button-style.md)

## Extraction gaps

- **Style**: hardcoded itemSpacing (4px)
- **Style**: hardcoded cornerRadius (9999px)
- **Style**: hardcoded padding
- **Icon + Label**: hardcoded itemSpacing (8px)
- **Menu Arrow**: hardcoded itemSpacing (10px)
- **Menu Arrow**: hardcoded padding
- **Chevron Down**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
