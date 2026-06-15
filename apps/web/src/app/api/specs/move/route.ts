import { NextRequest, NextResponse } from "next/server";
import { InboxMoveError, moveInboxSpecAs } from "@/lib/inboxMove";
import { assertContentLength, PayloadTooLargeError } from "@/lib/requestLimits";
import { authorizeApiRequest, corsHeaders, hasTraversal, isSafeSlug } from "@/lib/specApi";
import { slugify } from "@/lib/specWriter";

export const dynamic = "force-dynamic";
const MAX_MOVE_BYTES = 64 * 1024;

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface MoveBody {
  fromSlug?: unknown;
  group?: unknown;
  name?: unknown;
}

export async function POST(req: NextRequest) {
  const access = authorizeApiRequest(req);
  if (access.response) return access.response;
  const { headers } = access;

  const mediaType = (req.headers.get("content-type") ?? "")
    .split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (mediaType !== "application/json") {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415, headers },
    );
  }

  try {
    assertContentLength(req.headers, MAX_MOVE_BYTES);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ error: error.message }, { status: 413, headers });
    }
    throw error;
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
  const body = parsedBody as MoveBody;

  if (!isSafeSlug(body.fromSlug)) {
    return NextResponse.json(
      { error: "Missing or invalid 'fromSlug'" },
      { status: 400, headers },
    );
  }

  if (typeof body.group !== "string" || typeof body.name !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'group' or 'name'" },
      { status: 400, headers },
    );
  }

  if (hasTraversal(body.group) || hasTraversal(body.name)) {
    return NextResponse.json(
      { error: "Group and name must not contain '/' or '..'" },
      { status: 400, headers },
    );
  }

  if (!slugify(body.group) || !slugify(body.name)) {
    return NextResponse.json(
      { error: "Group and name must contain at least one alphanumeric character" },
      { status: 400, headers },
    );
  }

  try {
    const slug = moveInboxSpecAs(body.fromSlug, body.group, body.name);
    return NextResponse.json({ ok: true, slug }, { headers });
  } catch (error) {
    if (error instanceof InboxMoveError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to move spec" },
      { status: 500, headers },
    );
  }
}
