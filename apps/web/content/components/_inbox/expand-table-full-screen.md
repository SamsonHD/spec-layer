---
spec_version: "0.1"
component:
  name: Expand Table Full Screen
  figma_key: 71b5b6c9cf860ce1b3240c96ae51fb6d39760b06
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25660:6433
content_hash: cd012c2fbdc47ee366a800d15d79729d10677862c7a589f780141c6d35eef23f
extracted_at: 2026-06-14T10:03:58.001Z
---

## Definition

_To be written._

## Anatomy

1. Title + Description
2. Close Icon Container

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Description | boolean | true / false | true |
| Show Close Icon Container | boolean | true / false | true |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Expand Table Full Screen | fill | `Background/Surface/Primary` |
| Expand Table Full Screen | border | `Border Color/Divider/Divider Secondary` |
| Header | fill | `Background/Surface/Primary` |
| Title | fill | `Text Color/Body/Primary` |
| Text content displayed within the modal | fill | `Text Color/Body/Secondary` |
| Button Icon | fill | `Background/Action/Action Tertiary` |
| icon | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | — | `Heading/XS` |
| Text content displayed within the modal | typography | — | `Body/M` |

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

- **Expand Table Full Screen**: hardcoded itemSpacing (16px)
- **Expand Table Full Screen**: hardcoded padding
- **Header**: hardcoded itemSpacing (24px)
- **Title + Description**: hardcoded itemSpacing (4px)
- **Description**: hardcoded itemSpacing (8px)
- **Close Icon Container**: hardcoded itemSpacing (8px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
