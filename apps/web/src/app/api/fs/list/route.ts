import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Count .md files under a dir, recursively, capped so huge trees stay snappy. */
function countMarkdown(dir: string, budget = { n: 2000 }): number {
  let count = 0;
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return 0;
  }
  for (const e of entries) {
    if (budget.n <= 0) break;
    if (e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      budget.n--;
      count += countMarkdown(full, budget);
    } else if (e.isFile() && e.name.endsWith(".md")) {
      count++;
    }
  }
  return count;
}

export function GET(req: NextRequest) {
  const requested = req.nextUrl.searchParams.get("path");
  const dir = requested && requested.trim() ? path.resolve(requested) : os.homedir();

  let stat: fs.Stats;
  try {
    stat = fs.statSync(dir);
  } catch {
    return NextResponse.json({ error: `Path not found: ${dir}` }, { status: 404 });
  }
  if (!stat.isDirectory()) {
    return NextResponse.json({ error: "Not a directory" }, { status: 400 });
  }

  let dirents: fs.Dirent[] = [];
  try {
    dirents = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  const folders = dirents
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => {
      const full = path.join(dir, e.name);
      return { name: e.name, path: full, mdCount: countMarkdown(full) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const parent = path.dirname(dir);

  return NextResponse.json({
    path: dir,
    parent: parent === dir ? null : parent, // null at filesystem root
    home: os.homedir(),
    mdCountHere: countMarkdown(dir),
    folders,
  });
}
