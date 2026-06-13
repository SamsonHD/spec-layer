import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getContentDir } from "@/lib/config";
import { corsHeaders, isSafeSlug } from "@/lib/specApi";
import { docSidecar, folderSidecar, isInsideContent } from "@/lib/navFs";
import { readNavOrder, writeNavOrder, removeChild, deletePrefix } from "@/lib/navOrder";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface DeleteBody {
  slug?: string[];
  type?: "folder" | "doc";
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);

  let body: DeleteBody;
  try {
    body = (await req.json()) as DeleteBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  if (!isSafeSlug(body.slug)) {
    return NextResponse.json({ error: "Missing or invalid 'slug'" }, { status: 400, headers });
  }
  if (body.type !== "folder" && body.type !== "doc") {
    return NextResponse.json({ error: "Invalid 'type'" }, { status: 400, headers });
  }

  const contentDir = getContentDir();
  const slug = body.slug;
  const parent = slug.slice(0, -1);
  const seg = slug[slug.length - 1];
  const order = readNavOrder(contentDir);

  try {
    if (body.type === "doc") {
      const filePath = path.join(contentDir, ...slug) + ".md";
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "Page not found" }, { status: 404, headers });
      }
      fs.rmSync(filePath, { force: true });
      const side = docSidecar(contentDir, slug);
      if (fs.existsSync(side)) fs.rmSync(side, { force: true });
      removeChild(order, parent, seg);
    } else {
      const dir = path.join(contentDir, ...slug);
      // Hard guard before a recursive delete: must resolve strictly inside the
      // content dir (isSafeSlug already blocks traversal, this is belt-and-braces).
      if (!isInsideContent(contentDir, dir)) {
        return NextResponse.json({ error: "Refusing to delete outside the content folder" }, { status: 400, headers });
      }
      if (!fs.existsSync(dir)) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404, headers });
      }
      fs.rmSync(dir, { recursive: true, force: true });
      const side = folderSidecar(contentDir, slug);
      if (fs.existsSync(side)) fs.rmSync(side, { recursive: true, force: true });
      removeChild(order, parent, seg);
      deletePrefix(order, slug);
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete" },
      { status: 500, headers },
    );
  }

  writeNavOrder(contentDir, order);
  return NextResponse.json({ ok: true }, { headers });
}
