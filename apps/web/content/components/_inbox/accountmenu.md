---
spec_version: "0.1"
component:
  name: accountMenu
  figma_key: 260c3db7f57150cfcc97121df44716fdcc6532ae
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24536:2581
content_hash: f29d4e1b6f30b7d1aa03c2006a9f5484900f41c10655ec0168e3f0ca9d5e7361
extracted_at: 2026-06-14T10:04:05.502Z
---

## Definition

_To be written._

## Anatomy

1. Container

## Configuration

_None._

## Variants

- **View**: Team Member (default) · Admin

## States

- Default

## Tokens used

### Color

#### divider

| Property | Condition | Token |
|---|---|---|
| border | View=Admin | `Border Color/Divider/Divider Secondary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | border | `Border Color/Divider/Divider Secondary` |
| Container | fill | `Background/Surface/Secondary` |
| Label | fill | `Text Color/Body/Primary` |
| Label | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Caption/S - Compact` |
| Label | typography | — | `Caption/S - Strong` |
| Label | typography | — | `Subtitle/M - Strong` |
| Label | typography | — | `Value/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | effects | — | `Shadows/Dropdown Menu` |
| Container | effects | — | `Shadows/Dropdown Menu/0/color` |
| Container | effects | — | `Shadows/Dropdown Menu/0/offsetX` |
| Container | effects | — | `Shadows/Dropdown Menu/0/offsetY` |
| Container | effects | — | `Shadows/Dropdown Menu/0/radius` |
| Container | effects | — | `Shadows/Dropdown Menu/0/spread` |
| Container | effects | — | `Shadows/Dropdown Menu/1/color` |
| Container | effects | — | `Shadows/Dropdown Menu/1/offsetX` |
| Container | effects | — | `Shadows/Dropdown Menu/1/offsetY` |
| Container | effects | — | `Shadows/Dropdown Menu/1/radius` |
| Container | effects | — | `Shadows/Dropdown Menu/1/spread` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded color (no variable or style)
- **Container**: hardcoded cornerRadius (8px)
- **Container**: hardcoded padding
- **Container**: hardcoded itemSpacing (12px)
- **Avatar**: hardcoded itemSpacing (4px)
- **Avatar**: hardcoded cornerRadius (9999px)
- **Photo**: hardcoded itemSpacing (8px)
- **Photo**: hardcoded cornerRadius (9999px)
- **Status Badge**: hardcoded cornerRadius (100px)
- **Title**: hardcoded itemSpacing (4px)
- **Container**: hardcoded itemSpacing (8px)
- **Billing**: hardcoded color (no variable or style)
- **Billing**: no text style or typography variable
- **Container**: hardcoded itemSpacing (4px)
- **Button**: hardcoded cornerRadius (4px)
- **Button**: hardcoded padding
- **Billing & Plans**: hardcoded color (no variable or style)
- **Billing & Plans**: no text style or typography variable
- **Invoices**: hardcoded color (no variable or style)
- **Invoices**: no text style or typography variable
- **Dropdown Menu Option**: hardcoded color (no variable or style)
- **Dropdown Menu Option**: hardcoded padding
- **optionWrapper**: hardcoded itemSpacing (8px)
- **optionWrapper**: hardcoded cornerRadius (4px)
- **optionWrapper**: hardcoded padding
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
