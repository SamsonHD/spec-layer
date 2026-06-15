import React from "react";

interface SectionSkeletonProps {
  lines?: number;
  label?: string;
}

export default function SectionSkeleton({
  lines = 3,
  label = "Loading section…",
}: SectionSkeletonProps) {
  const lineCount = Math.max(0, Math.floor(lines));

  return (
    <div className="section-skeleton" role="status" aria-busy="true">
      <span>{label}</span>
      {Array.from({ length: lineCount }, (_, index) => (
        <span className="skeleton-line" aria-hidden="true" key={index} />
      ))}
    </div>
  );
}
