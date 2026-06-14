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
 * Update the export-status element during a bulk export.
 *
 * When `errorMsg` is provided the status shows an error instead of progress.
 * When `index` is 0 and `total` is 0 (error path) it renders the error only.
 */
export function renderExportProgress(
  refs: Refs,
  index: number,
  total: number,
  errorMsg?: string,
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
    refs.exportStatus.textContent = `Rendering ${index} / ${total}…`;
  }
}

/**
 * Render the success state after exportAllDone fires.
 * Uses `count` (actual items rendered) which may be < total (skipped nodes).
 */
export function renderExportDone(refs: Refs, count: number, folderName: string): void {
  refs.exportStatus.style.color = '';
  refs.exportStatus.textContent =
    `Exported ${count} component${count === 1 ? '' : 's'} → ${folderName}.zip`;
}
