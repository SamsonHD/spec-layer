interface UpdateInboxResponse {
  ok?: boolean;
  slug?: string[];
  error?: string;
}

/**
 * POST an inbox draft + its library target to /api/specs/update, performing the
 * section-preserving merge that resolves drift without losing judgment prose.
 */
export async function updateInboxItem(
  source: string[],
  targetSlug: string[],
): Promise<{ httpOk: boolean; data: UpdateInboxResponse }> {
  const response = await fetch("/api/specs/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, targetSlug }),
  });
  return {
    httpOk: response.ok,
    data: (await response.json()) as UpdateInboxResponse,
  };
}
