import { NextRequest, NextResponse } from "next/server";
import { getFigmaPreview, previewFromRef } from "@/lib/figma";

export const dynamic = "force-dynamic";

/** Sentinel produced by the plugin when figma.fileKey is unavailable. */
const UNKNOWN_FILE_KEY = "unknown";

/**
 * GET /api/figma-preview
 *
 * Accepts either:
 *   ?url=<figma-url>              (legacy — parses fileKey + nodeId from the URL)
 *   ?fileKey=<key>&nodeId=<id>   (preferred — used by spec-layer figmaRef)
 *
 * Returns FigmaPreviewResult JSON with caching headers preserved by Next.js
 * route caching (force-dynamic keeps the outer route fresh; the underlying
 * fetch inside figma.ts uses next.revalidate: 3600).
 *
 * Short-circuits with a "no-source" status (not an error) when the file key is
 * the "unknown" sentinel — this prevents a misleading Figma API 404 from being
 * surfaced to the user when they simply never attached a Figma link.
 * Genuine failures for *provided* keys still return { status: "error", ... }.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const fileKey = searchParams.get("fileKey");
  const nodeId = searchParams.get("nodeId");
  if (fileKey && nodeId) {
    // Guard: never call the Figma API for the "unknown" sentinel key.
    if (fileKey === UNKNOWN_FILE_KEY) {
      return NextResponse.json({
        status: "no-source",
        message: "No Figma source linked — add one in the component settings.",
      });
    }
    const result = await previewFromRef({ fileKey, nodeId });
    return NextResponse.json(result);
  }

  const url = searchParams.get("url");
  if (url) {
    const result = await getFigmaPreview(url);
    return NextResponse.json(result);
  }

  return NextResponse.json(
    { status: "bad-url", message: "Provide ?url= or ?fileKey=&nodeId=." },
    { status: 400 },
  );
}
