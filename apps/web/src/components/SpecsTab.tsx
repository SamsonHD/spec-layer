"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { IntermediateSpec, VariantInstance } from "@spec-layer/extractor";
import { resolveTokensForVariant } from "@spec-layer/extractor";

interface FigmaRefProp {
  fileKey: string;
  nodeId: string;
}

/** Reasonable "unknown" placeholder produced by the plugin when figma.fileKey is missing. */
const UNKNOWN_FILE_KEY = "unknown";

export default function SpecsTab({
  spec,
  fallbackMarkdown,
  figmaRef,
}: {
  spec: IntermediateSpec | null;
  fallbackMarkdown: string;
  figmaRef?: FigmaRefProp;
}) {
  // Legacy doc (no JSON sidecar) — fall back to the markdown spec sections.
  if (!spec) {
    if (!fallbackMarkdown.trim()) {
      return (
        <div className="empty-state">
          <p>No spec data available for this component yet. Re-export it from the plugin to populate the variant grid, anatomy, and token inspector.</p>
        </div>
      );
    }
    return (
      <article className="md">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
          {fallbackMarkdown}
        </ReactMarkdown>
      </article>
    );
  }

  const fileKey = (figmaRef?.fileKey && figmaRef.fileKey !== UNKNOWN_FILE_KEY)
    ? figmaRef.fileKey
    : (spec.figmaFile && spec.figmaFile !== UNKNOWN_FILE_KEY ? spec.figmaFile : null);
  return (
    <div className="specs-tab">
      <AnatomySection spec={spec} />
      <ConfigurationSection spec={spec} />
      <VariantsSection spec={spec} fileKey={fileKey} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Anatomy
// ---------------------------------------------------------------------------

function AnatomySection({ spec }: { spec: IntermediateSpec }) {
  if (!spec.anatomy.length) return null;
  return (
    <section className="spec-section">
      <h2>Anatomy</h2>
      <ol className="anatomy-list">
        {spec.anatomy.map((part, i) => (
          <li key={`${part.name}-${i}`}>
            <span className="anatomy-name">{part.name}</span>
            {part.nested && <span className="anatomy-badge">component</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Configuration (props table)
// ---------------------------------------------------------------------------

function ConfigurationSection({ spec }: { spec: IntermediateSpec }) {
  if (!spec.props.length) return null;
  return (
    <section className="spec-section">
      <h2>Properties</h2>
      <div className="props-table-wrap">
        <table className="props-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Kind</th>
              <th>Options</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            {spec.props.map((p) => (
              <tr key={p.name}>
                <td><code>{p.name}</code></td>
                <td>{p.kind}</td>
                <td>{describeOptions(p.kind, p.options)}</td>
                <td>{formatDefault(p.default)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function describeOptions(kind: string, options?: string[]): string {
  if (kind === "boolean") return "true · false";
  if (options?.length) return options.join(" · ");
  return "—";
}

function formatDefault(value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

// ---------------------------------------------------------------------------
// Variants — grid + axis filters + per-variant inspector
// ---------------------------------------------------------------------------

interface ImagesState {
  status: "idle" | "loading" | "ok" | "no-token" | "error";
  images: Record<string, string | null>;
  message?: string;
}

function VariantsSection({
  spec,
  fileKey,
}: {
  spec: IntermediateSpec;
  fileKey: string | null;
}) {
  const instances = useMemo(() => spec.variantInstances ?? [], [spec]);

  const axisOrder = useMemo(() => buildAxisOrder(spec, instances), [spec, instances]);
  const axisValues = useMemo(() => buildAxisValues(axisOrder, instances), [axisOrder, instances]);

  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = useMemo(() => {
    return instances.filter((inst) => {
      for (const [axis, value] of Object.entries(filters)) {
        if (value && inst.values[axis] !== value) return false;
      }
      return true;
    });
  }, [instances, filters]);

  const [images, setImages] = useState<ImagesState>({ status: "idle", images: {} });

  useEffect(() => {
    if (!fileKey) {
      setImages({ status: "idle", images: {} });
      return;
    }
    const ids = instances.map((i) => i.nodeId).filter(Boolean);
    if (!ids.length) return;
    let cancelled = false;
    setImages((prev) => ({ ...prev, status: "loading" }));
    fetch(`/api/figma-variants?fileKey=${encodeURIComponent(fileKey)}&ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((d: { status: string; images?: Record<string, string | null>; message?: string }) => {
        if (cancelled) return;
        if (d.status === "ok" && d.images) {
          setImages({ status: "ok", images: d.images });
        } else if (d.status === "no-token") {
          setImages({ status: "no-token", images: {}, message: d.message });
        } else {
          setImages({ status: "error", images: {}, message: d.message });
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setImages({ status: "error", images: {}, message: e instanceof Error ? e.message : "request failed" });
      });
    return () => { cancelled = true; };
  }, [fileKey, instances]);

  const selected = selectedId ? instances.find((i) => i.nodeId === selectedId) ?? null : null;

  if (!instances.length) return null;

  return (
    <section className="spec-section">
      <div className="variants-head">
        <h2>Variants</h2>
        <span className="variants-count">
          {visible.length === instances.length
            ? `${instances.length} total`
            : `${visible.length} of ${instances.length}`}
        </span>
      </div>

      {axisOrder.length > 0 && (
        <div className="variant-filters">
          {axisOrder.map((axis) => (
            <div key={axis} className="filter-group">
              <span className="filter-label">{axis}</span>
              <div className="filter-chips">
                <button
                  className={`chip${!filters[axis] ? " active" : ""}`}
                  onClick={() => setFilters((f) => ({ ...f, [axis]: null }))}
                >
                  All
                </button>
                {axisValues[axis].map((value) => (
                  <button
                    key={value}
                    className={`chip${filters[axis] === value ? " active" : ""}`}
                    onClick={() =>
                      setFilters((f) => ({ ...f, [axis]: f[axis] === value ? null : value }))
                    }
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.status === "no-token" && (
        <div className="variants-banner">
          Live previews disabled — set <code>FIGMA_TOKEN</code> to render variant images from Figma.
        </div>
      )}
      {images.status === "error" && (
        <div className="variants-banner error">
          Couldn&apos;t load variant images{images.message ? ` — ${images.message}` : ""}.
        </div>
      )}

      <div className="variant-grid">
        {visible.map((inst) => (
          <VariantCard
            key={inst.nodeId || inst.name}
            instance={inst}
            imageUrl={images.images[inst.nodeId] ?? null}
            imagesStatus={images.status}
            selected={selectedId === inst.nodeId}
            onSelect={() =>
              setSelectedId((curr) => (curr === inst.nodeId ? null : inst.nodeId))
            }
          />
        ))}
        {visible.length === 0 && (
          <div className="variants-empty">No variants match the current filters.</div>
        )}
      </div>

      {selected && (
        <VariantInspectorModal
          instance={selected}
          spec={spec}
          imageUrl={images.images[selected.nodeId] ?? null}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  );
}

function VariantCard({
  instance,
  imageUrl,
  imagesStatus,
  selected,
  onSelect,
}: {
  instance: VariantInstance;
  imageUrl: string | null;
  imagesStatus: ImagesState["status"];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`variant-card${selected ? " selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <div className="variant-preview">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={instance.name} loading="lazy" />
        ) : (
          <div className="variant-preview-fallback">
            {imagesStatus === "loading" ? "…" : ""}
          </div>
        )}
      </div>
      <dl className="variant-meta">
        {Object.entries(instance.values).map(([axis, value]) => (
          <div key={axis} className="variant-meta-row">
            <dt>{axis}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </button>
  );
}

function VariantInspectorModal({
  instance,
  spec,
  imageUrl,
  onClose,
}: {
  instance: VariantInstance;
  spec: IntermediateSpec;
  imageUrl: string | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and handle Escape while the modal is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);

    // Move focus into the modal on open.
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const resolved = useMemo(
    () => resolveTokensForVariant(spec.tokens, instance.values),
    [spec.tokens, instance.values],
  );

  const groups = useMemo(() => {
    const map = new Map<string, { part: string; rows: { property: string; token: string }[] }>();
    for (const r of resolved) {
      const g = map.get(r.part) ?? { part: r.part, rows: [] };
      g.rows.push({ property: r.property, token: r.token });
      map.set(r.part, g);
    }
    return [...map.values()];
  }, [resolved]);

  const modal = (
    // Backdrop — click outside to close.
    <div
      className="inspector-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="presentation"
    >
      <div
        className="inspector-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Inspecting variant: ${instance.name}`}
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="inspector-modal-head">
          <div>
            <div className="inspector-eyebrow">Inspecting variant</div>
            <h3>{instance.name}</h3>
          </div>
          <button className="inspector-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="inspector-modal-body">
          <div className="inspector-preview">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={instance.name} />
            ) : (
              <div className="inspector-preview-fallback">No preview</div>
            )}
          </div>

          <div className="inspector-data">
            <section>
              <h4>Property values</h4>
              <dl className="kv">
                {Object.entries(instance.values).map(([axis, value]) => (
                  <div key={axis} className="kv-row">
                    <dt>{axis}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <h4>Tokens</h4>
              {groups.length === 0 ? (
                <p className="muted">No tokens resolved for this variant.</p>
              ) : (
                groups.map((g) => (
                  <div key={g.part} className="inspector-token-group">
                    <div className="inspector-token-part">{g.part}</div>
                    <table className="props-table">
                      <thead>
                        <tr><th>Property</th><th>Token</th></tr>
                      </thead>
                      <tbody>
                        {g.rows.map((row, i) => (
                          <tr key={`${row.property}-${i}`}>
                            <td>{row.property}</td>
                            <td><code>{row.token}</code></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  // Render into document.body so the modal escapes any overflow:hidden containers.
  return typeof document !== "undefined"
    ? createPortal(modal, document.body)
    : null;
}

/**
 * Derive the axis list. Prefer the order from `spec.variants` (so axes appear
 * in the order Figma reports them), then fall back to the order observed in
 * the variant instances. Single-value axes are kept for the inspector but
 * hidden from the filter UI by callers if desired.
 */
function buildAxisOrder(spec: IntermediateSpec, instances: VariantInstance[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of spec.variants ?? []) {
    if (v.values?.length && !seen.has(v.prop)) {
      seen.add(v.prop);
      out.push(v.prop);
    }
  }
  for (const inst of instances) {
    for (const axis of Object.keys(inst.values)) {
      if (!seen.has(axis)) {
        seen.add(axis);
        out.push(axis);
      }
    }
  }
  // Hide axes that have only one observed value from filters — they don't
  // discriminate so the chips would only have one option.
  return out.filter((axis) => {
    const values = new Set(instances.map((i) => i.values[axis]).filter(Boolean));
    return values.size > 1;
  });
}

function buildAxisValues(axes: string[], instances: VariantInstance[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const axis of axes) {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const inst of instances) {
      const v = inst.values[axis];
      if (v && !seen.has(v)) {
        seen.add(v);
        list.push(v);
      }
    }
    out[axis] = list;
  }
  return out;
}
