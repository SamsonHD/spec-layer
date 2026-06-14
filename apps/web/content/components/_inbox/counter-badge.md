---
spec_version: "0.1"
component:
  name: Counter Badge
  figma_key: d57d2cb34867ee3dd95e3ba76ba1e2667f249cb6
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 3181:196493
content_hash: b82d71919575efb82d6fc7090c5ba9bf4308b82ef86f1a1cde329a2d95d95a0d
extracted_at: 2026-06-14T10:03:26.253Z
---

## Definition

_To be written._

## Anatomy

1. Count Label

## Configuration

_None._

## Variants

- **Type**: dot (default) · single digit · multi-digits
- **Color**: Danger (default) · Informative · Warning · Teal · Subtle · Gray · White
- **Size**: M (default) · S

## States

- Default

## Tokens used

### Color

#### Container

| Property | Danger | Informative | Warning | Teal | Subtle | Gray | White |
|---|---|---|---|---|---|---|---|
| fill | — | `Background/Surface/Blue` | — | — | — | `Background/Surface/Secondary` | `Background/Surface/Primary` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Type=single digit · multi-digits, Color=Danger | `Background/Action/Danger` |
| fill | Type=dot, Color=Warning | `Background/Semantic/Status → Warning` |
| fill | Type=dot, Color=Teal | `Background/Action/Action Inverse` |
| fill | Type=single digit · multi-digits, Color=Warning | `Text Color/Semantic/Warning` |
| fill | Type=single digit · multi-digits, Color=Teal | `Background/Action/Action Secondary (Pressed)` |

#### Count Label

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Type=single digit · multi-digits, Color=Danger · Warning | `Text Color/Action/On Danger` |
| fill | Type=single digit · multi-digits, Color=Informative | `Text Color/Action/Link Secondary` |
| fill | Type=single digit · multi-digits, Color=Teal | `Text Color/Action/Default` |
| fill | Type=single digit · multi-digits, Color=Subtle · Gray | `Text Color/Semantic/Disabled` |
| fill | Type=single digit · multi-digits, Color=White | `Text Color/Body/Primary` |
| fill | Type=multi-digits, Color=Teal · Subtle · Gray · White | `Text Color/Action/Link Secondary` |

#### dot

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| fill | Type=dot, Color=Danger | `Background/Action/Danger` |
| fill | Type=dot, Color=Informative | `Accent/accent-2` |
| fill | Type=dot, Color=Warning | `Text Color/Semantic/Warning` |
| fill | Type=dot, Color=Teal | `Text Color/Action/Default` |
| fill | Type=dot, Color=Subtle · Gray | `Text Color/Semantic/Disabled` |
| fill | Type=dot, Color=White | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Count Label | typography | Type=single digit · multi-digits, Size=M | `Caption/S - Strong` |
| Count Label | typography | Type=single digit · multi-digits, Size=S | `Caption/XS - Strong` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded cornerRadius (9999px)
- **Container**: hardcoded padding
