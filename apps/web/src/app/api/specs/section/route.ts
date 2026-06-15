import { NextRequest, NextResponse } from "next/server";
import { authorizeApiRequest, corsHeaders, isSafeSlug } from "@/lib/specApi";
import { applySectionEdit, StaleSectionError, type SectionEdit } from "@/lib/sectionEditFile";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface SectionRequestBody {
  slug?: unknown;
  action?: unknown;
  index?: unknown;
  content?: unknown;
  heading?: unknown;
  expectedHeading?: unknown;
  to?: unknown;
}

function asInt(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : null;
}

export async function POST(req: NextRequest) {
  const access = authorizeApiRequest(req);
  if (access.response) return access.response;
  const { headers } = access;

  let body: SectionRequestBody;
  try {
    body = (await req.json()) as SectionRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  if (!isSafeSlug(body.slug)) {
    return NextResponse.json({ error: "Missing or invalid 'slug'" }, { status: 400, headers });
  }
  const slug = body.slug;

  const index = asInt(body.index);
  if (index === null) {
    return NextResponse.json({ error: "Missing or invalid 'index'" }, { status: 400, headers });
  }

  // Optional stale-index guard: the client sends the heading it expects at
  // `index`; the writer rejects the edit if the file has since changed.
  const expectedHeading = typeof body.expectedHeading === "string" ? body.expectedHeading : undefined;

  let edit: SectionEdit;
  switch (body.action) {
    case "replace": {
      if (typeof body.content !== "string") {
        return NextResponse.json({ error: "'content' is required for replace" }, { status: 400, headers });
      }
      edit = { action: "replace", index, content: body.content, expectedHeading };
      break;
    }
    case "insert": {
      if (typeof body.heading !== "string" || body.heading.trim().length === 0) {
        return NextResponse.json({ error: "'heading' is required for insert" }, { status: 400, headers });
      }
      const content = typeof body.content === "string" ? body.content : "";
      edit = { action: "insert", index, heading: body.heading.trim(), content };
      break;
    }
    case "delete": {
      edit = { action: "delete", index, expectedHeading };
      break;
    }
    case "reorder": {
      const to = asInt(body.to);
      if (to === null) {
        return NextResponse.json({ error: "'to' is required for reorder" }, { status: 400, headers });
      }
      edit = { action: "reorder", index, to, expectedHeading };
      break;
    }
    default:
      return NextResponse.json({ error: "Invalid 'action'" }, { status: 400, headers });
  }

  try {
    applySectionEdit(slug, edit);
  } catch (e) {
    // The file changed since the client loaded it — surface as a conflict so the
    // user refreshes rather than silently editing the wrong section.
    if (e instanceof StaleSectionError) {
      return NextResponse.json({ error: e.message }, { status: 409, headers });
    }
    const message = e instanceof Error ? e.message : "Failed to edit section";
    // Missing file / out-of-range index are client errors.
    const status = /not found|out of range/i.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status, headers });
  }

  return NextResponse.json({ ok: true }, { headers });
}
