---
spec_version: "0.1"
component:
  name: WizardCardHeader
  figma_key: b9ed923bc1a480dc00b0e93eddca34ee65bda9df
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26990:17109
content_hash: c895210f5199a7e95bec58a14166df50b68954367a60295c865914740e0bc411
extracted_at: 2026-06-14T10:04:36.087Z
---

## Definition

_To be written._

## Anatomy

1. icon+title
2. Add affordances

## Configuration

_None._

## Variants

- **Type**: Default (default) · Minimal · Minimal + Description

## States

- Default

## Tokens used

### Color

#### Wizard/SectionIcon

| Property | Condition | Token |
|---|---|---|
| fill | Type=Default | `Background/Surface/Secondary` |
| border | Type=Default | `Border Color/Divider/Divider Secondary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Type=Default · Minimal | `Text Color/Body/Primary` |

#### Button Icon

| Property | Condition | Token |
|---|---|---|
| fill | Type=Default | `Background/Action/Action Tertiary` |

#### Button

| Property | Condition | Token |
|---|---|---|
| fill | Type=Minimal | `Background/Action/Action Secondary` |
| border | Type=Minimal | `Border Color/Action/Secondary Button (Default)` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Type=Minimal | `Text Color/Action/On Secondary` |

#### Once you populate the timesheet template blocks, you can configure their settings here.

| Property | Condition | Token |
|---|---|---|
| fill | Type=Minimal + Description | `Text Color/Body/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| title | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| title | typography | Type=Default | `Subtitle/L - Strong` |
| title | typography | Type=Minimal · Minimal + Description | `Subtitle/M - Strong` |
| Label | typography | Type=Minimal | `Action/S` |
| Once you populate the timesheet template blocks, you can configure their settings here. | typography | Type=Minimal + Description | `Body/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Wizard/SectionIcon | border-radius | Type=Default | `rounded-8` |
| Button Icon | border-radius | Type=Default | `rounded-8` |
| Button | border-radius | Type=Minimal | `rounded-8` |
| Button | padding-x | Type=Minimal | `size-16` |

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
- **icon+title**: hardcoded itemSpacing (16px)
- **Wizard/SectionIcon**: hardcoded itemSpacing (10px)
- **Wizard/SectionIcon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Add affordances**: hardcoded itemSpacing (12px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
