interface InboxItem {
  name: string;
  slug: string[];
}

interface SaveInboxResponse {
  ok?: boolean;
  slug?: string[];
  error?: string;
}

export async function saveInboxItem(item: InboxItem, folder: string): Promise<{
  httpOk: boolean;
  data: SaveInboxResponse;
}> {
  const name = item.slug.at(-1) ?? item.name;
  const response = await fetch("/api/specs/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromSlug: item.slug,
      group: folder.trim() || "Components",
      name,
    }),
  });

  return {
    httpOk: response.ok,
    data: (await response.json()) as SaveInboxResponse,
  };
}
