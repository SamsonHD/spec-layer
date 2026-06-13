import type { ComponentDoc, NavNode } from "@/lib/content";

export function withoutInbox(nodes: NavNode[]): NavNode[] {
  return nodes.filter((node) => !(node.type === "folder" && node.slug[0] === "_inbox"));
}

export function getInboxCount(docs: ComponentDoc[]): number {
  return docs.filter((doc) => doc.slug[0] === "_inbox").length;
}
