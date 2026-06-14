/**
 * ui.ts — thin entry point for the plugin iframe.
 *
 * Responsibilities only: mount the DOM, build the UI state, wire DOM events to
 * the action handlers, run the window.onmessage switch (delegating to
 * render/actions), and boot by requesting the initial selection.
 *
 * All markup/styles live in dom.ts, all logic in actions.ts, all view updates
 * in render.ts.
 */

import type { MainToUi } from '../messages';
import { mount } from './dom';
import { parseFigmaFileKey } from './fileKey';
import {
  createState,
  send,
  runExtract,
  runDownload,
  runSendToDocs,
  runExportAll,
  handleExportAllStart,
  handleExportComponent,
  handleExportAllDone,
  handleExportAllError,
} from './actions';
import {
  renderSelection,
  switchTab,
  clearBanners,
} from './render';

// ---------------------------------------------------------------------------
// Mount + state
// ---------------------------------------------------------------------------

const refs = mount();
const state = createState();

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

refs.tabSelected.addEventListener('click', () => switchTab(refs, 'selected'));
refs.tabAll.addEventListener('click', () => switchTab(refs, 'all'));

// ---------------------------------------------------------------------------
// Action buttons
// ---------------------------------------------------------------------------

refs.extractBtn.addEventListener('click', () => {
  runExtract(refs, state).catch(() => { /* handled inside */ });
});
refs.downloadBtn.addEventListener('click', () => runDownload(refs, state));
refs.sendBtn.addEventListener('click', () => {
  runSendToDocs(refs, state).catch(() => { /* handled inside */ });
});

// Keep state.renderedMd in sync with user edits to the preview.
refs.specTextarea.addEventListener('input', () => {
  state.renderedMd = refs.specTextarea.value;
});

// ---------------------------------------------------------------------------
// Export-all panel
// ---------------------------------------------------------------------------

refs.exportAllBtn.addEventListener('click', () => runExportAll(refs, state));

// ---------------------------------------------------------------------------
// Optional docs-platform inputs (endpoint + file key override)
// ---------------------------------------------------------------------------

refs.endpointInput.addEventListener('change', () => {
  state.docsEndpoint = refs.endpointInput.value.trim() || 'http://localhost:3000';
  send({ type: 'setDocsEndpoint', value: state.docsEndpoint });
});

refs.fileKeyInput.addEventListener('change', () => {
  const raw = refs.fileKeyInput.value.trim();
  if (!raw) {
    refs.fileKeyHint.textContent = '';
    send({ type: 'setFileKeyOverride', value: null });
    return;
  }
  const parsed = parseFigmaFileKey(raw);
  if (!parsed) {
    refs.fileKeyHint.textContent = 'Could not detect a file key — paste the full Figma URL.';
    return;
  }
  // Main is the single authority: it stores the override, recomputes the
  // effective key, and echoes both back via a 'fileKeyOverride' message.
  send({ type: 'setFileKeyOverride', value: parsed });
});

// ---------------------------------------------------------------------------
// Message handling
// ---------------------------------------------------------------------------

window.onmessage = (event: MessageEvent) => {
  const msg = event.data?.pluginMessage as MainToUi | undefined;
  if (!msg) return;

  switch (msg.type) {
    case 'selection': {
      state.currentNode = msg.node;
      // msg.fileKey is already the effective key computed by main.
      state.currentFileKey = msg.fileKey;
      state.currentSpec = null;
      state.currentExtractedAt = '';
      state.phase = 'idle';
      state.renderedMd = '';
      renderSelection(refs, state);
      break;
    }

    case 'docsEndpoint': {
      state.docsEndpoint = msg.value ?? 'http://localhost:3000';
      refs.endpointInput.value = state.docsEndpoint;
      break;
    }

    case 'fileKeyOverride': {
      // Main is the single authority; it sends both the stored override
      // (for the input) and the computed effective key (for display/use).
      state.currentFileKey = msg.effectiveFileKey;
      if (msg.value) {
        refs.fileKeyInput.value = msg.value;
        refs.fileKeyHint.textContent = `Using file key ${msg.effectiveFileKey}`;
      } else {
        refs.fileKeyInput.value = '';
        refs.fileKeyHint.textContent = '';
      }
      break;
    }

    case 'exportAllStart': {
      handleExportAllStart(refs, state, msg.total, msg.fileKey);
      break;
    }

    case 'exportComponent': {
      handleExportComponent(refs, state, msg.node, msg.index, msg.total);
      break;
    }

    case 'exportAllDone': {
      handleExportAllDone(refs, state);
      break;
    }

    case 'exportAllError': {
      handleExportAllError(refs, state, msg.message);
      break;
    }
  }
};

// ---------------------------------------------------------------------------
// Boot — request initial selection from the main thread
// ---------------------------------------------------------------------------

clearBanners(refs);
send({ type: 'requestSelection' });
