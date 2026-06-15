import type { NextRequest } from "next/server";
import { authorizeLocalRequest } from "./localAccess";
import { assertContentLength, PayloadTooLargeError } from "./requestLimits";

export type MutationRequestError = {
  error: string;
  status: 401 | 403 | 413 | 415;
};

export function validateSameOriginRequest(
  req: NextRequest,
): MutationRequestError | null {
  const result = authorizeLocalRequest(req);
  if (result.ok) return null;
  return {
    error: result.error === "Request origin is not allowed"
      ? "Origin not allowed"
      : result.error,
    status: result.status,
  };
}

export function validateJsonMutationRequest(
  req: NextRequest,
  maxBytes?: number,
): MutationRequestError | null {
  const mediaType = (req.headers.get("content-type") ?? "")
    .split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (mediaType !== "application/json") {
    return { error: "Content-Type must be application/json", status: 415 };
  }

  const accessError = validateSameOriginRequest(req);
  if (accessError) return accessError;

  if (maxBytes !== undefined) {
    try {
      assertContentLength(req.headers, maxBytes);
    } catch (error) {
      if (error instanceof PayloadTooLargeError) {
        return { error: error.message, status: 413 };
      }
      throw error;
    }
  }

  return null;
}
