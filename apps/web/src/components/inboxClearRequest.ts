export interface InboxClearFailure {
  source: string[];
  error: string;
}

export interface InboxClearResponse {
  ok?: boolean;
  deleted?: string[][];
  failures?: InboxClearFailure[];
  error?: string;
}

export async function clearInboxItems(
  slugs: string[][],
): Promise<{ httpOk: boolean; data: InboxClearResponse }> {
  const response = await fetch("/api/specs/clear", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: slugs }),
  });
  const data = (await response.json()) as InboxClearResponse;
  return { httpOk: response.ok, data };
}
