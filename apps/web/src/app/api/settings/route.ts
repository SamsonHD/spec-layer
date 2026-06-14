import { NextRequest, NextResponse } from "next/server";
import { getContentDir } from "@/lib/config";
import { setKeys, getKeyStatus } from "@/lib/settings";
import { corsHeaders } from "@/lib/specApi";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

/** GET /api/settings — returns contentDir and boolean key presence (never raw keys). */
export async function GET(req: NextRequest) {
  const headers = corsHeaders(req);
  return NextResponse.json(
    {
      contentDir: getContentDir(),
      keys: getKeyStatus(),
    },
    { headers },
  );
}

interface SettingsBody {
  anthropic?: string;
  figma?: string;
}

/** POST /api/settings — saves provided keys, returns updated boolean key presence. */
export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);

  let body: SettingsBody;
  try {
    body = (await req.json()) as SettingsBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  if (
    body.anthropic !== undefined &&
    typeof body.anthropic !== "string"
  ) {
    return NextResponse.json({ error: "'anthropic' must be a string" }, { status: 400, headers });
  }

  if (
    body.figma !== undefined &&
    typeof body.figma !== "string"
  ) {
    return NextResponse.json({ error: "'figma' must be a string" }, { status: 400, headers });
  }

  try {
    setKeys({
      anthropic: body.anthropic,
      figma: body.figma,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save settings" },
      { status: 500, headers },
    );
  }

  return NextResponse.json({ keys: getKeyStatus() }, { headers });
}
