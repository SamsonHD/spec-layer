import Link from "next/link";
import InboxSaveAll from "@/components/InboxSaveAll";
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
  const docs = getAllDocs().filter((doc) => doc.slug[0] === "_inbox");
  const groups = collectTopLevelGroups();
  const summary = summarizeInbox(docs);

  return (
    <div className="content-inner">
      <div className="inbox-head">
        <h1>Inbox</h1>
        <p>
          Components imported from Figma land here before they are added to your documentation.
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
        <section className="inbox-summary" aria-labelledby="inbox-summary-title">
          <div className="inbox-summary-head">
            <div>
              <h2 id="inbox-summary-title">Import summary</h2>
              <p>{formatComponentCount(summary.total)} ready to save.</p>
            </div>
            <InboxSaveAll items={summary.items} folderOptions={groups} />
          </div>

          <dl className="inbox-summary-stats">
            <div>
              <dt>Imported</dt>
              <dd>{summary.total}</dd>
            </div>
            <div>
              <dt>With issues</dt>
              <dd>{summary.withIssues}</dd>
            </div>
            <div>
              <dt>Missing required</dt>
              <dd>{summary.missingRequired}</dd>
            </div>
          </dl>

          <details className="inbox-component-list">
            <summary>View component names</summary>
            <ul>
              {summary.items.map((item) => (
                <li key={item.slug.join("/")}>{item.name}</li>
              ))}
            </ul>
          </details>
        </section>
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
