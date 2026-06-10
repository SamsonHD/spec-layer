import { extract, renderSpec, draftProse } from '@spec-layer/extractor';
import type { SerializedNode, CacheStore } from '@spec-layer/extractor';
import type { MainToUi, UiToMain } from '../messages';
import { approveSpec, nextStatus, resetToIdle, toKebab, type UiPhase } from './state';

// ---------------------------------------------------------------------------
// Message helpers
// ---------------------------------------------------------------------------

function send(msg: UiToMain): void {
  parent.postMessage({ pluginMessage: msg }, '*');
}

// ---------------------------------------------------------------------------
// clientStorage-backed CacheStore
// Pending get-resolvers keyed by cache key so concurrent gets work correctly.
// ---------------------------------------------------------------------------

const pendingGets = new Map<string, Array<(v: string | null) => void>>();

const CACHE_GET_TIMEOUT_MS = 5_000;

const cacheStore: CacheStore = {
  get(key: string): Promise<string | null> {
    return new Promise((resolve) => {
      const existing = pendingGets.get(key);
      if (existing) {
        existing.push(resolve);
        // Timeout is already running for this key (set when the first waiter registered)
      } else {
        pendingGets.set(key, [resolve]);
        // Start a timeout for this key — resolves all waiters with null on expiry
        const timer = setTimeout(() => {
          const waiters = pendingGets.get(key);
          if (waiters) {
            pendingGets.delete(key);
            for (const r of waiters) r(null);
          }
        }, CACHE_GET_TIMEOUT_MS);
        // Store the timer id alongside the resolvers so a real reply can cancel it
        (pendingGets.get(key) as unknown as { _timer?: ReturnType<typeof setTimeout> })._timer = timer;
      }
      send({ type: 'cacheGet', key });
    });
  },
  set(key: string, value: string): Promise<void> {
    send({ type: 'cacheSet', key, value });
    return Promise.resolve();
  },
};

