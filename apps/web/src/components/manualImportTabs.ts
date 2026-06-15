export type ImportMode = "file" | "paste";

export function getNextImportMode(mode: ImportMode, key: string): ImportMode {
  if (key === "Home") return "file";
  if (key === "End") return "paste";
  if (key === "ArrowLeft" || key === "ArrowRight") {
    return mode === "file" ? "paste" : "file";
  }
  return mode;
}
