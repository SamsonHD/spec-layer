/**
 * actions.ts — the action handlers (runExtract / runDownload / runSendToDocs /
 * runExportAll + export-message handlers) plus the module-scoped UI state.
 *
 * Logic only — DOM reads/writes that are view concerns live in render.ts; these
 * handlers call into render for banners/phase updates. The `canSendToDocs`
 * guard, `fileKeyOverride` plumbing, and endpoint handling are preserved
 * exactly from the original monolithic ui.ts.
 */

import { extract, renderSpec } from '@spec-layer/extractor';
import type { SerializedNode, IntermediateSpec } from '@spec-layer/extractor';
import type { UiToMain } from '../messages';
import { nextStatus, resetToIdle, toKebab, type UiPhase } from './state';
import { canSendToDocs } from './sendGuard';
import type { Refs } from './dom';
import { showBanner, clearBanners, renderPhase, renderExportProgress, renderExportDone } from './render';
import { buildExportFiles, zipFiles } from '../exportFiles';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface UiState {
  phase: UiPhase;
  currentNode: SerializedNode | null;
  currentFileKey: string;
  currentSpec: IntermediateSpec | null;
  currentExtractedAt: string;
  renderedMd: string;
  docsEndpoint: string;
  // Export-all accumulator
  exportItems: Array<{ name: string; markdown: string }>;
  exportFileKey: string;
  exportTotal: number;
}

export function createState(): UiState {
  return {
    phase: 'idle',
    currentNode: null,
    currentFileKey: '',
    currentSpec: null,
    currentExtractedAt: '',
    renderedMd: '',
    docsEndpoint: 'http://localhost:3000',
    exportItems: [],
    exportFileKey: '',
    exportTotal: 0,
  };
}

// ---------------------------------------------------------------------------
// Message helper
// ---------------------------------------------------------------------------

export function send(msg: UiToMain): void {
  parent.postMessage({ pluginMessage: msg }, '*');
}

// ---------------------------------------------------------------------------
// renderOne — shared extraction helper (used by runExtract and runExportAll).
// ---------------------------------------------------------------------------

export function renderOne(
  node: SerializedNode,
  fileKey: string,
): { name: string; markdown: string } {
  const extractedAt = new Date().toISOString();
  const spec = extract(node, { figmaFile: fileKey });
  const markdown = renderSpec(spec, { prose: null, extractedAt });
  return { name: spec.name, markdown };
}

// ---------------------------------------------------------------------------
// Extract — pure extractor pipeline; preview rendered into the textarea.
// ---------------------------------------------------------------------------

export async function runExtract(refs: Refs, state: UiState): Promise<void> {
  if (!state.currentNode) return;

  clearBanners(refs);
  state.phase = resetToIdle();
  state.phase = nextStatus(state.phase, 'selected');
  renderPhase(refs, state);

  const extractedAt = new Date().toISOString();
  const spec = extract(state.currentNode, { figmaFile: state.currentFileKey });
  state.renderedMd = renderSpec(spec, { prose: null, extractedAt });

  state.currentSpec = spec;
  state.currentExtractedAt = extractedAt;

  state.phase = nextStatus(state.phase, 'rendered');
  renderPhase(refs, state);

  send({ type: 'notify', message: `Spec extracted for ${spec.name}` });
}

// ---------------------------------------------------------------------------
// Export all — initiates a bulk export via the main thread.
// ---------------------------------------------------------------------------

export function runExportAll(refs: Refs, state: UiState): void {
  // Guard against double-runs.
  refs.exportAllBtn.disabled = true;
  // Reset accumulator.
  state.exportItems = [];
  state.exportFileKey = '';
  state.exportTotal = 0;
  send({ type: 'requestExportAll' });
}

// ---------------------------------------------------------------------------
// Export-all message handlers — called from ui.ts window.onmessage.
// ---------------------------------------------------------------------------

export function handleExportAllStart(
  refs: Refs,
  state: UiState,
  total: number,
  fileKey: string,
): void {
  state.exportTotal = total;
  state.exportFileKey = fileKey;
  state.exportItems = [];
  renderExportProgress(refs, 0, total);
}

