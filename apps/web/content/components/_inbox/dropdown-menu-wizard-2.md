---
spec_version: "0.1"
component:
  name: Dropdown Menu Wizard
  figma_key: fed916b1c1ba48dbd5138ced7b93a6b2ea7a8256
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25697:10088
content_hash: 02b09fd552354044894b1898e2680153cc33efbd527c70e62df1023f8fdcda60
extracted_at: 2026-06-14T10:03:12.488Z
---

## Definition

_To be written._

## Anatomy

1. Label
2. Completion

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Text | text | — | Label |
| Complete | boolean | true / false | true |
| Show Icon Left | boolean | true / false | false |

## Variants

- **Modifiers**: Active · Disabled · Hover · Focused

## States

- Default

## Tokens used

### Color

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Disabled=False | `Text Color/Body/Primary` |
| fill | Disabled=True | `Text Color/Semantic/Disabled` |

#### iconWrapper

| Property | Condition | Token |
|---|---|---|
| fill | Active=False, Hover=False, Focused=False | `Background/Surface/Primary` |
| fill | Focused=True | `Background/Surface/Primary` |
| fill | Active=True, Hover=False, Focused=False | `Background/Surface/Blue` |

#### icon

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Success` |

**When Active = True**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Disabled` |

**When Disabled = True**

| Property | Token |
|---|---|
| fill | `Text Color/Site Footer/Site Footer Link` |

**When Hover = True**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Success` · `Text Color/Site Footer/Site Footer Link` |

**When Focused = True**

| Property | Token |
|---|---|
| fill | `Text Color/Semantic/Success` · `Text Color/Site Footer/Site Footer Link` |

#### optionWrapper

| Property | Condition | Token |
|---|---|---|
| fill | Hover=False, Focused=False | `Background/Sidebar/Secondary Sidebar Item Selected` |
| fill | Hover=True | `Background/Action/Action Tertiary (Hover)` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | Focused=True | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Active=False | `Value/M` |
| Label | typography | Active=True | `Value/M - Strong` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded color (no variable or style)
- **Container**: hardcoded padding
- **optionWrapper**: hardcoded itemSpacing (8px)
- **optionWrapper**: hardcoded cornerRadius (4px)
- **optionWrapper**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
