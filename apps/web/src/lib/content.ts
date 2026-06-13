import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import { parseFrontmatter } from "@spec-layer/format";
import { getContentDir } from "./config";
import { parseFigmaUrl } from "./figma";
import { applyOrder, readNavOrder } from "./navOrder";

export type Status = "draft" | "approved" | "deprecated" | "beta" | "stable";

interface FigmaRef {
  fileKey: string;
  nodeId: string;
}

export interface ComponentFrontmatter {
  name: string;
  status?: Status;
  version?: string;
  figma?: string;
  figmaRef?: FigmaRef;
  storybook?: string;
  tags?: string[];
  specVersion?: string;
  contentHash?: string;
  extractedAt?: string;
  approvedBy?: string;
}

export interface ComponentDoc {
  slug: string[]; // path segments relative to the content dir, no extension
  filePath: string;
  frontmatter: ComponentFrontmatter;
  body: string;
  updated: string | null; // ISO date
  /** Headings found in the body (## level), lowercased. */
  sections: string[];
  /** Required canonical sections that are missing. */
  missingRequired: string[];
  /** True when the file declares `spec_version` frontmatter. */
  isSpecLayer: boolean;
  /** Non-fatal parsing issues that should be surfaced to the UI. */
  issues: string[];
}

export interface NavNode {
  type: "folder" | "doc";
  name: string; // display label
  slug: string[]; // for docs
  status?: Status; // doc nodes only — drives sidebar badges
  children?: NavNode[];
}

const SPEC_REQUIRED_SECTIONS = [
  "Definition",
  "Anatomy",
  "Configuration",
  "States",
  "Tokens used",
  "Code",
  "Accessibility",
  "Do's & Don'ts",
  "Related atoms",
];

/** Legacy section requirements (aliases kept for back-compat). */
const LEGACY_REQUIRED_SECTIONS: { label: string; aliases: string[] }[] = [
  { label: "Definition", aliases: ["definition", "overview", "description"] },
  { label: "Configuration", aliases: ["properties", "configuration", "props", "api"] },
  { label: "Accessibility", aliases: ["accessibility", "a11y"] },
];

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

function slugFromPath(filePath: string, baseDir: string): string[] {
  const rel = path.relative(baseDir, filePath).replace(/\.md$/, "");
  return rel.split(path.sep);
}

function humanize(s: string): string {
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Extract `## Heading` lines from markdown, ignoring fenced code blocks. */
function extractSections(body: string): string[] {
  const lines = body.split("\n");
  const headings: string[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^#{2,3}\s+(.+?)\s*$/.exec(line);
    if (m) headings.push(m[1].trim());
  }
  return headings;
}

function normalizeHeading(heading: string): string {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/\s+/g, " ");
}

function computeMissing(sections: string[], isSpecLayer: boolean): string[] {
  if (isSpecLayer) {
    const sectionSet = new Set(sections.map(normalizeHeading));
    return SPEC_REQUIRED_SECTIONS.filter((label) => !sectionSet.has(normalizeHeading(label)));
  }

  const normalized = sections.map(normalizeHeading);
  const missing: string[] = [];
  for (const req of LEGACY_REQUIRED_SECTIONS) {
    const present = req.aliases.some((alias) => normalized.some((heading) => heading.includes(normalizeHeading(alias))));
    if (!present) missing.push(req.label);
  }
  return missing;
}

/** Last-modified from git if available, else filesystem mtime. */
function lastUpdated(filePath: string): string | null {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", filePath], {
      cwd: path.dirname(filePath),
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    if (out) return out;
  } catch {
    // not a git repo or git unavailable — fall through
  }
  try {
    return fs.statSync(filePath).mtime.toISOString();
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : undefined;
}

function normalizeStatus(value: unknown): Status | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.toLowerCase();
  if (normalized === "draft" || normalized === "approved" || normalized === "deprecated" || normalized === "beta" || normalized === "stable") {
    return normalized;
  }
  return undefined;
}

function buildSpecFigmaRef(componentValue: unknown): FigmaRef | undefined {
  const component = asRecord(componentValue);
  const fileKey = asString(component.figma_file);
  // `component.figma_node` in Spec Layer frontmatter is already the canonical
  // node id (colon form, e.g. "12:34"); pass it through verbatim. Only ids
  // parsed out of a figma.com URL need the hyphen->colon rewrite (parseFigmaUrl).
  const nodeId = asString(component.figma_node);
  if (!fileKey || !nodeId) return undefined;
  return { fileKey, nodeId };
}

function parseLegacyDoc(filePath: string, baseDir: string, raw: string, isSpecLayer: boolean, issue?: string): ComponentDoc {
  const { data, content } = matter(raw);
  const slug = slugFromPath(filePath, baseDir);
  const sections = extractSections(content);
  const fm = asRecord(data);
  const parsedFigma = asString(fm.figma) ? parseFigmaUrl(asString(fm.figma) as string) : null;
  const specRef = buildSpecFigmaRef(fm.component);
  const figmaRef = specRef ?? parsedFigma ?? undefined;
  const nameFromSpec = asString(asRecord(fm.component).name);
  return {
    slug,
    filePath,
    frontmatter: {
      name: asString(fm.name) ?? nameFromSpec ?? humanize(slug[slug.length - 1]),
      status: normalizeStatus(fm.status),
      version: asString(fm.version),
      figma: asString(fm.figma),
      figmaRef,
      storybook: asString(fm.storybook),
      tags: asStringArray(fm.tags),
      specVersion: asString(fm.spec_version),
      contentHash: asString(fm.content_hash),
      extractedAt: asString(fm.extracted_at),
      approvedBy: asString(fm.approved_by),
    },
    body: content,
    updated: lastUpdated(filePath),
    sections,
    missingRequired: computeMissing(sections, isSpecLayer),
    isSpecLayer,
    issues: issue ? [issue] : [],
  };
}

