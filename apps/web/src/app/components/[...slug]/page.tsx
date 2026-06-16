import Link from "next/link";
import { notFound } from "next/navigation";
import { getDoc } from "@/lib/content";
import { getAllDocs } from "@/lib/contentCache";
import { getSpecSyncStatus } from "@/lib/sync";
import { formatRelative } from "@/lib/relativeTime";
import { readStoredSpec } from "@/lib/specWriter";
import { readCachedDrafts } from "@/lib/aiDraftCache";
import { findPristineGuidelines } from "@/lib/guidelineFill";
import { partitionBody } from "@/lib/sections";
import FigmaSection from "@/components/FigmaSection";
import ComponentTabs from "@/components/ComponentTabs";
import GapsAlert from "@/components/GapsAlert";
import SyncAlert from "@/components/SyncAlert";

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
  const isInboxDoc = slug[0] === "_inbox";
  const breadcrumb = slug
    .slice(0, -1)
    .map((s) => s.replace(/[-_]/g, " "))
    .join(" / ");

  const { specsMarkdown, gapsMarkdown } = partitionBody(body);

  // Drift status from the persisted sync report (additive; null when unknown).
  const sync = isInboxDoc ? null : getSpecSyncStatus(slug);

  // A waiting inbox re-extraction (matched by figma_key) enables a one-click
  // Update from the drift banner; otherwise the banner points at the plugin.
  let updateSource: string[] | undefined;
  if (sync?.status === "drifted" && fm.figmaKey) {
    updateSource = getAllDocs().find(
      (d) => d.slug[0] === "_inbox" && d.frontmatter.figmaKey === fm.figmaKey,
    )?.slug;
  }

  // JSON sidecar (preferred source for the Specs tab); null for legacy docs.
  const storedSpec = readStoredSpec(slug);

  // Guideline sections whose content still equals the cached AI draft. The
  // "Regenerate" control is hidden for these (it would regenerate to the same
  // cached text); it appears once a human edits the section away from the draft.
  const pristineGuidelines = storedSpec
    ? findPristineGuidelines(body, await readCachedDrafts(storedSpec))
    : [];

  return (
    <>
      <header className="doc-header">
        <div className="title-wrap">
          <div>
            {isInboxDoc ? (
              <div className="breadcrumb">
                <Link href="/inbox">Inbox</Link>
              </div>
            ) : breadcrumb ? (
              <div className="breadcrumb">{breadcrumb}</div>
            ) : null}
            <h1>{fm.name}</h1>
          </div>
          {fm.status && <span className={`badge ${fm.status}`}>{fm.status}</span>}
        </div>
        <div className="header-actions">
          {isInboxDoc ? (
            <Link className="btn-link" href="/inbox">
              Back to inbox
            </Link>
          ) : null}
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
          {sync?.status === "in-sync" && (
            <span className="sync-ok">✓ In sync with Figma · checked {formatRelative(sync.checkedAt)}</span>
          )}
        </div>

        <SyncAlert
          status={sync}
          extractedAt={fm.extractedAt}
          slug={slug}
          updateSource={updateSource}
        />

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
          pristineGuidelines={pristineGuidelines}
        />
      </div>
    </>
  );
}
