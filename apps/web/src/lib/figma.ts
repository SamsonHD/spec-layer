/**
 * Resolve a Figma component link into a rendered preview image URL.
 *
 * Requires a Figma personal access token in FIGMA_TOKEN. Without it (or on any
 * error) the caller should degrade gracefully to the raw link — the docs still
 * work, they just won't show a live thumbnail.
 */

export interface FigmaRef {
  fileKey: string;
  nodeId: string;
}

/** Parse a figma.com URL into { fileKey, nodeId }, or null if it doesn't match. */
export function parseFigmaUrl(url: string): FigmaRef | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("figma.com")) return null;
    // /file/<key>/... or /design/<key>/...
    const m = /\/(?:file|design|proto)\/([A-Za-z0-9]+)/.exec(u.pathname);
    if (!m) return null;
    const fileKey = m[1];
    const rawNode = u.searchParams.get("node-id");
    if (!rawNode) return null;
    // node-id comes as "1-23" or "1%3A23"; the API wants "1:23"
    const nodeId = decodeURIComponent(rawNode).replace(/-/g, ":");
    return { fileKey, nodeId };
  } catch {
    return null;
  }
}

export interface FigmaPreviewResult {
  status: "ok" | "no-token" | "bad-url" | "error";
  imageUrl?: string;
  message?: string;
}

/**
 * Shared Figma Images API fetch — both getFigmaPreview and previewFromRef
 * delegate here so the token check and HTTP logic live in one place.
 */
async function fetchFigmaImages(fileKey: string, nodeId: string): Promise<FigmaPreviewResult> {
  const token = process.env.FIGMA_TOKEN;
  if (!token) return { status: "no-token", message: "Set FIGMA_TOKEN to show live previews." };

  try {
    const api = `https://api.figma.com/v1/images/${encodeURIComponent(
      fileKey,
    )}?ids=${encodeURIComponent(nodeId)}&format=png&scale=2`;
    const res = await fetch(api, {
      headers: { "X-Figma-Token": token },
      // cache previews for an hour to stay friendly with rate limits
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return { status: "error", message: `Figma API ${res.status}` };
    }
    const data = (await res.json()) as { images?: Record<string, string | null>; err?: string };
    const imageUrl = data.images?.[nodeId];
    if (!imageUrl) return { status: "error", message: data.err || "No image returned." };
    return { status: "ok", imageUrl };
  } catch (e) {
    return { status: "error", message: e instanceof Error ? e.message : "Request failed" };
  }
}

/** Resolve a Figma preview from a structured ref (fileKey + nodeId). */
export async function previewFromRef(ref: FigmaRef): Promise<FigmaPreviewResult> {
  return fetchFigmaImages(ref.fileKey, ref.nodeId);
}

/** Resolve a Figma preview from a full figma.com URL (legacy path). */
export async function getFigmaPreview(figmaUrl: string): Promise<FigmaPreviewResult> {
  const ref = parseFigmaUrl(figmaUrl);
  if (!ref) return { status: "bad-url", message: "Could not parse Figma node from URL." };
  return fetchFigmaImages(ref.fileKey, ref.nodeId);
}

export interface FigmaImagesResult {
  status: "ok" | "no-token" | "error";
  /** Map of nodeId → rendered image URL (null when Figma failed to render that id). */
  images?: Record<string, string | null>;
  message?: string;
}

/**
 * Batched image fetch — one Figma Images API call covers many node ids at once.
 * Used by the variant grid so we make a single request per component rather
 * than one per variant. Returns a map keyed by the node ids passed in.
 */
export async function getFigmaImages(fileKey: string, nodeIds: string[]): Promise<FigmaImagesResult> {
  const token = process.env.FIGMA_TOKEN;
  if (!token) return { status: "no-token", message: "Set FIGMA_TOKEN to show live previews." };
  if (!nodeIds.length) return { status: "ok", images: {} };

  try {
    const ids = nodeIds.map(encodeURIComponent).join(",");
    const api = `https://api.figma.com/v1/images/${encodeURIComponent(
      fileKey,
    )}?ids=${ids}&format=png&scale=2`;
    const res = await fetch(api, {
      headers: { "X-Figma-Token": token },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return { status: "error", message: `Figma API ${res.status}` };
    }
    const data = (await res.json()) as { images?: Record<string, string | null>; err?: string };
    if (!data.images) return { status: "error", message: data.err || "No images returned." };
    return { status: "ok", images: data.images };
  } catch (e) {
    return { status: "error", message: e instanceof Error ? e.message : "Request failed" };
  }
}
