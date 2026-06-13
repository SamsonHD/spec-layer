---
spec_version: "0.1"
status: draft
component:
  name: Filter Input
  figma_key: 92bbfc3096fd67596b3ab481a225c429fc02f38a
  figma_file: unknown
  figma_node: 26146:40726
content_hash: d675a09003318ab27a43f847e917c48a766d049a39ac8d561272099e02c32b46
extracted_at: 2026-06-13T21:29:33.540Z
---

## Definition

> ⚠️ Draft — AI-suggested, not yet approved.

_To be written._

## Anatomy

1. Select
2. iconWrapper (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show indicator | boolean | true / false | true |

## Variants

- **Modifiers**: Default · Hover · Active · Applied · Disabled

## States

- Default

## Tokens used

### Color

#### Field Wrapper

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |
| border | `Border Color/Input Field/Input Field` |

**When Hover = True**

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |
| border | `Border Color/Input Field/Input Field (Hover)` |

**When Active = True**

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |
| border | `Border Color/Input Field/Input Field (Focus)` |

**When Disabled = True**

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |
| border | `Border Color/Input Field/Input Field Disabled` |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| border | Hover=True, Disabled=True | `Border Color/Input Field/Input Field Disabled` |
| border | Active=True, Disabled=True | `Border Color/Input Field/Input Field Disabled` |

#### Placeholder

| Property | Token |
|---|---|
| fill | `Text Color/Input/Input Placeholder` |

**When Default = False**

| Property | Token |
|---|---|
| fill | `Text Color/Body/Primary` |

**When Hover = True**

| Property | Token |
|---|---|
| fill | `Text Color/Input/Input Placeholder` |

**When Disabled = True**

| Property | Token |
|---|---|
| fill | `Text Color/Input/Input Placeholder` |

#### Counter Badge

| Property | Condition | Token |
|---|---|---|
| fill | Default=False, Hover=False, Disabled=False | `Background/Action/Action Secondary (Pressed)` |

#### Count Label

| Property | Condition | Token |
|---|---|---|
| fill | Default=False, Hover=False, Disabled=False | `Text Color/Action/Default` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| icon | fill | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Placeholder | typography | — | `New/Field/Value Small` |
| Count Label | typography | Default=False, Hover=False, Disabled=False | `Caption/XS - Strong` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Field Wrapper | effects | Active=True, Disabled=False | `light/Ring/Input - Active` |

## Code

> ⚠️ Draft — AI-suggested, not yet approved.

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

> ⚠️ Draft — AI-suggested, not yet approved.

_To be written._

## Do's & Don'ts

> ⚠️ Draft — AI-suggested, not yet approved.

_To be written._

## Related atoms

- [iconWrapper](./iconwrapper.md)

## Extraction gaps

- **Container**: hardcoded color (no variable or style)
- **Field Wrapper**: hardcoded itemSpacing (8px)
- **Field Wrapper**: hardcoded cornerRadius (8px)
- **Field Wrapper**: hardcoded padding
- **Select**: hardcoded itemSpacing (8px)
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
