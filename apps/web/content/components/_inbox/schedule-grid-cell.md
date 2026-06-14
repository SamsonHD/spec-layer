---
spec_version: "0.1"
component:
  name: Schedule Grid Cell
  figma_key: efa2eda23d47142197d488827566d047e4bda4f1
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26531:337279
content_hash: 3b6096c14779d1b1b00652fa93bcaf61b574ce6d83b0bb3c963170d24014c50f
extracted_at: 2026-06-14T10:04:36.292Z
---

## Definition

_To be written._

## Anatomy

1. Text
2. Shift Container
3. Add Shift (component)
4. Cursor

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Shift Container | undefined | — | — |
| Show Day Date | boolean | true / false | true |
| More shifts | boolean | true / false | false |
| Holiday | boolean | true / false | false |
| Show totals | boolean | true / false | false |

## Variants

- **Density**: Default (default) · Compact
- **Modifiers**: Today

## States

- Default
- Drop Target
- Hover
- Disabled
- Today

## Tokens used

### Color

#### Container

| Property | State | Token |
|---|---|---|
| fill | Default | `Background/Surface/Primary` |
| fill | Drop Target | `Background/Action/Action Secondary (Hover)` |
| fill | Hover | `Background/Surface/Primary` |
| fill | Disabled | `Background/Surface/Tertiary` |
| border | Default | `Border Color/Divider/Table Divider` |
| border | Drop Target | `Border Color/Action/Action` |
| border | Hover | `Border Color/Divider/Table Divider` |
| border | Disabled | `Border Color/Divider/Table Divider` |
| border | Today | `Border Color/Divider/Table Divider` |

#### 15

| Property | Condition | Token |
|---|---|---|
| fill | Density=Default, State=Default · Hover · Disabled · Today, Today=False | `Text Color/Body/Secondary` |
| fill | Density=Default, Today=True | `Text Color/Action/Default` |

#### Add Shift

| Property | Condition | Token |
|---|---|---|
| fill | State=Hover | `Background/Surface/Quaternary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | State=Drop Target · Hover | `Text Color/Action/Default` |

#### Add

| Property | Condition | Token |
|---|---|---|
| fill | State=Hover | `Text Color/Action/Default` |

#### Drop shift here

| Property | Condition | Token |
|---|---|---|
| fill | State=Drop Target | `Text Color/Action/Default` |

#### Ellipse 1

| Property | Condition | Token |
|---|---|---|
| fill | Density=Default, Today=True | `Background/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| 15 | typography | Density=Default, State=Default · Hover · Disabled · Today, Today=False | `Caption/S` |
| 15 | typography | Density=Default, Today=True | `Caption/S - Strong` |
| Add | typography | State=Hover | `Action/XS` |
| Drop shift here | typography | State=Drop Target | `Caption/XS` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Add Shift | border-radius | State=Hover | `rounded-4` |
| Add Shift | effects | State=Hover | `light/Shadow/Card` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Add Shift](./add-shift.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (4px)
- **Container**: hardcoded padding
- **Text**: hardcoded itemSpacing (4px)
- **Text**: hardcoded cornerRadius (11px)
- **Chip**: hardcoded itemSpacing (8px)
- **Chip**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Frame 1**: hardcoded itemSpacing (8px)
- **Frame 1**: hardcoded padding
- **Shift Container**: hardcoded itemSpacing (8px)
- **Add Shift**: hardcoded itemSpacing (8px)
- **Add Shift**: hardcoded padding
- **Text**: hardcoded padding
- **Demo/Cursor**: hardcoded color (no variable or style)
- **Shape**: hardcoded color (no variable or style)
