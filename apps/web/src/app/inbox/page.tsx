import Link from "next/link";
import InboxWorkspace from "@/components/InboxWorkspace";
import ManualImport from "@/components/ManualImport";
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
  const allDocs = getAllDocs();
  const docs = allDocs.filter((doc) => doc.slug[0] === "_inbox");
  const libraryDocs = allDocs.filter((doc) => doc.slug[0] !== "_inbox");
  const groups = collectTopLevelGroups();
  const summary = summarizeInbox(docs, libraryDocs);

  return (
    <div className="content-inner inbox-page">
      <div className="inbox-head">
        <div className="inbox-title-row">
          <h1>Inbox</h1>
          {docs.length > 0 ? <span>{formatComponentCount(summary.total)}</span> : null}
        </div>
        <p>
          Review components imported from Figma before adding them to your documentation.
        </p>
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

      <details className="inbox-add-panel">
        <summary>Add a component spec manually</summary>
        <div className="inbox-add-panel-body">
          <p style={{ margin: "0 0 12px", fontSize: "13px", color: "var(--text-muted)" }}>
            Export an <code>.md</code> from the Figma plugin, or upload / paste one here.
          </p>
          <ManualImport />
        </div>
      </details>
    </div>
  );
}
