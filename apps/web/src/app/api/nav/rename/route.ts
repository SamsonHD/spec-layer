import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getContentDir } from "@/lib/config";
import { authorizeApiRequest, corsHeaders, hasTraversal, isSafeSlug } from "@/lib/specApi";
import { toKebab } from "@/lib/slug";
import { upsertFrontmatterField } from "@/lib/content";
import { docSidecar, folderSidecar } from "@/lib/navFs";
import { readNavOrder, writeNavOrder, renameChild, rekeyPrefix } from "@/lib/navOrder";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface RenameBody {
  slug?: string[];
  type?: "folder" | "doc";
  name?: string;
}

export async function POST(req: NextRequest) {
  const access = authorizeApiRequest(req);
  if (access.response) return access.response;
  const { headers } = access;

  let body: RenameBody;
  try {
    body = (await req.json()) as RenameBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  if (!isSafeSlug(body.slug)) {
    return NextResponse.json({ error: "Missing or invalid 'slug'" }, { status: 400, headers });
  }
  if (body.type !== "folder" && body.type !== "doc") {
    return NextResponse.json({ error: "Invalid 'type'" }, { status: 400, headers });
  }
  if (typeof body.name !== "string" || hasTraversal(body.name)) {
    return NextResponse.json({ error: "Missing or invalid 'name'" }, { status: 400, headers });
  }

  const label = body.name.trim();
  const newSeg = toKebab(label);
  if (!label || !newSeg) {
    return NextResponse.json({ error: "Name must contain at least one alphanumeric character" }, { status: 400, headers });
  }

  const contentDir = getContentDir();
  const slug = body.slug;
  const parent = slug.slice(0, -1);
  const oldSeg = slug[slug.length - 1];
  const newSlug = [...parent, newSeg];
  const slugChanged = newSeg !== oldSeg;
  const order = readNavOrder(contentDir);

  try {
    if (body.type === "doc") {
      const fromPath = path.join(contentDir, ...slug) + ".md";
      if (!fs.existsSync(fromPath)) {
        return NextResponse.json({ error: "Page not found" }, { status: 404, headers });
      }
      let finalPath = fromPath;
      if (slugChanged) {
        const toPath = path.join(contentDir, ...newSlug) + ".md";
        if (fs.existsSync(toPath)) {
          return NextResponse.json({ error: "A page with that name already exists" }, { status: 409, headers });
        }
        fs.renameSync(fromPath, toPath);
        const fromSide = docSidecar(contentDir, slug);
        const toSide = docSidecar(contentDir, newSlug);
        if (fs.existsSync(fromSide) && !fs.existsSync(toSide)) {
          fs.mkdirSync(path.dirname(toSide), { recursive: true });
          fs.renameSync(fromSide, toSide);
        }
        finalPath = toPath;
        renameChild(order, parent, oldSeg, newSeg);
      }
      // Persist the display label as a top-level `name:` override.
      const raw = fs.readFileSync(finalPath, "utf-8");
      fs.writeFileSync(finalPath, upsertFrontmatterField(raw, "name", JSON.stringify(label)));
    } else {
      const fromDir = path.join(contentDir, ...slug);
      if (!fs.existsSync(fromDir) || !fs.statSync(fromDir).isDirectory()) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404, headers });
      }
      if (!slugChanged) {
        return NextResponse.json({ ok: true, slug }, { headers });
      }
      const toDir = path.join(contentDir, ...newSlug);
      if (fs.existsSync(toDir)) {
        return NextResponse.json({ error: "A folder with that name already exists" }, { status: 409, headers });
      }
      fs.renameSync(fromDir, toDir);
      const fromSide = folderSidecar(contentDir, slug);
      const toSide = folderSidecar(contentDir, newSlug);
      if (fs.existsSync(fromSide) && !fs.existsSync(toSide)) {
        fs.mkdirSync(path.dirname(toSide), { recursive: true });
        fs.renameSync(fromSide, toSide);
      }
      renameChild(order, parent, oldSeg, newSeg);
      rekeyPrefix(order, slug, newSlug);
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to rename" },
      { status: 500, headers },
    );
  }

  writeNavOrder(contentDir, order);
  return NextResponse.json({ ok: true, slug: newSlug }, { headers });
}
