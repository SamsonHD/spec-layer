---
spec_version: "0.1"
component:
  name: Selection Chip Group
  figma_key: 965aecdf996219193c7ca184837903eebe73baac
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 17622:37617
content_hash: 008f89070bb1ee0913a39d953c3b9ab4d892bfe9b93b38191eb446660fbb3de5
extracted_at: 2026-06-14T10:03:26.179Z
---

## Definition

_To be written._

## Anatomy

1. Header Wrapper
2. group-wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Label | boolean | true / false | true |
| Show Hint | boolean | true / false | false |
| Label | text | — | Label |
| Hint | text | — | Help text goes here. |
| Optional | boolean | true / false | false |
| Required | boolean | true / false | false |
| Error Msg | text | — | Error message here. |

## Variants

- **Style**: Swatch (default) · Text
- **Size**: Extra Small (default) · Small · Medium · Large
- **Modifiers**: DIsabled · Error

## States

- Default

## Tokens used

### Color

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | DIsabled=false | `Text Color/Body/Primary` |
| fill | DIsabled=true | `Text Color/Body/Secondary` |
| fill | DIsabled=true | `Text Color/Semantic/Disabled` |

#### Selection Chip

| Property | Token |
|---|---|
| fill | `Background/Tile/Tile` |
| border | `Border Color/Tile/Tile` |

**When DIsabled = true**

| Property | Token |
|---|---|
| fill | `Background/Tile/Tile` |
| border | `Border Color/Input Field/Input Field Disabled` |

**When Error = true**

| Property | Token |
|---|---|
| fill | `Background/Tile/Tile` |
| border | `Border Color/Input Field/Input Field Danger` |

#### Swatch

| Property | Condition | Token |
|---|---|---|
| fill | Style=Swatch | `Background/Semantic/Status → Informational` |
| border | Style=Swatch | `Background/Surface/Primary` |

#### Error Message

| Property | Condition | Token |
|---|---|---|
| fill | Error=true | `Text Color/Semantic/Error` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | — | `[ARCHIVE]/*Mobile/Field Label` |
| Label | typography | Size=Extra Small | `Chip/XS` |
| Label | typography | Size=Small | `Chip/S` |
| Label | typography | Size=Medium | `Chip/M` |
| Label | typography | Style=Swatch, Size=Large | `Chip/L` |
| Label | typography | Style=Text, Size=Large | `[ARCHIVE]/*Mobile/Field Label Large` |
| Error Message | typography | Error=true | `[ARCHIVE]/Footnote1/Short` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Header Wrapper**: hardcoded padding
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **group-wrapper**: hardcoded itemSpacing (12px)
- **Selection Chip**: hardcoded itemSpacing (8px)
- **Selection Chip**: hardcoded cornerRadius (9999px)
- **Selection Chip**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **Swatch**: hardcoded cornerRadius (9999px)
