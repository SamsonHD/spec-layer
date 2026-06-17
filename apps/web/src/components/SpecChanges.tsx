import type { SpecDiff } from "@/lib/specDiff";

interface SpecChangesProps {
  diff: SpecDiff;
}

const CHANGE_LABEL: Record<string, string> = {
  added: "added",
  removed: "removed",
  changed: "changed",
};

/**
 * Collapsible diff of the deterministic sections a Figma re-extraction would
 * change. Judgment prose is excluded upstream (it is preserved on Update), so
 * this shows only what actually moves. Renders nothing when nothing changed.
 */
export default function SpecChanges({ diff }: SpecChangesProps) {
  if (diff.unchanged) return null;

  const summary = diff.sections
    .map((s) => `${s.heading} ${CHANGE_LABEL[s.change]}`)
    .join(" · ");

  return (
    <details className="spec-changes">
      <summary>
        What changed in Figma <span className="spec-changes-summary">({summary})</span>
      </summary>
      <p className="spec-changes-note">
        Written guidelines (Definition, Code, Accessibility, Do&apos;s &amp; Don&apos;ts) are kept;
        only the structural data below is refreshed.
      </p>
      {diff.sections.map((section) => (
        <div key={section.heading} className="spec-changes-section">
          <h4>
            {section.heading} <span className={`spec-changes-tag ${section.change}`}>{section.change}</span>
          </h4>
          <pre className="spec-changes-diff" aria-label={`${section.heading} ${section.change}`}>
            {section.lines.map((line, i) => (
              <span key={i} className={`diff-line diff-${line.type}`}>
                {line.type === "add" ? "+ " : line.type === "del" ? "- " : "  "}
                {line.text}
                {"\n"}
              </span>
            ))}
          </pre>
        </div>
      ))}
    </details>
  );
}
