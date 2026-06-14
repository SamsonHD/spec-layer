import Link from "next/link";
import { getAllDocs } from "@/lib/contentCache";
import ManualImport from "@/components/ManualImport";

export const dynamic = "force-dynamic";

export default function Home() {
  const docs = getAllDocs();

  return (
    <div className="content-inner">
      <h1>Design System</h1>
      <p style={{ color: "var(--text-muted)", marginTop: 0 }}>
        {docs.length} component{docs.length === 1 ? "" : "s"} documented. Specs are authored as
        markdown and rendered live from your folder.
      </p>

      {docs.length === 0 ? (
        <div className="empty-state">
          <p>No component specs found yet.</p>
          <p>
            Export an <code>.md</code> from the Figma plugin, or add one here.
          </p>
          <ManualImport />
        </div>
      ) : (
        <div className="overview-grid">
          {docs.map((doc) => {
            const status = doc.frontmatter.status;
            return (
              <Link
                key={doc.slug.join("/")}
                href={"/components/" + doc.slug.join("/")}
                className="overview-card"
              >
                <div className="oc-top">
                  <span className="oc-name">{doc.frontmatter.name}</span>
                  {status && <span className={`badge ${status}`}>{status}</span>}
                </div>
                <div className="oc-path">{doc.slug.join(" / ")}</div>
                {doc.missingRequired.length > 0 && (
                  <div className="oc-missing">⚠ Missing: {doc.missingRequired.join(", ")}</div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
