import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/specApi";
import { validateJsonMutationRequest } from "@/lib/requestSecurity";
import { enrichInboxSpecs } from "@/lib/inboxEnrich";
import { createEnrichDeps } from "@/lib/enrichDeps";
import { NoApiKeyError } from "@/lib/guidelineFillFile";

export const dynamic = "force-dynamic";
const MAX_ENRICH_ALL_BYTES = 64 * 1024;

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface EnrichAllBody {
  items?: unknown;
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);
  const requestError = validateJsonMutationRequest(req, MAX_ENRICH_ALL_BYTES);
  if (requestError) {
    return NextResponse.json({ error: requestError.error }, { status: requestError.status, headers });
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
  const body = parsedBody as EnrichAllBody;

  const deps = createEnrichDeps();
  // A missing key is a whole-batch failure, not per-item — surface it once up front.
  if (!deps.apiKey) {
    return NextResponse.json({ error: new NoApiKeyError().message }, { status: 409, headers });
  }

  try {
    const result = await enrichInboxSpecs(body.items, deps);
    return NextResponse.json({ ok: true, ...result }, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to enrich Inbox items";
    return NextResponse.json({ error: message }, { status: 400, headers });
  }
}
