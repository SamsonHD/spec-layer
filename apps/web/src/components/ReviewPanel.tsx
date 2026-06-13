import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ReviewBar from "./ReviewBar";

/**
 * One consolidated surface for everything an author/reviewer needs and a reader
 * doesn't: draft status, missing sections, validation issues, the
 * regenerate/approve actions, and (collapsed) extraction gaps.
 *
 * The component page renders this only when there's something to act on, so an
 * approved & complete spec shows none of it.
 */
export default function ReviewPanel({
  slug,
  isDraft,
  missingRequired,
  issues,
  gapsMarkdown,
}: {
  slug: string[];
  isDraft: boolean;
  missingRequired: string[];
  issues: string[];
  gapsMarkdown: string | null;
}) {
  const heading = isDraft ? "Draft — needs review" : "Needs attention";
  // Strip the leading "## Extraction gaps" heading; the <summary> already labels it.
  const gapsBody = gapsMarkdown
    ? gapsMarkdown.replace(/^\s*#{1,6}\s+.*\r?\n?/, "")
    : null;

  return (
    <section className="review-panel">
      <div className="review-panel-head">⚠ {heading}</div>
      <p className="review-panel-sub">
        {isDraft
          ? "AI-drafted sections are unverified until approved. Review the content, then approve to publish."
          : "This published spec has open issues. Review them below."}
      </p>

      {missingRequired.length > 0 && (
        <p className="review-panel-sub" style={{ marginBottom: issues.length ? 8 : 14 }}>
          <strong>Missing required section{missingRequired.length > 1 ? "s" : ""}:</strong>{" "}
          {missingRequired.join(", ")}.
        </p>
      )}

      {issues.length > 0 && (
        <ul className="review-issues">
          {issues.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      )}

      {isDraft && <ReviewBar slug={slug} />}

      {gapsBody && gapsBody.trim() && (
        <details className="review-gaps">
          <summary>Extraction gaps</summary>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{gapsBody}</ReactMarkdown>
        </details>
      )}
    </section>
  );
}
