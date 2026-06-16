import { NextRequest, NextResponse } from "next/server";
import { SpecUpdateError, updateLibrarySpecFromInbox } from "@/lib/specUpdate";
import { validateJsonMutationRequest } from "@/lib/requestSecurity";
import { corsHeaders } from "@/lib/specApi";

export const dynamic = "force-dynamic";
const MAX_BYTES = 64 * 1024;

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface UpdateBody {
  source?: unknown;
  targetSlug?: unknown;
}

/**
 * POST /api/specs/update — resolve drift by merging an inbox re-extraction into
 * an existing library spec, preserving human-authored judgment sections.
 */
export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);
  const requestError = validateJsonMutationRequest(req, MAX_BYTES);
  if (requestError) {
    return NextResponse.json(
      { error: requestError.error },
      { status: requestError.status, headers },
    );
  }

  let parsedBody: unknown;
  try {
    parsedBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  if (parsedBody === null || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400, headers });
  }
  const body = parsedBody as UpdateBody;

  try {
    const result = updateLibrarySpecFromInbox(body.source, body.targetSlug);
    return NextResponse.json({ ok: true, slug: result.slug }, { headers });
  } catch (error) {
    if (error instanceof SpecUpdateError) {
      return NextResponse.json({ error: error.message }, { status: error.status, headers });
    }
    return NextResponse.json({ error: "Failed to update spec" }, { status: 500, headers });
  }
}
