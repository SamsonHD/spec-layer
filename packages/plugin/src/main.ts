/// <reference types="@figma/plugin-typings" />
import { serializeNode, mainComponentRef } from './serialize';
import type { NodeResolver } from './serialize';
import type { MainToUi, UiToMain } from './messages';

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
async function postSelection(): Promise<void> {
  const fileKey = figma.fileKey ?? 'unknown';
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
figma.showUI(__html__, { width: 480, height: 640 });

// Send stored API key on startup
figma.clientStorage.getAsync('apiKey').then((value: string | undefined) => {
  const msg: MainToUi = { type: 'apiKey', value: value ?? null };
  figma.ui.postMessage(msg);
}).catch(() => {/* ignore */});

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

    case 'setApiKey':
      await figma.clientStorage.setAsync('apiKey', msg.value);
      break;

    case 'cacheGet': {
      const value: string | undefined = await figma.clientStorage.getAsync(msg.key);
      const reply: MainToUi = { type: 'cacheValue', key: msg.key, value: value ?? null };
      figma.ui.postMessage(reply);
      break;
    }

    case 'cacheSet':
      await figma.clientStorage.setAsync(msg.key, msg.value);
      break;

    case 'notify':
      figma.notify(msg.message);
      break;
  }
};
