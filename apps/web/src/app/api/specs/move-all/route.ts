import { NextRequest, NextResponse } from "next/server";
import { InboxMoveError, saveAllInboxSpecs } from "@/lib/inboxMove";
import { validateJsonMutationRequest } from "@/lib/requestSecurity";
import { corsHeaders } from "@/lib/specApi";

export const dynamic = "force-dynamic";
const MAX_MOVE_ALL_BYTES = 64 * 1024;

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface MoveAllBody {
  folder?: unknown;
  items?: unknown;
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);
  const requestError = validateJsonMutationRequest(req, MAX_MOVE_ALL_BYTES);
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

  if (
    parsedBody === null ||
    typeof parsedBody !== "object" ||
    Array.isArray(parsedBody)
  ) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400, headers });
  }
  const body = parsedBody as MoveAllBody;

  try {
    const result = saveAllInboxSpecs(body.items, body.folder);
    return NextResponse.json({ ok: true, ...result }, { headers });
  } catch (error) {
    if (error instanceof InboxMoveError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers },
      );
    }
    return NextResponse.json(
      { error: "Failed to save Inbox items" },
      { status: 500, headers },
    );
  }
}
