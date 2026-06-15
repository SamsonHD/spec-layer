import { NextRequest, NextResponse } from "next/server";
import { InboxMoveError, clearInboxSpecs } from "@/lib/inboxMove";
import {
  validateJsonMutationRequest,
  validateSameOriginRequest,
} from "@/lib/requestSecurity";
import { corsHeaders } from "@/lib/specApi";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  const headers = corsHeaders(req);
  const requestError = validateSameOriginRequest(req);
  if (requestError) {
    return NextResponse.json(
      { error: requestError.error },
      { status: requestError.status, headers },
    );
  }
  return new NextResponse(null, { status: 204, headers });
}

interface ClearBody {
  items?: unknown;
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);
  const requestError = validateJsonMutationRequest(req);
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
  const body = parsedBody as ClearBody;

  try {
    const result = clearInboxSpecs(body.items);
    return NextResponse.json({ ok: true, ...result }, { headers });
  } catch (error) {
    if (error instanceof InboxMoveError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers },
      );
    }
    return NextResponse.json(
      { error: "Failed to clear Inbox items" },
      { status: 500, headers },
    );
  }
}
