import Link from "next/link";
import { getAllDocs } from "@/lib/contentCache";
import { getHomeStats } from "@/lib/homeStats";
import { readSyncReport } from "@/lib/sync";
import { getRepoUrl } from "@/lib/repo";
import ManualImport from "@/components/ManualImport";

export const dynamic = "force-dynamic";

const GUIDE_STEPS = [
  {
    title: "Export from Figma",
    body: "Run the Figma plugin on a component to generate its spec as a Markdown file.",
  },
  {
    title: "Land in the Inbox",
    body: "Exported specs arrive in the Inbox, where you can review them before they go live.",
  },
  {
    title: "Review & save",
    body: "Check the spec, fill any missing required sections, then save it into the library.",
  },
  {
    title: "Organize",
    body: "Drag pages into categories in the sidebar to shape your documentation structure.",
  },
];

export default function Home() {
  const docs = getAllDocs();
  const stats = getHomeStats(docs, readSyncReport());
  const repoUrl = getRepoUrl();

  if (stats.total === 0 && stats.inbox === 0) {
    return (
      <div className="content-inner">
        <h1>Design System</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 0 }}>
          Markdown-driven design system documentation.
        </p>
        <div className="empty-state">
          <p>No component specs found yet.</p>
          <p>
            Export an <code>.md</code> from the Figma plugin, or add one here.
          </p>
          <ManualImport />
        </div>
      </div>
    );
  }

  const liveDocs = docs.filter((doc) => doc.slug[0] !== "_inbox");

  return (
    <div className="content-inner">
      <div className="home-head">
        <div>
          <h1>Design System</h1>
          <p className="home-sub">
            Specs are authored as markdown and rendered live from your folder.
          </p>
        </div>
        {repoUrl && (
          <a className="repo-link" href={repoUrl} target="_blank" rel="noreferrer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>Repository</span>
          </a>
        )}
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Components</span>
        </div>
        {stats.byStatus.map(({ status, count }) => (
          <div key={status} className="stat-card">
            <span className="stat-value">{count}</span>
            <span className={`stat-label stat-status ${status}`}>{status}</span>
          </div>
        ))}
        {stats.needsAttention > 0 && (
          <div className="stat-card stat-warn">
            <span className="stat-value">{stats.needsAttention}</span>
            <span className="stat-label">Needs attention</span>
          </div>
        )}
        <Link
          href="/sync"
          className={`stat-card stat-card-link${stats.outOfDate ? " stat-warn" : ""}`}
        >
          <span className="stat-value">{stats.outOfDate ?? "—"}</span>
          <span className="stat-label">Out of date</span>
        </Link>
        <Link href="/inbox" className="stat-card stat-card-link">
          <span className="stat-value">{stats.inbox}</span>
          <span className="stat-label">In inbox</span>
        </Link>
      </div>

      <section className="guide-card">
        <h2 className="guide-title">Getting started</h2>
        <ol className="guide-steps">
          {GUIDE_STEPS.map((step, i) => (
            <li key={step.title} className="guide-step">
              <span className="guide-num">{i + 1}</span>
              <div>
                <div className="guide-step-title">{step.title}</div>
                <div className="guide-step-body">{step.body}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <h2 className="home-section-title">Components</h2>
      {liveDocs.length === 0 ? (
        <p className="home-sub">No components saved yet — check the Inbox to review pending specs.</p>
      ) : (
        <div className="overview-grid">
          {liveDocs.map((doc) => {
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
