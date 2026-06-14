---
spec_version: "0.1"
component:
  name: Button Group
  figma_key: 743fef41922698febfc7dca721b6e391655ce303
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 11366:346984
content_hash: 233fbbaa95226d4927ec774cf1a7275c4941f74bc6ad4cc6fdd6dd82530307be
extracted_at: 2026-06-14T10:03:23.768Z
---

## Definition

_To be written._

## Anatomy

1. Action 1 (component)
2. Action 2 (component)
3. Action 3 (component)
4. Action 4 (component)
5. .buttonGroupItem (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Action 2 | boolean | true / false | true |
| Action 3 | boolean | true / false | true |
| 'More' Btn | boolean | true / false | true |
| Action 4 | boolean | true / false | true |
| Action 5 | boolean | true / false | false |
| Action 6  | boolean | true / false | false |

## Variants

- **Variant**: Primary (default) · Secondary · Tertiary
- **Size**: Medium · Small · Large · XSmall (default)

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| border | Variant=Secondary | `Border Color/Action/Secondary Button (Default)` |

#### Action 1

| Property | Primary | Secondary | Tertiary |
|---|---|---|---|
| fill | `Background/Action/Action` | `Background/Action/Action Secondary` | — |
| border | — | `Border Color/Action/Secondary Button (Default)` | — |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| border | Variant=Tertiary, Size=Medium · Small · XSmall | `Background/Divider/Divider Secondary` |
| border | Variant=Tertiary, Size=Large | `Border Color/Divider/Divider Secondary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Variant=Primary | `Text Color/Body/White` |
| fill | Variant=Secondary · Tertiary | `Text Color/Body/Primary` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Variant=Primary | `Text Color/Action/On Action` |
| fill | Variant=Secondary · Tertiary | `Text Color/Action/On Secondary` |

#### Action 2

| Property | Primary | Secondary | Tertiary |
|---|---|---|---|
| fill | `Background/Action/Action` | `Background/Action/Action Secondary` | — |
| border | — | `Border Color/Action/Secondary Button (Default)` | — |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| border | Variant=Tertiary, Size=Medium · Small · XSmall | `Background/Divider/Divider Secondary` |
| border | Variant=Tertiary, Size=Large | `Border Color/Divider/Divider Secondary` |

#### Action 3

| Property | Primary | Secondary | Tertiary |
|---|---|---|---|
| fill | `Background/Action/Action` | `Background/Action/Action Secondary` | — |
| border | — | `Border Color/Action/Secondary Button (Default)` | — |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| border | Variant=Tertiary, Size=Medium · Small · XSmall | `Background/Divider/Divider Secondary` |
| border | Variant=Tertiary, Size=Large | `Border Color/Divider/Divider Secondary` |

#### Action 4

| Property | Primary | Secondary | Tertiary |
|---|---|---|---|
| fill | `Background/Action/Action` | `Background/Action/Action Secondary` | — |
| border | — | `Border Color/Action/Secondary Button (Default)` | — |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| border | Variant=Tertiary, Size=Medium · Small · XSmall | `Background/Divider/Divider Secondary` |
| border | Variant=Tertiary, Size=Large | `Border Color/Divider/Divider Secondary` |

#### .buttonGroupItem

| Property | Primary | Secondary | Tertiary |
|---|---|---|---|
| fill | `Background/Action/Action` | `Background/Action/Action Secondary` | — |
| border | — | `Border Color/Action/Secondary Button (Default)` | — |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| border | Variant=Tertiary, Size=Medium · Small · XSmall | `Background/Divider/Divider Secondary` |
| border | Variant=Tertiary, Size=Large | `Border Color/Divider/Divider Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Size=Medium | `Action/M` |
| Label | typography | Size=Small | `Action/S` |
| Label | typography | Size=Large | `Action/L` |
| Label | typography | Size=XSmall | `Action/XS` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.buttonGroupItem](./buttongroupitem.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (1px)
- **Action 1**: hardcoded itemSpacing (8px)
- **Action 1**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Action 2**: hardcoded itemSpacing (8px)
- **Action 2**: hardcoded padding
- **Action 3**: hardcoded itemSpacing (8px)
- **Action 3**: hardcoded padding
- **Action 4**: hardcoded itemSpacing (8px)
- **Action 4**: hardcoded padding
- **Action 5**: hardcoded itemSpacing (8px)
- **Action 5**: hardcoded padding
- **Action 6**: hardcoded itemSpacing (8px)
- **Action 6**: hardcoded padding
- **.buttonGroupItem**: hardcoded itemSpacing (8px)
- **.buttonGroupItem**: hardcoded padding
