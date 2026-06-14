---
spec_version: "0.1"
component:
  name: Segment Control
  figma_key: 5588c21de8ab635d06ff2ccc20a96aa2af8173b2
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7949:325540
content_hash: e1761a16eb387fa727f6b0f5c925927ae2ac02e22f31091a0fa6e1fec5c49731
extracted_at: 2026-06-14T10:04:05.594Z
---

## Definition

_To be written._

## Anatomy

1. .segmentedControlLabel Wrapper new (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label 3 | boolean | true / false | true |
| Label 4 | boolean | true / false | true |

## Variants

- **Style**: Text (default) · Icon · Text+Icon
- **Size**: Medium (default) · Small

## States

- Default

## Tokens used

### Color

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Style=Text · Text+Icon | `Text Color/Body/Primary` |

#### Segment

| Property | Condition | Token |
|---|---|---|
| fill | Style=Text+Icon, Size=Medium | `Background/Surface/Primary` |
| border | Style=Text+Icon, Size=Medium | `Border Color/Chip/Default` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Style=Icon · Text+Icon | `Text Color/Body/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Segment Control/Segment Control` |
| .segmentedControlLabel Wrapper new | fill | `Background/Surface/Primary` |
| .segmentedControlLabel Wrapper new | border | `Border Color/Chip/Default` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Style=Text · Text+Icon | `Value/S` |
| Label | typography | Style=Text+Icon, Size=Medium | `[ARCHIVE]/*Mobile/Field Label` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| .segmentedControlLabel Wrapper new | effects | — | `Segmented Control` |
| Segment | effects | Style=Text+Icon, Size=Medium | `Segmented Control` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.segmentedControlLabel Wrapper new](./segmentedcontrollabel-wrapper-new.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (4px)
- **Container**: hardcoded padding
- **.segmentedControlLabel Wrapper new**: hardcoded itemSpacing (8px)
- **.segmentedControlLabel Wrapper new**: hardcoded cornerRadius (6px)
- **.segmentedControlLabel Wrapper new**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
