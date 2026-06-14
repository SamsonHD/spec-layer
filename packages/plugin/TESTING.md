# Spec Layer Plugin — Manual Verification Script

Phase 1 release gate. Run top-to-bottom before merging to `main`.  
Mark each item `[x]` when verified, note issues in **Known gaps** at the bottom.

The plugin extracts a structural spec deterministically (no Anthropic call, no
API key, no prose). The flow is: **Extract → review the rendered markdown in the
textarea → Send to docs OR Download .md**.

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

## 4. Settings — Docs URL and Figma file override

1. Run the plugin.
2. In **Settings**, leave **Docs URL** empty and confirm the placeholder reads `http://localhost:3000`.
3. Type a custom URL (e.g. `http://localhost:4001`) into **Docs URL** and blur the field.
4. Close the plugin and reopen it.
5. Paste a full Figma file URL (e.g. `https://www.figma.com/file/ABC123/My-Kit`) into the **Figma file** field and blur.

**Verify:**

- [ ] After reopening, **Docs URL** still shows the custom value you entered (persists via clientStorage).
- [ ] The **Figma file** hint shows the detected key (e.g. `Using file key ABC123`) when a valid URL/key is pasted.
- [ ] Pasting an unparseable string shows the hint `Could not detect a file key — paste the full Figma URL.` and does **not** crash.
- [ ] Clearing the **Figma file** field removes the hint.

> Reset **Docs URL** back to `http://localhost:3000` before the send tests below.

---

## 5. Button — core extraction

1. Locate the **Button** component set in the M3 kit (search Components panel: "Button").
2. Select the **Button** component set frame.
3. Run the plugin → click **Extract**.

**Verify all of the following:**

- [ ] **Anatomy** lists the layers visible in the default variant (e.g. Container, Label Text, Icon).
- [ ] **Configuration table** columns (Name / Kind / Options / Default) match the kit's right-side Properties panel.
- [ ] Variant axes are complete: at least `Style` (Filled · Tonal · Outlined · Elevated · Text) and `State` (Enabled · Hovered · Focused · Pressed · Disabled).
- [ ] **Tokens used** table shows `md.sys.*` names (e.g. `md.sys.color.primary`).
- [ ] **No raw variable IDs** appear anywhere in the output (search the rendered markdown for `VariableID:` — should be zero hits).
- [ ] The rendered markdown appears in the **review textarea** and the **Send to docs** / **Download .md** buttons are enabled.

---

## 6. Send to docs — success path

1. Start the docs web app so it listens on `http://localhost:3000` (the only origin permitted by `manifest.json` `networkAccess`).
2. With a Button spec extracted (step 5), click **Send to docs**.

**Verify:**

- [ ] An info banner shows the result, e.g. `Sent → <path or slug>`.
- [ ] The spec lands in the docs web app inbox (POST `http://localhost:3000/api/specs/import` succeeds).
- [ ] A Figma toast notifies `Spec sent: <component>`.

---

## 7. Send to docs — failure path

1. Stop the docs web app (nothing listening on `http://localhost:3000`).
2. With a spec still extracted, click **Send to docs**.

**Verify:**

- [ ] A red **error banner** appears (e.g. `Send failed: …` or `Send failed (<status>): …`).
- [ ] The plugin does **not** crash; the **Send to docs** button re-enables so you can retry.

---

## 8. Download draft .md (reflects textarea edits)

1. With a spec extracted, edit the **review textarea** (add a word or a line of text).
2. Click **Download .md**.

**Verify:**

- [ ] A `<component>.md` file downloads (filename is the kebab-cased component name).
- [ ] The downloaded file content includes the edit you made in the textarea (download reflects textarea edits, not the original extraction).
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

## 9. Additional components — Text field & Dialog

Repeat extraction (step 5) and a send or download (steps 6–8) for:

| Component | Status | Notes |
|---|---|---|
| **Text field** | [ ] pass / [ ] fail | |
| **Dialog** | [ ] pass / [ ] fail | |

Record any token resolution mismatches or missing anatomy parts under **Known gaps** below.

---

## 10. Non-component selection guard

1. Select any plain **Frame** (not a component or component set).
2. Run the plugin.

**Pass:** A friendly message appears — e.g. "Select a component or component set" — and the plugin **does not crash**.

---

## 11. Child-layer selection (findComponent fix)

1. Expand the Button component set in the Layers panel.
2. Click a layer **inside** a variant (e.g. the Label Text layer inside Style=Filled, State=Enabled).
3. Run the plugin → click **Extract**.

**Pass:** Plugin resolves up to the parent COMPONENT_SET and produces the full Configuration table (all variant axes present). It does **not** show a partial or empty props table.

---

## 12. Export all — bulk ZIP download

Verify the "Export all" tab works end-to-end with no component selected.

### Steps

1. Run the plugin (no component needs to be selected in Figma).
2. Click the **Export all** tab in the plugin header (it should now be fully enabled — no "Soon" badge).
3. In the **Folder / ZIP name** field, clear the default value and type `my-ds` (or leave the default `design-system`).
4. Click **Export all components**.

**Verify during export:**

- [ ] The status area shows progress like `Rendering 3 / 48…` (count advances as components stream in).
- [ ] The **Export all components** button is disabled while the export runs (prevents double-submit).

**Verify on completion:**

- [ ] A `my-ds.zip` (or `design-system.zip`) file downloads automatically.
- [ ] The status area shows a success message like `Exported 47 components → my-ds.zip` (count may be slightly less than the total shown during progress if any nodes were deleted between enumeration and fetch — this is expected).
- [ ] The **Export all components** button re-enables.
- [ ] Unzip the downloaded file and confirm:
  - Each component has a corresponding `.md` file inside the `my-ds/` folder.
  - File names are kebab-cased (e.g. `button.md`, `text-field.md`).
  - Two components with the same name produce `name.md` and `name-2.md` (collision handling).
  - Each `.md` file starts with `---` (YAML frontmatter).

### Keyboard / accessibility

- [ ] Tab key moves focus to the **Export all** tab; pressing Enter or Space switches to that panel.
- [ ] Tab key within the panel moves through: Folder input → Export button.

### Error path

1. With the plugin open, disconnect from the network (or use Figma desktop in a file with zero components).
2. Click **Export all components**.

- [ ] An error banner appears in the status area (e.g. `Export failed: …`).
- [ ] The **Export all components** button re-enables so the user can retry.

---

## Known gaps

_Fill in during testing. Include component name, step number, and observed vs expected._

- 
