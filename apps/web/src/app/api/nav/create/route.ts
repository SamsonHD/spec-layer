import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getContentDir } from "@/lib/config";
import { authorizeApiRequest, corsHeaders, hasTraversal } from "@/lib/specApi";
import { toKebab } from "@/lib/slug";
import { isSafeParent } from "@/lib/navFs";
import { readNavOrder, writeNavOrder, addChild } from "@/lib/navOrder";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface CreateBody {
  parentSlug?: string[];
  type?: "folder" | "doc";
  name?: string;
}

function stubPage(label: string): string {
  return `---\nname: ${JSON.stringify(label)}\nstatus: draft\n---\n\n_New page — add content._\n`;
}

export async function POST(req: NextRequest) {
  const access = authorizeApiRequest(req);
  if (access.response) return access.response;
  const { headers } = access;

  let body: CreateBody;
  try {
    body = (await req.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  const parent = body.parentSlug ?? [];
  if (!isSafeParent(parent)) {
    return NextResponse.json({ error: "Invalid 'parentSlug'" }, { status: 400, headers });
  }
  if (body.type !== "folder" && body.type !== "doc") {
    return NextResponse.json({ error: "Invalid 'type'" }, { status: 400, headers });
  }
  if (typeof body.name !== "string" || hasTraversal(body.name)) {
    return NextResponse.json({ error: "Missing or invalid 'name'" }, { status: 400, headers });
  }

  const label = body.name.trim();
  const seg = toKebab(label);
  if (!label || !seg) {
    return NextResponse.json({ error: "Name must contain at least one alphanumeric character" }, { status: 400, headers });
  }

  const contentDir = getContentDir();
  const parentDir = path.join(contentDir, ...parent);
  const newSlug = [...parent, seg];
  const order = readNavOrder(contentDir);

  try {
    if (body.type === "doc") {
      const filePath = path.join(parentDir, seg + ".md");
      if (fs.existsSync(filePath)) {
        return NextResponse.json({ error: "A page with that name already exists" }, { status: 409, headers });
      }
      fs.mkdirSync(parentDir, { recursive: true });
      fs.writeFileSync(filePath, stubPage(label));
    } else {
      const dir = path.join(parentDir, seg);
      if (fs.existsSync(dir)) {
        return NextResponse.json({ error: "A folder with that name already exists" }, { status: 409, headers });
      }
      fs.mkdirSync(dir, { recursive: true });
    }
    addChild(order, parent, seg);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create" },
      { status: 500, headers },
    );
  }

  writeNavOrder(contentDir, order);
  return NextResponse.json({ ok: true, slug: newSlug }, { headers });
}