export function handleExportComponent(
  refs: Refs,
  state: UiState,
  node: SerializedNode,
  index: number,
  total: number,
): void {
  const item = renderOne(node, state.exportFileKey);
  state.exportItems.push(item);
  renderExportProgress(refs, index, total);
}

export function handleExportAllDone(refs: Refs, state: UiState): void {
  const folderName = (refs.folderInput.value.trim() || 'design-system')
    .replace(/[^a-z0-9-_]/gi, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '') || 'design-system';

  const files = buildExportFiles(state.exportItems, folderName);
  const zipped = zipFiles(files);
  // Copy into a plain ArrayBuffer to satisfy Blob constructor typings when
  // fflate's result carries ArrayBufferLike (may include SharedArrayBuffer).
  const zipBuffer: ArrayBuffer = zipped.buffer instanceof ArrayBuffer
    ? zipped.buffer.slice(zipped.byteOffset, zipped.byteOffset + zipped.byteLength) as ArrayBuffer
    : new Uint8Array(zipped).buffer as ArrayBuffer;
  const blob = new Blob([zipBuffer], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}.zip`;
  a.click();
  URL.revokeObjectURL(url);

  renderExportDone(refs, state.exportItems.length, folderName);
  refs.exportAllBtn.disabled = false;
}

export function handleExportAllError(refs: Refs, state: UiState, message: string): void {
  // Show error in the export-all banner (reuse the shared bannerError element
  // from the "selected" panel is not appropriate here — the Export-all panel
  // has its own status area; renderExportDone/Progress use it too).
  renderExportProgress(refs, 0, 0, message);
  refs.exportAllBtn.disabled = false;
}

// ---------------------------------------------------------------------------
// Download — local Blob; works with no docs endpoint and no network.
// ---------------------------------------------------------------------------

export function runDownload(refs: Refs, state: UiState): void {
  const content = refs.specTextarea.value;
  const name = state.currentNode?.name ?? 'component';
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
// Send to docs — optional, guarded by canSendToDocs + a real file key.
// ---------------------------------------------------------------------------

export async function runSendToDocs(refs: Refs, state: UiState): Promise<void> {
  if (!state.currentSpec) return;

  // Guard: figma.fileKey is the only automatic source for the file key.
  // When the file is unsaved/dev or detection failed, effectiveFileKey returns
  // the sentinel "unknown". There is no API to fabricate a share link without a
  // real key, so we block the send and prompt the user to paste the URL instead.
  const guard = canSendToDocs(state.currentFileKey);
  if (!guard.allowed) {
    showBanner(refs, 'error', guard.reason ?? 'No Figma file key — paste the file URL above.');
    refs.docsDisclosure.open = true;
    refs.fileKeyInput.focus();
    return;
  }

  const base = state.docsEndpoint.replace(/\/+$/, '');
  const url = `${base}/api/specs/import`;

  showBanner(refs, 'info', 'Sending to docs…');
  refs.sendBtn.disabled = true;

  try {
    const res = await window.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spec: state.currentSpec, extractedAt: state.currentExtractedAt }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      showBanner(refs, 'error', `Send failed (${res.status}): ${text}`);
      return;
    }

    const data = await res.json() as { ok: boolean; path?: string; slug?: string; warning?: string };
    state.phase = nextStatus(state.phase, 'sent');
    renderPhase(refs, state);

    const slug = data.slug ?? '';
    const successMsg = slug ? `Sent → _inbox/${slug}` : 'Sent to docs.';
    showBanner(refs, 'info', successMsg + (data.warning ? `  ⚠ ${data.warning}` : ''));
    send({ type: 'notify', message: `Spec sent: ${state.currentSpec.name}` });

    const browserUrl = slug
      ? `${base}/components/_inbox/${slug}`
      : `${base}/inbox`;
    send({ type: 'openBrowser', url: browserUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    showBanner(refs, 'error', `Send failed: ${msg}`);
  } finally {
    refs.sendBtn.disabled = false;
  }
}
