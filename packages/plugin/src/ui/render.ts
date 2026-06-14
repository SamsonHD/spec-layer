/**
 * render.ts — view updates only. No business logic, no fetch.
 *
 * Owns: phase rendering, info/error banners, tab switching, and applying an
 * incoming selection to the DOM. All functions take the `Refs` (and the small
 * `UiState`) so there are no module globals to reach for.
 */

import type { Refs } from './dom';
import type { UiState } from './actions';

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
    refs.reviewArea.style.display = 'none';
    clearBanners(refs);
    renderPhase(refs, state);
  } else {
    refs.noSelection.style.display = 'block';
    refs.mainArea.style.display = 'none';
  }
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

export type TabId = 'selected' | 'all';

export function switchTab(refs: Refs, tab: TabId): void {
  const selected = tab === 'selected';
  refs.tabSelected.setAttribute('aria-selected', String(selected));
  refs.tabAll.setAttribute('aria-selected', String(!selected));
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
): void {
  refs.exportStatus.style.color = '';
  if (count === 0) {
    refs.exportStatus.style.color = 'var(--figma-color-bg-danger)';
    refs.exportStatus.textContent =
      failed > 0
        ? `No components exported — all ${failed} failed to render. See the console for details.`
        : 'No components found to export in this file.';
    return;
  }
  const failedNote = failed > 0 ? `, ${failed} failed` : '';
  refs.exportStatus.textContent =
    `Exported ${count} component${count === 1 ? '' : 's'}${failedNote} → ${folderName}.zip`;
}
