/**
 * actions.ts — the action handlers (runExtract / runDownload / runSendToDocs /
 * runExportAll + export-message handlers) plus the module-scoped UI state.
 *
 * Logic only — DOM reads/writes that are view concerns live in render.ts; these
 * handlers call into render for banners/phase updates. The `canSendToDocs`
 * guard, `fileKeyOverride` plumbing, and endpoint handling are preserved
 * exactly from the original monolithic ui.ts.
 */

import { extract, renderSpec, contentHash } from '@spec-layer/extractor';
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
  showInlineFileKeyPrompt,
  renderSyncScanning,
  renderSyncProgress,
  renderSyncPosting,
  renderSyncResult,
  renderSyncMessage,
  renderDocStatusChip,
  hideDocStatusChip,
  type DocStatusChipState,
} from './render';
import { buildExportFiles, zipFiles, type ExportItem } from '../exportFiles';
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
  // Export-all accumulator. Carries the structured `spec` (not just markdown)
  // so the zip can emit the `.spec-data` sidecars that power the docs variant
  // grid — matching what "Send to docs" persists.
  exportItems: ExportItem[];
  exportFileKey: string;
  exportTotal: number;
  exportSkippedAtoms: number;
  // Count of components that failed to render in the UI (kept out of the zip).
  exportFailed: number;
  // Bulk mode — the Export-all scan is reused for "Check library sync".
  // 'export' → build a zip; 'sync' → fingerprint + POST to /api/sync/check.
  bulkMode: 'export' | 'sync';
  // Sync accumulator — fingerprints of every keyed component in the file.
  syncItems: SyncFingerprint[];
}

/** Per-component fingerprint sent to /api/sync/check. */
export interface SyncFingerprint {
  figmaKey: string;
  figmaNode: string;
  name: string;
  contentHash: string;
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
    exportItems: [],
    exportFileKey: '',
    exportTotal: 0,
    exportSkippedAtoms: 0,
    exportFailed: 0,
    bulkMode: 'export',
    syncItems: [],
  };
}

// ---------------------------------------------------------------------------
// fingerprintNode — pure helper: extract a node's content fingerprint for the
// drift check. Returns null for components with no stable Figma key (which
// cannot be matched against a saved spec).
// ---------------------------------------------------------------------------

export function fingerprintNode(node: SerializedNode, fileKey: string): SyncFingerprint | null {
  const spec = extract(node, { figmaFile: fileKey });
  if (!spec.figmaKey) return null; // unmatchable
  return {
    figmaKey: spec.figmaKey,
    figmaNode: spec.figmaNode,
    name: spec.name,
    contentHash: contentHash(spec),
  };
}

// ---------------------------------------------------------------------------
// Sync summary formatting — pure: turn a /api/sync/check summary into the
// urgency-ordered status lines (per the UX Specification).
// ---------------------------------------------------------------------------

export interface SyncCheckSummary {
  inSync: number;
  drifted: number;
  missingInFigma: number;
  newInFigma: number;
}

/** Total saved specs that were evaluated for this file. */
export function checkedSpecCount(summary: SyncCheckSummary): number {
  return summary.inSync + summary.drifted + summary.missingInFigma;
}

/**
 * Format the mixed-result summary lines (icon + count), urgency order. Lines
 * with a zero count are omitted; the trailing "Checked against N saved specs."
 * line is always present.
 */
export function formatSyncSummaryLines(summary: SyncCheckSummary): string[] {
  const lines: string[] = [];
  if (summary.drifted > 0) lines.push(`⚠ ${summary.drifted} out of date`);
  if (summary.missingInFigma > 0) lines.push(`⊘ ${summary.missingInFigma} not found in Figma`);
  if (summary.inSync > 0) lines.push(`✓ ${summary.inSync} in sync`);
  if (summary.newInFigma > 0) lines.push(`＋ ${summary.newInFigma} in Figma aren't documented`);
  lines.push(`Checked against ${checkedSpecCount(summary)} saved specs.`);
  return lines;
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

  // Best-effort doc-status chip — never throws out of runExtract.
  await runSelectionStatus(refs, state);
}

// ---------------------------------------------------------------------------
// Selection doc-status chip — POST the extracted spec's identity to
// /api/sync/lookup and render the chip. Strictly best-effort: any failure,
// missing file key, or missing figmaKey degrades to "unavailable" (never an
// error banner, never a throw).
// ---------------------------------------------------------------------------

