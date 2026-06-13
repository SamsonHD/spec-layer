import fs from "node:fs";
import path from "node:path";
import type { IntermediateSpec } from "@spec-layer/extractor";
import { getContentDir } from "@/lib/config";

/**
 * Kebab-case a component name for use as a filename slug.
 * Mirrors the slug logic in the extractor's renderSpec so cross-links resolve.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[/\\\s,=]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Resolve the `_inbox` folder under the content dir, creating it if missing. */
export function getInboxDir(): string {
  const dir = path.join(getContentDir(), "_inbox");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export interface WriteSpecOptions {
  /** Overwrite an existing file with the same slug instead of suffixing. */
  overwrite?: boolean;
  /** Persist the source extraction for future regenerations. */
  spec?: IntermediateSpec;
}

export interface WrittenSpec {
  path: string;
  slug: string;
}

function getSpecDataDir(): string {
  const dir = path.join(getContentDir(), ".spec-data");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function getSpecDataPath(slug: string[]): string {
  return path.join(getSpecDataDir(), ...slug) + ".json";
}

function writeSpecData(slug: string[], spec: IntermediateSpec): void {
  const filePath = getSpecDataPath(slug);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(spec, null, 2), "utf-8");
}

/**
 * Write a rendered spec `.md` into the `_inbox` folder using a kebab-case
 * filename derived from the component name. By default, never overwrites an
 * existing file silently: a numeric suffix (`-2`, `-3`, …) is appended until a
 * free name is found. Pass `overwrite: true` to write in place.
 */
export function writeInboxSpec(
  name: string,
  markdown: string,
  opts: WriteSpecOptions = {},
): WrittenSpec {
  const inbox = getInboxDir();
  const base = slugify(name) || "component";

  let slug = base;
  if (!opts.overwrite) {
    let n = 2;
    while (fs.existsSync(path.join(inbox, `${slug}.md`))) {
      slug = `${base}-${n}`;
      n++;
    }
  }

  const filePath = path.join(inbox, `${slug}.md`);
  fs.writeFileSync(filePath, markdown, "utf-8");
  if (opts.spec) writeSpecData(["_inbox", slug], opts.spec);
  return { path: filePath, slug };
}

export function readStoredSpec(slug: string[]): IntermediateSpec | null {
  try {
    const raw = fs.readFileSync(getSpecDataPath(slug), "utf-8");
    return JSON.parse(raw) as IntermediateSpec;
  } catch {
    return null;
  }
}
