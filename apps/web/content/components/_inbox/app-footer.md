---
spec_version: "0.1"
component:
  name: App Footer
  figma_key: fefde3dd31f89fbbdb4539bddee1716b3e86c2c4
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 6599:315672
content_hash: 446337af270ddcca0d92ddad40b57201785ceb258982e7197b55eb3d8e903d61
extracted_at: 2026-06-14T10:07:43.791Z
---

## Definition

_To be written._

## Anatomy

1. Heartland Copyright Statement
2. ReCAPTCHA Disclaimer

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| ReCAPTCHA | boolean | true / false | true |
| Text | text | — | ©2025 Acrisure, LLC. All rights reserved |
| Link 1 | text | — | Terms of Use |
| Link 2 | text | — | Privacy Policy |

## Variants

_None._

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| ©2025 Acrisure, LLC. All rights reserved | fill | `Text Color/Body/Primary` |
| Terms of Use | fill | `Text Color/Action/Link` |
| | | fill | `Text Color/Body/Primary` |
| Privacy Policy | fill | `Text Color/Action/Link` |
| Rectangle 7235 | fill | `Background/Divider/Divider` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| ©2025 Acrisure, LLC. All rights reserved | typography | — | `[ARCHIVE]/Footnote1/Short` |
| Terms of Use | typography | — | `[ARCHIVE]/Footnote1/Short` |
| | | typography | — | `[ARCHIVE]/Footnote1/Short` |
| Privacy Policy | typography | — | `[ARCHIVE]/Footnote1/Short` |
| This site is protected by reCAPTCHA and the Google Privacy Policy and Google Terms of Service apply. | typography | — | `[ARCHIVE]/Footnote2/Short` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| This site is protected by reCAPTCHA and the Google Privacy Policy and Google Terms of Service apply. | textRangeFills | — | `Text Color/Action/Link` |
| This site is protected by reCAPTCHA and the Google Privacy Policy and Google Terms of Service apply. | textRangeFills | — | `Text Color/Body/Primary` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **App Footer**: hardcoded color (no variable or style)
- **App Footer**: hardcoded itemSpacing (8px)
- **Heartland Copyright Statement**: hardcoded itemSpacing (8px)
- **Frame 21406**: hardcoded itemSpacing (8px)
- **ReCAPTCHA Disclaimer**: hardcoded itemSpacing (8px)
- **Divider**: hardcoded itemSpacing (10px)
- **Divider**: hardcoded padding
