import { NextRequest, NextResponse } from "next/server";
import { corsHeaders, isSafeSlug } from "@/lib/specApi";
import {
  enrichSpecFile,
  NoApiKeyError,
  NoStoredSpecError,
  StaleSpecError,
} from "@/lib/guidelineFillFile";
import { createEnrichDeps } from "@/lib/enrichDeps";
import { validateJsonMutationRequest } from "@/lib/requestSecurity";

export const dynamic = "force-dynamic";
const MAX_ENRICH_BYTES = 64 * 1024;

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface EnrichBody {
  slug?: string[];
  /** "empty" (default) fills placeholders; a heading regenerates that section. */
  target?: string;
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);
  const requestError = validateJsonMutationRequest(req, MAX_ENRICH_BYTES);
  if (requestError) {
    return NextResponse.json({ error: requestError.error }, { status: requestError.status, headers });
  }

  let body: EnrichBody;
  try {
    body = (await req.json()) as EnrichBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  if (!isSafeSlug(body.slug)) {
    return NextResponse.json({ error: "Missing or invalid 'slug'" }, { status: 400, headers });
  }

  const target = typeof body.target === "string" && body.target ? body.target : "empty";

  try {
    const { filled, usedVisual } = await enrichSpecFile(body.slug, { target }, createEnrichDeps());
    return NextResponse.json({ ok: true, slug: body.slug, filled, usedVisual }, { headers });
  } catch (error) {
    if (
      error instanceof NoApiKeyError ||
      error instanceof NoStoredSpecError ||
      error instanceof StaleSpecError
    ) {
      return NextResponse.json({ error: error.message }, { status: 409, headers });
    }
    const message = error instanceof Error ? error.message : "Failed to enrich spec";
    const status = message === "Component not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status, headers });
  }
}
