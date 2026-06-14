/// <reference types="@figma/plugin-typings" />
import { serializeNode, mainComponentRef } from './serialize';
import type { NodeResolver } from './serialize';
import type { MainToUi, UiToMain } from './messages';
import { effectiveFileKey } from './fileKey';

// ---------------------------------------------------------------------------
// NodeResolver — wraps async Figma APIs
// ---------------------------------------------------------------------------
const resolver: NodeResolver = {
  async variableName(id) {
    try {
      const v = await figma.variables.getVariableByIdAsync(id);
      return v?.name ?? null;
    } catch {
      return null;
    }
  },
  async styleName(id) {
    try {
      const s = await figma.getStyleByIdAsync(id);
      return s?.name ?? null;
    } catch {
      return null;
    }
  },
  async mainComponent(node) {
    try {
      const n = node as InstanceNode;
      if (typeof n.getMainComponentAsync !== 'function') return null;
      const mc = await n.getMainComponentAsync();
      if (!mc) return null;
      // When mc is a variant, its parent is a COMPONENT_SET carrying the real name/key.
      // BaseNode | null doesn't expose `.key`; narrow on type then cast to ComponentSetNode.
      const rawParent = mc.parent;
      const parent = rawParent
        ? {
            type: rawParent.type,
            name: rawParent.name,
            key: rawParent.type === 'COMPONENT_SET'
              ? (rawParent as ComponentSetNode).key
              : '',
          }
        : null;
      return mainComponentRef({ name: mc.name, key: mc.key, parent });
    } catch {
      return null;
    }
  },
};

// ---------------------------------------------------------------------------
// Find the relevant component in the current selection (walk up if needed)
// ---------------------------------------------------------------------------
function findComponent(
  selection: readonly SceneNode[],
): ComponentNode | ComponentSetNode | null {
  for (const node of selection) {
    let current: BaseNode | null = node;
    while (current) {
      if (current.type === 'COMPONENT_SET') {
        return current as ComponentSetNode;
      }
      if (current.type === 'COMPONENT') {
        const parent = (current as SceneNode).parent;
        if (parent?.type === 'COMPONENT_SET') {
          return parent as ComponentSetNode;
        }
        return current as ComponentNode;
      }
      current = (current as SceneNode).parent ?? null;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Post the current selection to the UI
// ---------------------------------------------------------------------------
// File key override — set by the UI when figma.fileKey is unavailable (dev
// plugins) or when the user explicitly wants to attach a specific Figma file.
// The main thread is the single source of truth for the effective file key;
// the UI only displays/uses what it receives.
let fileKeyOverride: string | null = null;

// Resolves once the stored override has been loaded, so postSelection never
// races ahead of clientStorage on boot.
const fileKeyOverrideReady: Promise<void> = figma.clientStorage
  .getAsync('fileKeyOverride')
  .then((value: string | undefined) => {
    fileKeyOverride = value ?? null;
  })
  .catch(() => {/* ignore */});

function postFileKeyOverride(): void {
  const msg: MainToUi = {
    type: 'fileKeyOverride',
    value: fileKeyOverride,
    effectiveFileKey: effectiveFileKey(figma.fileKey, fileKeyOverride),
  };
  figma.ui.postMessage(msg);
}

async function postSelection(): Promise<void> {
  await fileKeyOverrideReady;
  const fileKey = effectiveFileKey(figma.fileKey, fileKeyOverride);
  const component = findComponent(figma.currentPage.selection);

  if (!component) {
    figma.notify('Select a component or component set');
    const msg: MainToUi = { type: 'selection', node: null, fileKey };
    figma.ui.postMessage(msg);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const node = await serializeNode(component as any, resolver);
  const msg: MainToUi = { type: 'selection', node, fileKey };
  figma.ui.postMessage(msg);
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
figma.showUI(__html__, { width: 480, height: 640, themeColors: true });

// Send stored docs endpoint on startup
figma.clientStorage.getAsync('docsEndpoint').then((value: string | undefined) => {
  const msg: MainToUi = { type: 'docsEndpoint', value: value ?? null };
  figma.ui.postMessage(msg);
}).catch(() => {/* ignore */});

// Send stored Figma file key override (and the effective file key computed
// from it) on startup; the UI uses it for the input and display only.
fileKeyOverrideReady.then(() => { postFileKeyOverride(); });

// React to selection changes.
// Note: selectionchange does not fire on plugin open; the UI sends requestSelection on mount to get the initial selection.
figma.on('selectionchange', () => { postSelection(); });

// React to UI messages
figma.ui.onmessage = async (raw: unknown) => {
  const msg = raw as UiToMain;
  switch (msg.type) {
    case 'requestSelection':
      await postSelection();
      break;

    case 'setDocsEndpoint':
      await figma.clientStorage.setAsync('docsEndpoint', msg.value);
      break;

    case 'setFileKeyOverride':
      // Wait for the boot-time load so it cannot clobber a user-set value.
      await fileKeyOverrideReady;
      fileKeyOverride = msg.value && msg.value !== '' ? msg.value : null;
      await figma.clientStorage.setAsync('fileKeyOverride', fileKeyOverride);
      // Echo back the new effective key — the UI never derives it itself.
      postFileKeyOverride();
      break;

    case 'notify':
      figma.notify(msg.message);
      break;

    case 'openBrowser':
      figma.openExternal(msg.url);
      break;
  }
};
