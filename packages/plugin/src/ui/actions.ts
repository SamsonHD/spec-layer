/**
 * actions.ts — the action handlers (runExtract / runDownload / runSendToDocs)
 * plus the module-scoped UI state they read and mutate.
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
import { showBanner, clearBanners, renderPhase } from './render';

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
  };
}

// ---------------------------------------------------------------------------
// Message helper
// ---------------------------------------------------------------------------

export function send(msg: UiToMain): void {
  parent.postMessage({ pluginMessage: msg }, '*');
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
