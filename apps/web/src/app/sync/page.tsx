import Link from "next/link";
import { getAllDocs } from "@/lib/contentCache";
import { readSyncReport, type SyncReport, type SyncSpecEntry } from "@/lib/sync";
import { formatRelative, isStale } from "@/lib/relativeTime";

export const dynamic = "force-dynamic";

function humanize(s: string): string {
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface Row {
  slug: string[];
  name: string;
  entry: SyncSpecEntry;
}

function buildGroups(report: SyncReport, nameBySlug: Map<string, string>) {
  // file key -> { drifted, missing, inSync }
  const groups = new Map<string, { drifted: Row[]; missing: Row[]; inSync: Row[] }>();
  const ensure = (file: string) => {
    if (!groups.has(file)) groups.set(file, { drifted: [], missing: [], inSync: [] });
    return groups.get(file)!;
  };
  for (const file of Object.keys(report.files)) ensure(file);

  for (const [slugKey, entry] of Object.entries(report.specs)) {
    const slug = slugKey.split("/");
    const row: Row = { slug, name: nameBySlug.get(slugKey) ?? humanize(slug[slug.length - 1]), entry };
    const bucket = ensure(entry.figmaFile);
    if (entry.status === "drifted") bucket.drifted.push(row);
    else if (entry.status === "missing-in-figma") bucket.missing.push(row);
    else bucket.inSync.push(row);
  }
  return groups;
}

export default function SyncPage() {
  const report = readSyncReport();
  const docs = getAllDocs();
  const nameBySlug = new Map(docs.map((d) => [d.slug.join("/"), d.frontmatter.name]));

  if (!report || Object.keys(report.files).length === 0) {
    return (
      <div className="content-inner">
        <h1>Sync</h1>
        <p className="home-sub">
          How your saved specs compare to Figma. Refresh by running <strong>Check library
          sync</strong> in the Figma plugin.
        </p>
        <div className="empty-state">
          <p>No sync checks yet.</p>
          <p>
            Open the Spec Layer plugin in Figma and run <strong>Check library sync</strong> to
            see what&apos;s changed.
          </p>
        </div>
      </div>
    );
  }

  const groups = buildGroups(report, nameBySlug);
  const totals = { drifted: 0, missing: 0, inSync: 0, newInFigma: 0 };
  for (const g of groups.values()) {
    totals.drifted += g.drifted.length;
    totals.missing += g.missing.length;
    totals.inSync += g.inSync.length;
  }
  for (const f of Object.values(report.files)) totals.newInFigma += f.newInFigma.length;

  const fileKeys = Object.keys(report.files).sort();

  return (
    <div className="content-inner">
      <h1>Sync</h1>
      <p className="home-sub">
        How your saved specs compare to Figma. Refresh by running <strong>Check library
        sync</strong> in the Figma plugin.
      </p>

      <div className="sync-chips">
        <span className="sync-chip warn">Out of date {totals.drifted}</span>
        <span className="sync-chip">Not in Figma {totals.missing}</span>
        <span className="sync-chip ok">In sync {totals.inSync}</span>
        <span className="sync-chip">Undocumented {totals.newInFigma}</span>
      </div>

      {fileKeys.map((fileKey) => {
        const g = groups.get(fileKey)!;
        const file = report.files[fileKey];
        const stale = isStale(file.checkedAt);
        return (
          <section key={fileKey} className="sync-file">
            <div className="sync-file-head">
              <h2 className="home-section-title">{fileKey}</h2>
              <span className="sync-file-meta">
                Last checked {formatRelative(file.checkedAt)} · {file.scannedCount} scanned
                {stale ? " — run a fresh check for current status" : ""}
              </span>
            </div>

            {g.drifted.length > 0 && (
              <div className="sync-section">
                <h3>Out of date ({g.drifted.length})</h3>
                <ul className="sync-list">
                  {g.drifted.map((r) => (
                    <li key={r.slug.join("/")}>
                      <Link href={"/components/" + r.slug.join("/")}>{r.name}</Link>
                      <span className="sync-row-meta">
                        checked {formatRelative(r.entry.checkedAt)}
                      </span>
                      <span className="sync-row-hint">
                        Re-extract in Figma and send to docs to update.
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {g.missing.length > 0 && (
              <div className="sync-section">
                <h3>Not found in Figma ({g.missing.length})</h3>
                <ul className="sync-list">
                  {g.missing.map((r) => (
                    <li key={r.slug.join("/")}>
                      <Link href={"/components/" + r.slug.join("/")}>{r.name}</Link>
                      <span className="sync-row-hint">
                        Wasn&apos;t in the last scan — may have been removed or renamed.
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {file.newInFigma.length > 0 && (
              <div className="sync-section">
                <h3>Undocumented in Figma ({file.newInFigma.length})</h3>
                <ul className="sync-list">
                  {file.newInFigma.map((n) => (
                    <li key={n.figmaKey}>
                      <span>{n.name}</span>
                      <span className="sync-row-hint">Exists in Figma, no spec yet.</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {g.inSync.length > 0 && (
              <details className="sync-section sync-insync">
                <summary>In sync ({g.inSync.length})</summary>
                <ul className="sync-list">
                  {g.inSync.map((r) => (
                    <li key={r.slug.join("/")}>
                      <Link href={"/components/" + r.slug.join("/")}>{r.name}</Link>
                      <span className="sync-row-meta">
                        checked {formatRelative(r.entry.checkedAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        );
      })}
    </div>
  );
}
