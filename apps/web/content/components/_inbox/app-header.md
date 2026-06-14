---
spec_version: "0.1"
component:
  name: App Header
  figma_key: bfcf912bce6879eedce2517804a5a647eb7494bc
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24441:5299
content_hash: c15a91e9fb62fa25e23f41b375721783fba1ee26fb3c0ce222949a76a7dea4dd
extracted_at: 2026-06-14T10:03:58.020Z
---

## Definition

_To be written._

## Anatomy

1. Top Navigation / Branding (component)
2. Search (TBD)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Notification | boolean | true / false | true |

## Variants

- **Type**: Default (default) · Auris Internal
- **Modifiers**: Collapsed

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/App Header/Default` |
| Top Navigation / companyName | fill | `Background/Surface/Quaternary` |
| Label | fill | `Text Color/Body/Inverted → Primary` |
| Label | fill | `Text Color/Body/Primary` |
| Label | fill | `Text Color/Body/Secondary` |
| Admin View | fill | `Text Color/Body/Secondary` |
| iconWrapper | fill | `Background/Transparent` |
| icon | fill | `Text Color/Body/Inverted → Primary` |
| icon | fill | `Text Color/Body/Primary` |
| Button | fill | `Background/App Header/Navigation Button` |
| Search | fill | `Background/Surface/Quaternary` |
| Primary | fill | `Text Color/Body/Primary` |
| Top Navigation / Button | fill | `Background/Action/Action Quaternary` |
| Ellipse 1 | fill | `Accent/accent-1` |
| Top Navigation / accountMenu Button | fill | `Background/Surface/Quaternary` |
| John Doe | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Action/S` |
| Label | typography | — | `Action/XS` |
| Label | typography | — | `Tablet Portrait/Button Label Small` |
| Admin View | typography | — | `Caption/XS` |
| John Doe | typography | — | `Action/XS` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| companyName/companyLogo | border-radius | Type=Default | `rounded-4` |
| Button | border-top-right-radius | — | `rounded-8` |
| Top Navigation / Button | border-radius | — | `rounded-8` |
| Top Navigation / accountMenu Button | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Top Navigation / Branding](./top-navigation-branding.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (264px)
- **Top Navigation / Branding**: hardcoded itemSpacing (16px)
- **Top Navigation / Branding**: hardcoded padding
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
- **Button**: hardcoded cornerRadius (8px)
- **Button**: hardcoded padding
- **Search (TBD)**: hardcoded itemSpacing (32px)
- **Search**: hardcoded itemSpacing (4px)
- **Search**: hardcoded cornerRadius (8px)
- **Search**: hardcoded padding
- **Icon + Label**: hardcoded itemSpacing (8px)
- **Right Side**: hardcoded itemSpacing (16px)
- **Right Side**: hardcoded padding
- **Actions**: hardcoded itemSpacing (4px)
- **Top Navigation / Button**: hardcoded itemSpacing (10px)
- **Top Navigation / Button**: hardcoded padding
- **iconWrapper**: hardcoded cornerRadius (4px)
- **Sidebar / Indicator**: hardcoded itemSpacing (8px)
- **Sidebar / Indicator**: hardcoded padding
- **Top Navigation / accountMenu Button**: hardcoded itemSpacing (8px)
- **Top Navigation / accountMenu Button**: hardcoded padding
- **Container**: hardcoded itemSpacing (8px)
- **Avatar**: hardcoded itemSpacing (4px)
- **Avatar**: hardcoded cornerRadius (9999px)
- **Photo**: hardcoded itemSpacing (8px)
- **Photo**: hardcoded cornerRadius (9999px)
- **Status Badge**: hardcoded cornerRadius (100px)
