import { NextRequest, NextResponse } from "next/server";
import { getFigmaPreview, previewFromRef } from "@/lib/figma";

export const dynamic = "force-dynamic";

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
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const fileKey = searchParams.get("fileKey");
  const nodeId = searchParams.get("nodeId");
  if (fileKey && nodeId) {
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
