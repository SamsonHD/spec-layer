# Spec Layer Plugin — Manual Verification Script

Phase 1 release gate. Run top-to-bottom before merging to `main`.  
Mark each item `[x]` when verified, note issues in **Known gaps** at the bottom.

---

## 1. Build

```sh
node packages/plugin/build.mjs
```

**Pass:** `dist/main.js` and `dist/ui.html` are created (no esbuild errors).

---

## 2. Import into Figma

1. Open Figma desktop.
2. Menu → **Plugins → Development → Import plugin from manifest…**
3. Select `packages/plugin/manifest.json`.

**Pass:** Plugin appears under Development plugins without error.

---

## 3. Open a draft copy of the Material 3 Design Kit

1. Find the [Material 3 Design Kit](https://www.figma.com/community/file/1035203688168086460) on Figma Community.
2. Click **Duplicate** — work on the copy, **never the original**.
3. Open the duplicate file.

---

## 4. Button — core extraction

1. Locate the **Button** component set in the M3 kit (search Components panel: "Button").
2. Select the **Button** component set frame.
3. Run the plugin → click **Extract**.

**Verify all of the following:**

- [ ] **Anatomy** lists the layers visible in the default variant (e.g. Container, Label Text, Icon).
- [ ] **Configuration table** columns (Name / Kind / Options / Default) match the kit's right-side Properties panel.
- [ ] Variant axes are complete: at least `Style` (Filled · Tonal · Outlined · Elevated · Text) and `State` (Enabled · Hovered · Focused · Pressed · Disabled).
- [ ] **Tokens used** table shows `md.sys.*` names (e.g. `md.sys.color.primary`).
- [ ] **No raw variable IDs** appear anywhere in the output (search the rendered markdown for `VariableID:` — should be zero hits).

---

## 5. No-API-key mode (prose degraded)

1. Ensure no Anthropic API key is set in the plugin settings field.
2. Re-extract the Button (or any component).

**Verify:**

- [ ] Prose sections (Definition, Code, Accessibility, Do's & Don'ts) display the draft marker: `⚠️ Draft — AI-suggested, not yet approved.` with placeholder text.
- [ ] **Export / Download** button is still enabled and produces a `.md` file.
- [ ] Downloaded file parses without error:
  ```sh
  node -e "
    const fs = require('fs');
    const md = fs.readFileSync('button.md', 'utf8');
    // quick frontmatter sanity
    if (!md.startsWith('---')) throw new Error('no frontmatter');
    console.log('OK');
  "
  ```

---

## 6. API key mode + cache

1. Open plugin settings, paste a valid Anthropic API key.
2. Re-extract **Button** → wait for prose drafts to populate all judgment sections.
3. **Re-extract the same Button again** without changing the selection.

**Verify:**

- [ ] On the second extraction, prose appears immediately (no visible loading delay).
- [ ] Open DevTools Network panel (Figma desktop: **Help → Toggle Developer Tools**) and confirm **no second outbound request** to `api.anthropic.com` is made on the repeat extraction.

---

## 7. Edit + Approve + Download round-trip

1. In the plugin UI, edit the **Definition** textarea (add a word or sentence).
2. Click **Approve** (enter your name when prompted).

**Verify:**

- [ ] Frontmatter flips to `status: approved` with your name in `approved_by`.
- [ ] All `⚠️ Draft` markers are removed from the rendered markdown.
- [ ] Click **Download** → file saves as `button.md`.
- [ ] Parse the downloaded file:
  ```sh
  node -e "
    const fs = require('fs');
    const md = fs.readFileSync('button.md', 'utf8');
    const m = md.match(/^---\n([\s\S]*?)\n---/);
    const yaml = m[1];
    if (!yaml.includes('status: approved')) throw new Error('not approved');
    if (!yaml.includes('approved_by:')) throw new Error('no approved_by');
    if (md.includes('⚠️ Draft')) throw new Error('draft marker still present');
    console.log('OK');
  "
  ```

---

## 8. Additional components — Text field & Dialog

Repeat extraction (steps 4–5) for:

| Component | Status | Notes |
|---|---|---|
| **Text field** | [ ] pass / [ ] fail | |
| **Dialog** | [ ] pass / [ ] fail | |

Record any token resolution mismatches or missing anatomy parts under **Known gaps** below.

---

## 9. Non-component selection guard

1. Select any plain **Frame** (not a component or component set).
2. Run the plugin.

**Pass:** A friendly message appears — e.g. "Select a component or component set" — and the plugin **does not crash**.

---

## 10. Child-layer selection (findComponent fix)

1. Expand the Button component set in the Layers panel.
2. Click a layer **inside** a variant (e.g. the Label Text layer inside Style=Filled, State=Enabled).
3. Run the plugin.

**Pass:** Plugin resolves up to the parent COMPONENT_SET and produces the full Configuration table (all variant axes present). It does **not** show a partial or empty props table.

---

## Known gaps

_Fill in during testing. Include component name, step number, and observed vs expected._

- 
