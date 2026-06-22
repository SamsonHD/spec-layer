import Link from "next/link";
import ImportComponent from "@/components/ImportComponent";
import InboxWorkspace from "@/components/InboxWorkspace";
import { getAllDocs, getNavTree } from "@/lib/contentCache";
import { formatComponentCount, summarizeInbox } from "@/lib/inboxSummary";

export const dynamic = "force-dynamic";

function collectTopLevelGroups(): string[] {
  return getNavTree()
    .filter((node) => node.type === "folder" && node.slug[0] !== "_inbox")
    .map((node) => node.slug[0])
    .filter((value): value is string => typeof value === "string" && value.length > 0);
}

export default function InboxPage() {
  const docs = getAllDocs().filter((doc) => doc.slug[0] === "_inbox");
  const groups = collectTopLevelGroups();
  const summary = summarizeInbox(docs);

  return (
    <div className="content-inner inbox-page">
      <div className="inbox-head">
        <div className="inbox-head-main">
          <div className="inbox-title-row">
            <h1>Inbox</h1>
            {docs.length > 0 ? <span>{formatComponentCount(summary.total)}</span> : null}
          </div>
          <p>
            Review components imported from Figma before adding them to your documentation.
          </p>
        </div>
        <ImportComponent />
      </div>

      {docs.length === 0 ? (
        <div className="empty-state">
          <p>Nothing to process right now.</p>
          <p>
            When you import components from the Figma plugin, a summary appears here.
          </p>
          <p>
            <Link href="/">Back to docs home</Link>
          </p>
        </div>
      ) : (
        <InboxWorkspace items={summary.items} folderOptions={groups} />
      )}
    </div>
  );
}