function parse(filePath: string, baseDir: string): ComponentDoc {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  const fm = asRecord(data);
  const hasSpecVersion = fm.spec_version !== undefined;

  if (!hasSpecVersion) {
    return parseLegacyDoc(filePath, baseDir, raw, false);
  }

  try {
    const { frontmatter, body } = parseFrontmatter(raw);
    const slug = slugFromPath(filePath, baseDir);
    const sections = extractSections(body);
    const figmaRef = {
      fileKey: frontmatter.component.figma_file,
      nodeId: frontmatter.component.figma_node,
    };
    return {
      slug,
      filePath,
      frontmatter: {
        // A top-level `name:` override (written by a sidebar rename) wins over
        // the extracted component name.
        name: asString(fm.name) ?? (frontmatter.component.name || humanize(slug[slug.length - 1])),
        status: normalizeStatus(frontmatter.status),
        version: asString(fm.version),
        figma: asString(fm.figma),
        figmaRef,
        storybook: asString(fm.storybook),
        tags: asStringArray(fm.tags),
        specVersion: frontmatter.spec_version,
        contentHash: frontmatter.content_hash,
        extractedAt: frontmatter.extracted_at,
        approvedBy: frontmatter.approved_by,
      },
      body,
      updated: lastUpdated(filePath),
      sections,
      missingRequired: computeMissing(sections, true),
      isSpecLayer: true,
      issues: [],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown parse error";
    return parseLegacyDoc(
      filePath,
      baseDir,
      raw,
      true,
      `Spec Layer frontmatter parse failed; rendered with legacy parser fallback (${message}).`,
    );
  }

}

export function getAllDocs(): ComponentDoc[] {
  const dir = getContentDir();
  return walk(dir)
    .map((f) => parse(f, dir))
    .sort((a, b) => a.slug.join("/").localeCompare(b.slug.join("/")));
}

export function getDoc(slug: string[]): ComponentDoc | null {
  const dir = getContentDir();
  const filePath = path.join(dir, ...slug) + ".md";
  if (!fs.existsSync(filePath)) return null;
  return parse(filePath, dir);
}

/**
 * Insert, replace, or remove a single frontmatter field while preserving the
 * rest of the file (other fields, formatting, and the body) exactly. Passing
 * value === null removes the field.
 */
export function upsertFrontmatterField(raw: string, key: string, value: string | null): string {
  const fmMatch = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  const keyRe = new RegExp(`^${key}\\s*:.*$`);

  if (!fmMatch) {
    // No frontmatter block. Nothing to remove; otherwise create one.
    if (value === null) return raw;
    return `---\n${key}: ${value}\n---\n\n${raw}`;
  }

  const block = fmMatch[1];
  const lines = block.split("\n");
  const idx = lines.findIndex((l) => keyRe.test(l));

  if (value === null) {
    if (idx === -1) return raw;
    lines.splice(idx, 1);
  } else if (idx === -1) {
    lines.push(`${key}: ${value}`);
  } else {
    lines[idx] = `${key}: ${value}`;
  }

  const newBlock = lines.join("\n");
  return raw.slice(0, fmMatch.index) + `---\n${newBlock}\n---` + raw.slice(fmMatch.index + fmMatch[0].length);
}

/** Set (or clear, when url is null) the `figma:` frontmatter link for a component. */
export function setFigmaLink(slug: string[], url: string | null): void {
  const dir = getContentDir();
  const filePath = path.join(dir, ...slug) + ".md";
  if (!fs.existsSync(filePath)) throw new Error("Component not found");
  const raw = fs.readFileSync(filePath, "utf-8");
  fs.writeFileSync(filePath, upsertFrontmatterField(raw, "figma", url));
}

/**
 * Build a nav tree by walking the content directory directly (so empty folders
 * created via "Add subcategory" still appear), applying the persisted manifest
 * order with a folder-first/alphabetical fallback.
 */
export function getNavTree(): NavNode[] {
  const dir = getContentDir();
  const docBySlug = new Map(getAllDocs().map((d) => [d.slug.join("/"), d]));
  const order = readNavOrder(dir);

  const build = (absDir: string, parentSlug: string[]): NavNode[] => {
    if (!fs.existsSync(absDir)) return [];
    const nodes: NavNode[] = [];
    for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
      // Skip dotfiles/dirs (.spec-data, .ds-nav.json) and the import inbox.
      if (entry.name.startsWith(".")) continue;
      if (entry.isDirectory()) {
        if (entry.name === "_inbox") continue;
        const slug = [...parentSlug, entry.name];
        nodes.push({
          type: "folder",
          name: humanize(entry.name),
          slug,
          children: build(path.join(absDir, entry.name), slug),
        });
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const slug = [...parentSlug, entry.name.replace(/\.md$/, "")];
        const doc = docBySlug.get(slug.join("/"));
        nodes.push({
          type: "doc",
          name: doc?.frontmatter.name ?? humanize(slug[slug.length - 1]),
          slug,
          status: doc?.frontmatter.status,
        });
      }
    }

    // Default order: folders first, then alphabetical by display name.
    const fallback = nodes
      .slice()
      .sort((a, b) => (a.type !== b.type ? (a.type === "folder" ? -1 : 1) : a.name.localeCompare(b.name)))
      .map((n) => n.slug[n.slug.length - 1]);
    const desired = applyOrder(order, parentSlug, fallback, fallback);
    const bySeg = new Map(nodes.map((n) => [n.slug[n.slug.length - 1], n]));
    return desired.map((seg) => bySeg.get(seg)!).filter(Boolean);
  };

  return build(dir, []);
}
