---
spec_version: "0.1"
component:
  name: Tab
  figma_key: bb4db261c21ecda97239706621a735c68151addd
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 6525:358163
content_hash: 792f51c633945781d942a2c77c4b01ee90c2bef94c451e9fb9c6846acce5f0e1
extracted_at: 2026-06-14T10:04:11.616Z
---

## Definition

_To be written._

## Anatomy

1. Label

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label | text | — | Label |
| Show Counter Badge | boolean | true / false | false |
| Show Icon | boolean | true / false | false |
| Show Close Button | boolean | true / false | false |
| Show Info Icon | boolean | true / false | false |

## Variants

- **Style**: Secondary (default)
- **Type**: Label (default) · Next · Previous
- **Modifiers**: Selected · Disabled

## States

- Default
- Hover
- Focus

## Tokens used

### Color

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Type=Label, Selected=false, Disabled=false | `Text Color/Body/Primary` |
| fill | Selected=true | `Text Color/Action/Link Secondary` |
| fill | Disabled=true | `Text Color/Semantic/Disabled` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | States=Focus, Disabled=false | `Border Color/Action/Action` |

#### Container

| Property | Condition | Token |
|---|---|---|
| border | Selected=true | `Accent/accent-2` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Type=Next · Previous, States=Default · Focus | `Text Color/Body/Primary` |
| fill | Type=Next · Previous, States=Hover | `Text Color/Action/Link` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Type=Label | `Tab/Tabs` |

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
- **Label Wrapper**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
- **Close Button Wrapper**: hardcoded itemSpacing (10px)
- **Xmark Large**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
