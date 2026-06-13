import Link from "next/link";
import InboxFileForm from "@/components/InboxFileForm";
import { getAllDocs, getNavTree } from "@/lib/content";

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

  return (
    <div className="content-inner">
      <div className="inbox-head">
        <h1>Inbox</h1>
        <p>
          Components sent from the Figma plugin land here. Review each one and file it into your
          component groups — or delete it.{" "}
          {docs.length > 0 && (
            <>{docs.length} waiting to be filed.</>
          )}
        </p>
      </div>

      {docs.length === 0 ? (
        <div className="empty-state">
          <p>Nothing to process right now.</p>
          <p>
            When you send a component from the Figma plugin, it shows up here for review.
          </p>
          <p>
            <Link href="/">Back to docs home</Link>
          </p>
        </div>
      ) : (
        <div className="inbox-list">
          {docs.map((doc) => {
            const status = doc.frontmatter.status;
            return (
              <section key={doc.slug.join("/")} className="inbox-item">
                <div className="inbox-item-top">
                  <div>
                    <h2>{doc.frontmatter.name}</h2>
                    <div className="inbox-item-path">{doc.slug.join(" / ")}</div>
                  </div>
                  {status && <span className={`badge ${status}`}>{status}</span>}
                </div>

                <div className="inbox-item-meta">
                  <span>Missing required: {doc.missingRequired.length}</span>
                  <span>Issues: {doc.issues.length}</span>
                </div>

                {doc.issues.length > 0 && (
                  <ul className="issues-list inbox-issues">
                    {doc.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                )}

                <InboxFileForm
                  fromSlug={doc.slug}
                  initialName={doc.frontmatter.name}
                  groupOptions={groups}
                />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
