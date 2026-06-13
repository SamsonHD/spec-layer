import { NextRequest, NextResponse } from "next/server";
import {
  draftProse,
  renderSpec,
  type IntermediateSpec,
  type ProseDrafts,
} from "@spec-layer/extractor";
import { createSpecCache } from "@/lib/specCache";
import { writeInboxSpec } from "@/lib/specWriter";
import { corsHeaders } from "@/lib/specApi";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface ImportBody {
  spec?: IntermediateSpec;
  extractedAt?: string;
  /** Opt-in AI prose enrichment. Defaults to false (structural-only spec). */
  useAi?: boolean;
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);

  let body: ImportBody;
  try {
    body = (await req.json()) as ImportBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  const spec = body.spec;
  if (!spec || typeof spec !== "object" || typeof spec.name !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'spec'" },
      { status: 400, headers },
    );
  }

  const extractedAt = body.extractedAt ?? new Date().toISOString();

  // AI prose enrichment is opt-in. By default we write the structural spec
  // only (no AI prose). When `useAi` is requested we enrich if a key is
  // configured; any failure degrades gracefully to prose: null.
  let prose: ProseDrafts | null = null;
  let warning: string | undefined;

  if (body.useAi === true) {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim() || null;
    if (apiKey) {
      try {
        prose = await draftProse(spec, {
          apiKey,
          fetcher: fetch,
          cacheStore: createSpecCache(),
        });
      } catch (e) {
        prose = null;
        warning = `AI enrichment failed; wrote structural-only spec. ${
          e instanceof Error ? e.message : String(e)
        }`;
      }
    } else {
      warning = "AI enrichment requested but ANTHROPIC_API_KEY is not set; wrote structural-only spec.";
    }
  }

  let markdown: string;
  try {
    markdown = renderSpec(spec, { prose, extractedAt });
  } catch (e) {
    // renderSpec touches spec.anatomy/props/tokens/related/gaps — a spec missing
    // those arrays throws. Surface it as a 400 (with CORS headers) instead of a
    // bare 500 the plugin can't read.
    return NextResponse.json(
      {
        error: `Invalid 'spec' shape: ${e instanceof Error ? e.message : String(e)}`,
      },
      { status: 400, headers },
    );
  }

  let written: { path: string; slug: string };
  try {
    written = writeInboxSpec(spec.name, markdown, { spec });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to write spec file" },
      { status: 500, headers },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      path: written.path,
      slug: written.slug,
      enriched: prose !== null,
      ...(warning ? { warning } : {}),
    },
    { headers },
  );
}
