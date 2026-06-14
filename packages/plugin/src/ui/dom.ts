/**
 * dom.ts — owns the UI's static markup + styles and the typed element refs.
 *
 * `mount()` injects the template into document.body and returns a `Refs` object
 * so the rest of the UI never reaches for `getElementById` directly. The markup
 * is laid out as a tabbed shell:
 *
 *   [ Selected component ]  [ Export all ]
 *
 * The "Selected component" tab is the full Phase-1 single-component flow. The
 * "Export all" tab is an inert placeholder seam for Phase 3 — its panel lives
 * in the markup (`#tab-panel-all`) and its tab button (`#tab-all`) is disabled,
 * so Phase 3 only has to fill the panel and flip the button on.
 *
 * Styling uses Figma theme CSS variables (injected because main.ts passes
 * `themeColors: true` to figma.showUI) so the plugin tracks Figma light/dark.
 */

// ---------------------------------------------------------------------------
// Markup + styles
// ---------------------------------------------------------------------------

const TEMPLATE = `
  <style>
    * { box-sizing: border-box; }
    :root {
      /* Fallbacks so the UI is still legible if theme vars are absent
         (e.g. unit tests, non-Figma host). Real values come from Figma. */
      --figma-color-bg: #ffffff;
      --figma-color-bg-secondary: #f5f5f5;
      --figma-color-bg-tertiary: #e6e6e6;
      --figma-color-bg-brand: #0d99ff;
      --figma-color-bg-brand-hover: #0a85e0;
      --figma-color-bg-disabled: #e6e6e6;
      --figma-color-text: #1e1e1e;
      --figma-color-text-secondary: #767676;
      --figma-color-text-onbrand: #ffffff;
      --figma-color-text-disabled: #b3b3b3;
      --figma-color-border: #e6e6e6;
      --figma-color-bg-success: #14ae5c;
      --figma-color-bg-danger: #f24822;
    }
    html, body { height: 100%; }
    body {
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 12px; margin: 0; line-height: 1.45;
      color: var(--figma-color-text);
      background: var(--figma-color-bg);
      display: flex; flex-direction: column; height: 100vh;
    }

    /* ---- Tab bar ---- */
    .tabs {
      display: flex; gap: 2px; padding: 0 12px;
      border-bottom: 1px solid var(--figma-color-border);
      flex: 0 0 auto;
    }
    .tab {
      appearance: none; background: none; border: none; cursor: pointer;
      padding: 12px 4px; margin-right: 14px;
      font-size: 12px; font-weight: 500;
      color: var(--figma-color-text-secondary);
      border-bottom: 2px solid transparent;
    }
    .tab:hover:not(:disabled) { color: var(--figma-color-text); }
    .tab[aria-selected="true"] {
      color: var(--figma-color-text);
      border-bottom-color: var(--figma-color-text);
    }
    .tab:disabled { cursor: default; opacity: 0.5; }
    .tab .badge {
      font-size: 9px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.04em; margin-left: 6px;
      color: var(--figma-color-text-secondary);
      border: 1px solid var(--figma-color-border);
      border-radius: 4px; padding: 1px 4px;
    }

    /* ---- Scrollable body ---- */
    .content { flex: 1 1 auto; overflow-y: auto; padding: 14px 12px; }
    .panel { display: none; }
    .panel.active { display: block; }

    /* ---- Typography / layout ---- */
    h2 { font-size: 13px; font-weight: 600; margin: 0; }
    .muted { color: var(--figma-color-text-secondary); }
    .hint { font-size: 11px; color: var(--figma-color-text-secondary); margin: 4px 0 0; }
    .row { display: flex; align-items: center; gap: 8px; }
    .stack { display: flex; flex-direction: column; gap: 10px; }
    hr { border: none; border-top: 1px solid var(--figma-color-border); margin: 14px 0; }

    /* ---- Header / component identity ---- */
    .comp-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
    .phase-label { font-size: 11px; color: var(--figma-color-text-secondary); }

    /* ---- Buttons ---- */
    button.btn {
      appearance: none; font-size: 12px; font-weight: 500;
      padding: 7px 14px; border-radius: 6px; cursor: pointer;
      border: 1px solid transparent; line-height: 1;
    }
    button.btn:disabled { cursor: default; opacity: 0.5; }
    .btn-primary {
      background: var(--figma-color-bg-brand);
      color: var(--figma-color-text-onbrand);
    }
    .btn-primary:hover:not(:disabled) { background: var(--figma-color-bg-brand-hover); }
    .btn-secondary {
      background: var(--figma-color-bg-secondary);
      color: var(--figma-color-text);
      border-color: var(--figma-color-border);
    }
    .btn-secondary:hover:not(:disabled) { background: var(--figma-color-bg-tertiary); }

    /* ---- Inputs ---- */
    label.field-label {
      display: block; font-size: 11px; font-weight: 500;
      color: var(--figma-color-text-secondary); margin-bottom: 4px;
    }
    input[type="text"] {
      width: 100%; font-size: 12px; padding: 7px 8px;
      border: 1px solid var(--figma-color-border); border-radius: 6px;
      background: var(--figma-color-bg); color: var(--figma-color-text);
    }
    input[type="text"]:focus {
      outline: none; border-color: var(--figma-color-bg-brand);
    }

    /* ---- Preview textarea ---- */
    textarea {
      width: 100%; height: 260px; font-family: "SF Mono", "Fira Mono", monospace;
      font-size: 11px; border: 1px solid var(--figma-color-border);
      border-radius: 6px; padding: 10px; resize: vertical; line-height: 1.5;
      background: var(--figma-color-bg-secondary); color: var(--figma-color-text);
    }
    textarea:focus { outline: none; border-color: var(--figma-color-bg-brand); }

    /* ---- Banners ---- */
    .banner {
      padding: 8px 10px; border-radius: 6px; font-size: 11px;
      display: none; margin-bottom: 10px;
    }
    .banner.info  { background: var(--figma-color-bg-secondary); color: var(--figma-color-text); }
    .banner.error { background: var(--figma-color-bg-secondary); color: var(--figma-color-bg-danger); }

    /* ---- Optional "Send to docs" disclosure ---- */
    details.docs-disclosure {
      margin-top: 6px; border: 1px solid var(--figma-color-border);
      border-radius: 6px; background: var(--figma-color-bg-secondary);
    }
    details.docs-disclosure > summary {
      list-style: none; cursor: pointer; padding: 9px 10px;
      font-size: 11px; font-weight: 500; color: var(--figma-color-text-secondary);
      display: flex; align-items: center; gap: 6px;
    }
    details.docs-disclosure > summary::-webkit-details-marker { display: none; }
    details.docs-disclosure > summary::before {
      content: "▸"; font-size: 9px; transition: transform 0.1s;
    }
    details.docs-disclosure[open] > summary::before { transform: rotate(90deg); }
    .docs-body { padding: 0 10px 10px; }

    /* ---- Empty / placeholder states ---- */
    .empty {
      text-align: center; color: var(--figma-color-text-secondary);
      padding: 32px 16px;
    }
    .empty .empty-title { font-size: 13px; font-weight: 600; color: var(--figma-color-text); margin-bottom: 4px; }
  </style>

  <div class="tabs" role="tablist">
    <button class="tab" id="tab-selected" role="tab" aria-selected="true"
            aria-controls="tab-panel-selected">Selected component</button>
    <button class="tab" id="tab-all" role="tab" aria-selected="false"
            aria-controls="tab-panel-all">Export all</button>
  </div>

  <div class="content">
    <!-- ============ Selected-component panel ============ -->
    <section class="panel active" id="tab-panel-selected" role="tabpanel"
             aria-labelledby="tab-selected">
      <!-- No selection -->
      <div class="empty" id="no-selection">
        <div class="empty-title">No component selected</div>
        <div>Select a component or component set in Figma to extract its spec.</div>
      </div>

      <!-- Main flow -->
      <div id="main-area" style="display:none">
        <div class="stack">
          <div class="comp-head">
            <h2 id="component-name">Component</h2>
            <span class="phase-label" id="phase-label"></span>
          </div>
          <p class="hint" style="margin-top:0">
            Extract a Markdown spec from the selection. Download it locally — no account or server needed.
          </p>
          <div class="row">
            <button class="btn btn-primary" id="extract-btn">Extract spec</button>
          </div>
        </div>

        <div id="banner-info" class="banner info" style="margin-top:14px"></div>
        <div id="banner-error" class="banner error"></div>

        <div id="review-area" style="display:none; margin-top:14px">
          <p class="hint" style="margin-top:0">
            Review the spec. Edits here only affect the downloaded .md.
          </p>
          <textarea id="spec-textarea" spellcheck="false"></textarea>

          <div class="row" style="margin-top:10px">
            <button class="btn btn-primary" id="download-btn">Download .md</button>
          </div>

          <!-- Optional, de-emphasised docs platform integration -->
          <details class="docs-disclosure" id="docs-disclosure">
            <summary>Optional: send to your docs platform</summary>
            <div class="docs-body stack">
              <p class="hint" style="margin-top:0">
                Connect a Design System Docs instance to publish specs directly. Leave blank to work standalone.
              </p>
              <div>
                <label class="field-label" for="endpoint-input">Docs URL</label>
                <input type="text" id="endpoint-input" placeholder="http://localhost:3000" />
              </div>
              <div>
                <label class="field-label" for="filekey-input">Figma file URL or key</label>
                <input type="text" id="filekey-input" placeholder="paste Figma file URL or key" />
                <p class="hint" id="filekey-hint"></p>
              </div>
              <div class="row">
                <button class="btn btn-secondary" id="send-btn">Send to docs</button>
              </div>
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- ============ Export-all panel ============ -->
    <section class="panel" id="tab-panel-all" role="tabpanel"
             aria-labelledby="tab-all">
      <div class="stack">
        <p class="hint" style="margin-top:0">
          Export every component in the file as a Markdown spec, bundled into a
          single <code>.zip</code>. No component needs to be selected.
        </p>
        <div>
          <label class="field-label" for="folder-input">Folder / ZIP name</label>
          <input type="text" id="folder-input" placeholder="design-system" value="design-system" />
        </div>
        <div class="row">
          <button class="btn btn-primary" id="export-all-btn">Export all components</button>
        </div>
        <div id="export-status" class="hint" style="min-height:1.4em"></div>
      </div>
    </section>
  </div>
`;

