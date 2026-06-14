import { NextRequest, NextResponse } from "next/server";
import { unzipSync } from "fflate";
import { corsHeaders } from "@/lib/specApi";
import { writeInboxMarkdown } from "@/lib/specWriter";
import { selectMarkdownEntries } from "@/lib/zipImport";

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
  const headers = corsHeaders(req);

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
  let rawEntries: ReturnType<typeof unzipSync>;
  try {
    rawEntries = unzipSync(zipBytes);
  } catch (e) {
    return NextResponse.json(
      { error: `Invalid or corrupt zip file: ${e instanceof Error ? e.message : String(e)}` },
      { status: 400, headers },
    );
  }

  // Safety caps.
  const entryNames = Object.keys(rawEntries);
  if (entryNames.length > MAX_ENTRIES) {
    return NextResponse.json(
      { error: `Zip contains ${entryNames.length} entries; maximum allowed is ${MAX_ENTRIES}` },
      { status: 400, headers },
    );
  }

  let totalBytes = 0;
  for (const [name, bytes] of Object.entries(rawEntries)) {
    const size = bytes.byteLength;
    if (size > MAX_FILE_BYTES) {
      return NextResponse.json(
        {
          error: `Entry "${name}" decompresses to ${size} bytes; maximum per-file size is ${MAX_FILE_BYTES} bytes (2 MB)`,
        },
        { status: 400, headers },
      );
    }
    totalBytes += size;
    if (totalBytes > MAX_TOTAL_BYTES) {
      return NextResponse.json(
        {
          error: `Total decompressed size exceeds the ${MAX_TOTAL_BYTES / (1024 * 1024)} MB limit`,
        },
        { status: 400, headers },
      );
    }
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
