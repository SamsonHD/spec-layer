---
spec_version: "0.1"
component:
  name: Modal Header
  figma_key: 6434c2599f83db796e5c34e483e385bd80af4bb6
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24776:133854
content_hash: d96984d9057b0a13e6029045cc270275269255a6bf1f8818276bcf98b03bf03b
extracted_at: 2026-06-14T10:03:58.000Z
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
| Show Close Icon | boolean | true / false | true |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Modal Header | fill | `Background/Surface/Primary` |
| Modal Header | border | `Border Color/Divider/Divider Secondary` |
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

- **Modal Header**: hardcoded itemSpacing (16px)
- **Modal Header**: hardcoded padding
- **Header**: hardcoded itemSpacing (24px)
- **Title + Description**: hardcoded itemSpacing (4px)
- **Description**: hardcoded itemSpacing (8px)
- **Close Icon Container**: hardcoded itemSpacing (8px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
