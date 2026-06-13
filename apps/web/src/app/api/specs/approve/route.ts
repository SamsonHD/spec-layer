import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { approveSpec } from "@spec-layer/format";
import { getContentDir } from "@/lib/config";
import { corsHeaders, isSafeSlug } from "@/lib/specApi";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface ApproveBody {
  slug?: string[];
  approver?: string;
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);

  let body: ApproveBody;
  try {
    body = (await req.json()) as ApproveBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  if (!isSafeSlug(body.slug)) {
    return NextResponse.json({ error: "Missing or invalid 'slug'" }, { status: 400, headers });
  }

  const filePath = path.join(getContentDir(), ...body.slug) + ".md";
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Spec file not found" }, { status: 400, headers });
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const approved = approveSpec(raw, body.approver?.trim() || "Reviewer");
    fs.writeFileSync(filePath, approved, "utf-8");
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to approve spec" },
      { status: 500, headers },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      slug: body.slug,
      status: "approved",
    },
    { headers },
  );
}
