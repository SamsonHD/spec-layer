---
spec_version: "0.1"
component:
  name: ChipShift
  figma_key: ab17405f140bb01126ab6f12f8e6c89490bceaad
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 26791:9816
content_hash: 765bd17f6d70316d92843f4b233b6b9a770899fb962e4b0f136a77cf7a7e016c
extracted_at: 2026-06-14T10:04:36.296Z
---

## Definition

_To be written._

## Anatomy

1. Label

## Configuration

_None._

## Variants

- **Property 1**: Default (default) · Variant2 · Variant3 · Warning · Danger

## States

- Default

## Tokens used

### Color

#### Container

| Property | Default | Variant2 | Variant3 | Warning | Danger |
|---|---|---|---|---|---|
| fill | — | `Background/Semantic/Status → Warning` | `Background/Semantic/Status → Success` | `Text Color/Semantic/Warning` | `Background/Action/Danger` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Property 1=Default | `Text Color/Body/Primary` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Property 1=Warning · Danger | `Text Color/Body/White` |

#### Pending

| Property | Condition | Token |
|---|---|---|
| fill | Property 1=Variant2 | `Text Color/Semantic/Warning` |

#### Approved

| Property | Condition | Token |
|---|---|---|
| fill | Property 1=Variant3 | `Text Color/Semantic/Success` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Label | typography | Property 1=Default | `Caption/XS - Strong` |
| Pending | typography | Property 1=Variant2 | `Caption/XS - Strong` |
| Approved | typography | Property 1=Variant3 | `Caption/XS - Strong` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |

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
- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded padding
- **Contents**: hardcoded itemSpacing (4px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
