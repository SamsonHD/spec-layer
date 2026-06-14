---
spec_version: "0.1"
component:
  name: Empty Page
  figma_key: e29c1d67053dcb12db3aaa4e3a954979e899b275
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 11929:356052
content_hash: 6828ac6d6ad49f13c34cf1c2057ba6aa793d5c7e5353ccf490a2ff9ec3040504
extracted_at: 2026-06-14T10:03:56.192Z
---

## Definition

_To be written._

## Anatomy

1. Image Type (component)
2. Title
3. Description
4. CTAs

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Image | boolean | true / false | true |
| Primary Btn | boolean | true / false | true |
| Secondary Btn | boolean | true / false | true |
| Show Description | boolean | true / false | true |
| Link Btn | boolean | true / false | true |
| Show CTAs | boolean | true / false | true |
| Show TItle | boolean | true / false | true |
| Content Slot | instanceSwap | — | 5507:362804 |
| Description | text | — | This is description. |
| Title | text | — | Title |

## Variants

- **Device**: Desktop (default) · Mobile
- **Content Type**: Text (default) · Slot
- **Layout**: Vertical (default) · Horizontal

## States

- Default

## Tokens used

### Color

#### Title

| Property | Condition | Token |
|---|---|---|
| fill | Content Type=Text | `Text Color/Body/Primary` |

#### This is description.

| Property | Condition | Token |
|---|---|---|
| fill | Content Type=Text | `Text Color/Body/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Vector | fill | `Accent/accent-15` |
| Vector | fill | `Background/Action/Action Quaternary` |
| Vector | fill | `Background/Surface/Inverted → Quaternary` |
| Vector | fill | `Background/Surface/Primary` |
| Vector | fill | `Background/Surface/Secondary` |
| Button | fill | `Background/Action/Action` |
| Button | fill | `Background/Action/Action Secondary` |
| Button | border | `Border Color/Action/Secondary Button (Default)` |
| Label | fill | `Text Color/Action/On Action` |
| Label | fill | `Text Color/Action/On Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | Device=Desktop, Content Type=Text | `Heading/M` |
| Title | typography | Device=Mobile, Content Type=Text | `Heading/S` |
| This is description. | typography | Content Type=Text | `Body/L` |
| Label | typography | — | `Action/M` |
| Replace Me | typography | Content Type=Slot | `[ARCHIVE]/*Mobile/Field Label` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.EmptyPage_Image](./emptypageimage.md)

## Extraction gaps

- **Title**: hardcoded padding
- **Description**: hardcoded padding
- **CTAs**: hardcoded itemSpacing (16px)
- **CTAs**: hardcoded padding
- **Primary and Secondary Btns**: hardcoded itemSpacing (16px)
- **Button**: hardcoded itemSpacing (8px)
- **Button**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
