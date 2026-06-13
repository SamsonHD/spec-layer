import Link from "next/link";
import { getAllDocs } from "@/lib/content";
import { getContentDir, isDefaultDir } from "@/lib/config";
import ChooseFolderButton from "@/components/ChooseFolderButton";

export const dynamic = "force-dynamic";

export default function Home() {
  const docs = getAllDocs();
  const contentDir = getContentDir();
  const onSample = isDefaultDir();

  return (
    <div className="content-inner">
      <h1>Design System</h1>
      <p style={{ color: "var(--text-muted)", marginTop: 0 }}>
        {docs.length} component{docs.length === 1 ? "" : "s"} documented. Specs are authored as
        markdown and rendered live from your folder.
      </p>

      {onSample && docs.length > 0 && (
        <div className="banner">
          <span style={{ flex: 1, minWidth: 200 }}>
            You’re viewing the bundled <strong>sample content</strong>. Point this at your own design
            system folder to see your specs.
          </span>
          <ChooseFolderButton label="Choose your folder…" />
        </div>
      )}

      {docs.length === 0 ? (
        <div className="empty-state">
          <p>No component specs found in this folder.</p>
          <p style={{ marginBottom: 4 }}>
            Currently reading: <code>{contentDir}</code>
          </p>
          <p>
            Select a folder that contains your component <code>.md</code> files — its subfolders
            become the navigation.
          </p>
          <div style={{ marginTop: 16 }}>
            <ChooseFolderButton label="Choose your design system folder…" />
          </div>
        </div>
      ) : (
        <div className="overview-grid">
          {docs.map((doc) => {
            const status = doc.frontmatter.status || "unknown";
            return (
              <Link
                key={doc.slug.join("/")}
                href={"/components/" + doc.slug.join("/")}
                className="overview-card"
              >
                <div className="oc-top">
                  <span className="oc-name">{doc.frontmatter.name}</span>
                  <span className={`badge ${status}`}>{status}</span>
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
