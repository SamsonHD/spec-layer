---
spec_version: "0.1"
component:
  name: Progress Tracker
  figma_key: 453070737fdc02716a73c1379b3d7de8c6a800f6
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 4156:273162
content_hash: ac728e45589b9353f60affac8ec75845aa28068563ac58b60be8d61474e0f47c
extracted_at: 2026-06-14T10:04:05.528Z
---

## Definition

_To be written._

## Anatomy

1. Progress Tracker Item (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Label 3 | boolean | true / false | true |
| Label 4 | boolean | true / false | true |
| Label 5 | boolean | true / false | true |
| Label 6 | boolean | true / false | true |
| Label 7 | boolean | true / false | true |
| Label 8 | boolean | true / false | true |
| Show Step name | boolean | true / false | true |
| Show Step name 2 | boolean | true / false | true |

## Variants

- **Device**: Desktop (default) · Tablet · Mobile
- **Layout**: Horizontal · Vertical (default)

## States

- Default

## Tokens used

### Color

#### step indicator

| Property | Condition | Token |
|---|---|---|
| fill | Device=Desktop · Tablet | `Background/Transparent` |

#### .Progress Tracker Indicator

| Property | Desktop | Tablet | Mobile |
|---|---|---|---|
| fill | `Background/Action/Action Tertiary` | `Background/Action/Action Tertiary` | `Background/Action/Action` · `Background/Action/Action Quaternary` |
| border | `Border Color/Action/Action` | `Border Color/Action/Action` | `Border Color/Action/Action` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Device=Desktop · Tablet | `Text Color/Body/Primary` |
| fill | Device=Desktop · Tablet | `Text Color/Body/Secondary` |

#### step

| Property | Condition | Token |
|---|---|---|
| fill | Device=Desktop · Tablet | `Text Color/Body/Primary` |
| fill | Device=Desktop · Tablet | `Text Color/Body/White` |

#### Setup password

| Property | Condition | Token |
|---|---|---|
| fill | Device=Tablet · Mobile, Layout=Horizontal | `Text Color/Body/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| icon | fill | `Text Color/Body/Primary` |
| line | fill | `Background/Action/Action` |
| line | fill | `Background/Action/Action Quaternary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Layout=Vertical | `Label/M` |
| Label | typography | Device=Desktop, Layout=Horizontal | `Label/M` |
| Label | typography | Device=Desktop, Layout=Horizontal | `[ARCHIVE]/*Mobile/Field Value (Emphasized)` |
| step | typography | Device=Desktop · Tablet | `Label/M` |
| Setup password | typography | Device=Tablet · Mobile, Layout=Horizontal | `[ARCHIVE]/*Mobile/Heading6` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| .Progress Tracker Indicator | effects | — | `light/Ring/Input - Active` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Progress Tracker Item](./progress-tracker-item.md)

## Extraction gaps

- **.progressTrackerItem Wrapper**: hardcoded itemSpacing (16px)
- **step indicator**: hardcoded cornerRadius (8px)
- **step indicator**: hardcoded padding
- **.Progress Tracker Indicator**: hardcoded cornerRadius (9999px)
- **.Progress Tracker Indicator**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **label**: hardcoded padding
- **Label**: hardcoded color (no variable or style)