// ---------------------------------------------------------------------------
// Typed refs
// ---------------------------------------------------------------------------

export interface Refs {
  // Tabs
  tabSelected: HTMLButtonElement;
  tabAll: HTMLButtonElement;
  panelSelected: HTMLElement;
  panelAll: HTMLElement;
  // Selection / main
  noSelection: HTMLDivElement;
  mainArea: HTMLDivElement;
  componentName: HTMLHeadingElement;
  phaseLabel: HTMLSpanElement;
  extractBtn: HTMLButtonElement;
  // Banners
  bannerInfo: HTMLDivElement;
  bannerError: HTMLDivElement;
  // Review / output
  reviewArea: HTMLDivElement;
  specTextarea: HTMLTextAreaElement;
  downloadBtn: HTMLButtonElement;
  // Optional docs platform
  docsDisclosure: HTMLDetailsElement;
  endpointInput: HTMLInputElement;
  fileKeyInput: HTMLInputElement;
  fileKeyHint: HTMLParagraphElement;
  sendBtn: HTMLButtonElement;
  // Export-all panel
  folderInput: HTMLInputElement;
  exportAllBtn: HTMLButtonElement;
  exportStatus: HTMLDivElement;
}

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`dom.mount: missing element #${id}`);
  return el as T;
}

