import fs from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { getContentDir, getContentDirSource, setContentDir, clearContentDir } from "@/lib/config";

export const dynamic = "force-dynamic";

function countMarkdown(dir: string): number {
  let n = 0;
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return 0;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const full = `${dir}/${e.name}`;
    if (e.isDirectory()) n += countMarkdown(full);
    else if (e.isFile() && e.name.endsWith(".md")) n++;
  }
  return n;
}

function status() {
  const contentDir = getContentDir();
  const exists = fs.existsSync(contentDir);
  return {
    contentDir,
    source: getContentDirSource(),
    exists,
    mdCount: exists ? countMarkdown(contentDir) : 0,
  };
}

export function GET() {
  return NextResponse.json(status());
}

export async function POST(req: NextRequest) {
  let body: { path?: string; clear?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.clear) {
    clearContentDir();
    return NextResponse.json(status());
  }

  if (!body.path || !body.path.trim()) {
    return NextResponse.json({ error: "Missing 'path'" }, { status: 400 });
  }

  try {
    setContentDir(body.path);
  } catch {
    return NextResponse.json({ error: `Not a valid folder: ${body.path}` }, { status: 400 });
  }

  return NextResponse.json(status());
}