export async function runSelectionStatus(refs: Refs, state: UiState): Promise<void> {
  try {
    const spec = state.currentSpec;
    if (!spec || !spec.figmaKey || !state.currentFileKey) {
      hideDocStatusChip(refs);
      return;
    }
    const guard = canSendToDocs(state.currentFileKey);
    if (!guard.allowed) {
      hideDocStatusChip(refs);
      return;
    }

    const base = state.docsEndpoint.replace(/\/+$/, '');
    const res = await window.fetch(`${base}/api/sync/lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ figmaKey: spec.figmaKey, contentHash: contentHash(spec) }),
    });
    if (!res.ok) {
      renderDocStatusChip(refs, 'unavailable');
      return;
    }
    const data = (await res.json()) as { status: 'in-sync' | 'drifted' | 'absent'; slug?: string };
    const chipState: DocStatusChipState =
      data.status === 'in-sync' ? 'in-sync'
      : data.status === 'drifted' ? 'drifted'
      : data.status === 'absent' ? 'absent'
      : 'unavailable';
    renderDocStatusChip(refs, chipState);
  } catch {
    // Degrade silently — the chip is additive, never blocking.
    renderDocStatusChip(refs, 'unavailable');
  }
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

export function handleExportAllScanning(refs: Refs, state: UiState): void {
  if (state.bulkMode === 'sync') {
    renderSyncScanning(refs);
    return;
  }
  renderExportScanning(refs);
}

// ---------------------------------------------------------------------------
// Check library sync — reuses the Export-all whole-file scan, branching on
// state.bulkMode. No main.ts / messages.ts changes: the same bulk stream is
// driven, but each node is fingerprinted (not rendered to a zip).
// ---------------------------------------------------------------------------

export function runCheckSync(refs: Refs, state: UiState): void {
  refs.checkSyncBtn.disabled = true;
  // Reset accumulators shared with the export flow + the sync items.
  state.exportItems = [];
  state.exportFileKey = '';
  state.exportTotal = 0;
  state.exportSkippedAtoms = 0;
  state.exportFailed = 0;
  state.syncItems = [];
  state.bulkMode = 'sync';
  renderSyncScanning(refs);
  // Reuse the existing scan; atoms can be saved specs so include them.
  send({ type: 'requestExportAll', includeAtoms: true });
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
  if (state.bulkMode === 'sync') {
    try {
      const fp = fingerprintNode(node, state.exportFileKey);
      if (fp) state.syncItems.push(fp); // skip keyless / unmatchable nodes
    } catch (err) {
      state.exportFailed++;
      const m = err instanceof Error ? err.message : String(err);
      console.warn(`[check-sync] failed to fingerprint "${node.name}": ${m}`);
    }
    renderSyncProgress(refs, index, total);
    return;
  }

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
  if (state.bulkMode === 'sync') {
    void handleCheckSyncDone(refs, state);
    return;
  }

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

/**
 * Sync completion: POST the fingerprints to /api/sync/check and render the
 * result summary. Best-effort and additive — every failure end state degrades
 * to a status line, never an error that blocks the panel.
 */
async function handleCheckSyncDone(refs: Refs, state: UiState): Promise<void> {
  try {
    // No effective file key → reuse the inline file-key prompt path.
    const guard = canSendToDocs(state.exportFileKey);
    if (!guard.allowed) {
      renderSyncMessage(
        refs,
        guard.reason ?? 'No Figma file detected — set the file URL in Settings to check sync.',
        true,
      );
      return;
    }

    // No keyed components → nothing the library could match against.
    if (state.syncItems.length === 0) {
      renderSyncMessage(
        refs,
        'No saved specs match this Figma file yet. Export some components first.',
      );
      return;
    }

    const base = state.docsEndpoint.replace(/\/+$/, '');
    renderSyncPosting(refs);

    const res = await window.fetch(`${base}/api/sync/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileKey: state.exportFileKey, components: state.syncItems }),
    });

    if (!res.ok) {
      renderSyncMessage(
        refs,
        `Couldn't reach your docs app at ${base} (${res.status}). Check it's running and the Docs URL in Settings.`,
        true,
      );
      return;
    }

    const data = (await res.json()) as {
      ok: boolean;
      fileKey: string;
      summary: SyncCheckSummary;
    };
    const summary = data.summary;

    renderSyncResult(refs, summary, base);
    const total = checkedSpecCount(summary);
    const note =
      summary.drifted + summary.missingInFigma > 0
        ? `${summary.drifted + summary.missingInFigma} of ${total} specs need attention`
        : `All ${total} specs are up to date`;
    send({ type: 'notify', message: `Library sync checked: ${note}.` });
    send({ type: 'openBrowser', url: `${base}/sync` });
  } catch (err) {
    const base = state.docsEndpoint.replace(/\/+$/, '');
    const msg = err instanceof Error ? err.message : String(err);
    renderSyncMessage(
      refs,
      `Couldn't reach your docs app at ${base}. Check it's running and the Docs URL in Settings. (${msg})`,
      true,
    );
  } finally {
    state.bulkMode = 'export';
    refs.checkSyncBtn.disabled = false;
  }
}

export function handleExportAllError(refs: Refs, state: UiState, message: string): void {
  if (state.bulkMode === 'sync') {
    renderSyncMessage(refs, `Sync check failed: ${message}`, true);
    state.bulkMode = 'export';
    refs.checkSyncBtn.disabled = false;
    return;
  }
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
    showBanner(refs, 'error', guard.reason ?? 'No Figma file detected — paste the file URL below.');
    showInlineFileKeyPrompt(refs, true);
    refs.inlineFileKeyInput.focus();
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
