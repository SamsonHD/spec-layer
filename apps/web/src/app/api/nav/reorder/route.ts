import { NextRequest, NextResponse } from "next/server";
import { getContentDir } from "@/lib/config";
import { authorizeApiRequest, corsHeaders } from "@/lib/specApi";
import { isSafeParent } from "@/lib/navFs";
import { readNavOrder, writeNavOrder, reorderParent } from "@/lib/navOrder";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface ReorderBody {
  parentSlug?: string[];
  order?: string[];
}

function isSafeSegList(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (s) =>
        typeof s === "string" &&
        s.trim().length > 0 &&
        !s.includes("/") &&
        !s.includes("\\") &&
        !s.includes(".."),
    )
  );
}

export async function POST(req: NextRequest) {
  const access = authorizeApiRequest(req);
  if (access.response) return access.response;
  const { headers } = access;

  let body: ReorderBody;
  try {
    body = (await req.json()) as ReorderBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  const parent = body.parentSlug ?? [];
  if (!isSafeParent(parent)) {
    return NextResponse.json({ error: "Invalid 'parentSlug'" }, { status: 400, headers });
  }
  if (!isSafeSegList(body.order)) {
    return NextResponse.json({ error: "Invalid 'order'" }, { status: 400, headers });
  }

  const contentDir = getContentDir();
  const order = readNavOrder(contentDir);
  reorderParent(order, parent, body.order);
  writeNavOrder(contentDir, order);

  return NextResponse.json({ ok: true }, { headers });
}
