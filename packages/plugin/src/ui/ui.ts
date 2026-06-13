import { extract, renderSpec } from '@spec-layer/extractor';
import type { SerializedNode, IntermediateSpec } from '@spec-layer/extractor';
import type { MainToUi, UiToMain } from '../messages';
import { nextStatus, resetToIdle, toKebab, type UiPhase } from './state';
import { parseFigmaFileKey } from './fileKey';

// ---------------------------------------------------------------------------
// Message helpers
// ---------------------------------------------------------------------------

function send(msg: UiToMain): void {
  parent.postMessage({ pluginMessage: msg }, '*');
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let phase: UiPhase = 'idle';
let currentNode: SerializedNode | null = null;
let currentFileKey = '';
let currentSpec: IntermediateSpec | null = null;
let currentExtractedAt = '';
let renderedMd = '';
let docsEndpoint = 'http://localhost:3000';

// ---------------------------------------------------------------------------
// DOM — build once, wire once
// ---------------------------------------------------------------------------

document.body.innerHTML = `
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
           font-size: 13px; margin: 0; padding: 12px; color: #1e1e1e; background: #fff; }
    h2 { font-size: 14px; font-weight: 600; margin: 0 0 8px; }
    .row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
    button { padding: 6px 12px; font-size: 12px; border: none; border-radius: 4px;
             cursor: pointer; background: #18a0fb; color: #fff; }
    button:disabled { opacity: 0.4; cursor: default; }
    button.secondary { background: #e5e5e5; color: #1e1e1e; }
    button.send-btn { background: #1bc47d; }
    button.download-btn { background: #6c6c6c; }
    label { font-size: 11px; color: #666; }
    input[type="text"] {
      font-size: 12px; padding: 5px 8px; border: 1px solid #ccc;
      border-radius: 4px; flex: 1; }
    textarea {
      width: 100%; height: 280px; font-family: "SF Mono", "Fira Mono", monospace;
      font-size: 11px; border: 1px solid #ccc; border-radius: 4px;
      padding: 8px; resize: vertical; line-height: 1.5; }
    .banner { padding: 8px 10px; border-radius: 4px; margin-bottom: 10px;
              font-size: 12px; display: none; }
    .banner.info  { background: #e8f4ff; color: #0060c0; }
    .banner.error { background: #fff0f0; color: #c00; }
    .hint { font-size: 11px; color: #888; margin-bottom: 6px; }
    .section { margin-bottom: 12px; }
    hr { border: none; border-top: 1px solid #eee; margin: 10px 0; }
    #no-selection { color: #999; padding: 20px 0; text-align: center; }
    #main-area { display: none; }
  </style>

  <div class="section" id="settings">
    <div class="row">
      <label for="endpoint-input">Docs URL</label>
      <input type="text" id="endpoint-input" placeholder="http://localhost:3000" style="flex:1" />
    </div>
    <div class="row">
      <label for="filekey-input">Figma file</label>
      <input type="text" id="filekey-input" placeholder="paste Figma file URL or key" style="flex:1" />
    </div>
    <div class="hint" id="filekey-hint" style="padding-left:80px"></div>
  </div>

  <hr />

  <div id="no-selection">Select a component or component set.</div>

  <div id="main-area">
    <div class="section">
      <div class="row">
        <h2 id="component-name">Component</h2>
      </div>
      <div class="row">
        <button id="extract-btn">Extract</button>
        <span id="phase-label" style="font-size:11px;color:#888;"></span>
      </div>
    </div>

    <div class="banner info" id="banner-info"></div>
    <div class="banner error" id="banner-error"></div>

    <div class="section" id="review-area" style="display:none">
      <div class="hint">Review the structural spec below. Edits here only affect the downloaded .md — "Send to docs" sends the extracted structure as-is.</div>
      <textarea id="spec-textarea" spellcheck="false"></textarea>

      <div class="row" style="margin-top:8px">
        <button class="send-btn" id="send-btn">Send to docs</button>
        <button class="download-btn secondary" id="download-btn">Download .md</button>
      </div>
    </div>
  </div>
`;

// ---------------------------------------------------------------------------
// Element refs
// ---------------------------------------------------------------------------

const endpointInput  = document.getElementById('endpoint-input') as HTMLInputElement;
const fileKeyInput   = document.getElementById('filekey-input') as HTMLInputElement;
const fileKeyHint    = document.getElementById('filekey-hint') as HTMLDivElement;
const noSelection    = document.getElementById('no-selection') as HTMLDivElement;
const mainArea       = document.getElementById('main-area') as HTMLDivElement;
const componentName  = document.getElementById('component-name') as HTMLHeadingElement;
const phaseLabel     = document.getElementById('phase-label') as HTMLSpanElement;
const extractBtn     = document.getElementById('extract-btn') as HTMLButtonElement;
const bannerInfo     = document.getElementById('banner-info') as HTMLDivElement;
const bannerError    = document.getElementById('banner-error') as HTMLDivElement;
const reviewArea     = document.getElementById('review-area') as HTMLDivElement;
const specTextarea   = document.getElementById('spec-textarea') as HTMLTextAreaElement;
const sendBtn        = document.getElementById('send-btn') as HTMLButtonElement;
const downloadBtn    = document.getElementById('download-btn') as HTMLButtonElement;

// ---------------------------------------------------------------------------
// Render helpers
// ---------------------------------------------------------------------------

function showBanner(type: 'info' | 'error' | null, text: string): void {
  bannerInfo.style.display  = type === 'info'  ? 'block' : 'none';
  bannerError.style.display = type === 'error' ? 'block' : 'none';
  if (type === 'info')  bannerInfo.textContent  = text;
  if (type === 'error') bannerError.textContent = text;
}

function clearBanners(): void {
  showBanner(null, '');
}

function renderPhase(): void {
  phaseLabel.textContent = phase === 'extracting' ? 'extracting…' : '';
  extractBtn.disabled = phase === 'extracting';

  const hasSpec = currentSpec !== null;
  reviewArea.style.display = hasSpec ? 'block' : 'none';
  sendBtn.disabled = phase === 'extracting';

  if (renderedMd) {
    specTextarea.value = renderedMd;
  }
}

// ---------------------------------------------------------------------------
// Extract flow
// ---------------------------------------------------------------------------

async function runExtract(): Promise<void> {
  if (!currentNode) return;

  clearBanners();
  phase = resetToIdle();
  phase = nextStatus(phase, 'selected');
  renderPhase();

  const extractedAt = new Date().toISOString();
  const spec = extract(currentNode, { figmaFile: currentFileKey });
  renderedMd = renderSpec(spec, { prose: null, extractedAt });

  currentSpec = spec;
  currentExtractedAt = extractedAt;

  phase = nextStatus(phase, 'rendered');
  renderPhase();

  send({ type: 'notify', message: `Spec extracted for ${spec.name}` });
}

// ---------------------------------------------------------------------------
// Send to docs
// ---------------------------------------------------------------------------

async function runSendToDocs(): Promise<void> {
  if (!currentSpec) return;

  const base = docsEndpoint.replace(/\/+$/, '');
  const url = `${base}/api/specs/import`;

  showBanner('info', 'Sending to docs…');
  sendBtn.disabled = true;

  try {
    const res = await window.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spec: currentSpec, extractedAt: currentExtractedAt }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      showBanner('error', `Send failed (${res.status}): ${text}`);
      return;
    }

    const data = await res.json() as { ok: boolean; path?: string; slug?: string; warning?: string };
    phase = nextStatus(phase, 'sent');
    renderPhase();

    const slug = data.slug ?? '';
    const successMsg = slug ? `Sent → _inbox/${slug}` : 'Sent to docs.';
    showBanner('info', successMsg + (data.warning ? `  ⚠ ${data.warning}` : ''));
    send({ type: 'notify', message: `Spec sent: ${currentSpec.name}` });

    const browserUrl = slug
      ? `${base}/components/_inbox/${slug}`
      : `${base}/inbox`;
    send({ type: 'openBrowser', url: browserUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    showBanner('error', `Send failed: ${msg}`);
  } finally {
    sendBtn.disabled = false;
  }
}

// ---------------------------------------------------------------------------
// Download
// ---------------------------------------------------------------------------

function runDownload(): void {
  const content = specTextarea.value;
  const name = currentNode?.name ?? 'component';
  const filename = toKebab(name) + '.md';
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Event wiring
// ---------------------------------------------------------------------------

endpointInput.addEventListener('change', () => {
  docsEndpoint = endpointInput.value.trim() || 'http://localhost:3000';
  send({ type: 'setDocsEndpoint', value: docsEndpoint });
});

fileKeyInput.addEventListener('change', () => {
  const raw = fileKeyInput.value.trim();
  if (!raw) {
    fileKeyHint.textContent = '';
    send({ type: 'setFileKeyOverride', value: null });
    return;
  }
  const parsed = parseFigmaFileKey(raw);
  if (!parsed) {
    fileKeyHint.textContent = 'Could not detect a file key — paste the full Figma URL.';
    return;
  }
  // Main is the single authority: it stores the override, recomputes the
  // effective key, and echoes both back via a 'fileKeyOverride' message.
  send({ type: 'setFileKeyOverride', value: parsed });
});

extractBtn.addEventListener('click', () => { runExtract().catch(() => { /* handled inside */ }); });
sendBtn.addEventListener('click', () => { runSendToDocs().catch(() => { /* handled inside */ }); });
downloadBtn.addEventListener('click', runDownload);

// Keep textarea in sync with renderedMd when user edits
specTextarea.addEventListener('input', () => {
  renderedMd = specTextarea.value;
});

// ---------------------------------------------------------------------------
// Message handling
// ---------------------------------------------------------------------------

window.onmessage = (event: MessageEvent) => {
  const msg = event.data?.pluginMessage as MainToUi | undefined;
  if (!msg) return;

  switch (msg.type) {
    case 'selection': {
      currentNode = msg.node;
      // msg.fileKey is already the effective key computed by main.
      currentFileKey = msg.fileKey;
      currentSpec = null;
      currentExtractedAt = '';
      if (msg.node) {
        noSelection.style.display = 'none';
        mainArea.style.display = 'block';
        componentName.textContent = msg.node.name;
        phase = 'idle';
        renderedMd = '';
        clearBanners();
        reviewArea.style.display = 'none';
        renderPhase();
      } else {
        noSelection.style.display = 'block';
        mainArea.style.display = 'none';
        phase = 'idle';
      }
      break;
    }

    case 'docsEndpoint': {
      docsEndpoint = msg.value ?? 'http://localhost:3000';
      endpointInput.value = docsEndpoint;
      break;
    }

    case 'fileKeyOverride': {
      // Main is the single authority; it sends both the stored override
      // (for the input) and the computed effective key (for display/use).
      currentFileKey = msg.effectiveFileKey;
      if (msg.value) {
        fileKeyInput.value = msg.value;
        fileKeyHint.textContent = `Using file key ${msg.effectiveFileKey}`;
      } else {
        fileKeyInput.value = '';
        fileKeyHint.textContent = '';
      }
      break;
    }
  }
};

// ---------------------------------------------------------------------------
// Boot — request initial selection from main thread
// ---------------------------------------------------------------------------

send({ type: 'requestSelection' });
