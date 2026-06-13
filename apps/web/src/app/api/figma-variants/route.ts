import { NextRequest, NextResponse } from "next/server";
import { getFigmaImages } from "@/lib/figma";

export const dynamic = "force-dynamic";

/**
 * GET /api/figma-variants?fileKey=<key>&ids=<id1,id2,...>
 *
 * Batched Figma image fetch. Returns a map of nodeId -> imageUrl (or null when
 * Figma could not render that id). The variant grid in the Specs tab uses this
 * to load every variant image with a single API call.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const fileKey = searchParams.get("fileKey");
  const rawIds = searchParams.get("ids");

  if (!fileKey || !rawIds) {
    return NextResponse.json(
      { status: "error", message: "Provide ?fileKey= and ?ids=." },
      { status: 400 },
    );
  }
  const ids = rawIds
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  if (!ids.length) {
    return NextResponse.json({ status: "ok", images: {} });
  }
  if (ids.length > 200) {
    return NextResponse.json(
      { status: "error", message: "Too many ids (max 200)." },
      { status: 400 },
    );
  }

  const result = await getFigmaImages(fileKey, ids);
  return NextResponse.json(result);
}
