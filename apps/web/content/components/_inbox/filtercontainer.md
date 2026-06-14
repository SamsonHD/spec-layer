---
spec_version: "0.1"
component:
  name: filterContainer
  figma_key: d622813603d8d6886ff4a9bccb9511f1ad612d9f
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25996:42845
content_hash: 05cd70f42dd39bdec733114715e7e3ed7f6d6e5545f3c5dd046ca27d41557231
extracted_at: 2026-06-14T10:03:12.529Z
---

## Definition

_To be written._

## Anatomy

1. Title
2. iconWrapper (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Badge | boolean | true / false | false |
| Group Content | undefined | — | — |

## Variants

- **Type**: Checkbox (default) · Date
- **Modifiers**: Collapsed

## States

- Default

## Tokens used

### Color

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Type=Checkbox | `Text Color/Body/Secondary` |
| fill | Type=Date | `Text Color/Body/Secondary` |
| fill | Collapsed=False, Type=Checkbox | `Text Color/Body/Primary` |

#### Input

| Property | Condition | Token |
|---|---|---|
| fill | Collapsed=False, Type=Checkbox | `Background/Surface/Primary` |
| border | Collapsed=False, Type=Checkbox | `Border Color/Input Field/Input Field` |

#### Text Content

| Property | Condition | Token |
|---|---|---|
| fill | Collapsed=False, Type=Checkbox | `Text Color/Input/Input Placeholder` |

#### Check Wrapper

**When Collapsed = False**

| Property | Checkbox | Date |
|---|---|---|
| border | `Border Color/Action/Action` · `Border Color/Input Field/Input Field` | — |
| fill | `Background/Action/Action` · `Background/Surface/Primary` | — |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Collapsed=False, Type=Checkbox | `Text Color/Body/Inverted → Primary` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Collapsed=False | `Text Color/Body/Primary` |

#### Picker

| Property | Condition | Token |
|---|---|---|
| fill | Type=Date | `Background/Surface/Primary` |
| border | Type=Date | `Border Color/Input Field/Input Field` |

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Type=Date | `Text Color/Input/Input Placeholder` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| Container | border | `Border Color/Divider/Divider Secondary` |
| Worker type | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Worker type | typography | — | `Subtitle/S` |
| Text Content | typography | Collapsed=False, Type=Checkbox | `Value/S` |
| Label | typography | Type=Date | `Label/S` |
| Label | typography | Collapsed=False, Type=Checkbox | `Value/S` |
| Placeholder | typography | Type=Date | `Value/S` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded padding
- **Button**: hardcoded itemSpacing (8px)
- **Title**: hardcoded itemSpacing (8px)
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
