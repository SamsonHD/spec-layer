---
spec_version: "0.1"
component:
  name: Secondary Navigation
  figma_key: ba7ebe33d66c72f4c8372b7d2857030c97a87ab3
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24555:2701
content_hash: 57ba3ec6cf28869da054c9d7a0dc712a7926402477f6c91cf86b85fca2a7e854
extracted_at: 2026-06-14T10:03:58.015Z
---

## Definition

_To be written._

## Anatomy

1. header
2. section_1
3. section_3
4. section_2
5. Bottom Slot

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Bottom Slot | undefined | — | — |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Secondary Navigation | fill | `Background/Surface/Primary` |
| Secondary Navigation | border | `Border Color/Divider/Divider Secondary` |
| header | fill | `Background/Surface/Primary` |
| moduleName | fill | `Text Color/Body/Primary` |
| iconButton/Secondary | fill | `Background/Surface/Page` |
| iconButton/Secondary | border | `Border Color/Action/Secondary Button (Default)` |
| icon | fill | `Text Color/Body/Secondary` |
| Secondary Sidebar Item | fill | `Background/Sidebar/Secondary Sidebar Item Selected` |
| Overview | fill | `Text Color/Action/Link Secondary` |
| Overview | fill | `Text Color/Body/Primary` |
| divider | border | `Border Color/Divider/Divider Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| moduleName | typography | — | `Subtitle/M - Strong` |
| Overview | typography | — | `New/Subtitle/S4 : 14px SemiBold` |
| Overview | typography | — | `Subtitle/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| iconButton/Secondary | border-radius | — | `rounded-full` |
| iconWrapper | border-radius | — | `rounded-full` |
| Secondary Sidebar Item | border-radius | — | `rounded-8` |
| Secondary Sidebar Item | padding-x | — | `size-8` |
| Secondary Sidebar Item | padding-y | — | `size-4` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **header**: hardcoded itemSpacing (21px)
- **header**: hardcoded padding
- **Row**: hardcoded itemSpacing (105px)
- **Row**: hardcoded padding
- **iconButton/Secondary**: hardcoded itemSpacing (12px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **section_1**: hardcoded itemSpacing (8px)
- **section_1**: hardcoded padding
- **list**: hardcoded itemSpacing (8px)
- **list**: hardcoded padding
- **Secondary Sidebar Item**: hardcoded itemSpacing (8px)
- **.sidebar-item-label-wrapper**: hardcoded itemSpacing (10px)
- **section_2**: hardcoded itemSpacing (8px)
- **section_2**: hardcoded padding
- **section_3**: hardcoded itemSpacing (16px)
- **section_3**: hardcoded padding
- **Bottom Slot**: hardcoded itemSpacing (4px)
- **Bottom Slot**: hardcoded padding
