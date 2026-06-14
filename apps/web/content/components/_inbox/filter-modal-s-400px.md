---
spec_version: "0.1"
component:
  name: Filter - Modal-S (400px)
  figma_key: 6e59cf6972640e92a6cd53b88478cf634464bca0
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25996:42719
content_hash: e762978bf484b2ef2855ce51816e26789459d4488ac242d1ec8dc0cb61ff82d4
extracted_at: 2026-06-14T10:03:12.527Z
---

## Definition

_To be written._

## Anatomy

1. SidepanelHeader (component)
2. List
3. SidepanelFooter (component)

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
| Filter - Modal-S (400px) | fill | `Background/Surface/Primary` |
| SidepanelHeader | fill | `Background/Surface/Primary` |
| SidepanelHeader | border | `Border Color/Divider/Divider Secondary` |
| title | fill | `Text Color/Primary` |
| subtitle | fill | `Text Color/Body/Secondary` |
| Button Icon | fill | `Background/Action/Action Tertiary` |
| icon | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Secondary` |
| List | fill | `Background/Surface/Primary` |
| filterContainer | fill | `Background/Surface/Primary` |
| filterContainer | border | `Border Color/Divider/Divider Secondary` |
| Worker type | fill | `Text Color/Body/Primary` |
| SidepanelFooter | fill | `Background/Surface/Primary` |
| SidepanelFooter | border | `Border Color/Divider/Divider Secondary` |
| Button | fill | `Background/Action/Action` |
| Button | fill | `Background/Action/Action Secondary` |
| Button | border | `Border Color/Action/Secondary Button (Default)` |
| Label | fill | `Text Color/Action/On Action` |
| Label | fill | `Text Color/Action/On Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| title | typography | — | `Subtitle/L - Strong` |
| subtitle | typography | — | `Body/M` |
| Worker type | typography | — | `Subtitle/S` |
| Label | typography | — | `Action/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Filter - Modal-S (400px) | effects | — | `Shadows/Side Panel` |
| Button Icon | border-radius | — | `rounded-8` |
| Button | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [SidepanelHeader](./sidepanelheader.md)
- [SidepanelFooter](./sidepanelfooter.md)

## Extraction gaps

- **SidepanelHeader**: hardcoded itemSpacing (24px)
- **SidepanelHeader**: hardcoded padding
- **Container**: hardcoded itemSpacing (4px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **filterContainer**: hardcoded padding
- **Button**: hardcoded itemSpacing (8px)
- **Title**: hardcoded itemSpacing (8px)
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
- **SidepanelFooter**: hardcoded itemSpacing (12px)
- **SidepanelFooter**: hardcoded padding
- **Button**: hardcoded padding
