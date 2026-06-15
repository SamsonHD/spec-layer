import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getContentDir } from "@/lib/config";
import { authorizeApiRequest, corsHeaders, hasTraversal, isSafeSlug } from "@/lib/specApi";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface MoveBody {
  fromSlug?: string[];
  group?: string;
  name?: string;
}

function toKebab(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[/\\\s,=]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sidecarPath(contentDir: string, slug: string[]): string {
  return path.join(contentDir, ".spec-data", ...slug) + ".json";
}

export async function POST(req: NextRequest) {
  const access = authorizeApiRequest(req);
  if (access.response) return access.response;
  const { headers } = access;

  let body: MoveBody;
  try {
    body = (await req.json()) as MoveBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  if (!isSafeSlug(body.fromSlug)) {
    return NextResponse.json({ error: "Missing or invalid 'fromSlug'" }, { status: 400, headers });
  }

  if (typeof body.group !== "string" || typeof body.name !== "string") {
    return NextResponse.json({ error: "Missing or invalid 'group' or 'name'" }, { status: 400, headers });
  }

  if (hasTraversal(body.group) || hasTraversal(body.name)) {
    return NextResponse.json(
      { error: "Group and name must not contain '/' or '..'" },
      { status: 400, headers },
    );
  }

  const group = toKebab(body.group);
  const name = toKebab(body.name);
  if (!group || !name) {
    return NextResponse.json(
      { error: "Group and name must contain at least one alphanumeric character" },
      { status: 400, headers },
    );
  }

  const contentDir = getContentDir();
  const fromPath = path.join(contentDir, ...body.fromSlug) + ".md";
  if (!fs.existsSync(fromPath)) {
    return NextResponse.json({ error: "Source file not found" }, { status: 404, headers });
  }

  const newSlug = [group, name];
  const toPath = path.join(contentDir, ...newSlug) + ".md";
  if (fs.existsSync(toPath)) {
    return NextResponse.json({ error: "Destination file already exists" }, { status: 409, headers });
  }

  const fromSidecar = sidecarPath(contentDir, body.fromSlug);
  const toSidecar = sidecarPath(contentDir, newSlug);
  // Reject a pre-existing destination sidecar regardless of whether the source
  // has one — otherwise a stale sidecar would silently mis-associate with the
  // moved doc and feed wrong stats to regenerate.
  if (fs.existsSync(toSidecar)) {
    return NextResponse.json({ error: "Destination sidecar already exists" }, { status: 409, headers });
  }

  try {
    fs.mkdirSync(path.dirname(toPath), { recursive: true });
    fs.renameSync(fromPath, toPath);
    if (fs.existsSync(fromSidecar)) {
      fs.mkdirSync(path.dirname(toSidecar), { recursive: true });
      fs.renameSync(fromSidecar, toSidecar);
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to move spec" },
      { status: 500, headers },
    );
  }

  return NextResponse.json({ ok: true, slug: newSlug }, { headers });
}
