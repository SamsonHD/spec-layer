import { notFound } from "next/navigation";
import { getDoc } from "@/lib/content";
import { readStoredSpec } from "@/lib/specWriter";
import { partitionBody } from "@/lib/sections";
import FigmaSection from "@/components/FigmaSection";
import ReviewPanel from "@/components/ReviewPanel";
import ComponentTabs from "@/components/ComponentTabs";

// Read the content repo live on each request so edits/new files show up
// without a rebuild (the "live backend" model).
export const dynamic = "force-dynamic";

function formatDate(iso: string | null): string {
  if (!iso) return "unknown";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function ComponentPage({ params }: { params: { slug: string[] } }) {
  const doc = getDoc(params.slug);
  if (!doc) notFound();

  const { frontmatter: fm, body, updated, missingRequired, issues, slug } = doc;
  const status = fm.status ?? "unknown";
  const hasDraftMarker = />\s*[^A-Za-z]*Draft\s*[—–-]/i.test(body);
  const breadcrumb = slug
    .slice(0, -1)
    .map((s) => s.replace(/[-_]/g, " "))
    .join(" / ");

  const { guidelinesMarkdown, specsMarkdown, gapsMarkdown, otherMarkdown } =
    partitionBody(body);

  // Anything we couldn't classify still appears in Guidelines so no content
  // is silently dropped.
  const guidelinesBody = [guidelinesMarkdown, otherMarkdown]
    .filter((s) => s.trim().length > 0)
    .join("\n\n");

  // JSON sidecar (preferred source for the Specs tab); null for legacy docs.
  const storedSpec = readStoredSpec(slug);

  // Author/review chrome only shows when there's something to act on — readers
  // of an approved, complete spec see a clean page.
  const isDraft = status === "draft" || hasDraftMarker;
  const needsReview =
    isDraft || missingRequired.length > 0 || issues.length > 0 || !!gapsMarkdown;

  return (
    <>
      <header className="doc-header">
        <div className="title-wrap">
          <div>
            {breadcrumb && <div className="breadcrumb">{breadcrumb}</div>}
            <h1>{fm.name}</h1>
          </div>
          <span className={`badge ${status}`}>{status}</span>
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

        <FigmaSection slug={slug} figma={fm.figma} figmaRef={fm.figmaRef} editable={isDraft} />

        {needsReview && (
          <ReviewPanel
            slug={slug}
            isDraft={isDraft}
            missingRequired={missingRequired}
            issues={issues}
            gapsMarkdown={gapsMarkdown}
          />
        )}

        <ComponentTabs
          slug={slug}
          guidelinesMarkdown={guidelinesBody}
          specsMarkdownFallback={specsMarkdown}
          spec={storedSpec}
          figmaRef={fm.figmaRef}
        />
      </div>
    </>
  );
}
