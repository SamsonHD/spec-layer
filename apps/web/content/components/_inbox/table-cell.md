---
spec_version: "0.1"
component:
  name: Table / Cell
  figma_key: 2f3ca056909aa7d2401dbd6912cc73eccdb111fb
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 2181:163321
content_hash: e6ecaae21cea19150c5070bf5cb678cc1454ad24dc7e4d60f594faaca09304e3
extracted_at: 2026-06-14T10:07:47.219Z
---

## Definition

_To be written._

## Anatomy

1. Empty-Placeholder

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Slot Content | instanceSwap | — | 5507:362804 |
| Icon 1 | boolean | true / false | true |
| Icon 2 | boolean | true / false | true |
| Icon 3 | boolean | true / false | true |
| Icon 4 | boolean | true / false | false |
| Icon 5 | boolean | true / false | false |
| Icon 6 | boolean | true / false | false |
| Link 1 | boolean | true / false | true |
| Link 2 | boolean | true / false | true |
| Link 3 | boolean | true / false | true |
| Link 4 | boolean | true / false | false |
| Link 5 | boolean | true / false | false |
| Link 6 | boolean | true / false | false |

## Variants

- **Cell Type**: Badge · Button · Checkbox · Dropdown Select (New) · [Deprecated] Dropdown · Empty · Icon + Text · Icon Button · Icon Buttons Multiple · Icon · Image · Input (New) · [Deprecated] Input · Link · Links Multiple · Switch · Text + Icon · Text (default) · Slot

## States

- Default

## Tokens used

### Color

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Badge · Icon + Text · Text + Icon · Text | `Text Color/Body/Primary` |
| fill | Cell Type=Button | `Text Color/Action/On Secondary` |
| fill | Cell Type=Link · Links Multiple | `Text Color/Action/Default` |

#### Button

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Button | `Background/Action/Action Secondary` |
| border | Cell Type=Button | `Border Color/Action/Secondary Button (Default)` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Badge · Button · Icon Button · Icon Buttons Multiple | `Text Color/Body/Primary` |
| fill | Cell Type=Dropdown Select (New) | `Text Color/Body/Secondary` |

#### Input

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Input (New) · [Deprecated] Input | `Background/Surface/Primary` |
| border | Cell Type=Input (New) · [Deprecated] Input | `Border Color/Input Field/Input Field` |

#### Placeholder

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Dropdown Select (New) · [Deprecated] Dropdown · Input (New) · [Deprecated] Input | `Text Color/Input/Input Placeholder` |

#### Select

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Dropdown Select (New) · [Deprecated] Dropdown | `Background/Surface/Primary` |
| border | Cell Type=Dropdown Select (New) · [Deprecated] Dropdown | `Border Color/Input Field/Input Field` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Checkbox | `Text Color/Body/Inverted → Primary` |
| fill | Cell Type=[Deprecated] Dropdown | `Text Color/Action/Link` |

#### Select (Dropdown) for Table

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Dropdown Select (New) | `Background/Surface/Primary` |

#### Button (Link)

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Link | `Background/Transparent` |

#### Button 01

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Links Multiple | `Background/Transparent` |

#### Button 02

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Links Multiple | `Background/Transparent` |

#### Button 03

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Links Multiple | `Background/Transparent` |

#### Button Icon

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Icon Button | `Background/Action/Action Tertiary` |

#### Button 1

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Icon Buttons Multiple | `Background/Action/Action Tertiary` |

#### Button 2

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Icon Buttons Multiple | `Background/Action/Action Tertiary` |

#### Button 3

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Icon Buttons Multiple | `Background/Action/Action Tertiary` |

#### Track

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Switch | `Background/Toggle/Toggle Switch` |

#### Switch

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Switch | `Background/Surface/Primary` |

#### ChipAction

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Badge | `Background/Action/Action Inverse` |

#### Check Wrapper

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Checkbox | `Background/Surface/Primary` |
| border | Cell Type=Checkbox | `Border Color/Input Field/Input Field` |

#### Ellipse 1

| Property | Condition | Token |
|---|---|---|
| border | Cell Type=Icon + Text · Icon · Text + Icon | `Text Color/Body/Primary` |

#### Ellipse 2

| Property | Condition | Token |
|---|---|---|
| fill | Cell Type=Icon + Text · Icon · Text + Icon | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Cell Type=Badge | `Chip/S` |
| Label | typography | Cell Type=Button · Link · Links Multiple | `Action/S` |
| Label | typography | Cell Type=Icon + Text · Text + Icon · Text | `[ARCHIVE]/*Mobile/Field Label Small` |
| Placeholder | typography | Cell Type=Dropdown Select (New) · Input (New) | `Value/S` |
| Placeholder | typography | Cell Type=[Deprecated] Dropdown | `[ARCHIVE]/*Mobile/Input Field Value` |
| Placeholder | typography | Cell Type=[Deprecated] Input | `[ARCHIVE]/*Mobile/Input Field Value (Small)` |
| Replace Me | font-family | Cell Type=Slot | `font-family/font-family` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | Cell Type=Button | `rounded-8` |
| Button | padding-x | Cell Type=Button | `size-16` |
| Button Icon | border-radius | Cell Type=Icon Button | `rounded-8` |
| Button 1 | border-radius | Cell Type=Icon Buttons Multiple | `rounded-8` |
| Button 2 | border-radius | Cell Type=Icon Buttons Multiple | `rounded-8` |
| Button 3 | border-radius | Cell Type=Icon Buttons Multiple | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Empty-Placeholder**: hardcoded color (no variable or style)
