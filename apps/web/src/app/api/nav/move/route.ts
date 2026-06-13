import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getContentDir } from "@/lib/config";
import { corsHeaders, isSafeSlug } from "@/lib/specApi";
import { docSidecar, folderSidecar, isSafeParent } from "@/lib/navFs";
import { readNavOrder, writeNavOrder, removeChild, addChild, rekeyPrefix, orderKey } from "@/lib/navOrder";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface MoveBody {
  slug?: string[];
  type?: "folder" | "doc";
  toParent?: string[];
  index?: number;
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);

  let body: MoveBody;
  try {
    body = (await req.json()) as MoveBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  if (!isSafeSlug(body.slug)) {
    return NextResponse.json({ error: "Missing or invalid 'slug'" }, { status: 400, headers });
  }
  if (body.type !== "folder" && body.type !== "doc") {
    return NextResponse.json({ error: "Invalid 'type'" }, { status: 400, headers });
  }
  const toParent = body.toParent ?? [];
  if (!isSafeParent(toParent)) {
    return NextResponse.json({ error: "Invalid 'toParent'" }, { status: 400, headers });
  }

  const contentDir = getContentDir();
  const slug = body.slug;
  const fromParent = slug.slice(0, -1);
  const seg = slug[slug.length - 1];
  const newSlug = [...toParent, seg];

  // Same parent → nothing to move (reorder handles ordering).
  if (orderKey(fromParent) === orderKey(toParent)) {
    return NextResponse.json({ ok: true, slug }, { headers });
  }
  // Can't move a folder into itself or one of its descendants.
  if (
    body.type === "folder" &&
    (orderKey(toParent) === orderKey(slug) || orderKey(toParent).startsWith(orderKey(slug) + "/"))
  ) {
    return NextResponse.json({ error: "Cannot move a folder into itself" }, { status: 400, headers });
  }

  const order = readNavOrder(contentDir);

  try {
    if (body.type === "doc") {
      const fromPath = path.join(contentDir, ...slug) + ".md";
      const toPath = path.join(contentDir, ...newSlug) + ".md";
      if (!fs.existsSync(fromPath)) {
        return NextResponse.json({ error: "Page not found" }, { status: 404, headers });
      }
      if (fs.existsSync(toPath)) {
        return NextResponse.json({ error: "A page with that name already exists there" }, { status: 409, headers });
      }
      fs.mkdirSync(path.dirname(toPath), { recursive: true });
      fs.renameSync(fromPath, toPath);
      const fromSide = docSidecar(contentDir, slug);
      const toSide = docSidecar(contentDir, newSlug);
      if (fs.existsSync(fromSide) && !fs.existsSync(toSide)) {
        fs.mkdirSync(path.dirname(toSide), { recursive: true });
        fs.renameSync(fromSide, toSide);
      }
    } else {
      const fromDir = path.join(contentDir, ...slug);
      const toDir = path.join(contentDir, ...newSlug);
      if (!fs.existsSync(fromDir)) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404, headers });
      }
      if (fs.existsSync(toDir)) {
        return NextResponse.json({ error: "A folder with that name already exists there" }, { status: 409, headers });
      }
      fs.mkdirSync(path.dirname(toDir), { recursive: true });
      fs.renameSync(fromDir, toDir);
      const fromSide = folderSidecar(contentDir, slug);
      const toSide = folderSidecar(contentDir, newSlug);
      if (fs.existsSync(fromSide) && !fs.existsSync(toSide)) {
        fs.mkdirSync(path.dirname(toSide), { recursive: true });
        fs.renameSync(fromSide, toSide);
      }
      rekeyPrefix(order, slug, newSlug);
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to move" },
      { status: 500, headers },
    );
  }

  removeChild(order, fromParent, seg);
  addChild(order, toParent, seg, body.index);
  writeNavOrder(contentDir, order);

  return NextResponse.json({ ok: true, slug: newSlug }, { headers });
}
