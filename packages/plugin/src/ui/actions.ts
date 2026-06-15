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
import {
  showBanner,
  clearBanners,
  renderPhase,
  renderExportScanning,
  renderExportProgress,
  renderExportDone,
} from './render';
import { buildExportFiles, zipFiles } from '../exportFiles';
import type { FileKeySource } from '../fileKey';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface UiState {
  phase: UiPhase;
  currentNode: SerializedNode | null;
  currentFileKey: string;
  currentFileKeySource: FileKeySource;
  fileKeyOverride: string | null;
  currentSpec: IntermediateSpec | null;
  currentExtractedAt: string;
  renderedMd: string;
  docsEndpoint: string;
  docsToken: string;
  // Export-all accumulator
  exportItems: Array<{ name: string; markdown: string }>;
  exportFileKey: string;
  exportTotal: number;
  exportSkippedAtoms: number;
  // Count of components that failed to render in the UI (kept out of the zip).
  exportFailed: number;
}

export function createState(): UiState {
  return {
    phase: 'idle',
    currentNode: null,
    currentFileKey: '',
    currentFileKeySource: 'missing',
    fileKeyOverride: null,
    currentSpec: null,
    currentExtractedAt: '',
    renderedMd: '',
    docsEndpoint: 'http://localhost:3000',
    docsToken: '',
    exportItems: [],
    exportFileKey: '',
    exportTotal: 0,
    exportSkippedAtoms: 0,
    exportFailed: 0,
  };
}

export function docsRequestHeaders(token: string): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const trimmed = token.trim();
  if (trimmed) headers.Authorization = `Bearer ${trimmed}`;
  return headers;
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
): { name: string; markdown: string; spec: IntermediateSpec; extractedAt: string } {
  const extractedAt = new Date().toISOString();
  const spec = extract(node, { figmaFile: fileKey });
  const markdown = renderSpec(spec, { prose: null, extractedAt });
  return { name: spec.name, markdown, spec, extractedAt };
}

/** Keep extracted output aligned with the latest effective Figma file key. */
export function refreshRenderedSpecFileKey(state: UiState, fileKey: string): void {
  state.currentFileKey = fileKey;
  if (!state.currentNode || !state.currentSpec) return;

  const refreshed = renderOne(state.currentNode, fileKey);
  state.currentSpec = refreshed.spec;
  state.currentExtractedAt = refreshed.extractedAt;
  state.renderedMd = refreshed.markdown;
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

  const { name, markdown, spec, extractedAt } = renderOne(state.currentNode, state.currentFileKey);
  state.renderedMd = markdown;
  state.currentSpec = spec;
  state.currentExtractedAt = extractedAt;

  state.phase = nextStatus(state.phase, 'rendered');
  renderPhase(refs, state);

  send({ type: 'notify', message: `Spec extracted for ${name}` });
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
  state.exportSkippedAtoms = 0;
  state.exportFailed = 0;
  // Immediate feedback: the main thread's scan (loadAllPagesAsync +
  // findAllWithCriteria) runs before exportAllStart, so acknowledge the click
  // right away instead of leaving the panel silent.
  renderExportScanning(refs);
  send({ type: 'requestExportAll', includeAtoms: refs.includeAtomsInput.checked });
}

export function handleExportAllScanning(refs: Refs): void {
  renderExportScanning(refs);
}

// ---------------------------------------------------------------------------
// Export-all message handlers — called from ui.ts window.onmessage.
// ---------------------------------------------------------------------------

export function handleExportAllStart(
  refs: Refs,
  state: UiState,
  total: number,
  fileKey: string,
  skippedAtoms: number,
): void {
  state.exportTotal = total;
  state.exportFileKey = fileKey;
  state.exportSkippedAtoms = skippedAtoms;
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
  // Isolate per-component failures: one component whose extract/render throws
  // must not stall the whole stream or freeze progress at a fixed number.
  try {
    const item = renderOne(node, state.exportFileKey);
    state.exportItems.push(item);
  } catch (err) {
    state.exportFailed++;
    const m = err instanceof Error ? err.message : String(err);
    console.warn(`[export-all] failed to render "${node.name}": ${m}`);
  }
  renderExportProgress(refs, index, total, undefined, state.exportFailed);
}

export function handleExportAllDone(refs: Refs, state: UiState): void {
  // Nothing to zip (no components found, or all failed) — say so plainly
  // instead of downloading an empty/near-empty archive silently.
  if (state.exportItems.length === 0) {
    renderExportDone(refs, 0, '', state.exportFailed, state.exportSkippedAtoms);
    refs.exportAllBtn.disabled = false;
    return;
  }

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

  renderExportDone(
    refs,
    state.exportItems.length,
    folderName,
    state.exportFailed,
    state.exportSkippedAtoms,
  );
  refs.exportAllBtn.disabled = false;
}

export function handleExportAllError(refs: Refs, state: UiState, message: string): void {
  // Surface the error in the export-all status area and re-enable the button.
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
      headers: docsRequestHeaders(state.docsToken),
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
