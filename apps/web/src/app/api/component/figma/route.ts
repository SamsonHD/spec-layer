import { NextRequest, NextResponse } from "next/server";
import { setFigmaLink } from "@/lib/content";
import { parseFigmaUrl } from "@/lib/figma";
import { isSafeSlug } from "@/lib/specApi";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { slug?: string[]; figma?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isSafeSlug(body.slug)) {
    return NextResponse.json({ error: "Missing or invalid 'slug'" }, { status: 400 });
  }

  const figma = body.figma?.trim() || null;

  // Validate when setting (not when clearing).
  if (figma && !parseFigmaUrl(figma)) {
    return NextResponse.json(
      { error: "That doesn't look like a Figma URL with a node-id." },
      { status: 400 },
    );
  }

  try {
    setFigmaLink(body.slug, figma);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not update file" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, figma });
}
