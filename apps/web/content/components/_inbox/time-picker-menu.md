---
spec_version: "0.1"
component:
  name: Time Picker Menu
  figma_key: e3c8d5c62c6583d83a0724a8898de426e059b5c8
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 6430:358000
content_hash: 6d5b8471ffabc16fe9f2ef750aa841bec5257c3b57a783faef8492944cfabeb1
extracted_at: 2026-06-14T10:04:11.675Z
---

## Definition

_To be written._

## Anatomy

1. .timePickerWrapper
2. Divider (component)
3. buttons

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| 12h Format | boolean | true / false | true |

## Variants

- **Style**: 2 · 1 (default)

## States

- Default

## Tokens used

### Color

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | — | `Text Color/Body/Inverted → Primary` |
| fill | — | `Text Color/Body/Primary` |
| fill | Style=1 | `Text Color/Action/Link` |

#### Rectangle 7235

| Property | Condition | Token |
|---|---|---|
| fill | Style=1 | `Background/Divider/Divider` |
| fill | Style=1 | `Background/Divider/Divider Secondary` |

#### buttons

| Property | Condition | Token |
|---|---|---|
| fill | Style=1 | `Background/Transparent` |

#### ⚠️ [Deprecated] Button (Link)

| Property | Condition | Token |
|---|---|---|
| fill | Style=1 | `Background/Transparent` |

#### AM/PM

| Property | Condition | Token |
|---|---|---|
| fill | Style=2 | `Text Color/Body/Inverted → Primary` |
| fill | Style=2 | `Text Color/Body/Primary` |

#### scroll bar

| Property | Condition | Token |
|---|---|---|
| fill | Style=2 | `Background/Semantic/Status → Informational` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| Container | border | `Border Color/Input Field/Input Field` |
| .Time Picker Cell | fill | `Background/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `Value/M` |
| Label | typography | Style=1 | `[ARCHIVE]/*Tablet Portrait/Button Label Small` |
| AM/PM | typography | Style=2 | `Value/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | effects | — | `light/Shadow/Dropdown Menu` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Divider](./divider.md)

## Extraction gaps

- **Container**: hardcoded cornerRadius (8px)
- **Container**: hardcoded padding
- **.hourWrapper**: hardcoded padding
- **.Time Picker Cell**: hardcoded cornerRadius (4px)
- **.Time Picker Cell**: hardcoded padding
- **.minWrapper**: hardcoded padding
- **.ampmWrapper**: hardcoded padding
- **Divider**: hardcoded itemSpacing (10px)
- **Divider**: hardcoded padding
- **buttons**: hardcoded padding
- **⚠️ [Deprecated] Button (Link)**: hardcoded itemSpacing (10px)
- **⚠️ [Deprecated] Button (Link)**: hardcoded cornerRadius (9999px)
