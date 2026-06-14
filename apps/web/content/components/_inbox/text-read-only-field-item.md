---
spec_version: "0.1"
component:
  name: Text Read Only Field / Item
  figma_key: c551a3f7e8c95ab01c375d2e8a48a2a41af5b83e
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25541:4100
content_hash: cb2828cfd2ffc207ae66c4f1992afb553768c0ef42e82cc64a871836522f0147
extracted_at: 2026-06-14T10:04:11.648Z
---

## Definition

_To be written._

## Anatomy

1. Title

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show Subline | boolean | true / false | false |
| Show Effective Date | boolean | true / false | false |
| Show New Value | boolean | true / false | false |
| New Value | text | — | Value |
| Show history | boolean | true / false | false |
| Show Alert | boolean | true / false | false |
| Show Chip | boolean | true / false | false |
| Show Avatar | boolean | true / false | false |

## Variants

- **Size**: Large (default) · Small
- **Modifiers**: Loading · Empty · Disabled · Hover

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| border | — | `Border Color/Divider/Divider Secondary` |
| fill | Hover=True | `Background/Surface/Primary` |

#### Title

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=False | `Text Color/Body/Secondary` |
| fill | Disabled=True | `Text Color/Semantic/Disabled` |

#### Data

| Property | Condition | Token |
|---|---|---|
| fill | Loading=False, Empty=False, Disabled=False | `Text Color/Body/Primary` |
| fill | Empty=True | `Text Color/Semantic/Disabled` |
| fill | Disabled=True | `Text Color/Semantic/Disabled` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Loading=False, Empty=False, Disabled=False | `Text Color/Action/Default` |
| fill | Loading=True | `Text Color/Body/Primary` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Hover=True | `Text Color/Action/Default` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | Size=Large | `Label/S - Strong` |
| Title | typography | Size=Small | `Caption/S` |
| Data | typography | Loading=False, Size=Large | `Value/M - Strong` |
| Data | typography | Loading=False, Size=Small | `Value/S - Strong` |
| Label | typography | Hover=True | `Action/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | Hover=True | `rounded-8` |
| Button | padding-x | Hover=True | `size-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (24px)
- **Container**: hardcoded padding
- **Text**: hardcoded itemSpacing (7px)
- **Title**: hardcoded itemSpacing (8px)
- **Avatar**: hardcoded itemSpacing (4.444444179534912px)
- **Avatar**: hardcoded cornerRadius (11109.9990234375px)
- **Photo**: hardcoded itemSpacing (8.888888359069824px)
- **Photo**: hardcoded cornerRadius (11109.9990234375px)
- **Status Badge**: hardcoded cornerRadius (100px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **ChipStatus**: hardcoded itemSpacing (8px)
- **ChipStatus**: hardcoded cornerRadius (9999px)
- **ChipStatus**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **Circle**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Xmark Large**: hardcoded color (no variable or style)
- **Row**: hardcoded itemSpacing (12px)
- **Row**: hardcoded padding
- **Button**: hardcoded itemSpacing (8px)
