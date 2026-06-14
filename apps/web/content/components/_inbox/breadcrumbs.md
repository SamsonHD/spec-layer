---
spec_version: "0.1"
component:
  name: Breadcrumbs
  figma_key: b10d0ec1035b4b97753fd7a8f47846a8d966e90d
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 2889:190149
content_hash: e74961395badab373c139fae98044adb8d8b219b09f97eafc7c2698e22603144
extracted_at: 2026-06-14T10:03:14.975Z
---

## Definition

_To be written._

## Anatomy

1. .Breadcrumb Item (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Item 3 | boolean | true / false | true |
| Item 4 | boolean | true / false | true |
| Item 5 | boolean | true / false | true |
| Item 6 | boolean | true / false | true |
| Item 7 | boolean | true / false | true |
| Item 8 | boolean | true / false | true |

## Variants

- **Modifiers**: Mobile · Collapsed

## States

- Default

## Tokens used

### Color

#### Item

| Property | Condition | Token |
|---|---|---|
| fill | — | `Text Color/Action/Link` |
| fill | Mobile=false | `Text Color/Body/Primary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Mobile=false | `Text Color/Body/Secondary` |

#### ...

| Property | Condition | Token |
|---|---|---|
| fill | Collapsed=true | `Text Color/Action/Link` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Mobile=true | `Text Color/Action/Link` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Item | typography | — | `Label/S - Strong` |
| ... | typography | Collapsed=true | `Label/S - Strong` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.Breadcrumb Item](./breadcrumb-item.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **.Breadcrumb Item**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
