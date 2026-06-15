/**
 * render.ts — view updates only. No business logic, no fetch.
 *
 * Owns: phase rendering, info/error banners, tab switching, and applying an
 * incoming selection to the DOM. All functions take the `Refs` (and the small
 * `UiState`) so there are no module globals to reach for.
 */

import type { Refs } from './dom';
import type { UiState } from './actions';
import type { FileKeySource } from '../fileKey';
import { isAtomComponentName } from '../collectComponents';

// ---------------------------------------------------------------------------
// Banners
// ---------------------------------------------------------------------------

export function showBanner(refs: Refs, type: 'info' | 'error' | null, text: string): void {
  refs.bannerInfo.style.display = type === 'info' ? 'block' : 'none';
  refs.bannerError.style.display = type === 'error' ? 'block' : 'none';
  if (type === 'info') refs.bannerInfo.textContent = text;
  if (type === 'error') refs.bannerError.textContent = text;
}

export function clearBanners(refs: Refs): void {
  showBanner(refs, null, '');
}

// ---------------------------------------------------------------------------
// Phase rendering
// ---------------------------------------------------------------------------

export function renderPhase(refs: Refs, state: UiState): void {
  refs.phaseLabel.textContent = state.phase === 'extracting' ? 'extracting…' : '';
  refs.extractBtn.disabled = state.phase === 'extracting';

  const hasSpec = state.currentSpec !== null;
  refs.reviewArea.style.display = hasSpec ? 'block' : 'none';
  refs.sendBtn.disabled = state.phase === 'extracting';

  if (state.renderedMd) {
    refs.specTextarea.value = state.renderedMd;
  }
}

// ---------------------------------------------------------------------------
// Selection — apply an incoming selection to the DOM
// ---------------------------------------------------------------------------

export function renderSelection(refs: Refs, state: UiState): void {
  if (state.currentNode) {
    refs.noSelection.style.display = 'none';
    refs.mainArea.style.display = 'block';
    refs.componentName.textContent = state.currentNode.name;
    refs.atomNotice.style.display = isAtomComponentName(state.currentNode.name) ? 'block' : 'none';
    refs.reviewArea.style.display = 'none';
    clearBanners(refs);
    renderPhase(refs, state);
  } else {
    refs.noSelection.style.display = 'block';
    refs.mainArea.style.display = 'none';
    refs.atomNotice.style.display = 'none';
  }
}

export function renderFigmaConnection(
  refs: Refs,
  source: FileKeySource,
  fileKey: string,
  override: string | null,
): void {
  refs.fileKeyStatus.className = `figma-source ${source}`;
  refs.fileKeyField.style.display = source === 'figma' ? 'none' : 'block';

  if (source === 'figma') {
    refs.fileKeyStatusTitle.textContent = 'Connected automatically';
    refs.fileKeyStatusDetail.textContent = 'The current Figma file will be included with every spec you send.';
    refs.fileKeyInput.value = '';
    refs.fileKeyHint.textContent = '';
    return;
  }

  if (source === 'override') {
    refs.fileKeyStatusTitle.textContent = 'Connected with a pasted file';
    refs.fileKeyStatusDetail.textContent = `Using ${fileKey}. New exports will include this source.`;
    refs.fileKeyLabel.textContent = 'Change Figma file URL or key';
    refs.fileKeyInput.value = override ?? fileKey;
    refs.fileKeyHint.textContent = 'Saved for this plugin until you remove it.';
    return;
  }

  refs.fileKeyStatusTitle.textContent = 'Figma file not detected';
  refs.fileKeyStatusDetail.textContent = 'Paste this file\'s URL once so previews work after import.';
  refs.fileKeyLabel.textContent = 'Figma file URL';
  refs.fileKeyInput.value = '';
  refs.fileKeyHint.textContent = '';
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

export type TabId = 'selected' | 'all';

export function switchTab(refs: Refs, tab: TabId): void {
  const selected = tab === 'selected';
  refs.tabSelected.setAttribute('aria-selected', String(selected));
  refs.tabAll.setAttribute('aria-selected', String(!selected));
  refs.tabSelected.tabIndex = selected ? 0 : -1;
  refs.tabAll.tabIndex = selected ? -1 : 0;
  refs.panelSelected.classList.toggle('active', selected);
  refs.panelAll.classList.toggle('active', !selected);
}

// ---------------------------------------------------------------------------
// Export-all progress + completion
// ---------------------------------------------------------------------------

/**
 * Show the enumeration phase, which on the main thread runs before any
 * progress count is known (loadAllPagesAsync + findAllWithCriteria). Without
 * this the panel would sit empty during a potentially long scan on large files.
 */
export function renderExportScanning(refs: Refs): void {
  refs.exportStatus.style.color = '';
  refs.exportStatus.textContent = 'Scanning the file for components… (large files can take a while)';
}

/**
 * Update the export-status element during a bulk export.
 *
 * When `errorMsg` is provided the status shows an error instead of progress.
 * `failed` (optional) appends a "(N failed)" note while progress streams.
 */
export function renderExportProgress(
  refs: Refs,
  index: number,
  total: number,
  errorMsg?: string,
  failed = 0,
): void {
  if (errorMsg) {
    refs.exportStatus.style.color = 'var(--figma-color-bg-danger)';
    refs.exportStatus.textContent = `Export failed: ${errorMsg}`;
    return;
  }
  refs.exportStatus.style.color = '';
  if (total === 0) {
    refs.exportStatus.textContent = 'Starting export…';
  } else {
    const failedNote = failed > 0 ? ` (${failed} failed)` : '';
    refs.exportStatus.textContent = `Rendering ${index} / ${total}…${failedNote}`;
  }
}

/**
 * Render the success state after exportAllDone fires.
 * Uses `count` (actual items zipped) which may be < total (skipped/failed
 * nodes). `failed` (optional) is reported so silent drops are visible.
 */
export function renderExportDone(
  refs: Refs,
  count: number,
  folderName: string,
  failed = 0,
  skippedAtoms = 0,
): void {
  refs.exportStatus.style.color = '';
  if (count === 0) {
    if (skippedAtoms > 0 && failed === 0) {
      refs.exportStatus.textContent = exportDoneMessage(count, folderName, failed, skippedAtoms);
      return;
    }
    refs.exportStatus.style.color = 'var(--figma-color-bg-danger)';
    refs.exportStatus.textContent =
      failed > 0
        ? `No components exported — all ${failed} failed to render. See the console for details.`
        : 'No components found to export in this file.';
    return;
  }
  refs.exportStatus.textContent = exportDoneMessage(count, folderName, failed, skippedAtoms);
}

export function exportDoneMessage(
  count: number,
  folderName: string,
  failed = 0,
  skippedAtoms = 0,
): string {
  if (count === 0 && skippedAtoms > 0 && failed === 0) {
    return `No standard components found. Skipped ${skippedAtoms} atom component${skippedAtoms === 1 ? '' : 's'}; enable Include atom components to export them.`;
  }
  const failedNote = failed > 0 ? `, ${failed} failed` : '';
  const atomNote = skippedAtoms > 0
    ? `, skipped ${skippedAtoms} atom component${skippedAtoms === 1 ? '' : 's'}`
    : '';
  return `Exported ${count} component${count === 1 ? '' : 's'}${failedNote}${atomNote} → ${folderName}.zip`;
}
