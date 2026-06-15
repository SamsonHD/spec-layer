import { notFound } from "next/navigation";
import { getDoc } from "@/lib/content";
import { readStoredSpec } from "@/lib/specWriter";
import { partitionBody } from "@/lib/sections";
import FigmaSection from "@/components/FigmaSection";
import ComponentTabs from "@/components/ComponentTabs";
import GapsAlert from "@/components/GapsAlert";

// Read the content repo live on each request so edits/new files show up
// without a rebuild (the "live backend" model).
export const dynamic = "force-dynamic";

function formatDate(iso: string | null): string {
  if (!iso) return "unknown";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: requestedSlug } = await params;
  const doc = getDoc(requestedSlug);
  if (!doc) notFound();

  const { frontmatter: fm, body, updated, missingRequired, issues, slug } = doc;
  const breadcrumb = slug
    .slice(0, -1)
    .map((s) => s.replace(/[-_]/g, " "))
    .join(" / ");

  const { specsMarkdown, gapsMarkdown } = partitionBody(body);

  // JSON sidecar (preferred source for the Specs tab); null for legacy docs.
  const storedSpec = readStoredSpec(slug);

  return (
    <>
      <header className="doc-header">
        <div className="title-wrap">
          <div>
            {breadcrumb && <div className="breadcrumb">{breadcrumb}</div>}
            <h1>{fm.name}</h1>
          </div>
          {fm.status && <span className={`badge ${fm.status}`}>{fm.status}</span>}
        </div>
        <div className="header-actions">
          {fm.figma && (
            <a className="btn-link" href={fm.figma} target="_blank" rel="noreferrer">
              Figma ↗
            </a>
          )}
          {fm.storybook && (
            <a className="btn-link" href={fm.storybook} target="_blank" rel="noreferrer">
              Storybook ↗
            </a>
          )}
        </div>
      </header>

      <div className="content-inner">
        <div className="meta-row">
          {fm.version && <span>v{fm.version}</span>}
          <span>Updated {formatDate(updated)}</span>
          {fm.tags?.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        <GapsAlert
          missingRequired={missingRequired}
          issues={issues}
          gapsMarkdown={gapsMarkdown}
        />

        <FigmaSection slug={slug} figma={fm.figma} figmaRef={fm.figmaRef} editable={true} />

        {/* Pass the FULL body (not the partitioned Guidelines subset): inline
            editing operates on full-body section indices so the section API —
            which reads the full file — edits the exact section the user clicked. */}
        <ComponentTabs
          slug={slug}
          fullBody={body}
          specsMarkdownFallback={specsMarkdown}
          spec={storedSpec}
          figmaRef={fm.figmaRef}
        />
      </div>
    </>
  );
}
