import { NextRequest, NextResponse } from "next/server";
import { getAllDocs } from "@/lib/content";
import { lookupSpecByFigmaKey } from "@/lib/sync";
import { validateJsonMutationRequest } from "@/lib/requestSecurity";
import { corsHeaders } from "@/lib/specApi";

export const dynamic = "force-dynamic";

const MAX_BYTES = 16 * 1024;

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface LookupBody {
  figmaKey?: unknown;
  contentHash?: unknown;
}

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
  const body = parsedBody as LookupBody;

  if (typeof body.figmaKey !== "string" || !body.figmaKey) {
    return NextResponse.json({ error: "Missing or invalid 'figmaKey'" }, { status: 400, headers });
  }
  if (typeof body.contentHash !== "string" || !body.contentHash) {
    return NextResponse.json({ error: "Missing or invalid 'contentHash'" }, { status: 400, headers });
  }

  try {
    const result = lookupSpecByFigmaKey(body.figmaKey, body.contentHash, getAllDocs());
    return NextResponse.json(result, { headers });
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500, headers });
  }
}