function resolvePendingGet(key: string, value: string | null): void {
  const resolvers = pendingGets.get(key);
  if (resolvers) {
    // Cancel the timeout before we delete the entry and fire resolvers
    const timer = (resolvers as unknown as { _timer?: ReturnType<typeof setTimeout> })._timer;
    if (timer !== undefined) clearTimeout(timer);
    pendingGets.delete(key);
    for (const resolve of resolvers) resolve(value);
  }
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let phase: UiPhase = 'idle';
let currentNode: SerializedNode | null = null;
let currentFileKey = '';
let apiKey: string | null = null;
let renderedMd = '';
let banner = '';

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
    button.approve-btn { background: #1bc47d; }
    button.download-btn { background: #6c6c6c; }
    label { font-size: 11px; color: #666; }
    input[type="password"], input[type="text"] {
      font-size: 12px; padding: 5px 8px; border: 1px solid #ccc;
      border-radius: 4px; flex: 1; }
    textarea {
      width: 100%; height: 280px; font-family: "SF Mono", "Fira Mono", monospace;
      font-size: 11px; border: 1px solid #ccc; border-radius: 4px;
      padding: 8px; resize: vertical; line-height: 1.5; }
    .banner { padding: 8px 10px; border-radius: 4px; margin-bottom: 10px;
              font-size: 12px; display: none; }
    .banner.info  { background: #e8f4ff; color: #0060c0; }
    .banner.warn  { background: #fff7e6; color: #8a5000; }
    .banner.error { background: #fff0f0; color: #c00; }
    .hint { font-size: 11px; color: #888; margin-bottom: 6px; }
    .section { margin-bottom: 12px; }
    .status-badge { font-size: 11px; padding: 2px 8px; border-radius: 10px;
                    background: #f0f0f0; color: #555; }
    .status-badge.approved { background: #e0f8ed; color: #1a7a4a; }
    hr { border: none; border-top: 1px solid #eee; margin: 10px 0; }
    #no-selection { color: #999; padding: 20px 0; text-align: center; }
    #main-area { display: none; }
    .approver-row { display: flex; align-items: center; gap: 6px; }
    .approver-row label { white-space: nowrap; }
  </style>

  <div class="section" id="settings">
    <div class="row">
      <label for="api-key-input">API key</label>
      <input type="password" id="api-key-input" placeholder="sk-ant-..." style="flex:1" />
    </div>
    <div class="hint">No key → structural spec only, no AI drafts.</div>
  </div>

  <hr />

  <div id="no-selection">Select a component or component set.</div>

  <div id="main-area">
    <div class="section">
      <div class="row">
        <h2 id="component-name">Component</h2>
        <span class="status-badge" id="status-badge">draft</span>
      </div>
      <div class="row">
        <button id="extract-btn">Extract</button>
        <span id="phase-label" style="font-size:11px;color:#888;"></span>
      </div>
    </div>

    <div class="banner info" id="banner-info"></div>
    <div class="banner warn" id="banner-warn"></div>
    <div class="banner error" id="banner-error"></div>

    <div class="section" id="review-area" style="display:none">
      <div class="hint" id="draft-hint"></div>
      <textarea id="spec-textarea" spellcheck="false"></textarea>

      <div class="row" style="margin-top:8px">
        <div class="approver-row">
          <label for="approver-input">Approver:</label>
          <input type="text" id="approver-input" value="Designer" style="width:120px" />
        </div>
        <button class="approve-btn" id="approve-btn">Approve</button>
        <button class="download-btn secondary" id="download-btn">Download .md</button>
      </div>
    </div>
  </div>
`;

// ---------------------------------------------------------------------------
// Element refs
// ---------------------------------------------------------------------------

const apiKeyInput    = document.getElementById('api-key-input') as HTMLInputElement;
const noSelection    = document.getElementById('no-selection') as HTMLDivElement;
const mainArea       = document.getElementById('main-area') as HTMLDivElement;
const componentName  = document.getElementById('component-name') as HTMLHeadingElement;
const statusBadge    = document.getElementById('status-badge') as HTMLSpanElement;
const phaseLabel     = document.getElementById('phase-label') as HTMLSpanElement;
const extractBtn     = document.getElementById('extract-btn') as HTMLButtonElement;
const bannerInfo     = document.getElementById('banner-info') as HTMLDivElement;
const bannerWarn     = document.getElementById('banner-warn') as HTMLDivElement;
const bannerError    = document.getElementById('banner-error') as HTMLDivElement;
const reviewArea     = document.getElementById('review-area') as HTMLDivElement;
const draftHint      = document.getElementById('draft-hint') as HTMLDivElement;
const specTextarea   = document.getElementById('spec-textarea') as HTMLTextAreaElement;
const approverInput  = document.getElementById('approver-input') as HTMLInputElement;
const approveBtn     = document.getElementById('approve-btn') as HTMLButtonElement;
const downloadBtn    = document.getElementById('download-btn') as HTMLButtonElement;

// ---------------------------------------------------------------------------
// Render helpers
// ---------------------------------------------------------------------------

function showBanner(type: 'info' | 'warn' | 'error' | null, text: string): void {
  bannerInfo.style.display  = type === 'info'  ? 'block' : 'none';
  bannerWarn.style.display  = type === 'warn'  ? 'block' : 'none';
  bannerError.style.display = type === 'error' ? 'block' : 'none';
  if (type === 'info')  bannerInfo.textContent  = text;
  if (type === 'warn')  bannerWarn.textContent  = text;
  if (type === 'error') bannerError.textContent = text;
}

function clearBanners(): void {
  showBanner(null, '');
}

function countDraftSections(md: string): number {
  return (md.match(/> ⚠️ Draft/g) ?? []).length;
}

function updateDraftHint(md: string): void {
  const n = countDraftSections(md);
  draftHint.textContent = n > 0
    ? `${n} section${n > 1 ? 's' : ''} still contain AI-draft markers — review and edit before approving.`
    : 'No draft markers — all sections reviewed.';
}

function renderPhase(): void {
  phaseLabel.textContent = phase === 'idle' ? '' : phase;
  extractBtn.disabled = phase === 'extracting' || phase === 'drafting';
  reviewArea.style.display = (phase === 'review' || phase === 'approved') ? 'block' : 'none';

  statusBadge.textContent = phase === 'approved' ? 'approved' : 'draft';
  statusBadge.className = 'status-badge' + (phase === 'approved' ? ' approved' : '');

  approveBtn.disabled = phase === 'approved';

  if (renderedMd) {
    specTextarea.value = renderedMd;
    updateDraftHint(renderedMd);
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
  extractBtn.disabled = true;
  phaseLabel.textContent = 'extracting…';

  // Step 1: extract struct
  const spec = extract(currentNode, { figmaFile: currentFileKey });

  // Step 2: render structural markdown immediately
  const extractedAt = new Date().toISOString();
  renderedMd = renderSpec(spec, { prose: null, extractedAt });
  phase = nextStatus(phase, 'rendered');
  phaseLabel.textContent = 'drafting…';
  renderPhase();

  // Step 3: try AI prose
  try {
    if (!apiKey) {
      showBanner('warn', 'AI drafts unavailable — structural spec only (no API key set).');
      phase = nextStatus(phase, 'prose-failed');
    } else {
      const prose = await draftProse(spec, {
        apiKey,
        fetcher: window.fetch.bind(window),
        cacheStore,
      });
      if (prose) {
        renderedMd = renderSpec(spec, { prose, extractedAt });
        phase = nextStatus(phase, 'prose-done');
      } else {
        showBanner('warn', 'AI drafts unavailable — structural spec only.');
        phase = nextStatus(phase, 'prose-failed');
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    showBanner('error', `AI draft failed: ${msg}`);
    phase = nextStatus(phase, 'prose-failed');
  }

  renderPhase();
  send({ type: 'notify', message: `Spec extracted for ${spec.name}` });
}

// ---------------------------------------------------------------------------
// Approve
// ---------------------------------------------------------------------------

function runApprove(): void {
  const approver = approverInput.value.trim() || 'Designer';
  try {
    const approved = approveSpec(specTextarea.value, approver);
    renderedMd = approved;
    specTextarea.value = approved;
    phase = nextStatus(phase, 'approved');
    renderPhase();
    clearBanners();
    showBanner('info', `Approved by ${approver}.`);
    send({ type: 'notify', message: 'Spec approved.' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    showBanner('error', `Approve failed: ${msg}`);
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

apiKeyInput.addEventListener('change', () => {
  apiKey = apiKeyInput.value.trim() || null;
  send({ type: 'setApiKey', value: apiKeyInput.value.trim() });
});

extractBtn.addEventListener('click', () => { runExtract().catch(() => { /* handled inside */ }); });
approveBtn.addEventListener('click', runApprove);
downloadBtn.addEventListener('click', runDownload);

// Keep textarea in sync with renderedMd when user edits
specTextarea.addEventListener('input', () => {
  renderedMd = specTextarea.value;
  updateDraftHint(renderedMd);
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
      currentFileKey = msg.fileKey;
      if (msg.node) {
        noSelection.style.display = 'none';
        mainArea.style.display = 'block';
        componentName.textContent = msg.node.name;
        // Reset to idle on new selection
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

    case 'apiKey': {
      apiKey = msg.value;
      apiKeyInput.value = msg.value ?? '';
      break;
    }

    case 'cacheValue': {
      resolvePendingGet(msg.key, msg.value);
      break;
    }
  }
};

// ---------------------------------------------------------------------------
// Boot — request initial selection from main thread
// ---------------------------------------------------------------------------

send({ type: 'requestSelection' });
