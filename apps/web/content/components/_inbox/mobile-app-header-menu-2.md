---
spec_version: "0.1"
component:
  name: Mobile App Header Menu
  figma_key: 00719bd35560ca2e58d7f248dcca17825403c7ca
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 8198:335254
content_hash: e839cef8bba9d455598404c1c43ccddc458fd78925007cc581a3e32c4b9612d8
extracted_at: 2026-06-14T10:07:47.213Z
---

## Definition

_To be written._

## Anatomy

1. My Location
2. Divider (component)
3. Help & Support
4. Profile & Settings

## Configuration

_None._

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Button Icon | fill | `Background/Action/Action Tertiary` |
| icon | fill | `Text Color/Body/Primary` |
| Vector | fill | `Text Color/Body/Secondary` |
| Title | fill | `Text Color/Body/Primary` |
| Rectangle 7235 | fill | `Background/Divider/Divider` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | — | `[ARCHIVE]/*Mobile/Heading6` |
| Replace Me | typography | — | `[ARCHIVE]/*Mobile/Field Label` |

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

- [Divider](./divider.md)

## Extraction gaps

- **My Location**: hardcoded padding
- **Accordion**: hardcoded itemSpacing (16px)
- **Accordion**: hardcoded cornerRadius (12px)
- **Header**: hardcoded itemSpacing (8px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Title Wrapper**: hardcoded itemSpacing (8px)
- **Title Wrapper**: hardcoded padding
- **Icon Wrapper**: hardcoded padding
- **Map Marker Alt**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
- **<spacer> w-size-40**: hardcoded color (no variable or style)
- **Content Slot**: hardcoded color (no variable or style)
- **Content Slot**: hardcoded padding
- **Replace Me**: hardcoded color (no variable or style)
- **Divider**: hardcoded itemSpacing (10px)
- **Divider**: hardcoded padding
- **Help & Support**: hardcoded padding
- **Question Circle**: hardcoded color (no variable or style)
- **Profile & Settings**: hardcoded padding
- **User**: hardcoded color (no variable or style)
