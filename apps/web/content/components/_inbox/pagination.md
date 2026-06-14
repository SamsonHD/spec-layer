---
spec_version: "0.1"
component:
  name: Pagination
  figma_key: 226dc95239260a8d7e9b34a57d82ff73e7686c5b
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26050:36593
content_hash: 1ccc139e22645732749b332b380ed47dec817c255319afbf34bfdd6b1940309e
extracted_at: 2026-06-14T10:04:05.510Z
---

## Definition

_To be written._

## Anatomy

1. Left Side
2. Pages

## Configuration

_None._

## Variants

- **Type**: Buttons (default) · Page numbers

## States

- Default

## Tokens used

### Color

#### 1-10

| Property | Condition | Token |
|---|---|---|
| fill | Type=Buttons | `Text Color/Body/Primary` |

#### of

| Property | Condition | Token |
|---|---|---|
| fill | Type=Buttons | `Text Color/Body/Primary` |

#### 8,618

| Property | Condition | Token |
|---|---|---|
| fill | Type=Buttons | `Text Color/Body/Primary` |

#### Items per page:

| Property | Condition | Token |
|---|---|---|
| fill | Type=Buttons | `Text Color/Body/Primary` |

#### Button Icon

| Property | Condition | Token |
|---|---|---|
| border | Type=Buttons | `Border Color/Action/Secondary Button (Default)` |
| fill | Type=Page numbers | `Background/Action/Action Tertiary` |

#### Current Page Label

| Property | Condition | Token |
|---|---|---|
| fill | Type=Page numbers | `Text Color/Body/Primary` |

#### Show Label

| Property | Condition | Token |
|---|---|---|
| fill | Type=Page numbers | `Text Color/Body/Primary` |

#### 1

| Property | Condition | Token |
|---|---|---|
| fill | Type=Page numbers | `Text Color/Action/Link` |
| fill | Type=Page numbers | `Text Color/Body/Primary` |

#### ...

| Property | Condition | Token |
|---|---|---|
| fill | Type=Page numbers | `Text Color/Action/Link` |

#### Input

| Property | Condition | Token |
|---|---|---|
| fill | Type=Page numbers | `Background/Surface/Primary` |
| border | Type=Page numbers | `Border Color/Input Field/Input Field` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| Container | border | `Border Color/Divider/Divider Secondary` |
| Select | fill | `Background/Surface/Primary` |
| Select | border | `Border Color/Input Field/Input Field` |
| Placeholder | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| 1-10 | typography | Type=Buttons | `Body/M` |
| of | typography | Type=Buttons | `Body/M` |
| 8,618 | typography | Type=Buttons | `Body/M` |
| Items per page: | typography | Type=Buttons | `Body/M` |
| Placeholder | typography | — | `Value/S` |
| Current Page Label | typography | Type=Page numbers | `Label/S` |
| Show Label | typography | Type=Page numbers | `Label/S` |
| 1 | typography | Type=Page numbers | `Body/M` |
| ... | typography | Type=Page numbers | `Body/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | — | `rounded-8` |

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
- **Left Side**: hardcoded itemSpacing (24px)
- **Counter**: hardcoded itemSpacing (4px)
- **Items**: hardcoded itemSpacing (8px)
- **Select (Dropdown)**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Select**: hardcoded itemSpacing (8px)
- **Select**: hardcoded cornerRadius (8px)
- **Select**: hardcoded padding
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Pages**: hardcoded itemSpacing (8px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
