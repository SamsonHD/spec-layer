---
spec_version: "0.1"
component:
  name: Progress Tracker Item
  figma_key: 1eac83a636782e2e7938e64983a7717d7f035815
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 1742:127154
content_hash: 09c816a2b019ab2647c308ed2b24283b5cf99b5acb5b0cf42aae50cdf7a7b5c8
extracted_at: 2026-06-14T10:04:05.543Z
---

## Definition

_To be written._

## Anatomy

1. .progressTrackerItem Wrapper (component)

## Configuration

_None._

## Variants

- **Devices**: Desktop (default) · Mobile
- **Type**: Default (default) · In Progress · Completed · Completed Selected
- **Align**: Vertical Centers (default) · Horizontal Centers
- **Place**: Start (default) · Middle · End

## States

- Default
- Hover
- Press
- Focus

## Tokens used

### Color

#### step indicator

| Property | Condition | Token |
|---|---|---|
| fill | Devices=Desktop | `Background/Transparent` |

#### .Progress Tracker Indicator

| Property | State | Default | In Progress | Completed | Completed Selected |
|---|---|---|---|---|---|
| fill | Default | `Background/Action/Action Quaternary` | `Background/Action/Action` | `Background/Action/Action Tertiary` | `Background/Action/Action` |
| fill | Hover | `Background/Action/Action Quaternary (Hover)` | `Background/Action/Action (Hover)` | — | `Background/Action/Action (Hover)` |
| fill | Press | `Background/Action/Action Quaternary (Pressed)` | `Background/Action/Action (Pressed)` | — | `Background/Action/Action (Pressed)` |
| fill | Focus | `Background/Action/Action Quaternary` | `Background/Action/Action` | `Background/Action/Action Tertiary` | `Background/Action/Action` |
| border | Default | — | — | `Border Color/Action/Action` | — |
| border | Hover | — | — | `Border Color/Action/Action (Hover)` | — |
| border | Press | — | — | `Border Color/Action/Action (Pressed)` | — |
| border | Focus | — | — | `Border Color/Action/Action` | — |

#### step

| Property | Condition | Token |
|---|---|---|
| fill | Devices=Desktop, Type=Default | `Text Color/Body/Primary` |
| fill | Devices=Desktop, Type=In Progress | `Text Color/Body/White` |

#### line

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Type=Default · In Progress, Place=Start · Middle | `Background/Action/Action Quaternary` |
| fill | Type=Default, Place=End | `Background/Action/Action Quaternary` |
| fill | Type=In Progress · Completed · Completed Selected, Place=Middle · End | `Background/Action/Action` |
| fill | Type=Completed · Completed Selected, Place=Start | `Background/Action/Action` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Devices=Desktop, Type=Default | `Text Color/Body/Secondary` |
| fill | Devices=Desktop, Type=In Progress · Completed · Completed Selected | `Text Color/Body/Primary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Type=Completed | `Text Color/Body/Primary` |
| fill | Type=Completed Selected | `Text Color/Body/White` |

#### Focus Rect

| Property | Condition | Token |
|---|---|---|
| border | States=Focus | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| step | typography | Devices=Desktop, Type=Default · In Progress | `Label/M` |
| Label | typography | Devices=Desktop | `Label/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| .Progress Tracker Indicator | effects | Type=In Progress · Completed Selected | `light/Ring/Input - Active` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.progressTrackerItem Wrapper](./progresstrackeritem-wrapper.md)

## Extraction gaps

- **.progressTrackerItem Wrapper**: hardcoded itemSpacing (16px)
- **step indicator**: hardcoded cornerRadius (8px)
- **step indicator**: hardcoded padding
- **.Progress Tracker Indicator**: hardcoded cornerRadius (9999px)
- **.Progress Tracker Indicator**: hardcoded padding
- **label**: hardcoded padding
