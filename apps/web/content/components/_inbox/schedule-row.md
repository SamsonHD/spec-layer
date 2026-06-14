---
spec_version: "0.1"
component:
  name: Schedule Row
  figma_key: 17abce99a0aee59971bed93c8c78c4e2315d2dd0
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26531:337272
content_hash: 3dde8d3ecdc9cf3ad2160ee909b574c44308fffaf2cffe5ffbf9772238c5b18b
extracted_at: 2026-06-14T10:04:36.288Z
---

## Definition

_To be written._

## Anatomy

1. Container
2. Text Container

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Employee Name | text | — | Alice Johnson |
| Shift Name | text | — | Morning Shift |
| Job Name | text | — | Server |

## Variants

- **Type**: Employee (default) · Open Lane · Shift · Job
- **Density**: Default (default) · Compact

## States

- Default

## Tokens used

### Color

#### Initials

| Property | Condition | Token |
|---|---|---|
| fill | Type=Employee | `Background/Surface/Tertiary` |

#### AA

| Property | Condition | Token |
|---|---|---|
| fill | Type=Employee | `Text Color/Body/Secondary` |

#### Name

| Property | Condition | Token |
|---|---|---|
| fill | Type=Employee | `Text Color/Body/Primary` |

#### 40h · $750

| Property | Condition | Token |
|---|---|---|
| fill | Type=Employee | `Text Color/Body/Secondary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Type=Open Lane | `Text Color/Body/White` |

#### Open Shifts

| Property | Condition | Token |
|---|---|---|
| fill | Type=Open Lane | `Text Color/Body/Primary` |

#### 3 open

| Property | Condition | Token |
|---|---|---|
| fill | Type=Open Lane | `Text Color/Body/Secondary` |

#### Button

| Property | Condition | Token |
|---|---|---|
| fill | Type=Open Lane, Density=Default | `Background/Action/Action Secondary` |
| border | Type=Open Lane, Density=Default | `Border Color/Action/Secondary Button (Default)` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Type=Open Lane, Density=Default | `Text Color/Action/On Secondary` |

#### Morning Shift

| Property | Condition | Token |
|---|---|---|
| fill | Type=Shift | `Text Color/Body/Primary` |

#### 08:00 – 16:00

| Property | Condition | Token |
|---|---|---|
| fill | Type=Shift | `Text Color/Body/Secondary` |

#### Server

| Property | Condition | Token |
|---|---|---|
| fill | Type=Job | `Text Color/Body/Primary` |

#### 12 employees

| Property | Condition | Token |
|---|---|---|
| fill | Type=Job, Density=Default | `Text Color/Body/Secondary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| Container | border | `Border Color/Divider/Table Divider` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| AA | typography | Type=Employee | `Caption/XS - Strong` |
| Name | typography | Type=Employee | `Caption/S - Strong` |
| 40h · $750 | typography | Type=Employee | `Caption/S` |
| Open Shifts | typography | Type=Open Lane | `Caption/S - Strong` |
| 3 open | typography | Type=Open Lane | `Caption/S` |
| Label | typography | Type=Open Lane, Density=Default | `Action/XS` |
| Morning Shift | typography | Type=Shift | `Caption/S - Strong` |
| 08:00 – 16:00 | typography | Type=Shift | `Caption/S` |
| Server | typography | Type=Job | `Caption/S - Strong` |
| 12 employees | typography | Type=Job, Density=Default | `Caption/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | Type=Open Lane, Density=Default | `rounded-8` |
| Button | padding-x | Type=Open Lane, Density=Default | `size-12` |
| Button | padding-y | Type=Open Lane, Density=Default | `size-4` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (12px)
- **Container**: hardcoded padding
- **Container**: hardcoded itemSpacing (8px)
- **Avatar**: hardcoded itemSpacing (4px)
- **Avatar**: hardcoded cornerRadius (9999px)
- **Initials**: hardcoded cornerRadius (9999px)
- **Initials**: hardcoded padding
- **Status Badge**: hardcoded cornerRadius (100px)
- **Text Container**: hardcoded itemSpacing (2px)
