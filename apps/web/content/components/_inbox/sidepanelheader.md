---
spec_version: "0.1"
component:
  name: SidepanelHeader
  figma_key: 08034f12fd2539135f355b0ad60916fab1daa7f0
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26592:6220
content_hash: 41fb0ecfdc17347d00140672bf7c794e6c31059377e523116a231980e4cdc13f
extracted_at: 2026-06-14T10:04:11.591Z
---

## Definition

_To be written._

## Anatomy

1. Container
2. Button Icon (component)

## Configuration

_None._

## Variants

- **Modifiers**: Description

## States

- Default

## Tokens used

### Color

#### subtitle

| Property | Condition | Token |
|---|---|---|
| fill | Description=True | `Text Color/Body/Secondary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| Container | border | `Border Color/Divider/Divider Secondary` |
| title | fill | `Text Color/Primary` |
| Button Icon | fill | `Background/Action/Action Tertiary` |
| icon | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| title | typography | — | `Subtitle/L - Strong` |
| subtitle | typography | Description=True | `Body/M` |

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

- [Button Icon](./button-icon.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (24px)
- **Container**: hardcoded padding
- **Container**: hardcoded itemSpacing (4px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
