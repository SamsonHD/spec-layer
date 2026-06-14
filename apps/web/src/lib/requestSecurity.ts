import type { NextRequest } from "next/server";

export type MutationRequestError = {
  error: string;
  status: 403 | 415;
};

export function validateSameOriginRequest(
  req: NextRequest,
): MutationRequestError | null {
  const origin = req.headers.get("origin");
  if (origin !== null && origin !== new URL(req.url).origin) {
    return { error: "Origin not allowed", status: 403 };
  }
  return null;
}

export function validateJsonMutationRequest(
  req: NextRequest,
): MutationRequestError | null {
  const mediaType = (req.headers.get("content-type") ?? "")
    .split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (mediaType !== "application/json") {
    return { error: "Content-Type must be application/json", status: 415 };
  }

  return validateSameOriginRequest(req);
}