/**
 * Injects the template into document.body and returns the typed refs.
 * Call exactly once on boot.
 */
export function mount(): Refs {
  document.body.innerHTML = TEMPLATE;

  return {
    tabSelected: byId<HTMLButtonElement>('tab-selected'),
    tabAll: byId<HTMLButtonElement>('tab-all'),
    panelSelected: byId<HTMLElement>('tab-panel-selected'),
    panelAll: byId<HTMLElement>('tab-panel-all'),
    noSelection: byId<HTMLDivElement>('no-selection'),
    mainArea: byId<HTMLDivElement>('main-area'),
    componentName: byId<HTMLHeadingElement>('component-name'),
    phaseLabel: byId<HTMLSpanElement>('phase-label'),
    extractBtn: byId<HTMLButtonElement>('extract-btn'),
    bannerInfo: byId<HTMLDivElement>('banner-info'),
    bannerError: byId<HTMLDivElement>('banner-error'),
    reviewArea: byId<HTMLDivElement>('review-area'),
    specTextarea: byId<HTMLTextAreaElement>('spec-textarea'),
    downloadBtn: byId<HTMLButtonElement>('download-btn'),
    docsDisclosure: byId<HTMLDetailsElement>('docs-disclosure'),
    endpointInput: byId<HTMLInputElement>('endpoint-input'),
    fileKeyInput: byId<HTMLInputElement>('filekey-input'),
    fileKeyHint: byId<HTMLParagraphElement>('filekey-hint'),
    sendBtn: byId<HTMLButtonElement>('send-btn'),
    folderInput: byId<HTMLInputElement>('folder-input'),
    exportAllBtn: byId<HTMLButtonElement>('export-all-btn'),
    exportStatus: byId<HTMLDivElement>('export-status'),
  };
}
