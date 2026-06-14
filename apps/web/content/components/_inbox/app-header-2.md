---
spec_version: "0.1"
component:
  name: App Header
  figma_key: a37e400265789669d46684892cfca6d8a98b22bb
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 13541:85960
content_hash: b61cac23b72f3c2f7db556b0e6c9ad2fbeb6bfce9f2219e5e0eea768e34c9579
extracted_at: 2026-06-14T10:07:47.211Z
---

## Definition

_To be written._

## Anatomy

1. Header Content
2. Button Group
3. Profile Button

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Profile Btn | boolean | true / false | true |
| Show Subtitle | boolean | true / false | true |
| Breadcrumb | boolean | true / false | false |
| Subtitle Txt | text | — | Subtitle |
| Menu Btn | boolean | true / false | false |

## Variants

- **Btn Placement**: Right (default) · Centered
- **Modifiers**: Mobile

## States

- Default

## Tokens used

### Color

#### Ellipse 1

| Property | Condition | Token |
|---|---|---|
| border | Mobile=false | `Text Color/Body/Primary` |

#### Ellipse 2

| Property | Condition | Token |
|---|---|---|
| fill | Mobile=false | `Text Color/Body/Primary` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Mobile=false | `Text Color/Body/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/App Header/Default` |
| Title | fill | `Text Color/Body/Primary` |
| Subtitle | fill | `Text Color/Body/Secondary` |
| Style | fill | `Background/Surface/Primary` |
| Initials | fill | `Background/Surface/Tertiary` |
| AA | fill | `Text Color/Body/Black` |
| Vector | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | Mobile=false | `[ARCHIVE]/*Desktop/Heading4` |
| Title | typography | Mobile=true | `[ARCHIVE]/*Mobile/Heading4` |
| Subtitle | typography | Mobile=false | `[ARCHIVE]/*Mobile/Heading6` |
| Subtitle | typography | Mobile=true | `[ARCHIVE]/*Mobile/Field Value (Emphasized)` |
| Label | typography | Mobile=false | `[ARCHIVE]/*Tablet Portrait/Button Label Small` |
| AA | typography | Mobile=false | `Subtitle/S` |
| AA | typography | Mobile=true | `Caption/XS - Strong` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (12px)
- **Container**: hardcoded padding
- **Style**: hardcoded itemSpacing (4px)
- **Style**: hardcoded cornerRadius (9999px)
- **Style**: hardcoded padding
- **Icon + Label**: hardcoded itemSpacing (4px)
- **Navicon**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Menu Arrow**: hardcoded itemSpacing (10px)
- **Menu Arrow**: hardcoded padding
- **Chevron Down**: hardcoded color (no variable or style)
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
- **Header Content**: hardcoded itemSpacing (4px)
- **Header Title**: hardcoded itemSpacing (10px)
- **Breadcrumbs**: hardcoded itemSpacing (8px)
- **.Breadcrumb Item**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Button Group**: hardcoded itemSpacing (12px)
- **Icon + Label**: hardcoded itemSpacing (8px)
- **Profile Thumbnail**: hardcoded padding
- **Avatar**: hardcoded itemSpacing (4px)
- **Avatar**: hardcoded cornerRadius (9999px)
- **Initials**: hardcoded cornerRadius (9999px)
- **Initials**: hardcoded padding
- **Status Badge**: hardcoded cornerRadius (100px)
- **Label Wrapper**: hardcoded padding
- **Menu Arrow Wrapper**: hardcoded padding
- **<spacer>**: hardcoded color (no variable or style)
