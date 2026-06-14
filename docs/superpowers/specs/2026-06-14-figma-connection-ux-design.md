# Figma Connection UX Design

## Problem

The plugin can display a manually supplied Figma file key while still sending a previously extracted spec whose `figmaFile` value is `unknown`. The docs platform then presents two identical recovery forms, which makes the user believe another connection step is always required.

## Design

- Treat the plugin as the source of Figma identity metadata.
- Show whether the source was detected from the current Figma file, supplied manually, or is still missing.
- When the effective file key changes, regenerate any current extracted spec and Markdown immediately before it can be sent.
- Keep manual entry as a recovery control, not a normal setup requirement.
- On the docs page, render one recovery notice in the preview location only. The Specs tab must not repeat it.
- Use direct language: explain that previews are linked automatically, and only ask for a file URL when detection genuinely failed.

## Success Criteria

- Entering a valid key after extraction updates the spec sent to docs without requiring another Extract click.
- Imported frontmatter and sidecar data contain the effective file key.
- A missing source produces one recovery form on the component page.
- A detected or manually supplied source is described clearly in the plugin.

