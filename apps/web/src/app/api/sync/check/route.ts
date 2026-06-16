import { NextRequest, NextResponse } from "next/server";
import { getAllDocs } from "@/lib/content";
import {
  type SyncComponentFingerprint,
  type SyncReport,
  computeFileSync,
  writeSyncReport,
} from "@/lib/sync";
import { validateJsonMutationRequest } from "@/lib/requestSecurity";
import { corsHeaders } from "@/lib/specApi";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_COMPONENTS = 5000;
const FILE_KEY_RE = /^[A-Za-z0-9]{10,}$/;

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface CheckBody {
  fileKey?: unknown;
  components?: unknown;
}

function parseComponent(value: unknown): SyncComponentFingerprint | null {
  if (value === null || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (
    typeof v.figmaKey !== "string" ||
    typeof v.figmaNode !== "string" ||
    typeof v.name !== "string" ||
    typeof v.contentHash !== "string"
  ) {
    return null;
  }
  return {
    figmaKey: v.figmaKey,
    figmaNode: v.figmaNode,
    name: v.name,
    contentHash: v.contentHash,
  };
}

function summarize(report: SyncReport, fileKey: string) {
  let inSync = 0;
  let drifted = 0;
  let missingInFigma = 0;
  for (const entry of Object.values(report.specs)) {
    if (entry.figmaFile !== fileKey) continue;
    if (entry.status === "in-sync") inSync++;
    else if (entry.status === "drifted") drifted++;
    else missingInFigma++;
  }
  return {
    inSync,
    drifted,
    missingInFigma,
    newInFigma: report.files[fileKey]?.newInFigma.length ?? 0,
  };
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
  const body = parsedBody as CheckBody;

  if (typeof body.fileKey !== "string" || !FILE_KEY_RE.test(body.fileKey)) {
    return NextResponse.json({ error: "Missing or invalid 'fileKey'" }, { status: 400, headers });
  }
  if (!Array.isArray(body.components)) {
    return NextResponse.json({ error: "Missing or invalid 'components'" }, { status: 400, headers });
  }
  if (body.components.length > MAX_COMPONENTS) {
    return NextResponse.json(
      { error: `Too many components (max ${MAX_COMPONENTS})` },
      { status: 400, headers },
    );
  }

  const components: SyncComponentFingerprint[] = [];
  for (const item of body.components) {
    const parsed = parseComponent(item);
    if (!parsed) {
      return NextResponse.json(
        { error: "Each component needs string figmaKey, figmaNode, name, contentHash" },
        { status: 400, headers },
      );
    }
    components.push(parsed);
  }

  try {
    const report = computeFileSync(body.fileKey, components, getAllDocs());
    writeSyncReport(report);
    return NextResponse.json(
      { ok: true, fileKey: body.fileKey, summary: summarize(report, body.fileKey) },
      { headers },
    );
  } catch {
    return NextResponse.json({ error: "Failed to record sync check" }, { status: 500, headers });
  }
}
