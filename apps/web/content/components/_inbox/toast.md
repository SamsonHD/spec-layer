---
spec_version: "0.1"
component:
  name: Toast
  figma_key: 8fef1f4f0ead681ea615567ae8b2279e48ed85ce
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 14081:123003
content_hash: ac6fa3d422e5c5277ef9a60e9c880049039176de83a645908abe086651e73d3c
extracted_at: 2026-06-14T10:03:14.958Z
---

## Definition

_To be written._

## Anatomy

1. Contents
2. Close Button

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Close Button | boolean | true / false | true |
| Banner Title | boolean | true / false | true |
| Title | text | — | Your changes were applied |
| Show Actions | boolean | true / false | true |
| Secondary Action | boolean | true / false | true |
| Content | text | — | This is the content of banner. |
| Primary Action | boolean | true / false | true |

## Variants

- **Semantic**: Warning · Success (default) · Error · Info · Notification
- **Modifiers**: Description

## States

- Default

## Tokens used

### Color

#### Container

| Property | Warning | Success | Error | Info | Notification |
|---|---|---|---|---|---|
| fill | `Background/Semantic/Status → Warning` | `Background/Semantic/Status → Success` | `Background/Semantic/Status → Error` | `Background/Semantic/Status → Informational` | `Background/Surface/Primary` |
| border | `Border Color/Divider/Divider Secondary` | `Border Color/Divider/Divider Secondary` | `Border Color/Divider/Divider Secondary` | `Border Color/Divider/Divider Secondary` | `Border Color/Divider/Divider Secondary` |

#### icon

| Property | Warning | Success | Error | Info | Notification |
|---|---|---|---|---|---|
| fill | `Text Color/Semantic/Warning` | `Text Color/Semantic/Success` | `Text Color/Semantic/Danger Link` | `Text Color/Semantic/Info` | `Text Color/Semantic/Info` |

#### Your changes were applied

| Property | Condition | Token |
|---|---|---|
| fill | Semantic=Warning · Success · Error · Info | `Text Color/Body/Primary` |

#### Text

| Property | Condition | Token |
|---|---|---|
| fill | Description=True | `Text Color/Body/Primary` |

#### Button

| Property | Condition | Token |
|---|---|---|
| border | Description=True | `Border Color/Action/Secondary Button (Default)` |
| fill | Description=True | `Background/Action/Action` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Description=True | `Text Color/Action/On Action` |
| fill | Description=True | `Text Color/Action/On Secondary` |
| fill | Description=False | `Text Color/Action/Default` |

#### 1 new notification

| Property | Condition | Token |
|---|---|---|
| fill | Semantic=Notification | `Text Color/Body/Primary` |

#### Button (Link)

| Property | Condition | Token |
|---|---|---|
| fill | Description=False | `Background/Transparent` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Your changes were applied | typography | Semantic=Warning · Success · Error · Info | `Subtitle/S` |
| Text | typography | Description=True | `Body/M` |
| Label | typography | — | `Action/S` |
| 1 new notification | typography | Semantic=Notification | `Subtitle/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Container | padding-x | — | `size-16` |
| Container | effects | — | `light/Shadow/Toast` |
| Icon | border-radius | Description=True | `rounded-8` |
| Button | border-radius | Description=True | `rounded-8` |
| Button | padding-x | Description=True | `size-16` |

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
- **Contents**: hardcoded itemSpacing (16px)
- **Icon**: hardcoded itemSpacing (8px)
- **Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Title**: hardcoded itemSpacing (16px)
- **Text**: hardcoded padding
- **CTA**: hardcoded itemSpacing (12px)
- **CTA**: hardcoded padding
- **Button**: hardcoded itemSpacing (8px)
