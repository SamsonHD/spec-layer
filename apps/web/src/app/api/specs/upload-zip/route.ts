import { NextRequest, NextResponse } from "next/server";
import { authorizeApiRequest, corsHeaders } from "@/lib/specApi";
import { writeInboxMarkdown } from "@/lib/specWriter";
import { selectMarkdownEntries, unzipWithLimits } from "@/lib/zipImport";
import { assertContentLength, PayloadTooLargeError } from "@/lib/requestLimits";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Safety caps — basic zip-bomb / oversized-payload guard.
// ---------------------------------------------------------------------------

/** Maximum number of entries in the zip (files + directories). */
const MAX_ENTRIES = 1000;

/** Maximum decompressed size of a single file (2 MB). */
const MAX_FILE_BYTES = 2 * 1024 * 1024;

/** Maximum total decompressed size across all files (50 MB). */
const MAX_TOTAL_BYTES = 50 * 1024 * 1024;

/** Maximum compressed request size (10 MB). */
const MAX_ZIP_BYTES = 10 * 1024 * 1024;

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

/**
 * POST /api/specs/upload-zip
 *
 * Accepts a `.zip` file via multipart form-data (`file` field).
 * Decompresses the zip, filters for `.md` entries via `selectMarkdownEntries`,
 * and writes each kept file to the `_inbox` folder via `writeInboxMarkdown`.
 *
 * Returns:
 *   { ok: true, imported: number, skipped: Array<{name, reason}>, slugs: string[] }
 *
 * Errors are returned as JSON with an appropriate HTTP status.
 */
export async function POST(req: NextRequest) {
  const access = authorizeApiRequest(req);
  if (access.response) return access.response;
  const { headers } = access;

  try {
    assertContentLength(req.headers, MAX_ZIP_BYTES);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ error: error.message }, { status: 413, headers });
    }
    throw error;
  }

  const contentType = req.headers.get("content-type") ?? "";

  let zipBytes: Uint8Array;

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

    if (file.size > MAX_ZIP_BYTES) {
      return NextResponse.json(
        { error: `Zip file exceeds ${MAX_ZIP_BYTES} bytes` },
        { status: 413, headers },
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (ext !== "zip" && file.type !== "application/zip" && file.type !== "application/x-zip-compressed") {
      return NextResponse.json(
        { error: "File must be a .zip archive" },
        { status: 400, headers },
      );
    }

    try {
      zipBytes = new Uint8Array(await file.arrayBuffer());
    } catch {
      return NextResponse.json({ error: "Could not read file contents" }, { status: 400, headers });
    }
  } else if (contentType.includes("application/zip") || contentType.includes("application/x-zip-compressed")) {
    // Raw binary body (application/zip).
    try {
      zipBytes = new Uint8Array(await req.arrayBuffer());
    } catch {
      return NextResponse.json({ error: "Could not read request body" }, { status: 400, headers });
    }
  } else {
    return NextResponse.json(
      { error: "Expected multipart/form-data with a .zip file field, or a raw application/zip body" },
      { status: 400, headers },
    );
  }

  // Decompress.
  let rawEntries: Record<string, Uint8Array>;
  try {
    rawEntries = unzipWithLimits(zipBytes, {
      maxEntries: MAX_ENTRIES,
      maxFileBytes: MAX_FILE_BYTES,
      maxTotalBytes: MAX_TOTAL_BYTES,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400, headers },
    );
  }

  // Filter and decode entries.
  const { files, skipped } = selectMarkdownEntries(rawEntries);

  // Write each kept file; collect per-file failures without aborting the batch.
  const slugs: string[] = [];
  let imported = 0;
  const writeFailures: Array<{ name: string; reason: string }> = [];

  for (const { name, markdown } of files) {
    try {
      const written = writeInboxMarkdown(name, markdown);
      slugs.push(written.slug);
      imported++;
    } catch (e) {
      writeFailures.push({
        name,
        reason: e instanceof Error ? e.message : "Failed to write file",
      });
    }
  }

  return NextResponse.json(
    {
      ok: true,
      imported,
      skipped: [...skipped, ...writeFailures],
      slugs,
    },
    { headers },
  );
}
