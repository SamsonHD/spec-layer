import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";
import { authorizeApiRequest, corsHeaders } from "@/lib/specApi";
import { writeInboxMarkdown } from "@/lib/specWriter";
import { assertContentLength, PayloadTooLargeError } from "@/lib/requestLimits";

export const dynamic = "force-dynamic";
const MAX_MARKDOWN_BYTES = 2 * 1024 * 1024;

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

/**
 * POST /api/specs/upload
 *
 * Accepts either:
 *   - multipart/form-data  with a `file` field (.md file)
 *   - application/json     with `{ markdown: string; filename?: string }`
 *
 * Validates the markdown with gray-matter, derives a slug from frontmatter
 * `name` / `component.name`, then the filename, then falls back to "component".
 * Writes into `_inbox` via `writeInboxMarkdown` (no spec sidecar — intentional).
 *
 * Returns { ok: true, slug } or a JSON error with appropriate status.
 */
export async function POST(req: NextRequest) {
  const access = authorizeApiRequest(req);
  if (access.response) return access.response;
  const { headers } = access;

  try {
    assertContentLength(req.headers, MAX_MARKDOWN_BYTES);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ error: error.message }, { status: 413, headers });
    }
    throw error;
  }

  let markdown: string;
  let filenameHint: string | undefined;

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ error: "Could not parse multipart body" }, { status: 400, headers });
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing 'file' field in form data" }, { status: 400, headers });
    }
    if (file.size > MAX_MARKDOWN_BYTES) {
      return NextResponse.json({ error: "Markdown file is too large" }, { status: 413, headers });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["md", "markdown"].includes(ext) && !file.type.includes("markdown") && file.type !== "text/plain") {
      return NextResponse.json(
        { error: "File must be a .md or .markdown file" },
        { status: 400, headers },
      );
    }

    try {
      markdown = await file.text();
    } catch {
      return NextResponse.json({ error: "Could not read file contents" }, { status: 400, headers });
    }

    // Strip the extension for the slug hint.
    filenameHint = file.name.replace(/\.(md|markdown)$/i, "");
  } else {
    // Treat as JSON.
    let body: { markdown?: unknown; filename?: unknown };
    try {
      body = (await req.json()) as { markdown?: unknown; filename?: unknown };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
    }

    if (!body.markdown || typeof body.markdown !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'markdown' field" },
        { status: 400, headers },
      );
    }

    markdown = body.markdown;
    if (typeof body.filename === "string" && body.filename.trim()) {
      filenameHint = body.filename.replace(/\.(md|markdown)$/i, "").trim();
    }
  }

  // Reject obviously empty content.
  if (!markdown.trim()) {
    return NextResponse.json({ error: "Markdown content is empty" }, { status: 400, headers });
  }
  if (new TextEncoder().encode(markdown).byteLength > MAX_MARKDOWN_BYTES) {
    return NextResponse.json({ error: "Markdown content is too large" }, { status: 413, headers });
  }

  // Validate parseable with gray-matter.
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(markdown);
  } catch (e) {
    return NextResponse.json(
      { error: `Could not parse markdown frontmatter: ${e instanceof Error ? e.message : String(e)}` },
      { status: 400, headers },
    );
  }

  // Derive a name for the slug:
  //   1. frontmatter `name` field
  //   2. frontmatter `component.name` (Spec Layer style)
  //   3. filename hint (from the uploaded file or JSON `filename`)
  //   4. "component" fallback
  const fm = parsed.data as Record<string, unknown>;
  const nameFromFm =
    typeof fm.name === "string" && fm.name.trim()
      ? fm.name.trim()
      : typeof fm.component === "object" &&
          fm.component !== null &&
          typeof (fm.component as Record<string, unknown>).name === "string"
        ? ((fm.component as Record<string, unknown>).name as string).trim()
        : null;

  const rawName = nameFromFm ?? filenameHint ?? "component";

  let written: { path: string; slug: string };
  try {
    written = writeInboxMarkdown(rawName, markdown);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to write file" },
      { status: 500, headers },
    );
  }

  return NextResponse.json({ ok: true, slug: written.slug }, { headers });
}
